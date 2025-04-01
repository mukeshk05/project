import React from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Fuel, Settings, DollarSign, ArrowRight } from 'lucide-react';

interface CarOption {
  id: string;
  make: string;
  model: string;
  type: string;
  seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: string;
  pricePerDay: number;
  image: string;
  features: string[];
  available: boolean;
}

const mockCars: CarOption[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    type: 'Sedan',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'Gasoline',
    pricePerDay: 45,
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=2000',
    features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
    available: true
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    type: 'SUV',
    seats: 7,
    transmission: 'automatic',
    fuelType: 'Hybrid',
    pricePerDay: 65,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=2000',
    features: ['Navigation', 'Sunroof', 'Apple CarPlay'],
    available: true
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

const CarResults: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Available Cars</h1>
          <p className="text-gray-600">Choose from our selection of quality vehicles</p>
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
                    Price per Day
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$200</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Sedan</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">SUV</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Luxury</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Automatic</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Navigation</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2">Bluetooth</span>
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
            {mockCars.map((car) => (
              <motion.div
                key={car.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="h-48 md:h-full">
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-gray-500">{car.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="text-blue-600" size={20} />
                        <span className="text-2xl font-bold">{car.pricePerDay}</span>
                        <span className="text-gray-500">/day</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="text-gray-400" size={20} />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="text-gray-400" size={20} />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="text-gray-400" size={20} />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="text-gray-400" size={20} />
                        <span>{car.type}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {car.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        Select Car
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

export default CarResults;