import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Laptop, Tablet, Monitor, Cloud, 
  Check, X, Bell, Calendar, Clock, Zap, 
  Download, Upload, RefreshCw, Settings, Plus,
  Trash2, Edit, Save, Info, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'laptop';
  lastSync: Date;
  status: 'active' | 'inactive';
  platform: string;
  browser?: string;
  app?: string;
  version: string;
}

interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'travel' | 'booking' | 'packing' | 'document' | 'other';
  syncedDevices: string[];
}

const MultiDeviceSync: React.FC = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'devices' | 'reminders' | 'settings'>('devices');
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | 'laptop'>('mobile');
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    date: new Date(),
    time: format(new Date(), 'HH:mm'),
    priority: 'medium',
    category: 'travel',
    isCompleted: false,
    syncedDevices: []
  });
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 15,
    syncOnWifiOnly: false,
    notifyOnSync: true,
    backgroundSync: true
  });

  useEffect(() => {
    fetchDevicesAndReminders();
  }, []);

  const fetchDevicesAndReminders = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock devices
      const mockDevices: Device[] = [
        {
          id: 'd1',
          name: 'My iPhone',
          type: 'mobile',
          lastSync: new Date(),
          status: 'active',
          platform: 'iOS',
          app: 'TravelAI App',
          version: '2.1.0'
        },
        {
          id: 'd2',
          name: 'Work Laptop',
          type: 'laptop',
          lastSync: new Date(Date.now() - 3600000), // 1 hour ago
          status: 'active',
          platform: 'Windows',
          browser: 'Chrome',
          version: '122.0.6261.112'
        },
        {
          id: 'd3',
          name: 'iPad Pro',
          type: 'tablet',
          lastSync: new Date(Date.now() - 86400000), // 1 day ago
          status: 'inactive',
          platform: 'iPadOS',
          app: 'TravelAI App',
          version: '2.0.5'
        }
      ];
      
      // Mock reminders
      const mockReminders: Reminder[] = [
        {
          id: 'r1',
          title: 'Book airport transfer',
          description: 'Arrange transportation to JFK for Paris flight',
          date: new Date(Date.now() + 86400000 * 7), // 7 days from now
          time: '14:00',
          isCompleted: false,
          priority: 'high',
          category: 'booking',
          syncedDevices: ['d1', 'd2']
        },
        {
          id: 'r2',
          title: 'Check-in for flight',
          date: new Date(Date.now() + 86400000 * 14), // 14 days from now
          time: '10:00',
          isCompleted: false,
          priority: 'high',
          category: 'travel',
          syncedDevices: ['d1', 'd2', 'd3']
        },
        {
          id: 'r3',
          title: 'Renew passport',
          description: 'Expires in 3 months, renewal takes 6-8 weeks',
          date: new Date(Date.now() + 86400000 * 3), // 3 days from now
          isCompleted: false,
          priority: 'medium',
          category: 'document',
          syncedDevices: ['d2']
        },
        {
          id: 'r4',
          title: 'Pack winter clothes',
          description: 'Check weather forecast before packing',
          date: new Date(Date.now() + 86400000 * 10), // 10 days from now
          time: '18:00',
          isCompleted: true,
          priority: 'low',
          category: 'packing',
          syncedDevices: ['d1', 'd3']
        }
      ];
      
      setDevices(mockDevices);
      setReminders(mockReminders);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching devices and reminders:', error);
      setIsLoading(false);
    }
  };

  const syncAllDevices = async () => {
    setIsSyncing(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last sync time for all devices
      setDevices(devices.map(device => ({
        ...device,
        lastSync: new Date()
      })));
    } catch (error) {
      console.error('Error syncing devices:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addNewDevice = () => {
    if (!newDeviceName.trim()) return;
    
    const newDevice: Device = {
      id: `d${devices.length + 1}`,
      name: newDeviceName,
      type: newDeviceType,
      lastSync: new Date(),
      status: 'active',
      platform: getPlatformByType(newDeviceType),
      version: '1.0.0'
    };
    
    setDevices([...devices, newDevice]);
    setNewDeviceName('');
    setNewDeviceType('mobile');
    setShowAddDeviceModal(false);
  };

  const getPlatformByType = (type: 'mobile' | 'tablet' | 'desktop' | 'laptop'): string => {
    switch (type) {
      case 'mobile':
        return 'iOS';
      case 'tablet':
        return 'iPadOS';
      case 'desktop':
        return 'Windows';
      case 'laptop':
        return 'macOS';
      default:
        return 'Unknown';
    }
  };

  const removeDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    
    // Also remove device from synced reminders
    setReminders(reminders.map(reminder => ({
      ...reminder,
      syncedDevices: reminder.syncedDevices.filter(id => id !== deviceId)
    })));
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId
        ? { ...device, status: device.status === 'active' ? 'inactive' : 'active' }
        : device
    ));
  };

  const addOrUpdateReminder = () => {
    if (!newReminder.title?.trim()) return;
    
    if (editingReminder) {
      // Update existing reminder
      setReminders(reminders.map(reminder => 
        reminder.id === editingReminder.id
          ? { ...reminder, ...newReminder, syncedDevices: newReminder.syncedDevices || [] } as Reminder
          : reminder
      ));
    } else {
      // Add new reminder
      const reminder: Reminder = {
        id: `r${reminders.length + 1}`,
        title: newReminder.title!,
        description: newReminder.description,
        date: newReminder.date!,
        time: newReminder.time,
        isCompleted: false,
        priority: newReminder.priority as 'low' | 'medium' | 'high',
        category: newReminder.category as 'travel' | 'booking' | 'packing' | 'document' | 'other',
        syncedDevices: newReminder.syncedDevices || []
      };
      
      setReminders([...reminders, reminder]);
    }
    
    setNewReminder({
      title: '',
      description: '',
      date: new Date(),
      time: format(new Date(), 'HH:mm'),
      priority: 'medium',
      category: 'travel',
      isCompleted: false,
      syncedDevices: []
    });
    setEditingReminder(null);
    setShowAddReminderModal(false);
  };

  const editReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setNewReminder({
      ...reminder
    });
    setShowAddReminderModal(true);
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  const toggleReminderCompletion = (reminderId: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId
        ? { ...reminder, isCompleted: !reminder.isCompleted }
        : reminder
    ));
  };

  const getDeviceIcon = (type: string, size = 24) => {
    switch (type) {
      case 'mobile':
        return <Smartphone size={size} />;
      case 'tablet':
        return <Tablet size={size} />;
      case 'desktop':
        return <Monitor size={size} />;
      case 'laptop':
        return <Laptop size={size} />;
      default:
        return <Smartphone size={size} />;
    }
  };

  const getCategoryIcon = (category: string, size = 20) => {
    switch (category) {
      case 'travel':
        return <Plane size={size} />;
      case 'booking':
        return <Calendar size={size} />;
      case 'packing':
        return <Briefcase size={size} />;
      case 'document':
        return <FileText size={size} />;
      default:
        return <Info size={size} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'high':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Multi-Device Sync & Reminders</h1>
              <p className="text-gray-600">Keep your travel plans synchronized across all your devices</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={syncAllDevices}
              disabled={isSyncing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Cloud size={20} />
                  <span>Sync Now</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Sync Status Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Cloud className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Sync Status</h2>
                  <p className="text-gray-600">
                    Last synced: {format(new Date(), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {devices.filter(d => d.status === 'active').length} Active Devices
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {reminders.filter(r => !r.isCompleted).length} Pending Reminders
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Auto-sync {syncSettings.autoSync ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('devices')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'devices'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Devices
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'reminders'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reminders
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sync Settings
              </button>
            </div>

            <div className="p-6">
              {/* Devices Tab */}
              {activeTab === 'devices' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Your Connected Devices</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddDeviceModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={20} />
                      <span>Add Device</span>
                    </motion.button>
                  </div>
                  
                  {devices.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Smartphone className="mx-auto mb-4 text-gray-300" size={48} />
                      <h4 className="text-xl font-semibold mb-2">No devices connected</h4>
                      <p className="text-gray-500 mb-6">Add your devices to keep everything in sync</p>
                      <button
                        onClick={() => setShowAddDeviceModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add First Device
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {devices.map((device) => (
                        <motion.div
                          key={device.id}
                          variants={itemVariants}
                          className={`border rounded-lg p-6 ${
                            device.status === 'active' ? 'border-green-200' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg ${
                                device.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {getDeviceIcon(device.type)}
                              </div>
                              <div>
                                <h4 className="font-bold">{device.name}</h4>
                                <p className="text-sm text-gray-500">{device.platform}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`w-2 h-2 rounded-full ${
                                    device.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                  }`}></span>
                                  <span className="text-sm text-gray-500 capitalize">{device.status}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleDeviceStatus(device.id)}
                                className={`p-2 rounded-full ${
                                  device.status === 'active'
                                    ? 'text-yellow-500 hover:bg-yellow-50'
                                    : 'text-green-500 hover:bg-green-50'
                                }`}
                                title={device.status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {device.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                              </button>
                              <button
                                onClick={() => removeDevice(device.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                title="Remove Device"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Last Synced</p>
                              <p>{format(device.lastSync, 'MMM d, h:mm a')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Version</p>
                              <p>{device.version}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">
                                {device.browser ? 'Browser' : 'App'}
                              </p>
                              <p>{device.browser || device.app}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Synced Items</p>
                              <p>{reminders.filter(r => r.syncedDevices.includes(device.id)).length} reminders</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Reminders Tab */}
              {activeTab === 'reminders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Your Travel Reminders</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingReminder(null);
                        setNewReminder({
                          title: '',
                          description: '',
                          date: new Date(),
                          time: format(new Date(), 'HH:mm'),
                          priority: 'medium',
                          category: 'travel',
                          isCompleted: false,
                          syncedDevices: []
                        });
                        setShowAddReminderModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={20} />
                      <span>Add Reminder</span>
                    </motion.button>
                  </div>
                  
                  {reminders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Bell className="mx-auto mb-4 text-gray-300" size={48} />
                      <h4 className="text-xl font-semibold mb-2">No reminders yet</h4>
                      <p className="text-gray-500 mb-6">Create reminders to stay on top of your travel plans</p>
                      <button
                        onClick={() => {
                          setEditingReminder(null);
                          setNewReminder({
                            title: '',
                            description: '',
                            date: new Date(),
                            time: format(new Date(), 'HH:mm'),
                            priority: 'medium',
                            category: 'travel',
                            isCompleted: false,
                            syncedDevices: []
                          });
                          setShowAddReminderModal(true);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create First Reminder
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reminders.map((reminder) => (
                        <motion.div
                          key={reminder.id}
                          variants={itemVariants}
                          className={`border rounded-lg p-4 ${
                            reminder.isCompleted ? 'border-gray-200 bg-gray-50' : 'border-blue-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleReminderCompletion(reminder.id)}
                                className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                                  reminder.isCompleted
                                    ? 'bg-green-500 text-white'
                                    : 'border border-gray-300'
                                }`}
                              >
                                {reminder.isCompleted && <Check size={12} />}
                              </button>
                              <div>
                                <h4 className={`font-bold ${reminder.isCompleted ? 'line-through text-gray-400' : ''}`}>
                                  {reminder.title}
                                </h4>
                                {reminder.description && (
                                  <p className={`text-sm ${reminder.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {reminder.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Calendar size={14} />
                                    <span>{format(reminder.date, 'MMM d, yyyy')}</span>
                                  </div>
                                  {reminder.time && (
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Clock size={14} />
                                      <span>{reminder.time}</span>
                                    </div>
                                  )}
                                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(reminder.priority)}`}>
                                    {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                                  </span>
                                  <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {getCategoryIcon(reminder.category, 12)}
                                    <span>{reminder.category.charAt(0).toUpperCase() + reminder.category.slice(1)}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => editReminder(reminder)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => deleteReminder(reminder.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          
                          {reminder.syncedDevices.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-gray-500 mb-2">Synced to:</p>
                              <div className="flex flex-wrap gap-2">
                                {reminder.syncedDevices.map(deviceId => {
                                  const device = devices.find(d => d.id === deviceId);
                                  return device ? (
                                    <div key={deviceId} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                                      {getDeviceIcon(device.type, 12)}
                                      <span>{device.name}</span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg font-semibold mb-6">Sync Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="text-blue-600" size={24} />
                        <div>
                          <h4 className="font-medium">Auto-Sync</h4>
                          <p className="text-sm text-gray-500">Automatically sync data across devices</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={syncSettings.autoSync}
                          onChange={() => setSyncSettings({
                            ...syncSettings,
                            autoSync: !syncSettings.autoSync
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="text-blue-600" size={24} />
                        <div>
                          <h4 className="font-medium">Sync Interval</h4>
                          <p className="text-sm text-gray-500">How often to sync data (in minutes)</p>
                        </div>
                      </div>
                      <select
                        value={syncSettings.syncInterval}
                        onChange={(e) => setSyncSettings({
                          ...syncSettings,
                          syncInterval: parseInt(e.target.value)
                        })}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!syncSettings.autoSync}
                      >
                        <option value={5}>5 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="text-blue-600" size={24} />
                        <div>
                          <h4 className="font-medium">Sync on Wi-Fi Only</h4>
                          <p className="text-sm text-gray-500">Only sync when connected to Wi-Fi</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={syncSettings.syncOnWifiOnly}
                          onChange={() => setSyncSettings({
                            ...syncSettings,
                            syncOnWifiOnly: !syncSettings.syncOnWifiOnly
                          })}
                          disabled={!syncSettings.autoSync}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="text-blue-600" size={24} />
                        <div>
                          <h4 className="font-medium">Sync Notifications</h4>
                          <p className="text-sm text-gray-500">Get notified when sync is complete</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={syncSettings.notifyOnSync}
                          onChange={() => setSyncSettings({
                            ...syncSettings,
                            notifyOnSync: !syncSettings.notifyOnSync
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="text-blue-600" size={24} />
                        <div>
                          <h4 className="font-medium">Background Sync</h4>
                          <p className="text-sm text-gray-500">Sync even when app is closed</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={syncSettings.backgroundSync}
                          onChange={() => setSyncSettings({
                            ...syncSettings,
                            backgroundSync: !syncSettings.backgroundSync
                          })}
                          disabled={!syncSettings.autoSync}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="text-blue-600 mt-1" size={20} />
                        <div>
                          <h4 className="font-medium text-blue-800">Data Usage</h4>
                          <p className="text-blue-700 text-sm">
                            Syncing uses approximately 5-10MB of data per day, depending on your usage.
                            Enable "Sync on Wi-Fi Only" to reduce mobile data usage.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save size={20} />
                        <span>Save Settings</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Device Modal */}
      <AnimatePresence>
        {showAddDeviceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add New Device</h3>
                <button
                  onClick={() => setShowAddDeviceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="e.g., My iPhone, Work Laptop"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device Type
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { type: 'mobile', label: 'Mobile', icon: Smartphone },
                      { type: 'tablet', label: 'Tablet', icon: Tablet },
                      { type: 'laptop', label: 'Laptop', icon: Laptop },
                      { type: 'desktop', label: 'Desktop', icon: Monitor }
                    ].map((device) => (
                      <button
                        key={device.type}
                        onClick={() => setNewDeviceType(device.type as any)}
                        className={`p-4 rounded-lg border text-center transition-colors ${
                          newDeviceType === device.type
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <device.icon className="mx-auto mb-2" size={24} />
                        <span className="text-sm">{device.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-blue-800">How to Connect</h4>
                      <p className="text-blue-700 text-sm">
                        After adding this device, you'll need to sign in to your account on the new device
                        and enter the verification code that will be sent to your email.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddDeviceModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addNewDevice}
                    disabled={!newDeviceName.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Add Device
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Reminder Modal */}
      <AnimatePresence>
        {showAddReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
                </h3>
                <button
                  onClick={() => setShowAddReminderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newReminder.title || ''}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="e.g., Book airport transfer"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newReminder.description || ''}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    placeholder="Add more details..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newReminder.date ? format(newReminder.date, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setNewReminder({ ...newReminder, date: new Date(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={newReminder.time || ''}
                      onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newReminder.priority || 'medium'}
                      onChange={(e) => setNewReminder({
                        ...newReminder,
                        priority: e.target.value as 'low' | 'medium' | 'high'
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newReminder.category || 'travel'}
                      onChange={(e) => setNewReminder({
                        ...newReminder,
                        category: e.target.value as 'travel' | 'booking' | 'packing' | 'document' | 'other'
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="travel">Travel</option>
                      <option value="booking">Booking</option>
                      <option value="packing">Packing</option>
                      <option value="document">Document</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sync to Devices
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                    {devices.map((device) => (
                      <label key={device.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(newReminder.syncedDevices || []).includes(device.id)}
                          onChange={(e) => {
                            const syncedDevices = newReminder.syncedDevices || [];
                            if (e.target.checked) {
                              setNewReminder({
                                ...newReminder,
                                syncedDevices: [...syncedDevices, device.id]
                              });
                            } else {
                              setNewReminder({
                                ...newReminder,
                                syncedDevices: syncedDevices.filter(id => id !== device.id)
                              });
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.type, 16)}
                          <span>{device.name}</span>
                          {device.status !== 'active' && (
                            <span className="text-xs text-yellow-600">(Inactive)</span>
                          )}
                        </div>
                      </label>
                    ))}
                    {devices.length === 0 && (
                      <p className="text-sm text-gray-500 py-2">No devices available. Add devices first.</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddReminderModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addOrUpdateReminder}
                    disabled={!newReminder.title?.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={20} />
                    <span>{editingReminder ? 'Update' : 'Add'} Reminder</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiDeviceSync;