import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, DollarSign, Users, ArrowRight, Search, Filter, Clock, Loader, ArrowUpRight, Sparkles } from 'lucide-react';
import PlacesAutocomplete from '../PlacesAutocomplete';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  availableSeats: number;
  aircraft: string;
  features: string[];
}

const FlightResults: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('initial');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departDate: null as Date | null,
    returnDate: null as Date | null,
    passengers: 1,
    class: 'economy'
  });

  const mockFlights: Flight[] = [
    {
      id: '1',
      airline: 'Emirates',
      flightNumber: 'EK123',
      departureCity: 'New York',
      arrivalCity: 'Dubai',
      departureTime: '10:00 AM',
      arrivalTime: '7:00 AM',
      duration: '14h',
      price: 850,
      stops: 0,
      availableSeats: 12,
      aircraft: 'Boeing 777-300ER',
      features: ['Wi-Fi', 'Entertainment', 'Meals']
    },
    {
      id: '2',
      airline: 'British Airways',
      flightNumber: 'BA456',
      departureCity: 'London',
      arrivalCity: 'Paris',
      departureTime: '2:30 PM',
      arrivalTime: '4:45 PM',
      duration: '2h 15m',
      price: 220,
      stops: 0,
      availableSeats: 8,
      aircraft: 'Airbus A320',
      features: ['Wi-Fi', 'Snacks']
    }
  ];

  const performSearch = async () => {
    setIsSearching(true);
    setSearchProgress(0);
    setCurrentStep('searching');

    // Simulate search progress
    for (let i = 0; i <= 100; i += 10) {
      setSearchProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setFlights(mockFlights);
    setCurrentStep('results');
    setIsSearching(false);
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

  const progressBarVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${searchProgress}%`,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const searchSteps = [
    { label: 'Searching airlines...', progress: 20 },
    { label: 'Checking availability...', progress: 40 },
    { label: 'Finding best prices...', progress: 60 },
    { label: 'Comparing options...', progress: 80 },
    { label: 'Finalizing results...', progress: 100 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h1 className="text-3xl font-bold mb-6">Find Your Perfect Flight</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PlacesAutocomplete
                placeholder="From"
                type="airport"
                onSelect={(location) => setSearchParams({
                  ...searchParams,
                  from: location.description
                })}
              />
              <PlacesAutocomplete
                placeholder="To"
                type="airport"
                onSelect={(location) => setSearchParams({
                  ...searchParams,
                  to: location.description
                })}
              />
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                <DatePicker
                  selected={searchParams.departDate}
                  onChange={(date) => setSearchParams({
                    ...searchParams,
                    departDate: date
                  })}
                  placeholderText="Departure Date"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  value={searchParams.class}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    class: e.target.value
                  })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={performSearch}
              className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <Search size={20} />
              Search Flights
            </motion.button>
          </div>

          {isSearching && (
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      variants={progressBarVariants}
                      initial="initial"
                      animate="animate"
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <div className="mt-4">
                    {searchSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: searchProgress >= step.progress ? 1 : 0.5,
                          x: 0
                        }}
                        className="flex items-center gap-2 text-gray-600 mb-2"
                      >
                        {searchProgress >= step.progress ? (
                          <Sparkles className="text-purple-500" size={16} />
                        ) : (
                          <Loader className="animate-spin text-gray-400" size={16} />
                        )}
                        <span>{step.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {currentStep === 'results' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {flights.map((flight) => (
                <motion.div
                  key={flight.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Plane className="text-blue-600" size={24} />
                        <div>
                          <h3 className="font-semibold">{flight.airline}</h3>
                          <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{flight.aircraft}</p>
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-2xl font-semibold">{flight.departureTime}</p>
                      <p className="text-gray-500">{flight.departureCity}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-500">{flight.duration}</p>
                        <div className="w-32 h-px bg-gray-300 my-2 relative">
                          <div className="absolute -top-1 right-0 w-2 h-2 bg-blue-600 rounded-full" />
                          <Plane size={16} className="absolute -top-2 left-0 text-blue-600 transform -rotate-45" />
                        </div>
                        <p className="text-sm text-gray-500">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-semibold">{flight.arrivalTime}</p>
                      <p className="text-gray-500">{flight.arrivalCity}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-green-600" size={20} />
                        <span className="text-2xl font-bold">${flight.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="text-gray-400" size={20} />
                        <span className="text-gray-600">{flight.availableSeats} seats left</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {flight.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                      >
                        Select
                        <ArrowUpRight size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlightResults;