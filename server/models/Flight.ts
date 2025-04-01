import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  departureCity: {
    type: String,
    required: true,
  },
  arrivalCity: {
    type: String,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first'],
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled'],
    default: 'scheduled',
  },
}, { timestamps: true });

flightSchema.index({ departureCity: 1, arrivalCity: 1 });
flightSchema.index({ departureTime: 1 });
flightSchema.index({ airline: 1 });

export default mongoose.model('Flight', flightSchema);