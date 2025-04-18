import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Users, MapPin, DollarSign, Clock, Compass, Briefcase, Sun, Umbrella, Coffee, Utensils, Camera, Music, ChevronRight, Plus, Minus, Search, ArrowRight, X, Loader, Hotel, Car, Train, Bus, Bike, Home, Tent, Mouse as House, ShoppingBag } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { generateTripPlan, optimizePlan } from '../services/aiTripPlannerService';
import { format } from 'date-fns';

interface TripDetails {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  travelers: {
    adults: number;
    children: number;
  };
  budget: number;
  interests: string[];
  travelStyle: string;
  transportationPreferences: string[];
  accommodationType: string;
  flexibility: number;
}

const TripPlanner: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    destination: '',
    startDate: null,
    endDate: null,
    travelers: {
      adults: 1,
      children: 0
    },
    budget: 2000,
    interests: [],
    travelStyle: 'balanced',
    transportationPreferences: [],
    accommodationType: 'hotel',
    flexibility: 0
  });

  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const interests = [
    { icon: Coffee, label: 'Cafes', category: 'food' },
    { icon: Utensils, label: 'Restaurants', category: 'food' },
    { icon: Camera, label: 'Photography', category: 'activities' },
    { icon: Music, label: 'Nightlife', category: 'entertainment' },
    { icon: Sun, label: 'Beach', category: 'nature' },
    { icon: Compass, label: 'Adventure', category: 'activities' },
    { icon: Briefcase, label: 'Business', category: 'purpose' },
    { icon: Umbrella, label: 'Relaxation', category: 'style' }
  ];

  const transportationOptions = [
    { icon: Plane, label: 'Flights', value: 'flight' },
    { icon: Train, label: 'Train', value: 'train' },
    { icon: Bus, label: 'Bus', value: 'bus' },
    { icon: Car, label: 'Rental Car', value: 'car' },
    { icon: Bike, label: 'Bike', value: 'bike' }
  ];

  const accommodationTypes = [
    { icon: Hotel, label: 'Hotel', value: 'hotel' },
    { icon: Home, label: 'Apartment', value: 'apartment' },
    { icon: Tent, label: 'Hostel', value: 'hostel' },
    { icon: House, label: 'Resort', value: 'resort' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateTripPlan({
        destination: tripDetails.destination,
        budget: tripDetails.budget,
        dates: {
          start: tripDetails.startDate!,
          end: tripDetails.endDate!
        },
        travelers: tripDetails.travelers,
        preferences: {
          activities: tripDetails.interests,
          accommodationType: tripDetails.accommodationType,
          transportationType: tripDetails.transportationPreferences
        },
        flexibility: tripDetails.flexibility
      });

      setGeneratedPlan(plan);
      setStep(5); // Move to plan review step
    } catch (error) {
      console.error('Error generating plan:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizePlan = async (constraints: {
    maxBudget: number;
    mustInclude: string[];
    mustExclude: string[];
  }) => {
    setIsGenerating(true);
    try {
      const optimizedPlan = await optimizePlan(generatedPlan, constraints);
      setGeneratedPlan(optimizedPlan);
    } catch (error) {
      console.error('Error optimizing plan:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setTripDetails(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Where would you like to go?</h2>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter destination"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tripDetails.destination}
                onChange={(e) => setTripDetails({ ...tripDetails, destination: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <DatePicker
                    selected={tripDetails.startDate}
                    onChange={(date) => setTripDetails({ ...tripDetails, startDate: date })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select start date"
                    minDate={new Date()}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <DatePicker
                    selected={tripDetails.endDate}
                    onChange={(date) => setTripDetails({ ...tripDetails, endDate: date })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select end date"
                    minDate={tripDetails.startDate || new Date()}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Who's traveling?</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-blue-600" />
                  <div>
                    <h3 className="font-medium">Adults</h3>
                    <p className="text-sm text-gray-500">Age 13+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTripDetails(prev => ({
                      ...prev,
                      travelers: {
                        ...prev.travelers,
                        adults: Math.max(1, prev.travelers.adults - 1)
                      }
                    }))}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <Minus size={20} />
                  </motion.button>
                  <span className="w-8 text-center">{tripDetails.travelers.adults}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTripDetails(prev => ({
                      ...prev,
                      travelers: {
                        ...prev.travelers,
                        adults: prev.travelers.adults + 1
                      }
                    }))}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <Plus size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-blue-600" />
                  <div>
                    <h3 className="font-medium">Children</h3>
                    <p className="text-sm text-gray-500">Age 2-12</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTripDetails(prev => ({
                      ...prev,
                      travelers: {
                        ...prev.travelers,
                        children: Math.max(0, prev.travelers.children - 1)
                      }
                    }))}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <Minus size={20} />
                  </motion.button>
                  <span className="w-8 text-center">{tripDetails.travelers.children}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTripDetails(prev => ({
                      ...prev,
                      travelers: {
                        ...prev.travelers,
                        children: prev.travelers.children + 1
                      }
                    }))}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <Plus size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">What's your budget?</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <DollarSign size={24} className="text-green-600" />
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={tripDetails.budget}
                  onChange={(e) => setTripDetails({ ...tripDetails, budget: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div className="text-center">
                <span className="text-3xl font-bold text-green-600">${tripDetails.budget}</span>
                <p className="text-gray-500">Estimated budget per person</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[1000, 2000, 5000].map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTripDetails({ ...tripDetails, budget: amount })}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      tripDetails.budget === amount
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    ${amount}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">What are your interests?</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interests.map((interest) => {
                const isSelected = tripDetails.interests.includes(interest.label);
                return (
                  <motion.button
                    key={interest.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleInterest(interest.label)}
                    className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <interest.icon size={24} className={isSelected ? 'text-blue-500' : 'text-gray-400'} />
                    <span>{interest.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderPlanReview = () => {
    if (!generatedPlan) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="bg-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Trip Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600">Destination</p>
              <p className="font-semibold">{generatedPlan.overview.destination}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-semibold">{generatedPlan.overview.duration} days</p>
            </div>
            <div>
              <p className="text-gray-600">Total Cost</p>
              <p className="font-semibold">${generatedPlan.overview.totalCost}</p>
            </div>
            <div>
              <p className="text-gray-600">Savings</p>
              <p className="font-semibold text-green-600">
                ${generatedPlan.budgetBreakdown.savings}
              </p>
            </div>
          </div>
        </div>

        {/* Transportation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Transportation</h3>
          <div className="space-y-4">
            {generatedPlan.transportation.flights.map((flight: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Plane className="text-blue-600" size={24} />
                  <div>
                    <p className="font-medium">{flight.type === 'outbound' ? 'Departure' : 'Return'}</p>
                    <p className="text-gray-600">{flight.details}</p>
                  </div>
                </div>
                <p className="font-semibold">${flight.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Accommodation</h3>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{generatedPlan.accommodation.name}</h4>
                <p className="text-gray-600">{generatedPlan.accommodation.location}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedPlan.accommodation.amenities.map((amenity: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${generatedPlan.accommodation.pricePerNight}/night</p>
                <p className="text-gray-600">Total: ${generatedPlan.accommodation.totalPrice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Daily Itinerary</h3>
          <div className="space-y-6">
            {generatedPlan.activities.map((day: any, index: number) => (
              <div key={index} className="border-b last:border-0 pb-6">
                <h4 className="font-medium mb-4">Day {day.day}</h4>
                <div className="space-y-4">
                  {day.items.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-start gap-4">
                      <div className="w-20 text-gray-600">{item.time}</div>
                      <div className="flex-1">
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-gray-600">{item.location}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.cost}</p>
                        <p className="text-sm text-gray-500">{item.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Budget Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(generatedPlan.budgetBreakdown).map(([category, amount]: [string, any]) => (
              category !== 'savings' && (
                <div key={category} className="flex items-center justify-between">
                  <p className="capitalize">{category}</p>
                  <p className="font-semibold">${amount}</p>
                </div>
              )
            ))}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between font-bold">
                <p>Total</p>
                <p>${generatedPlan.budgetBreakdown.total}</p>
              </div>
              <div className="flex items-center justify-between text-green-600 mt-2">
                <p>Savings</p>
                <p>${generatedPlan.budgetBreakdown.savings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Local Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Dining</h4>
              <ul className="space-y-2">
                {generatedPlan.recommendations.dining.map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Utensils size={16} className="text-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Shopping</h4>
              <ul className="space-y-2">
                {generatedPlan.recommendations.shopping.map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setStep(4)}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Back to Details
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {/* Handle booking */}}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            Book This Trip
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step {step} of 5</span>
              <span className="text-sm text-gray-500">{(step / 5 * 100).toFixed(0)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / 5) * 100}%` }}
                className="h-full bg-blue-600 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {step === 5 ? renderPlanReview() : renderStep()}
          </AnimatePresence>

          {/* Navigation */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </motion.button>
              ) : (
                <div></div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={step === 4 ? handleGeneratePlan : () => setStep(step + 1)}
                disabled={isGenerating}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                  step === 4
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Generating Plan...</span>
                  </>
                ) : step === 4 ? (
                  <>
                    <span>Generate Plan</span>
                    <ArrowRight size={20} />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TripPlanner;