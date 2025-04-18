import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, MessageSquare, Send, Loader, Star, Calendar,
  MapPin, DollarSign, Compass, Briefcase, Sun, Umbrella,
  Coffee, Utensils, Camera, Music, Download, Share2
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}

interface TravelPlan {
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  budget: number;
  activities: string[];
  recommendations: string[];
}

const TravelAICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TravelPlan | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }]);

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Simulate typing effect
      const words = data.response.split(' ');
      let currentResponse = '';

      for (let i = 0; i < words.length; i++) {
        currentResponse += words[i] + ' ';
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            content: currentResponse.trim(),
            timestamp: new Date(),
            suggestions: data.suggestions,
            resources: data.resources,
          },
        ]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const suggestedPrompts = [
    {
      text: "Help me plan a romantic getaway",
      icon: Heart,
    },
    {
      text: "What's the best time to visit Japan?",
      icon: Calendar,
    },
    {
      text: "Budget travel tips for Europe",
      icon: DollarSign,
    },
    {
      text: "Adventure activities in New Zealand",
      icon: Compass,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="text-white" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white">Travel AI Coach</h1>
                <p className="text-blue-100">Your personal travel planning assistant</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-x">
            {/* Conversation Area */}
            <div className="lg:col-span-2 flex flex-col h-[600px]">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-blue-600'
                            : 'bg-purple-600'
                        } text-white`}>
                          {message.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                        </div>
                        <div className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100'
                        }`}>
                          <p className="mb-2">{message.content}</p>
                          <p className="text-xs opacity-70">
                            {format(message.timestamp, 'h:mm a')}
                          </p>

                          {message.suggestions && (
                            <div className="mt-4 space-y-2">
                              {message.suggestions.map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => setInput(suggestion)}
                                  className="block w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}

                          {message.resources && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-medium">Helpful Resources:</p>
                              {message.resources.map((resource, i) => (
                                <a
                                  key={i}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-sm hover:underline"
                                >
                                  {resource.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      <Bot size={20} />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about travel planning..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isTyping}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isTyping ? (
                      <Loader className="animate-spin" size={24} />
                    ) : (
                      <Send size={24} />
                    )}
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Quick Prompts</h3>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInput(prompt.text)}
                      className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <prompt.icon className="text-blue-600" size={20} />
                      <span>{prompt.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {currentPlan && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Current Plan</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{currentPlan.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium">
                        {format(currentPlan.dates.start, 'MMM d')} -{' '}
                        {format(currentPlan.dates.end, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium">${currentPlan.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Activities</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentPlan.activities.map((activity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelAICoach;