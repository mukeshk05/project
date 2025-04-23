import express from 'express';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Amadeus from 'amadeus';
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  nextDay,
  parse,
  isValid,
  startOfWeek,
  endOfWeek,
  isFuture,
  subDays,
  Day
} from 'date-fns';

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
        Format currency with appropriate symbols (e.g., $, €, £).`
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
        {
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
        Format currency with appropriate symbols (e.g., $, €, £).`
        },
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

const parseDateExpression = (expression: string): { start: Date; end?: Date } | null => {
  // Try to parse as a specific date first
  try {
    const specificDate = parse(expression, 'yyyy-MM-dd', new Date());
    if (isValid(specificDate) && isFuture(specificDate)) {
      return { start: specificDate };
    }
  } catch (error) {
    // Not a specific date, continue with relative date parsing
  }

  const today = new Date();
  const lowerExpression = expression.toLowerCase();

  // Handle "next weekend"
  if (lowerExpression.includes('next weekend')) {
    const nextSaturday = nextDay(today, 6); // 6 is Saturday
    return {
      start: nextSaturday,
      end: addDays(nextSaturday, 2) // Weekend is Saturday to Monday
    };
  }

  // Handle "this weekend"
  if (lowerExpression.includes('this weekend')) {
    const thisSaturday = nextDay(today, 6);
    if (today.getDay() >= 6) { // If today is already Saturday or Sunday
      return {
        start: today,
        end: addDays(startOfWeek(today, { weekStartsOn: 6 }), 2)
      };
    }
    return {
      start: thisSaturday,
      end: addDays(thisSaturday, 2)
    };
  }

  // Handle "next week"
  if (lowerExpression.includes('next week')) {
    const nextWeekStart = addWeeks(startOfWeek(today), 1);
    return {
      start: nextWeekStart,
      end: endOfWeek(nextWeekStart)
    };
  }

  // Handle "next month"
  if (lowerExpression.includes('next month')) {
    const nextMonthStart = addMonths(today, 1);
    return {
      start: nextMonthStart,
      end: addDays(addMonths(nextMonthStart, 1), -1)
    };
  }

  // Handle "tomorrow"
  if (lowerExpression.includes('tomorrow')) {
    const tomorrow = addDays(today, 1);
    return { start: tomorrow };
  }

  // Handle "next [day of week]"
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (lowerExpression.includes(`next ${daysOfWeek[i]}`)) {
      return { start: nextDay(today, i as Day) };
    }
  }

  // Handle "in X days/weeks/months"
  const inDaysMatch = lowerExpression.match(/in (\d+) days?/);
  if (inDaysMatch) {
    return { start: addDays(today, parseInt(inDaysMatch[1])) };
  }

  const inWeeksMatch = lowerExpression.match(/in (\d+) weeks?/);
  if (inWeeksMatch) {
    return { start: addWeeks(today, parseInt(inWeeksMatch[1])) };
  }

  const inMonthsMatch = lowerExpression.match(/in (\d+) months?/);
  if (inMonthsMatch) {
    return { start: addMonths(today, parseInt(inMonthsMatch[1])) };
  }

  return null;
};

const parseBudget = (message: string): { amount: number; currency: string } | null => {
  // Match patterns like "$500", "500 USD", "€300", "300 euros", etc.
  const currencySymbols = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₹': 'INR',
    'USD': 'USD',
    'EUR': 'EUR',
    'GBP': 'GBP',
    'JPY': 'JPY',
    'INR': 'INR',
    'dollars': 'USD',
    'euros': 'EUR',
    'pounds': 'GBP',
    'yen': 'JPY',
    'rupees': 'INR'
  };

  // Match currency symbol/code followed by amount
  const symbolFirstRegex = /([€$£¥₹])(\d+)/g;
  const symbolFirstMatch = [...message.matchAll(symbolFirstRegex)];
  if (symbolFirstMatch.length > 0) {
    const [_, symbol, amount] = symbolFirstMatch[0];
    return {
      amount: parseInt(amount),
      currency: currencySymbols[symbol as keyof typeof currencySymbols] || 'USD'
    };
  }

  // Match amount followed by currency code/name
  const amountFirstRegex = /(\d+)\s*(USD|EUR|GBP|JPY|INR|dollars|euros|pounds|yen|rupees)/gi;
  const amountFirstMatch = [...message.matchAll(amountFirstRegex)];
  if (amountFirstMatch.length > 0) {
    const [_, amount, currency] = amountFirstMatch[0];
    return {
      amount: parseInt(amount),
      currency: currencySymbols[currency.toUpperCase() as keyof typeof currencySymbols] || 'USD'
    };
  }

  // Match just a number with "budget" nearby
  const budgetRegex = /budget.*?(\d+)|(\d+).*?budget/gi;
  const budgetMatch = [...message.matchAll(budgetRegex)];
  if (budgetMatch.length > 0) {
    const amount = budgetMatch[0][1] || budgetMatch[0][2];
    return {
      amount: parseInt(amount),
      currency: 'USD' // Default currency
    };
  }

  return null;
};

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




router.get('/history', async (req: Request, res: Response) => {


});


export default router;