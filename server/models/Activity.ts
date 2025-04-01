import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true,
  },
  category: {
    type: String,
    enum: ['sightseeing', 'adventure', 'culture', 'food', 'nature', 'nightlife'],
    required: true,
  },
  duration: {
    type: Number, // in hours
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{
    url: String,
    caption: String,
  }],
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  schedule: {
    openingHours: String,
    closingHours: String,
    daysOpen: [String], // ['Monday', 'Tuesday', etc.]
  },
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
  included: [{
    type: String,
  }],
  notIncluded: [{
    type: String,
  }],
  requirements: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'seasonal'],
    default: 'active',
  },
}, { timestamps: true });

activitySchema.index({ destinationId: 1, category: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ price: 1 });
activitySchema.index({ rating: -1 });

export default mongoose.model('Activity', activitySchema);