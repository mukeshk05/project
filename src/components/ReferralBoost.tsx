import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Gift, Award, Share2, Copy, Mail, 
  Facebook, Twitter, Linkedin, Check, X, 
  Calendar, Star, ChevronRight, Zap, Trophy
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useAuth } from '../context/AuthContext';

interface Referral {
  id: string;
  email: string;
  name: string | null;
  status: 'pending' | 'registered' | 'completed';
  date: Date;
  pointsEarned: number | null;
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActive: Date;
  nextMilestone: {
    days: number;
    reward: string;
    points: number;
  };
  history: {
    date: string;
    active: boolean;
  }[];
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: any;
  category: 'referral' | 'streak' | 'special';
  isUnlocked: boolean;
}

const ReferralBoost: React.FC = () => {
  const { user } = useAuth();
  const { width, height } = useWindowSize();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<'referrals' | 'streaks' | 'rewards'>('referrals');
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock referral code and link
      setReferralCode('TRAVEL' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setReferralLink(`https://travelai.com/signup?ref=${user?._id || 'demo'}`);
      
      // Mock referrals
      const mockReferrals: Referral[] = [
        {
          id: '1',
          email: 'sarah.johnson@example.com',
          name: 'Sarah Johnson',
          status: 'completed',
          date: new Date('2024-02-15'),
          pointsEarned: 500
        },
        {
          id: '2',
          email: 'michael.chen@example.com',
          name: 'Michael Chen',
          status: 'registered',
          date: new Date('2024-03-01'),
          pointsEarned: 250
        },
        {
          id: '3',
          email: 'emma.wilson@example.com',
          name: null,
          status: 'pending',
          date: new Date('2024-03-10'),
          pointsEarned: null
        }
      ];
      
      // Mock streak data
      const mockStreak: Streak = {
        currentStreak: 7,
        longestStreak: 14,
        lastActive: new Date(),
        nextMilestone: {
          days: 10,
          reward: 'Premium Access Weekend',
          points: 300
        },
        history: Array.from({ length: 30 }, (_, i) => ({
          date: format(addDays(new Date(), -i), 'yyyy-MM-dd'),
          active: Math.random() > 0.3
        }))
      };
      
      // Mock rewards
      const mockRewards: Reward[] = [
        {
          id: 'r1',
          name: '3 Referrals Bonus',
          description: 'Earn 1000 bonus points when you refer 3 friends',
          pointsRequired: 0,
          icon: Users,
          category: 'referral',
          isUnlocked: referrals.filter(r => r.status === 'completed').length >= 3
        },
        {
          id: 'r2',
          name: '7-Day Streak',
          description: 'Maintain activity for 7 consecutive days',
          pointsRequired: 0,
          icon: Calendar,
          category: 'streak',
          isUnlocked: mockStreak.currentStreak >= 7
        },
        {
          id: 'r3',
          name: 'Premium Upgrade',
          description: 'Upgrade to Premium for 1 month',
          pointsRequired: 2000,
          icon: Award,
          category: 'special',
          isUnlocked: false
        },
        {
          id: 'r4',
          name: 'Priority Boarding',
          description: 'Skip the line on your next flight',
          pointsRequired: 1500,
          icon: Plane,
          category: 'special',
          isUnlocked: false
        }
      ];
      
      // Calculate total points
      const referralPoints = mockReferrals.reduce((sum, ref) => sum + (ref.pointsEarned || 0), 0);
      const streakPoints = mockStreak.currentStreak * 50; // 50 points per day
      setTotalPoints(referralPoints + streakPoints);
      
      setReferrals(mockReferrals);
      setStreak(mockStreak);
      setRewards(mockRewards);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      setIsLoading(false);
    }
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendReferralEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send an email
    // For demo purposes, we'll just add it to the referrals list
    const newReferral: Referral = {
      id: Date.now().toString(),
      email: referralEmail,
      name: null,
      status: 'pending',
      date: new Date(),
      pointsEarned: null
    };
    
    setReferrals([...referrals, newReferral]);
    setReferralEmail('');
    setIsEmailModalOpen(false);
    
    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const claimReward = (rewardId: string) => {
    // In a real app, this would claim the reward
    // For demo purposes, we'll just mark it as unlocked
    setRewards(rewards.map(reward => 
      reward.id === rewardId ? { ...reward, isUnlocked: true } : reward
    ));
    
    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              variants={itemVariants}
              className="inline-block p-4 bg-white rounded-full shadow-lg mb-4"
            >
              <Users className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Referral Boost & Streak Perks
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Invite friends, maintain your streak, and earn exclusive rewards
            </motion.p>
          </div>

          {/* Points Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Your Points</h2>
                <div className="text-4xl font-bold text-blue-600">{totalPoints.toLocaleString()}</div>
                <p className="text-gray-500 mt-1">Keep referring to earn more!</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold">{referrals.length}</div>
                  <p className="text-gray-500">Total Referrals</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{streak?.currentStreak || 0}</div>
                  <p className="text-gray-500">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{rewards.filter(r => r.isUnlocked).length}</div>
                  <p className="text-gray-500">Rewards</p>
                </div>
              </div>
              
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEmailModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Share2 size={20} />
                  <span>Invite Friends</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Referral Code */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Share this code with friends</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold font-mono">{referralCode}</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralCode);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    {isCopied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Or share this link</p>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium truncate flex-1">{referralLink}</div>
                  <button
                    onClick={handleCopyReferralLink}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    {isCopied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEmailModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Mail size={18} />
                <span>Email</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook size={18} />
                <span>Facebook</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('referrals')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'referrals'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Referrals
              </button>
              <button
                onClick={() => setActiveTab('streaks')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'streaks'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Activity Streaks
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'rewards'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Rewards
              </button>
            </div>

            <div className="p-6">
              {/* Referrals Tab */}
              {activeTab === 'referrals' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Share2 size={20} />
                        </div>
                        <h4 className="font-medium mb-1">1. Invite Friends</h4>
                        <p className="text-sm text-gray-600">Share your unique referral code or link</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User size={20} />
                        </div>
                        <h4 className="font-medium mb-1">2. Friends Sign Up</h4>
                        <p className="text-sm text-gray-600">They create an account using your code</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Gift size={20} />
                        </div>
                        <h4 className="font-medium mb-1">3. Both Get Rewarded</h4>
                        <p className="text-sm text-gray-600">You earn 500 points, they get 250 points</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Your Referrals</h3>
                  {referrals.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Users className="mx-auto mb-4 text-gray-300" size={48} />
                      <h4 className="text-xl font-semibold mb-2">No referrals yet</h4>
                      <p className="text-gray-500 mb-6">Start inviting friends to earn rewards!</p>
                      <button
                        onClick={() => setIsEmailModalOpen(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Invite Friends
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Points
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {referrals.map((referral) => (
                            <tr key={referral.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {referral.name ? (
                                      referral.name.charAt(0)
                                    ) : (
                                      <User size={20} className="text-gray-500" />
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {referral.name || 'Pending User'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {referral.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(referral.date, 'MMM d, yyyy')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  referral.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : referral.status === 'registered'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {referral.pointsEarned !== null ? (
                                  <span className="text-green-600">+{referral.pointsEarned}</span>
                                ) : (
                                  <span className="text-gray-400">--</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Streaks Tab */}
              {activeTab === 'streaks' && streak && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-xl text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{streak.currentStreak}</div>
                      <p className="text-blue-700">Current Streak</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Last active: {format(streak.lastActive, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">{streak.longestStreak}</div>
                      <p className="text-purple-700">Longest Streak</p>
                      <p className="text-sm text-purple-600 mt-1">
                        Keep going to beat your record!
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">{streak.nextMilestone.days}</div>
                      <p className="text-green-700">Days to Next Reward</p>
                      <p className="text-sm text-green-600 mt-1">
                        {streak.nextMilestone.reward} (+{streak.nextMilestone.points} points)
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Streak Calendar</h3>
                  <div className="bg-white border rounded-xl p-4 mb-8">
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                      {streak.history.slice(0, 28).map((day, index) => (
                        <div
                          key={index}
                          className={`aspect-square rounded-lg flex items-center justify-center ${
                            day.active
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {new Date(day.date).getDate()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Streak Milestones</h3>
                  <div className="space-y-4">
                    {[
                      { days: 3, reward: 'Early Access to Deals', points: 150, completed: streak.currentStreak >= 3 },
                      { days: 7, reward: 'Free Upgrade Coupon', points: 300, completed: streak.currentStreak >= 7 },
                      { days: 14, reward: 'Premium Access Weekend', points: 500, completed: streak.currentStreak >= 14 },
                      { days: 30, reward: 'Exclusive Travel Guide', points: 1000, completed: streak.currentStreak >= 30 },
                      { days: 60, reward: 'Priority Customer Support', points: 2000, completed: streak.currentStreak >= 60 },
                      { days: 90, reward: 'Premium Membership Month', points: 3000, completed: streak.currentStreak >= 90 }
                    ].map((milestone) => (
                      <div
                        key={milestone.days}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          milestone.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {milestone.completed ? <Check size={20} /> : milestone.days}
                          </div>
                          <div>
                            <h4 className="font-medium">{milestone.days}-Day Streak</h4>
                            <p className="text-sm text-gray-600">{milestone.reward}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${milestone.completed ? 'text-green-600' : 'text-gray-600'}`}>
                            +{milestone.points} points
                          </div>
                          {milestone.completed && (
                            <span className="text-sm text-green-600">Completed</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-blue-50 p-6 rounded-xl mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div>
                        <h3 className="text-xl font-bold text-blue-800 mb-2">Your Points Balance</h3>
                        <div className="text-3xl font-bold text-blue-600">{totalPoints.toLocaleString()} points</div>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-blue-700 mb-2">Keep earning to unlock more rewards!</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                className={`${i < Math.min(5, Math.floor(totalPoints / 1000)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-blue-700">Level {Math.min(5, Math.floor(totalPoints / 1000))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Available Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rewards.map((reward) => (
                      <motion.div
                        key={reward.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-xl border ${
                          reward.isUnlocked
                            ? 'border-green-200 bg-green-50'
                            : reward.pointsRequired <= totalPoints
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                              reward.isUnlocked
                                ? 'bg-green-100 text-green-600'
                                : reward.pointsRequired <= totalPoints
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <reward.icon size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold">{reward.name}</h4>
                              <p className="text-sm text-gray-600">{reward.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  reward.category === 'referral'
                                    ? 'bg-purple-100 text-purple-600'
                                    : reward.category === 'streak'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-orange-100 text-orange-600'
                                }`}>
                                  {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
                                </span>
                                {reward.pointsRequired > 0 && (
                                  <span className="text-sm text-gray-500">
                                    {reward.pointsRequired} points required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {reward.isUnlocked ? (
                            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                              Claimed
                            </span>
                          ) : reward.pointsRequired <= totalPoints ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => claimReward(reward.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Claim
                            </motion.button>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              Locked
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Email Referral Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Invite a Friend</h3>
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSendReferralEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Friend's Email
                  </label>
                  <input
                    type="email"
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                    placeholder="Enter your friend's email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">They'll receive:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-blue-700">
                      <Check size={16} className="text-blue-500" />
                      <span>250 welcome points</span>
                    </li>
                    <li className="flex items-center gap-2 text-blue-700">
                      <Check size={16} className="text-blue-500" />
                      <span>Special first-time user discount</span>
                    </li>
                    <li className="flex items-center gap-2 text-blue-700">
                      <Check size={16} className="text-blue-500" />
                      <span>Access to exclusive travel deals</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={20} />
                    <span>Send Invitation</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReferralBoost;