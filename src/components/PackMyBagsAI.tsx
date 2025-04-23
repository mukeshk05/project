import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Sun, Umbrella, ThermometerSun, Calendar, MapPin, Plus, Check, X, Download, Share2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface PackingList {
  category: string;
  items: {
    name: string;
    quantity: number;
    checked: boolean;
    essential: boolean;
  }[];
}

const PackMyBagsAI: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [activities, setActivities] = useState<string[]>([]);
  const [packingList, setPackingList] = useState<PackingList[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<any>(null);

  const activityOptions = [
    { id: 'beach', label: 'Beach', icon: Sun },
    { id: 'hiking', label: 'Hiking', icon: Mountain },
    { id: 'skiing', label: 'Skiing', icon: Snowflake },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'sightseeing', label: 'Sightseeing', icon: Camera },
    { id: 'swimming', label: 'Swimming', icon: Swim }
  ];

  const generatePackingList = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/travel/packing-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          destination,
          dates,
          activities
        }),
      });

      if (!response.ok) throw new Error('Failed to generate packing list');

      const data = await response.json();
      setPackingList(data.packingList);
      setWeatherInfo(data.weather);
    } catch (error) {
      console.error('Error generating packing list:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    setPackingList(prev => {
      const newList = [...prev];
      newList[categoryIndex].items[itemIndex].checked = 
        !newList[categoryIndex].items[itemIndex].checked;
      return newList;
    });
  };

  const exportList = () => {
    const content = packingList
      .map(category => `
${category.category}:
${category.items.map(item => `- ${item.name} (${item.quantity})`).join('\n')}
      `).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packing-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold">Pack My Bags AI</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dates
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                <DatePicker
                  selectsRange
                  startDate={dates.start}
                  endDate={dates.end}
                  onChange={(update) => setDates({
                    start: update[0],
                    end: update[1]
                  })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select dates"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Activities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activityOptions.map((activity) => (
                <motion.button
                  key={activity.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActivities(prev =>
                    prev.includes(activity.id)
                      ? prev.filter(a => a !== activity.id)
                      : [...prev, activity.id]
                  )}
                  className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                    activities.includes(activity.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <activity.icon
                    size={24}
                    className={activities.includes(activity.id) ? 'text-blue-500' : 'text-gray-400'}
                  />
                  <span>{activity.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePackingList}
            disabled={!destination || !dates.start || !dates.end || activities.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Generating List...</span>
              </>
            ) : (
              <>
                <Briefcase size={20} />
                <span>Generate Packing List</span>
              </>
            )}
          </motion.button>

          {weatherInfo && (
            <motion.div
              variants={itemVariants}
              className="mt-8 p-6 bg-blue-50 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4">Weather Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="text-orange-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-medium">{weatherInfo.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Umbrella className="text-blue-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Precipitation</p>
                    <p className="font-medium">{weatherInfo.precipitation}%</p>
                  </div>
                </div>
                {/* Add more weather info */}
              </div>
            </motion.div>
          )}

          {packingList.length > 0 && (
            <motion.div
              variants={containerVariants}
              className="mt-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Your Packing List</h3>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportList}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Download size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-6">
                {packingList.map((category, categoryIndex) => (
                  <motion.div
                    key={categoryIndex}
                    variants={itemVariants}
                    className="border rounded-lg p-4"
                  >
                    <h4 className="font-medium mb-4">{category.category}</h4>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          className="flex items-center gap-4"
                        >
                          <button
                            onClick={() => toggleItem(categoryIndex, itemIndex)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              item.checked
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {item.checked && <Check className="text-white" size={14} />}
                          </button>
                          <span className={item.checked ? 'line-through text-gray-400' : ''}>
                            {item.name} ({item.quantity})
                          </span>
                          {item.essential && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                              Essential
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PackMyBagsAI;