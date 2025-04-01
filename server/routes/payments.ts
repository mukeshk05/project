import express from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth.js';
import Payment from '../models/Payment.js';
import PaymentMethod from '../models/PaymentMethod.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create payment intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { bookingId, paymentMethodId } = req.body;
    const userId = (req.user as { userId: string }).userId;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/payment/confirm`,
    });

    const payment = new Payment({
      userId,
      bookingId: booking._id,
      amount: booking.totalPrice,
      currency: 'usd',
      status: 'pending',
      paymentMethod: paymentMethodId,
      paymentIntentId: paymentIntent.id,
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// Add payment method
router.post('/methods', authenticateToken, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = (req.user as { userId: string }).userId;

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    if (paymentMethod.type !== 'card') {
      return res.status(400).json({ message: 'Invalid payment method type' });
    }

    const existingMethods = await PaymentMethod.countDocuments({
      userId,
    });

    const newPaymentMethod = new PaymentMethod({
      userId,
      type: paymentMethod.type,
      stripePaymentMethodId: paymentMethod.id,
      last4: paymentMethod.card?.last4,
      brand: paymentMethod.card?.brand,
      expiryMonth: paymentMethod.card?.exp_month,
      expiryYear: paymentMethod.card?.exp_year,
      isDefault: existingMethods === 0, // Make default if first card
    });

    await newPaymentMethod.save();

    res.status(201).json(newPaymentMethod);
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ message: 'Error adding payment method' });
  }
});

// Get user's payment methods
router.get('/methods', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string }).userId;
    const paymentMethods = await PaymentMethod.find({
      userId,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment methods' });
  }
});

// Set default payment method
router.patch('/methods/:id/default', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as { userId: string }).userId;

    // Remove default from all other payment methods
    await PaymentMethod.updateMany(
      { userId },
      { isDefault: false }
    );

    // Set new default
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      { isDefault: true },
      { new: true }
    );

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error updating default payment method' });
  }
});

// Delete payment method
router.delete('/methods/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as { userId: string }).userId;

    const paymentMethod = await PaymentMethod.findOne({
      _id: id,
      userId,
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Delete from Stripe
    await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);

    // Delete from database
    await paymentMethod.deleteOne();

    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment method' });
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string }).userId;
    const payments = await Payment.find({
      userId,
    })
    .populate('bookingId')
    .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

// Request refund
router.post('/:id/refund', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as { userId: string }).userId;

    const payment = await Payment.findOne({
      _id: id,
      userId,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment cannot be refunded' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentIntentId,
    });

    payment.status = 'refunded';
    payment.refundId = refund.id;
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error processing refund' });
  }
});

export default router;