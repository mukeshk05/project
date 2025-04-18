import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Calendar, MapPin, Clock, Heart, Star, 
  Compass, Plane, Hotel, Car, Utensils, Camera, 
  Plus, X, Search, Filter, ChevronDown, ChevronUp,
  Sparkles, Loader, Check, Download, Share2, Zap
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface TravelMemory {
  id: string;
  destination: string;
  location?: string;
  date: Date;
  type: 'trip' | 'activity' | 'accommodation' | 'dining' | 'transport' | 'other';
  rating: number;
  notes?: string;
  photos?: string[];
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface TravelPreference {
  category: string;
  items: {
    name: string;
    score: number;
    count: number;
  }[];
}

interface TripRecommendation {
  id: string;
  destination: string;
  description: string;
  matchScore: number;
  basedOn: {
    memory: string;
    reason: string;
  }[];
  suggestedActivities: string[];
  suggestedAccommodations: string[];
  suggestedDates: {
    start: Date;
    end: Date;
  };
  image: string;
}

const MemoryBasedPlanning: React.FC = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<TravelMemory[]>([]);
  const [preferences, setPreferences] = useState<TravelPreference[]>([]);
  const [recommendations, setRecommendations] = useState<TripRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'memories' | 'preferences' | 'recommendations'>('memories');
  const [selectedMemory, setSelectedMemory] = useState<TravelMemory | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<TripRecommendation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');

  useEffect(() => {
    fetchMemoriesAndPreferences();
  }, []);

  const fetchMemoriesAndPreferences = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock memories
      const mockMemories: TravelMemory[] = [
        {
          id: '1',
          destination: 'Paris, France',
          location: 'Eiffel Tower',
          date: new Date('2023-06-15'),
          type: 'activity',
          rating: 5,
          notes: 'The view from the top was breathtaking! Definitely worth the wait in line.',
          photos: [
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000'
          ],
          tags: ['landmark', 'romantic', 'view', 'iconic'],
          sentiment: 'positive'
        },
        {
          id: '2',
          destination: 'Tokyo, Japan',
          location: 'Shinjuku District',
          date: new Date('2023-09-10'),
          type: 'trip',
          rating: 5,
          notes: 'The energy of Tokyo is incredible. The blend of traditional and ultra-modern is fascinating.',
          photos: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=2000'
          ],
          tags: ['city', 'culture', 'food', 'technology'],
          sentiment: 'positive'
        },
        {
          id: '3',
          destination: 'Bali, Indonesia',
          location: 'Ubud',
          date: new Date('2022-11-05'),
          type: 'accommodation',
          rating: 4,
          notes: 'Beautiful villa surrounded by rice fields. Very peaceful and the staff was incredibly friendly.',
          photos: [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000'
          ],
          tags: ['villa', 'nature', 'relaxation', 'pool'],
          sentiment: 'positive'
        },
        {
          id: '4',
          destination: 'New York City, USA',
          location: 'Times Square',
          date: new Date('2023-12-20'),
          type: 'activity',
          rating: 3,
          notes: 'Very crowded and touristy, but the energy was exciting. Too many people for my taste though.',
          photos: [
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=2000'
          ],
          tags: ['city', 'crowded', 'lights', 'busy'],
          sentiment: 'neutral'
        },
        {
          id: '5',
          destination: 'Rome, Italy',
          location: 'Trattoria Da Luigi',
          date: new Date('2023-07-25'),
          type: 'dining',
          rating: 5,
          notes: 'Best pasta I\'ve ever had! The carbonara was authentic and the service was excellent.',
          tags: ['food', 'italian', 'pasta', 'authentic'],
          sentiment: 'positive'
        },
        {
          id: '6',
          destination: 'London, UK',
          location: 'Heathrow Airport',
          date: new Date('2023-03-12'),
          type: 'transport',
          rating: 2,
          notes: 'Flight was delayed by 3 hours and luggage handling was slow. Not a great experience.',
          tags: ['airport', 'delay', 'flight', 'frustrating'],
          sentiment: 'negative'
        }
      ];
      
      // Mock preferences derived from memories
      const mockPreferences: TravelPreference[] = [
        {
          category: 'Destinations',
          items: [
            { name: 'Europe', score: 0.85, count: 2 },
            { name: 'Asia', score: 0.9, count: 2 },
            { name: 'Cities', score: 0.8, count: 3 },
            { name: 'Beach', score: 0.75, count: 1 }
          ]
        },
        {
          category: 'Accommodations',
          items: [
            { name: 'Boutique Hotels', score: 0.9, count: 2 },
            { name: 'Villas', score: 0.85, count: 1 },
            { name: 'Nature Setting', score: 0.8, count: 1 }
          ]
        },
        {
          category: 'Activities',
          items: [
            { name: 'Cultural Experiences', score: 0.95, count: 4 },
            { name: 'Food Exploration', score: 0.9, count: 3 },
            { name: 'Landmarks', score: 0.85, count: 2 },
            { name: 'Relaxation', score: 0.7, count: 1 }
          ]
        },
        {
          category: 'Travel Style',
          items: [
            { name: 'Authentic', score: 0.9, count: 3 },
            { name: 'Comfortable', score: 0.8, count: 2 },
            { name: 'Cultural', score: 0.85, count: 3 },
            { name: 'Food-Focused', score: 0.9, count: 2 }
          ]
        }
      ];
      
      // Mock recommendations
      const mockRecommendations: TripRecommendation[] = [
        {
          id: '1',
          destination: 'Kyoto, Japan',
          description: 'Based on your positive experiences in Tokyo and your appreciation for culture and authentic experiences, you would likely enjoy Kyoto\'s traditional side of Japan with its temples, gardens, and rich cultural heritage.',
          matchScore: 92,
          basedOn: [
            {
              memory: 'Tokyo, Japan',
              reason: 'You rated your Tokyo trip 5/5 and enjoyed the cultural aspects'
            },
            {
              memory: 'Rome, Italy',
              reason: 'You appreciate authentic cultural experiences and cuisine'
            }
          ],
          suggestedActivities: [
            'Visit Fushimi Inari Shrine',
            'Explore Arashiyama Bamboo Grove',
            'Experience a traditional tea ceremony',
            'Stroll through Gion district'
          ],
          suggestedAccommodations: [
            'Traditional ryokan in Gion',
            'Boutique hotel near Kiyomizu-dera'
          ],
          suggestedDates: {
            start: addDays(new Date(), 60),
            end: addDays(new Date(), 67)
          },
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000'
        },
        {
          id: '2',
          destination: 'Amalfi Coast, Italy',
          description: 'Your love for Italian cuisine in Rome and preference for beautiful settings suggests you\'d enjoy the stunning Amalfi Coast with its combination of amazing food, picturesque towns, and Mediterranean charm.',
          matchScore: 88,
          basedOn: [
            {
              memory: 'Rome, Italy',
              reason: 'You loved authentic Italian cuisine and rated it 5/5'
            },
            {
              memory: 'Bali, Indonesia',
              reason: 'You enjoyed beautiful natural settings and relaxation'
            }
          ],
          suggestedActivities: [
            'Boat tour along the coast',
            'Visit Positano and Ravello',
            'Limoncello tasting',
            'Dine at cliffside restaurants'
          ],
          suggestedAccommodations: [
            'Boutique hotel with sea view in Positano',
            'Villa rental in Ravello'
          ],
          suggestedDates: {
            start: addDays(new Date(), 90),
            end: addDays(new Date(), 97)
          },
          image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&q=80&w=2000'
        },
        {
          id: '3',
          destination: 'Chiang Mai, Thailand',
          description: 'Based on your interest in Asian culture from your Tokyo trip and your enjoyment of authentic experiences, Chiang Mai offers a perfect blend of cultural immersion, amazing food, and beautiful temples in a less crowded setting than what you experienced in Times Square.',
          matchScore: 85,
          basedOn: [
            {
              memory: 'Tokyo, Japan',
              reason: 'You enjoyed Asian culture and rated it highly'
            },
            {
              memory: 'New York City, USA',
              reason: 'You noted it was too crowded, suggesting you might prefer less touristy destinations'
            }
          ],
          suggestedActivities: [
            'Thai cooking class',
            'Visit Doi Suthep Temple',
            'Elephant sanctuary visit',
            'Explore the night markets'
          ],
          suggestedAccommodations: [
            'Boutique hotel in Old City',
            'Riverside resort outside the city'
          ],
          suggestedDates: {
            start: addDays(new Date(), 120),
            end: addDays(new Date(), 127)
          },
          image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=2000'
        }
      ];
      
      setMemories(mockMemories);
      setPreferences(mockPreferences);
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching memories and preferences:', error);
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would generate new recommendations
      // For demo purposes, we'll just use the existing ones
      setActiveTab('recommendations');
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTypeIcon = (type: string, size = 20) => {
    switch (type) {
      case 'trip':
        return <Plane size={size} />;
      case 'activity':
        return <Zap size={size} />;
      case 'accommodation':
        return <Hotel size={size} />;
      case 'dining':
        return <Utensils size={size} />;
      case 'transport':
        return <Car size={size} />;
      default:
        return <Compass size={size} />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-600';
      case 'neutral':
        return 'bg-blue-100 text-blue-600';
      case 'negative':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getFilteredMemories = () => {
    let filtered = [...memories];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(memory => 
        memory.destination.toLowerCase().includes(term) ||
        (memory.location && memory.location.toLowerCase().includes(term)) ||
        (memory.notes && memory.notes.toLowerCase().includes(term)) ||
        memory.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(memory => memory.type === typeFilter);
    }
    
    // Apply sentiment filter
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(memory => memory.sentiment === sentimentFilter);
    }
    
    return filtered;
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

  const filteredMemories = getFilteredMemories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Memory-Based AI Planning</h1>
              <p className="text-gray-600">Get personalized travel recommendations based on your past experiences</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRecommendations}
              disabled={isGenerating || memories.length === 0}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Recommendations</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('memories')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'memories'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Travel Memories
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'preferences'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Your Preferences
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'recommendations'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                AI Recommendations
              </button>
            </div>

            <div className="p-6">
              {/* Memories Tab */}
              {activeTab === 'memories' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Filters */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search memories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="trip">Trips</option>
                      <option value="activity">Activities</option>
                      <option value="accommodation">Accommodations</option>
                      <option value="dining">Dining</option>
                      <option value="transport">Transportation</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={sentimentFilter}
                      onChange={(e) => setSentimentFilter(e.target.value)}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Sentiments</option>
                      <option value="positive">Positive</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                  
                  {/* Memories List */}
                  {memories.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Brain className="mx-auto mb-4 text-gray-300" size={48} />
                      <h3 className="text-xl font-semibold mb-2">No travel memories yet</h3>
                      <p className="text-gray-500 mb-6">
                        Your travel memories will be automatically collected from your trips, reviews, and photos
                      </p>
                    </div>
                  ) : filteredMemories.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Filter className="mx-auto mb-4 text-gray-300" size={48} />
                      <h3 className="text-xl font-semibold mb-2">No memories match your filters</h3>
                      <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredMemories.map((memory) => (
                        <motion.div
                          key={memory.id}
                          variants={itemVariants}
                          className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                          onClick={() => setSelectedMemory(memory)}
                        >
                          {memory.photos && memory.photos.length > 0 ? (
                            <div className="h-40 overflow-hidden">
                              <img
                                src={memory.photos[0]}
                                alt={memory.destination}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-40 bg-gray-100 flex items-center justify-center">
                              {getTypeIcon(memory.type, 48)}
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold">{memory.destination}</h3>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < memory.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                            </div>
                            {memory.location && (
                              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                <MapPin size={14} />
                                <span>{memory.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{format(memory.date, 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className={`px-2 py-0.5 rounded-full text-xs ${getSentimentColor(memory.sentiment)}`}>
                                  {memory.sentiment.charAt(0).toUpperCase() + memory.sentiment.slice(1)}
                                </div>
                              </div>
                            </div>
                            {memory.notes && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{memory.notes}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {memory.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {memory.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{memory.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="text-purple-600" size={24} />
                      <h3 className="text-lg font-semibold">Your Travel Preferences</h3>
                    </div>
                    <p className="text-gray-600">
                      These preferences are automatically derived from your travel memories and feedback.
                      The AI uses this information to generate personalized recommendations.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {preferences.map((preference, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-white rounded-lg border p-6"
                      >
                        <h3 className="font-bold mb-4">{preference.category}</h3>
                        <div className="space-y-4">
                          {preference.items.map((item, itemIndex) => (
                            <div key={itemIndex}>
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                  <span>{item.name}</span>
                                  <span className="text-xs text-gray-500">({item.count} memories)</span>
                                </div>
                                <span className="text-sm font-medium">
                                  {Math.round(item.score * 100)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${item.score * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles className="text-purple-600 mt-1" size={24} />
                      <div>
                        <h3 className="font-bold text-purple-800">How AI Uses Your Preferences</h3>
                        <p className="text-purple-700">
                          Our AI analyzes your travel memories, ratings, and feedback to understand your preferences.
                          It identifies patterns in the types of destinations, accommodations, and activities you enjoy,
                          then uses this information to generate highly personalized travel recommendations that match your unique travel style.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={generateRecommendations}
                        disabled={isGenerating}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} />
                            <span>Generate Recommendations</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {recommendations.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Compass className="mx-auto mb-4 text-gray-300" size={48} />
                      <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
                      <p className="text-gray-500 mb-6">
                        Generate personalized recommendations based on your travel memories and preferences
                      </p>
                      <button
                        onClick={generateRecommendations}
                        disabled={isGenerating || memories.length === 0}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Recommendations'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {recommendations.map((recommendation) => (
                        <motion.div
                          key={recommendation.id}
                          variants={itemVariants}
                          className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="h-full">
                              <img
                                src={recommendation.image}
                                alt={recommendation.destination}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="md:col-span-2 p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-bold">{recommendation.destination}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                                      {recommendation.matchScore}% Match
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Calendar size={14} />
                                      <span>
                                        {format(recommendation.suggestedDates.start, 'MMM d')} - {format(recommendation.suggestedDates.end, 'MMM d, yyyy')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedRecommendation(recommendation)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{recommendation.description}</p>
                              
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Based on your memories of:</h4>
                                <div className="space-y-2">
                                  {recommendation.basedOn.map((memory, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <Brain size={16} className="text-purple-500 mt-1" />
                                      <div>
                                        <p className="font-medium">{memory.memory}</p>
                                        <p className="text-sm text-gray-500">{memory.reason}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {recommendation.suggestedActivities.slice(0, 3).map((activity, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                  >
                                    {activity}
                                  </span>
                                ))}
                                {recommendation.suggestedActivities.length > 3 && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                    +{recommendation.suggestedActivities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
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
              <div className="relative">
                {selectedMemory.photos && selectedMemory.photos.length > 0 ? (
                  <img
                    src={selectedMemory.photos[0]}
                    alt={selectedMemory.destination}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    {getTypeIcon(selectedMemory.type, 64)}
                  </div>
                )}
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(selectedMemory.sentiment)}`}>
                    {selectedMemory.sentiment.charAt(0).toUpperCase() + selectedMemory.sentiment.slice(1)} Memory
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMemory.destination}</h2>
                    {selectedMemory.location && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin size={16} />
                        <span>{selectedMemory.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < selectedMemory.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{format(selectedMemory.date, 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="p-1 rounded-full bg-gray-100">
                      {getTypeIcon(selectedMemory.type, 16)}
                    </div>
                    <span className="capitalize">{selectedMemory.type}</span>
                  </div>
                </div>
                
                {selectedMemory.notes && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-gray-600">{selectedMemory.notes}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMemory.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">AI Insights</h3>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Brain className="text-purple-600 mt-1" size={20} />
                      <div>
                        <p className="text-purple-800">
                          This memory has been analyzed to understand your preferences for{' '}
                          <span className="font-medium">{selectedMemory.type === 'trip' ? 'destinations' : selectedMemory.type + 's'}</span>.
                          {selectedMemory.sentiment === 'positive' && ' Your positive experience here suggests similar experiences might be enjoyable for you.'}
                          {selectedMemory.sentiment === 'negative' && ' Your negative experience here helps us understand what to avoid in future recommendations.'}
                        </p>
                        <p className="text-purple-700 mt-2">
                          Key elements: {selectedMemory.tags.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendation Detail Modal */}
      <AnimatePresence>
        {selectedRecommendation && (
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
              <div className="relative">
                <img
                  src={selectedRecommendation.image}
                  alt={selectedRecommendation.destination}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                    {selectedRecommendation.matchScore}% Match
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedRecommendation.destination}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Calendar size={16} />
                  <span>
                    Suggested dates: {format(selectedRecommendation.suggestedDates.start, 'MMM d')} - {format(selectedRecommendation.suggestedDates.end, 'MMM d, yyyy')}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedRecommendation.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Suggested Activities</h3>
                    <ul className="space-y-2">
                      {selectedRecommendation.suggestedActivities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Zap size={16} className="text-blue-500 mt-1" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Suggested Accommodations</h3>
                    <ul className="space-y-2">
                      {selectedRecommendation.suggestedAccommodations.map((accommodation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Hotel size={16} className="text-green-500 mt-1" />
                          <span>{accommodation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-3">Why We Recommended This</h3>
                  <div className="space-y-3">
                    {selectedRecommendation.basedOn.map((memory, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Brain className="text-purple-600 mt-1" size={20} />
                        <div>
                          <p className="font-medium">{memory.memory}</p>
                          <p className="text-sm text-gray-600">{memory.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedRecommendation(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plane size={20} />
                    <span>Plan This Trip</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryBasedPlanning;