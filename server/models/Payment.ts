import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  refundId: {
    type: String,
  },
  metadata: {
    type: Map,
    of: String,
  },
}, { timestamps: true });

// Indexes for efficient querying
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ paymentIntentId: 1 });

export default mongoose.model('Payment', paymentSchema);