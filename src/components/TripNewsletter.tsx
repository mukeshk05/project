import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, Calendar, MapPin, Plane, Hotel, Utensils,
  Camera, Sun, Cloud, Umbrella, Wind, ThermometerSun,
  Mail, Send, Check, X, Download, Share2, Bookmark,
  BookmarkCheck, Zap, Sparkles, Loader
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface TripSummary {
  id: string;
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  highlights: string[];
  photos: string[];
  weather: {
    condition: string;
    temperature: number;
    forecast: Array<{
      day: string;
      condition: string;
      temperature: number;
    }>;
  };
  activities: Array<{
    name: string;
    description: string;
    date: Date;
    photos?: string[];
  }>;
  restaurants: Array<{
    name: string;
    cuisine: string;
    rating: number;
  }>;
  tips: string[];
  nextDestinations: Array<{
    name: string;
    description: string;
    image: string;
  }>;
}

const TripNewsletter: React.FC = () => {
  const { user } = useAuth();
  const [tripSummaries, setTripSummaries] = useState<TripSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<TripSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [savedSummaries, setSavedSummaries] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchTripSummaries();
  }, []);

  const fetchTripSummaries = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSummaries: TripSummary[] = [
        {
          id: '1',
          destination: 'Paris, France',
          dates: {
            start: new Date('2024-06-15'),
            end: new Date('2024-06-22')
          },
          highlights: [
            'Explored the iconic Eiffel Tower and enjoyed panoramic views of the city',
            'Visited the Louvre Museum and saw the Mona Lisa',
            'Strolled along the Seine River and discovered charming bookshops',
            'Experienced authentic French cuisine at local bistros'
          ],
          photos: [
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&q=80&w=2000'
          ],
          weather: {
            condition: 'Partly Cloudy',
            temperature: 22,
            forecast: [
              { day: 'Monday', condition: 'Sunny', temperature: 24 },
              { day: 'Tuesday', condition: 'Partly Cloudy', temperature: 22 },
              { day: 'Wednesday', condition: 'Rainy', temperature: 19 }
            ]
          },
          activities: [
            {
              name: 'Eiffel Tower Visit',
              description: 'Ascended to the top of the Eiffel Tower for breathtaking views of Paris.',
              date: new Date('2024-06-16'),
              photos: ['https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80&w=2000']
            },
            {
              name: 'Louvre Museum Tour',
              description: 'Explored the vast collections of the Louvre, including the famous Mona Lisa.',
              date: new Date('2024-06-17'),
              photos: ['https://images.unsplash.com/photo-1499426600726-a950358acf16?auto=format&fit=crop&q=80&w=2000']
            },
            {
              name: 'Seine River Cruise',
              description: 'Enjoyed a relaxing cruise along the Seine River, passing by Notre-Dame and other landmarks.',
              date: new Date('2024-06-18')
            }
          ],
          restaurants: [
            {
              name: 'Le Petit Bistro',
              cuisine: 'French',
              rating: 4.7
            },
            {
              name: 'Café de Paris',
              cuisine: 'French',
              rating: 4.5
            },
            {
              name: 'La Maison',
              cuisine: 'French',
              rating: 4.8
            }
          ],
          tips: [
            'The Paris Museum Pass is worth it if you plan to visit multiple museums',
            'Many restaurants close between lunch and dinner, plan accordingly',
            'The Metro is the most efficient way to get around the city',
            'Learn a few basic French phrases - locals appreciate the effort'
          ],
          nextDestinations: [
            {
              name: 'Rome',
              description: 'Continue your European adventure in the Eternal City',
              image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=2000'
            },
            {
              name: 'Barcelona',
              description: 'Experience Gaudí\'s architecture and Mediterranean beaches',
              image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=2000'
            }
          ]
        },
        {
          id: '2',
          destination: 'Tokyo, Japan',
          dates: {
            start: new Date('2024-04-05'),
            end: new Date('2024-04-15')
          },
          highlights: [
            'Witnessed the breathtaking cherry blossoms in full bloom at Ueno Park',
            'Experienced the bustling energy of Shibuya Crossing',
            'Explored ancient temples and modern skyscrapers',
            'Indulged in authentic Japanese cuisine from ramen to sushi'
          ],
          photos: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=2000'
          ],
          weather: {
            condition: 'Sunny',
            temperature: 18,
            forecast: [
              { day: 'Monday', condition: 'Sunny', temperature: 19 },
              { day: 'Tuesday', condition: 'Sunny', temperature: 20 },
              { day: 'Wednesday', condition: 'Partly Cloudy', temperature: 18 }
            ]
          },
          activities: [
            {
              name: 'Cherry Blossom Viewing',
              description: 'Enjoyed hanami (cherry blossom viewing) at Ueno Park, one of Tokyo\'s most popular spots.',
              date: new Date('2024-04-06'),
              photos: ['https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=2000']
            },
            {
              name: 'Meiji Shrine Visit',
              description: 'Explored the serene Meiji Shrine and its surrounding forest in the heart of Tokyo.',
              date: new Date('2024-04-08'),
              photos: ['https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=2000']
            },
            {
              name: 'Shibuya Crossing Experience',
              description: 'Navigated the famous Shibuya Crossing, the busiest pedestrian intersection in the world.',
              date: new Date('2024-04-10')
            }
          ],
          restaurants: [
            {
              name: 'Sushi Dai',
              cuisine: 'Sushi',
              rating: 4.9
            },
            {
              name: 'Ichiran Ramen',
              cuisine: 'Ramen',
              rating: 4.6
            },
            {
              name: 'Gonpachi',
              cuisine: 'Izakaya',
              rating: 4.4
            }
          ],
          tips: [
            'Get a Suica or Pasmo card for easy access to public transportation',
            'Many restaurants have plastic food displays outside - useful for ordering if you don\'t speak Japanese',
            'Convenience stores (konbini) have surprisingly good food options',
            'Bow slightly when greeting people as a sign of respect'
          ],
          nextDestinations: [
            {
              name: 'Kyoto',
              description: 'Experience traditional Japan with temples, geishas, and bamboo forests',
              image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000'
            },
            {
              name: 'Osaka',
              description: 'Known for its modern architecture, street food, and nightlife',
              image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80&w=2000'
            }
          ]
        }
      ];
      
      setTripSummaries(mockSummaries);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching trip summaries:', error);
      setIsLoading(false);
    }
  };

  const generateNewSummary = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // In a real implementation, this would generate a new trip summary
      // For demo purposes, we'll just use the existing ones
      setSelectedSummary(tripSummaries[0]);
    } catch (error) {
      console.error('Error generating trip summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email) return;
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribed(true);
      setTimeout(() => {
        setShowSubscribeModal(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  const toggleSavedSummary = (id: string) => {
    if (savedSummaries.includes(id)) {
      setSavedSummaries(savedSummaries.filter(summaryId => summaryId !== id));
    } else {
      setSavedSummaries([...savedSummaries, id]);
    }
  };

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={size} className="text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud size={size} className="text-gray-500" />;
      case 'rainy':
        return <Umbrella size={size} className="text-blue-500" />;
      case 'windy':
        return <Wind size={size} className="text-blue-400" />;
      default:
        return <ThermometerSun size={size} className="text-orange-500" />;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading trip summaries...</p>
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
              <Newspaper className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Trip Summary Newsletter
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              AI-generated summaries of your trips, delivered to your inbox
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNewSummary}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Generate New Summary</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSubscribeModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              <span>Subscribe to Newsletter</span>
            </motion.button>
          </motion.div>

          {/* Trip Summaries */}
          <AnimatePresence>
            {selectedSummary ? (
              <motion.div
                key="selected-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-80">
                  <img
                    src={selectedSummary.photos[0]}
                    alt={selectedSummary.destination}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedSummary(null)}
                    className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => toggleSavedSummary(selectedSummary.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                      {savedSummaries.includes(selectedSummary.id) ? (
                        <BookmarkCheck size={20} className="text-blue-600" />
                      ) : (
                        <Bookmark size={20} />
                      )}
                    </button>
                    <button
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedSummary.destination}</h2>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar size={18} />
                        <span>
                          {format(selectedSummary.dates.start, 'MMM d')} - {format(selectedSummary.dates.end, 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {getWeatherIcon(selectedSummary.weather.condition, 18)}
                        </div>
                        <span>{selectedSummary.weather.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4">Trip Highlights</h3>
                      <ul className="space-y-2">
                        {selectedSummary.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Sparkles size={20} className="text-yellow-500 mt-1" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4">Activities</h3>
                        <div className="space-y-4">
                          {selectedSummary.activities.map((activity, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              {activity.photos && activity.photos.length > 0 && (
                                <img
                                  src={activity.photos[0]}
                                  alt={activity.name}
                                  className="w-full h-48 object-cover"
                                />
                              )}
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold">{activity.name}</h4>
                                  <span className="text-sm text-gray-500">
                                    {format(activity.date, 'MMM d')}
                                  </span>
                                </div>
                                <p className="text-gray-600 mt-2">{activity.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold mb-4">Dining Experiences</h3>
                        <div className="space-y-4">
                          {selectedSummary.restaurants.map((restaurant, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                              <div className="p-3 bg-orange-100 rounded-lg">
                                <Utensils className="text-orange-600" size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold">{restaurant.name}</h4>
                                <p className="text-gray-500">{restaurant.cuisine}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="text-yellow-400 fill-current" size={16} />
                                  <span>{restaurant.rating}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-bold mt-8 mb-4">Weather Summary</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-4">
                            {getWeatherIcon(selectedSummary.weather.condition)}
                            <div>
                              <p className="font-medium">{selectedSummary.weather.condition}</p>
                              <p className="text-gray-600">{selectedSummary.weather.temperature}°C average</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedSummary.weather.forecast.map((day, index) => (
                              <div key={index} className="text-center p-2 bg-white rounded-lg">
                                <p className="font-medium">{day.day}</p>
                                <div className="flex justify-center my-1">
                                  {getWeatherIcon(day.condition, 16)}
                                </div>
                                <p className="text-sm">{day.temperature}°C</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Travel Tips</h3>
                      <div className="bg-yellow-50 p-6 rounded-lg">
                        <ul className="space-y-3">
                          {selectedSummary.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Lightbulb size={20} className="text-yellow-600 mt-1" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-4">Where to Next?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSummary.nextDestinations.map((destination, index) => (
                          <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative h-48">
                              <img
                                src={destination.image}
                                alt={destination.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                                <h4 className="text-xl font-bold text-white">{destination.name}</h4>
                                <p className="text-white/80">{destination.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="summary-list"
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {tripSummaries.map((summary) => (
                  <motion.div
                    key={summary.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={summary.photos[0]}
                        alt={summary.destination}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleSavedSummary(summary.id)}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                      >
                        {savedSummaries.includes(summary.id) ? (
                          <BookmarkCheck size={20} className="text-blue-600" />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{summary.destination}</h3>
                      <div className="flex items-center gap-4 text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            {format(summary.dates.start, 'MMM d')} - {format(summary.dates.end, 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getWeatherIcon(summary.weather.condition, 16)}
                          <span>{summary.weather.temperature}°C</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {summary.highlights[0]}
                      </p>
                      <button
                        onClick={() => setSelectedSummary(summary)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Read Summary
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Newsletter Features */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Why Subscribe to Our Trip Summaries?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-100 rounded-full inline-flex items-center justify-center mb-4">
                  <Sparkles className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Generated Content</h3>
                <p className="text-gray-600">
                  Our AI analyzes your travel data to create personalized, engaging summaries of your trips.
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-green-100 rounded-full inline-flex items-center justify-center mb-4">
                  <Calendar className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Regular Updates</h3>
                <p className="text-gray-600">
                  Receive weekly or monthly summaries of your travels, complete with photos, tips, and highlights.
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-purple-100 rounded-full inline-flex items-center justify-center mb-4">
                  <Zap className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
                <p className="text-gray-600">
                  Get personalized suggestions for future trips based on your travel preferences and history.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subscribe Modal */}
      <AnimatePresence>
        {showSubscribeModal && (
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
                <div className="p-4 bg-blue-100 rounded-full inline-flex items-center justify-center mb-4">
                  <Mail className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Subscribe to Trip Summaries</h3>
                <p className="text-gray-600">
                  Receive AI-generated summaries of your trips directly in your inbox.
                </p>
              </div>
              
              {subscribed ? (
                <div className="text-center py-4">
                  <div className="p-4 bg-green-100 rounded-full inline-flex items-center justify-center mb-4">
                    <Check className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Subscription Confirmed!</h3>
                  <p className="text-gray-600">
                    You're now subscribed to receive {frequency} trip summaries.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={frequency === 'weekly'}
                          onChange={() => setFrequency('weekly')}
                          className="text-blue-600"
                        />
                        <span>Weekly</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={frequency === 'monthly'}
                          onChange={() => setFrequency('monthly')}
                          className="text-blue-600"
                        />
                        <span>Monthly</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubscribe}
                      disabled={!email}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send size={20} />
                      <span>Subscribe</span>
                    </motion.button>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t text-center">
                <button
                  onClick={() => setShowSubscribeModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {subscribed ? 'Close' : 'Maybe Later'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripNewsletter;