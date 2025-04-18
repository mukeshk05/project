import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Sun, Cloud, Umbrella, ThermometerSun, Wind,
  Plane, MapPin, DollarSign, Users, Search, Filter,
  ArrowRight, Check, X, Info, Sparkles, Loader,
  ChevronLeft, ChevronRight, Zap, Heart
} from 'lucide-react';
import { format, addMonths, subMonths, getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  bestMonths: number[];
  worstMonths: number[];
  peakSeason: number[];
  offPeakSeason: number[];
  shoulderSeason: number[];
  averagePrices: {
    [key: string]: {
      flight: number;
      hotel: number;
      food: number;
      activities: number;
    };
  };
  weather: {
    [key: string]: {
      temperature: {
        min: number;
        max: number;
      };
      precipitation: number;
      humidity: number;
      condition: string;
    };
  };
  events: {
    name: string;
    date: string;
    description: string;
  }[];
  tags: string[];
}

interface TravelPreference {
  weatherPreference: 'warm' | 'mild' | 'cold' | 'any';
  crowdPreference: 'low' | 'moderate' | 'high' | 'any';
  budgetLevel: 'budget' | 'moderate' | 'luxury' | 'any';
  interests: string[];
}

const SeasonalTravelCalendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<TravelPreference>({
    weatherPreference: 'any',
    crowdPreference: 'any',
    budgetLevel: 'any',
    interests: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(true);
  const [favoriteDestinations, setFavoriteDestinations] = useState<string[]>([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [destinations, preferences, searchTerm, currentDate]);

  const fetchDestinations = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockDestinations: Destination[] = [
        {
          id: '1',
          name: 'Bali',
          country: 'Indonesia',
          description: 'A tropical paradise known for its beautiful beaches, lush rice terraces, and vibrant culture.',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000',
          bestMonths: [5, 6, 7, 8, 9], // May to September
          worstMonths: [11, 0, 1, 2], // November to February
          peakSeason: [6, 7, 8], // June to August
          offPeakSeason: [0, 1, 2, 11], // November to February
          shoulderSeason: [3, 4, 9, 10], // March, April, September, October
          averagePrices: {
            'peak': {
              flight: 900,
              hotel: 120,
              food: 30,
              activities: 50
            },
            'off-peak': {
              flight: 700,
              hotel: 70,
              food: 25,
              activities: 40
            },
            'shoulder': {
              flight: 800,
              hotel: 90,
              food: 28,
              activities: 45
            }
          },
          weather: {
            'peak': {
              temperature: {
                min: 23,
                max: 31
              },
              precipitation: 70,
              humidity: 75,
              condition: 'sunny'
            },
            'off-peak': {
              temperature: {
                min: 24,
                max: 32
              },
              precipitation: 240,
              humidity: 85,
              condition: 'rainy'
            },
            'shoulder': {
              temperature: {
                min: 23,
                max: 31
              },
              precipitation: 150,
              humidity: 80,
              condition: 'partly cloudy'
            }
          },
          events: [
            {
              name: 'Nyepi (Day of Silence)',
              date: '2024-03-11',
              description: 'Balinese New Year celebration with parades and a day of complete silence.'
            },
            {
              name: 'Bali Arts Festival',
              date: '2024-06-15',
              description: 'Month-long festival showcasing Balinese arts, music, and dance.'
            }
          ],
          tags: ['beach', 'culture', 'nature', 'relaxation', 'surfing', 'yoga']
        },
        {
          id: '2',
          name: 'Kyoto',
          country: 'Japan',
          description: 'Japan\'s cultural capital with over 1,600 Buddhist temples, 400 Shinto shrines, and 17 UNESCO World Heritage sites.',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000',
          bestMonths: [3, 4, 10, 11], // March, April, October, November
          worstMonths: [6, 7, 8], // June to August
          peakSeason: [3, 4, 10, 11], // March, April, October, November
          offPeakSeason: [0, 1, 6, 7, 8], // January, February, June to August
          shoulderSeason: [2, 5, 9], // March, June, October
          averagePrices: {
            'peak': {
              flight: 1100,
              hotel: 200,
              food: 50,
              activities: 60
            },
            'off-peak': {
              flight: 800,
              hotel: 120,
              food: 40,
              activities: 50
            },
            'shoulder': {
              flight: 950,
              hotel: 150,
              food: 45,
              activities: 55
            }
          },
          weather: {
            'peak': {
              temperature: {
                min: 10,
                max: 22
              },
              precipitation: 80,
              humidity: 65,
              condition: 'mild'
            },
            'off-peak': {
              temperature: {
                min: 25,
                max: 35
              },
              precipitation: 180,
              humidity: 80,
              condition: 'hot and humid'
            },
            'shoulder': {
              temperature: {
                min: 15,
                max: 25
              },
              precipitation: 100,
              humidity: 70,
              condition: 'mild'
            }
          },
          events: [
            {
              name: 'Cherry Blossom Season',
              date: '2024-04-01',
              description: 'The famous sakura bloom throughout the city.'
            },
            {
              name: 'Gion Matsuri',
              date: '2024-07-17',
              description: 'One of Japan\'s most famous festivals with parades and traditional events.'
            },
            {
              name: 'Autumn Foliage',
              date: '2024-11-15',
              description: 'The city\'s temples and gardens are transformed with vibrant fall colors.'
            }
          ],
          tags: ['culture', 'history', 'temples', 'gardens', 'traditional', 'food']
        },
        {
          id: '3',
          name: 'Santorini',
          country: 'Greece',
          description: 'Famous for its dramatic views, stunning sunsets, white-washed houses, and blue-domed churches.',
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
          bestMonths: [4, 5, 9, 10], // May, June, September, October
          worstMonths: [11, 0, 1, 2], // November to February
          peakSeason: [6, 7, 8], // June to August
          offPeakSeason: [11, 0, 1, 2], // November to February
          shoulderSeason: [3, 4, 9, 10], // April, May, September, October
          averagePrices: {
            'peak': {
              flight: 950,
              hotel: 300,
              food: 60,
              activities: 70
            },
            'off-peak': {
              flight: 600,
              hotel: 120,
              food: 40,
              activities: 50
            },
            'shoulder': {
              flight: 750,
              hotel: 200,
              food: 50,
              activities: 60
            }
          },
          weather: {
            'peak': {
              temperature: {
                min: 23,
                max: 29
              },
              precipitation: 10,
              humidity: 60,
              condition: 'sunny'
            },
            'off-peak': {
              temperature: {
                min: 10,
                max: 15
              },
              precipitation: 70,
              humidity: 70,
              condition: 'windy'
            },
            'shoulder': {
              temperature: {
                min: 17,
                max: 25
              },
              precipitation: 20,
              humidity: 65,
              condition: 'mild'
            }
          },
          events: [
            {
              name: 'Santorini International Music Festival',
              date: '2024-09-10',
              description: 'Classical music performances in unique venues around the island.'
            },
            {
              name: 'Ifestia Festival',
              date: '2024-08-15',
              description: 'Fireworks display recreating the volcanic eruption that shaped the island.'
            }
          ],
          tags: ['beach', 'views', 'romantic', 'wine', 'architecture', 'sunsets']
        },
        {
          id: '4',
          name: 'New York City',
          country: 'United States',
          description: 'The city that never sleeps offers world-class museums, diverse cuisine, iconic landmarks, and vibrant neighborhoods.',
          image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=2000',
          bestMonths: [4, 5, 8, 9], // May, June, September, October
          worstMonths: [0, 1, 6, 7], // January, February, July, August
          peakSeason: [5, 6, 7, 11], // June, July, August, December
          offPeakSeason: [0, 1, 2], // January to March
          shoulderSeason: [3, 4, 9, 10], // April, May, October, November
          averagePrices: {
            'peak': {
              flight: 800,
              hotel: 350,
              food: 80,
              activities: 100
            },
            'off-peak': {
              flight: 500,
              hotel: 200,
              food: 70,
              activities: 80
            },
            'shoulder': {
              flight: 650,
              hotel: 250,
              food: 75,
              activities: 90
            }
          },
          weather: {
            'peak': {
              temperature: {
                min: 20,
                max: 30
              },
              precipitation: 90,
              humidity: 70,
              condition: 'hot and humid'
            },
            'off-peak': {
              temperature: {
                min: -5,
                max: 5
              },
              precipitation: 80,
              humidity: 60,
              condition: 'cold'
            },
            'shoulder': {
              temperature: {
                min: 10,
                max: 20
              },
              precipitation: 85,
              humidity: 65,
              condition: 'mild'
            }
          },
          events: [
            {
              name: 'New Year\'s Eve in Times Square',
              date: '2024-12-31',
              description: 'The famous ball drop celebration.'
            },
            {
              name: 'NYC Restaurant Week',
              date: '2024-07-15',
              description: 'Special prix-fixe menus at hundreds of restaurants across the city.'
            },
            {
              name: 'Macy\'s Thanksgiving Day Parade',
              date: '2024-11-28',
              description: 'Iconic parade featuring giant balloons, floats, and performances.'
            }
          ],
          tags: ['city', 'museums', 'food', 'shopping', 'nightlife', 'architecture']
        }
      ];
      
      setDestinations(mockDestinations);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setIsLoading(false);
    }
  };

  const filterDestinations = () => {
    if (!destinations.length) return;
    
    let filtered = [...destinations];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(destination => 
        destination.name.toLowerCase().includes(term) ||
        destination.country.toLowerCase().includes(term) ||
        destination.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply preference filters
    if (preferences.weatherPreference !== 'any') {
      filtered = filtered.filter(destination => {
        const currentMonth = getMonth(currentDate);
        const seasonType = destination.peakSeason.includes(currentMonth) 
          ? 'peak' 
          : destination.offPeakSeason.includes(currentMonth)
          ? 'off-peak'
          : 'shoulder';
        
        const weather = destination.weather[seasonType];
        
        switch (preferences.weatherPreference) {
          case 'warm':
            return weather.temperature.max > 25;
          case 'mild':
            return weather.temperature.max >= 15 && weather.temperature.max <= 25;
          case 'cold':
            return weather.temperature.max < 15;
          default:
            return true;
        }
      });
    }
    
    if (preferences.crowdPreference !== 'any') {
      filtered = filtered.filter(destination => {
        const currentMonth = getMonth(currentDate);
        
        switch (preferences.crowdPreference) {
          case 'low':
            return destination.offPeakSeason.includes(currentMonth);
          case 'moderate':
            return destination.shoulderSeason.includes(currentMonth);
          case 'high':
            return destination.peakSeason.includes(currentMonth);
          default:
            return true;
        }
      });
    }
    
    if (preferences.budgetLevel !== 'any') {
      filtered = filtered.filter(destination => {
        const currentMonth = getMonth(currentDate);
        const seasonType = destination.peakSeason.includes(currentMonth) 
          ? 'peak' 
          : destination.offPeakSeason.includes(currentMonth)
          ? 'off-peak'
          : 'shoulder';
        
        const prices = destination.averagePrices[seasonType];
        const totalDailyPrice = prices.hotel + prices.food + prices.activities;
        
        switch (preferences.budgetLevel) {
          case 'budget':
            return totalDailyPrice < 150;
          case 'moderate':
            return totalDailyPrice >= 150 && totalDailyPrice <= 300;
          case 'luxury':
            return totalDailyPrice > 300;
          default:
            return true;
        }
      });
    }
    
    if (preferences.interests.length > 0) {
      filtered = filtered.filter(destination => 
        preferences.interests.some(interest => 
          destination.tags.includes(interest)
        )
      );
    }
    
    // Filter by best time to visit
    const currentMonth = getMonth(currentDate);
    filtered = filtered.sort((a, b) => {
      const aIsBestTime = a.bestMonths.includes(currentMonth);
      const bIsBestTime = b.bestMonths.includes(currentMonth);
      
      if (aIsBestTime && !bIsBestTime) return -1;
      if (!aIsBestTime && bIsBestTime) return 1;
      return 0;
    });
    
    setFilteredDestinations(filtered);
  };

  const toggleFavorite = (id: string) => {
    setFavoriteDestinations(prev => 
      prev.includes(id) 
        ? prev.filter(destId => destId !== id) 
        : [...prev, id]
    );
  };

  const getSeasonType = (destination: Destination, month: number) => {
    if (destination.peakSeason.includes(month)) return 'peak';
    if (destination.offPeakSeason.includes(month)) return 'off-peak';
    return 'shoulder';
  };

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={size} className="text-yellow-500" />;
      case 'rainy':
        return <Umbrella size={size} className="text-blue-500" />;
      case 'windy':
        return <Wind size={size} className="text-blue-400" />;
      case 'hot and humid':
        return <ThermometerSun size={size} className="text-red-500" />;
      case 'cold':
        return <Thermometer size={size} className="text-blue-500" />;
      case 'partly cloudy':
        return <Cloud size={size} className="text-gray-500" />;
      case 'mild':
      default:
        return <Sun size={size} className="text-yellow-400" />;
    }
  };

  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month);
    return format(date, 'MMMM');
  };

  const getMonthClass = (destination: Destination, month: number) => {
    if (destination.bestMonths.includes(month)) return 'bg-green-100 text-green-800 border-green-300';
    if (destination.worstMonths.includes(month)) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const generatePersonalizedCalendar = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // In a real implementation, this would update the destinations or preferences
      // based on AI analysis of user data
      setPreferences({
        ...preferences,
        interests: ['beach', 'culture', 'food']
      });
    } catch (error) {
      console.error('Error generating personalized calendar:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: new Date(monthStart).getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 p-2 border rounded-lg bg-gray-50"></div>
          ))}
          
          {days.map((day) => {
            const dayEvents = filteredDestinations.flatMap(dest => 
              dest.events.filter(event => {
                const eventDate = new Date(event.date);
                return isSameDay(eventDate, day);
              }).map(event => ({
                ...event,
                destination: dest.name
              }))
            );
            
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toString()} 
                className={`h-24 p-2 border rounded-lg overflow-hidden ${
                  isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{format(day, 'd')}</div>
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 2).map((event, index) => (
                    <div 
                      key={index} 
                      className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate"
                      title={`${event.name} (${event.destination})`}
                    >
                      {event.name}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDestinationList = () => {
    return (
      <div className="space-y-6">
        {filteredDestinations.map((destination) => {
          const currentMonth = getMonth(currentDate);
          const seasonType = getSeasonType(destination, currentMonth);
          const weather = destination.weather[seasonType];
          const prices = destination.averagePrices[seasonType];
          const isBestTime = destination.bestMonths.includes(currentMonth);
          const isWorstTime = destination.worstMonths.includes(currentMonth);
          
          return (
            <motion.div
              key={destination.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="h-full">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{destination.name}, {destination.country}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isBestTime && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Best Time to Visit
                          </span>
                        )}
                        {isWorstTime && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Not Recommended
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {seasonType === 'peak' ? 'Peak Season' : seasonType === 'off-peak' ? 'Off-Peak Season' : 'Shoulder Season'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(destination.id)}
                      className={`p-2 rounded-full ${
                        favoriteDestinations.includes(destination.id)
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Heart 
                        size={20} 
                        className={favoriteDestinations.includes(destination.id) ? 'fill-current' : ''} 
                      />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(weather.condition, 20)}
                      <div>
                        <p className="text-xs text-gray-500">Weather</p>
                        <p className="font-medium">{weather.temperature.min}°-{weather.temperature.max}°C</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Daily Budget</p>
                        <p className="font-medium">${prices.hotel + prices.food + prices.activities}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane size={20} className="text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Flight</p>
                        <p className="font-medium">${prices.flight}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-500">Crowds</p>
                        <p className="font-medium">
                          {seasonType === 'peak' ? 'High' : seasonType === 'off-peak' ? 'Low' : 'Moderate'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex gap-1">
                      {Array.from({ length: 12 }).map((_, index) => (
                        <div
                          key={index}
                          className={`h-1.5 flex-1 rounded-full ${getMonthClass(destination, index)}`}
                          title={`${getMonthName(index)}: ${
                            destination.bestMonths.includes(index) 
                              ? 'Best time to visit' 
                              : destination.worstMonths.includes(index)
                              ? 'Not recommended'
                              : 'Average conditions'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedDestination(destination)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      Details
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
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
          <p className="text-gray-600">Loading seasonal travel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
              <Calendar className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Seasonal Travel Calendar
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Discover the perfect time to visit your dream destinations based on weather, crowds, and prices
            </motion.p>
          </div>

          {/* Filters and Search */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search destinations, countries, or interests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreferenceModal(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Filter size={20} />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => setShowCalendarView(!showCalendarView)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {showCalendarView ? (
                    <>
                      <MapPin size={20} />
                      <span>List View</span>
                    </>
                  ) : (
                    <>
                      <Calendar size={20} />
                      <span>Calendar View</span>
                    </>
                  )}
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generatePersonalizedCalendar}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Personalize</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Active Filters */}
            {(preferences.weatherPreference !== 'any' || 
              preferences.crowdPreference !== 'any' || 
              preferences.budgetLevel !== 'any' || 
              preferences.interests.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {preferences.weatherPreference !== 'any' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    <ThermometerSun size={16} />
                    <span>{preferences.weatherPreference.charAt(0).toUpperCase() + preferences.weatherPreference.slice(1)} Weather</span>
                    <button
                      onClick={() => setPreferences({ ...preferences, weatherPreference: 'any' })}
                      className="ml-1 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {preferences.crowdPreference !== 'any' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                    <Users size={16} />
                    <span>{preferences.crowdPreference.charAt(0).toUpperCase() + preferences.crowdPreference.slice(1)} Crowds</span>
                    <button
                      onClick={() => setPreferences({ ...preferences, crowdPreference: 'any' })}
                      className="ml-1 hover:text-purple-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {preferences.budgetLevel !== 'any' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    <DollarSign size={16} />
                    <span>{preferences.budgetLevel.charAt(0).toUpperCase() + preferences.budgetLevel.slice(1)}</span>
                    <button
                      onClick={() => setPreferences({ ...preferences, budgetLevel: 'any' })}
                      className="ml-1 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {preferences.interests.map((interest) => (
                  <div key={interest} className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                    <span>{interest}</span>
                    <button
                      onClick={() => setPreferences({
                        ...preferences,
                        interests: preferences.interests.filter(i => i !== interest)
                      })}
                      className="ml-1 hover:text-yellow-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setPreferences({
                    weatherPreference: 'any',
                    crowdPreference: 'any',
                    budgetLevel: 'any',
                    interests: []
                  })}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            {/* Month Legend */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">When to Visit</h2>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300"></div>
                  <span className="text-sm">Best Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300"></div>
                  <span className="text-sm">Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300"></div>
                  <span className="text-sm">Not Recommended</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Info size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Hover over the month indicators for details</span>
                </div>
              </div>
            </div>
            
            {/* Calendar or List View */}
            {showCalendarView ? renderCalendarView() : renderDestinationList()}
            
            {filteredDestinations.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setPreferences({
                      weatherPreference: 'any',
                      crowdPreference: 'any',
                      budgetLevel: 'any',
                      interests: []
                    });
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Destination Detail Modal */}
      <AnimatePresence>
        {selectedDestination && (
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
              <div className="relative h-80">
                <img
                  src={selectedDestination.image}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedDestination.name}, {selectedDestination.country}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(selectedDestination.id)}
                      className={`p-2 rounded-full ${
                        favoriteDestinations.includes(selectedDestination.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart 
                        size={20} 
                        className={favoriteDestinations.includes(selectedDestination.id) ? 'fill-current' : ''} 
                      />
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {selectedDestination.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/20 text-white rounded-full text-xs backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">{selectedDestination.description}</p>
                
                <h3 className="text-xl font-bold mb-4">Best Time to Visit</h3>
                <div className="grid grid-cols-12 gap-2 mb-6">
                  {Array.from({ length: 12 }).map((_, index) => {
                    const isBestMonth = selectedDestination.bestMonths.includes(index);
                    const isWorstMonth = selectedDestination.worstMonths.includes(index);
                    
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-center ${
                          isBestMonth
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : isWorstMonth
                            ? 'bg-red-100 border-red-300 text-red-800'
                            : 'bg-gray-100 border-gray-300 text-gray-800'
                        }`}
                      >
                        <p className="font-medium">{format(new Date(2024, index, 1), 'MMM')}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Peak Season</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        <span>
                          {selectedDestination.peakSeason.map(month => getMonthName(month)).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        <span>High crowds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-blue-500" />
                        <span>Higher prices</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Shoulder Season</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-green-500" />
                        <span>
                          {selectedDestination.shoulderSeason.map(month => getMonthName(month)).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-green-500" />
                        <span>Moderate crowds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-500" />
                        <span>Average prices</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Off-Peak Season</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500" />
                        <span>
                          {selectedDestination.offPeakSeason.map(month => getMonthName(month)).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-purple-500" />
                        <span>Low crowds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-purple-500" />
                        <span>Lower prices</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Weather & Prices by Season</h3>
                <div className="space-y-4 mb-6">
                  {['peak', 'shoulder', 'off-peak'].map((season) => {
                    const weather = selectedDestination.weather[season];
                    const prices = selectedDestination.averagePrices[season];
                    
                    return (
                      <div key={season} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold mb-2 capitalize">{season} Season</h4>
                          <div className="flex items-center gap-3 mb-2">
                            {getWeatherIcon(weather.condition)}
                            <div>
                              <p className="font-medium capitalize">{weather.condition}</p>
                              <p className="text-sm text-gray-500">{weather.temperature.min}°C - {weather.temperature.max}°C</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Precipitation</p>
                              <p>{weather.precipitation}mm</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Humidity</p>
                              <p>{weather.humidity}%</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Average Prices</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Flight</span>
                              <span className="font-medium">${prices.flight}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Hotel (per night)</span>
                              <span className="font-medium">${prices.hotel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Food (per day)</span>
                              <span className="font-medium">${prices.food}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Activities (per day)</span>
                              <span className="font-medium">${prices.activities}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span className="font-semibold">Daily Total</span>
                              <span className="font-semibold">${prices.hotel + prices.food + prices.activities}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <h3 className="text-xl font-bold mb-4">Notable Events</h3>
                {selectedDestination.events.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDestination.events.map((event, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{event.name}</h4>
                          <span className="text-sm text-gray-500">{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No major events listed for this destination.</p>
                )}
                
                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plane size={20} />
                    <span>Plan a Trip</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
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
                <h3 className="text-xl font-bold">Travel Preferences</h3>
                <button
                  onClick={() => setShowPreferenceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weather Preference
                  </label>
                  <select
                    value={preferences.weatherPreference}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      weatherPreference: e.target.value as any
                    })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="any">Any Weather</option>
                    <option value="warm">Warm (25°C+)</option>
                    <option value="mild">Mild (15-25°C)</option>
                    <option value="cold">Cold (Below 15°C)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crowd Preference
                  </label>
                  <select
                    value={preferences.crowdPreference}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      crowdPreference: e.target.value as any
                    })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="any">Any Crowd Level</option>
                    <option value="low">Low Crowds (Off-Peak)</option>
                    <option value="moderate">Moderate Crowds (Shoulder Season)</option>
                    <option value="high">High Crowds (Peak Season)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Level
                  </label>
                  <select
                    value={preferences.budgetLevel}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      budgetLevel: e.target.value as any
                    })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="any">Any Budget</option>
                    <option value="budget">Budget (Under $150/day)</option>
                    <option value="moderate">Moderate ($150-300/day)</option>
                    <option value="luxury">Luxury (Over $300/day)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {preferences.interests.map((interest) => (
                      <div
                        key={interest}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                      >
                        <span>{interest}</span>
                        <button
                          onClick={() => setPreferences({
                            ...preferences,
                            interests: preferences.interests.filter(i => i !== interest)
                          })}
                          className="hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.value && !preferences.interests.includes(e.target.value)) {
                          setPreferences({
                            ...preferences,
                            interests: [...preferences.interests, e.target.value]
                          });
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Select an interest</option>
                      {['beach', 'culture', 'food', 'nature', 'adventure', 'relaxation', 'history', 'architecture', 'shopping', 'nightlife', 'museums', 'wine', 'hiking', 'photography', 'yoga', 'surfing']
                        .filter(interest => !preferences.interests.includes(interest))
                        .map(interest => (
                          <option key={interest} value={interest}>
                            {interest.charAt(0).toUpperCase() + interest.slice(1)}
                          </option>
                        ))
                      }
                    </select>
                    <button
                      onClick={() => setPreferences({
                        ...preferences,
                        interests: []
                      })}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={preferences.interests.length === 0}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowPreferenceModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreferenceModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeasonalTravelCalendar;