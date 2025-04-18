import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Calendar, DollarSign, Plane, Hotel, Car,
  Clock, Check, X, ArrowRight, Loader, HelpCircle, FileText
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'package';
  provider: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  price: number;
  refundable: boolean;
  cancellationPolicy: {
    fullRefundBefore: Date;
    partialRefundBefore: Date;
    partialRefundAmount: number;
    nonRefundableAfter: Date;
  };
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface RefundEstimate {
  eligibleAmount: number;
  penaltyAmount: number;
  totalRefund: number;
  refundPercentage: number;
  cancellationFees: number;
  processingTime: string;
  refundMethod: string;
}

const CancellationNavigator: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [refundEstimate, setRefundEstimate] = useState<RefundEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationComplete, setCancellationComplete] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'B12345',
      type: 'flight',
      provider: 'Delta Airlines',
      destination: 'New York to London',
      startDate: addDays(new Date(), 15),
      endDate: addDays(new Date(), 22),
      price: 850,
      refundable: true,
      cancellationPolicy: {
        fullRefundBefore: addDays(new Date(), 10),
        partialRefundBefore: addDays(new Date(), 5),
        partialRefundAmount: 425,
        nonRefundableAfter: addDays(new Date(), 3)
      },
      status: 'confirmed'
    },
    {
      id: 'B12346',
      type: 'hotel',
      provider: 'Marriott Hotels',
      destination: 'London City Center',
      startDate: addDays(new Date(), 15),
      endDate: addDays(new Date(), 22),
      price: 1200,
      refundable: true,
      cancellationPolicy: {
        fullRefundBefore: addDays(new Date(), 7),
        partialRefundBefore: addDays(new Date(), 3),
        partialRefundAmount: 600,
        nonRefundableAfter: addDays(new Date(), 1)
      },
      status: 'confirmed'
    },
    {
      id: 'B12347',
      type: 'car',
      provider: 'Hertz',
      destination: 'London Airport',
      startDate: addDays(new Date(), 15),
      endDate: addDays(new Date(), 22),
      price: 350,
      refundable: true,
      cancellationPolicy: {
        fullRefundBefore: addDays(new Date(), 2),
        partialRefundBefore: addDays(new Date(), 1),
        partialRefundAmount: 175,
        nonRefundableAfter: addDays(new Date(), 0)
      },
      status: 'confirmed'
    },
    {
      id: 'B12348',
      type: 'package',
      provider: 'EuroTrip Packages',
      destination: 'European Explorer: London, Paris, Rome',
      startDate: addDays(new Date(), 30),
      endDate: addDays(new Date(), 44),
      price: 3500,
      refundable: true,
      cancellationPolicy: {
        fullRefundBefore: addDays(new Date(), 25),
        partialRefundBefore: addDays(new Date(), 15),
        partialRefundAmount: 1750,
        nonRefundableAfter: addDays(new Date(), 7)
      },
      status: 'confirmed'
    }
  ]);

  const calculateRefund = async (booking: Booking) => {
    setIsCalculating(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and calculate based on the booking data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const today = new Date();
      let refundAmount = 0;
      
      if (today < booking.cancellationPolicy.fullRefundBefore) {
        refundAmount = booking.price;
      } else if (today < booking.cancellationPolicy.partialRefundBefore) {
        refundAmount = booking.cancellationPolicy.partialRefundAmount;
      }
      
      const cancellationFee = booking.price - refundAmount;
      
      const estimate: RefundEstimate = {
        eligibleAmount: refundAmount,
        penaltyAmount: cancellationFee,
        totalRefund: refundAmount,
        refundPercentage: Math.round((refundAmount / booking.price) * 100),
        cancellationFees: cancellationFee,
        processingTime: '5-7 business days',
        refundMethod: 'Original payment method'
      };
      
      setRefundEstimate(estimate);
    } catch (error) {
      console.error('Error calculating refund:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const processCancellation = async () => {
    if (!selectedBooking) return;
    
    setIsCancelling(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the booking status
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: 'cancelled' as const } 
            : booking
        )
      );
      
      setCancellationComplete(true);
    } catch (error) {
      console.error('Error processing cancellation:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const resetFlow = () => {
    setSelectedBooking(null);
    setRefundEstimate(null);
    setShowConfirmation(false);
    setCancellationComplete(false);
    setCancellationReason('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="text-blue-500" size={24} />;
      case 'hotel':
        return <Hotel className="text-green-500" size={24} />;
      case 'car':
        return <Car className="text-orange-500" size={24} />;
      case 'package':
        return <Package className="text-purple-500" size={24} />;
      default:
        return <HelpCircle className="text-gray-500" size={24} />;
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
            <AlertTriangle className="text-amber-500" size={32} />
            <h1 className="text-2xl font-bold">Cancellation Navigator</h1>
          </div>

          <AnimatePresence mode="wait">
            {!selectedBooking ? (
              <motion.div
                key="booking-selection"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <p className="text-lg text-gray-600 mb-6">
                  Need to cancel a booking? Our AI-powered Cancellation Navigator will guide you through the process,
                  help you understand the refund policy, and maximize your refund potential.
                </p>

                <h2 className="text-xl font-bold mb-4">Select a booking to cancel:</h2>
                
                <div className="space-y-4">
                  {bookings.filter(booking => booking.status !== 'cancelled').map((booking) => (
                    <motion.div
                      key={booking.id}
                      variants={itemVariants}
                      className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedBooking(booking);
                        calculateRefund(booking);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          {getTypeIcon(booking.type)}
                          <div>
                            <h3 className="font-bold text-lg">{booking.provider}</h3>
                            <p className="text-gray-600">{booking.destination}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>
                                  {format(booking.startDate, 'MMM d')} - {format(booking.endDate, 'MMM d, yyyy')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>{differenceInDays(booking.endDate, booking.startDate)} days</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${booking.price}</p>
                          <p className="text-sm text-gray-500">Booking #{booking.id}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : cancellationComplete ? (
              <motion.div
                key="cancellation-complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="text-green-600" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Cancellation Complete</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your booking has been successfully cancelled. A confirmation email has been sent to your registered email address.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
                  <h3 className="font-bold mb-4">Refund Details</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>Refund Amount:</span>
                      <span className="font-bold text-green-600">${refundEstimate?.totalRefund}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span>{refundEstimate?.processingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refund Method:</span>
                      <span>{refundEstimate?.refundMethod}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetFlow}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            ) : showConfirmation ? (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-amber-800">Cancellation Confirmation</h3>
                      <p className="text-amber-700">
                        This action cannot be undone. Please review the details below before confirming.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold mb-4">Booking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Booking Reference</p>
                      <p className="font-medium">{selectedBooking.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Provider</p>
                      <p className="font-medium">{selectedBooking.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{selectedBooking.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium">
                        {format(selectedBooking.startDate, 'MMM d')} - {format(selectedBooking.endDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold mb-4">Refund Estimate</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Original Amount:</span>
                      <span className="font-medium">${selectedBooking.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancellation Fee:</span>
                      <span className="font-medium text-red-600">-${refundEstimate?.cancellationFees}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-bold">Total Refund:</span>
                      <span className="font-bold text-green-600">${refundEstimate?.totalRefund}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Refund Percentage:</span>
                      <span>{refundEstimate?.refundPercentage}% of original amount</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Cancellation
                  </label>
                  <select
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="change_of_plans">Change of Plans</option>
                    <option value="emergency">Emergency/Illness</option>
                    <option value="better_deal">Found a Better Deal</option>
                    <option value="weather">Weather Concerns</option>
                    <option value="work">Work Commitments</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={processCancellation}
                    disabled={!cancellationReason || isCancelling}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCancelling ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <X size={20} />
                        <span>Confirm Cancellation</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="refund-estimate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    ← Back to bookings
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    {getTypeIcon(selectedBooking.type)}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{selectedBooking.provider}</h2>
                      <p className="text-gray-600">{selectedBooking.destination}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            {format(selectedBooking.startDate, 'MMM d')} - {format(selectedBooking.endDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{differenceInDays(selectedBooking.endDate, selectedBooking.startDate)} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${selectedBooking.price}</p>
                      <p className="text-sm text-gray-500">Booking #{selectedBooking.id}</p>
                    </div>
                  </div>
                </div>

                {isCalculating ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
                    <p className="text-gray-600">Calculating your potential refund...</p>
                  </div>
                ) : refundEstimate ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">Refund Estimate</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500 mb-1">Refund Amount</p>
                          <p className="text-2xl font-bold text-green-600">${refundEstimate.totalRefund}</p>
                          <p className="text-xs text-gray-500">{refundEstimate.refundPercentage}% of original price</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500 mb-1">Cancellation Fee</p>
                          <p className="text-2xl font-bold text-red-600">${refundEstimate.cancellationFees}</p>
                          <p className="text-xs text-gray-500">{100 - refundEstimate.refundPercentage}% penalty</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500 mb-1">Processing Time</p>
                          <p className="text-2xl font-bold">{refundEstimate.processingTime}</p>
                          <p className="text-xs text-gray-500">To original payment method</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">Cancellation Policy</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          {new Date() < selectedBooking.cancellationPolicy.fullRefundBefore ? (
                            <Check size={20} className="text-green-500 mt-1" />
                          ) : (
                            <X size={20} className="text-red-500 mt-1" />
                          )}
                          <div>
                            <p className="font-medium">Full Refund Available Until:</p>
                            <p className="text-gray-600">
                              {format(selectedBooking.cancellationPolicy.fullRefundBefore, 'MMMM d, yyyy')}
                              {' '}({differenceInDays(selectedBooking.cancellationPolicy.fullRefundBefore, new Date())} days from now)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          {new Date() < selectedBooking.cancellationPolicy.partialRefundBefore ? (
                            <Check size={20} className="text-green-500 mt-1" />
                          ) : (
                            <X size={20} className="text-red-500 mt-1" />
                          )}
                          <div>
                            <p className="font-medium">Partial Refund Available Until:</p>
                            <p className="text-gray-600">
                              {format(selectedBooking.cancellationPolicy.partialRefundBefore, 'MMMM d, yyyy')}
                              {' '}({differenceInDays(selectedBooking.cancellationPolicy.partialRefundBefore, new Date())} days from now)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          {new Date() < selectedBooking.cancellationPolicy.nonRefundableAfter ? (
                            <Check size={20} className="text-green-500 mt-1" />
                          ) : (
                            <X size={20} className="text-red-500 mt-1" />
                          )}
                          <div>
                            <p className="font-medium">Non-Refundable After:</p>
                            <p className="text-gray-600">
                              {format(selectedBooking.cancellationPolicy.nonRefundableAfter, 'MMMM d, yyyy')}
                              {' '}({differenceInDays(selectedBooking.cancellationPolicy.nonRefundableAfter, new Date())} days from now)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <FileText size={20} className="text-blue-500 mt-1" />
                          <div>
                            <p className="font-medium">Optimal Timing:</p>
                            <p className="text-gray-600">
                              {new Date() < selectedBooking.cancellationPolicy.fullRefundBefore ? (
                                <>
                                  You're currently eligible for a <span className="text-green-600 font-medium">full refund</span>. 
                                  For maximum refund, cancel before {format(selectedBooking.cancellationPolicy.fullRefundBefore, 'MMMM d, yyyy')}.
                                </>
                              ) : new Date() < selectedBooking.cancellationPolicy.partialRefundBefore ? (
                                <>
                                  You're currently eligible for a <span className="text-yellow-600 font-medium">partial refund</span> of ${selectedBooking.cancellationPolicy.partialRefundAmount}.
                                  For maximum refund, cancel as soon as possible.
                                </>
                              ) : (
                                <>
                                  You're currently in the <span className="text-red-600 font-medium">non-refundable period</span>.
                                  Consider rescheduling instead of cancelling if possible.
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText size={20} className="text-blue-500 mt-1" />
                          <div>
                            <p className="font-medium">Alternative Options:</p>
                            <p className="text-gray-600">
                              Consider changing your travel dates instead of cancelling completely.
                              Many providers offer date changes for a smaller fee than full cancellation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowConfirmation(true)}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <X size={20} />
                        <span>Proceed with Cancellation</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-lg p-8 text-center">
                    <AlertTriangle className="mx-auto mb-4 text-red-500" size={32} />
                    <h3 className="text-xl font-semibold mb-2">Error Calculating Refund</h3>
                    <p className="text-gray-600 mb-4">
                      We encountered an issue while calculating your potential refund.
                      Please try again or contact customer support.
                    </p>
                    <button
                      onClick={() => calculateRefund(selectedBooking)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationNavigator;