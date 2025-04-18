import { OpenAI } from 'openai';
import { format, addMonths, eachMonthOfInterval } from 'date-fns';
import { searchFlightDeals } from './affiliateApi';
import Parser from 'rss-parser';
import weather from 'weather-js';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const parser = new Parser();

interface SeasonalSuggestion {
  destination: string;
  bestMonths: string[];
  weather: {
    temperature: string;
    conditions: string;
  };
  events: {
    name: string;
    date: string;
    description: string;
  }[];
  pricing: {
    peakSeason: string[];
    offSeason: string[];
    shoulderSeason: string[];
    estimatedSavings: number;
  };
  activities: string[];
  localTips: string[];
  confidence: number;
}

export const getSeasonalSuggestions = async (
  destination: string,
  preferences: string[]
): Promise<SeasonalSuggestion[]> => {
  try {
    // Get weather forecast for the next 12 months
    const weatherData = await new Promise((resolve, reject) => {
      weather.find({ search: destination, degreeType: 'C' }, (err: any, result: any) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    // Get flight price trends
    const startDate = new Date();
    const endDate = addMonths(startDate, 12);
    const monthRange = eachMonthOfInterval({ start: startDate, end: endDate });

    const priceData = await Promise.all(
      monthRange.map(async (date) => {
        const deals = await searchFlightDeals({
          destination,
          departDate: format(date, 'yyyy-MM-dd'),
        });
        return {
          month: format(date, 'MMMM'),
          avgPrice: deals.data.reduce((sum: number, deal: any) => sum + deal.price, 0) / deals.data.length,
        };
      })
    );

    // Get local events and festivals
    const events = await getLocalEvents(destination);

    // Use GPT to analyze data and generate suggestions
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "You are a seasonal travel planning expert. Analyze weather, pricing, and event data to suggest optimal travel times."
        },
        {
          role: "user",
          content: `Create seasonal travel suggestions for ${destination} based on:
            Weather data: ${JSON.stringify(weatherData)}
            Price trends: ${JSON.stringify(priceData)}
            Local events: ${JSON.stringify(events)}
            User preferences: ${preferences.join(', ')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error getting seasonal suggestions:', error);
    throw error;
  }
};

const getLocalEvents = async (destination: string) => {
  try {
    // Use RSS feeds to get local events
    const feeds = [
      `https://www.eventbrite.com/d/${destination}/all-events/?format=rss`,
      `https://www.timeout.com/${destination}/events/feed`,
    ];

    const events = await Promise.all(
      feeds.map(async (feed) => {
        try {
          const feedData = await parser.parseURL(feed);
          return feedData.items.map(item => ({
            name: item.title,
            date: item.pubDate,
            description: item.contentSnippet,
          }));
        } catch (error) {
          console.error(`Error fetching feed ${feed}:`, error);
          return [];
        }
      })
    );

    return events.flat();
  } catch (error) {
    console.error('Error getting local events:', error);
    return [];
  }
};

export default {
  getSeasonalSuggestions,
};