import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Heart, Star, Zap, Plane, Hotel, 
  Utensils, Camera, Music, Map, Calendar, Users, 
  DollarSign, Download, Share2, Sparkles, Loader,
  Plus, X, Check, ArrowRight, Shuffle, Save, Filter,
  Search, Briefcase, Coffee, Book, Umbrella, Wind,
  Eye, Trash2, Droplets, Sun, Building, ShoppingBag,
  Landmark, Palette, Mountain, Home
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface TravelStyle {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  traits: {
    category: string;
    items: {
      name: string;
      score: number;
    }[];
  }[];
  recommendedDestinations: {
    name: string;
    score: number;
    image?: string;
  }[];
  idealTrip: {
    duration: {
      min: number;
      max: number;
      ideal: number;
    };
    budget: {
      level: 'budget' | 'moderate' | 'luxury';
      range: {
        min: number;
        max: number;
      };
    };
    pace: 'slow' | 'moderate' | 'fast';
    accommodations: string[];
    activities: string[];
    transportation: string[];
  };
  compatibleStyles: {
    name: string;
    score: number;
  }[];
}

interface TravelPreference {
  category: string;
  options: string[];
  selectedOptions: string[];
}

const TravelStyleMatcher: React.FC = () => {
  const { user } = useAuth();
  const [travelStyles, setTravelStyles] = useState<TravelStyle[]>([]);
  const [matchedStyle, setMatchedStyle] = useState<TravelStyle | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<TravelPreference[]>([
    {
      category: 'Activities',
      options: ['Beach', 'Hiking', 'Museums', 'Nightlife', 'Shopping', 'Food Tours', 'Wildlife', 'Festivals', 'Spa', 'Adventure Sports'],
      selectedOptions: []
    },
    {
      category: 'Accommodation',
      options: ['Luxury Hotels', 'Boutique Hotels', 'Hostels', 'Vacation Rentals', 'Resorts', 'Camping', 'Glamping', 'Homestays'],
      selectedOptions: []
    },
    {
      category: 'Budget',
      options: ['Budget-Friendly', 'Mid-Range', 'Luxury', 'No Limit'],
      selectedOptions: []
    },
    {
      category: 'Pace',
      options: ['Relaxed', 'Moderate', 'Fast-Paced'],
      selectedOptions: []
    },
    {
      category: 'Travel Companions',
      options: ['Solo', 'Couple', 'Family', 'Friends', 'Group'],
      selectedOptions: []
    }
  ]);
  const [savedStyles, setSavedStyles] = useState<TravelStyle[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [styleName, setStyleName] = useState('');
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  useEffect(() => {
    fetchTravelStyles();
  }, []);

  const fetchTravelStyles = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockStyles: TravelStyle[] = [
        {
          id: '1',
          name: 'Cultural Explorer',
          description: 'You are drawn to the rich tapestry of human history and expression. Your ideal trip involves museums, historical sites, and immersive cultural experiences.',
          matchScore: 92,
          traits: [
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
          recommendedDestinations: [
            { name: 'Rome', score: 0.95, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Kyoto', score: 0.9, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Paris', score: 0.85, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000' }
          ],
          idealTrip: {
            duration: {
              min: 7,
              max: 14,
              ideal: 10
            },
            budget: {
              level: 'moderate',
              range: {
                min: 150,
                max: 300
              }
            },
            pace: 'moderate',
            accommodations: ['Boutique Hotels', 'Historic Properties', 'City Apartments'],
            activities: ['Museum Tours', 'Historical Sites', 'Cultural Workshops', 'Local Festivals'],
            transportation: ['Public Transit', 'Walking Tours', 'Guided Excursions']
          },
          compatibleStyles: [
            { name: 'Luxury Traveler', score: 0.8 },
            { name: 'Urban Explorer', score: 0.85 },
            { name: 'Foodie Traveler', score: 0.75 }
          ]
        },
        {
          id: '2',
          name: 'Adventure Seeker',
          description: 'You thrive on adrenaline and seek out unique experiences that push your boundaries. Your ideal trip combines outdoor adventures with authentic cultural immersion.',
          matchScore: 85,
          traits: [
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
          recommendedDestinations: [
            { name: 'New Zealand', score: 0.95, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Costa Rica', score: 0.9, image: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Thailand', score: 0.85, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=2000' }
          ],
          idealTrip: {
            duration: {
              min: 10,
              max: 21,
              ideal: 14
            },
            budget: {
              level: 'moderate',
              range: {
                min: 100,
                max: 200
              }
            },
            pace: 'moderate',
            accommodations: ['Eco Lodges', 'Boutique Hotels', 'Hostels'],
            activities: ['Hiking', 'Snorkeling', 'Zip-lining', 'Local Markets'],
            transportation: ['Rental Car', 'Public Transit', 'Domestic Flights']
          },
          compatibleStyles: [
            { name: 'Nature Lover', score: 0.9 },
            { name: 'Backpacker', score: 0.8 },
            { name: 'Cultural Explorer', score: 0.7 }
          ]
        },
        {
          id: '3',
          name: 'Luxury Traveler',
          description: 'You appreciate the finer things in life and seek out premium experiences. Your ideal trip includes upscale accommodations, fine dining, and exclusive activities.',
          matchScore: 78,
          traits: [
            {
              category: 'Activities',
              items: [
                { name: 'Fine Dining', score: 0.9 },
                { name: 'Spa Treatments', score: 0.9 },
                { name: 'Private Tours', score: 0.8 },
                { name: 'Shopping', score: 0.7 }
              ]
            },
            {
              category: 'Accommodations',
              items: [
                { name: 'Luxury Hotels', score: 0.95 },
                { name: 'Private Villas', score: 0.9 },
                { name: 'Boutique Hotels', score: 0.8 }
              ]
            },
            {
              category: 'Dining',
              items: [
                { name: 'Fine Dining', score: 0.95 },
                { name: 'Wine Tasting', score: 0.9 },
                { name: 'Michelin Star Restaurants', score: 0.85 }
              ]
            }
          ],
          recommendedDestinations: [
            { name: 'Maldives', score: 0.95, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Monaco', score: 0.9, image: 'https://images.unsplash.com/photo-1551802269-fb5dba6d282e?auto=format&fit=crop&q=80&w=2000' },
            { name: 'Dubai', score: 0.85, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000' }
          ],
          idealTrip: {
            duration: {
              min: 7,
              max: 14,
              ideal: 10
            },
            budget: {
              level: 'luxury',
              range: {
                min: 500,
                max: 1000
              }
            },
            pace: 'slow',
            accommodations: ['Luxury Hotels', 'Private Villas', 'Boutique Hotels'],
            activities: ['Fine Dining', 'Spa Treatments', 'Private Tours', 'Shopping'],
            transportation: ['Business Class Flights', 'Private Transfers', 'Luxury Car Rentals']
          },
          compatibleStyles: [
            { name: 'Cultural Explorer', score: 0.8 },
            { name: 'Foodie Traveler', score: 0.85 },
            { name: 'Relaxation Seeker', score: 0.75 }
          ]
        }
      ];
      
      setTravelStyles(mockStyles);
      setSavedStyles(mockStyles.slice(0, 1));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching travel styles:', error);
      setIsLoading(false);
    }
  };

  const matchTravelStyle = async () => {
    setIsMatching(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate a mock matched style based on selected preferences
      const allSelectedOptions = preferences.flatMap(pref => pref.selectedOptions);
      
      let matchedStyleId = '1'; // Default to Cultural Explorer
      
      // Simple matching logic based on selected preferences
      if (allSelectedOptions.includes('Hiking') || allSelectedOptions.includes('Adventure Sports')) {
        matchedStyleId = '2'; // Adventure Seeker
      } else if (allSelectedOptions.includes('Luxury Hotels') || allSelectedOptions.includes('Luxury')) {
        matchedStyleId = '3'; // Luxury Traveler
      }
      
      const style = travelStyles.find(style => style.id === matchedStyleId);
      if (style) {
        // Adjust match score based on how many preferences match
        const matchedPreferences = style.traits.flatMap(trait => 
          trait.items.map(item => item.name.toLowerCase())
        ).filter(item => 
          allSelectedOptions.some(pref => pref.toLowerCase().includes(item))
        );
        
        const adjustedScore = Math.min(100, 70 + matchedPreferences.length * 5);
        
        setMatchedStyle({
          ...style,
          matchScore: adjustedScore
        });
      }
    } catch (error) {
      console.error('Error matching travel style:', error);
    } finally {
      setIsMatching(false);
    }
  };

  const saveStyle = () => {
    if (!matchedStyle || !styleName) return;
    
    const savedStyle = {
      ...matchedStyle,
      id: Date.now().toString(),
      name: styleName
    };
    
    setSavedStyles([...savedStyles, savedStyle]);
    setShowSaveModal(false);
    setStyleName('');
  };

  const togglePreference = (category: string, option: string) => {
    setPreferences(preferences.map(pref => {
      if (pref.category === category) {
        const isSelected = pref.selectedOptions.includes(option);
        return {
          ...pref,
          selectedOptions: isSelected
            ? pref.selectedOptions.filter(item => item !== option)
            : [...pref.selectedOptions, option]
        };
      }
      return pref;
    }));
  };

  const startQuiz = () => {
    setShowQuizMode(true);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
  };

  const answerQuizQuestion = (answer: string) => {
    setQuizAnswers([...quizAnswers, answer]);
    
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Process quiz results
      processQuizResults();
    }
  };

  const processQuizResults = async () => {
    setIsMatching(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple matching logic based on quiz answers
      let matchedStyleId = '1'; // Default to Cultural Explorer
      
      if (quizAnswers.includes('Hiking through mountains') || quizAnswers.includes('Trying an extreme sport')) {
        matchedStyleId = '2'; // Adventure Seeker
      } else if (quizAnswers.includes('Staying at a 5-star hotel') || quizAnswers.includes('Fine dining at a Michelin-star restaurant')) {
        matchedStyleId = '3'; // Luxury Traveler
      }
      
      const style = travelStyles.find(style => style.id === matchedStyleId);
      if (style) {
        setMatchedStyle(style);
      }
      
      setShowQuizMode(false);
    } catch (error) {
      console.error('Error processing quiz results:', error);
    } finally {
      setIsMatching(false);
    }
  };

  const quizQuestions = [
    {
      question: 'What would be your ideal day on vacation?',
      options: [
        'Exploring museums and historical sites',
        'Hiking through mountains',
        'Relaxing at a beach resort',
        'Staying at a 5-star hotel'
      ]
    },
    {
      question: 'Which activity excites you the most?',
      options: [
        'Visiting a local market',
        'Trying an extreme sport',
        'Taking a cooking class',
        'Fine dining at a Michelin-star restaurant'
      ]
    },
    {
      question: 'How do you prefer to get around a new destination?',
      options: [
        'Public transportation to experience local life',
        'Renting a car for maximum freedom',
        'Walking or cycling to explore at my own pace',
        'Private transfers and guided tours'
      ]
    },
    {
      question: 'What is your ideal accommodation?',
      options: [
        'Boutique hotels with local character',
        'Eco-lodges or camping',
        'Vacation rentals to live like a local',
        'Luxury hotels with all amenities'
      ]
    },
    {
      question: 'What is most important to you when traveling?',
      options: [
        'Learning about different cultures',
        'Seeking thrilling experiences',
        'Finding authentic local experiences',
        'Comfort and premium service'
      ]
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading travel styles...</p>
        </div>
      </div>
    );
  }

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
              <Compass className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Travel Style Matcher
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Discover your unique travel personality and get matched with your ideal destinations
            </motion.p>
          </div>

          {/* Quick Match Options */}
          {!matchedStyle && !showQuizMode && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-4 justify-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                <span>Take Quick Style Quiz</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {}}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plane size={20} />
                <span>Import Travel History</span>
              </motion.button>
            </motion.div>
          )}

          {/* Quiz Mode */}
          <AnimatePresence>
            {showQuizMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Travel Style Quiz</h2>
                    <div className="text-sm text-gray-500">
                      Question {currentQuizQuestion + 1} of {quizQuestions.length}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-6">{quizQuestions[currentQuizQuestion].question}</h3>
                
                <div className="space-y-4">
                  {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => answerQuizQuestion(option)}
                      className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preference Selection */}
          {!matchedStyle && !showQuizMode && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-xl font-bold mb-6">Select Your Travel Preferences</h2>
              
              <div className="space-y-8">
                {preferences.map((preference) => (
                  <div key={preference.category}>
                    <h3 className="font-semibold mb-4">{preference.category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {preference.options.map((option) => {
                        const isSelected = preference.selectedOptions.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => togglePreference(preference.category, option)}
                            className={`px-4 py-2 rounded-lg border ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-300'
                            } transition-colors`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={matchTravelStyle}
                  disabled={isMatching || preferences.every(pref => pref.selectedOptions.length === 0)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-3 disabled:opacity-50"
                >
                  {isMatching ? (
                    <>
                      <Loader className="animate-spin" size={24} />
                      <span>Finding Your Match...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      <span>Find My Travel Style</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Matched Style Results */}
          <AnimatePresence>
            {matchedStyle && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8"
              >
                {/* Style Overview */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Your Travel Style: {matchedStyle.name}</h2>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {matchedStyle.matchScore}% Match
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Save Style"
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
                  
                  <p className="text-gray-600 mb-6">{matchedStyle.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="text-blue-600" size={20} />
                        <h3 className="font-semibold">Budget</h3>
                      </div>
                      <p className="font-medium">{getBudgetLabel(matchedStyle.idealTrip.budget.level)}</p>
                      <p className="text-sm text-gray-600">${matchedStyle.idealTrip.budget.range.min} - ${matchedStyle.idealTrip.budget.range.max} per day</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="text-blue-600" size={20} />
                        <h3 className="font-semibold">Travel Pace</h3>
                      </div>
                      <p className="font-medium">{getPaceLabel(matchedStyle.idealTrip.pace)}</p>
                      <p className="text-sm text-gray-600">
                        {matchedStyle.idealTrip.pace === 'slow' ? 'Fewer activities, more relaxation' : 
                         matchedStyle.idealTrip.pace === 'fast' ? 'Packed itinerary, maximum experiences' : 
                         'Balanced mix of activities and downtime'}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="text-blue-600" size={20} />
                        <h3 className="font-semibold">Ideal Duration</h3>
                      </div>
                      <p className="font-medium">{matchedStyle.idealTrip.duration.ideal} days</p>
                      <p className="text-sm text-gray-600">Range: {matchedStyle.idealTrip.duration.min} - {matchedStyle.idealTrip.duration.max} days</p>
                    </div>
                  </div>
                </motion.div>

                {/* Top Destinations */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-xl font-bold mb-6">Your Ideal Destinations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {matchedStyle.recommendedDestinations.map((destination, index) => (
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

                {/* Travel Traits */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-xl font-bold mb-6">Your Travel Traits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Top Activities</h3>
                      <div className="space-y-4">
                        {matchedStyle.traits[0].items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              {item.name === 'Hiking' ? <Compass size={20} className="text-blue-600" /> :
                               item.name === 'Museums' ? <Briefcase size={20} className="text-blue-600" /> :
                               item.name === 'Fine Dining' ? <Utensils size={20} className="text-blue-600" /> :
                               item.name === 'Snorkeling' ? <Umbrella size={20} className="text-blue-600" /> :
                               <Camera size={20} className="text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <span className="text-sm text-blue-600 font-medium">
                                  {(item.score * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 rounded-full"
                                  style={{ width: `${item.score * 100}%` }}
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
                        {matchedStyle.traits[1].items.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <span className="text-sm text-blue-600 font-medium">
                                {(item.score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${item.score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="font-semibold mt-8 mb-4">Dining Preferences</h3>
                      <div className="space-y-4">
                        {matchedStyle.traits[2].items.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <span className="text-sm text-blue-600 font-medium">
                                {(item.score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${item.score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Compatible Styles */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-xl font-bold mb-6">Compatible Travel Styles</h2>
                  <p className="text-gray-600 mb-6">
                    These travel styles complement your preferences and could be great for traveling with companions who have different preferences.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {matchedStyle.compatibleStyles.map((style, index) => (
                      <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg mb-2">{style.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                            {(style.score * 100).toFixed(0)}% Compatible
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const compatibleStyle = travelStyles.find(s => s.name === style.name);
                            if (compatibleStyle) {
                              setMatchedStyle(compatibleStyle);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View Style
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    ))}
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
                    onClick={() => setMatchedStyle(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Filter size={20} />
                    <span>Adjust Preferences</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSaveModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    <span>Save This Style</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Save Style Modal */}
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
                <h3 className="text-xl font-bold">Save Your Travel Style</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style Name
                </label>
                <input
                  type="text"
                  value={styleName}
                  onChange={(e) => setStyleName(e.target.value)}
                  placeholder="Give your travel style a name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onClick={saveStyle}
                  disabled={!styleName.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TravelStyleMatcher;