import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  List, MapPin, Calendar, Check, X, Plus, Edit, 
  Trash2, Globe, Search, Filter, ChevronDown, ChevronUp,
  Heart, Share2, Flag, Target, Award, Camera, Plane,
  Compass, Mountain, Umbrella, Utensils, Zap, Save
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface BucketListItem {
  id: string;
  title: string;
  description?: string;
  location?: string;
  category: 'destination' | 'activity' | 'food' | 'accommodation' | 'event' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'planned' | 'in-progress' | 'completed' | 'abandoned';
  targetDate?: Date;
  completedDate?: Date;
  notes?: string;
  images?: string[];
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  isUnlocked: boolean;
  progress: number;
  total: number;
  category: string;
  unlockedAt?: Date;
}

const BucketListTracker: React.FC = () => {
  const { user } = useAuth();
  const [bucketList, setBucketList] = useState<BucketListItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'achievements' | 'stats'>('list');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<BucketListItem>>({
    title: '',
    description: '',
    location: '',
    category: 'destination',
    priority: 'medium',
    status: 'planned',
    isPublic: false,
    tags: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [selectedItem, setSelectedItem] = useState<BucketListItem | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchBucketListAndAchievements();
  }, []);

  const fetchBucketListAndAchievements = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock bucket list items
      const mockBucketList: BucketListItem[] = [
        {
          id: '1',
          title: 'See the Northern Lights in Iceland',
          description: 'Experience the magical aurora borealis in the Icelandic winter',
          location: 'Reykjavik, Iceland',
          category: 'destination',
          priority: 'high',
          status: 'planned',
          targetDate: new Date('2024-12-15'),
          isPublic: true,
          likes: 24,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          tags: ['Iceland', 'NorthernLights', 'Winter', 'NaturalWonder']
        },
        {
          id: '2',
          title: 'Hike to Machu Picchu',
          description: 'Trek the Inca Trail to the ancient citadel',
          location: 'Cusco, Peru',
          category: 'activity',
          priority: 'medium',
          status: 'completed',
          targetDate: new Date('2023-06-10'),
          completedDate: new Date('2023-06-12'),
          notes: 'Incredible experience! The 4-day trek was challenging but absolutely worth it. The views were breathtaking.',
          images: [
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=2000'
          ],
          isPublic: true,
          likes: 42,
          createdAt: new Date('2023-01-20'),
          updatedAt: new Date('2023-06-15'),
          tags: ['Peru', 'MachuPicchu', 'Hiking', 'IncaTrail', 'Bucket']
        },
        {
          id: '3',
          title: 'Try authentic sushi in Tokyo',
          description: 'Visit Tsukiji Fish Market and experience the best sushi in the world',
          location: 'Tokyo, Japan',
          category: 'food',
          priority: 'medium',
          status: 'completed',
          completedDate: new Date('2023-09-05'),
          notes: 'The freshest sushi I've ever had! Went to Sushi Dai and waited in line for 3 hours, but it was worth every minute.',
          isPublic: true,
          likes: 18,
          createdAt: new Date('2023-05-10'),
          updatedAt: new Date('2023-09-06'),
          tags: ['Japan', 'Tokyo', 'Sushi', 'FoodieAdventure']
        },
        {
          id: '4',
          title: 'Stay in an overwater bungalow in Bora Bora',
          description: 'Experience luxury in a private overwater villa in French Polynesia',
          location: 'Bora Bora, French Polynesia',
          category: 'accommodation',
          priority: 'high',
          status: 'planned',
          targetDate: new Date('2025-02-14'),
          isPublic: true,
          likes: 35,
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
          tags: ['BoraBora', 'Luxury', 'Honeymoon', 'OverwaterBungalow']
        },
        {
          id: '5',
          title: 'Attend Carnival in Rio de Janeiro',
          description: 'Experience the world\'s biggest party with samba, costumes, and parades',
          location: 'Rio de Janeiro, Brazil',
          category: 'event',
          priority: 'medium',
          status: 'in-progress',
          targetDate: new Date('2025-02-22'),
          isPublic: false,
          likes: 12,
          createdAt: new Date('2023-03-05'),
          updatedAt: new Date('2024-01-10'),
          tags: ['Brazil', 'Carnival', 'Festival', 'Samba']
        }
      ];
      
      // Mock achievements
      const mockAchievements: Achievement[] = [
        {
          id: 'a1',
          name: 'Globetrotter',
          description: 'Visit 10 different countries',
          icon: Globe,
          isUnlocked: false,
          progress: 3,
          total: 10,
          category: 'travel'
        },
        {
          id: 'a2',
          name: 'Bucket List Beginner',
          description: 'Complete 5 bucket list items',
          icon: Check,
          isUnlocked: false,
          progress: 2,
          total: 5,
          category: 'completion'
        },
        {
          id: 'a3',
          name: 'Adventure Seeker',
          description: 'Complete 3 adventure activities',
          icon: Compass,
          isUnlocked: false,
          progress: 1,
          total: 3,
          category: 'adventure'
        },
        {
          id: 'a4',
          name: 'Foodie Explorer',
          description: 'Try cuisine from 5 different countries',
          icon: Utensils,
          isUnlocked: false,
          progress: 1,
          total: 5,
          category: 'food'
        },
        {
          id: 'a5',
          name: 'Natural Wonder',
          description: 'Visit 3 natural wonders of the world',
          icon: Mountain,
          isUnlocked: false,
          progress: 0,
          total: 3,
          category: 'nature'
        }
      ];
      
      setBucketList(mockBucketList);
      setAchievements(mockAchievements);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bucket list and achievements:', error);
      setIsLoading(false);
    }
  };

  const addOrUpdateBucketListItem = () => {
    if (!newItem.title?.trim()) return;
    
    if (editingItem) {
      // Update existing item
      setBucketList(bucketList.map(item => 
        item.id === editingItem.id
          ? {
              ...item,
              ...newItem,
              updatedAt: new Date(),
              tags: newItem.tags || []
            } as BucketListItem
          : item
      ));
    } else {
      // Add new item
      const item: BucketListItem = {
        id: uuidv4(),
        title: newItem.title!,
        description: newItem.description,
        location: newItem.location,
        category: newItem.category as 'destination' | 'activity' | 'food' | 'accommodation' | 'event' | 'other',
        priority: newItem.priority as 'low' | 'medium' | 'high',
        status: newItem.status as 'planned' | 'in-progress' | 'completed' | 'abandoned',
        targetDate: newItem.targetDate,
        completedDate: newItem.status === 'completed' ? new Date() : undefined,
        notes: newItem.notes,
        images: newItem.images,
        isPublic: newItem.isPublic || false,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: newItem.tags || []
      };
      
      setBucketList([...bucketList, item]);
      
      // Check for achievements
      checkForAchievements([...bucketList, item]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setNewItem({
      title: '',
      description: '',
      location: '',
      category: 'destination',
      priority: 'medium',
      status: 'planned',
      isPublic: false,
      tags: []
    });
    setEditingItem(null);
    setShowAddItemModal(false);
  };

  const editItem = (item: BucketListItem) => {
    setEditingItem(item);
    setNewItem({
      ...item
    });
    setShowAddItemModal(true);
  };

  const deleteItem = (itemId: string) => {
    setBucketList(bucketList.filter(item => item.id !== itemId));
  };

  const updateItemStatus = (itemId: string, status: 'planned' | 'in-progress' | 'completed' | 'abandoned') => {
    const updatedList = bucketList.map(item => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          status,
          updatedAt: new Date()
        };
        
        if (status === 'completed') {
          updatedItem.completedDate = new Date();
        } else {
          updatedItem.completedDate = undefined;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setBucketList(updatedList);
    
    // Check for achievements
    checkForAchievements(updatedList);
  };

  const checkForAchievements = (items: BucketListItem[]) => {
    const completedItems = items.filter(item => item.status === 'completed');
    const completedCountries = new Set(completedItems.map(item => item.location?.split(', ').pop()).filter(Boolean)).size;
    const completedAdventures = completedItems.filter(item => item.category === 'activity').length;
    const completedFoodExperiences = completedItems.filter(item => item.category === 'food').length;
    
    const updatedAchievements = achievements.map(achievement => {
      let progress = achievement.progress;
      
      switch (achievement.id) {
        case 'a1': // Globetrotter
          progress = completedCountries;
          break;
        case 'a2': // Bucket List Beginner
          progress = completedItems.length;
          break;
        case 'a3': // Adventure Seeker
          progress = completedAdventures;
          break;
        case 'a4': // Foodie Explorer
          progress = completedFoodExperiences;
          break;
      }
      
      const isUnlocked = progress >= achievement.total;
      
      return {
        ...achievement,
        progress,
        isUnlocked,
        unlockedAt: isUnlocked && !achievement.isUnlocked ? new Date() : achievement.unlockedAt
      };
    });
    
    setAchievements(updatedAchievements);
  };

  const toggleItemPublic = (itemId: string) => {
    setBucketList(bucketList.map(item => 
      item.id === itemId
        ? { ...item, isPublic: !item.isPublic, updatedAt: new Date() }
        : item
    ));
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    setNewItem({
      ...newItem,
      tags: [...(newItem.tags || []), newTag.trim()]
    });
    
    setNewTag('');
  };

  const removeTag = (index: number) => {
    setNewItem({
      ...newItem,
      tags: (newItem.tags || []).filter((_, i) => i !== index)
    });
  };

  const getFilteredItems = () => {
    let filtered = [...bucketList];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term)) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'status':
        const statusOrder = { 'in-progress': 0, 'planned': 1, 'completed': 2, 'abandoned': 3 };
        filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    return filtered;
  };

  const getCategoryIcon = (category: string, size = 20) => {
    switch (category) {
      case 'destination':
        return <MapPin size={size} />;
      case 'activity':
        return <Zap size={size} />;
      case 'food':
        return <Utensils size={size} />;
      case 'accommodation':
        return <Home size={size} />;
      case 'event':
        return <Calendar size={size} />;
      default:
        return <Flag size={size} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'high':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-600';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'abandoned':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getCompletionData = () => {
    const completedByDate: { [key: string]: number } = {};
    
    bucketList
      .filter(item => item.status === 'completed' && item.completedDate)
      .forEach(item => {
        const dateStr = format(item.completedDate!, 'yyyy-MM-dd');
        completedByDate[dateStr] = (completedByDate[dateStr] || 0) + 1;
      });
    
    return Object.entries(completedByDate).map(([date, count]) => ({
      date,
      count
    }));
  };

  const getStats = () => {
    const total = bucketList.length;
    const completed = bucketList.filter(item => item.status === 'completed').length;
    const inProgress = bucketList.filter(item => item.status === 'in-progress').length;
    const planned = bucketList.filter(item => item.status === 'planned').length;
    const abandoned = bucketList.filter(item => item.status === 'abandoned').length;
    
    const categoryCounts: { [key: string]: number } = {
      destination: 0,
      activity: 0,
      food: 0,
      accommodation: 0,
      event: 0,
      other: 0
    };
    
    bucketList.forEach(item => {
      categoryCounts[item.category]++;
    });
    
    return {
      total,
      completed,
      inProgress,
      planned,
      abandoned,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      categoryCounts
    };
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

  const filteredItems = getFilteredItems();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bucket List Tracker</h1>
              <p className="text-gray-600">Track, plan, and achieve your travel dreams</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingItem(null);
                setNewItem({
                  title: '',
                  description: '',
                  location: '',
                  category: 'destination',
                  priority: 'medium',
                  status: 'planned',
                  isPublic: false,
                  tags: []
                });
                setShowAddItemModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Add to Bucket List</span>
            </motion.button>
          </div>

          {/* Stats Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-gray-600">Total Items</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
                <p className="text-gray-600">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.planned}</div>
                <p className="text-gray-600">Planned</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.completionRate}%</div>
                <p className="text-gray-600">Completion Rate</p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'list'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bucket List
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'achievements'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'stats'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Statistics
              </button>
            </div>

            <div className="p-6">
              {/* Bucket List Tab */}
              {activeTab === 'list' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Filters */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search bucket list..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="destination">Destinations</option>
                      <option value="activity">Activities</option>
                      <option value="food">Food & Drink</option>
                      <option value="accommodation">Accommodations</option>
                      <option value="event">Events</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="date">Sort by Date Added</option>
                      <option value="priority">Sort by Priority</option>
                      <option value="status">Sort by Status</option>
                      <option value="alphabetical">Sort Alphabetically</option>
                    </select>
                  </div>
                  
                  {/* Bucket List Items */}
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <List className="mx-auto mb-4 text-gray-300" size={48} />
                      <h3 className="text-xl font-semibold mb-2">Your bucket list is empty</h3>
                      <p className="text-gray-500 mb-6">Start adding your travel dreams and goals</p>
                      <button
                        onClick={() => {
                          setEditingItem(null);
                          setNewItem({
                            title: '',
                            description: '',
                            location: '',
                            category: 'destination',
                            priority: 'medium',
                            status: 'planned',
                            isPublic: false,
                            tags: []
                          });
                          setShowAddItemModal(true);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add First Item
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredItems.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          className={`border rounded-lg p-4 ${
                            item.status === 'completed'
                              ? 'border-green-200 bg-green-50'
                              : item.status === 'in-progress'
                              ? 'border-yellow-200 bg-yellow-50'
                              : item.status === 'abandoned'
                              ? 'border-gray-200 bg-gray-50'
                              : 'border-blue-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                item.status === 'completed'
                                  ? 'bg-green-100 text-green-600'
                                  : item.status === 'in-progress'
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : item.status === 'abandoned'
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                {getCategoryIcon(item.category)}
                              </div>
                              <div>
                                <h3 className="font-bold">{item.title}</h3>
                                {item.description && (
                                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  {item.location && (
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <MapPin size={14} />
                                      <span>{item.location}</span>
                                    </div>
                                  )}
                                  {item.targetDate && (
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Calendar size={14} />
                                      <span>Target: {format(item.targetDate, 'MMM d, yyyy')}</span>
                                    </div>
                                  )}
                                  {item.completedDate && (
                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                      <Check size={14} />
                                      <span>Completed: {format(item.completedDate, 'MMM d, yyyy')}</span>
                                    </div>
                                  )}
                                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                  </span>
                                </div>
                                {item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {item.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => editItem(item)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Status Actions */}
                          {item.status !== 'completed' && item.status !== 'abandoned' && (
                            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                              {item.status === 'planned' && (
                                <button
                                  onClick={() => updateItemStatus(item.id, 'in-progress')}
                                  className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
                                >
                                  Mark as In Progress
                                </button>
                              )}
                              <button
                                onClick={() => updateItemStatus(item.id, 'completed')}
                                className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm hover:bg-green-200 transition-colors"
                              >
                                Mark as Completed
                              </button>
                              <button
                                onClick={() => updateItemStatus(item.id, 'abandoned')}
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                              >
                                Abandon
                              </button>
                            </div>
                          )}
                          
                          {/* Social Actions */}
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-gray-500">
                                <Heart size={16} className={item.likes > 0 ? 'fill-current text-red-500' : ''} />
                                <span>{item.likes}</span>
                              </div>
                              <button
                                onClick={() => toggleItemPublic(item.id)}
                                className={`flex items-center gap-1 text-sm ${
                                  item.isPublic ? 'text-green-600' : 'text-gray-500'
                                }`}
                              >
                                <Globe size={16} />
                                <span>{item.isPublic ? 'Public' : 'Private'}</span>
                              </button>
                            </div>
                            {item.isPublic && (
                              <button
                                className="flex items-center gap-1 text-blue-600 text-sm"
                              >
                                <Share2 size={16} />
                                <span>Share</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        variants={itemVariants}
                        className={`border rounded-lg p-6 ${
                          achievement.isUnlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-lg ${
                            achievement.isUnlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <achievement.icon size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress} / {achievement.total}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${achievement.isUnlocked ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(100, (achievement.progress / achievement.total) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            achievement.isUnlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {achievement.isUnlocked ? 'Unlocked' : 'Locked'}
                          </span>
                          {achievement.unlockedAt && (
                            <span className="text-xs text-gray-500">
                              {format(achievement.unlockedAt, 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Completion Rate */}
                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
                      <div className="flex items-center justify-center">
                        <div className="relative w-40 h-40">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              className="text-gray-200"
                              strokeWidth="10"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className="text-blue-600"
                              strokeWidth="10"
                              strokeDasharray={`${stats.completionRate * 2.51} 251`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold">{stats.completionRate}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">{stats.completed}</div>
                          <p className="text-sm text-gray-500">Completed</p>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{stats.total}</div>
                          <p className="text-sm text-gray-500">Total Items</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Category Distribution */}
                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                      <div className="space-y-4">
                        {Object.entries(stats.categoryCounts).map(([category, count]) => (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(category, 16)}
                                <span className="capitalize">{category}</span>
                              </div>
                              <span>{count}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  category === 'destination' ? 'bg-blue-500' :
                                  category === 'activity' ? 'bg-purple-500' :
                                  category === 'food' ? 'bg-green-500' :
                                  category === 'accommodation' ? 'bg-yellow-500' :
                                  category === 'event' ? 'bg-red-500' :
                                  'bg-gray-500'
                                }`}
                                style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Completion Timeline */}
                    <div className="bg-white rounded-lg border p-6 md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Completion Timeline</h3>
                      <div className="h-32">
                        <CalendarHeatmap
                          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                          endDate={new Date()}
                          values={getCompletionData()}
                          classForValue={(value) => {
                            if (!value) {
                              return 'color-empty';
                            }
                            return `color-scale-${Math.min(4, value.count)}`;
                          }}
                          tooltipDataAttrs={(value: any) => {
                            if (!value || !value.date) {
                              return null;
                            }
                            return {
                              'data-tip': `${value.date}: ${value.count} item${value.count !== 1 ? 's' : ''} completed`,
                            };
                          }}
                        />
                      </div>
                      <div className="flex justify-center gap-2 mt-4">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                          <span className="text-xs text-gray-500">0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                          <span className="text-xs text-gray-500">1</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
                          <span className="text-xs text-gray-500">2</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                          <span className="text-xs text-gray-500">3</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                          <span className="text-xs text-gray-500">4+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Item Modal */}
      <AnimatePresence>
        {showAddItemModal && (
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
              className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingItem ? 'Edit Bucket List Item' : 'Add to Bucket List'}
                </h3>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="e.g., Visit the Great Wall of China"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Add more details about this bucket list item..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={newItem.location || ''}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      placeholder="e.g., Paris, France"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newItem.category || 'destination'}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        category: e.target.value as 'destination' | 'activity' | 'food' | 'accommodation' | 'event' | 'other'
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="destination">Destination</option>
                      <option value="activity">Activity</option>
                      <option value="food">Food & Drink</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="event">Event</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newItem.priority || 'medium'}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        priority: e.target.value as 'low' | 'medium' | 'high'
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newItem.status || 'planned'}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        status: e.target.value as 'planned' | 'in-progress' | 'completed' | 'abandoned'
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newItem.targetDate ? format(newItem.targetDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        targetDate: e.target.value ? new Date(e.target.value) : undefined
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newItem.notes || ''}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Add any additional notes or thoughts..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(newItem.tags || []).map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => removeTag(index)}
                          className="hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newItem.isPublic || false}
                    onChange={(e) => setNewItem({ ...newItem, isPublic: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="isPublic" className="text-gray-700">
                    Make this item public (share with community)
                  </label>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddItemModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addOrUpdateBucketListItem}
                    disabled={!newItem.title?.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={20} />
                    <span>{editingItem ? 'Update' : 'Add'} Item</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
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
              <div className="relative">
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-blue-100 flex items-center justify-center">
                    {getCategoryIcon(selectedItem.category, 64)}
                  </div>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                    {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                {selectedItem.description && (
                  <p className="text-gray-600 mb-6">{selectedItem.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Details</h3>
                    <div className="space-y-3">
                      {selectedItem.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="text-gray-400" size={20} />
                          <span>{selectedItem.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Flag className="text-gray-400" size={20} />
                        <span>
                          {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="text-gray-400" size={20} />
                        <span>
                          {selectedItem.priority.charAt(0).toUpperCase() + selectedItem.priority.slice(1)} Priority
                        </span>
                      </div>
                      {selectedItem.targetDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="text-gray-400" size={20} />
                          <span>Target: {format(selectedItem.targetDate, 'MMMM d, yyyy')}</span>
                        </div>
                      )}
                      {selectedItem.completedDate && (
                        <div className="flex items-center gap-2">
                          <Check className="text-green-500" size={20} />
                          <span>Completed: {format(selectedItem.completedDate, 'MMMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Notes</h3>
                    {selectedItem.notes ? (
                      <p className="text-gray-600">{selectedItem.notes}</p>
                    ) : (
                      <p className="text-gray-400 italic">No notes added yet</p>
                    )}
                  </div>
                </div>
                
                {selectedItem.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => editItem(selectedItem)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                    >
                      <Edit size={18} />
                      <span>Edit</span>
                    </button>
                    {selectedItem.status !== 'completed' && (
                      <button
                        onClick={() => {
                          updateItemStatus(selectedItem.id, 'completed');
                          setSelectedItem(null);
                        }}
                        className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                      >
                        <Check size={18} />
                        <span>Mark as Completed</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleItemPublic(selectedItem.id)}
                      className={`p-2 rounded-full ${
                        selectedItem.isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      } hover:opacity-80 transition-opacity`}
                      title={selectedItem.isPublic ? 'Make Private' : 'Make Public'}
                    >
                      <Globe size={20} />
                    </button>
                    <button
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                      title="Share"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BucketListTracker;