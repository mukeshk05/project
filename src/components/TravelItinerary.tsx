import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Plane, Hotel, MapPin, Calendar, Clock, Coffee, Sun, Umbrella, Info, Mail, Share2 } from 'lucide-react';
import { format } from 'date-fns';

interface TravelItineraryProps {
  booking: {
    id: string;
    destination: string;
    checkIn: Date;
    checkOut: Date;
    travelers: number;
    flight?: {
      departure: string;
      arrival: string;
      airline: string;
      flightNumber: string;
    };
    hotel?: {
      name: string;
      address: string;
      checkInTime: string;
      checkOutTime: string;
    };
  };
}

const TravelItinerary: React.FC<TravelItineraryProps> = ({ booking }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/itineraries/${booking.id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `travel-itinerary-${booking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareItinerary = async (email: string) => {
    try {
      await fetch(`/api/itineraries/${booking.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email }),
      });
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing itinerary:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const travelTips = [
    {
      icon: Sun,
      title: 'Weather',
      tip: 'Pack according to the local weather forecast. Bring layers and rain protection just in case.',
    },
    {
      icon: Coffee,
      title: 'Local Customs',
      tip: 'Research local customs and etiquette. Learn a few basic phrases in the local language.',
    },
    {
      icon: Umbrella,
      title: 'Insurance',
      tip: 'Consider travel insurance for peace of mind. Keep emergency contact numbers handy.',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-bold">Travel Itinerary</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <Share2 size={20} />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Download size={20} />
            )}
            Download PDF
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trip Overview */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold">Destination</h3>
              <p>{booking.destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold">Dates</h3>
              <p>
                {format(new Date(booking.checkIn), 'MMM d, yyyy')} -{' '}
                {format(new Date(booking.checkOut), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {booking.flight && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="text-blue-600" size={24} />
                <h3 className="font-semibold">Flight Details</h3>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Airline:</span> {booking.flight.airline}
                </p>
                <p>
                  <span className="font-medium">Flight:</span> {booking.flight.flightNumber}
                </p>
                <p>
                  <span className="font-medium">Departure:</span> {booking.flight.departure}
                </p>
                <p>
                  <span className="font-medium">Arrival:</span> {booking.flight.arrival}
                </p>
              </div>
            </div>
          )}

          {booking.hotel && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Hotel className="text-green-600" size={24} />
                <h3 className="font-semibold">Hotel Details</h3>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {booking.hotel.name}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {booking.hotel.address}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{booking.hotel.checkInTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{booking.hotel.checkOutTime}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Travel Tips */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xl font-semibold">Travel Tips</h3>
          <div className="space-y-4">
            {travelTips.map((tip, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <tip.icon className="text-blue-600" size={20} />
                  <h4 className="font-medium">{tip.title}</h4>
                </div>
                <p className="text-gray-600">{tip.tip}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Info className="text-yellow-600" size={20} />
              <h4 className="font-medium">Important Information</h4>
            </div>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Keep a copy of your passport and travel documents</li>
              <li>Save emergency contact numbers</li>
              <li>Check local COVID-19 guidelines and requirements</li>
              <li>Download offline maps for your destination</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Share Itinerary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => shareItinerary('example@email.com')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TravelItinerary;