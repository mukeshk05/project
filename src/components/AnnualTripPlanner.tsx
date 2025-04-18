import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Plane, Hotel, Car, Utensils, Camera,
  Compass, Mountain, Beach, Building, Music, Book, Coffee,
  Plus, X, Check, ArrowRight, Shuffle, Save, Filter, Search,
  Briefcase, Sun, Wind, Umbrella, Droplets, Zap, Sparkles, Loader
} from 'lucide-react';
import { format, addMonths, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface TripPlan {
  id: string;
  month: Date;
  destination: string;
  description: string;
  duration: number;
  budget: number;
  activities: string[];
  image: string;
  weather: {
    temperature: {
      min: number;
      max: number;
    };
    condition: string;
  };
  travelReason: string;
  status: 'planned' | 'booked' | 'completed';
}

interface YearlyBudget {
  total: number;
  allocated: number;
  remaining: number;
  breakdown: {
    [month: string]: number;
  };
}

const AnnualTripPlanner: React.FC = () => {
  const { user } = useAuth();
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [yearlyBudget, setYearlyBudget] = useState<YearlyBudget>({
    total: 10000,
    allocated: 0,
    remaining: 10000,
    breakdown: {}
  });
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newTripPlan, setNewTripPlan] = useState<Partial<TripPlan>>({
    destination: '',
    duration: 7,
    budget: 1000,
    activities: [],
    travelReason: '',
    status: 'planned'
  });
  const [selectedPlan, setSelectedPlan] = useState<TripPlan | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'planned' | 'booked' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTripPlans();
  }, []);

  useEffect(() => {
    if (tripPlans.length > 0) {
      calculateBudget();
    }
  }, [tripPlans]);

  const fetchTripPlans = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPlans: TripPlan[] = [
        {
          id: '1',
          month: new Date(new Date().getFullYear(), 0, 15), // January
          destination: 'Aspen, Colorado',
          description: 'Winter ski trip to enjoy the fresh powder and mountain views.',
          duration: 5,
          budget: 2500,
          activities: ['Skiing', 'Snowboarding', 'Après-ski', 'Hot springs'],
          image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: -10,
              max: 2
            },
            condition: 'Snowy'
          },
          travelReason: 'Winter sports',
          status: 'completed'
        },
        {
          id: '2',
          month: new Date(new Date().getFullYear(), 3, 10), // April
          destination: 'Kyoto, Japan',
          description: 'Cherry blossom season in Japan, exploring temples and gardens.',
          duration: 10,
          budget: 3000,
          activities: ['Temple visits', 'Cherry blossom viewing', 'Traditional tea ceremony', 'Garden tours'],
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 10,
              max: 20
            },
            condition: 'Mild'
          },
          travelReason: 'Cultural experience',
          status: 'booked'
        },
        {
          id: '3',
          month: new Date(new Date().getFullYear(), 7, 5), // August
          destination: 'Santorini, Greece',
          description: 'Summer getaway to the beautiful Greek islands.',
          duration: 7,
          budget: 2800,
          activities: ['Beach relaxation', 'Island hopping', 'Sunset watching', 'Mediterranean cuisine'],
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 24,
              max: 32
            },
            condition: 'Sunny'
          },
          travelReason: 'Beach vacation',
          status: 'planned'
        }
      ];
      
      setTripPlans(mockPlans);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching trip plans:', error);
      setIsLoading(false);
    }
  };

  const calculateBudget = () => {
    const allocated = tripPlans.reduce((sum, plan) => sum + plan.budget, 0);
    const breakdown: { [month: string]: number } = {};
    
    tripPlans.forEach(plan => {
      const monthKey = format(plan.month, 'MMMM');
      breakdown[monthKey] = (breakdown[monthKey] || 0) + plan.budget;
    });
    
    setYearlyBudget({
      total: yearlyBudget.total,
      allocated,
      remaining: yearlyBudget.total - allocated,
      breakdown
    });
  };

  const generateTripSuggestion = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const monthName = format(selectedMonth, 'MMMM');
      
      // Generate a suggestion based on the selected month
      const suggestions: { [key: string]: Partial<TripPlan> } = {
        'January': {
          destination: 'Whistler, Canada',
          description: 'World-class skiing and winter activities in a charming mountain village.',
          duration: 7,
          budget: 2800,
          activities: ['Skiing', 'Snowboarding', 'Snowshoeing', 'Spa treatments'],
          image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: -12,
              max: 0
            },
            condition: 'Snowy'
          },
          travelReason: 'Winter sports'
        },
        'February': {
          destination: 'Rio de Janeiro, Brazil',
          description: 'Experience the world-famous Carnival and vibrant Brazilian culture.',
          duration: 8,
          budget: 3200,
          activities: ['Carnival celebrations', 'Beach time', 'Samba dancing', 'City tours'],
          image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 24,
              max: 33
            },
            condition: 'Hot and humid'
          },
          travelReason: 'Festival and culture'
        },
        'March': {
          destination: 'Marrakech, Morocco',
          description: 'Explore the vibrant markets and rich culture before summer heat arrives.',
          duration: 6,
          budget: 1800,
          activities: ['Market exploration', 'Desert excursion', 'Historical tours', 'Moroccan cuisine'],
          image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 12,
              max: 25
            },
            condition: 'Mild'
          },
          travelReason: 'Cultural immersion'
        },
        'April': {
          destination: 'Amsterdam, Netherlands',
          description: 'See the famous tulip fields in full bloom and enjoy the mild spring weather.',
          duration: 5,
          budget: 2200,
          activities: ['Tulip garden visits', 'Canal cruises', 'Cycling tours', 'Museum visits'],
          image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 6,
              max: 15
            },
            condition: 'Mild with some rain'
          },
          travelReason: 'Spring flowers'
        },
        'May': {
          destination: 'Tuscany, Italy',
          description: 'Enjoy the Italian countryside before the summer crowds arrive.',
          duration: 9,
          budget: 2600,
          activities: ['Wine tasting', 'Cooking classes', 'Medieval town visits', 'Countryside drives'],
          image: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 12,
              max: 23
            },
            condition: 'Sunny and pleasant'
          },
          travelReason: 'Food and wine'
        },
        'June': {
          destination: 'Machu Picchu, Peru',
          description: 'Visit this wonder of the world during the dry season with optimal hiking conditions.',
          duration: 10,
          budget: 3500,
          activities: ['Inca Trail hiking', 'Archaeological site visits', 'Cusco exploration', 'Local cuisine'],
          image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 8,
              max: 20
            },
            condition: 'Dry and clear'
          },
          travelReason: 'Historical exploration'
        },
        'July': {
          destination: 'Serengeti, Tanzania',
          description: 'Witness the Great Migration during peak season.',
          duration: 12,
          budget: 5000,
          activities: ['Safari drives', 'Wildlife photography', 'Cultural visits', 'Hot air balloon rides'],
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 15,
              max: 28
            },
            condition: 'Dry and warm'
          },
          travelReason: 'Wildlife safari'
        },
        'August': {
          destination: 'Bali, Indonesia',
          description: 'Enjoy the perfect dry season weather on this tropical paradise island.',
          duration: 14,
          budget: 2800,
          activities: ['Beach relaxation', 'Temple visits', 'Surfing', 'Spa treatments'],
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 23,
              max: 31
            },
            condition: 'Warm and dry'
          },
          travelReason: 'Tropical getaway'
        },
        'September': {
          destination: 'Santorini, Greece',
          description: 'Experience the beautiful Greek islands after the summer crowds have left.',
          duration: 8,
          budget: 2400,
          activities: ['Island exploration', 'Sunset watching', 'Wine tasting', 'Beach time'],
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 20,
              max: 28
            },
            condition: 'Sunny and warm'
          },
          travelReason: 'Island escape'
        },
        'October': {
          destination: 'New England, USA',
          description: 'Witness the spectacular fall foliage at its peak.',
          duration: 7,
          budget: 2200,
          activities: ['Scenic drives', 'Hiking', 'Small town exploration', 'Apple picking'],
          image: 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 5,
              max: 15
            },
            condition: 'Cool and crisp'
          },
          travelReason: 'Fall foliage'
        },
        'November': {
          destination: 'Kyoto, Japan',
          description: 'Experience the stunning autumn colors in Japan\'s cultural capital.',
          duration: 9,
          budget: 2800,
          activities: ['Temple visits', 'Fall foliage viewing', 'Traditional tea ceremonies', 'Garden tours'],
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: 7,
              max: 17
            },
            condition: 'Cool and clear'
          },
          travelReason: 'Autumn colors'
        },
        'December': {
          destination: 'Vienna, Austria',
          description: 'Experience the magical Christmas markets and festive atmosphere.',
          duration: 6,
          budget: 2300,
          activities: ['Christmas market visits', 'Classical concerts', 'Museum tours', 'Coffee house culture'],
          image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=2000',
          weather: {
            temperature: {
              min: -2,
              max: 5
            },
            condition: 'Cold and possibly snowy'
          },
          travelReason: 'Holiday festivities'
        }
      };
      
      const suggestion = suggestions[monthName] || suggestions['January'];
      
      setNewTripPlan({
        ...suggestion,
        month: selectedMonth,
        status: 'planned'
      });
      
      setShowAddTripModal(true);
    } catch (error) {
      console.error('Error generating trip suggestion:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addTripPlan = () => {
    if (!newTripPlan.destination || !selectedMonth) return;
    
    const newPlan: TripPlan = {
      id: Date.now().toString(),
      month: selectedMonth,
      destination: newTripPlan.destination!,
      description: newTripPlan.description || '',
      duration: newTripPlan.duration || 7,
      budget: newTripPlan.budget || 1000,
      activities: newTripPlan.activities || [],
      image: newTripPlan.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000',
      weather: newTripPlan.weather || {
        temperature: {
          min: 15,
          max: 25
        },
        condition: 'Mild'
      },
      travelReason: newTripPlan.travelReason || 'Vacation',
      status: newTripPlan.status || 'planned'
    };
    
    setTripPlans([...tripPlans, newPlan]);
    setShowAddTripModal(false);
    setNewTripPlan({
      destination: '',
      duration: 7,
      budget: 1000,
      activities: [],
      travelReason: '',
      status: 'planned'
    });
  };

  const updateTripStatus = (id: string, status: 'planned' | 'booked' | 'completed') => {
    setTripPlans(tripPlans.map(plan => 
      plan.id === id ? { ...plan, status } : plan
    ));
  };

  const deleteTripPlan = (id: string) => {
    setTripPlans(tripPlans.filter(plan => plan.id !== id));
    if (selectedPlan?.id === id) {
      setSelectedPlan(null);
    }
  };

  const updateBudget = (newTotal: number) => {
    setYearlyBudget({
      ...yearlyBudget,
      total: newTotal,
      remaining: newTotal - yearlyBudget.allocated
    });
    setShowBudgetModal(false);
  };

  const getMonthsWithTrips = () => {
    const months = eachMonthOfInterval({
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date(new Date().getFullYear(), 11, 31)
    });
    
    return months.map(month => ({
      date: month,
      hasTrip: tripPlans.some(plan => isSameMonth(plan.month, month)),
      trips: tripPlans.filter(plan => isSameMonth(plan.month, month))
    }));
  };

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition.toLowerCase()) {
      case 'snowy':
        return <Snowflake size={size} className="text-blue-400" />;
      case 'rainy':
        return <Umbrella size={size} className="text-blue-500" />;
      case 'sunny':
        return <Sun size={size} className="text-yellow-500" />;
      case 'hot and humid':
        return <Droplets size={size} className="text-red-500" />;
      case 'mild':
      case 'mild with some rain':
        return <Cloud size={size} className="text-gray-400" />;
      case 'warm and dry':
      case 'dry and clear':
      case 'sunny and warm':
      case 'sunny and pleasant':
        return <Sun size={size} className="text-orange-500" />;
      case 'cool and crisp':
      case 'cool and clear':
        return <Wind size={size} className="text-blue-300" />;
      case 'cold and possibly snowy':
        return <Snowflake size={size} className="text-blue-200" />;
      default:
        return <Sun size={size} className="text-yellow-500" />;
    }
  };

  const getFilteredPlans = () => {
    return tripPlans.filter(plan => {
      const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        plan.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.travelReason.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
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
          <p className="text-gray-600">Loading your annual trip planner...</p>
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
              Annual Trip Planner
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Plan your travel year with a balanced schedule and budget
            </motion.p>
          </div>

          {/* Budget Overview */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Annual Travel Budget</h2>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Budget
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Total Budget</h3>
                <p className="text-2xl font-bold text-blue-600">${yearlyBudget.total.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Allocated</h3>
                <p className="text-2xl font-bold text-green-600">${yearlyBudget.allocated.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{Math.round((yearlyBudget.allocated / yearlyBudget.total) * 100)}% of total</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Remaining</h3>
                <p className="text-2xl font-bold text-purple-600">${yearlyBudget.remaining.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{Math.round((yearlyBudget.remaining / yearlyBudget.total) * 100)}% of total</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Monthly Breakdown</h3>
              <div className="h-12 bg-gray-100 rounded-lg overflow-hidden flex">
                {Object.entries(yearlyBudget.breakdown).map(([month, amount]) => {
                  const percentage = (amount / yearlyBudget.total) * 100;
                  return (
                    <div
                      key={month}
                      className="h-full bg-blue-500 relative group"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-medium">{month}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                        ${amount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Year Calendar */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6">Year at a Glance</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {getMonthsWithTrips().map((month) => (
                <motion.div
                  key={format(month.date, 'MMM')}
                  whileHover={{ y: -5 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    isSameMonth(month.date, selectedMonth)
                      ? 'border-blue-500 bg-blue-50'
                      : month.hasTrip
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedMonth(month.date)}
                >
                  <h3 className="font-semibold text-center">{format(month.date, 'MMMM')}</h3>
                  {month.hasTrip ? (
                    <div className="mt-2 text-center">
                      <div className="text-xs text-gray-500">{month.trips.length} trip{month.trips.length !== 1 ? 's' : ''}</div>
                      <div className="flex justify-center mt-1">
                        {month.trips.map((trip, index) => (
                          <div 
                            key={index} 
                            className={`w-2 h-2 rounded-full mx-0.5 ${
                              trip.status === 'planned' 
                                ? 'bg-yellow-400' 
                                : trip.status === 'booked' 
                                ? 'bg-blue-400' 
                                : 'bg-green-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-center text-xs text-gray-400">No trips</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trip Management */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Trips</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search trips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="planned">Planned</option>
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => setShowAddTripModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Trip
                </button>
                <button
                  onClick={generateTripSuggestion}
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
                      <span>Suggest Trip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {getFilteredPlans().length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                <h3 className="text-xl font-semibold mb-2">No trips found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start planning your year of travel adventures'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    onClick={() => setShowAddTripModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Trip
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredPlans().map((plan) => (
                  <motion.div
                    key={plan.id}
                    variants={itemVariants}
                    className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={plan.image}
                        alt={plan.destination}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm">
                        {format(plan.month, 'MMMM yyyy')}
                      </div>
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'planned' 
                          ? 'bg-yellow-400 text-yellow-800' 
                          : plan.status === 'booked' 
                          ? 'bg-blue-400 text-blue-800' 
                          : 'bg-green-400 text-green-800'
                      }`}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-xl font-bold text-white">{plan.destination}</h3>
                        <div className="flex items-center gap-2 text-white/90">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{plan.duration} days</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>${plan.budget.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {plan.activities.slice(0, 3).map((activity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                          >
                            {activity}
                          </span>
                        ))}
                        {plan.activities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{plan.activities.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getWeatherIcon(plan.weather.condition, 20)}
                          <span className="text-sm text-gray-500">
                            {plan.weather.temperature.min}°-{plan.weather.temperature.max}°C
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Travel Insights */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                <Zap className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Optimal Planning</h3>
              <p className="text-gray-600">
                Balance your travel throughout the year to maximize experiences and manage your budget effectively.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                <Calendar className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Seasonal Awareness</h3>
              <p className="text-gray-600">
                Plan trips during ideal seasons for each destination to enjoy the best weather and local experiences.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Recommendations</h3>
              <p className="text-gray-600">
                Get personalized trip suggestions based on your preferences, budget, and optimal travel times.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add/Edit Trip Modal */}
      <AnimatePresence>
        {showAddTripModal && (
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
              className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {newTripPlan.destination ? `Trip to ${newTripPlan.destination}` : 'Add New Trip'}
                </h3>
                <button
                  onClick={() => setShowAddTripModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                    <select
                      value={format(selectedMonth, 'MMMM')}
                      onChange={(e) => {
                        const monthIndex = [
                          'January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'
                        ].indexOf(e.target.value);
                        setSelectedMonth(new Date(new Date().getFullYear(), monthIndex, 1));
                      }}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {eachMonthOfInterval({
                        start: new Date(new Date().getFullYear(), 0, 1),
                        end: new Date(new Date().getFullYear(), 11, 31)
                      }).map((month) => (
                        <option key={format(month, 'MMM')} value={format(month, 'MMMM')}>
                          {format(month, 'MMMM')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={newTripPlan.destination}
                      onChange={(e) => setNewTripPlan({ ...newTripPlan, destination: e.target.value })}
                      placeholder="Where are you going?"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTripPlan.description}
                    onChange={(e) => setNewTripPlan({ ...newTripPlan, description: e.target.value })}
                    placeholder="Describe your trip..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={newTripPlan.duration}
                        onChange={(e) => setNewTripPlan({ ...newTripPlan, duration: parseInt(e.target.value) })}
                        min={1}
                        max={30}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={newTripPlan.budget}
                        onChange={(e) => setNewTripPlan({ ...newTripPlan, budget: parseInt(e.target.value) })}
                        min={100}
                        step={100}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Reason
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={newTripPlan.travelReason}
                      onChange={(e) => setNewTripPlan({ ...newTripPlan, travelReason: e.target.value })}
                      placeholder="Why are you traveling? (e.g., vacation, business, family visit)"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activities
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newTripPlan.activities?.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                      >
                        <span>{activity}</span>
                        <button
                          onClick={() => setNewTripPlan({
                            ...newTripPlan,
                            activities: newTripPlan.activities?.filter((_, i) => i !== index)
                          })}
                          className="hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add activity..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          setNewTripPlan({
                            ...newTripPlan,
                            activities: [...(newTripPlan.activities || []), e.currentTarget.value]
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add activity..."]') as HTMLInputElement;
                        if (input && input.value) {
                          setNewTripPlan({
                            ...newTripPlan,
                            activities: [...(newTripPlan.activities || []), input.value]
                          });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-4">
                    {['planned', 'booked', 'completed'].map((status) => (
                      <label key={status} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={newTripPlan.status === status}
                          onChange={() => setNewTripPlan({ ...newTripPlan, status: status as any })}
                          className="text-blue-600"
                        />
                        <span className="capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowAddTripModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addTripPlan}
                    disabled={!newTripPlan.destination}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Add Trip
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Modal */}
      <AnimatePresence>
        {showBudgetModal && (
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
                <h3 className="text-xl font-bold">Update Annual Budget</h3>
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Annual Budget ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    defaultValue={yearlyBudget.total}
                    min={1000}
                    step={500}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                    if (input) {
                      updateBudget(parseInt(input.value));
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Budget
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {selectedPlan && (
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
              <div className="relative h-64">
                <img
                  src={selectedPlan.image}
                  alt={selectedPlan.destination}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full"
                >
                  <X size={24} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedPlan.destination}</h2>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Calendar size={18} />
                      <span>{format(selectedPlan.month, 'MMMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={18} />
                      <span>{selectedPlan.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={18} />
                      <span>${selectedPlan.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex justify-between items-start">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPlan.status === 'planned' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : selectedPlan.status === 'booked' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedPlan.status.charAt(0).toUpperCase() + selectedPlan.status.slice(1)}
                    </div>
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(selectedPlan.weather.condition)}
                      <span className="text-gray-600">
                        {selectedPlan.weather.temperature.min}°-{selectedPlan.weather.temperature.max}°C, {selectedPlan.weather.condition}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedPlan.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Trip Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">When</h4>
                          <p className="text-gray-600">{format(selectedPlan.month, 'MMMM yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Clock size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Duration</h4>
                          <p className="text-gray-600">{selectedPlan.duration} days</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <DollarSign size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Budget</h4>
                          <p className="text-gray-600">${selectedPlan.budget.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Briefcase size={20} className="text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Travel Reason</h4>
                          <p className="text-gray-600">{selectedPlan.travelReason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Activities</h3>
                    <div className="space-y-3">
                      {selectedPlan.activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {activity.toLowerCase().includes('ski') ? (
                              <Snowflake size={20} className="text-blue-600" />
                            ) : activity.toLowerCase().includes('beach') ? (
                              <Umbrella size={20} className="text-blue-600" />
                            ) : activity.toLowerCase().includes('hik') ? (
                              <Mountain size={20} className="text-blue-600" />
                            ) : activity.toLowerCase().includes('tour') ? (
                              <Compass size={20} className="text-blue-600" />
                            ) : activity.toLowerCase().includes('food') || activity.toLowerCase().includes('cuisine') || activity.toLowerCase().includes('dining') ? (
                              <Utensils size={20} className="text-blue-600" />
                            ) : activity.toLowerCase().includes('photo') ? (
                              <Camera size={20} className="text-blue-600" />
                            ) : activity.toLowerCase().includes('museum') || activity.toLowerCase().includes('temple') || activity.toLowerCase().includes('garden') ? (
                              <Building size={20} className="text-blue-600" />
                            ) : (
                              <Zap size={20} className="text-blue-600" />
                            )}
                          </div>
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t">
                  <button
                    onClick={() => deleteTripPlan(selectedPlan.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-800 flex items-center gap-2"
                  >
                    <Trash2 size={20} />
                    <span>Delete Trip</span>
                  </button>
                  
                  <div className="flex gap-3">
                    {selectedPlan.status === 'planned' && (
                      <button
                        onClick={() => {
                          updateTripStatus(selectedPlan.id, 'booked');
                          setSelectedPlan({
                            ...selectedPlan,
                            status: 'booked'
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark as Booked
                      </button>
                    )}
                    {selectedPlan.status === 'booked' && (
                      <button
                        onClick={() => {
                          updateTripStatus(selectedPlan.id, 'completed');
                          setSelectedPlan({
                            ...selectedPlan,
                            status: 'completed'
                          });
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnualTripPlanner;