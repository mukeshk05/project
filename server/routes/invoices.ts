import express from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { authenticateToken } from '../middleware/auth.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { Readable } from 'stream';

interface PopulatedBooking {
  _id: string;
  destinationId: string;
  checkIn: string;
  checkOut: string;
}

const router = express.Router();

// Generate invoice number
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const count = await Invoice.countDocuments({
    createdAt: {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    },
  });
  return `INV-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
};

// Create invoice
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { paymentId, notes, billingAddress } = req.body;
    const userId = (req.user as { userId: string })?.userId;

    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
    }).populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const invoiceNumber = await generateInvoiceNumber();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days due date

    const tax = payment.amount * 0.1; // 10% tax
    const total = payment.amount + tax;

    const invoice = new Invoice({
      userId,
      paymentId: payment._id,
      bookingId: payment.bookingId._id,
      invoiceNumber,
      dueDate,
      subtotal: payment.amount,
      tax,
      total,
      status: payment.status === 'completed' ? 'paid' : 'issued',
      items: [{
        description: `Booking for ${(payment.bookingId as unknown as PopulatedBooking).destinationId}`,
        quantity: 1,
        unitPrice: payment.amount,
        amount: payment.amount,
      }],
      notes,
      billingAddress,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ message: 'Error creating invoice' });
  }
});

// Get user's invoices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    const invoices = await Invoice.find({
      userId,
    })
    .populate('paymentId')
    .populate('bookingId')
    .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Get invoice by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId,
    })
    .populate('paymentId')
    .populate('bookingId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice' });
  }
});

// Download invoice PDF
router.get('/:id/pdf', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId,
    })
    .populate('paymentId')
    .populate('bookingId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(
      `${process.env.FRONTEND_URL}/invoices/${invoice._id}`
    );

    // Create PDF
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    // Collect PDF data chunks
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
      });
      res.end(pdfData);
    });

    // Add content to PDF
    doc
      .fontSize(25)
      .text('Invoice', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Invoice Number: ${invoice.invoiceNumber}`)
      .text(`Date: ${new Date(invoice.issuedDate).toLocaleDateString()}`)
      .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`)
      .moveDown();

    // Add billing address if it exists
    if (invoice.billingAddress) {
      doc
        .text('Billing Address:')
        .text(invoice.billingAddress.name || 'N/A')
        .text(invoice.billingAddress.address || 'N/A')
        .text(`${invoice.billingAddress.city || 'N/A'}, ${invoice.billingAddress.state || 'N/A'}`)
        .text(`${invoice.billingAddress.country || 'N/A'} ${invoice.billingAddress.postalCode || 'N/A'}`)
        .moveDown();
    }

    // Add items table
    doc
      .text('Items:')
      .moveDown();

    invoice.items.forEach(item => {
      doc
        .text(`${item.description}`)
        .text(`Quantity: ${item.quantity}`)
        .text(`Unit Price: $${(item.unitPrice ?? 0).toFixed(2)}`)
        .text(`Amount: $${(item.amount ?? 0).toFixed(2)}`)
        .moveDown();
    });

    // Add totals
    doc
      .text(`Subtotal: $${invoice.subtotal.toFixed(2)}`)
      .text(`Tax: $${invoice.tax.toFixed(2)}`)
      .text(`Total: $${invoice.total.toFixed(2)}`)
      .moveDown();

    // Add QR code
    doc.image(qrCodeData, {
      fit: [100, 100],
      align: 'right',
    });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

// Void invoice
router.patch('/:id/void', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
        status: { $ne: 'void' },
      },
      { status: 'void' },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found or already void' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error voiding invoice' });
  }
});

export default router;