import express from 'express';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Amadeus from 'amadeus';
import { format, addDays, addWeeks, addMonths, nextDay, parse, isValid, startOfWeek, endOfWeek, isFuture, subDays } from 'date-fns';

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

interface TravelQuery {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: {
    adults?: number;
    children?: number;
  };
  budget?: {
    amount: number;
    currency: string;
  };
  preferences?: {
    hotelType?: string[];
    amenities?: string[];
    activities?: string[];
    transportation?: string[];
  };
  flexibility?: number;
}

interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  radius?: number;
  radiusUnit?: 'KM' | 'MILE';
  ratings?: string[];
  amenities?: string[];
  priceRange?: string;
}

const parseTravelQuery = async (message: string): Promise<TravelQuery> => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a travel query parser. Extract structured travel parameters from natural language queries.
            Return only a JSON object with these fields:
            - destination: city name or location
            - checkIn: date expression (e.g., "next weekend", "next Friday")
            - checkOut: date expression (if specified)
            - guests: object with adults and children counts
            - budget: object with amount and currency if mentioned
            - preferences: object containing arrays of:
              - hotelType: ["luxury", "budget", "boutique", etc.]
              - amenities: ["pool", "spa", "wifi", etc.]
              - activities: ["sightseeing", "beach", "hiking", etc.]
              - transportation: ["car", "public", "taxi", etc.]
            - flexibility: number of days flexible around dates (default 0)
            
            For relative dates, keep the original expression for later processing.
            If any field is not mentioned or unclear, omit it from the JSON.`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-4.5-preview-2025-02-27",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    
    // Process dates
    if (parsed.checkIn) {
      const dateRange = parseDateExpression(parsed.checkIn);
      if (dateRange) {
        parsed.checkIn = format(dateRange.start, 'yyyy-MM-dd');
        if (dateRange.end && !parsed.checkOut) {
          parsed.checkOut = format(dateRange.end, 'yyyy-MM-dd');
        }
      }
    }

    if (parsed.checkOut) {
      const dateRange = parseDateExpression(parsed.checkOut);
      if (dateRange) {
        parsed.checkOut = format(dateRange.start, 'yyyy-MM-dd');
      }
    }

    // Parse budget if not already set
    if (!parsed.budget) {
      const budget = parseBudget(message);
      if (budget) {
        parsed.budget = budget;
      }
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing travel query:', error);
    return {};
  }
};

const searchHotels = async (params: HotelSearchParams) => {
  try {
    if (!params.cityCode || !params.checkInDate || !params.checkOutDate) {
      return null;
    }

    // First get hotels in the city
    const cityResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: params.cityCode
    });

    if (!cityResponse.data || cityResponse.data.length === 0) {
      return null;
    }

    // Get hotel offers for the first few hotels
    const hotelIds = cityResponse.data.slice(0, 5).map(hotel => hotel.hotelId);
    const offers = [];

    for (const hotelId of hotelIds) {
      try {
        const response = await amadeus.shopping.hotelOffersSearch.get({
          hotelIds: hotelId,
          adults: params.adults || 1,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate
        });

        if (response.data) {
          offers.push(...response.data);
        }
      } catch (error) {
        console.error(`Error fetching offers for hotel ${hotelId}:`, error);
      }
    }

    return offers;
  } catch (error) {
    console.error('Error searching hotels:', error);
    return null;
  }
};

const formatHotelResults = (hotels: any[], query: TravelQuery) => {
  if (!hotels || !hotels.length) return null;

  const results = hotels.map(hotel => ({
    name: hotel.hotel.name,
    rating: hotel.hotel.rating,
    location: {
      address: hotel.hotel.address,
      coordinates: {
        latitude: hotel.hotel.latitude,
        longitude: hotel.hotel.longitude
      }
    },
    amenities: hotel.hotel.amenities,
    rooms: hotel.offers.map((offer: any) => ({
      type: offer.room.type,
      description: offer.room.description.text,
      price: {
        amount: parseFloat(offer.price.total),
        currency: offer.price.currency
      },
      cancellation: offer.policies?.cancellation
    }))
  }));

  // Add budget analysis if budget was specified
  if (query.budget) {
    const budgetAnalysis = {
      withinBudget: results.some(h => 
        h.rooms.some((r: any) => r.price.amount <= query.budget!.amount)
      ),
      cheapestPrice: Math.min(...results.flatMap(h => 
        h.rooms.map((r: any) => r.price.amount)
      )),
      averagePrice: results.reduce((sum, h) => 
        sum + h.rooms.reduce((roomSum: number, r: any) => roomSum + r.price.amount, 0) / h.rooms.length
      , 0) / results.length
    };
    return { hotels: results, budgetAnalysis };
  }

  return { hotels: results };
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, language } = req.body;
    const userId = req.body.user?._id || 'anonymous';

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

    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    const parsedQuery = await parseTravelQuery(message);
    let hotelResults = null;
    
    if (parsedQuery.destination) {
      const hotels = await searchHotels({
        cityCode: parsedQuery.destination,
        checkInDate: parsedQuery.checkIn || format(addDays(new Date(), 7), 'yyyy-MM-dd'),
        checkOutDate: parsedQuery.checkOut || format(addDays(new Date(), 9), 'yyyy-MM-dd'),
        adults: parsedQuery.guests?.adults || 2
      });

      if (hotels) {
        hotelResults = formatHotelResults(hotels, parsedQuery);
      }
    }

    // Add language context to the system message
    const systemMessage = {
      role: "system",
      content: `You are an expert travel assistant with deep knowledge of global destinations, cultures, and travel planning.
        ${hotelResults ? `\n\nI have found the following hotel options:\n${JSON.stringify(hotelResults, null, 2)}` : ''}
        
        Focus on providing:
        - Personalized travel recommendations based on preferences
        - Hotel suggestions and comparisons
        - Local area insights and attractions
        - Budget-friendly tips and alternatives
        - Transportation options and advice
        - Activity recommendations
        - Safety tips and cultural considerations
        
        If hotel data is available:
        - Analyze and compare hotel options
        - Highlight best value properties
        - Consider location, amenities, and price
        - Suggest optimal room types
        - Note cancellation policies
        - If budget was specified, analyze if options are within budget
        - Suggest alternative dates if cheaper options available
        
        Keep responses friendly, concise, and actionable.
        When discussing hotels, be specific about prices, amenities, and locations.
        Format currency with appropriate symbols (e.g., $, €, £).
        
        The user's preferred language is: ${language || 'English'}`
    };

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-dummy-key') {
      const mockResponse = hotelResults 
        ? `Based on the hotel options I found, here are my recommendations: [Mock hotel recommendations]`
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