import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dna, Compass, Heart, Star, Zap, Plane, Hotel, 
  Utensils, Camera, Music, Map, Calendar, Users, 
  DollarSign, Download, Share2, Sparkles, Loader,
  Plus, X, Check, ArrowRight, Shuffle, Save
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface TravelPreference {
  category: string;
  items: {
    name: string;
    score: number;
  }[];
}

interface TripDna {
  id: string;
  name: string;
  description: string;
  preferences: TravelPreference[];
  matchScore: number;
  createdAt: Date;
  destinations: {
    name: string;
    score: number;
    image?: string;
  }[];
  activities: {
    name: string;
    score: number;
    icon: string;
  }[];
  accommodations: {
    type: string;
    score: number;
  }[];
  budget: {
    level: 'budget' | 'moderate' | 'luxury';
    range: {
      min: number;
      max: number;
    };
  };
  pace: 'slow' | 'moderate' | 'fast';
  duration: {
    ideal: number;
    range: {
      min: number;
      max: number;
    };
  };
  seasons: {
    name: string;
    score: number;
  }[];
}

const TripDnaGenerator: React.FC = () => {
  const { user } = useAuth();
  const [tripDna, setTripDna] = useState<TripDna | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedDnas, setSavedDnas] = useState<TripDna[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [newPreference, setNewPreference] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tripName, setTripName] = useState('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareWith, setCompareWith] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedDnas();
  }, []);

  const fetchSavedDnas = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDnas: TripDna[] = [
        {
          id: '1',
          name: 'Adventure Seeker',
          description: 'You thrive on adrenaline and seek out unique experiences that push your boundaries. Your ideal trip combines outdoor adventures with authentic cultural immersion.',
          preferences: [
            {
              category: 'Activities',
              items: [
                { name: 'Hiking', score: 0.9 },
                { name: 'Snorkeling', score: 0.8 },
                { name: 'Cultural Tours', score: 0.7 },
                { name: 'Photography', score: 0.6 }
              ]
            },
            {
              category: 'Accommodations',
              items: [
                { name: 'Boutique Hotels', score: 0.8 },
                { name: 'Eco Lodges', score: 0.7 },
                { name: 'Hostels', score: 0.5 }
              ]
            },
            {
              category: 'Dining',
              items: [
                { name: 'Local Cuisine', score: 0.9 },
                { name: 'Street Food', score: 0.8 },
                { name: 'Food Markets', score: 0.7 }
              ]
            }
          ],
          matchScore: 92,
          createdAt: new Date('2024-02-15'),
          destinations: [
            { name: 'New Zealand', score: 0.95, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Costa Rica', score: 0.9, image: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Thailand', score: 0.85, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=2000' }
          ],
          activities: [
            { name: 'Hiking', score: 0.9, icon: 'mountain' },
            { name: 'Snorkeling', score: 0.85, icon: 'droplets' },
            { name: 'Zip-lining', score: 0.8, icon: 'wind' },
            { name: 'Local Markets', score: 0.75, icon: 'shopping-bag' }
          ],
          accommodations: [
            { type: 'Eco Lodges', score: 0.85 },
            { type: 'Boutique Hotels', score: 0.8 },
            { type: 'Hostels', score: 0.7 }
          ],
          budget: {
            level: 'moderate',
            range: {
              min: 100,
              max: 200
            }
          },
          pace: 'moderate',
          duration: {
            ideal: 14,
            range: {
              min: 10,
              max: 21
            }
          },
          seasons: [
            { name: 'Spring', score: 0.8 },
            { name: 'Fall', score: 0.8 },
            { name: 'Summer', score: 0.7 },
            { name: 'Winter', score: 0.5 }
          ]
        },
        {
          id: '2',
          name: 'Cultural Explorer',
          description: 'You're drawn to the rich tapestry of human history and expression. Your ideal trip involves museums, historical sites, and immersive cultural experiences.',
          preferences: [
            {
              category: 'Activities',
              items: [
                { name: 'Museums', score: 0.9 },
                { name: 'Historical Sites', score: 0.9 },
                { name: 'Local Festivals', score: 0.8 },
                { name: 'Art Galleries', score: 0.7 }
              ]
            },
            {
              category: 'Accommodations',
              items: [
                { name: 'Boutique Hotels', score: 0.9 },
                { name: 'Historic Properties', score: 0.8 },
                { name: 'City Apartments', score: 0.7 }
              ]
            },
            {
              category: 'Dining',
              items: [
                { name: 'Fine Dining', score: 0.8 },
                { name: 'Local Cuisine', score: 0.9 },
                { name: 'Food Tours', score: 0.7 }
              ]
            }
          ],
          matchScore: 85,
          createdAt: new Date('2024-01-20'),
          destinations: [
            { name: 'Rome', score: 0.95, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Kyoto', score: 0.9, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Paris', score: 0.85, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000' }
          ],
          activities: [
            { name: 'Museum Tours', score: 0.9, icon: 'building' },
            { name: 'Historical Sites', score: 0.9, icon: 'landmark' },
            { name: 'Cultural Workshops', score: 0.8, icon: 'palette' },
            { name: 'Local Festivals', score: 0.75, icon: 'music' }
          ],
          accommodations: [
            { type: 'Boutique Hotels', score: 0.9 },
            { type: 'Historic Properties', score: 0.85 },
            { type: 'City Apartments', score: 0.8 }
          ],
          budget: {
            level: 'moderate',
            range: {
              min: 150,
              max: 300
            }
          },
          pace: 'moderate',
          duration: {
            ideal: 10,
            range: {
              min: 7,
              max: 14
            }
          },
          seasons: [
            { name: 'Spring', score: 0.9 },
            { name: 'Fall', score: 0.9 },
            { name: 'Winter', score: 0.7 },
            { name: 'Summer', score: 0.6 }
          ]
        }
      ];
      
      setSavedDnas(mockDnas);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching saved DNAs:', error);
      setIsLoading(false);
    }
  };

  const generateTripDna = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a mock Trip DNA based on selected preferences
      const mockDna: TripDna = {
        id: 'new',
        name: 'Your Travel DNA',
        description: 'You are a balanced traveler who enjoys a mix of relaxation and adventure. You appreciate authentic cultural experiences and natural beauty, with a preference for comfortable accommodations that don\'t break the bank.',
        preferences: [
          {
            category: 'Activities',
            items: [
              { name: 'Beach', score: selectedPreferences.includes('beach') ? 0.9 : 0.5 },
              { name: 'Hiking', score: selectedPreferences.includes('hiking') ? 0.9 : 0.4 },
              { name: 'Museums', score: selectedPreferences.includes('museums') ? 0.9 : 0.6 },
              { name: 'Food Tours', score: selectedPreferences.includes('food') ? 0.9 : 0.7 }
            ]
          },
          {
            category: 'Accommodations',
            items: [
              { name: 'Boutique Hotels', score: selectedPreferences.includes('boutique') ? 0.9 : 0.7 },
              { name: 'Resorts', score: selectedPreferences.includes('resort') ? 0.9 : 0.6 },
              { name: 'Vacation Rentals', score: selectedPreferences.includes('rental') ? 0.9 : 0.8 }
            ]
          },
          {
            category: 'Dining',
            items: [
              { name: 'Local Cuisine', score: selectedPreferences.includes('local food') ? 0.9 : 0.8 },
              { name: 'Fine Dining', score: selectedPreferences.includes('fine dining') ? 0.9 : 0.5 },
              { name: 'Street Food', score: selectedPreferences.includes('street food') ? 0.9 : 0.7 }
            ]
          }
        ],
        matchScore: 88,
        createdAt: new Date(),
        destinations: [
          { 
            name: selectedPreferences.includes('beach') ? 'Bali' : 'Barcelona', 
            score: 0.92, 
            image: selectedPreferences.includes('beach') 
              ? 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000'
              : 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=2000'
          },
          { 
            name: selectedPreferences.includes('hiking') ? 'New Zealand' : 'Japan', 
            score: 0.88, 
            image: selectedPreferences.includes('hiking')
              ? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000'
              : 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000'
          },
          { 
            name: selectedPreferences.includes('museums') ? 'Paris' : 'Thailand', 
            score: 0.85, 
            image: selectedPreferences.includes('museums')
              ? 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000'
              : 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=2000'
          }
        ],
        activities: [
          { 
            name: selectedPreferences.includes('beach') ? 'Beach Relaxation' : 'City Walking Tours', 
            score: 0.9, 
            icon: selectedPreferences.includes('beach') ? 'sun' : 'map'
          },
          { 
            name: selectedPreferences.includes('hiking') ? 'Hiking' : 'Museum Visits', 
            score: 0.85, 
            icon: selectedPreferences.includes('hiking') ? 'mountain' : 'building'
          },
          { 
            name: selectedPreferences.includes('food') ? 'Food Tours' : 'Photography', 
            score: 0.8, 
            icon: selectedPreferences.includes('food') ? 'utensils' : 'camera'
          },
          { 
            name: 'Local Markets', 
            score: 0.75, 
            icon: 'shopping-bag'
          }
        ],
        accommodations: [
          { 
            type: selectedPreferences.includes('boutique') ? 'Boutique Hotels' : 'Mid-range Hotels', 
            score: 0.85 
          },
          { 
            type: selectedPreferences.includes('resort') ? 'Beach Resorts' : 'City Apartments', 
            score: 0.8 
          },
          { 
            type: selectedPreferences.includes('rental') ? 'Vacation Rentals' : 'Guesthouses', 
            score: 0.75 
          }
        ],
        budget: {
          level: selectedPreferences.includes('luxury') ? 'luxury' : selectedPreferences.includes('budget') ? 'budget' : 'moderate',
          range: {
            min: selectedPreferences.includes('luxury') ? 250 : selectedPreferences.includes('budget') ? 50 : 100,
            max: selectedPreferences.includes('luxury') ? 500 : selectedPreferences.includes('budget') ? 100 : 250
          }
        },
        pace: selectedPreferences.includes('relaxed') ? 'slow' : selectedPreferences.includes('active') ? 'fast' : 'moderate',
        duration: {
          ideal: selectedPreferences.includes('short trip') ? 7 : selectedPreferences.includes('long trip') ? 21 : 14,
          range: {
            min: selectedPreferences.includes('short trip') ? 5 : selectedPreferences.includes('long trip') ? 14 : 10,
            max: selectedPreferences.includes('short trip') ? 10 : selectedPreferences.includes('long trip') ? 30 : 21
          }
        },
        seasons: [
          { name: 'Summer', score: selectedPreferences.includes('summer') ? 0.9 : 0.6 },
          { name: 'Fall', score: selectedPreferences.includes('fall') ? 0.9 : 0.7 },
          { name: 'Winter', score: selectedPreferences.includes('winter') ? 0.9 : 0.5 },
          { name: 'Spring', score: selectedPreferences.includes('spring') ? 0.9 : 0.8 }
        ]
      };
      
      setTripDna(mockDna);
    } catch (error) {
      console.error('Error generating trip DNA:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTripDna = () => {
    if (!tripDna || !tripName) return;
    
    const savedDna = {
      ...tripDna,
      id: Date.now().toString(),
      name: tripName,
      createdAt: new Date()
    };
    
    setSavedDnas([...savedDnas, savedDna]);
    setShowSaveModal(false);
    setTripName('');
  };

  const deleteDna = (id: string) => {
    setSavedDnas(savedDnas.filter(dna => dna.id !== id));
  };

  const getActivityIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'mountain':
        return <Mountain size={size} />;
      case 'droplets':
        return <Droplets size={size} />;
      case 'utensils':
        return <Utensils size={size} />;
      case 'camera':
        return <Camera size={size} />;
      case 'music':
        return <Music size={size} />;
      case 'map':
        return <Map size={size} />;
      case 'sun':
        return <Sun size={size} />;
      case 'building':
        return <Building size={size} />;
      case 'shopping-bag':
        return <ShoppingBag size={size} />;
      case 'landmark':
        return <Landmark size={size} />;
      case 'palette':
        return <Palette size={size} />;
      case 'wind':
        return <Wind size={size} />;
      default:
        return <Zap size={size} />;
    }
  };

  const getBudgetLabel = (level: string) => {
    switch (level) {
      case 'budget':
        return 'Budget-Friendly';
      case 'moderate':
        return 'Mid-Range';
      case 'luxury':
        return 'Luxury';
      default:
        return 'Moderate';
    }
  };

  const getPaceLabel = (pace: string) => {
    switch (pace) {
      case 'slow':
        return 'Relaxed';
      case 'moderate':
        return 'Balanced';
      case 'fast':
        return 'Active';
      default:
        return 'Balanced';
    }
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

  const preferenceOptions = [
    'beach', 'hiking', 'museums', 'food', 'luxury', 'budget', 
    'boutique', 'resort', 'rental', 'relaxed', 'active', 
    'short trip', 'long trip', 'summer', 'winter', 'spring', 'fall',
    'adventure', 'culture', 'nature', 'urban', 'rural', 'nightlife',
    'shopping', 'wellness', 'photography', 'local food', 'fine dining', 'street food'
  ];

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
          <div className="text-center mb-8">
            <motion.div
              variants={itemVariants}
              className="inline-block p-4 bg-white rounded-full shadow-lg mb-4"
            >
              <Dna className="w-12 h-12 text-purple-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Trip DNA Generator
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Discover your unique travel personality and get personalized destination recommendations
            </motion.p>
          </div>

          {/* Preference Selection */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6">Select Your Travel Preferences</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedPreferences.map((preference) => (
                <div
                  key={preference}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-full"
                >
                  <span>{preference}</span>
                  <button
                    onClick={() => setSelectedPreferences(selectedPreferences.filter(p => p !== preference))}
                    className="hover:text-purple-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {selectedPreferences.length === 0 && (
                <p className="text-gray-500">No preferences selected yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreferenceModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span>Add Preferences</span>
              </button>
              <button
                onClick={() => setSelectedPreferences([])}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={selectedPreferences.length === 0}
              >
                Clear All
              </button>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateTripDna}
              disabled={isGenerating || selectedPreferences.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  <span>Generating Your Trip DNA...</span>
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  <span>Generate My Trip DNA</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {tripDna && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8"
              >
                {/* DNA Overview */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{tripDna.name}</h2>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                          {tripDna.matchScore}% Match
                        </div>
                        <div className="text-sm text-gray-500">
                          Generated {format(tripDna.createdAt, 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                        title="Save DNA"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={() => {}}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        title="Download"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => {}}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        title="Share"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{tripDna.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="text-purple-600" size={20} />
                        <h3 className="font-semibold">Budget</h3>
                      </div>
                      <p className="font-medium">{getBudgetLabel(tripDna.budget.level)}</p>
                      <p className="text-sm text-gray-600">${tripDna.budget.range.min} - ${tripDna.budget.range.max} per day</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="text-purple-600" size={20} />
                        <h3 className="font-semibold">Travel Pace</h3>
                      </div>
                      <p className="font-medium">{getPaceLabel(tripDna.pace)}</p>
                      <p className="text-sm text-gray-600">
                        {tripDna.pace === 'slow' ? 'Fewer activities, more relaxation' : 
                         tripDna.pace === 'fast' ? 'Packed itinerary, maximum experiences' : 
                         'Balanced mix of activities and downtime'}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="text-purple-600" size={20} />
                        <h3 className="font-semibold">Ideal Duration</h3>
                      </div>
                      <p className="font-medium">{tripDna.duration.ideal} days</p>
                      <p className="text-sm text-gray-600">Range: {tripDna.duration.range.min} - {tripDna.duration.range.max} days</p>
                    </div>
                  </div>
                </motion.div>

                {/* Top Destinations */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Your Top Destinations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tripDna.destinations.map((destination, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-48">
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-white font-bold text-xl">{destination.name}</h3>
                            <div className="flex items-center gap-2 text-white/90">
                              <Star className="fill-current text-yellow-400" size={16} />
                              <span>{(destination.score * 100).toFixed(0)}% match</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Activity Preferences */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Activity Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Top Activities</h3>
                      <div className="space-y-4">
                        {tripDna.activities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                              {getActivityIcon(activity.icon)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium">{activity.name}</h4>
                                <span className="text-sm text-purple-600 font-medium">
                                  {(activity.score * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-600 rounded-full"
                                  style={{ width: `${activity.score * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Accommodation Preferences</h3>
                      <div className="space-y-4">
                        {tripDna.accommodations.map((accommodation, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium">{accommodation.type}</h4>
                              <span className="text-sm text-purple-600 font-medium">
                                {(accommodation.score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${accommodation.score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="font-semibold mt-8 mb-4">Seasonal Preferences</h3>
                      <div className="space-y-4">
                        {tripDna.seasons.map((season, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium">{season.name}</h4>
                              <span className="text-sm text-purple-600 font-medium">
                                {(season.score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${season.score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSaveModal(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    <span>Save This DNA</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {}}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plane size={20} />
                    <span>Plan a Trip</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved DNAs */}
          {savedDnas.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Saved Trip DNAs</h2>
                {savedDnas.length > 1 && (
                  <button
                    onClick={() => setShowCompareModal(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Shuffle size={18} />
                    <span>Compare DNAs</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedDnas.map((dna) => (
                  <motion.div
                    key={dna.id}
                    whileHover={{ y: -5 }}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{dna.name}</h3>
                        <p className="text-sm text-gray-500">Created {format(dna.createdAt, 'MMM d, yyyy')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                            {dna.matchScore}% Match
                          </div>
                          <div className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {getBudgetLabel(dna.budget.level)}
                          </div>
                          <div className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                            {getPaceLabel(dna.pace)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTripDna(dna)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="View DNA"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => deleteDna(dna.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete DNA"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-4 line-clamp-2">{dna.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {dna.destinations.slice(0, 2).map((destination, index) => (
                        <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{destination.name}</span>
                        </div>
                      ))}
                      {dna.destinations.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{dna.destinations.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Preference Modal */}
      <AnimatePresence>
        {showPreferenceModal && (
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
              className="bg-white rounded-xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Select Travel Preferences</h3>
                <button
                  onClick={() => setShowPreferenceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder="Search or add custom preference..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-3">Common Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {preferenceOptions
                    .filter(option => !selectedPreferences.includes(option))
                    .filter(option => newPreference ? option.includes(newPreference.toLowerCase()) : true)
                    .slice(0, 20)
                    .map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedPreferences([...selectedPreferences, option]);
                          setNewPreference('');
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                </div>
              </div>
              
              {newPreference && !preferenceOptions.includes(newPreference.toLowerCase()) && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setSelectedPreferences([...selectedPreferences, newPreference]);
                      setNewPreference('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add "{newPreference}" as custom preference</span>
                  </button>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPreferenceModal(false)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Save Your Trip DNA</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name Your Trip DNA
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Adventure Seeker, Beach Lover, etc."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveTripDna}
                  disabled={!tripName.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
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
              className="bg-white rounded-xl max-w-4xl w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Compare Trip DNAs</h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select DNAs to Compare
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDnas.map((dna) => (
                    <label key={dna.id} className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compareWith === dna.id}
                        onChange={() => setCompareWith(compareWith === dna.id ? null : dna.id)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <div>
                        <h4 className="font-medium">{dna.name}</h4>
                        <p className="text-sm text-gray-500">{format(dna.createdAt, 'MMM d, yyyy')}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {compareWith && (
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Comparison Results</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Top Destinations</h5>
                      <div className="space-y-2">
                        {savedDnas.find(d => d.id === compareWith)?.destinations.map((destination, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <MapPin size={16} className="text-purple-500" />
                            <span>{destination.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">Top Activities</h5>
                      <div className="space-y-2">
                        {savedDnas.find(d => d.id === compareWith)?.activities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {getActivityIcon(activity.icon, 16)}
                            <span>{activity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h5 className="font-medium mb-3">Compatibility Analysis</h5>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-purple-800">
                        These Trip DNAs are <span className="font-semibold">75% compatible</span>. They share preferences for {savedDnas.find(d => d.id === compareWith)?.activities[0].name} and {savedDnas.find(d => d.id === compareWith)?.activities[1].name}, but differ in budget level and preferred accommodations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // In a real app, this would create a merged DNA
                    setShowCompareModal(false);
                  }}
                  disabled={!compareWith}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles size={20} />
                  <span>Create Hybrid DNA</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripDnaGenerator;