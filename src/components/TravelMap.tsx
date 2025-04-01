import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface Location {
  id: string;
  name: string;
  type: 'destination' | 'package';
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  image?: string;
  price: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 20,
  lng: 0,
};

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const TravelMap: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locations] = useState<Location[]>([
    {
      id: '1',
      name: 'Santorini, Greece',
      type: 'destination',
      coordinates: { lat: 36.3932, lng: 25.4615 },
      description: 'Beautiful island with white-washed buildings and stunning sunsets',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800',
      price: 1299,
    },
    {
      id: '2',
      name: 'Bali, Indonesia',
      type: 'destination',
      coordinates: { lat: -8.4095, lng: 115.1889 },
      description: 'Tropical paradise with rich culture and beautiful beaches',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
      price: 899,
    },
    {
      id: '3',
      name: 'European Adventure',
      type: 'package',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      description: '14-day tour through Paris, Rome, and Barcelona',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800',
      price: 2499,
    },
  ]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocation(location);
    if (map) {
      map.panTo(location.coordinates);
      map.setZoom(8);
    }
  }, [map]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 text-red-600">
        Error loading maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Locations</h3>
        <div className="space-y-2">
          {locations.map((location) => (
            <motion.button
              key={location.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMarkerClick(location)}
              className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {location.type === 'destination' ? (
                <MapPin className="text-red-500" size={20} />
              ) : (
                <Navigation className="text-blue-500" size={20} />
              )}
              <span>{location.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={2}
        center={defaultCenter}
        onLoad={onMapLoad}
        options={{
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
            },
          ],
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            onClick={() => handleMarkerClick(location)}
            icon={{
              url: location.type === 'destination'
                ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
          />
        ))}
      </GoogleMap>

      {selectedLocation && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <img
            src={selectedLocation.image}
            alt={selectedLocation.name}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
          <h3 className="text-lg font-semibold">{selectedLocation.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{selectedLocation.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-semibold">
              ${selectedLocation.price}
            </span>
            <button className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelMap;