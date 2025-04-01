import express from 'express';
import OpenAI from 'openai';
import { authenticateToken } from '../middleware/auth.js';
import { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is missing');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const userId = (req.user as { userId: string }).userId;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let conversation = await Conversation.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    
    if (!conversation) {
      conversation = new Conversation({
        userId: new mongoose.Types.ObjectId(userId),
        messages: [],
      });
    }

    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert travel assistant with deep knowledge of global destinations, cultures, and travel planning.
            Focus on providing:
            - Personalized travel recommendations based on preferences
            - Detailed itinerary suggestions
            - Local customs and cultural insights
            - Budget-friendly tips and alternatives
            - Safety advice and travel requirements
            - Best times to visit specific locations
            - Local cuisine recommendations
            Keep responses friendly, concise, and actionable.`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
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

router.get('/history', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { userId: string }).userId;
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