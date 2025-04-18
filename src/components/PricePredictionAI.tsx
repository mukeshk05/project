import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Calendar, MapPin, Plane, Hotel, Car,
  DollarSign, ArrowRight, ArrowDown, Search, Loader,
  Filter, Clock, AlertCircle, ChevronDown, ChevronUp,
  Download, Share2, Zap, BarChart, LineChart, PieChart,
  Check, X, Info, Users, CreditCard
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, addMonths, subDays } from 'date-fns';

interface PricePrediction {
  currentPrice: number;
  predictedPrice: {
    min: number;
    max: number;
    expected: number;
  };
  priceDirection: 'up' | 'down' | 'stable';
  confidence: number;
  bestTimeToBook: {
    timeframe: string;
    estimatedSavings: number;
  };
  priceFactors: {
    factor: string;
    impact: number;
    direction: 'positive' | 'negative';
  }[];
  historicalTrend: {
    date: string;
    price: number;
  }[];
  seasonalPatterns: {
    season: string;
    trend: string;
    priceChange: number;
  }[];
  recommendations: string[];
}

interface SearchParams {
  type: 'flight' | 'hotel' | 'car';
  origin?: string;
  destination: string;
  departDate: Date | null;
  returnDate: Date | null;
  travelers: number;
  class?: 'economy' | 'business' | 'first';
  flexibility: number;
}

const PricePredictionAI: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    type: 'flight',
    origin: '',
    destination: '',
    departDate: addDays(new Date(), 30),
    returnDate: addDays(new Date(), 37),
    travelers: 1,
    class: 'economy',
    flexibility: 3
  });
  
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [showSeasonalPatterns, setShowSeasonalPatterns] = useState(false);
  const [showPriceFactors, setShowPriceFactors] = useState(false);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [savedSearches, setSavedSearches] = useState<{id: string; params: SearchParams; date: Date}[]>([]);

  useEffect(() => {
    // Load saved searches
    const loadSavedSearches = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockSavedSearches = [
          {
            id: '1',
            params: {
              type: 'flight',
              origin: 'New York',
              destination: 'London',
              departDate: addDays(new Date(), 45),
              returnDate: addDays(new Date(), 52),
              travelers: 2,
              class: 'economy' as const,
              flexibility: 3
            },
            date: subDays(new Date(), 5)
          },
          {
            id: '2',
            params: {
              type: 'hotel',
              destination: 'Paris',
              departDate: addDays(new Date(), 60),
              returnDate: addDays(new Date(), 67),
              travelers: 2,
              flexibility: 2
            },
            date: subDays(new Date(), 2)
          }
        ];
        
        setSavedSearches(mockSavedSearches);
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    };
    
    loadSavedSearches();
  }, []);

  const getPrediction = async () => {
    if (!searchParams.destination || !searchParams.departDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (searchParams.type === 'flight' && !searchParams.origin) {
      setError('Please enter an origin for flight search');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate mock prediction data
      const mockPrediction: PricePrediction = {
        currentPrice: searchParams.type === 'flight' ? 750 : searchParams.type === 'hotel' ? 220 : 45,
        predictedPrice: {
          min: searchParams.type === 'flight' ? 680 : searchParams.type === 'hotel' ? 195 : 40,
          max: searchParams.type === 'flight' ? 820 : searchParams.type === 'hotel' ? 250 : 55,
          expected: searchParams.type === 'flight' ? 720 : searchParams.type === 'hotel' ? 210 : 42
        },
        priceDirection: Math.random() > 0.6 ? 'down' : Math.random() > 0.5 ? 'up' : 'stable',
        confidence: 0.85,
        bestTimeToBook: {
          timeframe: '2-3 weeks before departure',
          estimatedSavings: searchParams.type === 'flight' ? 80 : searchParams.type === 'hotel' ? 30 : 8
        },
        priceFactors: [
          {
            factor: 'Seasonal Demand',
            impact: 0.4,
            direction: 'positive'
          },
          {
            factor: 'Fuel Prices',
            impact: 0.2,
            direction: 'negative'
          },
          {
            factor: 'Competitor Pricing',
            impact: 0.3,
            direction: 'negative'
          },
          {
            factor: 'Historical Trends',
            impact: 0.1,
            direction: 'positive'
          }
        ],
        historicalTrend: Array.from({ length: 30 }, (_, i) => ({
          date: format(subDays(new Date(), 30 - i), 'yyyy-MM-dd'),
          price: searchParams.type === 'flight' 
            ? 750 + Math.round(Math.sin(i / 5) * 50 + (Math.random() - 0.5) * 30)
            : searchParams.type === 'hotel'
            ? 220 + Math.round(Math.sin(i / 4) * 20 + (Math.random() - 0.5) * 15)
            : 45 + Math.round(Math.sin(i / 3) * 5 + (Math.random() - 0.5) * 3)
        })),
        seasonalPatterns: [
          {
            season: 'Summer',
            trend: 'Peak prices due to high demand',
            priceChange: 15
          },
          {
            season: 'Fall',
            trend: 'Prices begin to decrease',
            priceChange: -8
          },
          {
            season: 'Winter',
            trend: 'Holiday surge followed by January dip',
            priceChange: 5
          },
          {
            season: 'Spring',
            trend: 'Gradual increase as summer approaches',
            priceChange: 10
          }
        ],
        recommendations: [
          `Book your ${searchParams.type} in the next 2-3 weeks for the best price`,
          `Consider ${searchParams.type === 'flight' ? 'flying on Tuesday or Wednesday' : searchParams.type === 'hotel' ? 'staying midweek' : 'renting midweek'} for lower rates`,
          `${searchParams.flexibility > 0 ? `Being flexible by ${searchParams.flexibility} days could save you up to ${searchParams.type === 'flight' ? '$120' : searchParams.type === 'hotel' ? '$45' : '$12'}` : 'Adding some date flexibility could lead to significant savings'}`,
          `Set a price alert to be notified when prices drop below ${searchParams.type === 'flight' ? '$700' : searchParams.type === 'hotel' ? '$200' : '$40'}`
        ]
      };
      
      // Adjust prediction based on search parameters
      if (searchParams.type === 'flight') {
        // Adjust for class
        if (searchParams.class === 'business') {
          mockPrediction.currentPrice *= 3.5;
          mockPrediction.predictedPrice.min *= 3.5;
          mockPrediction.predictedPrice.max *= 3.5;
          mockPrediction.predictedPrice.expected *= 3.5;
          mockPrediction.bestTimeToBook.estimatedSavings *= 3;
        } else if (searchParams.class === 'first') {
          mockPrediction.currentPrice *= 6;
          mockPrediction.predictedPrice.min *= 6;
          mockPrediction.predictedPrice.max *= 6;
          mockPrediction.predictedPrice.expected *= 6;
          mockPrediction.bestTimeToBook.estimatedSavings *= 5;
        }
        
        // Adjust for travelers
        if (searchParams.travelers > 1) {
          mockPrediction.currentPrice *= searchParams.travelers;
          mockPrediction.predictedPrice.min *= searchParams.travelers;
          mockPrediction.predictedPrice.max *= searchParams.travelers;
          mockPrediction.predictedPrice.expected *= searchParams.travelers;
          mockPrediction.bestTimeToBook.estimatedSavings *= searchParams.travelers;
        }
      } else if (searchParams.type === 'hotel') {
        // Adjust for duration
        if (searchParams.returnDate && searchParams.departDate) {
          const days = Math.round((searchParams.returnDate.getTime() - searchParams.departDate.getTime()) / (1000 * 60 * 60 * 24));
          mockPrediction.currentPrice *= days;
          mockPrediction.predictedPrice.min *= days;
          mockPrediction.predictedPrice.max *= days;
          mockPrediction.predictedPrice.expected *= days;
          mockPrediction.bestTimeToBook.estimatedSavings *= days;
        }
      }
      
      // Round all prices to whole numbers
      mockPrediction.currentPrice = Math.round(mockPrediction.currentPrice);
      mockPrediction.predictedPrice.min = Math.round(mockPrediction.predictedPrice.min);
      mockPrediction.predictedPrice.max = Math.round(mockPrediction.predictedPrice.max);
      mockPrediction.predictedPrice.expected = Math.round(mockPrediction.predictedPrice.expected);
      mockPrediction.bestTimeToBook.estimatedSavings = Math.round(mockPrediction.bestTimeToBook.estimatedSavings);
      
      // Update historical trend prices based on adjusted current price
      mockPrediction.historicalTrend = mockPrediction.historicalTrend.map((point, i) => ({
        ...point,
        price: Math.round(mockPrediction.currentPrice + Math.sin(i / 5) * (mockPrediction.currentPrice * 0.07) + (Math.random() - 0.5) * (mockPrediction.currentPrice * 0.04))
      }));
      
      setPrediction(mockPrediction);
      setAlertPrice(mockPrediction.predictedPrice.min);
      
      // Save search
      const newSearch = {
        id: Date.now().toString(),
        params: { ...searchParams },
        date: new Date()
      };
      setSavedSearches([newSearch, ...savedSearches]);
    } catch (error) {
      console.error('Error getting prediction:', error);
      setError('Failed to get price prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const enablePriceAlert = () => {
    if (!alertPrice || !prediction) return;
    
    // In a real app, this would call an API to set up the alert
    setAlertEnabled(true);
    
    // Show confirmation
    alert(`Price alert set! We'll notify you when prices drop below $${alertPrice}.`);
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

  const renderSearchForm = () => (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        {['flight', 'hotel', 'car'].map((type) => (
          <button
            key={type}
            onClick={() => setSearchParams({ ...searchParams, type: type as any })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              searchParams.type === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'flight' ? <Plane size={20} /> : 
             type === 'hotel' ? <Hotel size={20} /> : 
             <Car size={20} />}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {searchParams.type === 'flight' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchParams.origin}
                onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                placeholder="City or airport"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {searchParams.type === 'flight' ? 'Destination' : searchParams.type === 'hotel' ? 'City' : 'Pickup Location'}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              placeholder={searchParams.type === 'flight' ? 'City or airport' : searchParams.type === 'hotel' ? 'City or specific area' : 'City or specific location'}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {searchParams.type === 'flight' ? 'Departure Date' : searchParams.type === 'hotel' ? 'Check-in Date' : 'Pickup Date'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <DatePicker
              selected={searchParams.departDate}
              onChange={(date) => setSearchParams({ ...searchParams, departDate: date })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {searchParams.type === 'flight' ? 'Return Date' : searchParams.type === 'hotel' ? 'Check-out Date' : 'Return Date'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <DatePicker
              selected={searchParams.returnDate}
              onChange={(date) => setSearchParams({ ...searchParams, returnDate: date })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={searchParams.departDate || new Date()}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {searchParams.type === 'hotel' ? 'Guests' : 'Travelers'}
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              min={1}
              value={searchParams.travelers}
              onChange={(e) => setSearchParams({ ...searchParams, travelers: parseInt(e.target.value) })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {searchParams.type === 'flight' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <select
              value={searchParams.class}
              onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Flexibility (days)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              min={0}
              max={7}
              value={searchParams.flexibility}
              onChange={(e) => setSearchParams({ ...searchParams, flexibility: parseInt(e.target.value) })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getPrediction}
          disabled={isLoading}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-3 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin" size={24} />
              <span>Analyzing Prices...</span>
            </>
          ) : (
            <>
              <Zap size={24} />
              <span>Predict Prices</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );

  const renderPredictionResults = () => {
    if (!prediction) return null;

    const isPriceDecreasing = prediction.priceDirection === 'down';
    const isPriceIncreasing = prediction.priceDirection === 'up';
    
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <button
            onClick={() => setPrediction(null)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← Back to search
          </button>
          <div className="flex gap-2">
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download size={20} />
            </button>
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Price Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Price Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Current Price</h3>
              <div className="text-3xl font-bold text-blue-600">${prediction.currentPrice}</div>
              <p className="text-sm text-gray-500 mt-1">
                {searchParams.type === 'hotel' ? 'per night' : searchParams.type === 'car' ? 'per day' : 'per person'}
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Predicted Price</h3>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-blue-600">${prediction.predictedPrice.expected}</div>
                <div className={`flex items-center ${isPriceDecreasing ? 'text-green-600' : isPriceIncreasing ? 'text-red-600' : 'text-gray-600'}`}>
                  {isPriceDecreasing ? (
                    <ArrowDown size={20} />
                  ) : isPriceIncreasing ? (
                    <ArrowUp size={20} />
                  ) : (
                    <ArrowRight size={20} />
                  )}
                  <span className="font-medium">
                    {isPriceDecreasing 
                      ? `${Math.round((prediction.currentPrice - prediction.predictedPrice.expected) / prediction.currentPrice * 100)}%` 
                      : isPriceIncreasing 
                      ? `${Math.round((prediction.predictedPrice.expected - prediction.currentPrice) / prediction.currentPrice * 100)}%`
                      : 'Stable'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Range: ${prediction.predictedPrice.min} - ${prediction.predictedPrice.max}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Confidence Level</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {Math.round(prediction.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div 
                    style={{ width: `${prediction.confidence * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {prediction.confidence >= 0.8 
                    ? 'High confidence prediction based on strong historical data'
                    : prediction.confidence >= 0.6
                    ? 'Moderate confidence prediction'
                    : 'Lower confidence due to limited data or volatile market'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Lightbulb className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl font-bold">AI Recommendations</h2>
          </div>
          
          <div className="space-y-4">
            {prediction.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="text-green-600" size={16} />
                </div>
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Best Time to Book</h3>
                <p className="text-gray-600">{prediction.bestTimeToBook.timeframe}</p>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold">Save up to ${prediction.bestTimeToBook.estimatedSavings}</div>
                <p className="text-sm text-gray-500">Estimated savings</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Set Price Alert
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={alertPrice || ''}
                    onChange={(e) => setAlertPrice(parseInt(e.target.value))}
                    placeholder="Enter target price"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={enablePriceAlert}
                  disabled={!alertPrice || alertEnabled}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-6"
                >
                  {alertEnabled ? 'Alert Enabled' : 'Enable Alert'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Price Factors */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart className="text-blue-600" size={24} />
              </div>
              <h2 className="text-xl font-bold">Price Factors</h2>
            </div>
            <button
              onClick={() => setShowPriceFactors(!showPriceFactors)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPriceFactors ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          <AnimatePresence>
            {showPriceFactors && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  {prediction.priceFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${factor.direction === 'positive' ? 'bg-red-100' : 'bg-green-100'}`}>
                          {factor.direction === 'positive' ? (
                            <ArrowUp size={16} className="text-red-600" />
                          ) : (
                            <ArrowDown size={16} className="text-green-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{factor.factor}</h4>
                          <p className="text-sm text-gray-500">
                            {factor.direction === 'positive' 
                              ? 'Driving prices up' 
                              : 'Driving prices down'}
                          </p>
                        </div>
                      </div>
                      <div className="w-24">
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div 
                              style={{ width: `${factor.impact * 100}%` }} 
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                factor.direction === 'positive' ? 'bg-red-500' : 'bg-green-500'
                              }`}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right text-xs mt-1">
                          {Math.round(factor.impact * 100)}% impact
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Historical Data */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <LineChart className="text-purple-600" size={24} />
              </div>
              <h2 className="text-xl font-bold">Historical Price Trends</h2>
            </div>
            <button
              onClick={() => setShowHistoricalData(!showHistoricalData)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showHistoricalData ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          <AnimatePresence>
            {showHistoricalData && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="h-64 relative">
                  {/* This would be a real chart in a production app */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Historical price chart visualization</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">30-Day Price Range</h4>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Lowest</p>
                        <p className="font-semibold">${Math.min(...prediction.historicalTrend.map(p => p.price))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Highest</p>
                        <p className="font-semibold">${Math.max(...prediction.historicalTrend.map(p => p.price))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average</p>
                        <p className="font-semibold">
                          ${Math.round(prediction.historicalTrend.reduce((sum, p) => sum + p.price, 0) / prediction.historicalTrend.length)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Price Volatility</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                      <span className="text-sm">Medium</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Prices have fluctuated moderately over the past month
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Seasonal Patterns */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="text-yellow-600" size={24} />
              </div>
              <h2 className="text-xl font-bold">Seasonal Patterns</h2>
            </div>
            <button
              onClick={() => setShowSeasonalPatterns(!showSeasonalPatterns)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showSeasonalPatterns ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          <AnimatePresence>
            {showSeasonalPatterns && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      {prediction.seasonalPatterns.map((season, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-yellow-100">
                            {season.season === 'Summer' ? (
                              <Sun size={16} className="text-yellow-600" />
                            ) : season.season === 'Fall' ? (
                              <Wind size={16} className="text-orange-600" />
                            ) : season.season === 'Winter' ? (
                              <Snowflake size={16} className="text-blue-600" />
                            ) : (
                              <Flower size={16} className="text-green-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{season.season}</h4>
                            <p className="text-sm text-gray-600">{season.trend}</p>
                            <div className={`text-sm mt-1 ${season.priceChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {season.priceChange > 0 ? '+' : ''}{season.priceChange}% price change
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-4">Seasonal Price Comparison</h4>
                    <div className="h-48 relative">
                      {/* This would be a real chart in a production app */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">Seasonal price chart visualization</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      {searchParams.departDate && (
                        <>
                          Your travel dates ({format(searchParams.departDate, 'MMMM')}) typically see 
                          {prediction.seasonalPatterns.find(s => 
                            s.season === (
                              searchParams.departDate?.getMonth() >= 5 && searchParams.departDate?.getMonth() <= 7 
                                ? 'Summer' 
                                : searchParams.departDate?.getMonth() >= 8 && searchParams.departDate?.getMonth() <= 10 
                                ? 'Fall'
                                : searchParams.departDate?.getMonth() >= 11 || searchParams.departDate?.getMonth() <= 1
                                ? 'Winter'
                                : 'Spring'
                            )
                          )?.priceChange || 0}% 
                          {prediction.seasonalPatterns.find(s => 
                            s.season === (
                              searchParams.departDate?.getMonth() >= 5 && searchParams.departDate?.getMonth() <= 7 
                                ? 'Summer' 
                                : searchParams.departDate?.getMonth() >= 8 && searchParams.departDate?.getMonth() <= 10 
                                ? 'Fall'
                                : searchParams.departDate?.getMonth() >= 11 || searchParams.departDate?.getMonth() <= 1
                                ? 'Winter'
                                : 'Spring'
                            )
                          )?.priceChange > 0 ? ' higher ' : ' lower '}
                          prices than annual average.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Book Now Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Ready to Book?</h2>
              <p className="text-white/80 mb-4">
                {isPriceDecreasing 
                  ? "Prices are predicted to drop, but waiting too long might mean missing out on availability."
                  : isPriceIncreasing
                  ? "Prices are predicted to rise. Consider booking soon to lock in current rates."
                  : "Prices are stable. You can book now with confidence."}
              </p>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPriceDecreasing 
                    ? 'bg-green-500/20 text-white' 
                    : isPriceIncreasing
                    ? 'bg-red-500/20 text-white'
                    : 'bg-white/20 text-white'
                }`}>
                  {isPriceDecreasing 
                    ? "Prices likely to drop" 
                    : isPriceIncreasing
                    ? "Prices likely to rise"
                    : "Prices likely to remain stable"}
                </div>
                <div className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                  {Math.round(prediction.confidence * 100)}% confidence
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <CreditCard size={20} />
              <span>Book Now</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
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
              <TrendingUp className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Price Prediction AI
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Predict future travel prices with AI-powered analysis of historical trends and market data
            </motion.p>
          </div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {prediction ? renderPredictionResults() : renderSearchForm()}
          </motion.div>

          {/* Saved Searches */}
          {savedSearches.length > 0 && !prediction && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold mb-6">Recent Searches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSearchParams(search.params);
                      getPrediction();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {search.params.type === 'flight' ? (
                        <Plane size={20} className="text-blue-500" />
                      ) : search.params.type === 'hotel' ? (
                        <Hotel size={20} className="text-blue-500" />
                      ) : (
                        <Car size={20} className="text-blue-500" />
                      )}
                      <h3 className="font-semibold">
                        {search.params.type === 'flight' 
                          ? `${search.params.origin} to ${search.params.destination}`
                          : search.params.destination}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {format(search.params.departDate!, 'MMM d')}
                          {search.params.returnDate && ` - ${format(search.params.returnDate, 'MMM d')}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{search.params.travelers}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Searched {format(search.date, 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {!prediction && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                  <BarChart className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Historical Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes years of pricing data to identify patterns and predict future price movements.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                  <Zap className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Alerts</h3>
                <p className="text-gray-600">
                  Set price alerts and get notified when prices drop to your target level or when it's the optimal time to book.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Flexible Dates</h3>
                <p className="text-gray-600">
                  Find the best time to travel with our flexible date analysis that identifies the cheapest days to fly or stay.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PricePredictionAI;