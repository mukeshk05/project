import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Plane, Calendar, Users, DollarSign, Shuffle,
  MapPin, Clock, Briefcase, Loader, Check, Download, Share2
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface TripSuggestion {
  id: string;
  destination: string;
  description: string;
  dates: {
    start: Date;
    end: Date;
  };
  duration: number;
  budget: number;
  image: string;
  activities: string[];
  accommodation: {
    name: string;
    type: string;
    rating: number;
  };
  transportation: string;
  weather: string;
  travelStyle: string;
}

const SurpriseMeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<TripSuggestion | null>(null);
  const [preferences, setPreferences] = useState({
    budget: 'medium', // low, medium, high
    duration: 'week', // weekend, week, twoWeeks
    style: 'any', // adventure, relaxation, culture, any
    climate: 'any', // warm, cold, mild, any
  });

  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSuggestions: TripSuggestion[] = [
        {
          id: '1',
          destination: 'Kyoto, Japan',
          description: 'Immerse yourself in traditional Japanese culture with ancient temples, beautiful gardens, and authentic cuisine.',
          dates: {
            start: addDays(new Date(), 30),
            end: addDays(new Date(), 37),
          },
          duration: 7,
          budget: 2500,
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000',
          activities: [
            'Visit Fushimi Inari Shrine',
            'Explore Arashiyama Bamboo Grove',
            'Experience a traditional tea ceremony',
            'Day trip to Nara to see the deer park',
            'Stroll through Gion district'
          ],
          accommodation: {
            name: 'Traditional Ryokan Stay',
            type: 'Ryokan',
            rating: 4.8
          },
          transportation: 'Japan Rail Pass + Local Subway',
          weather: 'Mild temperatures with possible light rain',
          travelStyle: 'Cultural Immersion'
        },
        {
          id: '2',
          destination: 'Costa Rica',
          description: 'Experience the perfect blend of adventure and relaxation with rainforests, volcanoes, and pristine beaches.',
          dates: {
            start: addDays(new Date(), 45),
            end: addDays(new Date(), 53),
          },
          duration: 8,
          budget: 1800,
          image: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&q=80&w=2000',
          activities: [
            'Zip-lining through Monteverde Cloud Forest',
            'Wildlife watching in Manuel Antonio National Park',
            'Relaxing at Tamarindo Beach',
            'Hiking around Arenal Volcano',
            'White water rafting on Pacuare River'
          ],
          accommodation: {
            name: 'Eco-Friendly Jungle Lodge',
            type: 'Lodge',
            rating: 4.6
          },
          transportation: 'Rental Car + Domestic Flights',
          weather: 'Warm and humid with afternoon showers',
          travelStyle: 'Adventure & Nature'
        },
        {
          id: '3',
          destination: 'Santorini, Greece',
          description: 'Enjoy breathtaking views, stunning sunsets, and the iconic white and blue architecture of this beautiful island.',
          dates: {
            start: addDays(new Date(), 60),
            end: addDays(new Date(), 66),
          },
          duration: 6,
          budget: 2200,
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
          activities: [
            'Watch the sunset in Oia',
            'Visit the ancient ruins of Akrotiri',
            'Wine tasting tour of local vineyards',
            'Boat tour of the caldera',
            'Relax on Red Beach'
          ],
          accommodation: {
            name: 'Cliffside Boutique Hotel',
            type: 'Boutique Hotel',
            rating: 4.9
          },
          transportation: 'Ferry + Local Bus + ATV Rental',
          weather: 'Warm and sunny with cool evenings',
          travelStyle: 'Romantic Getaway'
        }
      ];
      
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTrip = async (trip: TripSuggestion) => {
    try {
      // In a real app, this would save to a database
      console.log('Saving trip:', trip);
      alert('Trip saved successfully!');
    } catch (error) {
      console.error('Error saving trip:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold">Surprise Me</h1>
          </div>

          {!selectedSuggestion ? (
            <>
              <motion.div variants={itemVariants} className="mb-8">
                <p className="text-lg text-gray-600 mb-6">
                  Let our AI surprise you with personalized trip suggestions based on your preferences.
                  Just tell us a few things about what you're looking for, and we'll do the rest!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      value={preferences.budget}
                      onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Budget-Friendly (Under $1500)</option>
                      <option value="medium">Mid-Range ($1500-$3000)</option>
                      <option value="high">Luxury ($3000+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Duration
                    </label>
                    <select
                      value={preferences.duration}
                      onChange={(e) => setPreferences({ ...preferences, duration: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="weekend">Weekend Getaway (2-4 days)</option>
                      <option value="week">One Week (5-9 days)</option>
                      <option value="twoWeeks">Two Weeks+ (10+ days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Style
                    </label>
                    <select
                      value={preferences.style}
                      onChange={(e) => setPreferences({ ...preferences, style: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="any">Surprise Me (Any Style)</option>
                      <option value="adventure">Adventure & Outdoor</option>
                      <option value="relaxation">Relaxation & Wellness</option>
                      <option value="culture">Cultural & Historical</option>
                      <option value="food">Food & Culinary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Climate
                    </label>
                    <select
                      value={preferences.climate}
                      onChange={(e) => setPreferences({ ...preferences, climate: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="any">Any Climate</option>
                      <option value="warm">Warm & Sunny</option>
                      <option value="cold">Cold & Snowy</option>
                      <option value="mild">Mild & Temperate</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateSuggestions}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all flex items-center gap-3 text-lg font-medium disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="animate-spin" size={24} />
                        <span>Generating Surprises...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={24} />
                        <span>Surprise Me!</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {suggestions.length > 0 && (
                <motion.div variants={containerVariants} className="mt-12">
                  <h2 className="text-xl font-bold mb-6">Your Surprise Destinations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-48">
                          <img
                            src={suggestion.image}
                            alt={suggestion.destination}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-xl font-bold text-white">{suggestion.destination}</h3>
                            <p className="text-white/80 text-sm">{suggestion.travelStyle}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>{suggestion.duration} days</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={16} />
                              <span>${suggestion.budget}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-3">{suggestion.description}</p>
                          <button
                            onClick={() => setSelectedSuggestion(suggestion)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateSuggestions}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mx-auto"
                    >
                      <Shuffle size={20} />
                      <span>Generate More Surprises</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-start">
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  ← Back to suggestions
                </button>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                  >
                    <Share2 size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                  >
                    <Download size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden">
                <img
                  src={selectedSuggestion.image}
                  alt={selectedSuggestion.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedSuggestion.destination}</h2>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Calendar size={18} />
                      <span>{format(selectedSuggestion.dates.start, 'MMM d')} - {format(selectedSuggestion.dates.end, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={18} />
                      <span>{selectedSuggestion.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={18} />
                      <span>{selectedSuggestion.travelStyle}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-4">Trip Overview</h3>
                  <p className="text-gray-600 mb-6">{selectedSuggestion.description}</p>
                  
                  <h3 className="text-xl font-bold mb-4">Suggested Activities</h3>
                  <ul className="space-y-3 mb-6">
                    {selectedSuggestion.activities.map((activity, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check size={18} className="text-green-500" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Transportation</h4>
                      <p>{selectedSuggestion.transportation}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Weather</h4>
                      <p>{selectedSuggestion.weather}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Trip Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Destination</p>
                        <p className="font-medium">{selectedSuggestion.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dates</p>
                        <p className="font-medium">
                          {format(selectedSuggestion.dates.start, 'MMMM d')} - {format(selectedSuggestion.dates.end, 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Accommodation</p>
                        <p className="font-medium">{selectedSuggestion.accommodation.name}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <span>{selectedSuggestion.accommodation.type}</span>
                          <span>•</span>
                          <span>{selectedSuggestion.accommodation.rating} ★</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Budget</p>
                        <p className="text-2xl font-bold text-blue-600">${selectedSuggestion.budget}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => saveTrip(selectedSuggestion)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6"
                    >
                      Save This Trip
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SurpriseMeGenerator;