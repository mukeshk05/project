import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  destinations: [{
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    },
    duration: Number, // in days
  }],
  totalDuration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inclusions: [{
    type: String,
  }],
  exclusions: [{
    type: String,
  }],
  maxParticipants: {
    type: Number,
    required: true,
  },
  startDates: [{
    type: Date,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold_out'],
    default: 'active',
  },
  category: {
    type: String,
    enum: ['luxury', 'budget', 'adventure', 'family', 'honeymoon'],
    required: true,
  },
}, { timestamps: true });

packageSchema.index({ name: 1 });
packageSchema.index({ status: 1 });
packageSchema.index({ category: 1 });
packageSchema.index({ price: 1 });

export default mongoose.model('Package', packageSchema);