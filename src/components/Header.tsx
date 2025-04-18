import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Plane, Building, Car, Ship, MapPin, MessageSquare, User, Settings, Gift, ShoppingBag, Heart, 
  Share2, Users, Bell, Smartphone, List, Mic, Package, Brain, Calendar, Compass, Zap, FileText, 
  Newspaper, Book, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthButtons from './AuthButtons';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/flights', icon: Plane, label: t('navigation.flights') },
    { path: '/hotels', icon: Building, label: t('navigation.hotels') },
    { path: '/cars', icon: Car, label: t('navigation.cars') },
    { path: '/cruises', icon: Ship, label: t('navigation.cruises') },
    { path: '/map', icon: MapPin, label: t('navigation.map') },
    { path: '/assistant', icon: MessageSquare, label: t('navigation.assistant') }
  ];

  const extraItems = [
    { path: '/perks-store', icon: Gift, label: 'Perks Store' },
    { path: '/add-ons', icon: ShoppingBag, label: 'Add-ons' },
    { path: '/ai-concierge', icon: Heart, label: 'AI Concierge' }
  ];

  const newFeatures = [
    { path: '/social-feed', icon: Share2, label: 'Social Feed' },
    { path: '/referral-boost', icon: Users, label: 'Referrals' },
    { path: '/multi-device-sync', icon: Smartphone, label: 'Device Sync' },
    { path: '/bucket-list', icon: List, label: 'Bucket List' },
    { path: '/voice-concierge', icon: Mic, label: 'Voice Assistant' },
    { path: '/packing-optimizer', icon: Package, label: 'Packing AI' },
    { path: '/memory-planning', icon: Brain, label: 'Memory Planning' }
  ];

  const aiFeatures = [
    { path: '/flight-delay-predictor', icon: Plane, label: 'Flight Delay Predictor' },
    { path: '/trip-dna', icon: Compass, label: 'Trip DNA Generator' },
    { path: '/seasonal-calendar', icon: Calendar, label: 'Seasonal Calendar' },
    { path: '/widget-api', icon: Zap, label: 'Travel Widget API' },
    { path: '/trip-newsletter', icon: Newspaper, label: 'Trip Newsletter' },
    { path: '/travel-scrapbook', icon: Book, label: 'Travel Scrapbook' },
    { path: '/weekend-escape', icon: Clock, label: 'Weekend Escape AI' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">TravelAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Extra Items */}
            {extraItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* New Features Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50">
                <Bell size={16} />
                <span>Features</span>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  {newFeatures.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                        isActive(item.path) ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Features Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50">
                <Brain size={16} />
                <span>AI Tools</span>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-1">
                  {aiFeatures.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                        isActive(item.path) ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right side - Auth buttons or User menu */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <AuthButtons />
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-50 md:hidden bg-white"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="text-2xl font-bold text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  TravelAI
                </Link>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-2 mb-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {/* Extra Items */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Premium Features
                  </h3>
                  {extraItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* New Features */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    New Features
                  </h3>
                  {newFeatures.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* AI Features */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    AI Tools
                  </h3>
                  {aiFeatures.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <LanguageSwitcher variant="sidebar" />
                
                {user ? (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={20} />
                        <span>{t('common.profile')}</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={20} />
                        <span>{t('common.settings')}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={20} />
                        <span>{t('common.logout')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 border-t pt-6 space-y-4">
                    <Link
                      to="/login"
                      className="block w-full px-4 py-3 text-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('common.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-4 py-3 text-center rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('common.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;