import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Star, Clock, Calendar,
  MapPin, Plane, Hotel, Car, Ship, Users,
  Coffee, Camera, Music, Book, Briefcase
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'expert';
  content: string;
  timestamp: Date;
  expertInfo?: {
    name: string;
    specialty: string;
    experience: number;
    rating: number;
  };
}

interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  avatar: string;
  availability: 'available' | 'busy' | 'offline';
}

const TravelProChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch available experts
    fetchExperts();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchExperts = async () => {
    // Mock experts data
    const mockExperts: Expert[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        specialty: 'Asia Travel Expert',
        experience: 8,
        rating: 4.9,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        availability: 'available'
      },
      {
        id: '2',
        name: 'James Rodriguez',
        specialty: 'Adventure Travel',
        experience: 12,
        rating: 4.8,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        availability: 'available'
      },
      {
        id: '3',
        name: 'Emma Thompson',
        specialty: 'Luxury Travel',
        experience: 15,
        rating: 4.9,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        availability: 'busy'
      }
    ];

    setExperts(mockExperts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate API call to expert
      await new Promise(resolve => setTimeout(resolve, 1500));

      const expertResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'expert',
        content: generateExpertResponse(input),
        timestamp: new Date(),
        expertInfo: selectedExpert ? {
          name: selectedExpert.name,
          specialty: selectedExpert.specialty,
          experience: selectedExpert.experience,
          rating: selectedExpert.rating
        } : undefined
      };

      setMessages(prev => [...prev, expertResponse]);
    } catch (error) {
      console.error('Error getting expert response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const generateExpertResponse = (query: string): string => {
    // Mock expert response generation
    const responses = [
      "Based on my experience traveling through Asia, I'd recommend visiting during the shoulder season between March and May. You'll find better weather and fewer crowds at major attractions.",
      "For adventure travel in South America, make sure to book your Machu Picchu permits well in advance - they often sell out months ahead, especially during peak season.",
      "When planning a luxury safari in Africa, I suggest combining multiple countries to experience different ecosystems and wildlife. Tanzania and Kenya work particularly well together."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Experts Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold mb-6">Travel Experts</h2>
              <div className="space-y-4">
                {experts.map((expert) => (
                  <motion.button
                    key={expert.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedExpert(expert)}
                    className={`w-full p-4 rounded-lg border transition-all ${
                      selectedExpert?.id === expert.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="text-left">
                        <h3 className="font-medium">{expert.name}</h3>
                        <p className="text-sm text-gray-500">{expert.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{expert.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        expert.availability === 'available'
                          ? 'bg-green-500'
                          : expert.availability === 'busy'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`} />
                      <span className="text-sm capitalize">{expert.availability}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold">Ask a Travel Pro</h2>
                  </div>
                  {selectedExpert && (
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedExpert.avatar}
                        alt={selectedExpert.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>Chatting with {selectedExpert.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      } mb-4`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}>
                        {message.role === 'expert' && message.expertInfo && (
                          <img
                            src={selectedExpert?.avatar}
                            alt={message.expertInfo.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div className={`p-4 rounded-xl ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100'
                        }`}>
                          <p className="mb-2">{message.content}</p>
                          <div className="flex items-center gap-2 text-sm opacity-70">
                            <Clock className="w-4 h-4" />
                            <span>
                              {message.timestamp.toLocaleTimeString()}
                            </span>
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
                    className="flex items-center gap-2 text-gray-500"
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm">Expert is typing...</span>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-6 border-t">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your travel question..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!selectedExpert || isTyping}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelProChat;