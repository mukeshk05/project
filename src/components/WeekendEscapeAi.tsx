import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Calendar, MapPin, Clock, DollarSign, Users,
  Compass, Briefcase, Sun, Umbrella, Hotel, Car,
  Utensils, Camera, Music, Book, Coffee, Zap,
  Sparkles, Loader, Check, X, Download, Share2
} from 'lucide-react';
import { format, addDays, addHours, differenceInDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../context/AuthContext';

interface WeekendTrip {
  id: string;
  destination: string;
  description: string;
  dates: {
    start: Date;
    end: Date;
  };
  transportation: {
    outbound: {
      type: string;
      departureTime: Date;
      arrivalTime: Date;
      details: string;
    };
    return: {
      type: string;
      departureTime: Date;
      arrivalTime: Date;
      details: string;
    };
  };
  accommodation: {
    name: string;
    address: string;
    type: string;
    amenities: string[];
    price: number;
    image: string;
  };
  activities: Array<{
    day: number;
    items: Array<{
      time: string;
      name: string;
      description: string;
      location: string;
      duration: string;
      price: number;
      category: string;
    }>;
  }>;
  dining: Array<{
    name: string;
    cuisine: string;
    price: number;
    address: string;
    reservationTime?: string;
    description: string;
  }>;
  budget: {
    transportation: number;
    accommodation: number;
    activities: number;
    food: number;
    total: number;
  };
  weather: {
    condition: string;
    temperature: {
      min: number;
      max: number;
    };
    precipitation: number;
  };
  packingList: string[];
  localTips: string[];
}

interface TripPreferences {
  departureCity: string;
  dates: {
    start: Date | null;
    end: Date | null;
  };
  budget: number;
  travelers: number;
  interests: string[];
  transportationMode: 'flight' | 'drive' | 'train' | 'any';
  maxDistance: number;
}

const WeekendEscapeAi: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<TripPreferences>({
    departureCity: '',
    dates: {
      start: addDays(new Date(), 14),
      end: addDays(new Date(), 16),
    },
    budget: 500,
    travelers: 2,
    interests: [],
    transportationMode: 'any',
    maxDistance: 300,
  });
  const [weekendTrip, setWeekendTrip] = useState<WeekendTrip | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [savedTrips, setSavedTrips] = useState<WeekendTrip[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tripName, setTripName] = useState('');

  useEffect(() => {
    fetchSavedTrips();
  }, []);

  const fetchSavedTrips = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTrips: WeekendTrip[] = [
        {
          id: '1',
          destination: 'Asheville, NC',
          description: 'A charming mountain town known for its vibrant arts scene, historic architecture, and proximity to the Blue Ridge Mountains.',
          dates: {
            start: addDays(new Date(), -30),
            end: addDays(new Date(), -28)
          },
          transportation: {
            outbound: {
              type: 'drive',
              departureTime: addDays(new Date(), -30),
              arrivalTime: addHours(addDays(new Date(), -30), 3),
              details: 'Drive from Charlotte, NC (3 hours)'
            },
            return: {
              type: 'drive',
              departureTime: addDays(new Date(), -28),
              arrivalTime: addHours(addDays(new Date(), -28), 3),
              details: 'Drive to Charlotte, NC (3 hours)'
            }
          },
          accommodation: {
            name: 'The Foundry Hotel',
            address: '51 S Market St, Asheville, NC 28801',
            type: 'boutique hotel',
            amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Air conditioning'],
            price: 250,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000'
          },
          activities: [
            {
              day: 1,
              items: [
                {
                  time: '10:00 AM',
                  name: 'Blue Ridge Parkway Scenic Drive',
                  description: 'Take in the stunning mountain views along America\'s favorite scenic drive.',
                  location: 'Blue Ridge Parkway',
                  duration: '2 hours',
                  price: 0,
                  category: 'nature'
                },
                {
                  time: '1:00 PM',
                  name: 'Downtown Asheville Art Walk',
                  description: 'Explore the vibrant art galleries and studios in downtown Asheville.',
                  location: 'Downtown Asheville',
                  duration: '3 hours',
                  price: 0,
                  category: 'culture'
                }
              ]
            },
            {
              day: 2,
              items: [
                {
                  time: '9:00 AM',
                  name: 'Biltmore Estate Tour',
                  description: 'Visit America\'s largest home, built by George Vanderbilt.',
                  location: 'Biltmore Estate',
                  duration: '4 hours',
                  price: 64,
                  category: 'sightseeing'
                },
                {
                  time: '3:00 PM',
                  name: 'Asheville Brewery Tour',
                  description: 'Sample craft beers from Asheville\'s renowned brewery scene.',
                  location: 'Various locations',
                  duration: '3 hours',
                  price: 45,
                  category: 'food & drink'
                }
              ]
            }
          ],
          dining: [
            {
              name: 'Cúrate',
              cuisine: 'Spanish',
              price: 60,
              address: '13 Biltmore Ave, Asheville, NC 28801',
              reservationTime: '7:00 PM',
              description: 'Authentic Spanish tapas in a lively, upscale setting.'
            },
            {
              name: 'Biscuit Head',
              cuisine: 'Southern',
              price: 15,
              address: '417 Biltmore Ave, Asheville, NC 28801',
              description: 'Famous for their cat-head biscuits and creative breakfast options.'
            }
          ],
          budget: {
            transportation: 100,
            accommodation: 500,
            activities: 218,
            food: 150,
            total: 968
          },
          weather: {
            condition: 'Partly Cloudy',
            temperature: {
              min: 55,
              max: 75
            },
            precipitation: 20
          },
          packingList: [
            'Light jacket for cool evenings',
            'Comfortable walking shoes',
            'Camera for scenic views',
            'Reusable water bottle',
            'Sunscreen',
            'Casual attire for restaurants'
          ],
          localTips: [
            'Asheville is known for its live music scene - check out local venues for performances',
            'Many restaurants source ingredients locally - ask about farm-to-table options',
            'Parking downtown can be challenging - consider using a parking garage',
            'The River Arts District is worth exploring for unique souvenirs'
          ]
        }
      ];
      
      setSavedTrips(mockTrips);
    } catch (error) {
      console.error('Error fetching saved trips:', error);
    }
  };

  const generateWeekendTrip = async () => {
    if (!preferences.departureCity || !preferences.dates.start || !preferences.dates.end) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTrip: WeekendTrip = {
        id: 'new',
        destination: 'Savannah, GA',
        description: 'A charming coastal city known for its antebellum architecture, oak-lined streets, and Southern hospitality.',
        dates: {
          start: preferences.dates.start,
          end: preferences.dates.end
        },
        transportation: {
          outbound: {
            type: preferences.transportationMode === 'any' ? 'flight' : preferences.transportationMode,
            departureTime: preferences.dates.start,
            arrivalTime: addHours(preferences.dates.start, 2),
            details: preferences.transportationMode === 'flight' || preferences.transportationMode === 'any' 
              ? 'Flight from ' + preferences.departureCity + ' to Savannah/Hilton Head International Airport'
              : preferences.transportationMode === 'drive'
              ? 'Drive from ' + preferences.departureCity + ' to Savannah (4 hours)'
              : 'Train from ' + preferences.departureCity + ' to Savannah Station'
          },
          return: {
            type: preferences.transportationMode === 'any' ? 'flight' : preferences.transportationMode,
            departureTime: preferences.dates.end,
            arrivalTime: addHours(preferences.dates.end, 2),
            details: preferences.transportationMode === 'flight' || preferences.transportationMode === 'any'
              ? 'Flight from Savannah/Hilton Head International Airport to ' + preferences.departureCity
              : preferences.transportationMode === 'drive'
              ? 'Drive from Savannah to ' + preferences.departureCity + ' (4 hours)'
              : 'Train from Savannah Station to ' + preferences.departureCity
          }
        },
        accommodation: {
          name: 'The Marshall House',
          address: '123 E Broughton St, Savannah, GA 31401',
          type: 'historic hotel',
          amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Air conditioning'],
          price: Math.min(preferences.budget * 0.4, 200),
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000'
        },
        activities: [
          {
            day: 1,
            items: [
              {
                time: '10:00 AM',
                name: 'Historic District Walking Tour',
                description: 'Explore Savannah\'s beautiful historic district with its 22 charming squares.',
                location: 'Historic District',
                duration: '2 hours',
                price: 25,
                category: preferences.interests.includes('history') ? 'history' : 'sightseeing'
              },
              {
                time: '1:00 PM',
                name: 'Forsyth Park Visit',
                description: 'Stroll through the iconic park with its famous fountain and Spanish moss-draped oak trees.',
                location: 'Forsyth Park',
                duration: '1 hour',
                price: 0,
                category: 'nature'
              },
              {
                time: '3:00 PM',
                name: 'River Street Exploration',
                description: 'Browse shops, galleries, and restaurants along the historic riverfront.',
                location: 'River Street',
                duration: '2 hours',
                price: 0,
                category: preferences.interests.includes('shopping') ? 'shopping' : 'sightseeing'
              }
            ]
          },
          {
            day: 2,
            items: [
              {
                time: '9:00 AM',
                name: 'Bonaventure Cemetery Tour',
                description: 'Visit the hauntingly beautiful cemetery featured in "Midnight in the Garden of Good and Evil."',
                location: 'Bonaventure Cemetery',
                duration: '2 hours',
                price: 30,
                category: preferences.interests.includes('history') ? 'history' : 'sightseeing'
              },
              {
                time: '12:00 PM',
                name: 'Tybee Island Beach Trip',
                description: 'Enjoy the sun and sand at this nearby beach destination.',
                location: 'Tybee Island',
                duration: '4 hours',
                price: 0,
                category: preferences.interests.includes('beach') ? 'beach' : 'nature'
              }
            ]
          }
        ],
        dining: [
          {
            name: 'The Olde Pink House',
            cuisine: 'Southern',
            price: 40,
            address: '23 Abercorn St, Savannah, GA 31401',
            reservationTime: '7:00 PM',
            description: 'Classic Southern cuisine in an elegant 18th-century mansion.'
          },
          {
            name: 'Leopold\'s Ice Cream',
            cuisine: 'Dessert',
            price: 8,
            address: '212 E Broughton St, Savannah, GA 31401',
            description: 'Historic ice cream parlor serving homemade ice cream since 1919.'
          },
          {
            name: 'The Collins Quarter',
            cuisine: 'Australian-inspired',
            price: 25,
            address: '151 Bull St, Savannah, GA 31401',
            description: 'Melbourne-inspired café serving breakfast, lunch, and dinner with a Southern twist.'
          }
        ],
        budget: {
          transportation: preferences.transportationMode === 'flight' ? 250 : preferences.transportationMode === 'train' ? 150 : 100,
          accommodation: Math.min(preferences.budget * 0.4, 200) * 2, // 2 nights
          activities: 55,
          food: 146,
          total: 0 // Will be calculated below
        },
        weather: {
          condition: 'Sunny',
          temperature: {
            min: 65,
            max: 85
          },
          precipitation: 10
        },
        packingList: [
          'Light, breathable clothing',
          'Comfortable walking shoes',
          'Sunscreen',
          'Sunglasses',
          'Light jacket for evenings',
          'Camera',
          'Reusable water bottle'
        ],
        localTips: [
          'Savannah allows open containers in the Historic District - you can take drinks to-go',
          'The city is very walkable, but free shuttles are available in the historic area',
          'Many historic homes offer tours - check opening hours in advance',
          'Ghost tours are popular in the evening and offer a unique perspective on the city\'s history'
        ]
      };
      
      // Calculate total budget
      mockTrip.budget.total = mockTrip.budget.transportation + mockTrip.budget.accommodation + mockTrip.budget.activities + mockTrip.budget.food;
      
      setWeekendTrip(mockTrip);
      setStep(2);
    } catch (error) {
      console.error('Error generating weekend trip:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTrip = () => {
    if (!weekendTrip || !tripName) return;
    
    const savedTrip = {
      ...weekendTrip,
      id: Date.now().toString()
    };
    
    setSavedTrips([...savedTrips, savedTrip]);
    setShowSaveModal(false);
    setTripName('');
  };

  const getActivityIcon = (category: string, size = 20) => {
    switch (category.toLowerCase()) {
      case 'nature':
        return <Leaf size={size} className="text-green-500" />;
      case 'culture':
      case 'history':
        return <Landmark size={size} className="text-purple-500" />;
      case 'sightseeing':
        return <Camera size={size} className="text-blue-500" />;
      case 'food & drink':
        return <Utensils size={size} className="text-orange-500" />;
      case 'shopping':
        return <ShoppingBag size={size} className="text-pink-500" />;
      case 'beach':
        return <Umbrella size={size} className="text-yellow-500" />;
      default:
        return <Compass size={size} className="text-indigo-500" />;
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
      default:
        return <Sun size={size} className="text-yellow-500" />;
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

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={preferences.departureCity}
              onChange={(e) => setPreferences({ ...preferences, departureCity: e.target.value })}
              placeholder="Where are you starting from?"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transportation Mode
          </label>
          <select
            value={preferences.transportationMode}
            onChange={(e) => setPreferences({ ...preferences, transportationMode: e.target.value as any })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Any Transportation</option>
            <option value="flight">Flight</option>
            <option value="drive">Drive</option>
            <option value="train">Train</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekend Dates
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <DatePicker
                selected={preferences.dates.start}
                onChange={(date) => setPreferences({
                  ...preferences,
                  dates: { ...preferences.dates, start: date }
                })}
                selectsStart
                startDate={preferences.dates.start}
                endDate={preferences.dates.end}
                minDate={new Date()}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Start Date"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <DatePicker
                selected={preferences.dates.end}
                onChange={(date) => setPreferences({
                  ...preferences,
                  dates: { ...preferences.dates, end: date }
                })}
                selectsEnd
                startDate={preferences.dates.start}
                endDate={preferences.dates.end}
                minDate={preferences.dates.start}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="End Date"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Distance (miles)
          </label>
          <div className="relative">
            <Compass className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              value={preferences.maxDistance}
              onChange={(e) => setPreferences({ ...preferences, maxDistance: parseInt(e.target.value) })}
              min={50}
              max={1000}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget per Person
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              value={preferences.budget}
              onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) })}
              min={100}
              step={50}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Travelers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              value={preferences.travelers}
              onChange={(e) => setPreferences({ ...preferences, travelers: parseInt(e.target.value) })}
              min={1}
              max={10}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests (Select all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { icon: Briefcase, label: 'History' },
            { icon: Camera, label: 'Sightseeing' },
            { icon: Utensils, label: 'Food' },
            { icon: Music, label: 'Nightlife' },
            { icon: Umbrella, label: 'Beach' },
            { icon: Compass, label: 'Adventure' },
            { icon: Book, label: 'Culture' },
            { icon: Coffee, label: 'Relaxation' }
          ].map((interest) => {
            const isSelected = preferences.interests.includes(interest.label.toLowerCase());
            return (
              <button
                key={interest.label}
                onClick={() => {
                  if (isSelected) {
                    setPreferences({
                      ...preferences,
                      interests: preferences.interests.filter(i => i !== interest.label.toLowerCase())
                    });
                  } else {
                    setPreferences({
                      ...preferences,
                      interests: [...preferences.interests, interest.label.toLowerCase()]
                    });
                  }
                }}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                } transition-colors`}
              >
                <interest.icon size={20} className={isSelected ? 'text-blue-500' : 'text-gray-400'} />
                <span>{interest.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateWeekendTrip}
          disabled={isGenerating || !preferences.departureCity || !preferences.dates.start || !preferences.dates.end}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-3 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader className="animate-spin" size={24} />
              <span>Planning Your Escape...</span>
            </>
          ) : (
            <>
              <Zap size={24} />
              <span>Generate Weekend Escape</span>
            </>
          )}
        </motion.button>
      </div>
      
      {savedTrips.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Your Saved Weekend Escapes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={trip.accommodation.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white">{trip.destination}</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar size={16} />
                      <span>
                        {format(trip.dates.start, 'MMM d')} - {format(trip.dates.end, 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500" />
                      <span>${trip.budget.total} total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      <span>{differenceInDays(trip.dates.end, trip.dates.start)} days</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setWeekendTrip(trip);
                      setStep(2);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => {
    if (!weekendTrip) return null;
    
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← Back to preferences
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Bookmark size={20} />
            </button>
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download size={20} />
            </button>
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative h-80 rounded-xl overflow-hidden">
          <img
            src={weekendTrip.accommodation.image}
            alt={weekendTrip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-3xl font-bold text-white mb-2">{weekendTrip.destination}</h2>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>
                  {format(weekendTrip.dates.start, 'MMM d')} - {format(weekendTrip.dates.end, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={18} />
                <span>{preferences.travelers} travelers</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={18} />
                <span>${weekendTrip.budget.total} total</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600">{weekendTrip.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plane className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Transportation</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Outbound</h4>
                <p className="text-gray-600">{weekendTrip.transportation.outbound.details}</p>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>{format(weekendTrip.transportation.outbound.departureTime, 'EEE, MMM d • h:mm a')}</span>
                  <ArrowRight size={16} />
                  <span>{format(weekendTrip.transportation.outbound.arrivalTime, 'h:mm a')}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Return</h4>
                <p className="text-gray-600">{weekendTrip.transportation.return.details}</p>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>{format(weekendTrip.transportation.return.departureTime, 'EEE, MMM d • h:mm a')}</span>
                  <ArrowRight size={16} />
                  <span>{format(weekendTrip.transportation.return.arrivalTime, 'h:mm a')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Hotel className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Accommodation</h3>
            </div>
            <h4 className="font-semibold">{weekendTrip.accommodation.name}</h4>
            <p className="text-gray-600 mb-2">{weekendTrip.accommodation.address}</p>
            <p className="text-gray-600 mb-4">{weekendTrip.accommodation.type}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {weekendTrip.accommodation.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                >
                  {amenity}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Price per night</span>
              <span className="font-semibold">${weekendTrip.accommodation.price}</span>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                {getWeatherIcon(weekendTrip.weather.condition)}
              </div>
              <h3 className="text-xl font-bold">Weather</h3>
            </div>
            <h4 className="font-semibold">{weekendTrip.weather.condition}</h4>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Temperature</span>
              <span>{weekendTrip.weather.temperature.min}°F - {weekendTrip.weather.temperature.max}°F</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Precipitation</span>
              <span>{weekendTrip.weather.precipitation}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Itinerary</h3>
            <div className="space-y-6">
              {weekendTrip.activities.map((day) => (
                <div key={day.day} className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="font-semibold mb-4">Day {day.day}: {format(addDays(weekendTrip.dates.start, day.day - 1), 'EEEE, MMMM d')}</h4>
                  <div className="space-y-4">
                    {day.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-16 text-right text-gray-500">{item.time}</div>
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                              {getActivityIcon(item.category)}
                            </div>
                            <div>
                              <h5 className="font-semibold">{item.name}</h5>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>{item.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{item.duration}</span>
                                </div>
                                {item.price > 0 && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign size={14} />
                                    <span>${item.price}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Dining Recommendations</h3>
              <div className="space-y-4">
                {weekendTrip.dining.map((restaurant, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{restaurant.name}</h4>
                      <span className="text-green-600">${restaurant.price}/person</span>
                    </div>
                    <p className="text-gray-500 mb-2">{restaurant.cuisine}</p>
                    <p className="text-gray-600 mb-2">{restaurant.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{restaurant.address}</span>
                    </div>
                    {restaurant.reservationTime && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Clock size={14} />
                        <span>Reservation: {restaurant.reservationTime}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Budget Breakdown</h3>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transportation</span>
                    <span>${weekendTrip.budget.transportation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accommodation</span>
                    <span>${weekendTrip.budget.accommodation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Activities</span>
                    <span>${weekendTrip.budget.activities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Food & Dining</span>
                    <span>${weekendTrip.budget.food}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t font-semibold">
                    <span>Total</span>
                    <span>${weekendTrip.budget.total}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Per Person</span>
                    <span>${Math.round(weekendTrip.budget.total / preferences.travelers)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Packing List</h3>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ul className="space-y-2">
                  {weekendTrip.packingList.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 border rounded flex items-center justify-center">
                        <Check size={14} className="text-gray-400" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Local Tips</h3>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ul className="space-y-3">
                  {weekendTrip.localTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Sparkles size={18} className="text-yellow-500 mt-1" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              <Plane className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Weekend Escape AI
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Plan the perfect weekend getaway with AI-powered recommendations
            </motion.p>
          </div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {step === 1 ? renderStep1() : renderStep2()}
          </motion.div>

          {/* Features */}
          {step === 1 && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                  <Zap className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Quick Planning</h3>
                <p className="text-gray-600">
                  Get a complete weekend itinerary in seconds, tailored to your preferences and budget.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Nearby Destinations</h3>
                <p className="text-gray-600">
                  Discover perfect weekend getaways within your preferred travel distance.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                  <Sparkles className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Personalized Experiences</h3>
                <p className="text-gray-600">
                  Get recommendations for activities and dining based on your interests and preferences.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Save Trip Modal */}
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
                <h3 className="text-xl font-bold">Save Your Weekend Escape</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Weekend in Savannah"
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
                  onClick={saveTrip}
                  disabled={!tripName.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Save Trip
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeekendEscapeAi;