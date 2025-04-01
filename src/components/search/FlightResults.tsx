import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, DollarSign, Users, ArrowRight } from 'lucide-react';

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
}

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
    availableSeats: 12
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
    availableSeats: 8
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
      duration: 0.5
    }
  }
};

const FlightResults: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Available Flights</h1>
          <p className="text-gray-600">Showing best matches for your search</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$2000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stops
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Non-stop</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">1 Stop</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Airlines
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Emirates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">British Airways</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 space-y-4"
          >
            {mockFlights.map((flight) => (
              <motion.div
                key={flight.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="text-blue-600" size={20} />
                      <span className="font-semibold">{flight.airline}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Flight {flight.flightNumber}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold">{flight.departureTime}</div>
                    <div className="text-sm text-gray-500">{flight.departureCity}</div>
                  </div>

                  <div className="text-center flex flex-col items-center">
                    <Clock size={16} className="text-gray-400 mb-1" />
                    <div className="text-sm font-medium">{flight.duration}</div>
                    <div className="text-xs text-gray-500">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold">{flight.arrivalTime}</div>
                    <div className="text-sm text-gray-500">{flight.arrivalCity}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="text-gray-400" size={16} />
                      <span className="font-semibold">${flight.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-600">
                        {flight.availableSeats} seats left
                      </span>
                    </div>
                  </div>
                  
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Select
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;