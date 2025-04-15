import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, DollarSign, Users, ArrowRight, Search, Filter, Clock, Loader, ArrowUpRight, Sparkles } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { searchFlights } from '../../services/searchApi';
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "react-google-autocomplete";


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
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: null as Date | null,
    returnDate: null as Date | null,
    adults: 1,
    travelClass: 'ECONOMY',
    nonStop: false,
    currencyCode: 'USD',
    max: 50
  });

  const [filters, setFilters] = useState({
    maxPrice: 2000,
    stops: [] as string[],
    airlines: [] as string[],
    cabinClass: 'all'
  });

  const performSearch = async () => {
    if (!searchParams.originLocationCode || !searchParams.destinationLocationCode || !searchParams.departureDate) {
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setFlights([]);

    try {
      // Simulate progress while searching
      const progressInterval = setInterval(() => {
        setSearchProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const results = await searchFlights({
        ...searchParams,
        departureDate: searchParams.departureDate.toISOString().split('T')[0],
        returnDate: searchParams.returnDate?.toISOString().split('T')[0],
      });

      clearInterval(progressInterval);
      setSearchProgress(100);
      setFlights(results);
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setIsSearching(false);
    }
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

  const filteredFlights = filterFlights(flights);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h1 className="text-3xl font-bold mb-6">Find Your Perfect Flight</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Autocomplete
                    apiKey={apiKey}
                    style={{ width: "90%" }}
                    onPlaceSelected={(place) => {
                      console.log(place);
                    }}
                    options={{
                      types: ["(regions)"],
                      componentRestrictions: { country: "ru" },
                    }}
                    defaultValue="Amsterdam"
                />;
                <Autocomplete
                    apiKey={apiKey}
                    style={{ width: "90%" }}
                    onPlaceSelected={(place) => {
                      console.log(place);
                    }}
                    options={{
                      types: ["(regions)"],
                      componentRestrictions: { country: "ru" },
                    }}
                    defaultValue="Amsterdam"
                />;
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <DatePicker
                      selected={searchParams.departureDate}
                      onChange={(date) => setSearchParams({
                        ...searchParams,
                        departureDate: date
                      })}
                      placeholderText="Departure Date"
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                      value={searchParams.travelClass}
                      onChange={(e) => setSearchParams({
                        ...searchParams,
                        travelClass: e.target.value
                      })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First Class</option>
                  </select>
                </div>
              </div>

              <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={performSearch}
                  className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
              >
                <Search size={20} />
                Search Flights
              </motion.button>
            </div>

            {isSearching && (
                <div className="p-8">
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${searchProgress}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                      </div>
                      <div className="mt-4 text-center text-gray-600">
                        Searching for the best flights...
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </motion.div>

          <AnimatePresence>
            {!isSearching && filteredFlights.length > 0 && (
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
            )}
          </AnimatePresence>

          {!isSearching && filteredFlights.length === 0 && searchParams.departureDate && (
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