import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Calendar, MapPin, Users, DollarSign, 
  Briefcase, Heart, Umbrella, Plane, Car, 
  Zap, Sparkles, Loader, Check, X, Download, 
  Share2, AlertCircle, Info, ChevronDown, ChevronUp,
  CreditCard, FileText, Clipboard, Search
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../context/AuthContext';

interface TripDetails {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  travelers: {
    adults: number;
    children: number;
    seniors: number;
  };
  tripCost: number;
  activities: string[];
  preExistingConditions: boolean;
  travelMethod: 'flight' | 'cruise' | 'car' | 'train';
}

interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  price: number;
  coverage: {
    tripCancellation: number;
    emergencyMedical: number;
    medicalEvacuation: number;
    baggageLoss: number;
    travelDelay: number;
    missedConnection: number;
  };
  benefits: string[];
  exclusions: string[];
  rating: number;
  reviewCount: number;
  recommended: boolean;
  matchScore: number;
}

interface RiskFactor {
  type: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

const TravelInsuranceAdvisor: React.FC = () => {
  const { user } = useAuth();
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    destination: '',
    startDate: addDays(new Date(), 30),
    endDate: addDays(new Date(), 37),
    travelers: {
      adults: 1,
      children: 0,
      seniors: 0
    },
    tripCost: 2000,
    activities: [],
    preExistingConditions: false,
    travelMethod: 'flight'
  });
  
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [showRiskFactors, setShowRiskFactors] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showExclusions, setShowExclusions] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<InsurancePlan[]>([]);

  useEffect(() => {
    // Load saved plans
    const loadSavedPlans = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockSavedPlans: InsurancePlan[] = [
          {
            id: 'saved1',
            name: 'Premium Protection Plan',
            provider: 'TravelGuard',
            price: 189,
            coverage: {
              tripCancellation: 10000,
              emergencyMedical: 100000,
              medicalEvacuation: 500000,
              baggageLoss: 2500,
              travelDelay: 1000,
              missedConnection: 500
            },
            benefits: [
              'Cancel for any reason (75% reimbursement)',
              '24/7 emergency assistance',
              'Rental car coverage',
              'Pre-existing condition waiver if purchased within 14 days of trip deposit'
            ],
            exclusions: [
              'Extreme sports without additional rider',
              'Self-inflicted injuries',
              'Pandemic-related cancellations unless specified',
              'War or civil unrest'
            ],
            rating: 4.8,
            reviewCount: 324,
            recommended: true,
            matchScore: 95
          }
        ];
        
        setSavedPlans(mockSavedPlans);
      } catch (error) {
        console.error('Error loading saved plans:', error);
      }
    };
    
    loadSavedPlans();
  }, []);

  const generateRecommendations = async () => {
    if (!tripDetails.destination || !tripDetails.startDate || !tripDetails.endDate) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate mock insurance plans based on trip details
      const totalTravelers = tripDetails.travelers.adults + tripDetails.travelers.children + tripDetails.travelers.seniors;
      const tripDuration = Math.ceil((tripDetails.endDate.getTime() - tripDetails.startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Base price factors
      const basePricePerDay = 7;
      const basePricePerPerson = 25;
      
      // Adjust for destination risk
      const destinationRiskFactor = tripDetails.destination.toLowerCase().includes('europe') ? 1.0 :
                                   tripDetails.destination.toLowerCase().includes('asia') ? 1.2 :
                                   tripDetails.destination.toLowerCase().includes('africa') ? 1.5 :
                                   tripDetails.destination.toLowerCase().includes('south america') ? 1.3 : 1.1;
      
      // Adjust for activities
      const activityRiskFactor = tripDetails.activities.includes('skiing') || 
                                tripDetails.activities.includes('scuba') || 
                                tripDetails.activities.includes('hiking') ? 1.3 : 1.0;
      
      // Adjust for pre-existing conditions
      const medicalRiskFactor = tripDetails.preExistingConditions ? 1.5 : 1.0;
      
      // Calculate base price
      const basePrice = Math.round(basePricePerDay * tripDuration * totalTravelers * destinationRiskFactor * activityRiskFactor * medicalRiskFactor);
      
      // Generate mock plans
      const mockPlans: InsurancePlan[] = [
        {
          id: '1',
          name: 'Basic Coverage',
          provider: 'SafeTravel Insurance',
          price: Math.round(basePrice * 0.7),
          coverage: {
            tripCancellation: Math.round(tripDetails.tripCost * 0.75),
            emergencyMedical: 50000,
            medicalEvacuation: 250000,
            baggageLoss: 1000,
            travelDelay: 500,
            missedConnection: 250
          },
          benefits: [
            '24/7 emergency assistance',
            'Trip cancellation and interruption coverage',
            'Emergency medical coverage',
            'Baggage protection'
          ],
          exclusions: [
            'Pre-existing medical conditions',
            'Extreme sports and activities',
            'Cancellation due to business reasons',
            'Mental health related claims'
          ],
          rating: 4.2,
          reviewCount: 156,
          recommended: false,
          matchScore: 75
        },
        {
          id: '2',
          name: 'Premium Protection Plan',
          provider: 'TravelGuard',
          price: basePrice,
          coverage: {
            tripCancellation: tripDetails.tripCost,
            emergencyMedical: 100000,
            medicalEvacuation: 500000,
            baggageLoss: 2500,
            travelDelay: 1000,
            missedConnection: 500
          },
          benefits: [
            'Cancel for any reason (75% reimbursement)',
            '24/7 emergency assistance',
            'Rental car coverage',
            'Pre-existing condition waiver if purchased within 14 days of trip deposit'
          ],
          exclusions: [
            'Extreme sports without additional rider',
            'Self-inflicted injuries',
            'Pandemic-related cancellations unless specified',
            'War or civil unrest'
          ],
          rating: 4.8,
          reviewCount: 324,
          recommended: true,
          matchScore: 95
        },
        {
          id: '3',
          name: 'Adventure Plus',
          provider: 'WorldNomads',
          price: Math.round(basePrice * 1.2),
          coverage: {
            tripCancellation: Math.round(tripDetails.tripCost * 0.8),
            emergencyMedical: 150000,
            medicalEvacuation: 750000,
            baggageLoss: 3000,
            travelDelay: 1500,
            missedConnection: 750
          },
          benefits: [
            'Coverage for 200+ adventure activities',
            'Emergency medical evacuation',
            'Trip cancellation and interruption',
            'Gear and equipment protection',
            '24/7 emergency assistance'
          ],
          exclusions: [
            'Professional sports competitions',
            'Pre-existing conditions without certification',
            'Incidents while under the influence',
            'Self-inflicted injuries'
          ],
          rating: 4.6,
          reviewCount: 287,
          recommended: false,
          matchScore: 88
        }
      ];
      
      // Generate risk factors based on trip details
      const mockRiskFactors: RiskFactor[] = [];
      
      // Destination risk
      if (tripDetails.destination.toLowerCase().includes('europe')) {
        mockRiskFactors.push({
          type: 'Destination',
          level: 'low',
          description: 'Your destination has good healthcare infrastructure and low risk of natural disasters.',
          recommendation: 'Standard travel insurance should be sufficient.'
        });
      } else if (tripDetails.destination.toLowerCase().includes('asia') || tripDetails.destination.toLowerCase().includes('south america')) {
        mockRiskFactors.push({
          type: 'Destination',
          level: 'medium',
          description: 'Some regions may have limited healthcare facilities or higher risk of natural events.',
          recommendation: 'Consider plans with higher emergency medical coverage and evacuation benefits.'
        });
      } else if (tripDetails.destination.toLowerCase().includes('africa')) {
        mockRiskFactors.push({
          type: 'Destination',
          level: 'high',
          description: 'Some areas may have limited healthcare access and higher health risks.',
          recommendation: 'Choose a plan with comprehensive medical coverage and evacuation benefits.'
        });
      }
      
      // Activity risk
      if (tripDetails.activities.some(activity => 
        ['skiing', 'scuba', 'hiking', 'climbing', 'rafting'].includes(activity.toLowerCase())
      )) {
        mockRiskFactors.push({
          type: 'Activities',
          level: 'high',
          description: 'Your planned activities involve higher physical risks.',
          recommendation: 'Select a plan that specifically covers adventure activities and has higher medical coverage.'
        });
      }
      
      // Medical risk
      if (tripDetails.preExistingConditions) {
        mockRiskFactors.push({
          type: 'Medical',
          level: 'high',
          description: 'Pre-existing medical conditions may not be covered by standard policies.',
          recommendation: 'Choose a plan with a pre-existing condition waiver, typically available if purchased shortly after trip deposit.'
        });
      }
      
      // Trip duration risk
      if (tripDuration > 14) {
        mockRiskFactors.push({
          type: 'Duration',
          level: 'medium',
          description: 'Longer trips have increased risk of disruption or medical issues.',
          recommendation: 'Consider plans with higher coverage limits and flexible change options.'
        });
      }
      
      // Trip cost risk
      if (tripDetails.tripCost > 5000) {
        mockRiskFactors.push({
          type: 'Trip Cost',
          level: 'medium',
          description: 'Higher trip cost means more financial exposure if cancellation is needed.',
          recommendation: 'Ensure trip cancellation coverage is at least equal to your total non-refundable trip cost.'
        });
      }
      
      setInsurancePlans(mockPlans);
      setRiskFactors(mockRiskFactors);
      setSelectedPlan(mockPlans.find(plan => plan.recommended) || null);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const purchasePlan = async (plan: InsurancePlan) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to purchase the insurance
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert(`Successfully purchased ${plan.name} from ${plan.provider}!`);
      
      // Add to saved plans
      if (!savedPlans.some(savedPlan => savedPlan.id === plan.id)) {
        setSavedPlans([...savedPlans, plan]);
      }
    } catch (error) {
      console.error('Error purchasing plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActivity = (activity: string) => {
    if (tripDetails.activities.includes(activity)) {
      setTripDetails({
        ...tripDetails,
        activities: tripDetails.activities.filter(a => a !== activity)
      });
    } else {
      setTripDetails({
        ...tripDetails,
        activities: [...tripDetails.activities, activity]
      });
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const renderTripDetailsForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={tripDetails.destination}
              onChange={(e) => setTripDetails({ ...tripDetails, destination: e.target.value })}
              placeholder="Where are you traveling to?"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trip Cost (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              value={tripDetails.tripCost}
              onChange={(e) => setTripDetails({ ...tripDetails, tripCost: parseInt(e.target.value) })}
              min={100}
              step={100}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <DatePicker
              selected={tripDetails.startDate}
              onChange={(date) => setTripDetails({ ...tripDetails, startDate: date })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <DatePicker
              selected={tripDetails.endDate}
              onChange={(date) => setTripDetails({ ...tripDetails, endDate: date })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={tripDetails.startDate || new Date()}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travelers
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Adults</label>
              <input
                type="number"
                value={tripDetails.travelers.adults}
                onChange={(e) => setTripDetails({
                  ...tripDetails,
                  travelers: {
                    ...tripDetails.travelers,
                    adults: parseInt(e.target.value)
                  }
                })}
                min={1}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Children</label>
              <input
                type="number"
                value={tripDetails.travelers.children}
                onChange={(e) => setTripDetails({
                  ...tripDetails,
                  travelers: {
                    ...tripDetails.travelers,
                    children: parseInt(e.target.value)
                  }
                })}
                min={0}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Seniors (65+)</label>
              <input
                type="number"
                value={tripDetails.travelers.seniors}
                onChange={(e) => setTripDetails({
                  ...tripDetails,
                  travelers: {
                    ...tripDetails.travelers,
                    seniors: parseInt(e.target.value)
                  }
                })}
                min={0}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Method
          </label>
          <select
            value={tripDetails.travelMethod}
            onChange={(e) => setTripDetails({ ...tripDetails, travelMethod: e.target.value as any })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="flight">Flight</option>
            <option value="cruise">Cruise</option>
            <option value="car">Car</option>
            <option value="train">Train</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Planned Activities (Select all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { icon: Briefcase, label: 'Business' },
            { icon: Compass, label: 'Sightseeing' },
            { icon: Ski, label: 'Skiing' },
            { icon: Umbrella, label: 'Beach' },
            { icon: Tent, label: 'Camping' },
            { icon: Bike, label: 'Cycling' },
            { icon: Waves, label: 'Scuba Diving' },
            { icon: Mountain, label: 'Hiking' }
          ].map((activity) => {
            const isSelected = tripDetails.activities.includes(activity.label);
            return (
              <button
                key={activity.label}
                onClick={() => toggleActivity(activity.label)}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                } transition-colors`}
              >
                <activity.icon size={20} className={isSelected ? 'text-blue-500' : 'text-gray-400'} />
                <span>{activity.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={tripDetails.preExistingConditions}
            onChange={(e) => setTripDetails({ ...tripDetails, preExistingConditions: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>I or someone in my party has pre-existing medical conditions</span>
        </label>
      </div>
      
      <div className="flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateRecommendations}
          disabled={isGenerating || !tripDetails.destination || !tripDetails.startDate || !tripDetails.endDate}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-3 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader className="animate-spin" size={24} />
              <span>Analyzing Your Trip...</span>
            </>
          ) : (
            <>
              <Sparkles size={24} />
              <span>Get Insurance Recommendations</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );

  const renderInsurancePlans = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <button
          onClick={() => {
            setInsurancePlans([]);
            setSelectedPlan(null);
          }}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Back to trip details
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showComparison
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Compare Plans
          </button>
          <button
            onClick={() => setShowRiskFactors(!showRiskFactors)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showRiskFactors
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            View Risk Analysis
          </button>
        </div>
      </div>

      {/* Risk Factors */}
      <AnimatePresence>
        {showRiskFactors && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Trip Risk Analysis</h2>
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{factor.type} Risk</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(factor.level)}`}>
                        {factor.level.charAt(0).toUpperCase() + factor.level.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{factor.description}</p>
                    <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                      <Info size={18} className="text-blue-600 mt-0.5" />
                      <p className="text-blue-700 text-sm">{factor.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 overflow-x-auto">
              <h2 className="text-xl font-bold mb-6">Plan Comparison</h2>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Coverage</th>
                    {insurancePlans.map(plan => (
                      <th key={plan.id} className="py-3 px-4 text-left">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Trip Cancellation</td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4">
                        ${plan.coverage.tripCancellation.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Emergency Medical</td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4">
                        ${plan.coverage.emergencyMedical.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Medical Evacuation</td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4">
                        ${plan.coverage.medicalEvacuation.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Baggage Loss</td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4">
                        ${plan.coverage.baggageLoss.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Travel Delay</td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4">
                        ${plan.coverage.travelDelay.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Missed Connection</td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4">
                        ${plan.coverage.missedConnection.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Price</td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4 font-bold">
                        ${plan.price.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4"></td>
                    {insurancePlans.map(plan => (
                      <td key={plan.id} className="py-3 px-4">
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            selectedPlan?.id === plan.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insurance Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insurancePlans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={itemVariants}
            className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 ${
              selectedPlan?.id === plan.id ? 'border-blue-500' : 'border-transparent'
            } hover:shadow-md transition-all`}
          >
            {plan.recommended && (
              <div className="bg-blue-600 text-white py-2 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  <span className="font-medium">AI Recommended</span>
                </div>
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-500">{plan.provider}</p>
                </div>
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  <Star size={14} className="fill-current" />
                  <span>{plan.rating}</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trip Cancellation</span>
                  <span className="font-medium">${plan.coverage.tripCancellation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency Medical</span>
                  <span className="font-medium">${plan.coverage.emergencyMedical.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medical Evacuation</span>
                  <span className="font-medium">${plan.coverage.medicalEvacuation.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Key Benefits</h4>
                <ul className="space-y-2">
                  {plan.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={16} className="text-green-500 mt-1" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                  {plan.benefits.length > 3 && (
                    <li className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      + {plan.benefits.length - 3} more benefits
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Exclusions</h4>
                  <button
                    onClick={() => setShowExclusions(showExclusions === plan.id ? null : plan.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showExclusions === plan.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {showExclusions === plan.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2">
                        {plan.exclusions.map((exclusion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <X size={16} className="text-red-500 mt-1" />
                            <span className="text-sm">{exclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <div className="text-2xl font-bold text-blue-600">${plan.price}</div>
                  <p className="text-sm text-gray-500">Total premium</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPlan(plan)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedPlan?.id === plan.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Plan Details */}
      {selectedPlan && (
        <div className="bg-blue-50 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Your Selected Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Coverage Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trip Cancellation</span>
                  <span className="font-medium">${selectedPlan.coverage.tripCancellation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency Medical</span>
                  <span className="font-medium">${selectedPlan.coverage.emergencyMedical.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medical Evacuation</span>
                  <span className="font-medium">${selectedPlan.coverage.medicalEvacuation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Baggage Loss</span>
                  <span className="font-medium">${selectedPlan.coverage.baggageLoss.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Travel Delay</span>
                  <span className="font-medium">${selectedPlan.coverage.travelDelay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Missed Connection</span>
                  <span className="font-medium">${selectedPlan.coverage.missedConnection.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400" />
                  <span>{tripDetails.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span>
                    {tripDetails.startDate && tripDetails.endDate ? (
                      <>
                        {format(tripDetails.startDate, 'MMM d, yyyy')} - {format(tripDetails.endDate, 'MMM d, yyyy')}
                      </>
                    ) : (
                      'Dates not specified'
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-400" />
                  <span>
                    {tripDetails.travelers.adults} {tripDetails.travelers.adults === 1 ? 'Adult' : 'Adults'}
                    {tripDetails.travelers.children > 0 && `, ${tripDetails.travelers.children} ${tripDetails.travelers.children === 1 ? 'Child' : 'Children'}`}
                    {tripDetails.travelers.seniors > 0 && `, ${tripDetails.travelers.seniors} ${tripDetails.travelers.seniors === 1 ? 'Senior' : 'Seniors'}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-gray-400" />
                  <span>Trip Cost: ${tripDetails.tripCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane size={18} className="text-gray-400" />
                  <span>Travel Method: {tripDetails.travelMethod.charAt(0).toUpperCase() + tripDetails.travelMethod.slice(1)}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">${selectedPlan.price}</div>
                    <p className="text-sm text-gray-500">Total premium</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => purchasePlan(selectedPlan)}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span>Purchase Plan</span>
                      </>
                    )}
                  </motion.button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Info size={16} />
                  <span>You'll receive policy documents via email after purchase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              variants={itemVariants}
              className="inline-block p-4 bg-white rounded-full shadow-lg mb-4"
            >
              <Shield className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Travel Insurance AI Advisor
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Get personalized insurance recommendations based on your trip details and risk profile
            </motion.p>
          </div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {insurancePlans.length > 0 ? renderInsurancePlans() : renderTripDetailsForm()}
          </motion.div>

          {/* Saved Plans */}
          {savedPlans.length > 0 && !insurancePlans.length && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold mb-6">Your Insurance Policies</h2>
              <div className="space-y-4">
                {savedPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-gray-500">{plan.provider}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">${plan.price}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FileText size={14} />
                          <span>Policy #TRV-{Math.floor(Math.random() * 1000000)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Download size={16} />
                        <span>Download Policy</span>
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Clipboard size={16} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {!insurancePlans.length && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                  <Zap className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Risk Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes your trip details to identify potential risks and recommend appropriate coverage.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                  <Search className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Policy Comparison</h3>
                <p className="text-gray-600">
                  Compare multiple insurance options side-by-side to find the best coverage for your needs.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                  <Heart className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Health-Aware Recommendations</h3>
                <p className="text-gray-600">
                  Get personalized recommendations that account for pre-existing conditions and health needs.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TravelInsuranceAdvisor;