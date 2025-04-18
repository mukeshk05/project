import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Calendar, DollarSign, Users, Heart, Camera, Utensils,
  Compass, Mountain, Beach, Building, Music, Book, Coffee, ArrowRight
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TravelGoal {
  id: string;
  icon: any;
  name: string;
  description: string;
  category: string;
}

const GoalBasedPlanner: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [budget, setBudget] = useState<number>(2000);
  const [travelers, setTravelers] = useState<number>(2);
  const [step, setStep] = useState<number>(1);

  const goals: TravelGoal[] = [
    {
      id: 'romance',
      icon: Heart,
      name: 'Romantic Getaway',
      description: 'Perfect for couples seeking intimate moments',
      category: 'experience'
    },
    {
      id: 'photography',
      icon: Camera,
      name: 'Photography Adventure',
      description: 'Capture stunning landscapes and moments',
      category: 'activity'
    },
    {
      id: 'food',
      icon: Utensils,
      name: 'Culinary Journey',
      description: 'Explore local cuisines and food culture',
      category: 'interest'
    },
    {
      id: 'adventure',
      icon: Compass,
      name: 'Adventure Seeking',
      description: 'Thrilling experiences and outdoor activities',
      category: 'activity'
    },
    {
      id: 'hiking',
      icon: Mountain,
      name: 'Mountain Escape',
      description: 'Trek through scenic mountain trails',
      category: 'activity'
    },
    {
      id: 'beach',
      icon: Beach,
      name: 'Beach Relaxation',
      description: 'Unwind on beautiful beaches',
      category: 'environment'
    },
    {
      id: 'culture',
      icon: Building,
      name: 'Cultural Immersion',
      description: 'Experience local traditions and history',
      category: 'interest'
    },
    {
      id: 'nightlife',
      icon: Music,
      name: 'Vibrant Nightlife',
      description: 'Experience the city after dark',
      category: 'entertainment'
    },
    {
      id: 'learning',
      icon: Book,
      name: 'Educational Trip',
      description: 'Learn new skills or subjects',
      category: 'interest'
    },
    {
      id: 'cafe',
      icon: Coffee,
      name: 'Café Hopping',
      description: 'Explore local coffee culture',
      category: 'lifestyle'
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
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const handleSubmit = async () => {
    // Submit travel plan
    const plan = {
      goal: selectedGoal,
      dates,
      budget,
      travelers
    };

    try {
      const response = await fetch('http://localhost:5000/api/travel/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(plan),
      });

      if (!response.ok) throw new Error('Failed to create plan');

      const data = await response.json();
      // Handle successful plan creation
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6">What's your travel goal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <motion.button
                  key={goal.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-colors ${
                    selectedGoal === goal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <goal.icon
                    size={32}
                    className={selectedGoal === goal.id ? 'text-blue-500' : 'text-gray-400'}
                  />
                  <h3 className="text-lg font-semibold mt-4 mb-2">{goal.name}</h3>
                  <p className="text-gray-600 text-sm">{goal.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6">When would you like to travel?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <DatePicker
                    selected={dates.start}
                    onChange={(date) => setDates({ ...dates, start: date })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select start date"
                    minDate={new Date()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <DatePicker
                    selected={dates.end}
                    onChange={(date) => setDates({ ...dates, end: date })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select end date"
                    minDate={dates.start || new Date()}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6">What's your budget?</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <DollarSign size={24} className="text-green-600" />
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="text-center">
                <span className="text-3xl font-bold text-green-600">${budget}</span>
                <p className="text-gray-500">Estimated budget per person</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[1000, 2000, 5000].map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBudget(amount)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      budget === amount
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    ${amount}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6">How many travelers?</h2>
            <div className="flex items-center justify-center gap-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                -
              </motion.button>
              <div className="text-center">
                <span className="text-4xl font-bold">{travelers}</span>
                <p className="text-gray-500">travelers</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTravelers(travelers + 1)}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                +
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Target className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold">Goal-Based Travel Planner</h1>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={
                (step === 1 && !selectedGoal) ||
                (step === 2 && (!dates.start || !dates.end))
              }
            >
              {step === 4 ? 'Create Plan' : 'Next'}
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalBasedPlanner;