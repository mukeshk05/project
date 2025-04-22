import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import axios from 'axios';
import { OpenAI } from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get nearby suggestions
router.post('/nearby', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000, type } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Fetch nearby places from Google Places API
    const params: any = {
      location: `${latitude},${longitude}`,
      radius,
      key: process.env.VITE_GOOGLE_MAPS_API_KEY,
    };

    if (type && type !== 'all') {
      params.type = type;
    }

    // For development, return mock data
    const mockSuggestions = [
      {
        id: '1',
        type: 'attraction',
        name: 'Central Park',
        description: 'Iconic urban park with walking paths, a zoo, and boat rentals.',
        distance: 1.2,
        rating: 4.8,
        price: 1,
        image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&q=80&w=2000',
        openHours: '6:00 AM - 10:00 PM',
        tags: ['park', 'nature', 'walking', 'family-friendly'],
        weather: {
          condition: 'sunny',
          temperature: 24,
          icon: 'sun'
        }
      },
      {
        id: '2',
        type: 'restaurant',
        name: 'The Local Bistro',
        description: 'Cozy restaurant serving seasonal, locally-sourced cuisine.',
        distance: 0.8,
        rating: 4.5,
        price: 3,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000',
        openHours: '11:00 AM - 10:00 PM',
        tags: ['dinner', 'lunch', 'local', 'seasonal']
      },
      {
        id: '3',
        type: 'event',
        name: 'Summer Jazz Festival',
        description: 'Annual jazz festival featuring local and international artists.',
        distance: 2.5,
        rating: 4.7,
        price: 2,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2000',
        tags: ['music', 'festival', 'jazz', 'outdoor']
      },
      {
        id: '4',
        type: 'activity',
        name: 'Kayaking Tour',
        description: 'Guided kayaking tour of the harbor with stunning city views.',
        distance: 3.1,
        rating: 4.9,
        price: 3,
        image: 'https://images.unsplash.com/photo-1472745433479-4556f22e32c2?auto=format&fit=crop&q=80&w=2000',
        openHours: '9:00 AM - 5:00 PM',
        tags: ['water', 'adventure', 'tour', 'outdoor'],
        weather: {
          condition: 'partly cloudy',
          temperature: 22,
          icon: 'cloud-sun'
        }
      }
    ];

    res.json(mockSuggestions);
  } catch (error) {
    console.error('Error fetching nearby suggestions:', error);
    res.status(500).json({ message: 'Error fetching nearby suggestions' });
  }
});

// Get weather data
router.post('/weather', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // For development, return mock data
    const mockWeather = {
      current: {
        condition: 'Sunny',
        temperature: 24,
        humidity: 45,
        windSpeed: 8,
        icon: 'sun'
      },
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000),
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Sunny'][i],
        temperature: {
          min: 18 + Math.floor(Math.random() * 5),
          max: 25 + Math.floor(Math.random() * 5)
        },
        icon: ['sun', 'cloud-sun', 'cloud', 'cloud-rain', 'sun'][i]
      }))
    };

    res.json(mockWeather);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// Get personalized suggestions
router.post('/personalized', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, preferences } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Fetch nearby places
    const mockPlaces = [
      {
        id: '1',
        name: 'Central Park',
        type: 'park',
        location: {
          latitude: latitude + 0.01,
          longitude: longitude - 0.01,
          address: '59th St to 110th St, New York, NY 10022',
        },
        distance: 1.2,
        rating: 4.8,
        priceLevel: 1,
        photos: ['https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&q=80&w=2000'],
        tags: ['park', 'nature', 'walking', 'family-friendly'],
      },
      {
        id: '2',
        name: 'The Local Bistro',
        type: 'restaurant',
        location: {
          latitude: latitude - 0.005,
          longitude: longitude + 0.005,
          address: '123 Main St, New York, NY 10001',
        },
        distance: 0.8,
        rating: 4.5,
        priceLevel: 3,
        photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000'],
        tags: ['dinner', 'lunch', 'local', 'seasonal'],
      },
    ];

    // Use GPT to generate personalized suggestions
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "You are a local travel expert. Analyze nearby places and provide personalized recommendations based on user preferences."
        },
        {
          role: "user",
          content: `Based on these nearby places: ${JSON.stringify(mockPlaces)}, 
            and user preferences: ${preferences.join(', ')},
            provide personalized recommendations.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const suggestions = JSON.parse(response.choices[0].message.content);
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting personalized suggestions:', error);
    res.status(500).json({ message: 'Error getting personalized suggestions' });
  }
});

export default router;