import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  caption: String,
  alt: String,
  size: Number,
  format: String,
  duration: Number, // For videos only
  thumbnail: String, // For videos only
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

mediaSchema.index({ destinationId: 1, type: 1 });
mediaSchema.index({ packageId: 1, type: 1 });
mediaSchema.index({ status: 1 });

export default mongoose.model('Media', mediaSchema);