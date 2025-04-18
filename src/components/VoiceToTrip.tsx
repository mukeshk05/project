import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Loader, Check, X, Calendar, MapPin,
  Users, DollarSign, Plane, Hotel, Car, Utensils, Camera,
  ArrowRight, Trash2, Download, Share2
} from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface TripPlan {
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  travelers: number;
  budget: number;
  transportation: {
    type: string;
    details: string;
    cost: number;
  };
  accommodation: {
    type: string;
    name: string;
    location: string;
    cost: number;
  };
  activities: {
    name: string;
    description: string;
    cost: number;
  }[];
  dining: {
    name: string;
    cuisine: string;
    cost: number;
  }[];
  totalCost: number;
}

const VoiceToTrip: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setRecognizedText(transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
      resetTranscript();
      setRecognizedText('');
    }
  };

  const processVoiceCommand = async () => {
    if (!recognizedText.trim()) {
      setError('Please speak your travel plans first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/voice-to-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text: recognizedText }),
      });

      if (!response.ok) throw new Error('Failed to process voice command');

      const data = await response.json();
      setTripPlan(data.tripPlan);
    } catch (error) {
      console.error('Error processing voice command:', error);
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveTripPlan = async () => {
    if (!tripPlan) return;

    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(tripPlan),
      });

      if (!response.ok) throw new Error('Failed to save trip plan');

      // Handle successful save
      alert('Trip plan saved successfully!');
    } catch (error) {
      console.error('Error saving trip plan:', error);
      setError('Failed to save trip plan. Please try again.');
    }
  };

  const exportTripPlan = () => {
    if (!tripPlan) return;

    const content = `
      Trip Plan to ${tripPlan.destination}
      
      Dates: ${tripPlan.dates.start.toLocaleDateString()} - ${tripPlan.dates.end.toLocaleDateString()}
      Travelers: ${tripPlan.travelers}
      Budget: $${tripPlan.budget}
      
      Transportation:
      ${tripPlan.transportation.type} - ${tripPlan.transportation.details}
      Cost: $${tripPlan.transportation.cost}
      
      Accommodation:
      ${tripPlan.accommodation.type} - ${tripPlan.accommodation.name}
      Location: ${tripPlan.accommodation.location}
      Cost: $${tripPlan.accommodation.cost}
      
      Activities:
      ${tripPlan.activities.map(a => `- ${a.name}: ${a.description} ($${a.cost})`).join('\n')}
      
      Dining:
      ${tripPlan.dining.map(d => `- ${d.name}: ${d.cuisine} ($${d.cost})`).join('\n')}
      
      Total Cost: $${tripPlan.totalCost}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip-plan-${tripPlan.destination}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <X className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold mb-4">Browser Not Supported</h2>
          <p className="text-gray-600 mb-6">
            Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Mic className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold">Voice to Trip</h1>
          </div>

          <div className="space-y-8">
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isListening ? (
                  <MicOff size={48} />
                ) : (
                  <Mic size={48} />
                )}
              </motion.button>
              <p className="mt-4 text-gray-600">
                {isListening
                  ? 'Listening... Click to stop'
                  : 'Click to start speaking'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Try saying something like:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>"Plan a trip to Paris for 2 people from June 10th to June 17th with a budget of $3000"</li>
                <li>"I want to visit Tokyo for a week in September with my family"</li>
                <li>"Weekend getaway to Miami next month, looking for beach activities and good restaurants"</li>
              </ul>
            </div>

            {recognizedText && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Recognized Text:</h3>
                <p className="text-gray-700">{recognizedText}</p>
                <div className="flex justify-end gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      resetTranscript();
                      setRecognizedText('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={processVoiceCommand}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="animate-spin" size={16} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Process</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <X className="text-red-500" size={20} />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <AnimatePresence>
              {tripPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-8"
                >
                  <h2 className="text-xl font-bold mb-6">Your Trip Plan</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold">Destination: {tripPlan.destination}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Dates</p>
                            <p className="font-medium">
                              {tripPlan.dates.start.toLocaleDateString()} - {tripPlan.dates.end.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Travelers</p>
                            <p className="font-medium">{tripPlan.travelers}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Budget</p>
                            <p className="font-medium">${tripPlan.budget}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Plane className="text-blue-600" size={24} />
                          <h3 className="font-semibold">Transportation</h3>
                        </div>
                        <p className="text-gray-700 mb-2">{tripPlan.transportation.type}</p>
                        <p className="text-gray-600 mb-4">{tripPlan.transportation.details}</p>
                        <p className="font-medium text-right">${tripPlan.transportation.cost}</p>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Hotel className="text-green-600" size={24} />
                          <h3 className="font-semibold">Accommodation</h3>
                        </div>
                        <p className="text-gray-700 mb-2">{tripPlan.accommodation.name}</p>
                        <p className="text-gray-600 mb-4">{tripPlan.accommodation.location}</p>
                        <p className="font-medium text-right">${tripPlan.accommodation.cost}</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Camera className="text-purple-600" size={24} />
                        <h3 className="font-semibold">Activities</h3>
                      </div>
                      <div className="space-y-4">
                        {tripPlan.activities.map((activity, index) => (
                          <div key={index} className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{activity.name}</p>
                              <p className="text-gray-600">{activity.description}</p>
                            </div>
                            <p className="font-medium">${activity.cost}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Utensils className="text-orange-600" size={24} />
                        <h3 className="font-semibold">Dining</h3>
                      </div>
                      <div className="space-y-4">
                        {tripPlan.dining.map((dining, index) => (
                          <div key={index} className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{dining.name}</p>
                              <p className="text-gray-600">{dining.cuisine}</p>
                            </div>
                            <p className="font-medium">${dining.cost}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Total Cost</h3>
                        <p className="text-2xl font-bold">${tripPlan.totalCost}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportTripPlan}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                      >
                        <Download size={20} />
                        Export
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {}}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                      >
                        <Share2 size={20} />
                        Share
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveTripPlan}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Check size={20} />
                        Save Plan
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VoiceToTrip;