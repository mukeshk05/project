import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();
const GYG_API_KEY = process.env.GYG_API_KEY;
const BASE_URL = 'https://api.getyourguide.com/1';

// Mock data for development
const mockActivities = {
  data: [
    {
      id: '1',
      title: 'Santorini Sunset Cruise',
      abstract: 'Experience the magic of Santorini\'s sunset from the water',
      description: 'Sail around the caldera, visit hot springs, swim, and enjoy a BBQ dinner',
      duration: '5 hours',
      price: {
        amount: 89,
        currency: 'EUR'
      },
      images: [
        {
          original: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=2000',
          thumbnail: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=500'
        }
      ],
      rating: {
        average: 4.8,
        count: 256
      }
    },
    {
      id: '2',
      title: 'Wine Tasting Tour',
      abstract: 'Discover Santorini\'s unique volcanic wines',
      description: 'Visit 3 traditional wineries and taste 12 different wines',
      duration: '4 hours',
      price: {
        amount: 65,
        currency: 'EUR'
      },
      images: [
        {
          original: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=2000',
          thumbnail: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=500'
        }
      ],
      rating: {
        average: 4.7,
        count: 189
      }
    }
  ]
};

// Get destination activities
router.get('/destinations/:id/activities', async (req, res) => {
  try {
    console.log(`Fetching activities for destination ${req.params.id}`);
    
    // Always return mock data for development
    res.json(mockActivities);
  } catch (error: any) {
    console.error('Error fetching destination activities:', error);
    res.status(500).json({ 
      message: 'Error fetching destination activities',
      error: error.message 
    });
  }
});

export default router;