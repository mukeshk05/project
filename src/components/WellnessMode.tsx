import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Sun, Moon, Wind, Cloud, Droplets, 
  Waves, Music, Coffee, Book, Watch, Battery,
  ThermometerSun, Compass, Map, Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';

interface WellnessActivity {
  type: string;
  name: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  benefits: string[];
  location: string;
  time: string;
}

interface WellnessMetrics {
  steps: number;
  sleep: number;
  meditation: number;
  water: number;
  mood: number;
}

const WellnessMode: React.FC = () => {
  const [activities, setActivities] = useState<WellnessActivity[]>([]);
  const [metrics, setMetrics] = useState<WellnessMetrics>({
    steps: 0,
    sleep: 0,
    meditation: 0,
    water: 0,
    mood: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    // Fetch wellness activities and metrics
    fetchWellnessData();
  }, [selectedDate]);

  const fetchWellnessData = async () => {
    try {
      // Mock data for development
      const mockActivities: WellnessActivity[] = [
        {
          type: 'yoga',
          name: 'Sunrise Yoga',
          duration: 60,
          intensity: 'medium',
          benefits: ['Flexibility', 'Stress Relief', 'Balance'],
          location: 'Beach Front',
          time: '07:00'
        },
        {
          type: 'meditation',
          name: 'Guided Meditation',
          duration: 30,
          intensity: 'low',
          benefits: ['Mental Clarity', 'Relaxation'],
          location: 'Zen Garden',
          time: '09:00'
        },
        {
          type: 'spa',
          name: 'Aromatherapy Massage',
          duration: 90,
          intensity: 'low',
          benefits: ['Muscle Relief', 'Relaxation'],
          location: 'Spa Center',
          time: '14:00'
        }
      ];

      const mockMetrics: WellnessMetrics = {
        steps: 8500,
        sleep: 7.5,
        meditation: 45,
        water: 2000,
        mood: 4
      };

      setActivities(mockActivities);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
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
              <Heart className="w-12 h-12 text-green-500" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold mb-4"
            >
              Wellness Mode
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Balance your travel experience with mindful activities and wellness tracking
            </motion.p>
          </div>

          {/* Metrics Dashboard */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Watch, label: 'Steps', value: metrics.steps, unit: 'steps' },
              { icon: Moon, label: 'Sleep', value: metrics.sleep, unit: 'hours' },
              { icon: Wind, label: 'Meditation', value: metrics.meditation, unit: 'min' },
              { icon: Droplets, label: 'Water', value: metrics.water, unit: 'ml' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <metric.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">{metric.label}</p>
                    <p className="text-2xl font-bold">
                      {metric.value} <span className="text-sm text-gray-500">{metric.unit}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Activities Timeline */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Today's Wellness Activities</h2>
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className={`p-3 rounded-lg ${
                    activity.intensity === 'low' ? 'bg-blue-100 text-blue-600' :
                    activity.intensity === 'medium' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'yoga' ? <Sun size={24} /> :
                     activity.type === 'meditation' ? <Wind size={24} /> :
                     <Waves size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{activity.name}</h3>
                        <p className="text-sm text-gray-500">{activity.location}</p>
                      </div>
                      <span className="text-sm font-medium">{activity.time}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {activity.benefits.map((benefit, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Wellness Tips */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Coffee,
                title: 'Morning Routine',
                tips: [
                  'Start with warm lemon water',
                  'Practice 10-min meditation',
                  'Light stretching exercises'
                ]
              },
              {
                icon: Sun,
                title: 'Daytime Balance',
                tips: [
                  'Take walking meetings',
                  'Stay hydrated',
                  'Practice mindful eating'
                ]
              },
              {
                icon: Moon,
                title: 'Evening Wellness',
                tips: [
                  'Digital sunset routine',
                  'Relaxing bath ritual',
                  'Sleep environment optimization'
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <section.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WellnessMode;