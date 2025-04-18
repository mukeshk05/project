import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, MessageSquare, Send, Loader, User as UserIcon, Sparkles,
  Calendar, MapPin, Plane, Hotel, Car, Utensils, Camera,
  Compass, Mountain, Globe, Download, Trash2, Clock, AlertCircle,
  ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Share2, Copy, BookOpen,
  Bell, Zap, X, Check, Lightbulb, Sun, Cloud, Umbrella, Wind, Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
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

interface Alert {
  id: string;
  type: 'weather' | 'flight' | 'safety' | 'event';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionable: boolean;
  action?: {
    label: string;
    url?: string;
  };
}

interface TripContext {
  destination?: string;
  dates?: {
    start: Date;
    end: Date;
  };
  accommodation?: {
    name: string;
    address: string;
    checkIn: string;
    checkOut: string;
  };
  transportation?: {
    type: string;
    details: string;
    confirmationCode?: string;
  };
  activities?: {
    name: string;
    date: Date;
    location: string;
    confirmationCode?: string;
  }[];
}

const RealTimeAdvisor: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [tripContext, setTripContext] = useState<TripContext | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAlwaysOn, setIsAlwaysOn] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your real-time travel advisor. I'll be here throughout your journey to provide assistance, answer questions, and alert you to important information. How can I help you today?",
        timestamp: new Date()
      }
    ]);

    // Initialize with mock trip context
    setTripContext({
      destination: 'Paris, France',
      dates: {
        start: new Date('2024-06-15'),
        end: new Date('2024-06-22')
      },
      accommodation: {
        name: 'Hotel de Ville',
        address: '123 Rue de Rivoli, 75001 Paris, France',
        checkIn: '3:00 PM',
        checkOut: '11:00 AM'
      },
      transportation: {
        type: 'Flight',
        details: 'Air France AF123',
        confirmationCode: 'ABC123'
      },
      activities: [
        {
          name: 'Eiffel Tower Tour',
          date: new Date('2024-06-16T10:00:00'),
          location: 'Eiffel Tower, Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
          confirmationCode: 'ET456'
        },
        {
          name: 'Louvre Museum Visit',
          date: new Date('2024-06-17T13:00:00'),
          location: 'Rue de Rivoli, 75001 Paris, France',
          confirmationCode: 'LM789'
        }
      ]
    });

    // Initialize with mock alerts
    setAlerts([
      {
        id: 'alert1',
        type: 'weather',
        title: 'Rain Expected Tomorrow',
        message: 'There is a 70% chance of rain tomorrow in Paris. Consider bringing an umbrella or rescheduling outdoor activities.',
        timestamp: new Date(),
        priority: 'medium',
        read: false,
        actionable: true,
        action: {
          label: 'View Forecast',
          url: '#'
        }
      },
      {
        id: 'alert2',
        type: 'flight',
        title: 'Flight Delay',
        message: 'Your return flight AF124 has been delayed by 1 hour. New departure time is 15:30.',
        timestamp: new Date(),
        priority: 'high',
        read: false,
        actionable: true,
        action: {
          label: 'Check Flight Status',
          url: '#'
        }
      }
    ]);

    // Set up interval to check for new alerts (in a real app)
    const alertInterval = setInterval(() => {
      // This would call an API to check for new alerts
    }, 60000);

    return () => clearInterval(alertInterval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setIsLoading(true);
    setIsTyping(true);

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and response
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate AI response based on user input and trip context
      const aiResponse = generateAiResponse(input, tripContext);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        metadata: aiResponse.metadata,
        sources: aiResponse.sources
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const generateAiResponse = (userInput: string, context: TripContext | null): { 
    content: string; 
    metadata?: Message['metadata']; 
    sources?: Message['sources'] 
  } => {
    // This is a mock function that would be replaced with actual AI API call
    const lowerInput = userInput.toLowerCase();
    
    // Weather-related query
    if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('forecast')) {
      return {
        content: `The weather in Paris for the next few days looks mostly sunny with temperatures between 18-24°C (64-75°F). There's a chance of light rain on ${format(addDays(new Date(), 2), 'EEEE')}, so you might want to pack an umbrella for that day.`,
        metadata: {
          locations: ['Paris, France'],
          dates: [format(addDays(new Date(), 1), 'MMMM d'), format(addDays(new Date(), 3), 'MMMM d')]
        },
        sources: [
          {
            title: 'AccuWeather - Paris Forecast',
            url: 'https://www.accuweather.com/en/fr/paris/623/weather-forecast/623'
          }
        ]
      };
    }
    
    // Restaurant recommendations
    if (lowerInput.includes('restaurant') || lowerInput.includes('eat') || lowerInput.includes('food') || lowerInput.includes('dinner')) {
      return {
        content: "Based on your location and preferences, here are some restaurant recommendations near your hotel:\n\n1. **Le Petit Bistro** - Classic French cuisine in a cozy setting (10 min walk)\n2. **Chez Marie** - Local favorite with excellent wine selection (15 min walk)\n3. **L'Atelier** - Modern French cuisine with a creative twist (5 min walk)\n\nWould you like me to make a reservation at any of these restaurants?",
        metadata: {
          locations: ['Le Petit Bistro, Paris', 'Chez Marie, Paris', 'L\'Atelier, Paris'],
          activities: ['dining', 'French cuisine']
        }
      };
    }
    
    // Transportation help
    if (lowerInput.includes('metro') || lowerInput.includes('subway') || lowerInput.includes('train') || lowerInput.includes('get to')) {
      return {
        content: "The Paris Metro is the easiest way to get around the city. The closest station to your hotel is Hôtel de Ville (Line 1 and 11). To reach the Eiffel Tower, take Line 1 to Champs-Élysées–Clemenceau, then transfer to Line 6 to Bir-Hakeim. The journey takes about 25 minutes.\n\nI recommend getting a Paris Visite pass for unlimited travel. A 1-day pass costs €13.20 for zones 1-3, which covers all major attractions.",
        metadata: {
          locations: ['Paris Metro', 'Hôtel de Ville Station', 'Eiffel Tower'],
          activities: ['transportation']
        },
        sources: [
          {
            title: 'RATP - Paris Public Transportation',
            url: 'https://www.ratp.fr/en'
          }
        ]
      };
    }
    
    // Activity recommendations
    if (lowerInput.includes('activity') || lowerInput.includes('do') || lowerInput.includes('see') || lowerInput.includes('visit')) {
      return {
        content: "Here are some must-see attractions in Paris:\n\n1. **Eiffel Tower** - I see you already have a tour booked for tomorrow at 10:00 AM\n2. **Louvre Museum** - You have a visit scheduled for the day after tomorrow\n3. **Notre-Dame Cathedral** - Currently under reconstruction but the exterior is worth seeing\n4. **Montmartre & Sacré-Cœur** - Beautiful views of the city\n5. **Seine River Cruise** - A relaxing way to see many landmarks\n\nBased on your schedule, you have free time on Thursday afternoon. Would you like me to suggest some activities for that time?",
        metadata: {
          locations: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre', 'Seine River'],
          activities: ['sightseeing', 'tour', 'museum']
        }
      };
    }
    
    // Default response
    return {
      content: `I'm here to help with your trip to ${context?.destination || 'your destination'}. You can ask me about local recommendations, transportation options, weather updates, or any other travel-related questions. How can I assist you today?`
    };
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string, size = 20) => {
    switch (type) {
      case 'weather':
        return <Cloud size={size} className="text-blue-500" />;
      case 'flight':
        return <Plane size={size} className="text-purple-500" />;
      case 'safety':
        return <AlertCircle size={size} className="text-red-500" />;
      case 'event':
        return <Calendar size={size} className="text-green-500" />;
      default:
        return <Bell size={size} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
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
        onClick={() => {}}
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

  const renderTripContext = () => {
    if (!tripContext) return null;

    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-blue-800">Current Trip</h3>
          <button
            onClick={() => {}}
            className="text-blue-600 text-sm hover:text-blue-800"
          >
            View Details
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-blue-500" />
            <span>{tripContext.destination}</span>
          </div>
          {tripContext.dates && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-blue-500" />
              <span>
                {format(tripContext.dates.start, 'MMM d')} - {format(tripContext.dates.end, 'MMM d, yyyy')}
              </span>
            </div>
          )}
          {tripContext.accommodation && (
            <div className="flex items-center gap-2 text-sm">
              <Hotel size={14} className="text-blue-500" />
              <span>{tripContext.accommodation.name}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAlerts = () => {
    const unreadAlerts = alerts.filter(alert => !alert.read);
    
    if (unreadAlerts.length === 0) {
      return (
        <div className="text-center py-4">
          <Bell className="mx-auto mb-2 text-gray-300" size={24} />
          <p className="text-gray-500">No new alerts</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {unreadAlerts.map(alert => (
          <div 
            key={alert.id} 
            className={`p-3 rounded-lg ${getPriorityColor(alert.priority)} relative`}
          >
            <button
              onClick={() => dismissAlert(alert.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div>
                <h4 className="font-semibold">{alert.title}</h4>
                <p className="text-sm">{alert.message}</p>
                {alert.actionable && alert.action && (
                  <a 
                    href={alert.action.url} 
                    className="text-sm font-medium mt-2 inline-block hover:underline"
                  >
                    {alert.action.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative"
        >
          <Bot size={24} />
          {alerts.some(alert => !alert.read) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {alerts.filter(alert => !alert.read).length}
            </span>
          )}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 bg-gray-50 p-6 border-r">
              <div className="sticky top-6">
                <div className="flex items-center gap-3 mb-8">
                  <Bot size={32} className="text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold">Travel Advisor</h2>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-sm text-gray-500">Always On</span>
                    </div>
                  </div>
                </div>

                {renderTripContext()}

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Alerts</h3>
                    <button
                      onClick={() => setShowAlerts(!showAlerts)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showAlerts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {showAlerts && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {renderAlerts()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Quick Assistance</h3>
                  <button
                    onClick={() => setInput("What's the weather forecast for tomorrow?")}
                    className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <Cloud size={18} />
                    <span>Weather forecast</span>
                  </button>
                  <button
                    onClick={() => setInput("What are some good restaurants near my hotel?")}
                    className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <Utensils size={18} />
                    <span>Restaurant recommendations</span>
                  </button>
                  <button
                    onClick={() => setInput("How do I get to the Eiffel Tower from my hotel?")}
                    className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <Map size={18} />
                    <span>Transportation help</span>
                  </button>
                  <button
                    onClick={() => setInput("What should I do if I lose my passport?")}
                    className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <AlertCircle size={18} />
                    <span>Emergency assistance</span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Always-On Mode</h3>
                    <button
                      onClick={() => setIsAlwaysOn(!isAlwaysOn)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        isAlwaysOn ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          isAlwaysOn ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    When enabled, your advisor will proactively alert you about important travel information.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Minimize
                  </button>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3 flex flex-col h-[800px]">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      variants={messageVariants}
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
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about your trip..."
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
        </motion.div>
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
                {(!selectedMessage.sources || selectedMessage.sources.length === 0) && (
                  <p className="text-gray-500 text-center py-4">
                    No sources available for this message
                  </p>
                )}
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

export default RealTimeAdvisor;