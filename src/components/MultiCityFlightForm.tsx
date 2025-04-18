import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Users, Plus, Minus, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface FlightLeg {
  from: string;
  to: string;
  date: Date | null;
}

interface MultiCityFlightFormProps {
  onSearch: (legs: FlightLeg[]) => void;
}

const MultiCityFlightForm: React.FC<MultiCityFlightFormProps> = ({ onSearch }) => {
  const [flightLegs, setFlightLegs] = useState<FlightLeg[]>([
    { from: '', to: '', date: null },
    { from: '', to: '', date: null },
  ]);
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');

  const addLeg = () => {
    if (flightLegs.length < 6) {
      setFlightLegs([...flightLegs, { from: '', to: '', date: null }]);
    }
  };

  const removeLeg = (index: number) => {
    if (flightLegs.length > 2) {
      setFlightLegs(flightLegs.filter((_, i) => i !== index));
    }
  };

  const updateLeg = (index: number, field: keyof FlightLeg, value: string | Date | null) => {
    const newLegs = [...flightLegs];
    newLegs[index] = { ...newLegs[index], [field]: value };
    setFlightLegs(newLegs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(flightLegs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence>
        {flightLegs.map((leg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From
              </label>
              <div className="relative">
                <Plane className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={leg.from}
                  onChange={(e) => updateLeg(index, 'from', e.target.value)}
                  placeholder="City or airport"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <div className="relative">
                <Plane className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={leg.to}
                  onChange={(e) => updateLeg(index, 'to', e.target.value)}
                  placeholder="City or airport"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                <DatePicker
                  selected={leg.date}
                  onChange={(date) => updateLeg(index, 'date', date)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholderText="Select date"
                  minDate={new Date()}
                />
              </div>
              {index >= 2 && (
                <button
                  type="button"
                  onClick={() => removeLeg(index)}
                  className="absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Minus size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <motion.button
          type="button"
          onClick={addLeg}
          disabled={flightLegs.length >= 6}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Add Flight
        </motion.button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-gray-400" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <Search size={20} />
        Search Flights
      </motion.button>
    </form>
  );
};

export default MultiCityFlightForm;