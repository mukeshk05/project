import { OpenAI } from 'openai';

interface UserActivity {
  userId: string;
  type: 'search' | 'view' | 'book' | 'favorite';
  data: {
    destination?: string;
    dates?: {
      start: Date;
      end: Date;
    };
    category?: string;
    price?: number;
    preferences?: string[];
    [key: string]: any;
  };
  timestamp: Date;
}

interface UserPreferences {
  destinations: {
    name: string;
    count: number;
    lastViewed: Date;
  }[];
  categories: {
    name: string;
    count: number;
  }[];
  priceRange: {
    min: number;
    max: number;
    avg: number;
  };
  seasonality: {
    [key: string]: number;
  };
  activities: {
    name: string;
    count: number;
  }[];
}

class UserActivityService {
  private activities: UserActivity[] = [];
  private openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  async trackActivity(activity: UserActivity): Promise<void> {
    try {
      const response = await fetch('http://localhost:5000/api/user-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(activity),
      });

      if (!response.ok) {
        throw new Error('Failed to track activity');
      }

      this.activities.push(activity);
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  }

  async analyzePreferences(userId: string): Promise<UserPreferences> {
    try {
      const response = await fetch(`http://localhost:5000/api/user-activity/preferences/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing user preferences:', error);
      throw error;
    }
  }

  async getSuggestedTrips(userId: string): Promise<any[]> {
    try {
      const preferences = await this.analyzePreferences(userId);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.5-preview-2025-02-27",
        messages: [
          {
            role: "system",
            content: "You are a travel recommendation expert. Generate personalized trip suggestions based on user preferences and activity history."
          },
          {
            role: "user",
            content: `Generate trip suggestions based on these preferences: ${JSON.stringify(preferences)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error getting trip suggestions:', error);
      throw error;
    }
  }

  async getPersonalizedContent(userId: string): Promise<any> {
    try {
      const preferences = await this.analyzePreferences(userId);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4.5-preview-2025-02-27",
        messages: [
          {
            role: "system",
            content: "Generate personalized travel content and recommendations based on user preferences."
          },
          {
            role: "user",
            content: `Create personalized content for a user with these preferences: ${JSON.stringify(preferences)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error getting personalized content:', error);
      throw error;
    }
  }
}

export const userActivityService = new UserActivityService();