import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();
const VIATOR_API_KEY = process.env.VIATOR_API_KEY;
const BASE_URL = 'https://api.viator.com/partner/v2';

const viatorApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'exp-api-key': VIATOR_API_KEY,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Search destinations
router.get('/destinations/search', authenticateToken, async (req, res) => {
  try {
    const response = await viatorApi.get('/destinations/search', {
      params: req.query,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('Error searching destinations:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error searching destinations',
      error: error.response?.data || error.message 
    });
  }
});

// Get destination details
router.get('/destinations/:id', authenticateToken, async (req, res) => {
  try {
    const response = await viatorApi.get(`/destinations/${req.params.id}`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching destination details:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error fetching destination details',
      error: error.response?.data || error.message 
    });
  }
});

// Get destination products
router.get('/destinations/:id/products', authenticateToken, async (req, res) => {
  try {
    // For development, return mock data since we don't have a real API key
    const mockProducts = {
      data: [
        {
          productId: '1',
          title: 'Caldera Sunset Cruise',
          description: 'Sail around Santorini\'s famous caldera during sunset',
          duration: '5 hours',
          price: {
            amount: 95,
            currencyCode: 'EUR'
          },
          images: [
            {
              url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
              caption: 'Santorini Sunset Cruise'
            }
          ],
          rating: 4.8,
          reviewCount: 324
        },
        {
          productId: '2',
          title: 'Akrotiri Archaeological Site Tour',
          description: 'Explore the ancient ruins of Akrotiri with a professional guide',
          duration: '3 hours',
          price: {
            amount: 45,
            currencyCode: 'EUR'
          },
          images: [
            {
              url: 'https://images.unsplash.com/photo-1571406384350-d2cdb3607475?auto=format&fit=crop&q=80&w=2000',
              caption: 'Akrotiri Archaeological Site'
            }
          ],
          rating: 4.6,
          reviewCount: 156
        }
      ]
    };

    res.json(mockProducts);
  } catch (error: any) {
    console.error('Error fetching destination products:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error fetching destination products',
      error: error.response?.data || error.message 
    });
  }
});

// Get product details
router.get('/products/:id', authenticateToken, async (req, res) => {
  try {
    const response = await viatorApi.get(`/products/${req.params.id}`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching product details:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error fetching product details',
      error: error.response?.data || error.message 
    });
  }
});

// Get product availability
router.get('/products/:id/availability', authenticateToken, async (req, res) => {
  try {
    const response = await viatorApi.get(`/products/${req.params.id}/availability`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching product availability:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error fetching product availability',
      error: error.response?.data || error.message 
    });
  }
});

export default router;