import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Calendar, Clock, Cloud, Wind, Droplets, 
  Thermometer, AlertTriangle, Search, Loader, 
  BarChart, PieChart, LineChart, ArrowRight, Check, 
  X, Info, Download, Share2, Zap
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title
);

interface FlightInfo {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: Date;
  departureTime: string;
}

interface DelayPrediction {
  probability: number;
  predictedDelay: number;
  confidence: number;
  factors: {
    factor: string;
    impact: number;
    description: string;
  }[];
  alternativeOptions: {
    type: string;
    description: string;
    recommendation: string;
  }[];
  historicalData: {
    date: string;
    delay: number;
    weather: string;
  }[];
}

interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
  weather?: {
    condition: string;
    temperature: number;
    precipitation: number;
    wind: number;
  };
}

const FlightDelayPredictor: React.FC = () => {
  const [flightInfo, setFlightInfo] = useState<FlightInfo>({
    airline: '',
    flightNumber: '',
    origin: '',
    destination: '',
    departureDate: new Date(),
    departureTime: '10:00'
  });
  const [prediction, setPrediction] = useState<DelayPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [originAirport, setOriginAirport] = useState<AirportInfo | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<AirportInfo | null>(null);
  const [airportSuggestions, setAirportSuggestions] = useState<AirportInfo[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [airlineSuggestions, setAirlineSuggestions] = useState<string[]>([]);
  const [showAirlineSuggestions, setShowAirlineSuggestions] = useState(false);
  const [isLoadingFrom, setIsLoadingFrom] = useState(false);
  const [isLoadingTo, setIsLoadingTo] = useState(false);
  const [isLoadingAirline, setIsLoadingAirline] = useState(false);

  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Load airport data
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockAirports: AirportInfo[] = [
        { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
        { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
        { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
        { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
        { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
        { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
        { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
        { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
        { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'USA' },
        { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'USA' }
      ];
      
      setAirportSuggestions(mockAirports);
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  };

  const searchAirports = (query: string, type: 'origin' | 'destination') => {
    if (!query) {
      type === 'origin' ? setShowOriginSuggestions(false) : setShowDestinationSuggestions(false);
      return;
    }
    
    const filteredAirports = airportSuggestions.filter(airport => 
      airport.code.toLowerCase().includes(query.toLowerCase()) ||
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase())
    );
    
    if (type === 'origin') {
      setShowOriginSuggestions(true);
    } else {
      setShowDestinationSuggestions(true);
    }
  };

  const selectAirport = (airport: AirportInfo, type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setFlightInfo({ ...flightInfo, origin: airport.code });
      setOriginAirport(airport);
      setShowOriginSuggestions(false);
    } else {
      setFlightInfo({ ...flightInfo, destination: airport.code });
      setDestinationAirport(airport);
      setShowDestinationSuggestions(false);
    }
  };

  const searchAirlines = (query: string) => {
    if (!query) {
      setShowAirlineSuggestions(false);
      return;
    }
    
    const mockAirlines = [
      'American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines',
      'British Airways', 'Lufthansa', 'Air France', 'KLM', 'Emirates', 'Qatar Airways',
      'Singapore Airlines', 'Cathay Pacific', 'Japan Airlines', 'ANA', 'Qantas'
    ];
    
    const filteredAirlines = mockAirlines.filter(airline => 
      airline.toLowerCase().includes(query.toLowerCase())
    );
    
    setAirlineSuggestions(filteredAirlines);
    setShowAirlineSuggestions(true);
  };

  const selectAirline = (airline: string) => {
    setFlightInfo({ ...flightInfo, airline });
    setShowAirlineSuggestions(false);
  };

  const predictDelay = async () => {
    if (!flightInfo.airline || !flightInfo.flightNumber || !flightInfo.origin || !flightInfo.destination) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate mock weather data for airports
      const originWeather = {
        condition: Math.random() > 0.7 ? 'Rainy' : Math.random() > 0.5 ? 'Cloudy' : 'Clear',
        temperature: Math.floor(Math.random() * 30) + 5,
        precipitation: Math.random() > 0.7 ? Math.random() * 80 : Math.random() * 20,
        wind: Math.floor(Math.random() * 30)
      };
      
      const destinationWeather = {
        condition: Math.random() > 0.7 ? 'Rainy' : Math.random() > 0.5 ? 'Cloudy' : 'Clear',
        temperature: Math.floor(Math.random() * 30) + 5,
        precipitation: Math.random() > 0.7 ? Math.random() * 80 : Math.random() * 20,
        wind: Math.floor(Math.random() * 30)
      };
      
      // Update airport info with weather
      if (originAirport) {
        setOriginAirport({ ...originAirport, weather: originWeather });
      }
      
      if (destinationAirport) {
        setDestinationAirport({ ...destinationAirport, weather: destinationWeather });
      }
      
      // Generate mock prediction
      const isHighRisk = originWeather.condition === 'Rainy' || 
                         destinationWeather.condition === 'Rainy' || 
                         originWeather.wind > 25 || 
                         destinationWeather.wind > 25;
      
      const isMediumRisk = originWeather.condition === 'Cloudy' || 
                           destinationWeather.condition === 'Cloudy' || 
                           originWeather.precipitation > 50 || 
                           destinationWeather.precipitation > 50;
      
      const delayProbability = isHighRisk ? Math.random() * 0.4 + 0.6 : 
                               isMediumRisk ? Math.random() * 0.3 + 0.3 : 
                               Math.random() * 0.3;
      
      const predictedDelay = isHighRisk ? Math.floor(Math.random() * 120) + 60 : 
                             isMediumRisk ? Math.floor(Math.random() * 60) + 30 : 
                             Math.floor(Math.random() * 30);
      
      const mockPrediction: DelayPrediction = {
        probability: parseFloat(delayProbability.toFixed(2)),
        predictedDelay: predictedDelay,
        confidence: parseFloat((Math.random() * 0.2 + 0.7).toFixed(2)),
        factors: [
          {
            factor: 'Weather Conditions',
            impact: parseFloat((Math.random() * 0.5).toFixed(2)),
            description: `${originAirport?.city} is experiencing ${originWeather.condition.toLowerCase()} conditions with ${originWeather.wind}mph winds.`
          },
          {
            factor: 'Time of Day',
            impact: parseFloat((Math.random() * 0.3).toFixed(2)),
            description: 'Morning flights typically experience fewer delays than evening flights.'
          },
          {
            factor: 'Airport Congestion',
            impact: parseFloat((Math.random() * 0.4).toFixed(2)),
            description: `${originAirport?.code} is currently operating at ${Math.floor(Math.random() * 40) + 60}% capacity.`
          },
          {
            factor: 'Airline Performance',
            impact: parseFloat((Math.random() * 0.3).toFixed(2)),
            description: `${flightInfo.airline} has an on-time performance of ${Math.floor(Math.random() * 20) + 75}% for this route.`
          }
        ],
        alternativeOptions: [
          {
            type: 'Earlier Flight',
            description: `${flightInfo.airline} flight departing at ${format(addDays(flightInfo.departureDate, -1), 'MMM d')} at 08:30`,
            recommendation: 'Lower delay risk due to morning departure and less congestion.'
          },
          {
            type: 'Different Airline',
            description: `${flightInfo.airline === 'American Airlines' ? 'Delta Air Lines' : 'American Airlines'} flight departing at the same time`,
            recommendation: 'Better on-time performance for this route.'
          },
          {
            type: 'Alternative Route',
            description: `Connect through ${flightInfo.origin === 'JFK' ? 'BOS' : 'JFK'} instead of direct flight`,
            recommendation: 'Avoid weather-related delays at current departure airport.'
          }
        ],
        historicalData: Array.from({ length: 10 }, (_, i) => ({
          date: format(addDays(new Date(), -i - 1), 'MMM d'),
          delay: Math.floor(Math.random() * 120),
          weather: Math.random() > 0.7 ? 'Rainy' : Math.random() > 0.5 ? 'Cloudy' : 'Clear'
        }))
      };
      
      setPrediction(mockPrediction);
      setShowResults(true);
    } catch (error) {
      console.error('Error predicting delay:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDelayRiskLevel = (probability: number) => {
    if (probability >= 0.7) return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (probability >= 0.4) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition.toLowerCase()) {
      case 'rainy':
        return <Droplets size={size} className="text-blue-500" />;
      case 'cloudy':
        return <Cloud size={size} className="text-gray-500" />;
      case 'clear':
        return <Sun size={size} className="text-yellow-500" />;
      default:
        return <Cloud size={size} className="text-gray-500" />;
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

  const pieChartData = {
    labels: ['On-time', 'Delayed'],
    datasets: [
      {
        data: [100 - prediction?.probability! * 100, prediction?.probability! * 100],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#10B981', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: prediction?.historicalData.map(d => d.date).reverse() || [],
    datasets: [
      {
        label: 'Historical Delays (minutes)',
        data: prediction?.historicalData.map(d => d.delay).reverse() || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels: prediction?.factors.map(f => f.factor) || [],
    datasets: [
      {
        label: 'Factor Impact',
        data: prediction?.factors.map(f => f.impact * 100) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
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
              <Plane className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              AI Flight Delay Predictor
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Predict flight delays with AI-powered analysis of weather, traffic, and historical data
            </motion.p>
          </div>

          {/* Flight Search Form */}
          <motion.div
            variants={itemVariants}
            className={`bg-white rounded-xl shadow-sm p-6 ${showResults ? 'mb-8' : ''}`}
          >
            <h2 className="text-xl font-bold mb-6">Flight Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="From where?"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                    value={flightInfo.origin}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFlightInfo(prev => ({
                        ...prev,
                        origin: value
                      }));
                      searchAirports(value, 'origin');
                    }}
                  />
                  {isLoadingFrom && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {showOriginSuggestions && airportSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                      {airportSuggestions.map((airport) => (
                        <button
                          key={airport.code}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                          onClick={() => selectAirport(airport, 'origin')}
                        >
                          <div className="font-medium text-gray-700">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500">{airport.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="To where?"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                    value={flightInfo.destination}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFlightInfo(prev => ({
                        ...prev,
                        destination: value
                      }));
                      searchAirports(value, 'destination');
                    }}
                  />
                  {isLoadingTo && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {showDestinationSuggestions && airportSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                      {airportSuggestions.map((airport) => (
                        <button
                          key={airport.code}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                          onClick={() => selectAirport(airport, 'destination')}
                        >
                          <div className="font-medium text-gray-700">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500">{airport.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                <DatePicker
                  selected={flightInfo.departureDate}
                  onChange={(date) => setFlightInfo({
                    ...flightInfo,
                    departureDate: date!
                  })}
                  placeholderText="Departure Date"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  minDate={new Date()}
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="time"
                  value={flightInfo.departureTime}
                  onChange={(e) => setFlightInfo({
                    ...flightInfo,
                    departureTime: e.target.value
                  })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              <div className="relative">
                <Plane className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Airline"
                  value={flightInfo.airline}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFlightInfo(prev => ({
                      ...prev,
                      airline: value
                    }));
                    searchAirlines(value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {isLoadingAirline && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {showAirlineSuggestions && airlineSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                    {airlineSuggestions.map((airline, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                        onClick={() => selectAirline(airline)}
                      >
                        {airline}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={predictDelay}
                disabled={isLoading || !flightInfo.airline || !flightInfo.flightNumber || !flightInfo.origin || !flightInfo.destination}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Predicting...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Predict Delay</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {showResults && prediction && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8"
              >
                {/* Prediction Summary */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Delay Prediction</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <h3 className="text-lg font-semibold mb-4">Delay Risk</h3>
                      <div className="flex justify-center mb-4">
                        <div className="w-32 h-32">
                          <Pie data={pieChartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${getDelayRiskLevel(prediction.probability).color}`}>
                        {getDelayRiskLevel(prediction.probability).level} Risk
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {(prediction.probability * 100).toFixed(0)}% chance of delay
                      </p>
                    </div>
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <h3 className="text-lg font-semibold mb-4">Predicted Delay</h3>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock size={32} className="text-blue-600" />
                        <span className="text-3xl font-bold">
                          {prediction.predictedDelay}
                        </span>
                        <span className="text-xl">min</span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Based on current conditions and historical data
                      </p>
                    </div>
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <h3 className="text-lg font-semibold mb-4">Prediction Confidence</h3>
                      <div className="mb-4">
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${prediction.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {(prediction.confidence * 100).toFixed(0)}%
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        Confidence in prediction accuracy
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Weather and Airport Conditions */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Weather & Airport Conditions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {originAirport && originAirport.weather && (
                      <div className="bg-white rounded-lg border p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{originAirport.code} - {originAirport.city}</h3>
                            <p className="text-gray-500">Departure Airport</p>
                          </div>
                          <div className="p-3 rounded-full bg-blue-50">
                            {getWeatherIcon(originAirport.weather.condition)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Thermometer size={18} className="text-red-500" />
                            <div>
                              <p className="text-sm text-gray-500">Temperature</p>
                              <p className="font-medium">{originAirport.weather.temperature}°C</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets size={18} className="text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-500">Precipitation</p>
                              <p className="font-medium">{originAirport.weather.precipitation}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind size={18} className="text-blue-400" />
                            <div>
                              <p className="text-sm text-gray-500">Wind</p>
                              <p className="font-medium">{originAirport.weather.wind} mph</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Cloud size={18} className="text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Condition</p>
                              <p className="font-medium">{originAirport.weather.condition}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {destinationAirport && destinationAirport.weather && (
                      <div className="bg-white rounded-lg border p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{destinationAirport.code} - {destinationAirport.city}</h3>
                            <p className="text-gray-500">Arrival Airport</p>
                          </div>
                          <div className="p-3 rounded-full bg-blue-50">
                            {getWeatherIcon(destinationAirport.weather.condition)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Thermometer size={18} className="text-red-500" />
                            <div>
                              <p className="text-sm text-gray-500">Temperature</p>
                              <p className="font-medium">{destinationAirport.weather.temperature}°C</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets size={18} className="text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-500">Precipitation</p>
                              <p className="font-medium">{destinationAirport.weather.precipitation}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind size={18} className="text-blue-400" />
                            <div>
                              <p className="text-sm text-gray-500">Wind</p>
                              <p className="font-medium">{destinationAirport.weather.wind} mph</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Cloud size={18} className="text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Condition</p>
                              <p className="font-medium">{destinationAirport.weather.condition}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Delay Factors */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Delay Factors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Impact Analysis</h3>
                      <div className="h-64">
                        <Bar 
                          data={barChartData} 
                          options={{
                            indexAxis: 'y',
                            plugins: {
                              title: {
                                display: true,
                                text: 'Factor Impact (%)'
                              },
                              legend: {
                                display: false
                              }
                            },
                            scales: {
                              x: {
                                beginAtZero: true,
                                max: 100
                              }
                            }
                          }} 
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Key Factors</h3>
                      <div className="space-y-4">
                        {prediction.factors.map((factor, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{factor.factor}</h4>
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                {(factor.impact * 100).toFixed(0)}% impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{factor.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Historical Data */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Historical Performance</h2>
                  <div className="h-80">
                    <Line 
                      data={lineChartData} 
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: 'Historical Delays for Similar Flights'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Delay (minutes)'
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <h4 className="font-medium mb-2">Average Delay</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(prediction.historicalData.reduce((sum, d) => sum + d.delay, 0) / prediction.historicalData.length)} min
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <h4 className="font-medium mb-2">Maximum Delay</h4>
                      <p className="text-2xl font-bold text-red-600">
                        {Math.max(...prediction.historicalData.map(d => d.delay))} min
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <h4 className="font-medium mb-2">On-Time Rate</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round(prediction.historicalData.filter(d => d.delay < 15).length / prediction.historicalData.length * 100)}%
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Alternative Options */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Alternative Options</h2>
                  <div className="space-y-4">
                    {prediction.alternativeOptions.map((option, index) => (
                      <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{option.type}</h3>
                            <p className="text-gray-600 mb-2">{option.description}</p>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Check size={16} />
                              <span>{option.recommendation}</span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            View Option
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                  variants={itemVariants}
                  className="bg-blue-50 rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <AlertTriangle className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">AI Recommendations</h2>
                      <p className="text-blue-700 mb-4">
                        Based on our analysis, here are some recommendations to minimize the impact of potential delays:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check size={18} className="text-green-500 mt-1" />
                          <span>Arrive at the airport at least 3 hours before departure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={18} className="text-green-500 mt-1" />
                          <span>Sign up for flight status notifications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={18} className="text-green-500 mt-1" />
                          <span>Consider booking a flexible ticket for easier rebooking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={18} className="text-green-500 mt-1" />
                          <span>Pack essentials in your carry-on in case of extended delays</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={18} className="text-green-500 mt-1" />
                          <span>Check airline policies for delay compensation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Export Options */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-end gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Download size={20} />
                    <span>Export Report</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Share2 size={20} />
                    <span>Share Prediction</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default FlightDelayPredictor;