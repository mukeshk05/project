import express from 'express';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Amadeus from 'amadeus';

dotenv.config();

const router = express.Router();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.VITE_AMADEUS_CLIENT_ID,
  clientSecret: process.env.VITE_AMADEUS_CLIENT_SECRET
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
});

// Helper function to extract flight-related information from user message
const extractFlightInfo = (message: string) => {
  const originMatch = message.match(/from\s+([A-Z]{3})/i);
  const destinationMatch = message.match(/to\s+([A-Z]{3})/i);
  const dateMatch = message.match(/(\d{4}-\d{2}-\d{2})/);

  return {
    origin: originMatch?.[1]?.toUpperCase(),
    destination: destinationMatch?.[1]?.toUpperCase(),
    date: dateMatch?.[1]
  };
};

// Helper function to format flight data for GPT
const formatFlightDataForGPT = (flights: any[]) => {
  return flights.map(flight => ({
    carrier: flight.itineraries[0].segments[0].carrierCode,
    flightNumber: flight.itineraries[0].segments[0].number,
    departure: flight.itineraries[0].segments[0].departure,
    arrival: flight.itineraries[0].segments[0].arrival,
    duration: flight.itineraries[0].duration,
    price: flight.price,
    numberOfStops: flight.itineraries[0].segments.length - 1
  }));
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.body.user._id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let conversation = await Conversation.findOne({
      userId: userId !== 'anonymous' ? new mongoose.Types.ObjectId(userId) : 'anonymous'
    });

    if (!conversation) {
      conversation = new Conversation({
        userId: userId !== 'anonymous' ? new mongoose.Types.ObjectId(userId) : 'anonymous',
        messages: [],
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Extract flight information if present
    const flightInfo = extractFlightInfo(message);
    let flightData = null;

    // If flight information is present, fetch from Amadeus
    if (flightInfo.origin && flightInfo.destination && flightInfo.date) {
      try {
        const response = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: flightInfo.origin,
          destinationLocationCode: flightInfo.destination,
          departureDate: flightInfo.date,
          adults: '1',
          max: '5'
        });
        flightData = formatFlightDataForGPT(response.data);
      } catch (error) {
        console.error('Amadeus API error:', error);
      }
    }

    // Prepare system message with flight data context
    const systemMessage = {
      role: "system",
      content: `You are an expert travel assistant with deep knowledge of global destinations, cultures, and travel planning.
        ${flightData ? `\n\nI have found the following flight options:\n${JSON.stringify(flightData, null, 2)}` : ''}
        
        Focus on providing:
        - Personalized travel recommendations based on preferences
        - Detailed itinerary suggestions
        - Local customs and cultural insights
        - Budget-friendly tips and alternatives
        - Safety advice and travel requirements
        - Best times to visit specific locations
        - Local cuisine recommendations
        
        If flight data is available, analyze and summarize the options, highlighting:
        - Best value flights
        - Fastest routes
        - Most convenient times
        - Price comparisons
        
        Keep responses friendly, concise, and actionable.`
    };

    // If using dummy key, return mock response
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-dummy-key') {
      const mockResponse = flightData
          ? `Based on the flight options I found, here are my recommendations: [Mock flight recommendations]`
          : "I'm a mock travel assistant. Since this is a development environment without a valid OpenAI API key, I can only provide mock responses.";

      conversation.messages.push({
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
      });

      await conversation.save();
      return res.json({ response: mockResponse });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        systemMessage,
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-4.5-preview-2025-02-27",
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    });

    await conversation.save();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
});

router.get('/history', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { userId: string })?.userId;
    if (!userId) {
      return res.json({ messages: [] });
    }

    const conversation = await Conversation.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!conversation) {
      return res.json({ messages: [] });
    }

    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

export default router;