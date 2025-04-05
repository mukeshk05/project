import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, MapPin, Calendar, Users, Globe, Compass, Coffee, Utensils, Info, Bot, User as UserIcon, Sparkles, Plane, Hotel, Car, Ship } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'recommendation' | 'itinerary' | 'info';
  metadata?: {
    locations?: string[];
    dates?: string[];
    budget?: string;
    activities?: string[];
  };
}

const TravelAssistantPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversation(data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const parseResponse = (response: string): Message['metadata'] => {
    const metadata: Message['metadata'] = {};

    // Extract locations (cities, countries, places)
    const locationRegex = /\b(?:in|to|from|at)\s+([A-Z][a-zA-Z\s,]+)(?=[\s,.])/g;
    metadata.locations = [...response.matchAll(locationRegex)].map(match => match[1]);

    // Extract dates
    const dateRegex = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?\b/g;
    metadata.dates = response.match(dateRegex) || [];

    // Extract activities
    const activityRegex = /\b(?:visit|explore|see|experience|tour|discover)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+)(?=[\s,.])/g;
    metadata.activities = [...response.matchAll(activityRegex)].map(match => match[1]);

    return metadata;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setConversation(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: userMessage,user:user }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Simulate typing effect
      setIsTyping(true);
      const words = data.response.split(' ');
      let currentResponse = '';

      for (let i = 0; i < words.length; i++) {
        currentResponse += words[i] + ' ';
        const metadata = parseResponse(currentResponse);
        setConversation(prev => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            content: currentResponse.trim(),
            timestamp: new Date(),
            metadata
          }
        ]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    {
      text: "Plan a romantic weekend getaway",
      icon: Calendar,
      category: "Planning"
    },
    {
      text: "Best hidden gems in Europe",
      icon: Compass,
      category: "Discovery"
    },
    {
      text: "Local food recommendations in Tokyo",
      icon: Utensils,
      category: "Food"
    },
    {
      text: "Family-friendly destinations",
      icon: Users,
      category: "Family"
    },
    {
      text: "Cultural experiences in Bali",
      icon: Globe,
      category: "Culture"
    },
    {
      text: "Best cafes in Paris",
      icon: Coffee,
      category: "Food"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const renderMetadata = (metadata: Message['metadata']) => {
    if (!metadata) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 space-y-2"
        >
          {metadata.locations && metadata.locations.length > 0 && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <div className="flex flex-wrap gap-1">
                  {metadata.locations.map((location, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {location}
                  </span>
                  ))}
                </div>
              </div>
          )}
          {metadata.activities && metadata.activities.length > 0 && (
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-green-500" />
                <div className="flex flex-wrap gap-1">
                  {metadata.activities.map((activity, i) => (
                      <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {activity}
                  </span>
                  ))}
                </div>
              </div>
          )}
          {metadata.dates && metadata.dates.length > 0 && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" />
                <div className="flex flex-wrap gap-1">
                  {metadata.dates.map((date, i) => (
                      <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    {date}
                  </span>
                  ))}
                </div>
              </div>
          )}
        </motion.div>
    );
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[800px]">
              {/* Sidebar */}
              <div className="bg-gradient-to-b from-blue-600 to-purple-700 p-8 text-white">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Bot size={32} className="animate-pulse" />
                    <h2 className="text-2xl font-bold">Travel Assistant</h2>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">I can help you with:</h3>
                      <div className="space-y-4">
                        <motion.div
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"
                            whileHover={{ x: 5 }}
                        >
                          <Plane className="w-5 h-5" />
                          <span>Flight Planning</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"
                            whileHover={{ x: 5 }}
                        >
                          <Hotel className="w-5 h-5" />
                          <span>Accommodation</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"
                            whileHover={{ x: 5 }}
                        >
                          <Car className="w-5 h-5" />
                          <span>Transportation</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"
                            whileHover={{ x: 5 }}
                        >
                          <Ship className="w-5 h-5" />
                          <span>Activities & Tours</span>
                        </motion.div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4 text-lg">Quick Prompts:</h3>
                      <div className="space-y-2">
                        {suggestedPrompts.map((prompt, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setMessage(prompt.text)}
                                className="w-full flex items-center gap-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left"
                            >
                              <prompt.icon size={20} />
                              <div>
                                <span className="block">{prompt.text}</span>
                                <span className="text-xs text-white/70">{prompt.category}</span>
                              </div>
                            </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Chat Area */}
              <div className="col-span-2 flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {!user && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800">
                        Please log in to use the Travel Assistant.
                      </div>
                  )}

                  <AnimatePresence>
                    {conversation.map((msg, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                              className={`flex items-start gap-3 max-w-[80%] ${
                                  msg.role === 'user' ? 'flex-row-reverse' : ''
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                msg.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                    : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                            }`}>
                              {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                            </div>
                            <div
                                className={`flex-1 p-4 rounded-2xl ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                        : 'bg-white shadow-md'
                                }`}
                            >
                              <div className={msg.role === 'user' ? 'text-white' : 'text-gray-800'}>
                                {msg.content}
                              </div>
                              {msg.metadata && renderMetadata(msg.metadata)}
                              <div className={`text-xs mt-2 ${
                                  msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                              }`}>
                                {msg.timestamp.toLocaleTimeString()}
                              </div>
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                          <Bot size={20} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-md">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-6 bg-white">
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about your travel plans..."
                        className="flex-1 px-6 py-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        disabled={!user}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading || !user}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition-shadow disabled:opacity-70 flex items-center gap-2"
                    >
                      {isLoading ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            <span>Processing...</span>
                          </>
                      ) : (
                          <>
                            <Send size={20} />
                            <span>Send</span>
                          </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TravelAssistantPage;