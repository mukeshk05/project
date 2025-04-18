import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Copy, Check, Zap, Globe, Plane, Hotel, Car,
  Calendar, MapPin, DollarSign, Users, Search, Loader,
  ExternalLink, Download, Clipboard, Terminal, Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface WidgetConfig {
  type: 'search' | 'deals' | 'map' | 'calendar';
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  size: 'small' | 'medium' | 'large';
  defaultLocation?: string;
  showPrices: boolean;
  responsive: boolean;
  apiKey: string;
}

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  type: 'search' | 'deals' | 'map' | 'calendar';
  image: string;
  popularity: number;
}

const TravelWidgetApi: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'widgets' | 'docs' | 'api'>('widgets');
  const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplate | null>(null);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    type: 'search',
    theme: 'light',
    primaryColor: '#3B82F6',
    size: 'medium',
    showPrices: true,
    responsive: true,
    apiKey: 'demo-api-key-' + Math.random().toString(36).substring(2, 10)
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [widgetTemplates, setWidgetTemplates] = useState<WidgetTemplate[]>([]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    fetchWidgetTemplates();
  }, []);

  const fetchWidgetTemplates = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTemplates: WidgetTemplate[] = [
        {
          id: 'search-widget',
          name: 'Travel Search Widget',
          description: 'A comprehensive search widget for flights, hotels, and car rentals.',
          type: 'search',
          image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000',
          popularity: 89
        },
        {
          id: 'deals-widget',
          name: 'Hot Deals Widget',
          description: 'Showcase the latest travel deals and discounts from your partners.',
          type: 'deals',
          image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=2000',
          popularity: 76
        },
        {
          id: 'map-widget',
          name: 'Interactive Map Widget',
          description: 'Display destinations on an interactive map with pricing and availability.',
          type: 'map',
          image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000',
          popularity: 82
        },
        {
          id: 'calendar-widget',
          name: 'Seasonal Calendar Widget',
          description: 'Show the best times to visit different destinations based on weather and prices.',
          type: 'calendar',
          image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=2000',
          popularity: 68
        }
      ];
      
      setWidgetTemplates(mockTemplates);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching widget templates:', error);
      setIsLoading(false);
    }
  };

  const generateWidgetCode = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error generating widget code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getWidgetCode = () => {
    return `<!-- TravelAI Widget -->
<div id="travel-ai-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://api.travelai.com/widgets/v1/loader.js';
    script.async = true;
    script.onload = function() {
      TravelAI.init({
        container: '#travel-ai-widget',
        apiKey: '${widgetConfig.apiKey}',
        type: '${widgetConfig.type}',
        theme: '${widgetConfig.theme}',
        primaryColor: '${widgetConfig.primaryColor}',
        size: '${widgetConfig.size}',
        showPrices: ${widgetConfig.showPrices},
        responsive: ${widgetConfig.responsive},
        ${widgetConfig.defaultLocation ? `defaultLocation: '${widgetConfig.defaultLocation}',` : ''}
      });
    };
    document.head.appendChild(script);
  })();
</script>`;
  };

  const getApiCode = () => {
    return `// Using fetch
fetch('https://api.travelai.com/v1/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${widgetConfig.apiKey}'
  },
  body: JSON.stringify({
    type: 'flight',
    origin: 'JFK',
    destination: 'LAX',
    departDate: '2024-06-15',
    returnDate: '2024-06-22',
    passengers: 2
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
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
          <p className="text-gray-600">Loading widget templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
              <Code className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Travel Widget API
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Integrate AI-powered travel widgets and APIs into your website or application
            </motion.p>
          </div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('widgets')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'widgets'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Widgets
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'docs'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Documentation
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`flex-1 px-6 py-3 font-medium ${
                  activeTab === 'api'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                API Reference
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'widgets' && (
                  <motion.div
                    key="widgets"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {!selectedTemplate ? (
                      <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Choose a Widget Template</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {widgetTemplates.map((template) => (
                            <motion.div
                              key={template.id}
                              whileHover={{ y: -5 }}
                              className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setWidgetConfig({
                                  ...widgetConfig,
                                  type: template.type
                                });
                              }}
                            >
                              <div className="h-48 relative">
                                <img
                                  src={template.image}
                                  alt={template.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                                  {template.popularity}% Popular
                                </div>
                              </div>
                              <div className="p-6">
                                <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                                <p className="text-gray-600 mb-4">{template.description}</p>
                                <div className="flex justify-between items-center">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm capitalize">
                                    {template.type}
                                  </span>
                                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                    Select
                                    <ArrowRight size={16} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                          <button
                            onClick={() => setSelectedTemplate(null)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            ← Back to templates
                          </button>
                          <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h3 className="font-semibold mb-4">Widget Configuration</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Theme
                                </label>
                                <select
                                  value={widgetConfig.theme}
                                  onChange={(e) => setWidgetConfig({
                                    ...widgetConfig,
                                    theme: e.target.value as any
                                  })}
                                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="light">Light</option>
                                  <option value="dark">Dark</option>
                                  <option value="auto">Auto (System Preference)</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Primary Color
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={widgetConfig.primaryColor}
                                    onChange={(e) => setWidgetConfig({
                                      ...widgetConfig,
                                      primaryColor: e.target.value
                                    })}
                                    className="h-10 w-10 rounded border"
                                  />
                                  <input
                                    type="text"
                                    value={widgetConfig.primaryColor}
                                    onChange={(e) => setWidgetConfig({
                                      ...widgetConfig,
                                      primaryColor: e.target.value
                                    })}
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Size
                                </label>
                                <select
                                  value={widgetConfig.size}
                                  onChange={(e) => setWidgetConfig({
                                    ...widgetConfig,
                                    size: e.target.value as any
                                  })}
                                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="small">Small</option>
                                  <option value="medium">Medium</option>
                                  <option value="large">Large</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Default Location (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={widgetConfig.defaultLocation || ''}
                                  onChange={(e) => setWidgetConfig({
                                    ...widgetConfig,
                                    defaultLocation: e.target.value
                                  })}
                                  placeholder="e.g., New York, Paris, Tokyo"
                                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={widgetConfig.showPrices}
                                    onChange={(e) => setWidgetConfig({
                                      ...widgetConfig,
                                      showPrices: e.target.checked
                                    })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                  />
                                  <span>Show Prices</span>
                                </label>
                                
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={widgetConfig.responsive}
                                    onChange={(e) => setWidgetConfig({
                                      ...widgetConfig,
                                      responsive: e.target.checked
                                    })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                  />
                                  <span>Responsive</span>
                                </label>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  API Key
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={widgetConfig.apiKey}
                                    readOnly
                                    className="flex-1 p-2 border rounded-lg bg-gray-50"
                                  />
                                  <button
                                    onClick={() => copyToClipboard(widgetConfig.apiKey)}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    {isCopied ? <Check size={20} /> : <Copy size={20} />}
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  This is a demo API key. In production, you'll need to generate a real API key.
                                </p>
                              </div>
                              
                              <div className="pt-4">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={generateWidgetCode}
                                  disabled={isGenerating}
                                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                  {isGenerating ? (
                                    <>
                                      <Loader className="animate-spin" size={20} />
                                      <span>Generating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Zap size={20} />
                                      <span>Generate Widget Code</span>
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold">Widget Preview</h3>
                              <div className="flex border rounded-lg overflow-hidden">
                                <button
                                  onClick={() => setPreviewMode('desktop')}
                                  className={`px-3 py-1 ${
                                    previewMode === 'desktop'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white text-gray-600'
                                  }`}
                                >
                                  Desktop
                                </button>
                                <button
                                  onClick={() => setPreviewMode('mobile')}
                                  className={`px-3 py-1 ${
                                    previewMode === 'mobile'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white text-gray-600'
                                  }`}
                                >
                                  Mobile
                                </button>
                              </div>
                            </div>
                            
                            <div className={`border rounded-lg overflow-hidden ${
                              previewMode === 'mobile' ? 'w-[375px] mx-auto' : 'w-full'
                            }`}>
                              <div className={`p-4 ${widgetConfig.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                                <div className="mb-4">
                                  <h4 className="font-semibold" style={{ color: widgetConfig.primaryColor }}>
                                    {selectedTemplate.name}
                                  </h4>
                                </div>
                                
                                {selectedTemplate.type === 'search' && (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input
                                          type="text"
                                          placeholder="From"
                                          className={`w-full pl-9 pr-3 py-2 rounded-lg ${
                                            widgetConfig.theme === 'dark' 
                                              ? 'bg-gray-700 border-gray-600' 
                                              : 'border'
                                          }`}
                                          defaultValue={widgetConfig.defaultLocation || ''}
                                        />
                                      </div>
                                      <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input
                                          type="text"
                                          placeholder="To"
                                          className={`w-full pl-9 pr-3 py-2 rounded-lg ${
                                            widgetConfig.theme === 'dark' 
                                              ? 'bg-gray-700 border-gray-600' 
                                              : 'border'
                                          }`}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input
                                          type="text"
                                          placeholder="Depart"
                                          className={`w-full pl-9 pr-3 py-2 rounded-lg ${
                                            widgetConfig.theme === 'dark' 
                                              ? 'bg-gray-700 border-gray-600' 
                                              : 'border'
                                          }`}
                                        />
                                      </div>
                                      <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input
                                          type="text"
                                          placeholder="Return"
                                          className={`w-full pl-9 pr-3 py-2 rounded-lg ${
                                            widgetConfig.theme === 'dark' 
                                              ? 'bg-gray-700 border-gray-600' 
                                              : 'border'
                                          }`}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      className="w-full py-2 rounded-lg text-white"
                                      style={{ backgroundColor: widgetConfig.primaryColor }}
                                    >
                                      Search
                                    </button>
                                  </div>
                                )}
                                
                                {selectedTemplate.type === 'deals' && (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-3">
                                      {[
                                        { destination: 'Paris', price: 499, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=400' },
                                        { destination: 'Tokyo', price: 899, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400' }
                                      ].map((deal, index) => (
                                        <div 
                                          key={index} 
                                          className={`flex rounded-lg overflow-hidden ${
                                            widgetConfig.theme === 'dark' ? 'bg-gray-700' : 'border'
                                          }`}
                                        >
                                          <img
                                            src={deal.image}
                                            alt={deal.destination}
                                            className="w-24 h-24 object-cover"
                                          />
                                          <div className="p-3 flex-1">
                                            <h5 className="font-medium">{deal.destination}</h5>
                                            {widgetConfig.showPrices && (
                                              <p className="text-sm" style={{ color: widgetConfig.primaryColor }}>
                                                From ${deal.price}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <button
                                      className="w-full py-2 rounded-lg text-white"
                                      style={{ backgroundColor: widgetConfig.primaryColor }}
                                    >
                                      View All Deals
                                    </button>
                                  </div>
                                )}
                                
                                {selectedTemplate.type === 'map' && (
                                  <div className="space-y-3">
                                    <div 
                                      className={`h-48 rounded-lg flex items-center justify-center ${
                                        widgetConfig.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                      }`}
                                    >
                                      <Globe size={32} className="text-gray-400" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { name: 'Paris', price: 499 },
                                        { name: 'Rome', price: 549 }
                                      ].map((location, index) => (
                                        <div 
                                          key={index}
                                          className={`p-2 rounded-lg ${
                                            widgetConfig.theme === 'dark' ? 'bg-gray-700' : 'border'
                                          }`}
                                        >
                                          <p className="font-medium">{location.name}</p>
                                          {widgetConfig.showPrices && (
                                            <p className="text-sm" style={{ color: widgetConfig.primaryColor }}>
                                              ${location.price}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {selectedTemplate.type === 'calendar' && (
                                  <div className="space-y-3">
                                    <div 
                                      className={`p-3 rounded-lg ${
                                        widgetConfig.theme === 'dark' ? 'bg-gray-700' : 'border'
                                      }`}
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-medium">Best Time to Visit</h5>
                                        <select 
                                          className={`text-sm p-1 rounded ${
                                            widgetConfig.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                                          }`}
                                          defaultValue={widgetConfig.defaultLocation || 'paris'}
                                        >
                                          <option value="paris">Paris</option>
                                          <option value="tokyo">Tokyo</option>
                                          <option value="bali">Bali</option>
                                        </select>
                                      </div>
                                      <div className="grid grid-cols-12 gap-1">
                                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, index) => (
                                          <div 
                                            key={index}
                                            className={`text-center py-1 text-xs rounded ${
                                              [3, 4, 8, 9].includes(index)
                                                ? 'bg-green-100 text-green-800'
                                                : [6, 7].includes(index)
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                          >
                                            {month}
                                          </div>
                                        ))}
                                      </div>
                                      {widgetConfig.showPrices && (
                                        <div className="mt-2 text-xs">
                                          <span className="block">Peak: $899+</span>
                                          <span className="block">Off-peak: $599+</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="mt-3 text-xs text-center text-gray-500">
                                  Powered by TravelAI
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <h3 className="font-semibold mb-4">Widget Code</h3>
                              <div className="relative">
                                <pre className={`p-4 rounded-lg overflow-x-auto ${
                                  widgetConfig.theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  <code>{getWidgetCode()}</code>
                                </pre>
                                <button
                                  onClick={() => copyToClipboard(getWidgetCode())}
                                  className="absolute top-2 right-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                                >
                                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === 'docs' && (
                  <motion.div
                    key="docs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Documentation</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-1 space-y-4">
                        <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold mb-2">Getting Started</h3>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Quick Start Guide</a>
                            </li>
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">API Keys</a>
                            </li>
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Authentication</a>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold mb-2">Widgets</h3>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Search Widget</a>
                            </li>
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Deals Widget</a>
                            </li>
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Map Widget</a>
                            </li>
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Calendar Widget</a>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold mb-2">API Reference</h3>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Search API</a>
                            </li>
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">Booking API</a>
                            </li>
                            <li className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <ArrowRight size={16} />
                              <a href="#">AI Recommendations API</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="col-span-2 bg-white border rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Quick Start Guide</h3>
                        <div className="prose max-w-none">
                          <p>
                            Welcome to the TravelAI Widget API! This guide will help you get started with integrating our widgets into your website or application.
                          </p>
                          
                          <h4>Step 1: Get Your API Key</h4>
                          <p>
                            Before you can use our widgets, you'll need an API key. You can generate one in your dashboard.
                          </p>
                          
                          <h4>Step 2: Choose a Widget</h4>
                          <p>
                            We offer several widgets to help your users find and book travel:
                          </p>
                          <ul>
                            <li><strong>Search Widget:</strong> A comprehensive search tool for flights, hotels, and car rentals.</li>
                            <li><strong>Deals Widget:</strong> Showcase the latest travel deals and discounts.</li>
                            <li><strong>Map Widget:</strong> Display destinations on an interactive map.</li>
                            <li><strong>Calendar Widget:</strong> Show the best times to visit different destinations.</li>
                          </ul>
                          
                          <h4>Step 3: Configure Your Widget</h4>
                          <p>
                            Use our widget configurator to customize the appearance and behavior of your widget.
                          </p>
                          
                          <h4>Step 4: Add the Widget to Your Site</h4>
                          <p>
                            Copy the generated code and paste it into your website's HTML. The widget will automatically load and initialize.
                          </p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 my-4">
                            <h5 className="font-semibold text-blue-800 mb-2">Need Help?</h5>
                            <p className="text-blue-700">
                              Our support team is available 24/7 to help you integrate our widgets. Contact us at support@travelai.com.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'api' && (
                  <motion.div
                    key="api"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">API Reference</h2>
                    
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-bold">Search API</h3>
                          <p className="text-gray-600">Search for flights, hotels, and car rentals</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          GET/POST
                        </span>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Endpoint</h4>
                        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                          <code>https://api.travelai.com/v1/search</code>
                          <button
                            onClick={() => copyToClipboard('https://api.travelai.com/v1/search')}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {isCopied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Parameter
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Required
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  type
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  string
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  Yes
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Type of search: 'flight', 'hotel', or 'car'
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  origin
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  string
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  For flights
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Origin airport code (e.g., 'JFK')
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  destination
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  string
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  For flights/hotels
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  Destination airport code or city (e.g., 'LAX')
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Example Request</h4>
                        <div className="relative">
                          <pre className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
                            <code>{getApiCode()}</code>
                          </pre>
                          <button
                            onClick={() => copyToClipboard(getApiCode())}
                            className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          >
                            {isCopied ? <Check size={20} /> : <Copy size={20} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Example Response</h4>
                        <div className="relative">
                          <pre className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
                            <code>{JSON.stringify({
                              success: true,
                              data: {
                                flights: [
                                  {
                                    id: 'fl-123',
                                    airline: 'Delta',
                                    flightNumber: 'DL123',
                                    departure: {
                                      airport: 'JFK',
                                      time: '2024-06-15T08:30:00Z'
                                    },
                                    arrival: {
                                      airport: 'LAX',
                                      time: '2024-06-15T11:45:00Z'
                                    },
                                    duration: '6h 15m',
                                    price: 349.99,
                                    seatsAvailable: 12
                                  },
                                  {
                                    id: 'fl-456',
                                    airline: 'American',
                                    flightNumber: 'AA456',
                                    departure: {
                                      airport: 'JFK',
                                      time: '2024-06-15T10:15:00Z'
                                    },
                                    arrival: {
                                      airport: 'LAX',
                                      time: '2024-06-15T13:30:00Z'
                                    },
                                    duration: '6h 15m',
                                    price: 389.99,
                                    seatsAvailable: 8
                                  }
                                ]
                              }
                            }, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Zap className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-800 mb-2">AI-Powered Features</h3>
                          <p className="text-blue-700 mb-4">
                            Our API includes advanced AI capabilities that can enhance your travel offerings:
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <Check size={18} className="text-blue-500 mt-1" />
                              <span>Personalized recommendations based on user preferences and behavior</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check size={18} className="text-blue-500 mt-1" />
                              <span>Predictive pricing to help users find the best time to book</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check size={18} className="text-blue-500 mt-1" />
                              <span>Natural language processing for conversational search</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check size={18} className="text-blue-500 mt-1" />
                              <span>Sentiment analysis of reviews to highlight the most relevant feedback</span>
                            </li>
                          </ul>
                          <div className="mt-4">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              Learn more about our AI capabilities
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Download className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold">SDK Downloads</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Download our SDKs for easy integration with your preferred programming language.
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>JavaScript SDK</span>
                  <Download size={16} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>Python SDK</span>
                  <Download size={16} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>PHP SDK</span>
                  <Download size={16} />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clipboard className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold">Code Samples</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ready-to-use code samples for common integration scenarios.
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>React Integration</span>
                  <ExternalLink size={16} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>Vue.js Integration</span>
                  <ExternalLink size={16} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>WordPress Plugin</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Terminal className="text-purple-600" size={24} />
                </div>
                <h3 className="font-semibold">API Playground</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Test our APIs interactively and see the results in real-time.
              </p>
              <div className="space-y-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Search API</span>
                    <Play size={16} className="text-green-600" />
                  </div>
                  <div className="text-xs text-gray-500">
                    Test flight, hotel, and car rental searches
                  </div>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Recommendations API</span>
                    <Play size={16} className="text-green-600" />
                  </div>
                  <div className="text-xs text-gray-500">
                    Test AI-powered travel recommendations
                  </div>
                </div>
                <a
                  href="#"
                  className="block text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Open Playground
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelWidgetApi;