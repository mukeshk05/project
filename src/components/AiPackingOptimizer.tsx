import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Sun, Cloud, Umbrella, ThermometerSun, Wind,
  Calendar, MapPin, Users, Briefcase, Check, X, Plus,
  Save, Trash2, Edit, Download, Share2, Sparkles, Loader,
  Shirt, Footprints, Smartphone, Battery, BriefcaseIcon, Scissors,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface PackingItem {
  id: string;
  name: string;
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'accessories' | 'medical' | 'other';
  quantity: number;
  isPacked: boolean;
  isEssential: boolean;
  notes?: string;
  weight?: number; // in grams
}

interface PackingList {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: {
    adults: number;
    children: number;
  };
  weatherConditions: string[];
  activities: string[];
  items: PackingItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface WeatherForecast {
  date: Date;
  condition: string;
  temperature: {
    min: number;
    max: number;
  };
  precipitation: number;
  humidity: number;
  icon: string;
}

const AiPackingOptimizer: React.FC = () => {
  const { user } = useAuth();
  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [selectedList, setSelectedList] = useState<PackingList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PackingItem>>({
    name: '',
    category: 'clothing',
    quantity: 1,
    isPacked: false,
    isEssential: false
  });
  const [newList, setNewList] = useState<Partial<PackingList>>({
    name: '',
    destination: '',
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    travelers: {
      adults: 1,
      children: 0
    },
    weatherConditions: [],
    activities: []
  });
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPackingLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      fetchWeatherForecast(selectedList.destination);
    }
  }, [selectedList]);

  const fetchPackingLists = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPackingLists: PackingList[] = [
        {
          id: '1',
          name: 'Summer Beach Vacation',
          destination: 'Cancun, Mexico',
          startDate: addDays(new Date(), 30),
          endDate: addDays(new Date(), 37),
          travelers: {
            adults: 2,
            children: 1
          },
          weatherConditions: ['sunny', 'hot', 'humid'],
          activities: ['beach', 'swimming', 'snorkeling', 'dining'],
          items: [
            {
              id: 'i1',
              name: 'T-shirts',
              category: 'clothing',
              quantity: 7,
              isPacked: false,
              isEssential: true
            },
            {
              id: 'i2',
              name: 'Swimwear',
              category: 'clothing',
              quantity: 3,
              isPacked: true,
              isEssential: true
            },
            {
              id: 'i3',
              name: 'Sunscreen',
              category: 'toiletries',
              quantity: 1,
              isPacked: false,
              isEssential: true,
              notes: 'SPF 50+'
            },
            {
              id: 'i4',
              name: 'Phone charger',
              category: 'electronics',
              quantity: 1,
              isPacked: false,
              isEssential: true
            },
            {
              id: 'i5',
              name: 'Passport',
              category: 'documents',
              quantity: 3,
              isPacked: false,
              isEssential: true
            }
          ],
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date('2024-03-10')
        },
        {
          id: '2',
          name: 'Business Trip to Tokyo',
          destination: 'Tokyo, Japan',
          startDate: addDays(new Date(), 15),
          endDate: addDays(new Date(), 20),
          travelers: {
            adults: 1,
            children: 0
          },
          weatherConditions: ['mild', 'rainy'],
          activities: ['meetings', 'dining', 'sightseeing'],
          items: [
            {
              id: 'i6',
              name: 'Business suits',
              category: 'clothing',
              quantity: 2,
              isPacked: false,
              isEssential: true
            },
            {
              id: 'i7',
              name: 'Dress shoes',
              category: 'clothing',
              quantity: 1,
              isPacked: false,
              isEssential: true
            },
            {
              id: 'i8',
              name: 'Laptop',
              category: 'electronics',
              quantity: 1,
              isPacked: true,
              isEssential: true
            },
            {
              id: 'i9',
              name: 'Business cards',
              category: 'documents',
              quantity: 50,
              isPacked: false,
              isEssential: true
            },
            {
              id: 'i10',
              name: 'Travel adapter',
              category: 'electronics',
              quantity: 1,
              isPacked: false,
              isEssential: true
            }
          ],
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-02-20')
        }
      ];
      
      setPackingLists(mockPackingLists);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching packing lists:', error);
      setIsLoading(false);
    }
  };

  const fetchWeatherForecast = async (destination: string) => {
    try {
      // In a real app, this would be an API call to a weather service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock weather forecast for the next 7 days
      const forecast: WeatherForecast[] = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i);
        const isHot = destination.includes('Cancun') || destination.includes('Beach');
        const isCold = destination.includes('Mountain') || destination.includes('Alps');
        const isRainy = destination.includes('Tokyo') || destination.includes('London');
        
        let condition = 'sunny';
        let icon = 'sun';
        let minTemp = 20;
        let maxTemp = 30;
        let precipitation = 0;
        let humidity = 50;
        
        if (isHot) {
          minTemp = 25;
          maxTemp = 35;
          humidity = 70;
        } else if (isCold) {
          condition = 'cold';
          icon = 'cloud-snow';
          minTemp = -5;
          maxTemp = 5;
          humidity = 40;
        } else if (isRainy) {
          condition = i % 2 === 0 ? 'rainy' : 'cloudy';
          icon = i % 2 === 0 ? 'cloud-rain' : 'cloud';
          minTemp = 15;
          maxTemp = 22;
          precipitation = i % 2 === 0 ? 80 : 20;
          humidity = 85;
        }
        
        return {
          date,
          condition,
          temperature: {
            min: minTemp,
            max: maxTemp
          },
          precipitation,
          humidity,
          icon
        };
      });
      
      setWeatherForecast(forecast);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
    }
  };

  const createPackingList = () => {
    if (!newList.name || !newList.destination) return;
    
    const packingList: PackingList = {
      id: uuidv4(),
      name: newList.name!,
      destination: newList.destination!,
      startDate: newList.startDate!,
      endDate: newList.endDate!,
      travelers: newList.travelers!,
      weatherConditions: newList.weatherConditions || [],
      activities: newList.activities || [],
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setPackingLists([...packingLists, packingList]);
    setSelectedList(packingList);
    setShowCreateListModal(false);
    
    // Reset form
    setNewList({
      name: '',
      destination: '',
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      travelers: {
        adults: 1,
        children: 0
      },
      weatherConditions: [],
      activities: []
    });
    
    // Generate AI recommendations
    optimizePackingList(packingList);
  };

  const optimizePackingList = async (list: PackingList) => {
    setIsOptimizing(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and generate mock recommendations
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const tripDuration = Math.ceil((list.endDate.getTime() - list.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalTravelers = list.travelers.adults + list.travelers.children;
      
      // Generate recommendations based on destination, weather, activities, etc.
      const recommendedItems: PackingItem[] = [];
      
      // Clothing items
      if (list.weatherConditions.includes('hot') || list.weatherConditions.includes('sunny')) {
        recommendedItems.push(
          {
            id: uuidv4(),
            name: 'T-shirts',
            category: 'clothing',
            quantity: tripDuration + 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Shorts',
            category: 'clothing',
            quantity: Math.ceil(tripDuration / 2),
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Sunglasses',
            category: 'accessories',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Sun hat',
            category: 'accessories',
            quantity: 1,
            isPacked: false,
            isEssential: false
          }
        );
      }
      
      if (list.weatherConditions.includes('cold') || list.weatherConditions.includes('snowy')) {
        recommendedItems.push(
          {
            id: uuidv4(),
            name: 'Sweaters',
            category: 'clothing',
            quantity: Math.ceil(tripDuration / 2),
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Thermal underwear',
            category: 'clothing',
            quantity: 2,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Winter jacket',
            category: 'clothing',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Gloves',
            category: 'accessories',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Scarf',
            category: 'accessories',
            quantity: 1,
            isPacked: false,
            isEssential: false
          }
        );
      }
      
      if (list.weatherConditions.includes('rainy')) {
        recommendedItems.push(
          {
            id: uuidv4(),
            name: 'Rain jacket',
            category: 'clothing',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Umbrella',
            category: 'accessories',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Waterproof shoes',
            category: 'clothing',
            quantity: 1,
            isPacked: false,
            isEssential: true
          }
        );
      }
      
      // Activity-based items
      if (list.activities.includes('beach') || list.activities.includes('swimming')) {
        recommendedItems.push(
          {
            id: uuidv4(),
            name: 'Swimwear',
            category: 'clothing',
            quantity: 2,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Beach towel',
            category: 'accessories',
            quantity: totalTravelers,
            isPacked: false,
            isEssential: false
          },
          {
            id: uuidv4(),
            name: 'Sunscreen',
            category: 'toiletries',
            quantity: 1,
            isPacked: false,
            isEssential: true,
            notes: 'SPF 30+ waterproof'
          }
        );
      }
      
      if (list.activities.includes('hiking') || list.activities.includes('outdoor')) {
        recommendedItems.push(
          {
            id: uuidv4(),
            name: 'Hiking boots',
            category: 'clothing',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Backpack',
            category: 'accessories',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Water bottle',
            category: 'accessories',
            quantity: totalTravelers,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Insect repellent',
            category: 'toiletries',
            quantity: 1,
            isPacked: false,
            isEssential: true
          }
        );
      }
      
      if (list.activities.includes('business') || list.activities.includes('meetings')) {
        recommendedItems.push(
          {
            id: uuidv4(),
            name: 'Business attire',
            category: 'clothing',
            quantity: Math.min(tripDuration, 5),
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Dress shoes',
            category: 'clothing',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Laptop',
            category: 'electronics',
            quantity: 1,
            isPacked: false,
            isEssential: true
          },
          {
            id: uuidv4(),
            name: 'Business cards',
            category: 'documents',
            quantity: 20,
            isPacked: false,
            isEssential: false
          }
        );
      }
      
      // Essential items for all trips
      recommendedItems.push(
        {
          id: uuidv4(),
          name: 'Underwear',
          category: 'clothing',
          quantity: tripDuration + 2,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Socks',
          category: 'clothing',
          quantity: tripDuration + 2,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Toothbrush',
          category: 'toiletries',
          quantity: totalTravelers,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Toothpaste',
          category: 'toiletries',
          quantity: 1,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Deodorant',
          category: 'toiletries',
          quantity: totalTravelers,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Phone charger',
          category: 'electronics',
          quantity: totalTravelers,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Passport',
          category: 'documents',
          quantity: totalTravelers,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Credit cards',
          category: 'documents',
          quantity: 1,
          isPacked: false,
          isEssential: true
        },
        {
          id: uuidv4(),
          name: 'Basic medications',
          category: 'medical',
          quantity: 1,
          isPacked: false,
          isEssential: true,
          notes: 'Pain relievers, antacids, band-aids'
        }
      );
      
      // Update the list with recommended items
      const updatedList = {
        ...list,
        items: recommendedItems,
        updatedAt: new Date()
      };
      
      setPackingLists(packingLists.map(l => l.id === list.id ? updatedList : l));
      setSelectedList(updatedList);
    } catch (error) {
      console.error('Error optimizing packing list:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const addItemToList = () => {
    if (!newItem.name || !selectedList) return;
    
    const item: PackingItem = {
      id: uuidv4(),
      name: newItem.name,
      category: newItem.category as 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'accessories' | 'medical' | 'other',
      quantity: newItem.quantity || 1,
      isPacked: false,
      isEssential: newItem.isEssential || false,
      notes: newItem.notes,
      weight: newItem.weight
    };
    
    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, item],
      updatedAt: new Date()
    };
    
    setPackingLists(packingLists.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);
    
    // Reset form
    setNewItem({
      name: '',
      category: 'clothing',
      quantity: 1,
      isPacked: false,
      isEssential: false
    });
    
    setShowAddItemModal(false);
  };

  const updateItem = () => {
    if (!editingItem || !selectedList) return;
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.map(item => 
        item.id === editingItem.id ? { ...item, ...newItem } as PackingItem : item
      ),
      updatedAt: new Date()
    };
    
    setPackingLists(packingLists.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);
    
    // Reset form
    setNewItem({
      name: '',
      category: 'clothing',
      quantity: 1,
      isPacked: false,
      isEssential: false
    });
    
    setEditingItem(null);
    setShowAddItemModal(false);
  };

  const deleteItem = (itemId: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter(item => item.id !== itemId),
      updatedAt: new Date()
    };
    
    setPackingLists(packingLists.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);
  };

  const toggleItemPacked = (itemId: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.map(item => 
        item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
      ),
      updatedAt: new Date()
    };
    
    setPackingLists(packingLists.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);
  };

  const addActivity = () => {
    if (!newActivity.trim() || !selectedList) return;
    
    const updatedList = {
      ...selectedList,
      activities: [...selectedList.activities, newActivity.trim()],
      updatedAt: new Date()
    };
    
    setPackingLists(packingLists.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);
    setNewActivity('');
    
    // Re-optimize the list with the new activity
    optimizePackingList(updatedList);
  };

  const removeActivity = (activity: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      activities: selectedList.activities.filter(a => a !== activity),
      updatedAt: new Date()
    };
    
    setPackingLists(packingLists.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);
  };

  const deleteList = (listId: string) => {
    setPackingLists(packingLists.filter(list => list.id !== listId));
    if (selectedList && selectedList.id === listId) {
      setSelectedList(null);
    }
  };

  const exportPackingList = () => {
    if (!selectedList) return;
    
    const content = `
      PACKING LIST: ${selectedList.name}
      Destination: ${selectedList.destination}
      Dates: ${format(selectedList.startDate, 'MMM d, yyyy')} - ${format(selectedList.endDate, 'MMM d, yyyy')}
      Travelers: ${selectedList.travelers.adults} adults, ${selectedList.travelers.children} children
      
      ITEMS:
      ${selectedList.items.map(item => 
        `[${item.isPacked ? 'X' : ' '}] ${item.quantity}x ${item.name}${item.isEssential ? ' (Essential)' : ''}${item.notes ? ` - ${item.notes}` : ''}`
      ).join('\n')}
      
      Weather Conditions: ${selectedList.weatherConditions.join(', ')}
      Activities: ${selectedList.activities.join(', ')}
      
      Generated by AI Packing Optimizer
      Last updated: ${format(selectedList.updatedAt, 'MMMM d, yyyy h:mm a')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packing-list-${selectedList.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string, size = 20) => {
    switch (category) {
      case 'clothing':
        return <Shirt size={size} />;
      case 'toiletries':
        return <Droplets size={size} />;
      case 'electronics':
        return <Smartphone size={size} />;
      case 'documents':
        return <FileText size={size} />;
      case 'accessories':
        return <Footprints size={size} />;
      case 'medical':
        return <Briefcase size={size} />;
      default:
        return <Package size={size} />;
    }
  };

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={size} className="text-yellow-500" />;
      case 'cloudy':
        return <Cloud size={size} className="text-gray-500" />;
      case 'rainy':
        return <Umbrella size={size} className="text-blue-500" />;
      case 'snowy':
        return <Snowflake size={size} className="text-blue-300" />;
      case 'windy':
        return <Wind size={size} className="text-blue-400" />;
      default:
        return <Sun size={size} className="text-yellow-500" />;
    }
  };

  const getFilteredItems = () => {
    if (!selectedList) return [];
    
    let filtered = [...selectedList.items];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        statusFilter === 'packed' ? item.isPacked : !item.isPacked
      );
    }
    
    return filtered;
  };

  const getPackingProgress = () => {
    if (!selectedList || selectedList.items.length === 0) return 0;
    
    const packedItems = selectedList.items.filter(item => item.isPacked).length;
    return Math.round((packedItems / selectedList.items.length) * 100);
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
              <h1 className="text-3xl font-bold mb-2">AI Packing Optimizer</h1>
              <p className="text-gray-600">Never forget essential items with AI-powered packing recommendations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateListModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Create Packing List</span>
            </motion.button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Packing Lists Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Packing Lists</h2>
                  
                  {packingLists.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto mb-4 text-gray-300" size={48} />
                      <p className="text-gray-500 mb-4">No packing lists yet</p>
                      <button
                        onClick={() => setShowCreateListModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Your First List
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {packingLists.map((list) => (
                        <motion.div
                          key={list.id}
                          variants={itemVariants}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedList?.id === list.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedList(list)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{list.name}</h3>
                              <p className="text-sm text-gray-500">{list.destination}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Calendar size={12} />
                                <span>{format(list.startDate, 'MMM d')}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-xs text-gray-500">
                                {list.items.filter(item => item.isPacked).length}/{list.items.length}
                              </div>
                              <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{
                                    width: `${list.items.length > 0
                                      ? (list.items.filter(item => item.isPacked).length / list.items.length) * 100
                                      : 0}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected List Details */}
              <div className="md:col-span-3">
                {!selectedList ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Package className="mx-auto mb-4 text-gray-300" size={64} />
                    <h2 className="text-xl font-semibold mb-2">No Packing List Selected</h2>
                    <p className="text-gray-500 mb-6">Select a list from the sidebar or create a new one</p>
                    <button
                      onClick={() => setShowCreateListModal(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create New List
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* List Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{selectedList.name}</h2>
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>{selectedList.destination}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>
                                {format(selectedList.startDate, 'MMM d')} - {format(selectedList.endDate, 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              <span>
                                {selectedList.travelers.adults + selectedList.travelers.children} travelers
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => optimizePackingList(selectedList)}
                            disabled={isOptimizing}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {isOptimizing ? (
                              <>
                                <Loader className="animate-spin" size={18} />
                                <span>Optimizing...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={18} />
                                <span>AI Optimize</span>
                              </>
                            )}
                          </motion.button>
                          <div className="flex items-center">
                            <button
                              onClick={exportPackingList}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                              title="Export List"
                            >
                              <Download size={20} />
                            </button>
                            <button
                              onClick={() => {}}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                              title="Share List"
                            >
                              <Share2 size={20} />
                            </button>
                            <button
                              onClick={() => deleteList(selectedList.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete List"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Packing Progress</span>
                          <span className="text-sm font-medium">
                            {selectedList.items.filter(item => item.isPacked).length}/{selectedList.items.length} items packed
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${getPackingProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Weather and Trip Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Weather Forecast */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Weather Forecast</h3>
                        <div className="flex overflow-x-auto pb-2 space-x-4">
                          {weatherForecast.map((day, index) => (
                            <div key={index} className="flex-shrink-0 text-center">
                              <p className="text-sm text-gray-500">{format(day.date, 'EEE')}</p>
                              <div className="my-2">
                                {getWeatherIcon(day.condition)}
                              </div>
                              <p className="font-medium">{day.temperature.max}°C</p>
                              <p className="text-xs text-gray-500">{day.temperature.min}°C</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Packing Recommendations</h4>
                          <ul className="space-y-1 text-sm">
                            {selectedList.weatherConditions.includes('hot') && (
                              <li className="flex items-center gap-2">
                                <Sun size={16} className="text-yellow-500" />
                                <span>Pack lightweight, breathable clothing</span>
                              </li>
                            )}
                            {selectedList.weatherConditions.includes('rainy') && (
                              <li className="flex items-center gap-2">
                                <Umbrella size={16} className="text-blue-500" />
                                <span>Don't forget waterproof gear</span>
                              </li>
                            )}
                            {selectedList.weatherConditions.includes('cold') && (
                              <li className="flex items-center gap-2">
                                <Thermometer size={16} className="text-blue-300" />
                                <span>Pack warm layers and a good jacket</span>
                              </li>
                            )}
                            {selectedList.weatherConditions.includes('windy') && (
                              <li className="flex items-center gap-2">
                                <Wind size={16} className="text-blue-400" />
                                <span>Bring a windbreaker and secure hat</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Activities */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Planned Activities</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedList.activities.map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                            >
                              <span>{activity}</span>
                              <button
                                onClick={() => removeActivity(activity)}
                                className="hover:text-blue-800"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          {selectedList.activities.length === 0 && (
                            <p className="text-gray-500 text-sm">No activities added yet</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newActivity}
                            onChange={(e) => setNewActivity(e.target.value)}
                            placeholder="Add an activity..."
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addActivity();
                              }
                            }}
                          />
                          <button
                            onClick={addActivity}
                            disabled={!newActivity.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            Add
                          </button>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Activity-Based Recommendations</h4>
                          <ul className="space-y-1 text-sm">
                            {selectedList.activities.includes('beach') && (
                              <li className="flex items-center gap-2">
                                <Umbrella size={16} className="text-yellow-500" />
                                <span>Beach essentials: swimwear, towels, sunscreen</span>
                              </li>
                            )}
                            {selectedList.activities.includes('hiking') && (
                              <li className="flex items-center gap-2">
                                <Mountain size={16} className="text-green-500" />
                                <span>Hiking gear: boots, backpack, water bottle</span>
                              </li>
                            )}
                            {selectedList.activities.includes('business') && (
                              <li className="flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-500" />
                                <span>Business attire, laptop, presentation materials</span>
                              </li>
                            )}
                            {selectedList.activities.includes('dining') && (
                              <li className="flex items-center gap-2">
                                <Utensils size={16} className="text-purple-500" />
                                <span>Smart casual outfits for dining experiences</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Packing Items */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Packing Items</h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingItem(null);
                            setNewItem({
                              name: '',
                              category: 'clothing',
                              quantity: 1,
                              isPacked: false,
                              isEssential: false
                            });
                            setShowAddItemModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus size={18} />
                          <span>Add Item</span>
                        </motion.button>
                      </div>
                      
                      {/* Filters */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Categories</option>
                          <option value="clothing">Clothing</option>
                          <option value="toiletries">Toiletries</option>
                          <option value="electronics">Electronics</option>
                          <option value="documents">Documents</option>
                          <option value="accessories">Accessories</option>
                          <option value="medical">Medical</option>
                          <option value="other">Other</option>
                        </select>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Items</option>
                          <option value="packed">Packed</option>
                          <option value="unpacked">Not Packed</option>
                        </select>
                      </div>
                      
                      {selectedList.items.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <Package className="mx-auto mb-4 text-gray-300" size={48} />
                          <h4 className="text-xl font-semibold mb-2">No items in your packing list</h4>
                          <p className="text-gray-500 mb-6">Add items manually or use AI to generate recommendations</p>
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => {
                                setEditingItem(null);
                                setNewItem({
                                  name: '',
                                  category: 'clothing',
                                  quantity: 1,
                                  isPacked: false,
                                  isEssential: false
                                });
                                setShowAddItemModal(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add Item
                            </button>
                            <button
                              onClick={() => optimizePackingList(selectedList)}
                              disabled={isOptimizing}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                              {isOptimizing ? 'Optimizing...' : 'AI Recommendations'}
                            </button>
                          </div>
                        </div>
                      ) : filteredItems.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <Filter className="mx-auto mb-4 text-gray-300" size={48} />
                          <h4 className="text-lg font-semibold mb-2">No items match your filters</h4>
                          <p className="text-gray-500">Try adjusting your category or status filters</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredItems.map((item) => (
                            <motion.div
                              key={item.id}
                              variants={itemVariants}
                              className={`p-4 rounded-lg border ${
                                item.isPacked ? 'bg-green-50 border-green-200' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleItemPacked(item.id)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      item.isPacked
                                        ? 'bg-green-500 text-white'
                                        : 'border border-gray-300'
                                    }`}
                                  >
                                    {item.isPacked && <Check size={14} />}
                                  </button>
                                  <div className={`p-2 rounded-lg ${
                                    item.isPacked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {getCategoryIcon(item.category)}
                                  </div>
                                  <div>
                                    <h4 className={`font-medium ${item.isPacked ? 'line-through text-gray-400' : ''}`}>
                                      {item.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-gray-500">Qty: {item.quantity}</span>
                                      {item.isEssential && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                                          Essential
                                        </span>
                                      )}
                                      {item.notes && (
                                        <span className="text-gray-500 italic">{item.notes}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingItem(item);
                                      setNewItem({
                                        name: item.name,
                                        category: item.category,
                                        quantity: item.quantity,
                                        isPacked: item.isPacked,
                                        isEssential: item.isEssential,
                                        notes: item.notes,
                                        weight: item.weight
                                      });
                                      setShowAddItemModal(true);
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create List Modal */}
      <AnimatePresence>
        {showCreateListModal && (
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
                <h3 className="text-xl font-bold">Create New Packing List</h3>
                <button
                  onClick={() => setShowCreateListModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={newList.name || ''}
                    onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                    placeholder="e.g., Summer Vacation 2024"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={newList.destination || ''}
                    onChange={(e) => setNewList({ ...newList, destination: e.target.value })}
                    placeholder="e.g., Paris, France"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newList.startDate ? format(newList.startDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setNewList({
                        ...newList,
                        startDate: new Date(e.target.value)
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newList.endDate ? format(newList.endDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setNewList({
                        ...newList,
                        endDate: new Date(e.target.value)
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adults
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newList.travelers?.adults || 1}
                      onChange={(e) => setNewList({
                        ...newList,
                        travelers: {
                          ...newList.travelers!,
                          adults: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Children
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newList.travelers?.children || 0}
                      onChange={(e) => setNewList({
                        ...newList,
                        travelers: {
                          ...newList.travelers!,
                          children: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weather Conditions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['sunny', 'rainy', 'cold', 'hot', 'windy', 'humid', 'snowy'].map((condition) => (
                      <label key={condition} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(newList.weatherConditions || []).includes(condition)}
                          onChange={(e) => {
                            const weatherConditions = newList.weatherConditions || [];
                            if (e.target.checked) {
                              setNewList({
                                ...newList,
                                weatherConditions: [...weatherConditions, condition]
                              });
                            } else {
                              setNewList({
                                ...newList,
                                weatherConditions: weatherConditions.filter(c => c !== condition)
                              });
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['beach', 'hiking', 'business', 'sightseeing', 'swimming', 'skiing', 'dining'].map((activity) => (
                      <label key={activity} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(newList.activities || []).includes(activity)}
                          onChange={(e) => {
                            const activities = newList.activities || [];
                            if (e.target.checked) {
                              setNewList({
                                ...newList,
                                activities: [...activities, activity]
                              });
                            } else {
                              setNewList({
                                ...newList,
                                activities: activities.filter(a => a !== activity)
                              });
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize">{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateListModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createPackingList}
                    disabled={!newList.name || !newList.destination}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles size={20} />
                    <span>Create & Optimize</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingItem ? 'Edit Item' : 'Add Item'}
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
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., T-shirts"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newItem.category || 'clothing'}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        category: e.target.value as any
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="clothing">Clothing</option>
                      <option value="toiletries">Toiletries</option>
                      <option value="electronics">Electronics</option>
                      <option value="documents">Documents</option>
                      <option value="accessories">Accessories</option>
                      <option value="medical">Medical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity || 1}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        quantity: parseInt(e.target.value)
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={newItem.notes || ''}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="e.g., SPF 50+, waterproof"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (g, Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.weight || ''}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        weight: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                      placeholder="Weight in grams"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newItem.isEssential || false}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          isEssential: e.target.checked
                        })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Mark as essential item</span>
                    </label>
                  </div>
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
                    onClick={editingItem ? updateItem : addItemToList}
                    disabled={!newItem.name}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiPackingOptimizer;