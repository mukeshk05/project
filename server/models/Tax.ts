import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: String,
  applicableTo: {
    type: String,
    enum: ['all', 'destinations', 'packages'],
    default: 'all',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

taxSchema.index({ country: 1, state: 1 });
taxSchema.index({ status: 1 });

export default mongoose.model('Tax', taxSchema);