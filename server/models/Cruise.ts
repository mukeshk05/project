import mongoose from 'mongoose';

const portSchema = new mongoose.Schema({
  name: String,
  city: String,
  country: String,
  arrivalTime: Date,
  departureTime: Date,
  description: String,
});

const cabinSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: String,
  capacity: Number,
  price: Number,
  amenities: [String],
  quantity: Number,
  deck: Number,
});

const cruiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ship: {
    name: String,
    company: String,
    capacity: Number,
    amenities: [String],
    yearBuilt: Number,
  },
  itinerary: {
    startPort: portSchema,
    endPort: portSchema,
    ports: [portSchema],
    duration: Number,
  },
  cabins: [cabinSchema],
  departureDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  images: [{
    url: String,
    caption: String,
  }],
}, { timestamps: true });

cruiseSchema.index({ departureDate: 1 });
cruiseSchema.index({ 'itinerary.startPort.city': 1 });
cruiseSchema.index({ price: 1 });
cruiseSchema.index({ status: 1 });

export default mongoose.model('Cruise', cruiseSchema);