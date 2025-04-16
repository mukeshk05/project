import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plane, Car, Building, Ship, Calendar, Users, MapPin, Search, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { searchAirports, searchCities, Airport, City } from '../services/searchApi';
import "react-datepicker/dist/react-datepicker.css";

type SearchType = 'flights' | 'cars' | 'hotels' | 'cruises';

const TravelSearch: React.FC = () => {
    const navigate = useNavigate();
    const [activeSearch, setActiveSearch] = useState<SearchType>('flights');
    const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
    const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [isLoadingFrom, setIsLoadingFrom] = useState(false);
    const [isLoadingTo, setIsLoadingTo] = useState(false);
    const [isLoadingCity, setIsLoadingCity] = useState(false);

    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    const [searchParams, setSearchParams] = useState({
        flights: {
            from: '',
            fromCode: '',
            to: '',
            toCode: '',
            departDate: null as Date | null,
            returnDate: null as Date | null,
            passengers: 1,
            class: 'economy'
        },
        cars: {
            location: '',
            pickupDate: null as Date | null,
            returnDate: null as Date | null,
            carType: 'any'
        },
        hotels: {
            location: '',
            locationCode: '',
            checkIn: null as Date | null,
            checkOut: null as Date | null,
            guests: 1,
            rooms: 1
        },
        cruises: {
            destination: '',
            departurePort: '',
            departureDate: null as Date | null,
            duration: 'any'
        }
    });

    const handleAirportSearch = async (
        value: string,
        type: 'from' | 'to'
    ) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.length < 2) {
            type === 'from' ? setFromSuggestions([]) : setToSuggestions([]);
            return;
        }

        type === 'from' ? setIsLoadingFrom(true) : setIsLoadingTo(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await searchAirports(value);
                const airports = response.data;

                if (type === 'from') {
                    setFromSuggestions(airports);
                    setShowFromSuggestions(true);
                } else {
                    setToSuggestions(airports);
                    setShowToSuggestions(true);
                }
            } catch (error) {
                console.error('Error searching airports:', error);
            } finally {
                type === 'from' ? setIsLoadingFrom(false) : setIsLoadingTo(false);
            }
        }, 300);
    };

    const handleCitySearch = async (value: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.length < 2) {
            setCitySuggestions([]);
            return;
        }

        setIsLoadingCity(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await searchCities(value);
                setCitySuggestions(response.data);
                setShowCitySuggestions(true);
            } catch (error) {
                console.error('Error searching cities:', error);
            } finally {
                setIsLoadingCity(false);
            }
        }, 300);
    };

    const handleAirportSelect = (airport: Airport, type: 'from' | 'to') => {
        const displayText = `${airport.cityName} (${airport.iataCode})`;
        setSearchParams(prev => ({
            ...prev,
            flights: {
                ...prev.flights,
                [type]: displayText,
                [`${type}Code`]: airport.iataCode,
            }
        }));
        type === 'from' ? setShowFromSuggestions(false) : setShowToSuggestions(false);
    };

    const handleCitySelect = (city: City) => {
        const displayText = `${city.name}, ${city.countryName}`;
        setSearchParams(prev => ({
            ...prev,
            hotels: {
                ...prev.hotels,
                location: displayText,
                locationCode: city.cityCode,
            }
        }));
        setShowCitySuggestions(false);
    };

    const handleSearch = (type: SearchType) => {
        const params = new URLSearchParams();

        switch (type) {
            case 'flights':
                if (!searchParams.flights.fromCode || !searchParams.flights.toCode) {
                    alert('Please select valid airports from the suggestions');
                    return;
                }
                params.append('from', searchParams.flights.fromCode);
                params.append('to', searchParams.flights.toCode);
                if (searchParams.flights.departDate) params.append('departDate', searchParams.flights.departDate.toISOString());
                if (searchParams.flights.returnDate) params.append('returnDate', searchParams.flights.returnDate.toISOString());
                params.append('passengers', searchParams.flights.passengers.toString());
                params.append('class', searchParams.flights.class);
                navigate(`/search/flights?${params.toString()}`);
                break;

            case 'cars':
                if (searchParams.cars.location) params.append('location', searchParams.cars.location);
                if (searchParams.cars.pickupDate) params.append('pickupDate', searchParams.cars.pickupDate.toISOString());
                if (searchParams.cars.returnDate) params.append('returnDate', searchParams.cars.returnDate.toISOString());
                params.append('carType', searchParams.cars.carType);
                navigate(`/search/cars?${params.toString()}`);
                break;

            case 'hotels':
                if (!searchParams.hotels.locationCode) {
                    alert('Please select a city from the suggestions');
                    return;
                }
                params.append('location', searchParams.hotels.locationCode);
                if (searchParams.hotels.checkIn) params.append('checkIn', searchParams.hotels.checkIn.toISOString());
                if (searchParams.hotels.checkOut) params.append('checkOut', searchParams.hotels.checkOut.toISOString());
                params.append('guests', searchParams.hotels.guests.toString());
                params.append('rooms', searchParams.hotels.rooms.toString());
                navigate(`/search/hotels?${params.toString()}`);
                break;

            case 'cruises':
                if (searchParams.cruises.destination) params.append('destination', searchParams.cruises.destination);
                if (searchParams.cruises.departurePort) params.append('departurePort', searchParams.cruises.departurePort);
                if (searchParams.cruises.departureDate) params.append('departureDate', searchParams.cruises.departureDate.toISOString());
                params.append('duration', searchParams.cruises.duration);
                navigate(`/search/cruises?${params.toString()}`);
                break;
        }
    };

    const searchOptions = [
        { type: 'flights' as const, icon: Plane, label: 'Flights' },
        { type: 'cars' as const, icon: Car, label: 'Cars' },
        { type: 'hotels' as const, icon: Building, label: 'Hotels' },
        { type: 'cruises' as const, icon: Ship, label: 'Cruises' }
    ];

    const renderSearchForm = () => {
        const inputClasses = "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400";
        const datePickerClasses = "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700";
        const selectClasses = "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white";

        switch (activeSearch) {
            case 'flights':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="From where?"
                                    className={inputClasses}
                                    value={searchParams.flights.from}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchParams(prev => ({
                                            ...prev,
                                            flights: { ...prev.flights, from: value, fromCode: '' }
                                        }));
                                        handleAirportSearch(value, 'from');
                                    }}
                                />
                                {isLoadingFrom && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                                {showFromSuggestions && fromSuggestions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {fromSuggestions.map((airport) => (
                                            <button
                                                key={airport.iataCode}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                                                onClick={() => handleAirportSelect(airport, 'from')}
                                            >
                                                <div className="font-medium text-gray-700">{airport.cityName} ({airport.iataCode})</div>
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
                                    className={inputClasses}
                                    value={searchParams.flights.to}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchParams(prev => ({
                                            ...prev,
                                            flights: { ...prev.flights, to: value, toCode: '' }
                                        }));
                                        handleAirportSearch(value, 'to');
                                    }}
                                />
                                {isLoadingTo && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                                {showToSuggestions && toSuggestions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {toSuggestions.map((airport) => (
                                            <button
                                                key={airport.iataCode}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                                                onClick={() => handleAirportSelect(airport, 'to')}
                                            >
                                                <div className="font-medium text-gray-700">{airport.cityName} ({airport.iataCode})</div>
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
                                selected={searchParams.flights.departDate}
                                onChange={(date) => setSearchParams({

                                    ...searchParams,
                                    flights: { ...searchParams.flights, departDate: date }
                                })}
                                placeholderText="Departure Date"
                                className={datePickerClasses}
                                minDate={new Date()}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                            <DatePicker
                                selected={searchParams.flights.returnDate}
                                onChange={(date) => setSearchParams({
                                    ...searchParams,
                                    flights: { ...searchParams.flights, returnDate: date }
                                })}
                                placeholderText="Return Date"
                                className={datePickerClasses}
                                minDate={searchParams.flights.departDate || new Date()}
                            />
                        </div>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select
                                className={selectClasses}
                                value={searchParams.flights.class}
                                onChange={(e) => setSearchParams({
                                    ...searchParams,
                                    flights: { ...searchParams.flights, class: e.target.value }
                                })}
                            >
                                <option value="economy">Economy</option>
                                <option value="business">Business</option>
                                <option value="first">First Class</option>
                            </select>
                        </div>
                    </div>
                );

            case 'cars':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Pickup Location"
                                className={inputClasses}
                                value={searchParams.cars.location}
                                onChange={(e) => setSearchParams(prev => ({
                                    ...prev,
                                    cars: { ...prev.cars, location: e.target.value }
                                }))}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                            <DatePicker
                                selected={searchParams.cars.pickupDate}
                                onChange={(date) => setSearchParams({
                                    ...searchParams,
                                    cars: { ...searchParams.cars, pickupDate: date }
                                })}
                                placeholderText="Pickup Date"
                                className={datePickerClasses}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                            <DatePicker
                                selected={searchParams.cars.returnDate}
                                onChange={(date) => setSearchParams({
                                    ...searchParams,
                                    cars: { ...searchParams.cars, returnDate: date }
                                })}
                                placeholderText="Return Date"
                                className={datePickerClasses}
                            />
                        </div>
                        <div className="relative">
                            <Car className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select
                                className={selectClasses}
                                value={searchParams.cars.carType}
                                onChange={(e) => setSearchParams({
                                    ...searchParams,
                                    cars: { ...searchParams.cars, carType: e.target.value }
                                })}
                            >
                                <option value="any">Any Type</option>
                                <option value="economy">Economy</option>
                                <option value="compact">Compact</option>
                                <option value="midsize">Midsize</option>
                                <option value="suv">SUV</option>
                                <option value="luxury">Luxury</option>
                            </select>
                        </div>
                    </div>
                );

            case 'hotels':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className={inputClasses}
                                value={searchParams.hotels.location}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchParams(prev => ({
                                        ...prev,
                                        hotels: { ...prev.hotels, location: value, locationCode: '' }
                                    }));
                                    handleCitySearch(value);
                                }}
                            />
                            {isLoadingCity && (
                                <div className="absolute right-3 top-3">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            {showCitySuggestions && citySuggestions.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {citySuggestions.map((city) => (
                                        <button
                                            key={city.cityCode}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                                            onClick={() => handleCitySelect(city)}
                                        >
                                            <div className="font-medium text-gray-700">{city.name}</div>
                                            <div className="text-sm text-gray-500">{city.countryName}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                            <DatePicker
                                selected={searchParams.hotels.checkIn}
                                onChange={(date) => setSearchParams({
                                    ...searchParams,
                                    hotels: { ...searchParams.hotels, checkIn: date }
                                })}
                                placeholderText="Check-in Date"
                                className={datePickerClasses}
                                minDate={new Date()}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                            <DatePicker
                                selected={searchParams.hotels.checkOut}
                                onChange={(date) => setSearchParams({
                                    ...searchParams,
                                    hotels: { ...searchParams.hotels, checkOut: date }
                                })}
                                placeholderText="Check-out Date"
                                className={datePickerClasses}
                                minDate={searchParams.hotels.checkIn || new Date()}
                            />
                        </div>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select
                                className={selectClasses}
                                value={searchParams.hotels.rooms}
                                onChange={(e) => setSearchParams({
                                    ...searchParams,
                                    hotels: { ...searchParams.hotels, rooms: Number(e.target.value) }
                                })}
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );

            case 'cruises':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Destination"
                                className={inputClasses}
                                value={searchParams.cruises.destination}
                                onChange={(e) => setSearchParams(prev => ({
                                    ...prev,
                                    cruises: { ...prev.cruises, destination: e.target.value }
                                }))}
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Departure Port"
                                className={inputClasses}
                                value={searchParams.cruises.departurePort}
                                onChange={(e) => setSearchParams(prev => ({
                                    ...prev,
                                    cruises: { ...prev.cruises, departurePort: e.target.value }
                                }))}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                            <DatePicker
                                selected={searchParams.cruises.departureDate}
                                onChange={(date) => setSearchParams({
                                    ...searchParams,
                                    cruises: { ...searchParams.cruises, departureDate: date }
                                })}
                                placeholderText="Departure Date"
                                className={datePickerClasses}
                            />
                        </div>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select
                                className={selectClasses}
                                value={searchParams.cruises.duration}
                                onChange={(e) => setSearchParams({
                                    ...searchParams,
                                    cruises: { ...searchParams.cruises, duration: e.target.value }
                                })}
                            >
                                <option value="any">Any Duration</option>
                                <option value="3-5">3-5 Days</option>
                                <option value="6-9">6-9 Days</option>
                                <option value="10-14">10-14 Days</option>
                                <option value="15+">15+ Days</option>
                            </select>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest('.airport-search')) {
                setShowFromSuggestions(false);
                setShowToSuggestions(false);
                setShowCitySuggestions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-wrap gap-4 mb-6">
                {searchOptions.map(({ type, icon: Icon, label }) => (
                    <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSearch(type)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            activeSearch === type
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </motion.button>
                ))}
            </div>

            <div className="space-y-6">
                {renderSearchForm()}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSearch(activeSearch)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Search size={20} />
                    Search {activeSearch.charAt(0).toUpperCase() + activeSearch.slice(1)}
                </motion.button>
            </div>
        </div>
    );
};

export default TravelSearch;