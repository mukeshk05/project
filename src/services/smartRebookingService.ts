import { OpenAI } from 'openai';
import { searchFlightDeals, searchHotelDeals } from './affiliateApi';
import { format, addMonths, eachDayOfInterval } from 'date-fns';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

interface RebookingSuggestion {
  originalDates: {
    start: Date;
    end: Date;
  };
  suggestedDates: {
    start: Date;
    end: Date;
  };
  priceDifference: number;
  reasoning: string;
  weatherForecast: string;
  localEvents: string[];
  confidence: number;
}

export const findCheaperOptions = async (
  origin: string,
  destination: string,
  originalDates: { start: Date; end: Date },
  budget: number
): Promise<RebookingSuggestion[]> => {
  try {
    // Get price data for the next few months
    const startDate = new Date();
    const endDate = addMonths(startDate, 3);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Get flight and hotel prices for each date
    const priceData = await Promise.all(
      dateRange.map(async (date) => {
        const flightDeals = await searchFlightDeals({
          origin,
          destination,
          departDate: format(date, 'yyyy-MM-dd'),
          returnDate: format(addMonths(date, 1), 'yyyy-MM-dd'),
        });

        const hotelDeals = await searchHotelDeals({
          cityCode: destination,
          checkIn: format(date, 'yyyy-MM-dd'),
          checkOut: format(addMonths(date, 1), 'yyyy-MM-dd'),
        });

        return {
          date,
          flightPrice: flightDeals.data[0]?.price || 0,
          hotelPrice: hotelDeals.data[0]?.price || 0,
        };
      })
    );

    // Use GPT to analyze the data and suggest optimal rebooking dates
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "You are a travel optimization expert. Analyze price data and suggest optimal rebooking dates."
        },
        {
          role: "user",
          content: `Analyze these travel prices and suggest the best dates to rebook for a trip from ${origin} to ${destination}, 
            originally planned for ${format(originalDates.start, 'MMM d, yyyy')} to ${format(originalDates.end, 'MMM d, yyyy')}.
            Price data: ${JSON.stringify(priceData)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // Parse GPT suggestions
    const suggestions = JSON.parse(response.choices[0].message.content);

    return suggestions.map((suggestion: any) => ({
      originalDates,
      suggestedDates: {
        start: new Date(suggestion.startDate),
        end: new Date(suggestion.endDate),
      },
      priceDifference: suggestion.savings,
      reasoning: suggestion.reasoning,
      weatherForecast: suggestion.weather,
      localEvents: suggestion.events,
      confidence: suggestion.confidence,
    }));
  } catch (error) {
    console.error('Error finding cheaper options:', error);
    throw error;
  }
};

export default {
  findCheaperOptions,
};