import express from 'express';
import PDFDocument from 'pdfkit';
import { authenticateToken } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Generate PDF itinerary
router.get('/:id/pdf', authenticateToken, async (req, res) => {/*
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId')
      .populate({
          path: 'destinationId', // Ensure the field matches your schema
          model: Destination, // Check if this is correctly referencing the Destination model
        });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    // Collect PDF data chunks
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=itinerary-${booking._id}.pdf`,
      });
      res.end(pdfData);
    });

    // Add content to PDF
    doc
      .fontSize(25)
      .text('Travel Itinerary', { align: 'center' })
      .moveDown();

    // Trip Overview
    doc
      .fontSize(16)
      .text('Trip Overview', { underline: true })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Destination: ${booking.destinationId.name}`)
      .text(`Check-in: ${new Date(booking.checkIn).toLocaleDateString()}`)
      .text(`Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`)
      .text(`Travelers: ${booking.travelers}`)
      .moveDown();

    // Flight Details (if available)
    if (booking.flight) {
      doc
        .fontSize(16)
        .text('Flight Details', { underline: true })
        .moveDown()
        .fontSize(12)
        .text(`Airline: ${booking.flight.airline}`)
        .text(`Flight Number: ${booking.flight.flightNumber}`)
        .text(`Departure: ${booking.flight.departure}`)
        .text(`Arrival: ${booking.flight.arrival}`)
        .moveDown();
    }

    // Hotel Details (if available)
    if (booking.hotel) {
      doc
        .fontSize(16)
        .text('Hotel Details', { underline: true })
        .moveDown()
        .fontSize(12)
        .text(`Hotel: ${booking.hotel.name}`)
        .text(`Address: ${booking.hotel.address}`)
        .text(`Check-in Time: ${booking.hotel.checkInTime}`)
        .text(`Check-out Time: ${booking.hotel.checkOutTime}`)
        .moveDown();
    }

    // Travel Tips
    doc
      .fontSize(16)
      .text('Travel Tips', { underline: true })
      .moveDown()
      .fontSize(12)
      .text('• Keep a copy of your passport and travel documents')
      .text('• Save emergency contact numbers')
      .text('• Check local COVID-19 guidelines and requirements')
      .text('• Download offline maps for your destination')
      .moveDown();

    // Important Information
    doc
      .fontSize(16)
      .text('Important Information', { underline: true })
      .moveDown()
      .fontSize(12)
      .text('Emergency Contacts:')
      .text('Local Emergency: 112')
      .text('Embassy Contact: +1-555-0123')
      .text('Travel Insurance: +1-555-0124')
      .moveDown();

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }*/
});

// Share itinerary via email
router.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('userId')
      .populate('destinationId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Generate PDF
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      // Send email with PDF attachment
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
      /*  subject: `Travel Itinerary - ${booking.destinationId.name}`,
        html: `
          <h1>Your Travel Itinerary</h1>
          <p>Please find your travel itinerary attached.</p>
          <p>Trip Details:</p>
          <ul>
            <li>Destination: ${booking.destinationId.name}</li>
            <li>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}</li>
            <li>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</li>
          </ul>
        `,
        attachments: [
          {
            filename: `itinerary-${booking._id}.pdf`,
            content: pdfData,
          },
        ],*/
      });

      res.json({ message: 'Itinerary shared successfully' });
    });

    // Add content to PDF (same as above)
    // ... [Previous PDF generation code] ...

    doc.end();
  } catch (error) {
    console.error('Error sharing itinerary:', error);
    res.status(500).json({ message: 'Error sharing itinerary' });
  }
});

export default router;