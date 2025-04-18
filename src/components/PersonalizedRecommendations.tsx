import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Calendar, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userActivityService } from '../services/userActivityService';
import { useAuth } from '../context/AuthContext';

interface Recommendation {
  destination: string;
  description: string;
  dates: {
    start: Date;
    end: Date;
  };
  price: number;
  confidence: number;
  activities: string[];
  image: string;
}

const PersonalizedRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      try {
        const suggestions = await userActivityService.getSuggestedTrips(user._id);
        setRecommendations(suggestions);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="text-center py-12">
        <Compass className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600">Start exploring to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <Link
          to="/trip-planner"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Plan a Trip
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={recommendation.image}
                alt={recommendation.destination}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                {Math.round(recommendation.confidence * 100)}% Match
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{recommendation.destination}</h3>
              <p className="text-gray-600 mb-4">{recommendation.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {new Date(recommendation.dates.start).toLocaleDateString()} -{' '}
                    {new Date(recommendation.dates.end).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={16} />
                  <span>Starting from ${recommendation.price}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {recommendation.activities.map((activity, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm"
                  >
                    {activity}
                  </span>
                ))}
              </div>

              <Link
                to={`/trip-planner?destination=${encodeURIComponent(recommendation.destination)}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Plan This Trip
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalizedRecommendations;