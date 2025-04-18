import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Compass, Calendar, DollarSign, 
  Clock, Sun, Cloud, Umbrella, ThermometerSun, Wind,
  Coffee, Utensils, Camera, Music, ArrowRight, Loader,
  AlertCircle, Check, X
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Suggestion {
  id: string;
  type: 'attraction' | 'restaurant' | 'event' | 'activity';
  name: string;
  description: string;
  distance: number; // in km
  rating: number;
  price: number; // 1-4 scale ($-$$$$)
  image: string;
  openHours?: string;
  tags: string[];
  weather?: {
    condition: string;
    temperature: number;
    icon: string;
  };
}

interface Weather {
  current: {
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: Array<{
    date: Date;
    condition: string;
    temperature: {
      min: number;
      max: number;
    };
    icon: string;
  }>;
}

const GeoAwareSuggestions: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    maxDistance: 10,
    maxPrice: 4,
    weather: false
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchLocationData();
    }
  }, [location]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true);
        } else {
          setError('Unable to retrieve your location. Please try again.');
        }
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchLocationData = async () => {
    if (!location) return;
    
    setIsLoading(true);
    
    try {
      // Reverse geocode to get address
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
        setAddress(geocodeData.results[0].formatted_address);
      }
      
      // Fetch nearby suggestions
      const suggestionsResponse = await fetch('http://localhost:5000/api/suggestions/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          radius: filters.maxDistance
        }),
      });
      
      if (!suggestionsResponse.ok) {
        throw new Error('Failed to fetch nearby suggestions');
      }
      
      const suggestionsData = await suggestionsResponse.json();
      setSuggestions(suggestionsData);
      
      // Fetch weather data
      const weatherResponse = await fetch('http://localhost:5000/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng
        }),
      });
      
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching location data:', error);
      setError('Failed to fetch location data. Please try again.');
      
      // Use mock data for development
      generateMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate mock suggestions
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'attraction',
        name: 'Central Park',
        description: 'Iconic urban park with walking paths, a zoo, and boat rentals.',
        distance: 1.2,
        rating: 4.8,
        price: 1,
        image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&q=80&w=2000',
        openHours: '6:00 AM - 10:00 PM',
        tags: ['park', 'nature', 'walking', 'family-friendly'],
        weather: {
          condition: 'sunny',
          temperature: 24,
          icon: 'sun'
        }
      },
      {
        id: '2',
        type: 'restaurant',
        name: 'The Local Bistro',
        description: 'Cozy restaurant serving seasonal, locally-sourced cuisine.',
        distance: 0.8,
        rating: 4.5,
        price: 3,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000',
        openHours: '11:00 AM - 10:00 PM',
        tags: ['dinner', 'lunch', 'local', 'seasonal']
      },
      {
        id: '3',
        type: 'event',
        name: 'Summer Jazz Festival',
        description: 'Annual jazz festival featuring local and international artists.',
        distance: 2.5,
        rating: 4.7,
        price: 2,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2000',
        tags: ['music', 'festival', 'jazz', 'outdoor']
      },
      {
        id: '4',
        type: 'activity',
        name: 'Kayaking Tour',
        description: 'Guided kayaking tour of the harbor with stunning city views.',
        distance: 3.1,
        rating: 4.9,
        price: 3,
        image: 'https://images.unsplash.com/photo-1472745433479-4556f22e32c2?auto=format&fit=crop&q=80&w=2000',
        openHours: '9:00 AM - 5:00 PM',
        tags: ['water', 'adventure', 'tour', 'outdoor'],
        weather: {
          condition: 'partly cloudy',
          temperature: 22,
          icon: 'cloud-sun'
        }
      }
    ];
    
    setSuggestions(mockSuggestions);
    
    // Generate mock weather data
    const mockWeather: Weather = {
      current: {
        condition: 'Sunny',
        temperature: 24,
        humidity: 45,
        windSpeed: 8,
        icon: 'sun'
      },
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: addDays(new Date(), i),
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Sunny'][i],
        temperature: {
          min: 18 + Math.floor(Math.random() * 5),
          max: 25 + Math.floor(Math.random() * 5)
        },
        icon: ['sun', 'cloud-sun', 'cloud', 'cloud-rain', 'sun'][i]
      }))
    };
    
    setWeather(mockWeather);
    
    // Mock address
    setAddress('Central Park, New York, NY 10022, USA');
  };

  const filterSuggestions = () => {
    return suggestions.filter(suggestion => {
      const matchesType = filters.type === 'all' || suggestion.type === filters.type;
      const matchesDistance = suggestion.distance <= filters.maxDistance;
      const matchesPrice = suggestion.price <= filters.maxPrice;
      const matchesWeather = !filters.weather || (suggestion.weather && suggestion.weather.condition === 'sunny');
      
      return matchesType && matchesDistance && matchesPrice && matchesWeather;
    });
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud className="text-gray-400" />;
      case 'cloudy':
        return <Cloud className="text-gray-500" />;
      case 'rainy':
        return <Umbrella className="text-blue-500" />;
      default:
        return <Sun className="text-yellow-500" />;
    }
  };

  const getPriceDisplay = (price: number) => {
    return '$'.repeat(price);
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

  if (permissionDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold mb-4">Location Access Denied</h2>
          <p className="text-gray-600 mb-6">
            We need access to your location to provide personalized suggestions.
            Please enable location access in your browser settings and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredSuggestions = filterSuggestions();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Compass className="text-blue-600" size={32} />
                <h1 className="text-2xl font-bold">Nearby Suggestions</h1>
              </div>
              {address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <p>{address}</p>
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getCurrentLocation}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Navigation size={20} />
              Update Location
            </motion.button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-blue-600" size={32} />
              <span className="ml-2 text-gray-600">Fetching nearby suggestions...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Weather Section */}
              {weather && (
                <motion.div
                  variants={itemVariants}
                  className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Local Weather</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-4 rounded-lg">
                        {getWeatherIcon(weather.current.condition)}
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{weather.current.temperature}°C</p>
                        <p>{weather.current.condition}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
                        <p className="text-sm">{format(weather.forecast[0].date, 'EEE')}</p>
                        <div className="my-2">
                          {getWeatherIcon(weather.forecast[0].condition)}
                        </div>
                        <p className="text-sm">{weather.forecast[0].temperature.max}°</p>
                      </div>
                      <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
                        <p className="text-sm">{format(weather.forecast[1].date, 'EEE')}</p>
                        <div className="my-2">
                          {getWeatherIcon(weather.forecast[1].condition)}
                        </div>
                        <p className="text-sm">{weather.forecast[1].temperature.max}°</p>
                      </div>
                      <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
                        <p className="text-sm">{format(weather.forecast[2].date, 'EEE')}</p>
                        <div className="my-2">
                          {getWeatherIcon(weather.forecast[2].condition)}
                        </div>
                        <p className="text-sm">{weather.forecast[2].temperature.max}°</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Filters */}
              <motion.div
                variants={itemVariants}
                className="mb-8 bg-gray-50 rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="attraction">Attractions</option>
                      <option value="restaurant">Restaurants</option>
                      <option value="event">Events</option>
                      <option value="activity">Activities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Distance (km)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={filters.maxDistance}
                      onChange={(e) => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1 km</span>
                      <span>{filters.maxDistance} km</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$</span>
                      <span>{getPriceDisplay(filters.maxPrice)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weather-Appropriate
                    </label>
                    <div className="flex items-center mt-3">
                      <input
                        type="checkbox"
                        checked={filters.weather}
                        onChange={(e) => setFilters({ ...filters, weather: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="ml-2 text-gray-700">Show weather-appropriate only</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Suggestions */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  {filteredSuggestions.length} Suggestions Near You
                </h2>
                
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredSuggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      variants={itemVariants}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      <div className="relative h-48">
                        <img
                          src={suggestion.image}
                          alt={suggestion.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                          {suggestion.distance.toFixed(1)} km
                        </div>
                        {suggestion.weather && (
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 rounded-full">
                            {getWeatherIcon(suggestion.weather.condition)}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{suggestion.name}</h3>
                          <span className="text-gray-600">{getPriceDisplay(suggestion.price)}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{suggestion.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-400 fill-current" size={16} />
                            <span>{suggestion.rating}</span>
                          </div>
                          {suggestion.openHours && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock size={14} />
                              <span>{suggestion.openHours}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {suggestion.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Suggestion Detail Modal */}
      <AnimatePresence>
        {selectedSuggestion && (
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
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={selectedSuggestion.image}
                  alt={selectedSuggestion.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white">{selectedSuggestion.name}</h2>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{selectedSuggestion.distance.toFixed(1)} km away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="fill-current text-yellow-400" size={16} />
                      <span>{selectedSuggestion.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">{selectedSuggestion.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedSuggestion.openHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Hours</p>
                        <p>{selectedSuggestion.openHours}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Price Range</p>
                      <p>{getPriceDisplay(selectedSuggestion.price)}</p>
                    </div>
                  </div>
                </div>
                
                {selectedSuggestion.weather && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(selectedSuggestion.weather.condition)}
                      <div>
                        <p className="font-medium">Current Weather</p>
                        <p className="text-gray-600">
                          {selectedSuggestion.weather.condition}, {selectedSuggestion.weather.temperature}°C
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <p className="font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSuggestion.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Get Directions
                    <ArrowRight size={20} />
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

export default GeoAwareSuggestions;