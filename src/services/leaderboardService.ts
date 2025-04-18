import { OpenAI } from 'openai';
import { loyaltyService } from './loyaltyService';

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  points: number;
  level: string;
  achievements: string[];
  rank: number;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  totalPoints: number;
  achievements: string[];
  createdAt: Date;
}

class LeaderboardService {
  private openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  async getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch('http://localhost:5000/api/leaderboard/global', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      throw error;
    }
  }

  async getGroupLeaderboard(groupId: string): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`http://localhost:5000/api/leaderboard/group/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch group leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error fetching group leaderboard:', error);
      throw error;
    }
  }

  async createGroup(name: string, members: string[]): Promise<Group> {
    try {
      const response = await fetch('http://localhost:5000/api/leaderboard/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, members }),
      });

      if (!response.ok) throw new Error('Failed to create group');
      return await response.json();
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  async exportRewardHistory(userId: string, format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      const response = await fetch(
        `http://localhost:5000/api/loyalty/history/${userId}?format=${format}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to export reward history');
      return await response.blob();
    } catch (error) {
      console.error('Error exporting reward history:', error);
      throw error;
    }
  }

  async getAdaptiveRecommendations(userId: string, level: number): Promise<any> {
    try {
      const userHistory = await loyaltyService.getPointsHistory(userId);
      const userLevel = await loyaltyService.getUserLevel(userId);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.5-preview-2025-02-27",
        messages: [
          {
            role: "system",
            content: `You are an adaptive travel AI assistant. Adjust recommendations based on user level ${level} and history.`
          },
          {
            role: "user",
            content: `Generate personalized recommendations for a level ${level} user with this history: ${JSON.stringify(userHistory)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error getting adaptive recommendations:', error);
      throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService();