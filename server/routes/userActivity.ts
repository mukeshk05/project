import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import UserActivity from '../models/UserActivity.js';
import OpenAI from 'openai';
import mongoose from "mongoose";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Track user activity
router.post('/', authenticateToken, async (req, res) => {
  try {
    const activity = new UserActivity({
      userId: req.user,
      ...req.body,
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ message: 'Error tracking activity' });
  }
});

// Get user preferences
router.get('/preferences/:userId', authenticateToken, async (req, res) => {
  try {
    const activities = await UserActivity.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(100);

    // Analyze activities to generate preferences
    const destinations = {};
    const categories = {};
    const prices = [];
    const seasons = {};
    const activities_list = {};

    activities.forEach(activity => {
      if (activity.data.destination) {
        destinations[activity.data.destination] = (destinations[activity.data.destination] || 0) + 1;
      }
      if (activity.data.category) {
        categories[activity.data.category] = (categories[activity.data.category] || 0) + 1;
      }
      if (activity.data.price) {
        prices.push(activity.data.price);
      }
      if (activity.data.dates?.start) {
        const month = new Date(activity.data.dates.start).getMonth();
        seasons[month] = (seasons[month] || 0) + 1;
      }
      if (activity.data.preferences) {
        activity.data.preferences.forEach(pref => {
          activities_list[pref] = (activities_list[pref] || 0) + 1;
        });
      }
    });

    const preferences = {
      destinations: Object.entries(destinations).map(([name, count]) => ({
        name,
        count,
        lastViewed: activities.find(a => a.data.destination === name)?.timestamp,
      })),
      categories: Object.entries(categories).map(([name, count]) => ({
        name,
        count,
      })),
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((a, b) => a + b, 0) / prices.length,
      },
      seasonality: seasons,
      activities: Object.entries(activities_list).map(([name, count]) => ({
        name,
        count,
      })),
    };

    res.json(preferences);
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ message: 'Error getting preferences' });
  }
});

// Get personalized recommendations
router.get('/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    const preferences = await UserActivity.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: null,
          destinations: { $addToSet: '$data.destination' },
          categories: { $addToSet: '$data.category' },
          avgPrice: { $avg: '$data.price' },
          preferences: { $addToSet: '$data.preferences' },
        }
      }
    ]);

    if (!preferences.length) {
      return res.json([]);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "Generate personalized travel recommendations based on user preferences and history."
        },
        {
          role: "user",
          content: `Generate travel recommendations for a user with these preferences: ${JSON.stringify(preferences[0])}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const recommendations = JSON.parse(<string>response.choices[0].message.content);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

export default router;