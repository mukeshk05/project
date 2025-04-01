import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Car, Building, Ship, Calendar, Users, MapPin, Search, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete from './PlacesAutocomplete';
import "react-datepicker/dist/react-datepicker.css";

type SearchType = 'flights' | 'cars' | 'hotels' | 'cruises';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const TravelSearch: React.FC = () => {
  const navigate = useNavigate();
  const [activeSearch, setActiveSearch] = useState<SearchType>('flights');
  const [searchParams, setSearchParams] = useState({
    flights: {
      from: '',
      fromLocation: null as Location | null,
      to: '',
      toLocation: null as Location | null,
      departDate: null as Date | null,
      returnDate: null as Date | null,
      passengers: 1,
      class: 'economy'
    },
    cars: {
      location: '',
      pickupLocation: null as Location | null,
      pickupDate: null as Date | null,
      returnDate: null as Date | null,
      carType: 'any'
    },
    hotels: {
      location: '',
      searchLocation: null as Location | null,
      checkIn: null as Date | null,
      checkOut: null as Date | null,
      guests: 1,
      rooms: 1
    },
    cruises: {
      destination: '',
      destinationLocation: null as Location | null,
      departurePort: '',
      departureLocation: null as Location | null,
      departureDate: null as Date | null,
      duration: 'any'
    }
  });

  const handleSearch = (type: SearchType) => {
    const params = new URLSearchParams();
    
    switch (type) {
      case 'flights':
        if (searchParams.flights.fromLocation) {
          params.append('fromLat', searchParams.flights.fromLocation.lat.toString());
          params.append('fromLng', searchParams.flights.fromLocation.lng.toString());
          params.append('from', searchParams.flights.fromLocation.address);
        }
        if (searchParams.flights.toLocation) {
          params.append('toLat', searchParams.flights.toLocation.lat.toString());
          params.append('toLng', searchParams.flights.toLocation.lng.toString());
          params.append('to', searchParams.flights.toLocation.address);
        }
        if (searchParams.flights.departDate) params.append('departDate', searchParams.flights.departDate.toISOString());
        if (searchParams.flights.returnDate) params.append('returnDate', searchParams.flights.returnDate.toISOString());
        params.append('passengers', searchParams.flights.passengers.toString());
        params.append('class', searchParams.flights.class);
        navigate(`/search/flights?${params.toString()}`);
        break;

      case 'cars':
        if (searchParams.cars.pickupLocation) {
          params.append('lat', searchParams.cars.pickupLocation.lat.toString());
          params.append('lng', searchParams.cars.pickupLocation.lng.toString());
          params.append('location', searchParams.cars.pickupLocation.address);
        }
        if (searchParams.cars.pickupDate) params.append('pickupDate', searchParams.cars.pickupDate.toISOString());
        if (searchParams.cars.returnDate) params.append('returnDate', searchParams.cars.returnDate.toISOString());
        params.append('carType', searchParams.cars.carType);
        navigate(`/search/cars?${params.toString()}`);
        break;

      case 'hotels':
        if (searchParams.hotels.searchLocation) {
          params.append('lat', searchParams.hotels.searchLocation.lat.toString());
          params.append('lng', searchParams.hotels.searchLocation.lng.toString());
          params.append('location', searchParams.hotels.searchLocation.address);
        }
        if (searchParams.hotels.checkIn) params.append('checkIn', searchParams.hotels.checkIn.toISOString());
        if (searchParams.hotels.checkOut) params.append('checkOut', searchParams.hotels.checkOut.toISOString());
        params.append('guests', searchParams.hotels.guests.toString());
        params.append('rooms', searchParams.hotels.rooms.toString());
        navigate(`/search/hotels?${params.toString()}`);
        break;

      case 'cruises':
        if (searchParams.cruises.destinationLocation) {
          params.append('destLat', searchParams.cruises.destinationLocation.lat.toString());
          params.append('destLng', searchParams.cruises.destinationLocation.lng.toString());
          params.append('destination', searchParams.cruises.destinationLocation.address);
        }
        if (searchParams.cruises.departureLocation) {
          params.append('portLat', searchParams.cruises.departureLocation.lat.toString());
          params.append('portLng', searchParams.cruises.departureLocation.lng.toString());
          params.append('departurePort', searchParams.cruises.departureLocation.address);
        }
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
    switch (activeSearch) {
      case 'flights':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlacesAutocomplete
                placeholder="From"
                onSelect={(location) => setSearchParams({
                  ...searchParams,
                  flights: { ...searchParams.flights, fromLocation: location }
                })}
              />
              <PlacesAutocomplete
                placeholder="To"
                onSelect={(location) => setSearchParams({
                  ...searchParams,
                  flights: { ...searchParams.flights, toLocation: location }
                })}
              />
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <PlacesAutocomplete
              placeholder="Pickup Location"
              onSelect={(location) => setSearchParams({
                ...searchParams,
                cars: { ...searchParams.cars, pickupLocation: location }
              })}
            />
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <DatePicker
                selected={searchParams.cars.pickupDate}
                onChange={(date) => setSearchParams({
                  ...searchParams,
                  cars: { ...searchParams.cars, pickupDate: date }
                })}
                placeholderText="Pickup Date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Car className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <PlacesAutocomplete
              placeholder="Where are you going?"
              onSelect={(location) => setSearchParams({
                ...searchParams,
                hotels: { ...searchParams.hotels, searchLocation: location }
              })}
            />
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <DatePicker
                selected={searchParams.hotels.checkIn}
                onChange={(date) => setSearchParams({
                  ...searchParams,
                  hotels: { ...searchParams.hotels, checkIn: date }
                })}
                placeholderText="Check-in Date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <PlacesAutocomplete
              placeholder="Destination"
              onSelect={(location) => setSearchParams({
                ...searchParams,
                cruises: { ...searchParams.cruises, destinationLocation: location }
              })}
            />
            <PlacesAutocomplete
              placeholder="Departure Port"
              onSelect={(location) => setSearchParams({
                ...searchParams,
                cruises: { ...searchParams.cruises, departureLocation: location }
              })}
            />
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <DatePicker
                selected={searchParams.cruises.departureDate}
                onChange={(date) => setSearchParams({
                  ...searchParams,
                  cruises: { ...searchParams.cruises, departureDate: date }
                })}
                placeholderText="Departure Date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                ? 'bg-blue-600 text-white'
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
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Search {activeSearch.charAt(0).toUpperCase() + activeSearch.slice(1)}
        </motion.button>
      </div>
    </div>
  );
};

export default TravelSearch;