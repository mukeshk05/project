import mongoose from 'mongoose';


const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['search', 'view', 'book', 'favorite'],
    required: true,
  },
  data: {
    destination: String,
    dates: {
      start: Date,
      end: Date,
    },
    category: String,
    price: Number,
    preferences: [String],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ userId: 1, type: 1 });
userActivitySchema.index({ 'data.destination': 1 });
userActivitySchema.index({ 'data.category': 1 });

export default mongoose.model('UserActivity', userActivitySchema);