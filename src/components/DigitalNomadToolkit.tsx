import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Wifi, Coffee, MapPin, Clock,
  Calendar, Users, DollarSign, Globe, Laptop,
  Sun, Cloud, ThermometerSun, Wind, Umbrella,
  Building, Car, Train, Plane
} from 'lucide-react';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';

interface Workspace {
  id: string;
  name: string;
  type: 'cafe' | 'coworking' | 'library';
  address: string;
  rating: number;
  wifi: number;
  noise: number;
  price: number;
  hours: string;
  amenities: string[];
  images: string[];
}

interface CityMetrics {
  costOfLiving: number;
  internetSpeed: number;
  safety: number;
  weather: {
    temp: number;
    condition: string;
  };
  timezone: string;
}

const DigitalNomadToolkit: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [cityMetrics, setCityMetrics] = useState<CityMetrics | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    
    threshold: 0.1
  });

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

  // Mock data for development
  const mockWorkspaces: Workspace[] = [
    {
      id: '1',
      name: 'Digital Hub Coworking',
      type: 'coworking',
      address: '123 Innovation St, Bangkok',
      rating: 4.8,
      wifi: 100,
      noise: 2,
      price: 15,
      hours: '24/7',
      amenities: ['Meeting Rooms', 'Coffee Bar', 'Phone Booths', 'Printer'],
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200']
    },
    {
      id: '2',
      name: 'Nomad Cafe',
      type: 'cafe',
      address: '456 Digital Lane, Bangkok',
      rating: 4.6,
      wifi: 85,
      noise: 3,
      price: 5,
      hours: '7:00 - 22:00',
      amenities: ['Power Outlets', 'Free Water', 'Outdoor Seating'],
      images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200']
    }
  ];

  const mockMetrics: CityMetrics = {
    costOfLiving: 1200,
    internetSpeed: 100,
    safety: 85,
    weather: {
      temp: 28,
      condition: 'sunny'
    },
    timezone: 'GMT+7'
  };

  const popularCities = [
    { name: 'Bangkok', country: 'Thailand' },
    { name: 'Chiang Mai', country: 'Thailand' },
    { name: 'Bali', country: 'Indonesia' },
    { name: 'Lisbon', country: 'Portugal' },
    { name: 'Mexico City', country: 'Mexico' },
    { name: 'Medellin', country: 'Colombia' }
  ];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setWorkspaces(mockWorkspaces);
    setCityMetrics(mockMetrics);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              variants={itemVariants}
              className="inline-block p-4 bg-white rounded-full shadow-lg mb-6"
            >
              <Laptop className="w-12 h-12 text-indigo-500" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold mb-4"
            >
              Digital Nomad Toolkit
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Everything you need to work and thrive in the world's best digital nomad destinations
            </motion.p>
          </div>

          {/* City Selection */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6">Popular Nomad Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCities.map((city, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCitySelect(city.name)}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    selectedCity === city.name
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <h3 className="font-medium">{city.name}</h3>
                  <p className="text-sm text-gray-500">{city.country}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {selectedCity && cityMetrics && (
            <>
              {/* City Metrics */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
              >
                {[
                  {
                    icon: DollarSign,
                    label: 'Cost of Living',
                    value: `$${cityMetrics.costOfLiving}/mo`,
                    color: 'text-green-600 bg-green-100'
                  },
                  {
                    icon: Wifi,
                    label: 'Internet Speed',
                    value: `${cityMetrics.internetSpeed}Mbps`,
                    color: 'text-blue-600 bg-blue-100'
                  },
                  {
                    icon: Globe,
                    label: 'Time Zone',
                    value: cityMetrics.timezone,
                    color: 'text-purple-600 bg-purple-100'
                  },
                  {
                    icon: ThermometerSun,
                    label: 'Weather',
                    value: `${cityMetrics.weather.temp}°C`,
                    color: 'text-orange-600 bg-orange-100'
                  },
                  {
                    icon: Building,
                    label: 'Safety Score',
                    value: `${cityMetrics.safety}/100`,
                    color: 'text-indigo-600 bg-indigo-100'
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${metric.color}`}>
                        <metric.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-500">{metric.label}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Workspaces */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Work Spaces</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workspaces.map((workspace, index) => (
                    <motion.div
                      key={workspace.id}
                      variants={itemVariants}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img
                        src={workspace.images[0]}
                        alt={workspace.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{workspace.name}</h3>
                            <p className="text-gray-500 text-sm">{workspace.address}</p>
                          </div>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm capitalize">
                            {workspace.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Wifi className="text-gray-400" size={16} />
                            <span>{workspace.wifi}Mbps</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="text-gray-400" size={16} />
                            <span>{workspace.hours}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-gray-400" size={16} />
                            <span>${workspace.price}/day</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="text-gray-400" size={16} />
                            <span>Noise: {workspace.noise}/5</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {workspace.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Book Workspace
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Transportation */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  {
                    icon: Train,
                    title: 'Public Transit',
                    details: [
                      'Metro system coverage',
                      'Bus network',
                      'Monthly pass options'
                    ]
                  },
                  {
                    icon: Car,
                    title: 'Car Services',
                    details: [
                      'Ride-hailing apps',
                      'Car rental services',
                      'Taxi availability'
                    ]
                  },
                  {
                    icon: Plane,
                    title: 'Air Travel',
                    details: [
                      'International airports',
                      'Regional connections',
                      'Flight frequency'
                    ]
                  }
                ].map((section, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <section.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalNomadToolkit;