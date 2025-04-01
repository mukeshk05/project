import React, { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { MapPin, Loader } from 'lucide-react';

interface PlacesAutocompleteProps {
  placeholder?: string;
  onSelect: (details: {
    description: string;
    placeId: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }) => void;
  type?: 'airport' | 'city' | 'port' | 'hotel';
  className?: string;
  initialValue?: string;
}

const libraries = ["places"] as const;

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  placeholder = "Search locations...",
  onSelect,
  type = 'city',
  className = "",
  initialValue = ""
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    version: "weekly"
  });

  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: [
        type === 'airport' ? 'airport' :
        type === 'city' ? '(cities)' :
        type === 'port' ? 'establishment' :
        type === 'hotel' ? 'lodging' : 
        'establishment'
      ],
    },
    debounce: 300,
    enabled: isLoaded,
    defaultValue: initialValue,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setValue(newValue);
  };

  const handleSelect = async (description: string, placeId: string) => {
    setInputValue(description);
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ placeId });
      const { lat, lng } = await getLatLng(results[0]);
      
      onSelect({
        description,
        placeId,
        coordinates: { lat, lng }
      });
    } catch (error) {
      console.error("Error getting geocode: ", error);
    }
  };

  if (!apiKey) {
    return (
      <div className="relative">
        <div className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 text-gray-500">
          Google Maps API key is missing
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="relative">
        <div className="w-full pl-10 pr-4 py-2 border rounded-lg bg-red-50 text-red-600">
          Error loading Google Maps API
        </div>
      </div>
    );
  }

  if (!isLoaded || !ready) {
    return (
      <div className="relative">
        <div className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-center">
            <Loader className="animate-spin text-gray-400" size={20} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {status === "OK" && inputValue && (
        <ul className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-auto">
          {data.map((suggestion) => {
            const {
              place_id,
              description,
              structured_formatting: {
                main_text,
                secondary_text
              } = { main_text: '', secondary_text: '' }
            } = suggestion;

            return (
              <li
                key={place_id}
                onClick={() => handleSelect(description, place_id)}
                className="px-4 py-2 cursor-pointer hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">{main_text}</div>
                    {secondary_text && (
                      <div className="text-sm text-gray-500">{secondary_text}</div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PlacesAutocomplete;