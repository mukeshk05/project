import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    const notifications = await Notification.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: new mongoose.Types.ObjectId(userId),
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Mark all notifications as read
router.post('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    await Notification.updateMany(
      { userId: new mongoose.Types.ObjectId(userId) },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
});

export default router;