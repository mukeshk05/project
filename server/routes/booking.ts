import express, { Request, Response } from 'express';
import Booking from '../models/Booking.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { destinationId, checkIn, checkOut, travelers, totalPrice } = req.body;
    const userId = (req.user as { userId: string })?.userId;
    
    const booking = new Booking({
      userId,
      destinationId,
      checkIn,
      checkOut,
      travelers,
      totalPrice,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;