import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader, Filter, SlidersHorizontal, ArrowRight, Check } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  type: 'destination' | 'activity' | 'hotel' | 'restaurant';
}

const SearchResults: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Mock categories for filtering
  const categories = [
    'Destinations',
    'Activities',
    'Hotels',
    'Restaurants',
    'Transportation',
    'Tours'
  ];

  // Simulate search with progress
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setProgress(0);
    setResults([]);

    // Simulate API call with progress updates
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Paris City Tour',
        description: 'Explore the romantic streets of Paris with a local guide.',
        category: 'Tours',
        confidence: 0.95,
        type: 'activity'
      },
      {
        id: '2',
        title: 'Eiffel Tower',
        description: 'The iconic symbol of Paris, offering breathtaking city views.',
        category: 'Destinations',
        confidence: 0.98,
        type: 'destination'
      },
      // Add more mock results...
    ];

    setResults(mockResults);
    setIsSearching(false);
  };

  const toggleFilter = (category: string) => {
    setSelectedFilters(prev => 
      prev.includes(category)
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
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

  const progressBarVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Search Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch(query)}
                placeholder="Search for destinations, activities, or hotels..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => performSearch(query)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Search size={16} />
                <span>Search</span>
              </motion.button>
            </div>

            {/* Progress Bar */}
            {isSearching && (
              <div className="mt-4">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    variants={progressBarVariants}
                    initial="initial"
                    animate="animate"
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-white/70 text-sm">
                  <span>Searching...</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <SlidersHorizontal size={20} className="text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFilter(category)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                    selectedFilters.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedFilters.includes(category) && <Check size={16} />}
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
          >
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <AnimatePresence>
                {results.map((result) => (
                  <motion.div
                    key={result.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                        <p className="text-gray-600 mb-4">{result.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                            {result.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            Confidence: {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {!isSearching && results.length === 0 && query && (
              <div className="text-center py-12">
                <Search className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No results found for "{query}"</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResults;