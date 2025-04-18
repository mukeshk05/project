import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Luggage, Shield, Briefcase, Camera, 
  Headphones, Umbrella, Search, Filter, Star, 
  ShoppingCart, CreditCard, Check, X, Info, Loader
} from 'lucide-react';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: 'luggage' | 'insurance' | 'comfort' | 'electronics' | 'experience';
  rating: number;
  reviewCount: number;
  bestSeller: boolean;
  details: string[];
}

const AddOnsMarketplace: React.FC = () => {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [filteredAddOns, setFilteredAddOns] = useState<AddOn[]>([]);
  const [selectedAddOn, setSelectedAddOn] = useState<AddOn | null>(null);
  const [cart, setCart] = useState<{ item: AddOn; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddOns();
  }, []);

  useEffect(() => {
    filterAddOns();
  }, [addOns, searchTerm, categoryFilter, priceFilter]);

  const fetchAddOns = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddOns: AddOn[] = [
        {
          id: '1',
          name: 'Premium Hardside Luggage Set',
          description: 'Durable 3-piece hardside luggage set with spinner wheels and TSA lock',
          price: 249.99,
          discountPrice: 199.99,
          image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&q=80&w=2000',
          category: 'luggage',
          rating: 4.8,
          reviewCount: 256,
          bestSeller: true,
          details: [
            'Includes 20", 24", and 28" suitcases',
            'Durable polycarbonate shell',
            'TSA-approved combination lock',
            '360° spinner wheels',
            'Telescoping handle',
            'Interior mesh divider and cross straps',
            '10-year warranty'
          ]
        },
        {
          id: '2',
          name: 'Comprehensive Travel Insurance',
          description: 'Complete coverage for medical emergencies, trip cancellation, lost luggage, and more',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000',
          category: 'insurance',
          rating: 4.9,
          reviewCount: 412,
          bestSeller: true,
          details: [
            'Medical coverage up to $1,000,000',
            'Emergency evacuation coverage',
            'Trip cancellation/interruption protection',
            'Lost/delayed baggage compensation',
            'Flight delay coverage',
            '24/7 emergency assistance',
            'Coverage for adventure activities'
          ]
        },
        {
          id: '3',
          name: 'Premium Comfort Travel Kit',
          description: 'Everything you need for a comfortable long-haul flight',
          price: 59.99,
          image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=2000',
          category: 'comfort',
          rating: 4.7,
          reviewCount: 189,
          bestSeller: false,
          details: [
            'Memory foam neck pillow',
            'Silk sleep mask',
            'Noise-cancelling earplugs',
            'Compression socks',
            'Hydrating face mist',
            'Compact blanket',
            'Toiletry kit with essentials'
          ]
        },
        {
          id: '4',
          name: 'Portable Power Bank Bundle',
          description: 'High-capacity power bank with international adapters',
          price: 79.99,
          discountPrice: 69.99,
          image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=2000',
          category: 'electronics',
          rating: 4.6,
          reviewCount: 143,
          bestSeller: false,
          details: [
            '20,000 mAh capacity',
            'Fast charging capability',
            'Dual USB ports',
            'USB-C compatibility',
            'LED power indicator',
            'Includes adapters for EU, UK, US, and Asia',
            'Compact and lightweight design'
          ]
        },
        {
          id: '5',
          name: 'Adventure Photography Package',
          description: 'Capture your travel memories with professional equipment',
          price: 129.99,
          image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=2000',
          category: 'experience',
          rating: 4.5,
          reviewCount: 98,
          bestSeller: false,
          details: [
            'GoPro rental for duration of trip',
            'Waterproof case',
            'Extendable selfie stick/tripod',
            '64GB memory card included',
            'Basic editing software license',
            'Carrying case',
            'Online tutorial access'
          ]
        },
        {
          id: '6',
          name: 'Premium Noise-Cancelling Headphones',
          description: 'Immerse yourself in music or enjoy peaceful silence during your journey',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2000',
          category: 'electronics',
          rating: 4.9,
          reviewCount: 327,
          bestSeller: true,
          details: [
            'Active noise cancellation technology',
            'Up to 30 hours battery life',
            'Bluetooth 5.0 connectivity',
            'Comfortable over-ear design',
            'Built-in microphone for calls',
            'Foldable design with travel case',
            'Airplane adapter included'
          ]
        },
        {
          id: '7',
          name: 'Cancel For Any Reason Insurance',
          description: 'The ultimate flexibility - cancel your trip for any reason and get up to 75% refund',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2000',
          category: 'insurance',
          rating: 4.7,
          reviewCount: 156,
          bestSeller: false,
          details: [
            'Cancel up to 48 hours before departure',
            'Receive up to 75% of non-refundable trip costs',
            'No documentation required for claim',
            'Covers all prepaid, non-refundable trip expenses',
            'Quick reimbursement process',
            'Available for trips up to 90 days',
            'Must be purchased within 21 days of initial trip deposit'
          ]
        },
        {
          id: '8',
          name: 'Compact Carry-On Backpack',
          description: 'Versatile backpack that meets airline carry-on requirements',
          price: 89.99,
          discountPrice: 74.99,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=2000',
          category: 'luggage',
          rating: 4.6,
          reviewCount: 213,
          bestSeller: false,
          details: [
            '40L capacity - fits under airplane seat',
            'Water-resistant material',
            'Padded laptop compartment',
            'Multiple organization pockets',
            'Hideaway shoulder straps',
            'Side water bottle pocket',
            'Luggage pass-through sleeve'
          ]
        }
      ];
      
      setAddOns(mockAddOns);
      setFilteredAddOns(mockAddOns);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching add-ons:', error);
      setIsLoading(false);
    }
  };

  const filterAddOns = () => {
    let filtered = [...addOns];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(addOn => 
        addOn.name.toLowerCase().includes(term) || 
        addOn.description.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(addOn => addOn.category === categoryFilter);
    }
    
    // Apply price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under50':
          filtered = filtered.filter(addOn => addOn.price < 50);
          break;
        case '50to100':
          filtered = filtered.filter(addOn => addOn.price >= 50 && addOn.price <= 100);
          break;
        case '100to200':
          filtered = filtered.filter(addOn => addOn.price > 100 && addOn.price <= 200);
          break;
        case 'over200':
          filtered = filtered.filter(addOn => addOn.price > 200);
          break;
      }
    }
    
    setFilteredAddOns(filtered);
  };

  const addToCart = (addOn: AddOn, quantity: number = 1) => {
    const existingItem = cart.find(item => item.item.id === addOn.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.item.id === addOn.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { item: addOn, quantity }]);
    }
  };

  const removeFromCart = (addOnId: string) => {
    setCart(cart.filter(item => item.item.id !== addOnId));
  };

  const updateQuantity = (addOnId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(addOnId);
      return;
    }
    
    setCart(cart.map(item => 
      item.item.id === addOnId 
        ? { ...item, quantity } 
        : item
    ));
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      setCart([]);
      setShowCart(false);
      
      // Show success message
      alert('Purchase successful! Your add-ons have been added to your trip.');
    } catch (error) {
      console.error('Error processing purchase:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.item.discountPrice || item.item.price;
      return total + (price * item.quantity);
    }, 0);
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
          <p className="text-gray-600">Loading travel add-ons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
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
                <ShoppingBag className="text-blue-600" size={32} />
                <h1 className="text-2xl font-bold">Travel Add-ons Marketplace</h1>
              </div>
              <p className="text-gray-600">Enhance your travel experience with premium add-ons and accessories</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCart(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search add-ons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="luggage">Luggage</option>
                  <option value="insurance">Insurance</option>
                  <option value="comfort">Comfort</option>
                  <option value="electronics">Electronics</option>
                  <option value="experience">Experiences</option>
                </select>
              </div>
              <div>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="under50">Under $50</option>
                  <option value="50to100">$50 - $100</option>
                  <option value="100to200">$100 - $200</option>
                  <option value="over200">Over $200</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add-ons Grid */}
          {filteredAddOns.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ShoppingBag className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-xl font-semibold mb-2">No add-ons found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setPriceFilter('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAddOns.map((addOn) => (
                <motion.div
                  key={addOn.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={addOn.image}
                      alt={addOn.name}
                      className="w-full h-full object-cover"
                    />
                    {addOn.bestSeller && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Best Seller
                      </div>
                    )}
                    {addOn.discountPrice && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Save ${(addOn.price - addOn.discountPrice).toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                        {addOn.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="text-yellow-400 fill-current" size={14} />
                        <span>{addOn.rating}</span>
                        <span>({addOn.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{addOn.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{addOn.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        {addOn.discountPrice ? (
                          <div>
                            <span className="text-xl font-bold text-blue-600">${addOn.discountPrice.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 line-through ml-2">${addOn.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-blue-600">${addOn.price.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedAddOn(addOn)}
                          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(addOn)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

      {/* Add-on Details Modal */}
      <AnimatePresence>
        {selectedAddOn && (
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
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-64">
                <img
                  src={selectedAddOn.image}
                  alt={selectedAddOn.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedAddOn(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <X size={24} />
                </button>
                {selectedAddOn.bestSeller && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Best Seller
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                    {selectedAddOn.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    <span>{selectedAddOn.rating}</span>
                    <span>({selectedAddOn.reviewCount} reviews)</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedAddOn.name}</h2>
                <p className="text-gray-600 mb-6">{selectedAddOn.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Features & Details</h3>
                  <ul className="space-y-2">
                    {selectedAddOn.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={18} className="text-green-500 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    {selectedAddOn.discountPrice ? (
                      <div>
                        <span className="text-3xl font-bold text-blue-600">${selectedAddOn.discountPrice.toFixed(2)}</span>
                        <span className="text-lg text-gray-500 line-through ml-2">${selectedAddOn.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-blue-600">${selectedAddOn.price.toFixed(2)}</span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(selectedAddOn);
                      setSelectedAddOn(null);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </motion.button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-blue-800">Why Add This to Your Trip?</h4>
                      <p className="text-blue-700 text-sm">
                        This add-on enhances your travel experience by providing additional comfort, convenience, or peace of mind.
                        Our products are carefully selected for quality and value.
                      </p>
                    </div>
                  </div>
                </div>
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
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
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
              
              <div className="p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto mb-4 text-gray-300" size={48} />
                    <h4 className="text-xl font-semibold mb-2">Your cart is empty</h4>
                    <p className="text-gray-500 mb-6">Add some travel add-ons to get started</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Add-ons
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((cartItem) => (
                        <div key={cartItem.item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{cartItem.item.name}</h4>
                            <p className="text-sm text-gray-500 capitalize">{cartItem.item.category}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center border rounded-l-lg hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="w-8 h-8 flex items-center justify-center border-t border-b">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center border rounded-r-lg hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(cartItem.item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div>
                              {cartItem.item.discountPrice ? (
                                <>
                                  <span className="font-bold">${(cartItem.item.discountPrice * cartItem.quantity).toFixed(2)}</span>
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              ${(cartItem.item.discountPrice || cartItem.item.price).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Tax:</span>
                        <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-bold">Total:</span>
                        <span className="text-xl font-bold">${(calculateTotal() * 1.1).toFixed(2)}</span>
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
                        disabled={isCheckingOut}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        {isCheckingOut ? (
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddOnsMarketplace;