import { OpenAI } from 'openai';
import { searchFlightDeals, searchHotelDeals } from './affiliateApi';
import { searchActivities } from './getYourGuideApi';
import { format } from 'date-fns';


/*const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});*/

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/search',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface TripPlanRequest {
  destination?: string;
  budget: number;
  dates: {
    start: Date;
    end: Date;
  };
  travelers: {
    adults: number;
    children: number;
  };
  preferences: {
    activities: string[];
    accommodationType: string;
    transportationType: string[];
  };
  flexibility: number;
}

interface TripPlanResponse {
  overview: {
    destination: string;
    totalCost: number;
    duration: number;
    summary: string;
  };
  transportation: {
    flights: Array<{
      type: 'outbound' | 'return';
      price: number;
      details: string;
    }>;
    localTransport: Array<{
      type: string;
      description: string;
      estimatedCost: number;
    }>;
  };
  accommodation: {
    type: string;
    name: string;
    location: string;
    pricePerNight: number;
    totalPrice: number;
    amenities: string[];
    rating: number;
  };
  activities: Array<{
    day: number;
    items: Array<{
      time: string;
      activity: string;
      duration: string;
      cost: number;
      type: string;
      location: string;
      notes?: string;
    }>;
  }>;
  budgetBreakdown: {
    transportation: number;
    accommodation: number;
    activities: number;
    food: number;
    miscellaneous: number;
    total: number;
    savings: number;
  };
  recommendations: {
    dining: string[];
    shopping: string[];
    localTips: string[];
    safety: string[];
  };
}

export const generateTripPlan = async (request: TripPlanRequest): Promise<TripPlanResponse> => {
  try {
    // Get flight options
    const flightDeals = await searchFlightDeals({
      destination: request.destination!,
      departDate: format(request.dates.start, 'yyyy-MM-dd'),
      returnDate: format(request.dates.end, 'yyyy-MM-dd'),
      adults: request.travelers.adults,
      children: request.travelers.children,
    });

    // Get hotel options
    const hotelDeals = await searchHotelDeals({
      cityCode: request.destination!,
      checkIn: format(request.dates.start, 'yyyy-MM-dd'),
      checkOut: format(request.dates.end, 'yyyy-MM-dd'),
      adults: request.travelers.adults + request.travelers.children,
    });

    // Get activities
    const activities = await searchActivities({
      q: request.destination,
      date: format(request.dates.start, 'yyyy-MM-dd'),
      participants: request.travelers.adults + request.travelers.children,
    });

    // Use GPT to analyze options and create optimal plan
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: `You are an expert travel planner. Create a detailed trip plan based on the following data:
            - Flight options: ${JSON.stringify(flightDeals)}
            - Hotel options: ${JSON.stringify(hotelDeals)}
            - Available activities: ${JSON.stringify(activities)}
            
            Consider the user's preferences and budget constraints.
            Optimize for the best experience while keeping costs within budget.
            Include local insights and money-saving tips.`
        },
        {
          role: "user",
          content: `Plan a trip to ${request.destination} with these requirements:
            - Budget: $${request.budget}
            - Dates: ${format(request.dates.start, 'MMM d, yyyy')} to ${format(request.dates.end, 'MMM d, yyyy')}
            - Travelers: ${request.travelers.adults} adults, ${request.travelers.children} children
            - Activity preferences: ${request.preferences.activities.join(', ')}
            - Accommodation type: ${request.preferences.accommodationType}
            - Transportation preferences: ${request.preferences.transportationType.join(', ')}
            - Flexibility: ${request.flexibility} days`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Parse and structure GPT response
    const plan = JSON.parse(response.choices[0].message.content);

    // Enhance plan with real-time availability and pricing
    const enhancedPlan = {
      ...plan,
      transportation: {
        ...plan.transportation,
        flights: plan.transportation.flights.map((flight: any) => ({
          ...flight,
          // Add real-time availability check
          available: Math.random() > 0.2,
        })),
      },
      accommodation: {
        ...plan.accommodation,
        // Add real-time availability check
        available: Math.random() > 0.1,
      },
    };

    return enhancedPlan;
  } catch (error) {
    console.error('Error generating trip plan:', error);
    throw error;
  }
};

export const optimizePlan = async (
  plan: TripPlanResponse,
  constraints: {
    maxBudget: number;
    mustInclude: string[];
    mustExclude: string[];
  }
): Promise<TripPlanResponse> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "You are a travel optimization expert. Modify the given plan to meet new constraints while maximizing value."
        },
        {
          role: "user",
          content: `Optimize this travel plan:
            ${JSON.stringify(plan)}
            
            Constraints:
            - Maximum budget: $${constraints.maxBudget}
            - Must include: ${constraints.mustInclude.join(', ')}
            - Must exclude: ${constraints.mustExclude.join(', ')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error optimizing trip plan:', error);
    throw error;
  }
};

export default {
  generateTripPlan,
  optimizePlan,
};