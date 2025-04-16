import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Star, MapPin, Wifi, Coffee, Dumbbell, Pool, ArrowRight, Search, Loader, AlertCircle, Filter, DollarSign, Users, Calendar, Map as MapIcon, List } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import ReactPaginate from 'react-paginate';
import {searchHotels, HotelOffer, searchHotelsByCity, HotelData} from '../../services/searchApi';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 5;

const HotelResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelOffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMarker, setSelectedMarker] = useState<HotelData | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sponsoredOnly: false,
    chainCode: [] as string[]
  });

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cityCode = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    if (!cityCode || !checkIn || !checkOut) {
      setError('Please provide location and dates for hotel search');
      setIsLoading(false);
      return;
    }

    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {
          cityCode: cityCode.toUpperCase(),
          checkInDate: format(new Date(checkIn), 'yyyy-MM-dd'),
          checkOutDate: format(new Date(checkOut), 'yyyy-MM-dd'),
          adults: parseInt(guests || '1', 10),
          radius: 50,
          radiusUnit: 'KM' as const
        };

        const results = await searchHotelsByCity(params);
        setHotels(results.data);

        // Set initial map center based on first hotel
        if (results.data.length > 0) {
          const firstHotel = results.data[0];
          setMapCenter({
            lat: firstHotel.geoCode.latitude,
            lng: firstHotel.geoCode.longitude
          });
        }
      } catch (err: any) {
        console.error('Error fetching hotels:', err);
        setError(err.message || 'Failed to fetch hotels. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [location.search]);

  const handleHotelSelect = async (hotelId: string) => {
    try {
      setIsLoading(true);
      const params = {
        hotelId:hotelId
      };
      const response = await searchHotels(params);
      setSelectedHotel(response.data[0]);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterHotels = (hotels: HotelData[]) => {
    return hotels.filter(hotel => {
      /*const price = parseFloat(hotel.offers[0]?.price.total || '0');
      const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];*/

      const matchesSponsored = !filters.sponsoredOnly || hotel.retailing?.sponsorship?.isSponsored;

      const matchesChain = filters.chainCode.length === 0 || filters.chainCode.includes(hotel.chainCode);

      return  matchesSponsored && matchesChain;
    });
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  const filteredHotels = filterHotels(hotels);
  const pageCount = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const currentHotels = filteredHotels.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
  );
  const uniqueChainCodes = Array.from(new Set(hotels.map(h => h.chainCode))).filter(Boolean);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  const renderMap = () => {
    if (!isMapLoaded) {
      return (
          <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
      );
    }

    return (
        <GoogleMap
            mapContainerClassName="w-full h-[600px] rounded-lg"
            center={mapCenter}
            zoom={12}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
        >
          {filteredHotels.map((hotel) => (
              <Marker
                  key={hotel.hotelId}
                  position={{
                    lat: hotel.geoCode.latitude,
                    lng: hotel.geoCode.longitude
                  }}
                  onClick={() => setSelectedMarker(hotel)}
              />
          ))}

          {selectedMarker && (
              <InfoWindow
                  position={{
                    lat: selectedMarker.geoCode.latitude,
                    lng: selectedMarker.geoCode.longitude
                  }}
                  onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-semibold mb-1">{selectedMarker.name}</h3>
                  <p className="text-sm text-gray-600">
                    {/*${parseFloat(selectedMarker.offers[0]?.price.total || '0').toFixed(2)} per night*/}
                  </p>
                  <button
                      onClick={() => handleHotelSelect(selectedMarker.hotelId)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
              </InfoWindow>
          )}
        </GoogleMap>
    );
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Searching for the best hotels...</p>

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




  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Hotel Search Results</h1>
                  <p className="text-blue-100">Found {filteredHotels.length} hotels matching your criteria</p>
                </div>
                <div className="flex gap-2">
                  <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${
                          viewMode === 'list'
                              ? 'bg-white text-blue-600'
                              : 'bg-white/20 text-white'
                      }`}
                  >
                    <List size={20} />
                  </button>
                  <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 rounded-lg ${
                          viewMode === 'map'
                              ? 'bg-white text-blue-600'
                              : 'bg-white/20 text-white'
                      }`}
                  >
                    <MapIcon size={20} />
                  </button>
                </div>
              </div>






















            </div>

            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (per night)



                  </label>
                  <input
                      type="range"
                      min="0"
                      max="2000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({



                        ...filters,
                        priceRange: [0, parseInt(e.target.value)]
                      })}
                      className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.priceRange[1]}</span>

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Chain
                  </label>
                 {/* <div className="space-y-2">
                    {uniqueChainCodes.map((chainCode) => (
                        <label key={chainCode} className="flex items-center">
                          <input
                              type="checkbox"
                              checked={filters.chainCode.includes(chainCode)}
                              onChange={(e) => {

                                const newChainCodes = e.target.checked
                                    ? [...filters.chainCode, chainCode]
                                    : filters.chainCode.filter(c => c !== chainCode);
                                setFilters({ ...filters, chainCode: newChainCodes });
                              }}
                              className="rounded text-blue-600"
                          />
                          <span className="ml-2">{chainCode}</span>
                        </label>
                    ))}
                  </div>*/}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Filters
                  </label>
                  <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={filters.sponsoredOnly}
                        onChange={(e) => setFilters({
                          ...filters,
                          sponsoredOnly: e.target.checked
                        })}
                        className="rounded text-blue-600"
                    />
                    <span className="ml-2">Sponsored Hotels Only</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* View Toggle */}
          {viewMode === 'map' ? (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                {renderMap()}
              </div>
          ) : (
              <>
                {/* Results Section */}
                <AnimatePresence>
                  <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                  >
                    {currentHotels.map((hotel) => (
                        <motion.div
                            key={hotel.hotelId}
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                            onClick={() => handleHotelSelect(hotel.hotelId)}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="h-48 md:h-full">
                              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                <Building size={48} className="text-gray-400" />
                              </div>
                            </div>

                            <div className="col-span-2">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-semibold">{hotel.name}</h3>
                                    {hotel.retailing?.sponsorship?.isSponsored && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  Sponsored
                                </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                                    <MapPin size={16} />
                                    <span>{hotel.address.countryCode}</span>
                                    <span className="text-sm">
                                ({hotel.chainCode || 'Independent'})
                              </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">
                                   {/* ${parseFloat(hotel.offers[0]?.price.total || '0').toFixed(2)}*/}
                                  </div>
                                  <span className="text-gray-500">per night</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <MapPin className="text-gray-400" size={16} />
                                  <span className="text-sm">
                              Lat: {hotel.geoCode.latitude.toFixed(4)},
                              Lon: {hotel.geoCode.longitude.toFixed(4)}
                            </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="text-gray-400" size={16} />
                                  <span className="text-sm">ID: {hotel.dupeId}</span>
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                  View Details
                                  <ArrowRight size={16} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="mt-8">
                      <ReactPaginate
                          previousLabel="Previous"
                          nextLabel="Next"
                          pageCount={pageCount}
                          onPageChange={handlePageChange}
                          containerClassName="flex justify-center items-center gap-2"
                          previousClassName="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors"
                          nextClassName="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors"
                          pageClassName="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors"
                          activeClassName="!bg-blue-600 !text-white"
                          disabledClassName="opacity-50 cursor-not-allowed"
                      />
                    </div>
                )}
              </>














          )}






          {filteredHotels.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <Building className="mx-auto mb-4 text-gray-400" size={48} />









                <p className="text-xl font-semibold text-gray-600">No hotels found</p>







                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
          )}
        </div>

        {/* Hotel Details Modal */}
        {selectedHotel && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold">{selectedHotel.hotel.name}</h2>
                    <button
                        onClick={() => setSelectedHotel(null)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                      <AlertCircle size={24} />
                    </button>
                  </div>


                  <div className="space-y-6">
                    {/* Hotel Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Room Options</h3>
                      {selectedHotel.offers.map((offer, index) => (
                          <div
                              key={offer.id}
                              className="border rounded-lg p-4 mb-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{offer.room.type}</h4>
                                <p className="text-sm text-gray-600">
                                  {offer.room.description.text}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">
                                  ${parseFloat(offer.price.total).toFixed(2)}
                                </div>
                                <span className="text-sm text-gray-500">per night</span>
                              </div>
                            </div>

                            {offer.policies?.cancellation && (
                                <div className="text-sm text-gray-600 mt-2">
                                  <p className="font-medium">Cancellation Policy:</p>
                                  <p>{offer.policies.cancellation.description?.text}</p>
                                  {offer.policies.cancellation.deadline && (
                                      <p>Deadline: {format(new Date(offer.policies.cancellation.deadline), 'PPP')}</p>
                                  )}
                                </div>
                            )}

                            <button
                                className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                              Book Now
                              <ArrowRight size={16} />
                            </button>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
        )}
      </div>
  );
};

export default HotelResults;
