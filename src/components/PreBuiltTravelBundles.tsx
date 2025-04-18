import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Calendar, Users, DollarSign, MapPin, Clock,
  Star, ArrowRight, Filter, Search, Check, X, Loader
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface TravelBundle {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  inclusions: string[];
  exclusions: string[];
  dates: {
    available: Array<{
      start: Date;
      end: Date;
      price: number;
    }>;
  };
  category: 'family' | 'adventure' | 'luxury' | 'budget' | 'romantic';
  featured: boolean;
}

const PreBuiltTravelBundles: React.FC = () => {
  const { t } = useTranslation();
  const [bundles, setBundles] = useState<TravelBundle[]>([]);
  const [filteredBundles, setFilteredBundles] = useState<TravelBundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<TravelBundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    duration: 'all',
    priceRange: 'all',
    searchTerm: '',
  });

  useEffect(() => {
    fetchBundles();
  }, []);

  useEffect(() => {
    if (bundles.length > 0) {
      filterBundles();
    }
  }, [bundles, filters]);

  const fetchBundles = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockBundles: TravelBundle[] = [
        {
          id: '1',
          title: 'Ultimate Japan Explorer',
          description: 'Experience the perfect blend of ancient traditions and modern wonders in Japan. From the bustling streets of Tokyo to the serene temples of Kyoto, this comprehensive package covers the best of Japan.',
          destination: 'Japan (Tokyo, Kyoto, Osaka, Hiroshima)',
          duration: 12,
          price: 3499,
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000',
          rating: 4.8,
          reviewCount: 124,
          inclusions: [
            'Round-trip international flights',
            'All domestic transportation (bullet train, subway, bus)',
            '11 nights accommodation in 4-star hotels',
            'Daily breakfast and 5 dinners',
            'Guided tours in each city',
            'Japan Rail Pass (7 days)',
            'Airport transfers',
            'English-speaking guide'
          ],
          exclusions: [
            'Travel insurance',
            'Personal expenses',
            'Some meals',
            'Optional activities'
          ],
          dates: {
            available: [
              {
                start: addDays(new Date(), 30),
                end: addDays(new Date(), 42),
                price: 3499
              },
              {
                start: addDays(new Date(), 60),
                end: addDays(new Date(), 72),
                price: 3699
              },
              {
                start: addDays(new Date(), 90),
                end: addDays(new Date(), 102),
                price: 3299
              }
            ]
          },
          category: 'adventure',
          featured: true
        },
        {
          id: '2',
          title: 'Greek Islands Family Adventure',
          description: 'Create unforgettable family memories exploring the stunning Greek islands. This family-friendly package includes activities for all ages, comfortable accommodations, and plenty of beach time.',
          destination: 'Greece (Athens, Santorini, Naxos, Crete)',
          duration: 10,
          price: 2899,
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
          rating: 4.7,
          reviewCount: 86,
          inclusions: [
            'Round-trip international flights',
            'Ferry transfers between islands',
            '9 nights accommodation in family-friendly hotels',
            'Daily breakfast',
            'Family cooking class in Crete',
            'Guided mythology tour in Athens',
            'Santorini volcano and hot springs tour',
            'Airport transfers',
            'English-speaking guide'
          ],
          exclusions: [
            'Travel insurance',
            'Personal expenses',
            'Some meals',
            'Optional activities'
          ],
          dates: {
            available: [
              {
                start: addDays(new Date(), 45),
                end: addDays(new Date(), 55),
                price: 2899
              },
              {
                start: addDays(new Date(), 75),
                end: addDays(new Date(), 85),
                price: 3099
              }
            ]
          },
          category: 'family',
          featured: true
        },
        {
          id: '3',
          title: 'Bali Luxury Retreat',
          description: 'Indulge in the ultimate luxury experience in beautiful Bali. Stay in exclusive villas, enjoy private spa treatments, and experience the island's natural beauty and culture with VIP service.',
          destination: 'Bali, Indonesia (Ubud, Seminyak, Uluwatu)',
          duration: 8,
          price: 4299,
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000',
          rating: 4.9,
          reviewCount: 52,
          inclusions: [
            'Round-trip international flights in business class',
            'Private airport transfers in luxury vehicles',
            '7 nights in 5-star luxury villas with private pools',
            'Daily gourmet breakfast',
            'Private chef dinner experience',
            'Daily spa treatments',
            'Private guided tours and excursions',
            'Exclusive beach club access',
            'Personal concierge service'
          ],
          exclusions: [
            'Travel insurance',
            'Personal expenses',
            'Some meals',
            'Optional activities'
          ],
          dates: {
            available: [
              {
                start: addDays(new Date(), 20),
                end: addDays(new Date(), 28),
                price: 4299
              },
              {
                start: addDays(new Date(), 50),
                end: addDays(new Date(), 58),
                price: 4499
              }
            ]
          },
          category: 'luxury',
          featured: false
        },
        {
          id: '4',
          title: 'European Capitals on a Budget',
          description: 'Experience the magic of Europe's most iconic cities without breaking the bank. This carefully crafted budget package includes comfortable accommodations, essential sightseeing, and plenty of free time.',
          destination: 'Europe (Paris, Amsterdam, Berlin, Prague)',
          duration: 14,
          price: 1899,
          image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
          rating: 4.5,
          reviewCount: 138,
          inclusions: [
            'Round-trip international flights',
            'All transportation between cities (train)',
            '13 nights in well-located budget hotels',
            'Daily breakfast',
            'Walking tour in each city',
            'City travel cards for public transportation',
            'Airport transfers',
            'English-speaking guide'
          ],
          exclusions: [
            'Travel insurance',
            'Personal expenses',
            'Most meals',
            'Optional activities',
            'City taxes (paid locally)'
          ],
          dates: {
            available: [
              {
                start: addDays(new Date(), 40),
                end: addDays(new Date(), 54),
                price: 1899
              },
              {
                start: addDays(new Date(), 70),
                end: addDays(new Date(), 84),
                price: 1999
              }
            ]
          },
          category: 'budget',
          featured: false
        },
        {
          id: '5',
          title: 'Romantic Maldives Escape',
          description: 'Celebrate your love in one of the world's most romantic destinations. This all-inclusive package features overwater bungalows, private dinners on the beach, and unforgettable experiences for couples.',
          destination: 'Maldives',
          duration: 7,
          price: 5299,
          image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=2000',
          rating: 4.9,
          reviewCount: 64,
          inclusions: [
            'Round-trip international flights',
            'Seaplane transfer to resort',
            '6 nights in overwater bungalow',
            'All-inclusive meal plan',
            'Couples massage',
            'Private sunset cruise',
            'Romantic beach dinner',
            'Snorkeling equipment',
            'Water sports activities'
          ],
          exclusions: [
            'Travel insurance',
            'Personal expenses',
            'Premium alcoholic beverages',
            'Optional activities'
          ],
          dates: {
            available: [
              {
                start: addDays(new Date(), 35),
                end: addDays(new Date(), 42),
                price: 5299
              },
              {
                start: addDays(new Date(), 65),
                end: addDays(new Date(), 72),
                price: 5499
              }
            ]
          },
          category: 'romantic',
          featured: true
        }
      ];
      
      setBundles(mockBundles);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bundles:', error);
      setIsLoading(false);
    }
  };

  const filterBundles = () => {
    let filtered = [...bundles];
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(bundle => bundle.category === filters.category);
    }
    
    // Filter by duration
    if (filters.duration !== 'all') {
      switch (filters.duration) {
        case 'short':
          filtered = filtered.filter(bundle => bundle.duration <= 7);
          break;
        case 'medium':
          filtered = filtered.filter(bundle => bundle.duration > 7 && bundle.duration <= 14);
          break;
        case 'long':
          filtered = filtered.filter(bundle => bundle.duration > 14);
          break;
      }
    }
    
    // Filter by price range
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'budget':
          filtered = filtered.filter(bundle => bundle.price < 2000);
          break;
        case 'moderate':
          filtered = filtered.filter(bundle => bundle.price >= 2000 && bundle.price < 4000);
          break;
        case 'luxury':
          filtered = filtered.filter(bundle => bundle.price >= 4000);
          break;
      }
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(bundle => 
        bundle.title.toLowerCase().includes(term) ||
        bundle.description.toLowerCase().includes(term) ||
        bundle.destination.toLowerCase().includes(term)
      );
    }
    
    setFilteredBundles(filtered);
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
          <p className="text-gray-600">Loading travel bundles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedBundle ? (
            <motion.div
              key="bundle-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Pre-Built Travel Bundles</h1>
                  <p className="text-gray-600">Expertly curated travel packages for hassle-free adventures</p>
                </div>
              </div>

              {/* Filters */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md p-6 mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={20} className="text-gray-500" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search destinations, activities..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="family">Family</option>
                    <option value="adventure">Adventure</option>
                    <option value="luxury">Luxury</option>
                    <option value="budget">Budget</option>
                    <option value="romantic">Romantic</option>
                  </select>

                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Any Duration</option>
                    <option value="short">Short (≤ 7 days)</option>
                    <option value="medium">Medium (8-14 days)</option>
                    <option value="long">Long (15+ days)</option>
                  </select>

                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Any Price</option>
                    <option value="budget">Budget (< $2000)</option>
                    <option value="moderate">Moderate ($2000-$4000)</option>
                    <option value="luxury">Luxury (> $4000)</option>
                  </select>
                </div>
              </motion.div>

              {/* Featured Bundles */}
              {bundles.some(bundle => bundle.featured) && (
                <motion.div variants={itemVariants} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Featured Bundles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bundles
                      .filter(bundle => bundle.featured)
                      .map(bundle => (
                        <motion.div
                          key={bundle.id}
                          variants={itemVariants}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="relative h-48">
                            <img
                              src={bundle.image}
                              alt={bundle.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Featured
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{bundle.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{bundle.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span className="truncate max-w-[120px]">{bundle.destination}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{bundle.duration} days</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-2xl font-bold text-blue-600">${bundle.price}</span>
                                <span className="text-gray-500 text-sm">/person</span>
                              </div>
                              <button
                                onClick={() => setSelectedBundle(bundle)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                              >
                                View
                                <ArrowRight size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* All Bundles */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-6">All Travel Bundles</h2>
                {filteredBundles.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <X className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-xl font-semibold mb-2">No bundles found</h3>
                    <p className="text-gray-600">Try adjusting your filters to see more options.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBundles.map(bundle => (
                      <motion.div
                        key={bundle.id}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-48">
                          <img
                            src={bundle.image}
                            alt={bundle.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                            <Star className="text-yellow-400 fill-current" size={16} />
                            <span>{bundle.rating}</span>
                            <span className="text-gray-500">({bundle.reviewCount})</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                              {bundle.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{bundle.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{bundle.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span className="truncate max-w-[120px]">{bundle.destination}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>{bundle.duration} days</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-2xl font-bold text-blue-600">${bundle.price}</span>
                              <span className="text-gray-500 text-sm">/person</span>
                            </div>
                            <button
                              onClick={() => setSelectedBundle(bundle)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                              View
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="bundle-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="relative h-96">
                <img
                  src={selectedBundle.image}
                  alt={selectedBundle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedBundle(null)}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full"
                >
                  <ArrowRight className="rotate-180" size={24} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm capitalize">
                      {selectedBundle.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">{selectedBundle.title}</h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <MapPin size={18} />
                      <span>{selectedBundle.destination}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={18} />
                      <span>{selectedBundle.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="fill-current text-yellow-400" size={18} />
                      <span>{selectedBundle.rating} ({selectedBundle.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Package Overview</h2>
                    <p className="text-gray-600 mb-8">{selectedBundle.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4">What's Included</h3>
                        <ul className="space-y-2">
                          {selectedBundle.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-4">What's Not Included</h3>
                        <ul className="space-y-2">
                          {selectedBundle.exclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <X size={18} className="text-red-500 mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4">Available Dates</h3>
                    <div className="space-y-4 mb-8">
                      {selectedBundle.dates.available.map((dateOption, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {format(dateOption.start, 'MMMM d, yyyy')} - {format(dateOption.end, 'MMMM d, yyyy')}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedBundle.duration} days / {selectedBundle.duration - 1} nights
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-blue-600">${dateOption.price}</p>
                              <p className="text-sm text-gray-500">per person</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="bg-blue-50 rounded-xl p-6 sticky top-8">
                      <h3 className="text-xl font-bold mb-4">Package Summary</h3>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Price:</span>
                          <span className="font-medium">${selectedBundle.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taxes & Fees:</span>
                          <span className="font-medium">${Math.round(selectedBundle.price * 0.15)}</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between">
                          <span className="font-bold">Total:</span>
                          <span className="font-bold text-blue-600">${Math.round(selectedBundle.price * 1.15)}</span>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4">
                        Book Now
                      </button>
                      
                      <p className="text-sm text-gray-500 text-center">
                        No payment required today. Reserve your spot now.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PreBuiltTravelBundles;