import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'issued', 'paid', 'void'],
    default: 'draft',
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    amount: Number,
  }],
  notes: String,
  billingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
}, { timestamps: true });

// Define indexes
invoiceSchema.index({ userId: 1, createdAt: -1 });
invoiceSchema.index({ paymentId: 1 });
invoiceSchema.index({ bookingId: 1 });

export default mongoose.model('Invoice', invoiceSchema);