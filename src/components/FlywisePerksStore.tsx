import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Star, DollarSign, Award, ShoppingCart, 
  CreditCard, Check, X, Info, ArrowRight, Loader,
  Briefcase, Luggage, Umbrella, Plane, Shield, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Perk {
  id: string;
  name: string;
  description: string;
  icon: any;
  points: number;
  category: 'comfort' | 'experience' | 'convenience' | 'premium';
  available: boolean;
  popular: boolean;
  redeemable: boolean;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  icon: any;
  price: number;
  category: 'luggage' | 'insurance' | 'comfort' | 'experience';
  popular: boolean;
  details: string[];
}

interface UserPoints {
  total: number;
  history: {
    date: Date;
    amount: number;
    description: string;
    type: 'earned' | 'redeemed';
  }[];
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextLevel: {
    name: 'silver' | 'gold' | 'platinum';
    pointsNeeded: number;
  };
}

const FlywisePerksStore: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'perks' | 'addons'>('perks');
  const [perks, setPerks] = useState<Perk[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [cart, setCart] = useState<Addon[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchPerksAndPoints();
  }, []);

  const fetchPerksAndPoints = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPerks: Perk[] = [
        {
          id: 'perk1',
          name: 'Priority Boarding',
          description: 'Skip the line and board the plane first',
          icon: Plane,
          points: 500,
          category: 'convenience',
          available: true,
          popular: true,
          redeemable: true
        },
        {
          id: 'perk2',
          name: 'Lounge Access',
          description: 'Enjoy complimentary food, drinks, and Wi-Fi in airport lounges',
          icon: Briefcase,
          points: 1200,
          category: 'comfort',
          available: true,
          popular: true,
          redeemable: true
        },
        {
          id: 'perk3',
          name: 'Extra Legroom',
          description: 'Upgrade to seats with additional legroom for a more comfortable journey',
          icon: Plane,
          points: 800,
          category: 'comfort',
          available: true,
          popular: false,
          redeemable: true
        },
        {
          id: 'perk4',
          name: 'Concierge Service',
          description: 'Personal assistance for all your travel needs',
          icon: Award,
          points: 2000,
          category: 'premium',
          available: true,
          popular: false,
          redeemable: true
        },
        {
          id: 'perk5',
          name: 'Free Checked Bag',
          description: 'Check one bag for free on your next flight',
          icon: Luggage,
          points: 600,
          category: 'convenience',
          available: true,
          popular: true,
          redeemable: true
        },
        {
          id: 'perk6',
          name: 'Exclusive Tour Access',
          description: 'Access to limited-availability tours and experiences',
          icon: Star,
          points: 1500,
          category: 'experience',
          available: true,
          popular: false,
          redeemable: true
        },
        {
          id: 'perk7',
          name: 'AI Trip Concierge',
          description: 'Premium AI assistant for personalized travel planning and support',
          icon: Heart,
          points: 2500,
          category: 'premium',
          available: true,
          popular: true,
          redeemable: true
        }
      ];
      
      const mockAddons: Addon[] = [
        {
          id: 'addon1',
          name: 'Premium Travel Insurance',
          description: 'Comprehensive coverage for medical emergencies, trip cancellation, and more',
          icon: Shield,
          price: 89,
          category: 'insurance',
          popular: true,
          details: [
            'Medical coverage up to $1,000,000',
            'Trip cancellation/interruption protection',
            'Lost luggage compensation',
            'Flight delay coverage',
            '24/7 emergency assistance'
          ]
        },
        {
          id: 'addon2',
          name: 'Smart Luggage Set',
          description: 'Durable, trackable luggage with built-in USB charger',
          icon: Luggage,
          price: 249,
          category: 'luggage',
          popular: true,
          details: [
            'GPS tracking via smartphone app',
            'Built-in USB charging port',
            'TSA-approved lock',
            'Durable polycarbonate shell',
            '360° spinner wheels'
          ]
        },
        {
          id: 'addon3',
          name: 'Comfort Travel Kit',
          description: 'Everything you need for a comfortable long-haul flight',
          icon: Briefcase,
          price: 59,
          category: 'comfort',
          popular: false,
          details: [
            'Memory foam neck pillow',
            'Blackout sleep mask',
            'Noise-cancelling earplugs',
            'Compression socks',
            'Hydrating face mist'
          ]
        },
        {
          id: 'addon4',
          name: 'Adventure Photography Package',
          description: 'Capture your travel memories with professional equipment',
          icon: Camera,
          price: 129,
          category: 'experience',
          popular: false,
          details: [
            'GoPro rental for duration of trip',
            'Waterproof case',
            'Extendable selfie stick/tripod',
            'Memory card included',
            'Basic editing software'
          ]
        },
        {
          id: 'addon5',
          name: 'Cancel For Any Reason Insurance',
          description: 'The ultimate flexibility - cancel your trip for any reason and get up to 75% refund',
          icon: Umbrella,
          price: 149,
          category: 'insurance',
          popular: true,
          details: [
            'Cancel up to 48 hours before departure',
            'Receive up to 75% of non-refundable trip costs',
            'No documentation required for claim',
            'Covers all prepaid, non-refundable trip expenses',
            'Quick reimbursement process'
          ]
        }
      ];
      
      const mockUserPoints: UserPoints = {
        total: 1850,
        history: [
          {
            date: new Date('2024-03-15'),
            amount: 500,
            description: 'Flight to Tokyo',
            type: 'earned'
          },
          {
            date: new Date('2024-02-20'),
            amount: 350,
            description: 'Hotel booking in Paris',
            type: 'earned'
          },
          {
            date: new Date('2024-01-10'),
            amount: 1000,
            description: 'Annual membership bonus',
            type: 'earned'
          },
          {
            date: new Date('2023-12-05'),
            amount: 600,
            description: 'Priority Boarding redemption',
            type: 'redeemed'
          }
        ],
        level: 'silver',
        nextLevel: {
          name: 'gold',
          pointsNeeded: 1150
        }
      };
      
      setPerks(mockPerks);
      setAddons(mockAddons);
      setUserPoints(mockUserPoints);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching perks and points:', error);
      setIsLoading(false);
    }
  };

  const redeemPerk = async (perk: Perk) => {
    if (!userPoints || userPoints.total < perk.points) {
      return;
    }
    
    setIsRedeeming(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user points
      setUserPoints({
        ...userPoints,
        total: userPoints.total - perk.points,
        history: [
          {
            date: new Date(),
            amount: perk.points,
            description: `${perk.name} redemption`,
            type: 'redeemed'
          },
          ...userPoints.history
        ]
      });
      
      // Show success message or redirect
      alert(`You have successfully redeemed ${perk.name}!`);
    } catch (error) {
      console.error('Error redeeming perk:', error);
    } finally {
      setIsRedeeming(false);
      setSelectedPerk(null);
    }
  };

  const addToCart = (addon: Addon) => {
    setCart([...cart, addon]);
  };

  const removeFromCart = (addonId: string) => {
    setCart(cart.filter(item => item.id !== addonId));
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    
    setIsPurchasing(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate points earned (10 points per dollar spent)
      const totalSpent = cart.reduce((sum, item) => sum + item.price, 0);
      const pointsEarned = totalSpent * 10;
      
      // Update user points
      setUserPoints({
        ...userPoints!,
        total: userPoints!.total + pointsEarned,
        history: [
          {
            date: new Date(),
            amount: pointsEarned,
            description: 'Add-on purchase',
            type: 'earned'
          },
          ...userPoints!.history
        ]
      });
      
      // Clear cart
      setCart([]);
      setShowCart(false);
      
      // Show success message
      alert(`Purchase successful! You earned ${pointsEarned} points.`);
    } catch (error) {
      console.error('Error processing purchase:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const getFilteredItems = (items: Perk[] | Addon[], category: string) => {
    if (category === 'all') return items;
    return items.filter(item => item.category === category);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading perks and add-ons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Gift className="text-purple-600" size={32} />
                <h1 className="text-2xl font-bold">Flywise Perks Store</h1>
              </div>
              <p className="text-gray-600">Redeem your points for exclusive travel perks or purchase premium add-ons</p>
            </div>
            {userPoints && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-yellow-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Your Points</p>
                    <p className="text-2xl font-bold">{userPoints.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm capitalize">{userPoints.level} Member</span>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('perks')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'perks'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Redeem Points
            </button>
            <button
              onClick={() => setActiveTab('addons')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'addons'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Travel Add-ons
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-full text-sm ${
                categoryFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            
            {activeTab === 'perks' ? (
              <>
                <button
                  onClick={() => setCategoryFilter('convenience')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'convenience'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Convenience
                </button>
                <button
                  onClick={() => setCategoryFilter('comfort')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'comfort'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Comfort
                </button>
                <button
                  onClick={() => setCategoryFilter('experience')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'experience'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Experiences
                </button>
                <button
                  onClick={() => setCategoryFilter('premium')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'premium'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Premium
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCategoryFilter('luggage')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'luggage'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Luggage
                </button>
                <button
                  onClick={() => setCategoryFilter('insurance')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'insurance'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Insurance
                </button>
                <button
                  onClick={() => setCategoryFilter('comfort')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'comfort'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Comfort
                </button>
                <button
                  onClick={() => setCategoryFilter('experience')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === 'experience'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Experiences
                </button>
              </>
            )}
          </div>

          {/* Shopping Cart Button (for Add-ons) */}
          {activeTab === 'addons' && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                <span>Cart ({cart.length})</span>
              </motion.button>
            </div>
          )}

          {/* Perks Grid */}
          {activeTab === 'perks' && (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {getFilteredItems(perks, categoryFilter).map((perk) => (
                <motion.div
                  key={perk.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <perk.icon className="text-purple-600" size={24} />
                      </div>
                      {perk.popular && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{perk.name}</h3>
                    <p className="text-gray-600 mb-6">{perk.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={20} />
                        <span className="font-bold">{perk.points.toLocaleString()} points</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPerk(perk)}
                        disabled={!userPoints || userPoints.total < perk.points}
                        className={`px-4 py-2 rounded-lg ${
                          !userPoints || userPoints.total < perk.points
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        } transition-colors`}
                      >
                        {!userPoints || userPoints.total < perk.points ? 'Not Enough Points' : 'Redeem'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Add-ons Grid */}
          {activeTab === 'addons' && (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {getFilteredItems(addons, categoryFilter).map((addon) => (
                <motion.div
                  key={addon.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <addon.icon className="text-blue-600" size={24} />
                      </div>
                      {addon.popular && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{addon.name}</h3>
                    <p className="text-gray-600 mb-6">{addon.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <DollarSign className="text-green-600" size={20} />
                        <span className="font-bold">${addon.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedAddon(addon)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(addon)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Perk Redemption Modal */}
      <AnimatePresence>
        {selectedPerk && (
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
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <selectedPerk.icon className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold">{selectedPerk.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPerk(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedPerk.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Points Required:</span>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500" size={16} />
                    <span className="font-bold">{selectedPerk.points.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Your Points:</span>
                  <span className="font-bold">{userPoints?.total.toLocaleString() || 0}</span>
                </div>
                {userPoints && userPoints.total < selectedPerk.points && (
                  <div className="mt-4 text-red-600 text-sm flex items-start gap-2">
                    <Info size={16} className="mt-0.5" />
                    <span>
                      You need {(selectedPerk.points - userPoints.total).toLocaleString()} more points to redeem this perk.
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedPerk(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => redeemPerk(selectedPerk)}
                  disabled={!userPoints || userPoints.total < selectedPerk.points || isRedeeming}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                    !userPoints || userPoints.total < selectedPerk.points
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } transition-colors`}
                >
                  {isRedeeming ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      <span>Confirm Redemption</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Addon Details Modal */}
      <AnimatePresence>
        {selectedAddon && (
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
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <selectedAddon.icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold">{selectedAddon.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedAddon(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedAddon.description}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Features & Benefits</h4>
                <ul className="space-y-2">
                  {selectedAddon.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={18} className="text-green-500 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-xl font-bold">${selectedAddon.price}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Points Earned:</span>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500" size={16} />
                    <span className="font-bold">{selectedAddon.price * 10}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAddon(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    addToCart(selectedAddon);
                    setSelectedAddon(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Modal */}
      <AnimatePresence>
        {showCart && (
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
              className="bg-white rounded-xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold">Your Cart</h3>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <item.icon className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">${item.price}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-bold">${cart.reduce((sum, item) => sum + item.price, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tax:</span>
                      <span>${(cart.reduce((sum, item) => sum + item.price, 0) * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Total:</span>
                      <span className="text-xl font-bold">
                        ${(cart.reduce((sum, item) => sum + item.price, 0) * 1.1).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>Points you'll earn:</span>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={14} />
                        <span>{Math.round(cart.reduce((sum, item) => sum + item.price, 0) * 10)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowCart(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Continue Shopping
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={checkout}
                      disabled={isPurchasing}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {isPurchasing ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          <span>Checkout</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlywisePerksStore;