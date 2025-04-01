import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Star, Filter, MapPin } from 'lucide-react';

interface Activity {
  _id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  images: { url: string; caption: string }[];
  rating: number;
  schedule: {
    openingHours: string;
    closingHours: string;
    daysOpen: string[];
  };
}

interface ActivityListProps {
  destinationId: string;
}

const ActivityList: React.FC<ActivityListProps> = ({ destinationId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    duration: '',
  });

  useEffect(() => {
    fetchActivities();
  }, [destinationId, filters]);

  const fetchActivities = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
      if (filters.duration) queryParams.append('duration', filters.duration);

      const response = await fetch(
        `/api/activities/destination/${destinationId}?${queryParams}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      setError('Error loading activities');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockActivities: Activity[] = [
    {
      _id: '1',
      name: 'Sunset Sailing Tour',
      description: 'Experience the breathtaking Santorini sunset from a luxury catamaran.',
      category: 'adventure',
      duration: 4,
      price: 120,
      images: [{ 
        url: 'https://images.unsplash.com/photo-1586016413664-864c0dd76f53?auto=format&fit=crop&q=80&w=2000',
        caption: 'Sailing tour'
      }],
      rating: 4.8,
      schedule: {
        openingHours: '15:00',
        closingHours: '21:00',
        daysOpen: ['Monday', 'Wednesday', 'Friday', 'Sunday']
      }
    },
    {
      _id: '2',
      name: 'Wine Tasting Experience',
      description: 'Visit local wineries and taste the finest Santorini wines.',
      category: 'food',
      duration: 3,
      price: 85,
      images: [{
        url: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=2000',
        caption: 'Wine tasting'
      }],
      rating: 4.6,
      schedule: {
        openingHours: '10:00',
        closingHours: '18:00',
        daysOpen: ['Tuesday', 'Thursday', 'Saturday']
      }
    },
    {
      _id: '3',
      name: 'Ancient Akrotiri Tour',
      description: 'Explore the preserved ruins of the ancient Minoan settlement.',
      category: 'culture',
      duration: 2,
      price: 45,
      images: [{
        url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=2000',
        caption: 'Archaeological site'
      }],
      rating: 4.7,
      schedule: {
        openingHours: '08:00',
        closingHours: '17:00',
        daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use mock data for development
  const displayActivities = activities.length > 0 ? activities : mockActivities;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="adventure">Adventure</option>
            <option value="culture">Culture</option>
            <option value="food">Food & Dining</option>
            <option value="nature">Nature</option>
            <option value="nightlife">Nightlife</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Prices</option>
            <option value="0-50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-500">$200+</option>
          </select>

          <select
            value={filters.duration}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Durations</option>
            <option value="2">Up to 2 hours</option>
            <option value="4">Up to 4 hours</option>
            <option value="8">Up to 8 hours</option>
            <option value="24">Full day</option>
          </select>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayActivities.map((activity) => (
          <motion.div
            key={activity._id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={activity.images[0]?.url}
              alt={activity.name}
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{activity.name}</h3>
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} className="fill-current" />
                  {activity.rating.toFixed(1)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {activity.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{activity.duration}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={16} />
                  <span>${activity.price}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ActivityList;