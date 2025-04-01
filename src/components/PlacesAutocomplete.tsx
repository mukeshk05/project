import React from 'react';
import { useCombobox } from 'downshift';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { MapPin } from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';

interface PlacesAutocompleteProps {
  onSelect: (location: { lat: number; lng: number; address: string }) => void;
  placeholder?: string;
  className?: string;
}

const libraries = ["places"] as const;

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({ 
  onSelect, 
  placeholder = "Search for a location...",
  className = ""
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['(cities)'],
    },
    debounce: 300,
    enabled: isLoaded,
    cache: 24 * 60 * 60,
  });

  const items = React.useMemo(() => {
    return status === "OK" ? data : [];
  }, [status, data]);

  const combobox = useCombobox({
    id: 'places-search',
    items,
    inputValue: value,
    onInputValueChange: ({ inputValue }) => {
      setValue(inputValue || '');
    },
    itemToString: (item) => (item ? item.description : ''),
    onSelectedItemChange: async ({ selectedItem }) => {
      if (selectedItem) {
        setValue(selectedItem.description, false);
        clearSuggestions();

        try {
          const results = await getGeocode({ address: selectedItem.description });
          const { lat, lng } = await getLatLng(results[0]);
          onSelect({ lat, lng, address: selectedItem.description });
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    },
  });

  if (loadError) {
    return (
      <div className={`relative ${className}`}>
        <div className="text-red-600 p-4 border border-red-200 rounded-lg">
          Error loading Google Maps API. Please check your API key.
        </div>
      </div>
    );
  }

  if (!isLoaded || !ready) {
    return (
      <div className={`relative ${className}`}>
        <MapPin className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
        <input
          type="text"
          disabled
          placeholder="Loading..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div {...combobox.getComboboxProps()}>
        <MapPin className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
        <input
          {...combobox.getInputProps({
            placeholder,
            className: "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
          })}
        />
      </div>

      <ul
        {...combobox.getMenuProps()}
        className={`absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 border ${
          combobox.isOpen && items.length > 0 ? '' : 'hidden'
        }`}
      >
        {combobox.isOpen &&
          items.map((item, index) => (
            <li
              key={item.place_id}
              {...combobox.getItemProps({
                item,
                index,
                'aria-selected': combobox.highlightedIndex === index,
                className: `px-4 py-2 cursor-pointer ${
                  combobox.highlightedIndex === index
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`,
              })}
            >
              {item.description}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PlacesAutocomplete;