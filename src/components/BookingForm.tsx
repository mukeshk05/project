import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard } from 'lucide-react';

interface BookingFormProps {
  destinationId: string;
  destinationName: string;
  pricePerNight: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ destinationId, destinationName, pricePerNight }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights * pricePerNight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationId,
          checkIn,
          checkOut,
          travelers,
          totalPrice: calculateTotalPrice(),
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      navigate('/bookings');
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book Your Stay at {destinationName}</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Check-in Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Check-out Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Number of Travelers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              min="1"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Price per night:</span>
              <span>${pricePerNight}</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>Total Price:</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <CreditCard size={20} />
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;