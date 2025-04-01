import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  images: [{
    url: String,
    caption: String,
  }],
  basePrice: {
    type: Number,
    required: true,
  },
  amenities: [{
    type: String,
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  type: {
    type: String,
    enum: ['beach', 'mountain', 'city', 'countryside', 'island'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
}, { timestamps: true });

destinationSchema.index({ name: 1 });
destinationSchema.index({ 'location.country': 1, 'location.city': 1 });
destinationSchema.index({ type: 1 });
destinationSchema.index({ status: 1 });

export default mongoose.model('Destination', destinationSchema);