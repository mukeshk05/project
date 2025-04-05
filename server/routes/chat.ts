import express from 'express';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Use a dummy key if OPENAI_API_KEY is not set (for development)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    console.log(req);
    const userId = req.body.user._id;
    console.log(req.body.user.email);

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

    // If using dummy key, return mock response
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-dummy-key') {
      const mockResponse = "I'm a mock travel assistant. Since this is a development environment without a valid OpenAI API key, I can only provide mock responses. In production, you would receive personalized travel recommendations here.";
      
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