import mongoose from 'mongoose';

const travelBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['flight', 'car', 'hotel', 'cruise'],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  passengers: [{
    name: String,
    age: Number,
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
    },
  }],
  dates: {
    start: Date,
    end: Date,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  specialRequests: String,
}, { timestamps: true });

travelBookingSchema.index({ userId: 1, createdAt: -1 });
travelBookingSchema.index({ type: 1 });
travelBookingSchema.index({ status: 1 });

export default mongoose.model('TravelBooking', travelBookingSchema);