import React from 'react';
import { motion } from 'framer-motion';
import { Building, Star, MapPin, Wifi, Coffee, Dumbbell, School as Pool, ArrowRight, Search } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  description: string;
  distance: string;
}

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    location: 'Downtown Manhattan, New York',
    rating: 4.8,
    reviews: 2456,
    pricePerNight: 299,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Fitness Center', 'Restaurant'],
    description: 'Luxury hotel in the heart of Manhattan with stunning city views',
    distance: '0.2 miles from city center'
  },
  {
    id: '2',
    name: 'Seaside Resort & Spa',
    location: 'Miami Beach, Florida',
    rating: 4.6,
    reviews: 1832,
    pricePerNight: 399,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000',
    amenities: ['Beachfront', 'Spa', 'Pool', 'Restaurant', 'Bar'],
    description: 'Beachfront resort with private beach access and luxury spa',
    distance: '0.1 miles from beach'
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

const HotelResults: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Available Hotels</h1>
          <p className="text-gray-600">Find your perfect stay from our curated selection</p>
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
                    Price per Night
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Star Rating
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <label key={stars} className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="ml-2 flex">
                          {Array.from({ length: stars }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-yellow-400 fill-current"
                            />
                          ))}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Pool</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Spa</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Fitness Center</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Restaurant</span>
                    </label>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSearch(activeSearch)}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mt-6"
              >
                <Search size={20} />
                Search Hotels
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 space-y-6"
          >
            {mockHotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="h-48 md:h-full">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <MapPin size={16} />
                          <span>{hotel.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${hotel.pricePerNight}</div>
                        <span className="text-gray-500">per night</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < Math.floor(hotel.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {hotel.reviews} reviews
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{hotel.description}</p>

                    <div className="flex flex-wrap gap-4 mb-6">
                      {hotel.amenities.includes('Free WiFi') && (
                        <div className="flex items-center gap-1">
                          <Wifi size={16} className="text-gray-400" />
                          <span>Free WiFi</span>
                        </div>
                      )}
                      {hotel.amenities.includes('Pool') && (
                        <div className="flex items-center gap-1">
                          <Pool size={16} className="text-gray-400" />
                          <span>Pool</span>
                        </div>
                      )}
                      {hotel.amenities.includes('Fitness Center') && (
                        <div className="flex items-center gap-1">
                          <Dumbbell size={16} className="text-gray-400" />
                          <span>Fitness Center</span>
                        </div>
                      )}
                      {hotel.amenities.includes('Restaurant') && (
                        <div className="flex items-center gap-1">
                          <Coffee size={16} className="text-gray-400" />
                          <span>Restaurant</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {hotel.distance}
                      </span>
                      <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                        View Rooms
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

export default HotelResults;