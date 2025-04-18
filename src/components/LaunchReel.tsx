import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Star, Rocket, Brain, Users } from 'lucide-react';

const LaunchReel: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Travel Coach",
      description: "Your personal travel planning companion, available 24/7",
      color: "bg-blue-500"
    },
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "Learns from your preferences to suggest perfect trips",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Travel Buddies",
      description: "Connect with fellow travelers and share experiences",
      color: "bg-green-500"
    },
    {
      icon: Star,
      title: "Loyalty Rewards",
      description: "Earn points and unlock exclusive benefits",
      color: "bg-yellow-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Meet Your Travel AI Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of travel planning with our intelligent AI assistant
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-8 shadow-xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Start Your Journey</h2>
            <p className="text-gray-600 mb-8">
              Let our AI coach guide you to your perfect destination. Get personalized recommendations,
              real-time travel insights, and earn rewards along the way.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Chat with AI Coach
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <p className="text-gray-500">
            Join thousands of happy travelers who have discovered their perfect trips
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex -space-x-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center text-white font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-gray-600">
              <span className="font-bold">4.9</span> rating from over{' '}
              <span className="font-bold">10,000</span> users
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LaunchReel;