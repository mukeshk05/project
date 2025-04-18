import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Star, MapPin, Wifi, Coffee, Users, Calendar, Phone, Globe, Clock,
    DollarSign, Shield, Info, CreditCard, AlertCircle, Bed, Check,
    ChevronDown, ChevronUp, Utensils, ParkingMeter as Parking, SwissFranc as Swim,
    ThumbsUp, ThumbsDown, MessageCircle, BarChart, Building, Home
} from 'lucide-react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { HotelOffer, getHotelRatings, HotelRating } from '../services/searchApi';


interface HotelDetailsDialogProps {
    hotel: HotelOffer | null;
    onClose: () => void;
}

const HotelDetailsDialog: React.FC<HotelDetailsDialogProps> = ({ hotel, onClose }) => {
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [showMap, setShowMap] = useState(true);
    const [activeTab, setActiveTab] = useState<'rooms' | 'policies' | 'amenities' | 'ratings'>('rooms');
    const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
    const [ratings, setRatings] = useState<HotelRating | null>(null);
    const [isLoadingRatings, setIsLoadingRatings] = useState(false);

    useEffect(() => {
        const fetchRatings = async () => {
            if (hotel) {
                setIsLoadingRatings(true);
                try {
                    const data = await getHotelRatings(hotel.hotel.hotelId);
                    setRatings(data);
                } catch (error) {
                    console.error('Error fetching ratings:', error);
                } finally {
                    setIsLoadingRatings(false);
                }
            }
        };

        fetchRatings();
    }, [hotel]);

    if (!hotel) return null;

    const mapCenter = {
        lat: hotel.hotel.latitude,
        lng: hotel.hotel.longitude
    };


    const CustomMarker = () => (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: [1, 1.2, 1],
                opacity: 1,
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="relative"
        >
            {/* Ripple effect */}
            <motion.div
                animate={{
                    scale: [1, 2],
                    opacity: [0.5, 0]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
                className="absolute inset-0 bg-blue-500 rounded-full"
                style={{ width: '40px', height: '40px' }}
            />

            {/* Main marker */}
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center">
                    <motion.div
                        animate={{
                            y: [0, -3, 0],
                            rotateZ: [0, -5, 5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Building className="text-white w-5 h-5" />
                    </motion.div>
                </div>

                {/* Shadow */}
                <motion.div
                    animate={{
                        scale: [1, 0.9, 1],
                        opacity: [0.3, 0.2, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm"
                />
            </div>
        </motion.div>
    );


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
            transition: { duration: 0.2 }
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

    const tabVariants = {
        inactive: {
            color: "#6B7280",
            backgroundColor: "transparent",
        },
        active: {
            color: "#2563EB",
            backgroundColor: "#EFF6FF",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    const policyVariants = {
        collapsed: { height: 0, opacity: 0 },
        expanded: {
            height: "auto",
            opacity: 1,
            transition: {
                height: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                },
                opacity: { duration: 0.2 }
            }
        }
    };

    const renderPolicies = () => (
        <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="text-blue-600" size={20} />
                    <h4 className="font-semibold text-blue-800">Important Information</h4>
                </div>
                <p className="text-blue-700 text-sm">Please review our policies carefully before booking.</p>
            </div>

            {['payment', 'cancellation', 'checkin'].map((policy) => (
                <motion.div
                    key={policy}
                    className="border rounded-lg overflow-hidden"
                    initial={false}
                    animate={expandedPolicy === policy ? 'expanded' : 'collapsed'}
                >
                    <button
                        onClick={() => setExpandedPolicy(expandedPolicy === policy ? null : policy)}
                        className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {policy === 'payment' && <CreditCard className="text-green-600" size={20} />}
                            {policy === 'cancellation' && <Shield className="text-red-600" size={20} />}
                            {policy === 'checkin' && <Clock className="text-blue-600" size={20} />}
                            <span className="font-semibold capitalize">{policy} Policy</span>
                        </div>
                        {expandedPolicy === policy ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    <motion.div
                        variants={policyVariants}
                        className="px-4 pb-4"
                    >
                        {policy === 'payment' && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check size={16} className="text-green-500" />
                                    <span>Secure payment processing</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check size={16} className="text-green-500" />
                                    <span>Multiple payment methods accepted</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check size={16} className="text-green-500" />
                                    <span>No hidden fees</span>
                                </div>
                            </div>
                        )}

                        {policy === 'cancellation' && hotel.offers[0]?.policies?.cancellation && (
                            <div className="space-y-2 pt-2">
                                <p className="text-gray-600">{hotel.offers[0].policies.cancellation.description?.text}</p>
                                {hotel.offers[0].policies.cancellation.deadline && (
                                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                                        <AlertCircle size={16} className="text-amber-500" />
                                        <span>Deadline: {new Date(hotel.offers[0].policies.cancellation.deadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {policy === 'checkin' && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock size={16} />
                                    <span>Check-in time: 3:00 PM</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock size={16} />
                                    <span>Check-out time: 11:00 AM</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Info size={16} />
                                    <span>Photo ID required at check-in</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );

    const renderAmenities = () => (
        <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
            {[
                { icon: Wifi, label: 'Free WiFi', category: 'connectivity' },
                { icon: Utensils, label: 'Restaurant', category: 'dining' },
                { icon: Parking, label: 'Parking', category: 'facilities' },
                { icon: Swim, label: 'Swimming Pool', category: 'recreation' },
                { icon: Coffee, label: 'Coffee Shop', category: 'dining' },
                { icon: Bed, label: 'Room Service', category: 'services' },
                ...(hotel.hotel.amenities || []).map(amenity => ({
                    icon: Info,
                    label: amenity,
                    category: 'other'
                }))
            ].map((amenity, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <amenity.icon className="text-blue-600" size={20} />
                    <span className="text-gray-700">{amenity.label}</span>
                </motion.div>
            ))}
        </motion.div>
    );

    const renderRatings = () => {
        if (isLoadingRatings) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (!ratings) return null;

        const sentimentColor = ratings.sentimentScore >= 0.7 ? 'text-green-500' :
            ratings.sentimentScore >= 0.4 ? 'text-yellow-500' : 'text-red-500';

        return (
            <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Overall Rating */}
                <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-3 rounded-full">
                                <Star className="text-yellow-400 w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Overall Rating</h3>
                                <p className="text-gray-600">Based on {ratings.categories.reduce((acc, cat) => acc + cat.reviews, 0)} reviews</p>
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-blue-600">
                            {ratings.overallRating.toFixed(1)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${sentimentColor}`}>
                            <ThumbsUp className="w-5 h-5" />
                            <span className="font-medium">{(ratings.sentimentScore * 100).toFixed(0)}% Positive</span>
                        </div>
                    </div>
                </div>

                {/* Category Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ratings.categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-4 rounded-lg border"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{category.name}</span>
                                <div className="flex items-center gap-1">
                                    <Star className="text-yellow-400 w-4 h-4 fill-current" />
                                    <span>{category.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(category.rating / 5) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-blue-600 rounded-full"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{category.reviews} reviews</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Reviews */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Recent Reviews</h3>
                    {ratings.reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-4 rounded-lg border"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star key={i} className="text-yellow-400 w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700">{review.text}</p>
                            <div className={`flex items-center gap-2 mt-2 ${
                                review.sentiment === 'positive' ? 'text-green-500' :
                                    review.sentiment === 'negative' ? 'text-red-500' : 'text-yellow-500'
                            }`}>
                                {review.sentiment === 'positive' ? <ThumbsUp size={16} /> :
                                    review.sentiment === 'negative' ? <ThumbsDown size={16} /> :
                                        <MessageCircle size={16} />}
                                <span className="text-sm capitalize">{review.sentiment} Review</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    variants={dialogVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
                >
                    {/* Map section - height reduced slightly */}
                    <div className="relative h-56 md:h-72 flex-shrink-0">
                        {showMap ? (
                            <div className="absolute inset-0">
                                <GoogleMap
                                    mapContainerClassName="w-full h-full rounded-t-2xl"
                                    center={mapCenter}
                                    zoom={15}
                                    options={{
                                        ...mapOptions,
                                        styles: [
                                            {
                                                featureType: "all",
                                                elementType: "labels.text.fill",
                                                stylers: [{ color: "#6B7280" }]
                                            },
                                            {
                                                featureType: "water",
                                                elementType: "geometry",
                                                stylers: [{ color: "#E5E7EB" }]
                                            },
                                            {
                                                featureType: "landscape",
                                                elementType: "geometry",
                                                stylers: [{ color: "#F3F4F6" }]
                                            },
                                            {
                                                featureType: "road",
                                                elementType: "geometry",
                                                stylers: [{ color: "#FFFFFF" }]
                                            },
                                            {
                                                featureType: "poi",
                                                elementType: "geometry",
                                                stylers: [{ color: "#E5E7EB" }]
                                            },
                                            {
                                                featureType: "transit",
                                                elementType: "geometry",
                                                stylers: [{ color: "#E5E7EB" }]
                                            }
                                        ]
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        transform: 'translate(-50%, -50%)',
                                        left: '50%',
                                        top: '50%'
                                    }}>
                                        <CustomMarker />
                                    </div>
                                </GoogleMap>

                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                                    <h3 className="font-semibold text-lg">{hotel.hotel.name}</h3>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <MapPin size={16} />
                                        {hotel.hotel.cityCode}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Tabs section - made sticky */}
                    <div className="sticky top-0 bg-white z-10 p-6 pb-0 border-b">
                        <div className="flex items-center gap-4 mb-6">
                            <motion.button
                                variants={tabVariants}
                                animate={activeTab === 'rooms' ? 'active' : 'inactive'}
                                onClick={() => setActiveTab('rooms')}
                                className="px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <Bed size={20} />
                                <span>Rooms</span>
                            </motion.button>

                            <motion.button
                                variants={tabVariants}
                                animate={activeTab === 'policies' ? 'active' : 'inactive'}
                                onClick={() => setActiveTab('policies')}
                                className="px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <Shield size={20} />
                                <span>Policies</span>
                            </motion.button>

                            <motion.button
                                variants={tabVariants}
                                animate={activeTab === 'amenities' ? 'active' : 'inactive'}
                                onClick={() => setActiveTab('amenities')}
                                className="px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <Coffee size={20} />
                                <span>Amenities</span>
                            </motion.button>

                            <motion.button
                                variants={tabVariants}
                                animate={activeTab === 'ratings' ? 'active' : 'inactive'}
                                onClick={() => setActiveTab('ratings')}
                                className="px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <BarChart size={20} />
                                <span>Ratings</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Content section - updated with proper scrolling */}
                    <div className="flex-1 overflow-y-auto p-6 pt-0">
                        <AnimatePresence mode="wait">
                            {activeTab === 'rooms' && (
                                <motion.div
                                    key="rooms"
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6"
                                >
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
                                </motion.div>
                            )}
                            {activeTab === 'policies' && (
                                <motion.div className="pt-6">
                                    {renderPolicies()}
                                </motion.div>
                            )}
                            {activeTab === 'amenities' && (
                                <motion.div className="pt-6">
                                    {renderAmenities()}
                                </motion.div>
                            )}
                            {activeTab === 'ratings' && (
                                <motion.div className="pt-6">
                                    {renderRatings()}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Close button remains the same */}
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