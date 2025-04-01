import React, { useState, useMemo } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plane, MapPin, Calendar, Users, Search, Star, ArrowRight, Phone, Mail, Clock, Filter, LogIn, UserPlus, LogOut, MessageSquare, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TravelAssistant from './components/TravelAssistant';
import TravelAssistantPage from './components/TravelAssistantPage';
import BookingHistory from './components/BookingHistory';
import AuthButtons from './components/AuthButtons';
import UserMenu from './components/UserMenu';
import AuthCallback from './components/AuthCallback';
import TravelMap from './components/TravelMap';
import DestinationDetail from './components/DestinationDetail';
import TravelSearch from './components/TravelSearch';
import FlightResults from './components/search/FlightResults';
import CarResults from './components/search/CarResults';
import HotelResults from './components/search/HotelResults';
import CruiseResults from './components/search/CruiseResults';

function App() {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [rating, setRating] = useState('all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const allDestinations = [
    {
      name: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800',
      price: 1299,
      rating: 4.8,
      type: 'beach',
      description: 'Experience the stunning white architecture and beautiful beaches of Santorini.'
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
      price: 899,
      rating: 4.7,
      type: 'tropical',
      description: 'Discover tropical paradise with ancient temples and pristine beaches.'
    },
    {
      name: 'Maldives',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
      price: 1599,
      rating: 4.9,
      type: 'beach',
      description: 'Luxury overwater villas and crystal-clear waters await.'
    },
    {
      name: 'Swiss Alps',
      image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800',
      price: 1899,
      rating: 4.8,
      type: 'mountain',
      description: 'Perfect for skiing, hiking, and mountain adventures.'
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
      price: 1499,
      rating: 4.7,
      type: 'city',
      description: 'Modern technology meets ancient tradition in this vibrant city.'
    },
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
      price: 1299,
      rating: 4.6,
      type: 'city',
      description: 'The city of love, art, and incredible cuisine.'
    }
  ];

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = priceRange === 'all' ||
        (priceRange === 'under1000' && dest.price < 1000) ||
        (priceRange === '1000to1500' && dest.price >= 1000 && dest.price <= 1500) ||
        (priceRange === 'over1500' && dest.price > 1500);

      const matchesRating = rating === 'all' ||
        (rating === '4.5' && dest.rating >= 4.5) ||
        (rating === '4.7' && dest.rating >= 4.7) ||
        (rating === '4.9' && dest.rating >= 4.9);

      return matchesSearch && matchesPrice && matchesRating;
    });
  }, [searchQuery, priceRange, rating]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Plane className="text-orange-500" size={24} />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-900"
              >
                TravelBooking
              </motion.span>
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <AuthButtons />
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <Routes>
        <Route path="/" element={
          <>
            {/* Hero Section */}
            <div className="relative h-[600px]">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2000"
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="text-white w-full">
                  <h1 className="text-5xl font-bold mb-6">Discover Your Next Adventure</h1>
                  <p className="text-xl mb-8 max-w-2xl">Experience the world's most breathtaking destinations with our premium travel packages and personalized itineraries.</p>
                  
                  <TravelSearch />
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search destinations, types, or descriptions..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <select
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option value="all">All Prices</option>
                      <option value="under1000">Under $1000</option>
                      <option value="1000to1500">$1000 - $1500</option>
                      <option value="over1500">Over $1500</option>
                    </select>
                  </div>
                  <div>
                    <select
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="all">All Ratings</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.7">4.7+ Stars</option>
                      <option value="4.9">4.9+ Stars</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Filter size={20} />
                    <span>{filteredDestinations.length} destinations found</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Explore Destinations & Packages</h2>
                <TravelMap />
              </div>
            </div>

            {/* Destinations Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredDestinations.map((destination, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
                    <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold">{destination.name}</h3>
                        <span className="text-blue-600 font-bold">${destination.price}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{destination.description}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="text-gray-600">{destination.rating}</span>
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mb-4">
                        {destination.type}
                      </span>
                      <Link to={`/destination/${index + 1}`}>
                        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                    <p className="text-gray-600">Our dedicated team is always here to help you with any questions or concerns.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
                    <p className="text-gray-600">We promise to offer you the best rate we can - at par with the best available anywhere else.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
                    <p className="text-gray-600">Change your plans? No problem! We offer free cancellation on most bookings.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        } />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/assistant" element={<TravelAssistantPage />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/search/flights" element={<FlightResults />} />
        <Route path="/search/cars" element={<CarResults />} />
        <Route path="/search/hotels" element={<HotelResults />} />
        <Route path="/search/cruises" element={<CruiseResults />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">About Us</h4>
              <p className="text-gray-400">We make travel accessible, comfortable and enjoyable for everyone.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</Link></li>
                <li><Link to="/packages" className="text-gray-400 hover:text-white transition-colors">Packages</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  info@travelsite.com
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Travel Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <TravelAssistant />
    </div>
  );
}

export default App;