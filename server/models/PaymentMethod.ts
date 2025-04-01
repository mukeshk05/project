import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['card'],
    required: true,
  },
  stripePaymentMethodId: {
    type: String,
    required: true,
  },
  last4: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  expiryMonth: {
    type: Number,
    required: true,
  },
  expiryYear: {
    type: Number,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

paymentMethodSchema.index({ userId: 1 });
paymentMethodSchema.index({ stripePaymentMethodId: 1 });

export default mongoose.model('PaymentMethod', paymentMethodSchema);