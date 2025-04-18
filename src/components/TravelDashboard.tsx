import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plane, Hotel, Calendar, DollarSign, Bell, TrendingDown,
  ChevronRight, MapPin, Users, Clock, ArrowRight, Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceTracker from './PriceTracker';

interface Trip {
  id: string;
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'flight' | 'hotel' | 'package';
  price: number;
  travelers: number;
}

interface PriceAlert {
  id: string;
  type: 'flight' | 'hotel';
  destination: string;
  targetPrice: number;
  currentPrice: number;
  status: 'active' | 'triggered';
}

const TravelDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'trips'>('overview');

  // Mock data
  const upcomingTrips: Trip[] = [
    {
      id: '1',
      destination: 'Paris, France',
      dates: {
        start: new Date('2024-06-15'),
        end: new Date('2024-06-22'),
      },
      status: 'upcoming',
      type: 'flight',
      price: 850,
      travelers: 2,
    },
    {
      id: '2',
      destination: 'Tokyo, Japan',
      dates: {
        start: new Date('2024-07-10'),
        end: new Date('2024-07-20'),
      },
      status: 'upcoming',
      type: 'package',
      price: 2400,
      travelers: 1,
    },
  ];

  const recentAlerts: PriceAlert[] = [
    {
      id: '1',
      type: 'flight',
      destination: 'London',
      targetPrice: 600,
      currentPrice: 550,
      status: 'triggered',
    },
    {
      id: '2',
      type: 'hotel',
      destination: 'Barcelona',
      targetPrice: 200,
      currentPrice: 220,
      status: 'active',
    },
  ];

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

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: Plane,
            label: 'Active Flights',
            value: '3',
            color: 'bg-blue-100 text-blue-600',
          },
          {
            icon: Hotel,
            label: 'Hotel Bookings',
            value: '2',
            color: 'bg-green-100 text-green-600',
          },
          {
            icon: Bell,
            label: 'Price Alerts',
            value: '5',
            color: 'bg-purple-100 text-purple-600',
          },
          {
            icon: DollarSign,
            label: 'Total Savings',
            value: '$420',
            color: 'bg-yellow-100 text-yellow-600',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-gray-500">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Upcoming Trips</h2>
          <Link
            to="/trips"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingTrips.map((trip) => (
            <motion.div
              key={trip.id}
              variants={itemVariants}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {trip.type === 'flight' ? (
                    <Plane className="text-blue-600" size={24} />
                  ) : trip.type === 'hotel' ? (
                    <Hotel className="text-green-600" size={24} />
                  ) : (
                    <Briefcase className="text-purple-600" size={24} />
                  )}
                  <div>
                    <h3 className="font-semibold">{trip.destination}</h3>
                    <p className="text-sm text-gray-500">
                      {trip.dates.start.toLocaleDateString()} -{' '}
                      {trip.dates.end.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${trip.price}</p>
                  <p className="text-sm text-gray-500">{trip.travelers} travelers</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Price Alerts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Price Alerts</h2>
          <Link
            to="/alerts"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Manage Alerts
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {recentAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              variants={itemVariants}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {alert.type === 'flight' ? (
                    <Plane className="text-blue-600" size={24} />
                  ) : (
                    <Hotel className="text-green-600" size={24} />
                  )}
                  <div>
                    <h3 className="font-semibold">{alert.destination}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Target: ${alert.targetPrice}</span>
                      <span className="text-gray-500">•</span>
                      <span className={alert.currentPrice <= alert.targetPrice ? 'text-green-600' : 'text-gray-500'}>
                        Current: ${alert.currentPrice}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  alert.status === 'triggered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Travel Dashboard</h1>
          <Link
            to="/trip-planner"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Plan New Trip
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="flex gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'alerts', label: 'Price Alerts' },
            { id: 'trips', label: 'My Trips' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'alerts' && <PriceTracker />}
          {/* Add MyTrips component for trips tab */}
        </motion.div>
      </div>
    </div>
  );
};

export default TravelDashboard;