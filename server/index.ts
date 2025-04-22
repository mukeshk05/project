import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import chatRoutes from './routes/chat.js';
import notificationRoutes from './routes/notifications.js';
import paymentRoutes from './routes/payments.js';
import invoiceRoutes from './routes/invoices.js';
import adminRoutes from './routes/admin.js';
import travelRoutes from './routes/travel.js';
import activityRoutes from './routes/activities.js';
import searchRoutes from './routes/search.js';
import userActivityRoutes from './routes/userActivity.js';
import User from './models/User.js';
import './config/passport.js';
import geoSuggestions from "./routes/geoSuggestions.js";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/user-activity', userActivityRoutes);
app.use('/api/suggestions', geoSuggestions);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

const createDefaultUser = async () => {
  try {
    // Check if default user exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    if (!existingUser) {
      // Create default user
      const defaultUser = new User({
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'demo123', // This will be hashed by the User model pre-save hook
        provider: 'local'
      });
      await defaultUser.save();
      console.log('Default user created successfully');
      console.log('Default login credentials:');
      console.log('Email: demo@example.com');
      console.log('Password: demo123');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If no MongoDB URI is provided, use in-memory MongoDB
    if (!mongoUri) {
      console.log('No MongoDB URI provided, using in-memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
    }

    await mongoose.connect(mongoUri, mongoOptions);
    console.log('Connected to MongoDB');

    // Create default user after database connection
    await createDefaultUser();

    const PORT = parseInt(process.env.PORT || '5000', 10);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();