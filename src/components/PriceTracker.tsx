import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, TrendingDown, Calendar, Plane, Hotel, Settings,
  Plus, AlertTriangle, Check, X, ArrowRight, DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface PriceAlert {
  id: string;
  type: 'flight' | 'hotel';
  origin?: string;
  destination: string;
  dates: {
    start: Date;
    end?: Date;
  };
  targetPrice: number;
  currentPrice?: number;
  lastChecked?: Date;
  status: 'active' | 'triggered' | 'expired';
}

interface PriceHistory {
  date: Date;
  price: number;
}

const PriceTracker: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<PriceAlert>>({
    type: 'flight',
    dates: {
      start: new Date(),
    },
  });
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Mock data for development
  useEffect(() => {
    setAlerts([
      {
        id: '1',
        type: 'flight',
        origin: 'NYC',
        destination: 'PAR',
        dates: {
          start: new Date('2024-06-15'),
          end: new Date('2024-06-22'),
        },
        targetPrice: 500,
        currentPrice: 650,
        lastChecked: new Date(),
        status: 'active',
      },
      {
        id: '2',
        type: 'hotel',
        destination: 'London',
        dates: {
          start: new Date('2024-07-10'),
          end: new Date('2024-07-15'),
        },
        targetPrice: 200,
        currentPrice: 180,
        lastChecked: new Date(),
        status: 'triggered',
      },
    ]);

    // Mock price history
    const history: PriceHistory[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      history.push({
        date,
        price: 500 + Math.random() * 200 - 100,
      });
    }
    setPriceHistory(history);
  }, []);

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

  const handleCreateAlert = () => {
    const alert: PriceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      type: newAlert.type!,
      origin: newAlert.origin,
      destination: newAlert.destination!,
      dates: newAlert.dates!,
      targetPrice: newAlert.targetPrice!,
      status: 'active',
    };

    setAlerts([...alerts, alert]);
    setShowAddAlert(false);
    setNewAlert({
      type: 'flight',
      dates: {
        start: new Date(),
      },
    });
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Price Alerts</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddAlert(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={20} />
              Add Alert
            </motion.button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                variants={itemVariants}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {alert.type === 'flight' ? (
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plane className="text-blue-600" size={24} />
                      </div>
                    ) : (
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Hotel className="text-green-600" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {alert.type === 'flight'
                          ? `${alert.origin} → ${alert.destination}`
                          : alert.destination}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(alert.dates.start, 'MMM d, yyyy')}
                        {alert.dates.end && ` - ${format(alert.dates.end, 'MMM d, yyyy')}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(alert.status)}`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-8">
                  <div>
                    <p className="text-sm text-gray-500">Target Price</p>
                    <p className="font-semibold">${alert.targetPrice}</p>
                  </div>
                  {alert.currentPrice && (
                    <div>
                      <p className="text-sm text-gray-500">Current Price</p>
                      <p className={`font-semibold ${
                        alert.currentPrice <= alert.targetPrice
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}>
                        ${alert.currentPrice}
                      </p>
                    </div>
                  )}
                  {alert.lastChecked && (
                    <div>
                      <p className="text-sm text-gray-500">Last Checked</p>
                      <p className="text-sm">
                        {format(alert.lastChecked, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  )}
                </div>

                {selectedAlert === alert.id && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-4">Price History</h4>
                    <div className="h-48 relative">
                      {/* Price history chart would go here */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Price history visualization
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Add Alert Modal */}
      <AnimatePresence>
        {showAddAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold mb-6">Create Price Alert</h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setNewAlert({ ...newAlert, type: 'flight' })}
                    className={`flex-1 p-4 rounded-lg border flex flex-col items-center gap-2 ${
                      newAlert.type === 'flight'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <Plane size={24} className={newAlert.type === 'flight' ? 'text-blue-500' : 'text-gray-400'} />
                    <span>Flight</span>
                  </button>
                  <button
                    onClick={() => setNewAlert({ ...newAlert, type: 'hotel' })}
                    className={`flex-1 p-4 rounded-lg border flex flex-col items-center gap-2 ${
                      newAlert.type === 'hotel'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <Hotel size={24} className={newAlert.type === 'hotel' ? 'text-blue-500' : 'text-gray-400'} />
                    <span>Hotel</span>
                  </button>
                </div>

                {newAlert.type === 'flight' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      placeholder="Enter origin city or airport"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newAlert.origin || ''}
                      onChange={(e) => setNewAlert({ ...newAlert, origin: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newAlert.type === 'flight' ? 'Destination' : 'City'}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter ${newAlert.type === 'flight' ? 'destination' : 'city'}`}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAlert.destination || ''}
                    onChange={(e) => setNewAlert({ ...newAlert, destination: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <DatePicker
                      selected={newAlert.dates?.start}
                      onChange={(date) => setNewAlert({
                        ...newAlert,
                        dates: { ...newAlert.dates, start: date! }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <DatePicker
                      selected={newAlert.dates?.end}
                      onChange={(date) => setNewAlert({
                        ...newAlert,
                        dates: { ...newAlert.dates, end: date! }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="number"
                      placeholder="Enter target price"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newAlert.targetPrice || ''}
                      onChange={(e) => setNewAlert({ ...newAlert, targetPrice: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddAlert(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAlert}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Alert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceTracker;