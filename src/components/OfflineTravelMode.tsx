import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WifiOff, Download, Map, Info, Check, X, Loader,
  MapPin, Calendar, Clock, Phone, Globe, FileText,
  Compass, Utensils, Hotel, Plane, Car, Bus, Train
} from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface OfflineDestination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  downloadSize: number; // in MB
  lastUpdated: Date;
  downloaded: boolean;
  downloading?: boolean;
}

interface OfflineGuide {
  id: string;
  destinationId: string;
  type: 'map' | 'info' | 'transport' | 'food' | 'accommodation' | 'emergency';
  title: string;
  description: string;
  icon: any;
  downloadSize: number; // in MB
  downloaded: boolean;
  downloading?: boolean;
}

const OfflineTravelMode: React.FC = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<OfflineDestination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<OfflineDestination | null>(null);
  const [guides, setGuides] = useState<OfflineGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadingModal, setShowDownloadingModal] = useState(false);
  const [currentDownload, setCurrentDownload] = useState<string | null>(null);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    fetchDestinations();

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      fetchGuides(selectedDestination.id);
    }
  }, [selectedDestination]);

  const fetchDestinations = async () => {
    try {
      // In a real app, this would be an API call or IndexedDB query
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDestinations: OfflineDestination[] = [
        {
          id: '1',
          name: 'Tokyo',
          country: 'Japan',
          description: 'Explore the vibrant metropolis of Tokyo, from ancient temples to futuristic skyscrapers.',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=2000',
          downloadSize: 245,
          lastUpdated: new Date('2024-03-15'),
          downloaded: true
        },
        {
          id: '2',
          name: 'Paris',
          country: 'France',
          description: 'Discover the romance and charm of the City of Light with its iconic landmarks and cuisine.',
          image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
          downloadSize: 187,
          lastUpdated: new Date('2024-03-10'),
          downloaded: false
        },
        {
          id: '3',
          name: 'New York City',
          country: 'United States',
          description: 'Experience the energy of the Big Apple with its world-class museums, theaters, and restaurants.',
          image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=2000',
          downloadSize: 312,
          lastUpdated: new Date('2024-03-05'),
          downloaded: false
        },
        {
          id: '4',
          name: 'Barcelona',
          country: 'Spain',
          description: 'Enjoy the unique architecture, beautiful beaches, and vibrant culture of this Mediterranean gem.',
          image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=2000',
          downloadSize: 156,
          lastUpdated: new Date('2024-03-20'),
          downloaded: true
        },
        {
          id: '5',
          name: 'Bangkok',
          country: 'Thailand',
          description: 'Immerse yourself in the bustling streets, ornate temples, and delicious street food of Bangkok.',
          image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&q=80&w=2000',
          downloadSize: 203,
          lastUpdated: new Date('2024-03-12'),
          downloaded: false
        }
      ];
      
      setDestinations(mockDestinations);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setIsLoading(false);
    }
  };

  const fetchGuides = async (destinationId: string) => {
    try {
      // In a real app, this would be an API call or IndexedDB query
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockGuides: OfflineGuide[] = [
        {
          id: 'g1',
          destinationId,
          type: 'map',
          title: 'Offline Maps',
          description: 'Detailed city maps with points of interest, transit routes, and walking directions.',
          icon: Map,
          downloadSize: 85,
          downloaded: destinationId === '1' || destinationId === '4'
        },
        {
          id: 'g2',
          destinationId,
          type: 'info',
          title: 'City Guide',
          description: 'Comprehensive information about attractions, history, culture, and practical tips.',
          icon: Info,
          downloadSize: 42,
          downloaded: destinationId === '1' || destinationId === '4'
        },
        {
          id: 'g3',
          destinationId,
          type: 'transport',
          title: 'Transportation Guide',
          description: 'Public transit maps, schedules, and information about taxis, rideshares, and rentals.',
          icon: Bus,
          downloadSize: 38,
          downloaded: destinationId === '1'
        },
        {
          id: 'g4',
          destinationId,
          type: 'food',
          title: 'Food & Dining Guide',
          description: 'Restaurant recommendations, local specialties, and food safety information.',
          icon: Utensils,
          downloadSize: 25,
          downloaded: destinationId === '1' || destinationId === '4'
        },
        {
          id: 'g5',
          destinationId,
          type: 'accommodation',
          title: 'Accommodation Guide',
          description: 'Hotel information, neighborhood guides, and check-in/check-out procedures.',
          icon: Hotel,
          downloadSize: 18,
          downloaded: destinationId === '1'
        },
        {
          id: 'g6',
          destinationId,
          type: 'emergency',
          title: 'Emergency Information',
          description: 'Emergency contacts, hospital locations, embassy information, and safety tips.',
          icon: Phone,
          downloadSize: 12,
          downloaded: destinationId === '1' || destinationId === '4'
        }
      ];
      
      setGuides(mockGuides);
    } catch (error) {
      console.error('Error fetching guides:', error);
    }
  };

  const downloadDestination = async (destination: OfflineDestination) => {
    if (!isOnline) {
      alert('You need to be online to download content for offline use.');
      return;
    }
    
    setCurrentDownload(destination.id);
    setShowDownloadingModal(true);
    setDownloadProgress(0);
    
    // Update destination to show downloading state
    setDestinations(prev => 
      prev.map(d => 
        d.id === destination.id ? { ...d, downloading: true } : d
      )
    );
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    // Simulate download completion
    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      
      // Update destination to show downloaded state
      setDestinations(prev => 
        prev.map(d => 
          d.id === destination.id ? { ...d, downloading: false, downloaded: true } : d
        )
      );
      
      // If this is the selected destination, update guides too
      if (selectedDestination?.id === destination.id) {
        setGuides(prev => 
          prev.map(g => ({ ...g, downloaded: true }))
        );
      }
      
      setTimeout(() => {
        setShowDownloadingModal(false);
        setCurrentDownload(null);
      }, 1000);
    }, 5000);
  };

  const downloadGuide = async (guide: OfflineGuide) => {
    if (!isOnline) {
      alert('You need to be online to download content for offline use.');
      return;
    }
    
    // Update guide to show downloading state
    setGuides(prev => 
      prev.map(g => 
        g.id === guide.id ? { ...g, downloading: true } : g
      )
    );
    
    // Simulate download
    setTimeout(() => {
      // Update guide to show downloaded state
      setGuides(prev => 
        prev.map(g => 
          g.id === guide.id ? { ...g, downloading: false, downloaded: true } : g
        )
      );
    }, 2000);
  };

  const deleteOfflineContent = (destination: OfflineDestination) => {
    // Update destination to show not downloaded
    setDestinations(prev => 
      prev.map(d => 
        d.id === destination.id ? { ...d, downloaded: false } : d
      )
    );
    
    // If this is the selected destination, update guides too
    if (selectedDestination?.id === destination.id) {
      setGuides(prev => 
        prev.map(g => ({ ...g, downloaded: false }))
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading offline content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <WifiOff className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold">Offline Travel Mode</h1>
                <p className="text-gray-600">Download travel content for offline access</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!selectedDestination ? (
              <motion.div
                key="destination-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-blue-800 mb-1">Offline Travel Mode</h3>
                      <p className="text-blue-700">
                        Download essential travel information for your destinations to access even without an internet connection.
                        This includes maps, guides, emergency contacts, and more.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-6">Available Destinations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((destination) => (
                    <motion.div
                      key={destination.id}
                      variants={itemVariants}
                      className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                        {destination.downloaded && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Check size={14} />
                            <span>Downloaded</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                        <p className="text-gray-500 mb-4">{destination.country}</p>
                        <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>{destination.downloadSize} MB</span>
                          <span>Updated: {format(destination.lastUpdated, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedDestination(destination)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                          {destination.downloaded ? (
                            <button
                              onClick={() => deleteOfflineContent(destination)}
                              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={() => downloadDestination(destination)}
                              disabled={destination.downloading || !isOnline}
                              className={`px-3 py-2 rounded-lg transition-colors ${
                                destination.downloading
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {destination.downloading ? (
                                <Loader className="animate-spin" size={20} />
                              ) : (
                                <Download size={20} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="destination-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <button
                    onClick={() => setSelectedDestination(null)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    ← Back to destinations
                  </button>
                  <div className="flex gap-3">
                    {selectedDestination.downloaded ? (
                      <button
                        onClick={() => deleteOfflineContent(selectedDestination)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <X size={18} />
                        <span>Remove Offline Content</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => downloadDestination(selectedDestination)}
                        disabled={!isOnline || selectedDestination.downloading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        {selectedDestination.downloading ? (
                          <>
                            <Loader className="animate-spin" size={18} />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download size={18} />
                            <span>Download All ({selectedDestination.downloadSize} MB)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative h-64 rounded-xl overflow-hidden mb-8">
                  <img
                    src={selectedDestination.image}
                    alt={selectedDestination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedDestination.name}</h2>
                    <p className="text-white/90">{selectedDestination.country}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8">{selectedDestination.description}</p>

                <h3 className="text-xl font-bold mb-6">Available Offline Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.map((guide) => (
                    <motion.div
                      key={guide.id}
                      variants={itemVariants}
                      className={`border rounded-lg p-6 ${
                        guide.downloaded ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <guide.icon className="text-blue-600" size={24} />
                        </div>
                        {guide.downloaded ? (
                          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <Check size={16} />
                            <span>Downloaded</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => downloadGuide(guide)}
                            disabled={guide.downloading || !isOnline}
                            className={`p-2 rounded-lg transition-colors ${
                              guide.downloading
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                          >
                            {guide.downloading ? (
                              <Loader className="animate-spin" size={18} />
                            ) : (
                              <Download size={18} />
                            )}
                          </button>
                        )}
                      </div>
                      <h4 className="font-bold mb-2">{guide.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                      <div className="text-sm text-gray-500">{guide.downloadSize} MB</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Download Progress Modal */}
      <AnimatePresence>
        {showDownloadingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Downloading Content</h3>
              <p className="text-gray-600 mb-6">
                Downloading offline content for {destinations.find(d => d.id === currentDownload)?.name}.
                Please don't close the app during this process.
              </p>
              
              <div className="mb-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadProgress}%` }}
                    className="h-full bg-blue-600 rounded-full"
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{downloadProgress}% Complete</span>
                  <span>
                    {Math.round((destinations.find(d => d.id === currentDownload)?.downloadSize || 0) * downloadProgress / 100)} MB / 
                    {destinations.find(d => d.id === currentDownload)?.downloadSize} MB
                  </span>
                </div>
              </div>
              
              {downloadProgress === 100 && (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <Check size={20} />
                  <span>Download complete!</span>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (downloadProgress === 100) {
                      setShowDownloadingModal(false);
                      setCurrentDownload(null);
                    }
                  }}
                  disabled={downloadProgress < 100}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {downloadProgress === 100 ? 'Close' : 'Downloading...'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfflineTravelMode;