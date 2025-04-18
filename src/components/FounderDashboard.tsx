import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, CreditCard, Calendar, ChevronDown,
  ChevronUp, DollarSign, ArrowUpRight, ArrowDownRight,
  BarChart, PieChart, LineChart, Activity, Star
} from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  subscriptions: {
    free: number;
    premium: number;
    business: number;
  };
  userGrowth: number;
  revenueGrowth: number;
  retentionRate: number;
  averageBookingValue: number;
}

interface TimelineData {
  date: string;
  users: number;
  revenue: number;
  bookings: number;
}

const FounderDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/admin/dashboard?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await response.json();
      setStats(data.stats);
      setTimelineData(data.timeline);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for development
      generateMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const timeline: TimelineData[] = [];
    const startDate = subDays(new Date(), days);

    eachDayOfInterval({ start: startDate, end: new Date() }).forEach(date => {
      timeline.push({
        date: format(date, 'yyyy-MM-dd'),
        users: Math.floor(Math.random() * 100) + 500,
        revenue: Math.floor(Math.random() * 5000) + 10000,
        bookings: Math.floor(Math.random() * 50) + 100,
      });
    });

    setTimelineData(timeline);
    setStats({
      totalUsers: 15000,
      activeUsers: 8500,
      revenue: 250000,
      subscriptions: {
        free: 10000,
        premium: 4000,
        business: 1000,
      },
      userGrowth: 23.5,
      revenueGrowth: 45.2,
      retentionRate: 85,
      averageBookingValue: 450,
    });
  };

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
        damping: 30
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Founder Dashboard</h1>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period as any)}
                className={`px-4 py-2 rounded-lg ${
                  timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: 'Total Users',
              value: stats?.totalUsers.toLocaleString(),
              change: stats?.userGrowth,
              icon: Users,
              color: 'bg-blue-500',
            },
            {
              title: 'Monthly Revenue',
              value: `$${stats?.revenue.toLocaleString()}`,
              change: stats?.revenueGrowth,
              icon: DollarSign,
              color: 'bg-green-500',
            },
            {
              title: 'Retention Rate',
              value: `${stats?.retentionRate}%`,
              change: 5.2,
              icon: Activity,
              color: 'bg-purple-500',
            },
            {
              title: 'Avg. Booking Value',
              value: `$${stats?.averageBookingValue}`,
              change: 12.3,
              icon: CreditCard,
              color: 'bg-orange-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                  <stat.icon className={stat.color.replace('bg-', 'text-')} size={24} />
                </div>
                <div className={`flex items-center gap-1 ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Revenue Overview</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Bookings</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              {/* Revenue chart visualization would go here */}
              <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                Revenue chart visualization
              </div>
            </div>
          </div>

          {/* Subscription Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Subscription Plans</h2>
            <div className="space-y-4">
              {Object.entries(stats?.subscriptions || {}).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="text-yellow-400" size={20} />
                    <div>
                      <p className="font-medium capitalize">{plan}</p>
                      <p className="text-sm text-gray-500">{count} users</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    {((count / (stats?.totalUsers || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;