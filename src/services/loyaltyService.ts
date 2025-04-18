import { OpenAI } from 'openai';

interface PointsActivity {
  userId: string;
  type: 'booking' | 'review' | 'referral' | 'engagement';
  points: number;
  description: string;
  timestamp: Date;
}

interface UserLevel {
  name: string;
  requiredPoints: number;
  benefits: string[];
}

const LEVELS: UserLevel[] = [
  {
    name: 'Explorer',
    requiredPoints: 0,
    benefits: ['Basic rewards', 'Newsletter access'],
  },
  {
    name: 'Adventurer',
    requiredPoints: 1000,
    benefits: ['5% discount on bookings', 'Priority support', 'Early access to deals'],
  },
  {
    name: 'Voyager',
    requiredPoints: 5000,
    benefits: ['10% discount on bookings', 'Free upgrades', 'Exclusive events'],
  },
  {
    name: 'Elite',
    requiredPoints: 10000,
    benefits: ['15% discount on bookings', 'Personal travel concierge', 'VIP perks'],
  },
];

const POINTS_RULES = {
  booking: {
    base: 100,
    perDollar: 0.1,
  },
  review: 50,
  referral: 200,
  engagement: 10,
};

class LoyaltyService {
  private activities: PointsActivity[] = [];
  private openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  async addPoints(activity: PointsActivity): Promise<void> {
    try {
      const response = await fetch('http://localhost:5000/api/loyalty/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(activity),
      });

      if (!response.ok) {
        throw new Error('Failed to add points');
      }

      this.activities.push(activity);
    } catch (error) {
      console.error('Error adding points:', error);
    }
  }

  async getUserLevel(userId: string): Promise<UserLevel> {
    try {
      const response = await fetch(`http://localhost:5000/api/loyalty/level/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user level');
      }

      const { totalPoints } = await response.json();
      return LEVELS.reduce((highest, level) => 
        totalPoints >= level.requiredPoints ? level : highest
      );
    } catch (error) {
      console.error('Error getting user level:', error);
      return LEVELS[0]; // Return base level on error
    }
  }

  async getPersonalizedChallenges(userId: string): Promise<any[]> {
    try {
      const userActivity = await fetch(`http://localhost:5000/api/user-activity/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => res.json());

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.5-preview-2025-02-27",
        messages: [
          {
            role: "system",
            content: "Generate personalized travel challenges based on user activity and preferences."
          },
          {
            role: "user",
            content: `Create engaging challenges for a user with this activity history: ${JSON.stringify(userActivity)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error getting personalized challenges:', error);
      return [];
    }
  }
}

export const loyaltyService = new LoyaltyService();