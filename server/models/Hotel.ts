import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: String,
  capacity: {
    type: Number,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  amenities: [{
    type: String,
  }],
  images: [{
    url: String,
    caption: String,
  }],
  quantity: {
    type: Number,
    required: true,
  },
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  amenities: [{
    type: String,
  }],
  images: [{
    url: String,
    caption: String,
  }],
  rooms: [roomSchema],
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
}, { timestamps: true });

hotelSchema.index({ 'location.city': 1, 'location.country': 1 });
hotelSchema.index({ rating: 1 });
hotelSchema.index({ status: 1 });

export default mongoose.model('Hotel', hotelSchema);