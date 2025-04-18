import { OpenAI } from 'openai';
import Parser from 'rss-parser';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const parser = new Parser();

interface TravelNews {
  title: string;
  description: string;
  date: string;
  source: string;
  url: string;
  impact: {
    type: 'price' | 'safety' | 'policy' | 'event';
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendations: string[];
  };
}

export const getTravelNews = async (destinations: string[]): Promise<TravelNews[]> => {
  try {
    // Get news from multiple sources
    const feeds = [
      'https://www.travelpulse.com/rss',
      'https://www.travelweekly.com/rss',
      'https://www.lonelyplanet.com/news/feed',
    ];

    const newsItems = await Promise.all(
      feeds.map(async (feed) => {
        try {
          const feedData = await parser.parseURL(feed);
          return feedData.items.map(item => ({
            title: item.title,
            description: item.contentSnippet,
            date: item.pubDate,
            source: new URL(feed).hostname,
            url: item.link,
          }));
        } catch (error) {
          console.error(`Error fetching feed ${feed}:`, error);
          return [];
        }
      })
    );

    // Filter news relevant to user's destinations
    const relevantNews = newsItems.flat().filter(item =>
      destinations.some(dest =>
        item.title?.toLowerCase().includes(dest.toLowerCase()) ||
        item.description?.toLowerCase().includes(dest.toLowerCase())
      )
    );

    // Use GPT to analyze news impact
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "You are a travel news analyst. Analyze news items and assess their impact on travelers."
        },
        {
          role: "user",
          content: `Analyze these travel news items and their impact on trips to ${destinations.join(', ')}:
            ${JSON.stringify(relevantNews)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analyzedNews = JSON.parse(response.choices[0].message.content);
    return analyzedNews.map((news: any, index: number) => ({
      ...relevantNews[index],
      impact: news.impact,
    }));
  } catch (error) {
    console.error('Error getting travel news:', error);
    throw error;
  }
};

export default {
  getTravelNews,
};