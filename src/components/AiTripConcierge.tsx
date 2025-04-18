import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, MessageSquare, Send, Sparkles, Calendar, MapPin,
  Users, DollarSign, Plane, Hotel, Car, Utensils, Camera,
  Briefcase, Clock, Loader, Check, X, Download, Share2,
  Compass, Sun, Moon, Wind, Umbrella, ThermometerSun, Heart
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'link' | 'location' | 'itinerary';
    data: any;
  }[];
}

interface Suggestion {
  id: string;
  text: string;
  icon: any;
}

interface TripPlan {
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  budget: number;
  travelers: number;
  accommodation: {
    type: string;
    name: string;
    price: number;
    rating: number;
    amenities: string[];
  };
  transportation: {
    type: string;
    details: string;
    price: number;
  };
  activities: {
    name: string;
    description: string;
    price: number;
    duration: string;
    rating: number;
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    price: number;
    rating: number;
  }[];
  totalCost: number;
}

const AiTripConcierge: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [showTripPlan, setShowTripPlan] = useState(false);
  const [isPremium, setIsPremium] = useState(true); // For demo purposes, set to true
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your premium AI Trip Concierge. I can help you plan every aspect of your perfect trip with personalized recommendations. What kind of trip are you looking for?",
        timestamp: new Date()
      }
    ]);

    // Set initial suggestions
    setSuggestions([
      {
        id: 's1',
        text: "Plan a romantic weekend in Paris",
        icon: Heart
      },
      {
        id: 's2',
        text: "Family vacation to Disney World",
        icon: Users
      },
      {
        id: 's3',
        text: "Adventure trip to Costa Rica",
        icon: Compass
      },
      {
        id: 's4',
        text: "Relaxing beach getaway",
        icon: Sun
      }
    ]);
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

    // Check if user has premium access
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

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
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate AI response based on user input
      const aiResponse = generateAiResponse(input);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        attachments: aiResponse.attachments
      }]);

      // Update suggestions based on conversation context
      updateSuggestions(input);

      // Check if we should generate a trip plan
      if (input.toLowerCase().includes('plan') || input.toLowerCase().includes('itinerary')) {
        generateTripPlan();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAiResponse = (userInput: string): { content: string; attachments?: any[] } => {
    // This is a mock function that would be replaced with actual AI API call
    const responses = [
      {
        content: "I'd be happy to help you plan a romantic weekend in Paris! The city offers countless romantic experiences, from strolling along the Seine to watching the sunset from Montmartre. When are you thinking of visiting?",
        attachments: [
          {
            type: 'image',
            data: {
              url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
              caption: 'Paris, France'
            }
          }
        ]
      },
      {
        content: "A family vacation to Disney World sounds wonderful! It's a magical place for both kids and adults. The best time to visit is typically during the shoulder seasons (September-October or January-February) when crowds are smaller. How many family members will be traveling, and do you have a specific budget in mind?",
        attachments: undefined
      },
      {
        content: "Costa Rica is perfect for adventure travelers! From zip-lining through cloud forests to white-water rafting and surfing, there's something for every thrill-seeker. The dry season (December to April) is generally the best time to visit. Would you prefer to focus on rainforest adventures, beach activities, or a mix of both?",
        attachments: [
          {
            type: 'image',
            data: {
              url: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&q=80&w=2000',
              caption: 'Costa Rica Rainforest'
            }
          }
        ]
      },
      {
        content: "A relaxing beach getaway sounds perfect! There are so many beautiful beach destinations to choose from. Are you looking for something in the Caribbean, Mediterranean, Southeast Asia, or somewhere else? And do you prefer a resort experience or something more secluded?",
        attachments: undefined
      }
    ];

    // Simple logic to pick a response based on user input
    if (userInput.toLowerCase().includes('paris') || userInput.toLowerCase().includes('romantic')) {
      return responses[0];
    } else if (userInput.toLowerCase().includes('disney') || userInput.toLowerCase().includes('family')) {
      return responses[1];
    } else if (userInput.toLowerCase().includes('costa rica') || userInput.toLowerCase().includes('adventure')) {
      return responses[2];
    } else if (userInput.toLowerCase().includes('beach') || userInput.toLowerCase().includes('relax')) {
      return responses[3];
    }

    // Default response
    return {
      content: "I'd be happy to help you plan your perfect trip. Could you tell me more about what kind of experience you're looking for? For example, are you interested in a city break, beach vacation, adventure trip, or something else?",
      attachments: undefined
    };
  };

  const updateSuggestions = (userInput: string) => {
    // Update suggestions based on conversation context
    if (userInput.toLowerCase().includes('paris') || userInput.toLowerCase().includes('romantic')) {
      setSuggestions([
        {
          id: 's1',
          text: "What are the most romantic restaurants in Paris?",
          icon: Utensils
        },
        {
          id: 's2',
          text: "Best time to visit the Eiffel Tower?",
          icon: Clock
        },
        {
          id: 's3',
          text: "Luxury hotel recommendations in Paris",
          icon: Hotel
        }
      ]);
    } else if (userInput.toLowerCase().includes('disney') || userInput.toLowerCase().includes('family')) {
      setSuggestions([
        {
          id: 's1',
          text: "Which Disney World parks are best for young children?",
          icon: Users
        },
        {
          id: 's2',
          text: "How many days should we spend at Disney?",
          icon: Calendar
        },
        {
          id: 's3',
          text: "Best Disney resort hotels for families",
          icon: Hotel
        }
      ]);
    } else if (userInput.toLowerCase().includes('costa rica') || userInput.toLowerCase().includes('adventure')) {
      setSuggestions([
        {
          id: 's1',
          text: "Top adventure activities in Costa Rica",
          icon: Compass
        },
        {
          id: 's2',
          text: "Best time to visit Arenal Volcano",
          icon: ThermometerSun
        },
        {
          id: 's3',
          text: "Eco-friendly accommodations in Costa Rica",
          icon: Hotel
        }
      ]);
    }
  };

  const generateTripPlan = async () => {
    setIsTyping(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock trip plan
      const mockTripPlan: TripPlan = {
        destination: "Paris, France",
        dates: {
          start: addDays(new Date(), 30),
          end: addDays(new Date(), 33)
        },
        budget: 2500,
        travelers: 2,
        accommodation: {
          type: "Boutique Hotel",
          name: "Hôtel des Arts Montmartre",
          price: 220,
          rating: 4.7,
          amenities: ["Free WiFi", "Breakfast Included", "Air Conditioning", "Concierge Service"]
        },
        transportation: {
          type: "Flight + Metro Pass",
          details: "Round-trip flights from New York to Paris + 3-day unlimited metro pass",
          price: 850
        },
        activities: [
          {
            name: "Skip-the-line Eiffel Tower Tour",
            description: "Guided tour with priority access to the second floor and summit",
            price: 65,
            duration: "2-3 hours",
            rating: 4.8
          },
          {
            name: "Seine River Dinner Cruise",
            description: "Romantic dinner cruise along the Seine with views of illuminated monuments",
            price: 95,
            duration: "2 hours",
            rating: 4.6
          },
          {
            name: "Louvre Museum Guided Tour",
            description: "Skip-the-line access with expert guide to see the Mona Lisa and more",
            price: 70,
            duration: "3 hours",
            rating: 4.9
          },
          {
            name: "Montmartre Walking Tour",
            description: "Explore the artistic neighborhood with a local guide",
            price: 35,
            duration: "2 hours",
            rating: 4.7
          }
        ],
        restaurants: [
          {
            name: "Le Jules Verne",
            cuisine: "French Fine Dining",
            price: 250,
            rating: 4.5
          },
          {
            name: "Café de Flore",
            cuisine: "Classic French Café",
            price: 40,
            rating: 4.3
          },
          {
            name: "L'As du Fallafel",
            cuisine: "Middle Eastern",
            price: 15,
            rating: 4.7
          }
        ],
        totalCost: 2150
      };
      
      setTripPlan(mockTripPlan);
      
      // Add a message about the trip plan
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've created a personalized trip plan for your romantic weekend in Paris! It includes accommodation, transportation, activities, and dining recommendations within your budget. Would you like to review it?",
        timestamp: new Date(),
        attachments: [
          {
            type: 'itinerary',
            data: { preview: true }
          }
        ]
      }]);
    } catch (error) {
      console.error('Error generating trip plan:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const upgradeToPremium = () => {
    // In a real app, this would redirect to a payment page or subscription flow
    setIsPremium(true);
    setShowPremiumModal(false);
    
    // Add a system message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'system',
      content: "🌟 You've upgraded to Premium AI Trip Concierge! You now have access to personalized trip planning, real-time recommendations, and premium travel insights.",
      timestamp: new Date()
    }]);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg overflow-hidden h-[700px] flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <Bot size={28} />
                  <div>
                    <h2 className="text-xl font-bold">AI Trip Concierge</h2>
                    <p className="text-indigo-100">Your premium travel planning assistant</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`mb-4 ${
                        message.role === 'user' 
                          ? 'flex justify-end' 
                          : message.role === 'system'
                          ? 'flex justify-center'
                          : 'flex justify-start'
                      }`}
                    >
                      {message.role === 'system' ? (
                        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg max-w-[80%]">
                          {message.content}
                        </div>
                      ) : (
                        <div className={`flex items-start gap-3 max-w-[80%] ${
                          message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.role === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                          </div>
                          <div>
                            <div className={`p-4 rounded-xl ${
                              message.role === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border shadow-sm'
                            }`}>
                              <p className="mb-1">{message.content}</p>
                              <div className="text-xs opacity-70 flex items-center gap-1">
                                <Clock size={12} />
                                <span>{format(message.timestamp, 'h:mm a')}</span>
                              </div>
                            </div>
                            
                            {/* Attachments */}
                            {message.attachments && message.attachments.map((attachment, index) => (
                              <div key={index} className="mt-2">
                                {attachment.type === 'image' && (
                                  <div className="rounded-lg overflow-hidden">
                                    <img
                                      src={attachment.data.url}
                                      alt={attachment.data.caption || 'Attached image'}
                                      className="w-full h-40 object-cover"
                                    />
                                    {attachment.data.caption && (
                                      <p className="text-sm text-gray-500 p-2 bg-gray-50">
                                        {attachment.data.caption}
                                      </p>
                                    )}
                                  </div>
                                )}
                                
                                {attachment.type === 'itinerary' && attachment.data.preview && (
                                  <div className="mt-2 p-4 bg-indigo-50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <h4 className="font-medium text-indigo-800">Trip Plan Generated</h4>
                                      <button
                                        onClick={() => setShowTripPlan(true)}
                                        className="text-indigo-600 text-sm flex items-center gap-1 hover:text-indigo-800"
                                      >
                                        View Details
                                        <ArrowRight size={14} />
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-indigo-700">
                                      <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        <span>Paris, France</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>3 nights</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <DollarSign size={14} />
                                        <span>$2,150</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Bot size={20} />
                    </div>
                    <div className="p-4 rounded-xl bg-white border shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your trip..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Send size={20} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Suggestions */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-500" size={20} />
                <span>Suggested Questions</span>
              </h3>
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInput(suggestion.text)}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <suggestion.icon className="text-indigo-600" size={18} />
                    </div>
                    <span>{suggestion.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Premium Features */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="text-yellow-300" size={20} />
                <span>Premium Features</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check size={18} className="mt-0.5 text-green-300" />
                  <span>Personalized trip planning with AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={18} className="mt-0.5 text-green-300" />
                  <span>Real-time flight and hotel recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={18} className="mt-0.5 text-green-300" />
                  <span>Exclusive deals and insider tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={18} className="mt-0.5 text-green-300" />
                  <span>24/7 virtual concierge assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={18} className="mt-0.5 text-green-300" />
                  <span>Unlimited itinerary creation</span>
                </li>
              </ul>
              {!isPremium && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full mt-4 bg-white text-indigo-600 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Upgrade to Premium
                </motion.button>
              )}
            </motion.div>

            {/* Weather Info (if trip plan exists) */}
            {tripPlan && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ThermometerSun className="text-orange-500" size={20} />
                  <span>Weather Forecast</span>
                </h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Today</p>
                    <Sun className="mx-auto my-2 text-yellow-500" size={24} />
                    <p className="font-medium">72°F</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Tomorrow</p>
                    <Cloud className="mx-auto my-2 text-gray-400" size={24} />
                    <p className="font-medium">68°F</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Day 3</p>
                    <Sun className="mx-auto my-2 text-yellow-500" size={24} />
                    <p className="font-medium">75°F</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Day 4</p>
                    <Umbrella className="mx-auto my-2 text-blue-500" size={24} />
                    <p className="font-medium">65°F</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Trip Plan Modal */}
      <AnimatePresence>
        {showTripPlan && tripPlan && (
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
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Your Personalized Trip Plan</h3>
                <button
                  onClick={() => setShowTripPlan(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-bold text-lg">{tripPlan.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium">
                        {format(tripPlan.dates.start, 'MMM d')} - {format(tripPlan.dates.end, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Travelers</p>
                      <p className="font-medium">{tripPlan.travelers} people</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium">${tripPlan.budget}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Accommodation */}
                  <div className="border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Hotel className="text-indigo-600" size={24} />
                      <h4 className="text-lg font-bold">Accommodation</h4>
                    </div>
                    <h5 className="font-bold text-xl mb-2">{tripPlan.accommodation.name}</h5>
                    <p className="text-gray-600 mb-2">{tripPlan.accommodation.type}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(Math.floor(tripPlan.accommodation.rating))].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-current" size={16} />
                        ))}
                        {tripPlan.accommodation.rating % 1 > 0 && (
                          <Star className="text-yellow-400" size={16} />
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{tripPlan.accommodation.rating} stars</span>
                    </div>
                    <div className="mb-4">
                      <h6 className="font-medium mb-2">Amenities</h6>
                      <div className="flex flex-wrap gap-2">
                        {tripPlan.accommodation.amenities.map((amenity, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-gray-600">Price per night</span>
                      <span className="font-bold">${tripPlan.accommodation.price}</span>
                    </div>
                  </div>
                  
                  {/* Transportation */}
                  <div className="border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Plane className="text-indigo-600" size={24} />
                      <h4 className="text-lg font-bold">Transportation</h4>
                    </div>
                    <h5 className="font-bold text-xl mb-2">{tripPlan.transportation.type}</h5>
                    <p className="text-gray-600 mb-6">{tripPlan.transportation.details}</p>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-gray-600">Total transportation cost</span>
                      <span className="font-bold">${tripPlan.transportation.price}</span>
                    </div>
                  </div>
                </div>
                
                {/* Activities */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="text-indigo-600" size={24} />
                    <h4 className="text-lg font-bold">Recommended Activities</h4>
                  </div>
                  <div className="space-y-4">
                    {tripPlan.activities.map((activity, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold mb-1">{activity.name}</h5>
                            <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{activity.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="text-yellow-400 fill-current" size={14} />
                                <span>{activity.rating}</span>
                              </div>
                            </div>
                          </div>
                          <span className="font-bold">${activity.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Restaurants */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Utensils className="text-indigo-600" size={24} />
                    <h4 className="text-lg font-bold">Dining Recommendations</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tripPlan.restaurants.map((restaurant, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-bold mb-1">{restaurant.name}</h5>
                        <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="text-sm">{restaurant.rating}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {restaurant.price < 50 ? '$' : restaurant.price < 100 ? '$$' : '$$$'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Cost Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold mb-4">Cost Summary</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accommodation ({Math.round((tripPlan.dates.end.getTime() - tripPlan.dates.start.getTime()) / (1000 * 60 * 60 * 24))} nights)</span>
                      <span>${tripPlan.accommodation.price * Math.round((tripPlan.dates.end.getTime() - tripPlan.dates.start.getTime()) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transportation</span>
                      <span>${tripPlan.transportation.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activities</span>
                      <span>${tripPlan.activities.reduce((sum, activity) => sum + activity.price, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Food & Dining</span>
                      <span>${tripPlan.restaurants.reduce((sum, restaurant) => sum + restaurant.price, 0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total Estimated Cost</span>
                    <span className="font-bold text-xl">${tripPlan.totalCost}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Per person</span>
                    <span>${Math.round(tripPlan.totalCost / tripPlan.travelers)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowTripPlan(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={20} />
                    <span>Download Itinerary</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check size={20} />
                    <span>Book This Trip</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showPremiumModal && (
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
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-indigo-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-gray-600">
                  Unlock the full power of AI Trip Concierge with premium features and personalized recommendations.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">Personalized Trip Planning</h4>
                    <p className="text-sm text-gray-600">Get AI-generated itineraries tailored to your preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">Real-time Recommendations</h4>
                    <p className="text-sm text-gray-600">Receive up-to-date suggestions based on weather, events, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">Exclusive Deals</h4>
                    <p className="text-sm text-gray-600">Access to premium discounts and offers not available elsewhere</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">24/7 Virtual Concierge</h4>
                    <p className="text-sm text-gray-600">Get assistance anytime during your trip</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Subscription</span>
                  <span className="text-xl font-bold">$14.99/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Cancel anytime. No commitment required.</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Not Now
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={upgradeToPremium}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Upgrade Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiTripConcierge;