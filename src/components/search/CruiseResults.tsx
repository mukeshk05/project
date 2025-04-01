import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Calendar, Clock, MapPin, Anchor, Users, DollarSign, ArrowRight } from 'lucide-react';

interface Cruise {
  id: string;
  name: string;
  line: string;
  departure: {
    port: string;
    date: string;
  };
  arrival: {
    port: string;
    date: string;
  };
  duration: string;
  price: number;
  image: string;
  itinerary: string[];
  amenities: string[];
  shipName: string;
  capacity: number;
}

const mockCruises: Cruise[] = [
  {
    id: '1',
    name: 'Caribbean Paradise',
    line: 'Royal Caribbean',
    departure: {
      port: 'Miami, FL',
      date: '2024-06-15'
    },
    arrival: {
      port: 'Miami, FL',
      date: '2024-06-22'
    },
    duration: '7 nights',
    price: 899,
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=2000',
    itinerary: ['Miami', 'Nassau', 'St. Thomas', 'St. Maarten'],
    amenities: ['Pool', 'Spa', 'Casino', 'Theater'],
    shipName: 'Oasis of the Seas',
    capacity: 5400
  },
  {
    id: '2',
    name: 'Mediterranean Explorer',
    line: 'Norwegian Cruise Line',
    departure: {
      port: 'Barcelona, Spain',
      date: '2024-07-01'
    },
    arrival: {
      port: 'Rome, Italy',
      date: '2024-07-08'
    },
    duration: '7 nights',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=2000',
    itinerary: ['Barcelona', 'Marseille', 'Florence', 'Rome'],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Gym'],
    shipName: 'Norwegian Epic',
    capacity: 4100
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

const CruiseResults: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Available Cruises</h1>
          <p className="text-gray-600">Discover your perfect voyage</p>
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
                    max="5000"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$5000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">3-5 nights</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">6-9 nights</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">10+ nights</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cruise Lines
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Royal Caribbean</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Norwegian</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Carnival</span>
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
            className="lg:col-span-3 space-y-6"
          >
            {mockCruises.map((cruise) => (
              <motion.div
                key={cruise.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="h-48 md:h-full">
                    <img
                      src={cruise.image}
                      alt={cruise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{cruise.name}</h3>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <Ship size={16} />
                          <span>{cruise.line}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${cruise.price}</div>
                        <span className="text-gray-500">per person</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span>Departure: {cruise.departure.port}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{new Date(cruise.departure.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Clock size={16} className="text-gray-400" />
                          <span>{cruise.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users size={16} className="text-gray-400" />
                          <span>{cruise.capacity} passengers</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Itinerary</h4>
                      <div className="flex items-center gap-2">
                        {cruise.itinerary.map((port, index) => (
                          <React.Fragment key={port}>
                            <span className="text-gray-600">{port}</span>
                            {index < cruise.itinerary.length - 1 && (
                              <Anchor size={12} className="text-gray-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {cruise.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        View Details
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CruiseResults;