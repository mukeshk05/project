import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, DollarSign, Users, Search, Filter, Clock, Loader, ArrowUpRight, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchFlights } from '../../services/searchApi';
import { format } from 'date-fns';

interface Flight {
  id: string;
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      duration: string;
      numberOfStops: number;
    }>;
    duration: string;
  }>;
  price: {
    total: string;
    currency: string;
  };
  numberOfBookableSeats: number;
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
    };
    fareDetailsBySegment: Array<{
      cabin: string;
      class: string;
    }>;
  }>;
}

const FlightResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    maxPrice: 2000,
    stops: [] as string[],
    airlines: [] as string[],
    cabinClass: 'all'
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const departDate = searchParams.get('departDate');
    const returnDate = searchParams.get('returnDate');

    const formatDateString = (dateStr: string | null): string | undefined => {
      if (!dateStr) return undefined;
      try {
        const date = new Date(dateStr);
        return format(date, 'yyyy-MM-dd');
      } catch (err) {
        console.error('Date parsing error:', err);
        return undefined;
      }
    };

    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to || !departDate) {
      setError('Please provide origin, destination, and departure date');
      setIsLoading(false);
      return;
    }

    const params = {
      originLocationCode: from.trim().toUpperCase(),
      destinationLocationCode: to.trim().toUpperCase(),
      departureDate: formatDateString(departDate) || '',
      returnDate: formatDateString(returnDate),
      adults: parseInt(searchParams.get('passengers') || '1', 10),
      travelClass: searchParams.get('class')?.toUpperCase() || 'ECONOMY',
      nonStop: false,
      currencyCode: 'USD',
      max: 50
    };

    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!/^[A-Z]{3}$/.test(params.originLocationCode) || !/^[A-Z]{3}$/.test(params.destinationLocationCode)) {
          throw new Error('Invalid airport codes. Please select airports from the suggestions.');
        }

        if (!params.departureDate) {
          throw new Error('Invalid departure date format. Please select a valid date.');
        }

        const results = await searchFlights(params);
        setFlights(Array.isArray(results) ? results : []);
      } catch (err: any) {
        console.error('Error fetching flights:', err);
        setError(err.message || 'Failed to fetch flights. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [location.search]);

  const formatDuration = (duration: string) => {
    return duration
        .replace('PT', '')
        .replace('H', 'h ')
        .replace('M', 'm')
        .toLowerCase();
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filterFlights = (flights: Flight[]) => {
    return flights.filter(flight => {
      const price = parseFloat(flight.price.total);
      const matchesPrice = price <= filters.maxPrice;

      const stops = flight.itineraries[0].segments.length - 1;
      const matchesStops = filters.stops.length === 0 || filters.stops.includes(stops.toString());

      const cabinClass = flight.travelerPricings[0].fareDetailsBySegment[0].cabin;
      const matchesCabin = filters.cabinClass === 'all' || filters.cabinClass === cabinClass;

      return matchesPrice && matchesStops && matchesCabin;
    });
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Searching for the best flights...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Search Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                  onClick={() => navigate('/')}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Return to Search
              </button>
            </div>
          </div>
        </div>
    );
  }

  const filteredFlights = filterFlights(flights);

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h1 className="text-2xl font-bold mb-2">Flight Search Results</h1>
              <p className="text-blue-100">Found {filteredFlights.length} flights matching your criteria</p>
            </div>

            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (USD)
                  </label>
                  <input
                      type="range"
                      min="0"
                      max="5000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                      className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.maxPrice}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stops
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                          type="checkbox"
                          checked={filters.stops.includes('0')}
                          onChange={(e) => {
                            const newStops = e.target.checked
                                ? [...filters.stops, '0']
                                : filters.stops.filter(s => s !== '0');
                            setFilters({ ...filters, stops: newStops });
                          }}
                          className="rounded text-blue-600"
                      />
                      <span className="ml-2">Non-stop</span>
                    </label>
                    <label className="flex items-center">
                      <input
                          type="checkbox"
                          checked={filters.stops.includes('1')}
                          onChange={(e) => {
                            const newStops = e.target.checked
                                ? [...filters.stops, '1']
                                : filters.stops.filter(s => s !== '1');
                            setFilters({ ...filters, stops: newStops });
                          }}
                          className="rounded text-blue-600"
                      />
                      <span className="ml-2">1 Stop</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cabin Class
                  </label>
                  <select
                      value={filters.cabinClass}
                      onChange={(e) => setFilters({ ...filters, cabinClass: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                  >
                    <option value="all">All Classes</option>
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
              {filteredFlights.map((flight) => (
                  <motion.div
                      key={flight.id}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                  >
                    {flight.itineraries.map((itinerary, index) => (
                        <div key={index} className="mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Plane className="text-blue-600" size={24} />
                                <div>
                                  <h3 className="font-semibold">
                                    {itinerary.segments[0].carrierCode} {itinerary.segments[0].number}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {itinerary.segments[0].aircraft.code}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="text-center">
                              <p className="text-2xl font-semibold">
                                {formatDateTime(itinerary.segments[0].departure.at)}
                              </p>
                              <p className="text-gray-500">
                                {itinerary.segments[0].departure.iataCode}
                              </p>
                            </div>

                            <div className="text-center">
                              <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-500">
                                  {formatDuration(itinerary.duration)}
                                </p>
                                <div className="w-32 h-px bg-gray-300 my-2 relative">
                                  <div className="absolute -top-1 right-0 w-2 h-2 bg-blue-600 rounded-full" />
                                  <Plane size={16} className="absolute -top-2 left-0 text-blue-600 transform -rotate-45" />
                                </div>
                                <p className="text-sm text-gray-500">
                                  {itinerary.segments.length - 1 === 0 ? 'Non-stop' : `${itinerary.segments.length - 1} stop${itinerary.segments.length - 1 > 1 ? 's' : ''}`}
                                </p>
                              </div>
                            </div>

                            <div className="text-center">
                              <p className="text-2xl font-semibold">
                                {formatDateTime(itinerary.segments[itinerary.segments.length - 1].arrival.at)}
                              </p>
                              <p className="text-gray-500">
                                {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}
                              </p>
                            </div>
                          </div>
                        </div>
                    ))}

                    <div className="mt-6 pt-6 border-t flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="text-green-600" size={20} />
                          <span className="text-2xl font-bold">
                        {parseFloat(flight.price.total).toFixed(2)} {flight.price.currency}
                      </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="text-gray-400" size={20} />
                          <span className="text-gray-600">
                        {flight.numberOfBookableSeats} seats left
                      </span>
                        </div>
                      </div>

                      <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                      >
                        Select Flight
                        <ArrowUpRight size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredFlights.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <Plane className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-xl font-semibold text-gray-600">No flights found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default FlightResults;