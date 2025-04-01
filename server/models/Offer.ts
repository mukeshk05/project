import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  minBookingAmount: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
  },
  usageLimit: {
    type: Number,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  applicableTo: {
    destinations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    }],
    packages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    }],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
  },
}, { timestamps: true });

// Define indexes
offerSchema.index({ status: 1 });
offerSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model('Offer', offerSchema);