import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Flight from '../models/Flight.js';
import Car from '../models/Car.js';
import Hotel from '../models/Hotel.js';
import Cruise from '../models/Cruise.js';
import TravelBooking from '../models/TravelBooking.js';

const router = express.Router();

// Flight Routes
router.get('/flights/search', async (req, res) => {
  try {
    const {
      departureCity,
      arrivalCity,
      departureDate,
      returnDate,
      passengers,
      class: flightClass
    } = req.query;

    const query: any = {
      departureCity,
      arrivalCity,
      departureTime: {
        $gte: new Date(departureDate as string),
        $lt: new Date(new Date(departureDate as string).setDate(new Date(departureDate as string).getDate() + 1))
      },
      availableSeats: { $gte: Number(passengers) || 1 },
    };

    if (flightClass) {
      query.class = flightClass;
    }

    const flights = await Flight.find(query).sort({ departureTime: 1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Error searching flights' });
  }
});

// Car Routes
router.get('/cars/search', async (req, res) => {
  try {
    const { city, type, startDate, endDate, priceRange } = req.query;

    const query: any = {
      'location.city': city,
      availability: true,
    };

    if (type) query.type = type;
    if (priceRange) {
      const [min, max] = (priceRange as string).split('-');
      query.pricePerDay = { $gte: Number(min), $lte: Number(max) };
    }

    const cars = await Car.find(query).sort({ pricePerDay: 1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error searching cars' });
  }
});

// Hotel Routes
router.get('/hotels/search', async (req, res) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      guests,
      priceRange,
      rating
    } = req.query;

    const query: any = {
      'location.city': city,
      status: 'active',
    };

    if (rating) query.rating = { $gte: Number(rating) };
    if (priceRange) {
      const [min, max] = (priceRange as string).split('-');
      query['rooms.pricePerNight'] = { $gte: Number(min), $lte: Number(max) };
    }

    const hotels = await Hotel.find(query).sort({ rating: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error searching hotels' });
  }
});

// Cruise Routes
router.get('/cruises/search', async (req, res) => {
  try {
    const {
      departurePort,
      startDate,
      duration,
      priceRange
    } = req.query;

    const query: any = {
      'itinerary.startPort.city': departurePort,
      status: 'scheduled',
    };

    if (duration) {
      query['itinerary.duration'] = Number(duration);
    }

    if (startDate) {
      query.departureDate = {
        $gte: new Date(startDate as string),
      };
    }

    if (priceRange) {
      const [min, max] = (priceRange as string).split('-');
      query.price = { $gte: Number(min), $lte: Number(max) };
    }

    const cruises = await Cruise.find(query).sort({ departureDate: 1 });
    res.json(cruises);
  } catch (error) {
    res.status(500).json({ message: 'Error searching cruises' });
  }
});

// Booking Routes
router.post('/bookings', authenticateToken, async (req, res) => {
  try {
    const {
      type,
      referenceId,
      passengers,
      dates,
      totalPrice,
      specialRequests
    } = req.body;

    const userId = (req.user as { userId: string }).userId;

    const booking = new TravelBooking({
      userId,
      type,
      referenceId,
      passengers,
      dates,
      totalPrice,
      specialRequests,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});

router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string }).userId;
    const bookings = await TravelBooking.find({ userId })
      .populate('referenceId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

router.patch('/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const userId = (req.user as { userId: string }).userId;
    const booking = await TravelBooking.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
        status: { $ne: 'cancelled' }
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already cancelled' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

export default router;