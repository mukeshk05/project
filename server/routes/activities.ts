import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Get activities for a destination
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const { category, priceRange, duration } = req.query;
    const query: any = {
      destinationId: req.params.destinationId,
      status: 'active',
    };

    if (category) {
      query.category = category;
    }

    if (priceRange) {
      const [min, max] = (priceRange as string).split('-');
      query.price = { $gte: Number(min), $lte: Number(max) };
    }

    if (duration) {
      query.duration = { $lte: Number(duration) };
    }

    const activities = await Activity.find(query)
      .sort({ rating: -1 })
      .populate('reviews.userId', 'name avatar');

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Get activity details
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('reviews.userId', 'name avatar');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity' });
  }
});

// Add review to activity
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = (req.user as { userId: string }).userId;

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Add the new review
    activity.reviews.push({
      userId,
      rating: rating || 0, // Provide default value if rating is undefined
      comment,
      date: new Date(),
    });

    // Calculate average rating, handling potential null/undefined values
    const validRatings = activity.reviews
      .map(review => review.rating)
      .filter((rating): rating is number => rating !== null && rating !== undefined);

    const totalRating = validRatings.reduce((sum, rating) => sum + rating, 0);
    activity.rating = validRatings.length > 0 ? totalRating / validRatings.length : 0;

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

export default router;