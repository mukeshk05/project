import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Wifi, Coffee, Users, Calendar, Phone, Globe, Clock, DollarSign } from 'lucide-react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { HotelOffer } from '../services/searchApi';

interface HotelDetailsDialogProps {
    hotel: HotelOffer | null;
    onClose: () => void;
}

const HotelDetailsDialog: React.FC<HotelDetailsDialogProps> = ({ hotel, onClose }) => {
    const [selectedRoom, setSelectedRoom] = React.useState<number | null>(null);
    const [showMap, setShowMap] = React.useState(true);

    if (!hotel) return null;

    const mapCenter = {
        lat: hotel.hotel.latitude,
        lng: hotel.hotel.longitude
    };

    const mapOptions = {
        styles: [
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
            },
            {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [{ color: "#ffffff" }, { lightness: 17 }]
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }, { lightness: 21 }]
            }
        ],
        disableDefaultUI: true,
        zoomControl: true
    };

    const dialogVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    };

    const markerAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    variants={dialogVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
                >
                    <div className="relative h-64 md:h-96">
                        {showMap ? (
                            <div className="absolute inset-0">
                                <GoogleMap
                                    mapContainerClassName="w-full h-full rounded-t-2xl"
                                    center={mapCenter}
                                    zoom={15}
                                    options={mapOptions}
                                >
                                    <motion.div animate={markerAnimation}>
                                        <Marker
                                            position={mapCenter}
                                            icon={{
                                                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                                scaledSize: new google.maps.Size(40, 40)
                                            }}
                                        />
                                    </motion.div>
                                </GoogleMap>
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <MapPin size={16} />
                                        {hotel.cityCode}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-24rem)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">{hotel.hotel.name}</h2>
                                <div className="flex items-center gap-2 mb-4">
                                    {Array.from({ length: parseInt(hotel.hotel.rating) }).map((_, i) => (
                                        <Star key={i} className="text-yellow-400 fill-current" size={20} />
                                    ))}
                                    <span className="text-gray-600">({hotel.hotel.rating} Stars)</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={20} />
                                        <span>{hotel.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Globe size={20} />
                                        <span>{hotel.cityCode}</span>
                                    </div>
                                    {hotel.hotel.amenities && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {hotel.hotel.amenities.map((amenity, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                                >
                          {amenity}
                        </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">Available Rooms</h3>
                                {hotel.offers.map((offer, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-4 rounded-lg border transition-all ${
                                            selectedRoom === index
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                        onClick={() => setSelectedRoom(index)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">{offer.room.type}</h4>
                                                <p className="text-sm text-gray-600">{offer.room.description.text}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    ${parseFloat(offer.price.total).toFixed(2)}
                                                </div>
                                                <span className="text-sm text-gray-500">per night</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users size={16} />
                                                <span>Up to {offer.guests.adults} guests</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={16} />
                                                <span>{offer.checkInDate} - {offer.checkOutDate}</span>
                                            </div>
                                        </div>

                                        {selectedRoom === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 pt-4 border-t"
                                            >
                                                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                                    Book Now
                                                </button>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
                    >
                        <X size={24} />
                    </motion.button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HotelDetailsDialog;