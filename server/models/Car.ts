import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['economy', 'compact', 'midsize', 'suv', 'luxury'],
    required: true,
  },
  location: {
    city: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
  }],
  images: [{
    url: String,
    caption: String,
  }],
  availability: {
    type: Boolean,
    default: true,
  },
  transmission: {
    type: String,
    enum: ['automatic', 'manual'],
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

carSchema.index({ 'location.city': 1 });
carSchema.index({ type: 1 });
carSchema.index({ pricePerDay: 1 });

export default mongoose.model('Car', carSchema);