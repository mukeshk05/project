import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Star, Clock, Plane, Car, Ship, Building, ArrowLeft } from 'lucide-react';
import BookingForm from './BookingForm';
import ActivityList from './ActivityList';

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  const destination = {
    id: '1',
    name: 'Santorini, Greece',
    description: 'Experience the stunning beauty of Santorini, with its iconic white-washed buildings perched on dramatic cliffs overlooking the crystal-clear Aegean Sea. This volcanic island offers breathtaking sunsets, rich history, and world-class cuisine.',
    location: {
      country: 'Greece',
      city: 'Santorini'
    },
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1571406384350-d2cdb3607475?auto=format&fit=crop&q=80&w=2000',
      'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&q=80&w=2000'
    ],
    basePrice: 1299,
    rating: 4.8,
    amenities: [
      'Private Beach Access',
      'Infinity Pool',
      'Spa Services',
      'Gourmet Restaurants',
      'Wine Tasting',
      'Sunset Terrace',
      'Water Sports'
    ],
    type: 'beach',
    reviews: [
      {
        userId: '1',
        userName: 'Sarah M.',
        rating: 5,
        comment: 'Absolutely breathtaking! The views are even better in person.',
        date: '2024-02-15'
      },
      {
        userId: '2',
        userName: 'John D.',
        rating: 4.5,
        comment: 'Amazing experience. The local food was incredible.',
        date: '2024-02-10'
      }
    ],
    nearbyAttractions: [
      {
        name: 'Oia Castle',
        distance: '1.2 km',
        type: 'Historical'
      },
      {
        name: 'Red Beach',
        distance: '3.5 km',
        type: 'Beach'
      },
      {
        name: 'Ancient Thera',
        distance: '5.8 km',
        type: 'Archaeological'
      }
    ],
    weather: [
      {
        season: 'Summer',
        temperature: '25-30°C',
        description: 'Warm and sunny with clear skies'
      },
      {
        season: 'Winter',
        temperature: '12-18°C',
        description: 'Mild with occasional rain'
      }
    ],
    transportation: [
      {
        type: 'Airport',
        details: 'Santorini International Airport (JTR) - 15 min drive'
      },
      {
        type: 'Ferry',
        details: 'Athinios Port - 20 min drive'
      },
      {
        type: 'Local',
        details: 'Bus service and taxi available'
      }
    ]
  };

  const tabVariants = {
    inactive: {
      opacity: 0.6,
      y: 0
    },
    active: {
      opacity: 1,
      y: -2,
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <p className="text-gray-600 leading-relaxed">{destination.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {destination.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="text-yellow-400" size={16} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Weather</h3>
                {destination.weather.map((season, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-medium">{season.season}</h4>
                    <p className="text-gray-600">{season.temperature}</p>
                    <p className="text-sm text-gray-500">{season.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'things-to-do':
        return (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <ActivityList destinationId={id || ''} />
          </motion.div>
        );

      case 'transportation':
        return (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {destination.transportation.map((transport, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                {transport.type === 'Airport' && <Plane className="text-blue-500 mb-3" size={24} />}
                {transport.type === 'Ferry' && <Ship className="text-blue-500 mb-3" size={24} />}
                {transport.type === 'Local' && <Car className="text-blue-500 mb-3" size={24} />}
                <h3 className="font-semibold mb-2">{transport.type}</h3>
                <p className="text-gray-600">{transport.details}</p>
              </div>
            ))}
          </motion.div>
        );

      case 'attractions':
        return (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {destination.nearbyAttractions.map((attraction, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <Building className="text-blue-500 mb-3" size={24} />
                <h3 className="font-semibold mb-2">{attraction.name}</h3>
                <p className="text-gray-600">{attraction.type}</p>
                <p className="text-sm text-gray-500">{attraction.distance} away</p>
              </div>
            ))}
          </motion.div>
        );

      case 'reviews':
        return (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {destination.reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{review.userName}</h3>
                      <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Destinations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={destination.images[selectedImage]}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {destination.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full ${
                        selectedImage === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">{destination.name}</h1>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="text-lg font-semibold">{destination.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-400" size={20} />
                    <span>{destination.location.city}, {destination.location.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={20} />
                    <span>Best Time: April - October</span>
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-6">
                  <div className="flex gap-6">
                    {['overview', 'things-to-do', 'transportation', 'attractions', 'reviews'].map((tab) => (
                      <motion.button
                        key={tab}
                        variants={tabVariants}
                        initial="inactive"
                        animate={activeTab === tab ? "active" : "inactive"}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize ${
                          activeTab === tab
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-500'
                        }`}
                      >
                        {tab.replace('-', ' ')}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {renderTabContent()}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm
                destinationId={destination.id}
                destinationName={destination.name}
                pricePerNight={destination.basePrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;