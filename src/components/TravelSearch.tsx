import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Car, Building, Ship, Calendar, Users, MapPin, Search, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "react-google-autocomplete";
import { TextField,Input } from '@mui/material';

type SearchType = 'flights' | 'cars' | 'hotels' | 'cruises';




const TravelSearch: React.FC = () => {
  const navigate = useNavigate();
  const [activeSearch, setActiveSearch] = useState<SearchType>('flights');
  const [searchParams, setSearchParams] = useState({
    flights: {
      from: '',
      to: '',
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

  const updateSearchParam = (updates) => {
        setSearchParams(prevState => ({
            ...prevState,
            ...updates,
        }));
    };

  const handleSearch = (type: SearchType) => {
    const params = new URLSearchParams();
    
    switch (type) {
      case 'flights':
        if (searchParams.flights.from) {
          params.append('from', searchParams.flights.from);
        }
        if (searchParams.flights.to) {
          params.append('to', searchParams.flights.to);
        }
        if (searchParams.flights.departDate) params.append('departDate', searchParams.flights.departDate.toISOString());
        if (searchParams.flights.returnDate) params.append('returnDate', searchParams.flights.returnDate.toISOString());
        params.append('passengers', searchParams.flights.passengers.toString());
        params.append('class', searchParams.flights.class);
        navigate(`/search/flights?${params.toString()}`);
        break;

      case 'cars':
        if (searchParams.cars.location) {
          params.append('location', searchParams.cars.location);
        }
        if (searchParams.cars.pickupDate) params.append('pickupDate', searchParams.cars.pickupDate.toISOString());
        if (searchParams.cars.returnDate) params.append('returnDate', searchParams.cars.returnDate.toISOString());
        params.append('carType', searchParams.cars.carType);
        navigate(`/search/cars?${params.toString()}`);
        break;

      case 'hotels':
        if (searchParams.hotels.location) {
          params.append('location', searchParams.hotels.location);
        }
        if (searchParams.hotels.checkIn) params.append('checkIn', searchParams.hotels.checkIn.toISOString());
        if (searchParams.hotels.checkOut) params.append('checkOut', searchParams.hotels.checkOut.toISOString());
        params.append('guests', searchParams.hotels.guests.toString());
        params.append('rooms', searchParams.hotels.rooms.toString());
        navigate(`/search/hotels?${params.toString()}`);
        break;

      case 'cruises':
        if (searchParams.cruises.destination) {
          params.append('destination', searchParams.cruises.destination);
        }
        if (searchParams.cruises.departurePort) {
          params.append('departurePort', searchParams.cruises.departurePort);
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
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    switch (activeSearch) {
      case 'flights':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div style={{ width: "250px" }}>
                    <Input
                        placeholder={"From Flights"}
                        fullWidth
                        color="secondary"
                        inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
                            <Autocomplete
                                apiKey={apiKey}
                                {...props}
                                onPlaceSelected={(selected) =>  setSearchParams({
                                    ...searchParams,
                                    flights: {
                                        ...searchParams.flights,
                                        from: selected.name.toString()
                                    }
                                })
                                }
                                options={{
                                    types: ['airport'], // Filter results by airports
                                    fields: ['formatted_address', 'geometry', 'name'],
                                }}
                            />
                        )}
                    />

                </div>

                <div style={{ width: "250px" }}>
                    <Input
                        placeholder={"To Flights"}
                        fullWidth
                        color="secondary"
                        inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
                            <Autocomplete
                                apiKey={apiKey}
                                {...props}
                                onPlaceSelected={(selected) => console.log(selected)}
                                options={{
                                    types: ['airport'], // Filter results by airports
                                    fields: ['formatted_address', 'geometry', 'name'],
                                }}
                            />
                        )}
                    />

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
              type="city"
              initialValue={searchParams.cars.location}
              onSelect={(location) => setSearchParams({
                ...searchParams,
                cars: {
                  ...searchParams.cars,
                  location: location.description,
                  pickupLocation: location
                }
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
              type="hotel"
              initialValue={searchParams.hotels.location}
              onSelect={(location) => setSearchParams({
                ...searchParams,
                hotels: {
                  ...searchParams.hotels,
                  location: location.description,
                  searchLocation: location
                }
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
              type="city"
              initialValue={searchParams.cruises.destination}
              onSelect={(location) => setSearchParams({
                ...searchParams,
                cruises: {
                  ...searchParams.cruises,
                  destination: location.description,
                  destinationLocation: location
                }
              })}
            />
            <PlacesAutocomplete
              placeholder="Departure Port"
              type="port"
              initialValue={searchParams.cruises.departurePort}
              onSelect={(location) => setSearchParams({
                ...searchParams,
                cruises: {
                  ...searchParams.cruises,
                  departurePort: location.description,
                  departureLocation: location
                }
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