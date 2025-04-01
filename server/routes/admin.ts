import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import Admin, { IAdmin } from '../models/Admin.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Offer from '../models/Offer.js';
import Tax from '../models/Tax.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Media from '../models/Media.js';

const router = express.Router();

// Admin Authentication
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email }) as IAdmin;
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Destinations Management
router.post('/destinations', authenticateToken, async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Error creating destination' });
  }
});

router.get('/destinations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, status } = req.query;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search as string, 'i') },
        { 'location.country': new RegExp(search as string, 'i') },
        { 'location.city': new RegExp(search as string, 'i') },
      ];
    }
    if (type) query.type = type;
    if (status) query.status = status;

    const destinations = await Destination.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destinations' });
  }
});

// Packages Management
router.post('/packages', authenticateToken, async (req, res) => {
  try {
    const travelPackage = new Package(req.body);
    await travelPackage.save();
    res.status(201).json(travelPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating package' });
  }
});

router.get('/packages', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    
    const query: any = {};
    if (search) {
      query.name = new RegExp(search as string, 'i');
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const packages = await Package.find(query)
      .populate('destinations.destinationId')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Package.countDocuments(query);

    res.json({
      packages,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages' });
  }
});

// Offers Management
router.post('/offers', authenticateToken, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating offer' });
  }
});

router.get('/offers', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query: any = {};
    if (status) query.status = status;

    const offers = await Offer.find(query)
      .populate('applicableTo.destinations')
      .populate('applicableTo.packages')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Offer.countDocuments(query);

    res.json({
      offers,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers' });
  }
});

// Tax Management
router.post('/taxes', authenticateToken, async (req, res) => {
  try {
    const tax = new Tax(req.body);
    await tax.save();
    res.status(201).json(tax);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tax' });
  }
});

router.get('/taxes', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, country, status } = req.query;
    
    const query: any = {};
    if (country) query.country = country;
    if (status) query.status = status;

    const taxes = await Tax.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Tax.countDocuments(query);

    res.json({
      taxes,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching taxes' });
  }
});

// Booking Management
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    const query: any = {};
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const bookings = await Booking.find(query)
      .populate('userId')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// User Management
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') },
      ];
    }

    const users = await User.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Media Management
router.post('/media', authenticateToken, async (req, res) => {
  try {
    const media = new Media(req.body);
    await media.save();

    // Update destination or package with new media
    if (media.destinationId) {
      await Destination.findByIdAndUpdate(media.destinationId, {
        $push: { images: { url: media.url, caption: media.caption } }
      });
    } else if (media.packageId) {
      await Package.findByIdAndUpdate(media.packageId, {
        $push: { media: media._id }
      });
    }

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: 'Error creating media' });
  }
});

router.get('/media', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, destinationId, packageId } = req.query;
    
    const query: any = {};
    if (type) query.type = type;
    if (destinationId) query.destinationId = destinationId;
    if (packageId) query.packageId = packageId;

    const media = await Media.find(query)
      .populate('destinationId')
      .populate('packageId')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ order: 1, createdAt: -1 });

    const total = await Media.countDocuments(query);

    res.json({
      media,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media' });
  }
});

router.patch('/media/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const media = await Media.findByIdAndUpdate(id, updates, { new: true });
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ message: 'Error updating media' });
  }
});

router.delete('/media/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Remove media reference from destination or package
    if (media.destinationId) {
      await Destination.findByIdAndUpdate(media.destinationId, {
        $pull: { images: { url: media.url } }
      });
    } else if (media.packageId) {
      await Package.findByIdAndUpdate(media.packageId, {
        $pull: { media: media._id }
      });
    }

    await media.deleteOne();
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting media' });
  }
});

router.patch('/media/reorder', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;

    // Update order for each media item
    await Promise.all(
      items.map((item: { id: string; order: number }) =>
        Media.findByIdAndUpdate(item.id, { order: item.order })
      )
    );

    res.json({ message: 'Media reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering media' });
  }
});

export default router;