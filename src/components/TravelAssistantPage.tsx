import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Bot, User as UserIcon, Sparkles, History, Search,
  Filter, Calendar, MapPin, Plane, Hotel, Car, Ship, Coffee, Utensils,
  Compass, Mountain, Globe, Download, Trash2, Clock, AlertCircle, ChevronDown,
  ChevronUp, Loader, ThumbsUp, ThumbsDown, Share2, Copy, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    locations?: string[];
    dates?: string[];
    activities?: string[];
  };
  sources?: {
    title: string;
    url: string;
  }[];
  feedback?: 'positive' | 'negative';
}

const TravelAssistantPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

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
        body: JSON.stringify({ message: userMessage, user }),
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
        setConversation(prev => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            content: currentResponse.trim(),
            timestamp: new Date(),
            metadata: {
              locations: extractLocations(currentResponse),
              dates: extractDates(currentResponse),
              activities: extractActivities(currentResponse)
            },
            sources: generateMockSources()
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

  const extractLocations = (text: string): string[] => {
    const locationRegex = /\b(?:in|to|from|at)\s+([A-Z][a-zA-Z\s,]+)(?=[\s,.])/g;
    return [...text.matchAll(locationRegex)].map(match => match[1]);
  };

  const extractDates = (text: string): string[] => {
    const dateRegex = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?\b/g;
    return text.match(dateRegex) || [];
  };

  const extractActivities = (text: string): string[] => {
    const activityRegex = /\b(?:visit|explore|see|experience|tour|discover)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+)(?=[\s,.])/g;
    return [...text.matchAll(activityRegex)].map(match => match[1]);
  };

  const generateMockSources = () => [
    {
      title: 'Lonely Planet Travel Guide',
      url: 'https://www.lonelyplanet.com'
    },
    {
      title: 'TripAdvisor Reviews',
      url: 'https://www.tripadvisor.com'
    }
  ];

  const suggestedPrompts = [
    {
      text: "Plan a romantic weekend in Paris",
      icon: Globe,
      category: "City Break"
    },
    {
      text: "Best beaches in Bali",
      icon: Plane,
      category: "Beach"
    },
    {
      text: "Hiking trails in Swiss Alps",
      icon: Mountain,
      category: "Adventure"
    },
    {
      text: "Food tour in Tokyo",
      icon: Utensils,
      category: "Food"
    },
    {
      text: "Cultural experiences in Rome",
      icon: Compass,
      category: "Culture"
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
        type: "spring",
        stiffness: 300,
        damping: 30
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

  const renderMessageActions = (message: Message) => (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mt-4 text-gray-500"
      >
        <button
            onClick={() => navigator.clipboard.writeText(message.content)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Copy to clipboard"
        >
          <Copy size={16} />
        </button>
        <button
            onClick={() => {}} // Implement share functionality
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Share"
        >
          <Share2 size={16} />
        </button>
        {message.role === 'assistant' && (
            <>
              <button
                  onClick={() => setSelectedMessage(message)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="View sources"
              >
                <BookOpen size={16} />
              </button>
              <div className="flex items-center gap-1 ml-2">
                <button
                    onClick={() => {}}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Helpful"
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                    onClick={() => {}}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Not helpful"
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            </>
        )}
      </motion.div>
  );

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4">
              {/* Sidebar */}
              <div className="lg:col-span-1 bg-gray-50 p-6 border-r">
                <div className="sticky top-6">
                  <div className="flex items-center gap-3 mb-8">
                    <Bot size={32} className="text-blue-600" />
                    <h2 className="text-2xl font-bold">Travel Assistant</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Quick Prompts</h3>
                      <div className="space-y-2">
                        {suggestedPrompts.map((prompt, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setMessage(prompt.text)}
                                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-white transition-colors text-left"
                            >
                              <prompt.icon size={20} className="text-blue-600" />
                              <div>
                                <span className="block text-gray-900">{prompt.text}</span>
                                <span className="text-xs text-gray-500">{prompt.category}</span>
                              </div>
                            </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Travel Services</h3>
                      <div className="space-y-2">
                        {[
                          { icon: Plane, label: 'Flights' },
                          { icon: Hotel, label: 'Hotels' },
                          { icon: Car, label: 'Transportation' },
                          { icon: Ship, label: 'Activities' }
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 text-gray-600"
                            >
                              <service.icon size={20} />
                              <span>{service.label}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="lg:col-span-3 flex flex-col h-[800px]">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {conversation.length === 0 ? (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center"
                      >
                        <Sparkles className="mx-auto mb-4 text-blue-500" size={32} />
                        <h3 className="text-2xl font-bold mb-2">Welcome to Travel Assistant</h3>
                        <p className="text-gray-600 mb-8">
                          I'm here to help you plan your perfect trip. Ask me anything about destinations,
                          accommodations, or travel tips!
                        </p>
                      </motion.div>
                  ) : (
                      <AnimatePresence>
                        {conversation.map((msg, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-start gap-3 max-w-[80%] ${
                                  msg.role === 'user' ? 'flex-row-reverse' : ''
                              }`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100'
                                }`}>
                                  {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                                </div>
                                <div className={`flex-1 ${
                                    msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100'
                                } p-4 rounded-2xl`}>
                                  <div className="prose max-w-none">
                                    {msg.content}
                                  </div>
                                  {msg.metadata && renderMetadata(msg.metadata)}
                                  {renderMessageActions(msg)}
                                </div>
                              </div>
                            </motion.div>
                        ))}
                      </AnimatePresence>
                  )}

                  {isTyping && (
                      <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
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

                {/* Input Form */}
                <div className="p-6 border-t bg-white">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about your travel plans..."
                        className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                          <Loader className="animate-spin" size={20} />
                      ) : (
                          <Send size={20} />
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sources Dialog */}
        <AnimatePresence>
          {selectedMessage && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Sources</h3>
                  <div className="space-y-4">
                    {selectedMessage.sources?.map((source, index) => (
                        <a
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="text-blue-600" size={20} />
                            <span>{source.title}</span>
                          </div>
                        </a>
                    ))}
                  </div>
                  <button
                      onClick={() => setSelectedMessage(null)}
                      className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default TravelAssistantPage;