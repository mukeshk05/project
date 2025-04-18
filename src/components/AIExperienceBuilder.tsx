import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Compass, Calendar, MapPin, Users, DollarSign, 
  Clock, Zap, Loader, Check, X, Download, Share2, 
  Camera, Utensils, Music, Briefcase, Heart, Star,
  Filter, Search, ArrowRight, Plus, Minus, Save
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../context/AuthContext';

interface CustomActivity {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: number;
  price: number;
  category: string;
  intensity: 'low' | 'medium' | 'high';
  bestTimeOfDay: string;
  requirements: string[];
  highlights: string[];
  images: string[];
  rating: number;
  reviews: number;
  createdAt: Date;
}

interface ActivityPreferences {
  destination: string;
  date: Date | null;
  duration: number;
  budget: number;
  travelers: number;
  interests: string[];
  intensity: 'low' | 'medium' | 'high';
  accessibility: boolean;
  privateExperience: boolean;
}

const AIExperienceBuilder: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ActivityPreferences>({
    destination: '',
    date: addDays(new Date(), 30),
    duration: 3,
    budget: 100,
    travelers: 2,
    interests: [],
    intensity: 'medium',
    accessibility: false,
    privateExperience: false
  });
  
  const [generatedActivities, setGeneratedActivities] = useState<CustomActivity[]>([]);
  const [savedActivities, setSavedActivities] = useState<CustomActivity[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CustomActivity | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  useEffect(() => {
    // Load saved activities
    fetchSavedActivities();
  }, []);
  
  const fetchSavedActivities = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSavedActivities: CustomActivity[] = [
        {
          id: '1',
          title: 'Private Cooking Class with Local Chef',
          description: 'Learn to prepare authentic local dishes with a professional chef in their home kitchen. Discover culinary secrets passed down through generations while enjoying a personalized cooking experience.',
          location: 'Florence, Italy',
          duration: 3,
          price: 85,
          category: 'culinary',
          intensity: 'low',
          bestTimeOfDay: 'evening',
          requirements: ['None', 'All cooking materials provided'],
          highlights: ['Personalized instruction', 'Local ingredients', 'Recipes to take home', 'Wine pairing'],
          images: ['https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80&w=2000'],
          rating: 4.9,
          reviews: 24,
          createdAt: new Date('2024-02-15')
        },
        {
          id: '2',
          title: 'Hidden Waterfall Hike',
          description: 'Discover a secluded waterfall on this guided hike through lush rainforest. This off-the-beaten-path adventure takes you to a pristine natural swimming hole where few tourists venture.',
          location: 'Bali, Indonesia',
          duration: 4,
          price: 45,
          category: 'adventure',
          intensity: 'medium',
          bestTimeOfDay: 'morning',
          requirements: ['Moderate fitness level', 'Closed-toe shoes', 'Swimwear'],
          highlights: ['Secluded location', 'Swimming opportunity', 'Local guide', 'Stunning photography spots'],
          images: ['https://images.unsplash.com/photo-1564519599588-1916a33e8e34?auto=format&fit=crop&q=80&w=2000'],
          rating: 4.7,
          reviews: 36,
          createdAt: new Date('2024-03-10')
        }
      ];
      
      setSavedActivities(mockSavedActivities);
    } catch (error) {
      console.error('Error fetching saved activities:', error);
    }
  };
  
  const generateActivities = async () => {
    if (!preferences.destination) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock activities based on preferences
      const mockActivities: CustomActivity[] = [
        {
          id: 'gen1',
          title: `${preferences.intensity === 'high' ? 'Advanced' : preferences.intensity === 'medium' ? 'Intermediate' : 'Beginner'} ${preferences.interests.includes('photography') ? 'Photography' : preferences.interests.includes('food') ? 'Culinary' : 'Cultural'} Tour in ${preferences.destination}`,
          description: `Experience ${preferences.destination} through the lens of ${preferences.interests.includes('photography') ? 'photography' : preferences.interests.includes('food') ? 'local cuisine' : 'local culture'} with this personalized ${preferences.duration}-hour ${preferences.privateExperience ? 'private' : 'small group'} experience. ${preferences.accessibility ? 'This tour is fully accessible and accommodates all mobility levels.' : ''}`,
          location: preferences.destination,
          duration: preferences.duration,
          price: Math.round(preferences.budget * (0.8 + Math.random() * 0.4)),
          category: preferences.interests[0] || 'cultural',
          intensity: preferences.intensity,
          bestTimeOfDay: preferences.interests.includes('photography') ? 'sunset' : 'morning',
          requirements: preferences.intensity === 'high' ? ['Good fitness level', 'Prior experience recommended'] : ['No special requirements'],
          highlights: [
            `Personalized ${preferences.privateExperience ? 'private' : 'small group'} experience`,
            `Expert local guide`,
            `${preferences.interests.includes('photography') ? 'Perfect photo opportunities' : preferences.interests.includes('food') ? 'Authentic local tastings' : 'Cultural immersion'}`,
            `${preferences.accessibility ? 'Fully accessible' : 'Off-the-beaten-path locations'}`
          ],
          images: [
            preferences.interests.includes('photography') 
              ? 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=2000'
              : preferences.interests.includes('food')
              ? 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2000'
              : 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80&w=2000'
          ],
          rating: 4.8,
          reviews: 15,
          createdAt: new Date()
        },
        {
          id: 'gen2',
          title: `${preferences.privateExperience ? 'Private' : 'Small Group'} ${preferences.interests.includes('adventure') ? 'Adventure' : preferences.interests.includes('history') ? 'Historical' : 'Local'} Experience in ${preferences.destination}`,
          description: `Discover the ${preferences.interests.includes('adventure') ? 'thrilling' : preferences.interests.includes('history') ? 'fascinating history' : 'authentic local culture'} of ${preferences.destination} with this custom-designed activity perfect for groups of ${preferences.travelers}. This ${preferences.duration}-hour experience is tailored to your ${preferences.intensity} activity level.`,
          location: preferences.destination,
          duration: preferences.duration,
          price: Math.round(preferences.budget * (0.7 + Math.random() * 0.5)),
          category: preferences.interests[1] || 'adventure',
          intensity: preferences.intensity,
          bestTimeOfDay: preferences.interests.includes('adventure') ? 'morning' : 'afternoon',
          requirements: preferences.intensity === 'low' ? ['No special requirements'] : ['Comfortable walking shoes', 'Water bottle'],
          highlights: [
            `${preferences.interests.includes('adventure') ? 'Exciting activities' : preferences.interests.includes('history') ? 'Historical insights' : 'Local experiences'}`,
            `${preferences.privateExperience ? 'Exclusive private guide' : 'Small group setting'}`,
            `Personalized to your interests`,
            `Perfect for groups of ${preferences.travelers}`
          ],
          images: [
            preferences.interests.includes('adventure')
              ? 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=2000'
              : preferences.interests.includes('history')
              ? 'https://images.unsplash.com/photo-1563466993-d3e0e37abac8?auto=format&fit=crop&q=80&w=2000'
              : 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=2000'
          ],
          rating: 4.6,
          reviews: 22,
          createdAt: new Date()
        },
        {
          id: 'gen3',
          title: `Exclusive ${preferences.interests.includes('nightlife') ? 'Evening' : 'Daytime'} ${preferences.interests.includes('shopping') ? 'Shopping' : preferences.interests.includes('relaxation') ? 'Relaxation' : 'Exploration'} in ${preferences.destination}`,
          description: `This custom-designed ${preferences.duration}-hour experience offers the perfect ${preferences.interests.includes('nightlife') ? 'evening entertainment' : 'daytime activity'} in ${preferences.destination}. Ideal for ${preferences.travelers} ${preferences.travelers > 1 ? 'people' : 'person'}, this ${preferences.intensity} intensity activity fits your budget and preferences perfectly.`,
          location: preferences.destination,
          duration: preferences.duration,
          price: Math.round(preferences.budget * (0.9 + Math.random() * 0.3)),
          category: preferences.interests[2] || 'exploration',
          intensity: preferences.intensity,
          bestTimeOfDay: preferences.interests.includes('nightlife') ? 'evening' : 'afternoon',
          requirements: [],
          highlights: [
            `${preferences.interests.includes('shopping') ? 'Curated shopping experience' : preferences.interests.includes('relaxation') ? 'Relaxing atmosphere' : 'Unique exploration'}`,
            `${preferences.privateExperience ? 'Private experience' : 'Small group setting'}`,
            `${preferences.accessibility ? 'Fully accessible' : 'Authentic local experience'}`,
            `Tailored to your preferences`
          ],
          images: [
            preferences.interests.includes('nightlife')
              ? 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=2000'
              : preferences.interests.includes('shopping')
              ? 'https://images.unsplash.com/photo-1482555670981-4de159d8553b?auto=format&fit=crop&q=80&w=2000'
              : 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=2000'
          ],
          rating: 4.7,
          reviews: 18,
          createdAt: new Date()
        }
      ];
      
      setGeneratedActivities(mockActivities);
    } catch (error) {
      console.error('Error generating activities:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const saveActivity = () => {
    if (!selectedActivity || !activityName) return;
    
    const savedActivity = {
      ...selectedActivity,
      id: Date.now().toString(),
      title: activityName
    };
    
    setSavedActivities([...savedActivities, savedActivity]);
    setShowSaveModal(false);
    setActivityName('');
  };
  
  const toggleInterest = (interest: string) => {
    setPreferences(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };
  
  const getFilteredActivities = () => {
    const activities = [...generatedActivities, ...savedActivities];
    
    return activities.filter(activity => {
      // Apply search filter
      if (searchTerm && !activity.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !activity.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !activity.location.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply category filter
      if (activeFilter && activity.category !== activeFilter) {
        return false;
      }
      
      return true;
    });
  };
  
  const getCategoryIcon = (category: string, size = 20) => {
    switch (category.toLowerCase()) {
      case 'culinary':
      case 'food':
        return <Utensils size={size} />;
      case 'adventure':
        return <Compass size={size} />;
      case 'cultural':
      case 'history':
        return <Briefcase size={size} />;
      case 'photography':
        return <Camera size={size} />;
      case 'nightlife':
        return <Music size={size} />;
      case 'relaxation':
        return <Heart size={size} />;
      case 'shopping':
        return <ShoppingBag size={size} />;
      case 'exploration':
        return <Map size={size} />;
      default:
        return <Star size={size} />;
    }
  };
  
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
  
  const filteredActivities = getFilteredActivities();
  const categories = Array.from(new Set([...generatedActivities, ...savedActivities].map(a => a.category)));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
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
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              AI Experience Builder
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Create custom travel activities tailored to your preferences with AI assistance
            </motion.p>
          </div>

          {/* Preferences Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold mb-6">Design Your Perfect Experience</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={preferences.destination}
                    onChange={(e) => setPreferences({ ...preferences, destination: e.target.value })}
                    placeholder="Where do you want to go?"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <DatePicker
                    selected={preferences.date}
                    onChange={(date) => setPreferences({ ...preferences, date })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    minDate={new Date()}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={preferences.duration}
                    onChange={(e) => setPreferences({ ...preferences, duration: parseInt(e.target.value) })}
                    min={1}
                    max={12}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget per person ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={preferences.budget}
                    onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) })}
                    min={10}
                    step={10}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={preferences.travelers}
                    onChange={(e) => setPreferences({ ...preferences, travelers: parseInt(e.target.value) })}
                    min={1}
                    max={20}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Intensity
                </label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setPreferences({ ...preferences, intensity: level as any })}
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        preferences.intensity === level
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-indigo-300'
                      } transition-colors`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { icon: Camera, label: 'Photography' },
                  { icon: Utensils, label: 'Food' },
                  { icon: Briefcase, label: 'History' },
                  { icon: Compass, label: 'Adventure' },
                  { icon: Music, label: 'Nightlife' },
                  { icon: Heart, label: 'Relaxation' },
                  { icon: ShoppingBag, label: 'Shopping' },
                  { icon: Map, label: 'Exploration' }
                ].map((interest) => {
                  const isSelected = preferences.interests.includes(interest.label.toLowerCase());
                  return (
                    <button
                      key={interest.label}
                      onClick={() => toggleInterest(interest.label.toLowerCase())}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-indigo-300'
                      } transition-colors`}
                    >
                      <interest.icon size={20} className={isSelected ? 'text-indigo-500' : 'text-gray-400'} />
                      <span>{interest.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.accessibility}
                  onChange={(e) => setPreferences({ ...preferences, accessibility: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Accessible options needed</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.privateExperience}
                  onChange={(e) => setPreferences({ ...preferences, privateExperience: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Private experience preferred</span>
              </label>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateActivities}
                disabled={isGenerating || !preferences.destination}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin" size={24} />
                    <span>Designing Experiences...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    <span>Generate Custom Activities</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          {(generatedActivities.length > 0 || savedActivities.length > 0) && (
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveFilter(null)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeFilter === null
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveFilter(activeFilter === category ? null : category)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          activeFilter === category
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {getCategoryIcon(category, 16)}
                        <span className="capitalize">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Activities Grid */}
              {filteredActivities.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Filter className="mx-auto mb-4 text-gray-300" size={48} />
                  <h3 className="text-xl font-semibold mb-2">No activities found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter(null);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <img
                          src={activity.images[0]}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="text-yellow-400 fill-current" size={16} />
                          <span>{activity.rating}</span>
                          <span className="text-gray-500">({activity.reviews})</span>
                        </div>
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1">
                          <DollarSign size={16} className="text-green-600" />
                          <span>${activity.price}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getIntensityColor(activity.intensity)}`}>
                            {activity.intensity.charAt(0).toUpperCase() + activity.intensity.slice(1)} Intensity
                          </span>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs capitalize">
                            {activity.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                          <MapPin size={16} />
                          <span>{activity.location}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">{activity.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock size={16} />
                            <span>{activity.duration} hours</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              setSelectedActivity(activity);
                              setActivityName(activity.title);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
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
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-80">
                <img
                  src={selectedActivity.images[0]}
                  alt={selectedActivity.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getIntensityColor(selectedActivity.intensity)}`}>
                      {selectedActivity.intensity.charAt(0).toUpperCase() + selectedActivity.intensity.slice(1)} Intensity
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs capitalize">
                      {selectedActivity.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedActivity.title}</h2>
                  <div className="flex items-center gap-4 text-white/90 mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{selectedActivity.duration} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>${selectedActivity.price}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">About This Experience</h3>
                  <p className="text-gray-600">{selectedActivity.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-bold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {selectedActivity.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check size={18} className="text-green-500 mt-1" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-3">Important Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Requirements</p>
                        <ul className="space-y-1 mt-1">
                          {selectedActivity.requirements.map((req, index) => (
                            <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2"></div>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium">Best Time</p>
                        <p className="text-gray-600 text-sm capitalize">{selectedActivity.bestTimeOfDay}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSaveModal(true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    <span>Save Activity</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Activity Modal */}
      <AnimatePresence>
        {showSaveModal && (
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
                <h3 className="text-xl font-bold">Save Custom Activity</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Give your activity a name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveActivity}
                  disabled={!activityName.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIExperienceBuilder;