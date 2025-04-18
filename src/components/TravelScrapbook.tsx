import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, Camera, MapPin, Calendar, Image, Pencil, Trash2,
  Download, Share2, Plus, X, Check, Sparkles, Loader,
  Palette, Layout, Type, Move, Save, ArrowRight, Heart
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface ScrapbookPage {
  id: string;
  title: string;
  date: Date;
  location: string;
  elements: ScrapbookElement[];
  background: string;
  layout: 'grid' | 'collage' | 'timeline';
}

interface ScrapbookElement {
  id: string;
  type: 'image' | 'text' | 'sticker';
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  rotation: number;
  zIndex: number;
  style?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    filter?: string;
  };
}

const TravelScrapbook: React.FC = () => {
  const { user } = useAuth();
  const [scrapbooks, setScrapbooks] = useState<{ id: string; title: string; cover: string; pages: ScrapbookPage[] }[]>([]);
  const [selectedScrapbook, setSelectedScrapbook] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScrapbookTitle, setNewScrapbookTitle] = useState('');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchScrapbooks();
  }, []);

  const fetchScrapbooks = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockScrapbooks = [
        {
          id: '1',
          title: 'Japan Adventure 2024',
          cover: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000',
          pages: [
            {
              id: 'page1',
              title: 'Tokyo Explorations',
              date: new Date('2024-04-10'),
              location: 'Tokyo, Japan',
              elements: [
                {
                  id: 'elem1',
                  type: 'image',
                  content: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=2000',
                  position: { x: 50, y: 50 },
                  size: { width: 300, height: 200 },
                  rotation: 0,
                  zIndex: 1
                },
                {
                  id: 'elem2',
                  type: 'text',
                  content: 'First day in Tokyo! The Shibuya crossing was incredible.',
                  position: { x: 50, y: 270 },
                  size: { width: 300, height: 100 },
                  rotation: 0,
                  zIndex: 2,
                  style: {
                    color: '#333333',
                    fontSize: 16,
                    fontFamily: 'Arial'
                  }
                },
                {
                  id: 'elem3',
                  type: 'image',
                  content: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=2000',
                  position: { x: 380, y: 50 },
                  size: { width: 200, height: 300 },
                  rotation: 5,
                  zIndex: 1
                }
              ],
              background: '#f0f9ff',
              layout: 'collage'
            },
            {
              id: 'page2',
              title: 'Kyoto Temples',
              date: new Date('2024-04-15'),
              location: 'Kyoto, Japan',
              elements: [
                {
                  id: 'elem4',
                  type: 'image',
                  content: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=2000',
                  position: { x: 50, y: 50 },
                  size: { width: 250, height: 350 },
                  rotation: -3,
                  zIndex: 1
                },
                {
                  id: 'elem5',
                  type: 'text',
                  content: 'The Golden Pavilion was breathtaking!',
                  position: { x: 320, y: 100 },
                  size: { width: 250, height: 100 },
                  rotation: 0,
                  zIndex: 2,
                  style: {
                    color: '#333333',
                    fontSize: 18,
                    fontFamily: 'Georgia'
                  }
                },
                {
                  id: 'elem6',
                  type: 'image',
                  content: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2000',
                  position: { x: 320, y: 220 },
                  size: { width: 250, height: 180 },
                  rotation: 3,
                  zIndex: 1
                }
              ],
              background: '#fff1f2',
              layout: 'collage'
            }
          ]
        },
        {
          id: '2',
          title: 'European Summer 2023',
          cover: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
          pages: [
            {
              id: 'page3',
              title: 'Paris Memories',
              date: new Date('2023-07-05'),
              location: 'Paris, France',
              elements: [
                {
                  id: 'elem7',
                  type: 'image',
                  content: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
                  position: { x: 50, y: 50 },
                  size: { width: 300, height: 200 },
                  rotation: 0,
                  zIndex: 1
                },
                {
                  id: 'elem8',
                  type: 'text',
                  content: 'The Eiffel Tower at sunset - magical!',
                  position: { x: 50, y: 270 },
                  size: { width: 300, height: 100 },
                  rotation: 0,
                  zIndex: 2,
                  style: {
                    color: '#333333',
                    fontSize: 16,
                    fontFamily: 'Arial'
                  }
                }
              ],
              background: '#f0f9ff',
              layout: 'grid'
            }
          ]
        }
      ];
      
      setScrapbooks(mockScrapbooks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching scrapbooks:', error);
      setIsLoading(false);
    }
  };

  const generateAIScrapbook = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // In a real implementation, this would generate a new scrapbook
      // For demo purposes, we'll just select the first one
      setSelectedScrapbook('1');
      setCurrentPage(0);
    } catch (error) {
      console.error('Error generating AI scrapbook:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const createNewScrapbook = () => {
    if (!newScrapbookTitle.trim()) return;
    
    const newScrapbook = {
      id: Date.now().toString(),
      title: newScrapbookTitle,
      cover: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000',
      pages: [
        {
          id: `page-${Date.now()}`,
          title: 'New Page',
          date: new Date(),
          location: '',
          elements: [],
          background: '#ffffff',
          layout: 'grid' as const
        }
      ]
    };
    
    setScrapbooks([...scrapbooks, newScrapbook]);
    setSelectedScrapbook(newScrapbook.id);
    setCurrentPage(0);
    setIsEditing(true);
    setShowCreateModal(false);
    setNewScrapbookTitle('');
  };

  const addNewPage = () => {
    if (!selectedScrapbook) return;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook) return;
    
    const newPage: ScrapbookPage = {
      id: `page-${Date.now()}`,
      title: 'New Page',
      date: new Date(),
      location: '',
      elements: [],
      background: '#ffffff',
      layout: 'grid'
    };
    
    const updatedScrapbook = {
      ...scrapbook,
      pages: [...scrapbook.pages, newPage]
    };
    
    setScrapbooks(scrapbooks.map(s => s.id === selectedScrapbook ? updatedScrapbook : s));
    setCurrentPage(updatedScrapbook.pages.length - 1);
  };

  const deletePage = (pageIndex: number) => {
    if (!selectedScrapbook) return;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook || scrapbook.pages.length <= 1) return;
    
    const updatedPages = [...scrapbook.pages];
    updatedPages.splice(pageIndex, 1);
    
    const updatedScrapbook = {
      ...scrapbook,
      pages: updatedPages
    };
    
    setScrapbooks(scrapbooks.map(s => s.id === selectedScrapbook ? updatedScrapbook : s));
    setCurrentPage(Math.min(currentPage, updatedPages.length - 1));
  };

  const addElement = (type: 'text' | 'image' | 'sticker') => {
    if (!selectedScrapbook) return;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook) return;
    
    const page = scrapbook.pages[currentPage];
    
    let newElement: ScrapbookElement;
    
    switch (type) {
      case 'text':
        newElement = {
          id: `elem-${Date.now()}`,
          type: 'text',
          content: 'Double click to edit text',
          position: { x: 100, y: 100 },
          size: { width: 200, height: 100 },
          rotation: 0,
          zIndex: Math.max(...page.elements.map(e => e.zIndex), 0) + 1,
          style: {
            color: '#333333',
            fontSize: 16,
            fontFamily: 'Arial'
          }
        };
        break;
      case 'image':
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        return;
      case 'sticker':
        newElement = {
          id: `elem-${Date.now()}`,
          type: 'sticker',
          content: '❤️',
          position: { x: 100, y: 100 },
          size: { width: 50, height: 50 },
          rotation: 0,
          zIndex: Math.max(...page.elements.map(e => e.zIndex), 0) + 1
        };
        break;
      default:
        return;
    }
    
    const updatedPage = {
      ...page,
      elements: [...page.elements, newElement]
    };
    
    const updatedPages = [...scrapbook.pages];
    updatedPages[currentPage] = updatedPage;
    
    const updatedScrapbook = {
      ...scrapbook,
      pages: updatedPages
    };
    
    setScrapbooks(scrapbooks.map(s => s.id === selectedScrapbook ? updatedScrapbook : s));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedScrapbook) return;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook) return;
    
    const page = scrapbook.pages[currentPage];
    
    // In a real app, this would upload the image to a server
    // For demo purposes, we'll use a local URL
    const imageUrl = URL.createObjectURL(files[0]);
    
    const newElement: ScrapbookElement = {
      id: `elem-${Date.now()}`,
      type: 'image',
      content: imageUrl,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      rotation: 0,
      zIndex: Math.max(...page.elements.map(e => e.zIndex), 0) + 1
    };
    
    const updatedPage = {
      ...page,
      elements: [...page.elements, newElement]
    };
    
    const updatedPages = [...scrapbook.pages];
    updatedPages[currentPage] = updatedPage;
    
    const updatedScrapbook = {
      ...scrapbook,
      pages: updatedPages
    };
    
    setScrapbooks(scrapbooks.map(s => s.id === selectedScrapbook ? updatedScrapbook : s));
  };

  const deleteElement = (elementId: string) => {
    if (!selectedScrapbook) return;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook) return;
    
    const page = scrapbook.pages[currentPage];
    
    const updatedElements = page.elements.filter(e => e.id !== elementId);
    
    const updatedPage = {
      ...page,
      elements: updatedElements
    };
    
    const updatedPages = [...scrapbook.pages];
    updatedPages[currentPage] = updatedPage;
    
    const updatedScrapbook = {
      ...scrapbook,
      pages: updatedPages
    };
    
    setScrapbooks(scrapbooks.map(s => s.id === selectedScrapbook ? updatedScrapbook : s));
    setSelectedElement(null);
  };

  const updatePageBackground = (color: string) => {
    if (!selectedScrapbook) return;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook) return;
    
    const updatedPage = {
      ...scrapbook.pages[currentPage],
      background: color
    };
    
    const updatedPages = [...scrapbook.pages];
    updatedPages[currentPage] = updatedPage;
    
    const updatedScrapbook = {
      ...scrapbook,
      pages: updatedPages
    };
    
    setScrapbooks(scrapbooks.map(s => s.id === selectedScrapbook ? updatedScrapbook : s));
  };

  const updatePageLayout = (layout: 'grid' | 'collage' | 'timeline') => {
    if (!selectedScrapbook) return;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook) return;
    
    const updatedPage = {
      ...scrapbook.pages[currentPage],
      layout
    };
    
    const updatedPages = [...scrapbook.pages];
    updatedPages[currentPage] = updatedPage;
    
    const updatedScrapbook = {
      ...scrapbook,
      pages: updatedPages
    };
    
    setScrapbooks(scrapbooks.map(s => s.id === selectedScrapbook ? updatedScrapbook : s));
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
          <p className="text-gray-600">Loading your travel scrapbooks...</p>
        </div>
      </div>
    );
  }

  const renderScrapbookList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scrapbooks.map((scrapbook) => (
        <motion.div
          key={scrapbook.id}
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          onClick={() => setSelectedScrapbook(scrapbook.id)}
        >
          <div className="relative h-48">
            <img
              src={scrapbook.cover}
              alt={scrapbook.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white">{scrapbook.title}</h3>
              <p className="text-white/80">{scrapbook.pages.length} pages</p>
            </div>
          </div>
        </motion.div>
      ))}
      
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-48 cursor-pointer"
        onClick={() => setShowCreateModal(true)}
      >
        <Plus size={32} className="text-gray-400 mb-2" />
        <p className="text-gray-500 font-medium">Create New Scrapbook</p>
      </motion.div>
    </div>
  );

  const renderScrapbookDetail = () => {
    if (!selectedScrapbook) return null;
    
    const scrapbook = scrapbooks.find(s => s.id === selectedScrapbook);
    if (!scrapbook || !scrapbook.pages.length) return null;
    
    const currentPageData = scrapbook.pages[currentPage];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelectedScrapbook(null)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← Back to scrapbooks
          </button>
          <h2 className="text-2xl font-bold">{scrapbook.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg ${
                isEditing
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
            >
              <Pencil size={20} />
            </button>
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download size={20} />
            </button>
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {scrapbook.pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  currentPage === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } transition-colors`}
              >
                {index + 1}
              </button>
            ))}
            {isEditing && (
              <button
                onClick={addNewPage}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          
          {isEditing && currentPageData && (
            <div className="flex gap-2">
              <div>
                <select
                  value={currentPageData.layout}
                  onChange={(e) => updatePageLayout(e.target.value as any)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="grid">Grid Layout</option>
                  <option value="collage">Collage Layout</option>
                  <option value="timeline">Timeline Layout</option>
                </select>
              </div>
              <input
                type="color"
                value={currentPageData.background}
                onChange={(e) => updatePageBackground(e.target.value)}
                className="w-10 h-10 rounded border p-1"
                title="Change background color"
              />
              <button
                onClick={() => deletePage(currentPage)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                title="Delete page"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div 
          className="relative border rounded-xl overflow-hidden"
          style={{ 
            height: '600px',
            background: currentPageData.background
          }}
        >
          {/* Page Title */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{currentPageData.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{format(currentPageData.date, 'MMMM d, yyyy')}</span>
                </div>
                {currentPageData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{currentPageData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Page Elements */}
          {currentPageData.elements.map((element) => (
            <div
              key={element.id}
              className={`absolute ${isEditing ? 'cursor-move' : ''} ${
                selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.size.width}px`,
                height: `${element.size.height}px`,
                transform: `rotate(${element.rotation}deg)`,
                zIndex: element.zIndex
              }}
              onClick={() => isEditing && setSelectedElement(element.id)}
            >
              {element.type === 'image' && (
                <img
                  src={element.content}
                  alt="Scrapbook element"
                  className="w-full h-full object-cover"
                  style={{
                    filter: element.style?.filter
                  }}
                />
              )}
              {element.type === 'text' && (
                <div
                  className="w-full h-full overflow-auto"
                  style={{
                    color: element.style?.color,
                    fontSize: `${element.style?.fontSize}px`,
                    fontFamily: element.style?.fontFamily
                  }}
                >
                  {element.content}
                </div>
              )}
              {element.type === 'sticker' && (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {element.content}
                </div>
              )}
              
              {isEditing && selectedElement === element.id && (
                <div className="absolute -top-10 left-0 flex gap-1">
                  <button
                    onClick={() => deleteElement(element.id)}
                    className="p-1 bg-red-500 text-white rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {/* Editing Toolbar */}
          {isEditing && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 flex gap-2">
              <button
                onClick={() => addElement('text')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add Text"
              >
                <Type size={20} />
              </button>
              <button
                onClick={() => addElement('image')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add Image"
              >
                <Image size={20} />
              </button>
              <button
                onClick={() => addElement('sticker')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add Sticker"
              >
                <Heart size={20} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Change Layout"
              >
                <Layout size={20} />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Change Background"
              >
                <Palette size={20} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Save Changes"
              >
                <Save size={20} />
              </button>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
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
              <Book className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              AI Travel Scrapbook Builder
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Create beautiful digital scrapbooks of your travel memories with AI assistance
            </motion.p>
          </div>

          {/* Actions */}
          {!selectedScrapbook && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-4 justify-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateAIScrapbook}
                disabled={isGenerating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate AI Scrapbook</span>
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>Create New Scrapbook</span>
              </motion.button>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {selectedScrapbook ? renderScrapbookDetail() : renderScrapbookList()}
          </motion.div>

          {/* Features */}
          {!selectedScrapbook && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                  <Sparkles className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Generated Layouts</h3>
                <p className="text-gray-600">
                  Our AI analyzes your photos and creates beautiful, personalized scrapbook layouts.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                  <Camera className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Photo Enhancement</h3>
                <p className="text-gray-600">
                  Automatically enhance your travel photos with AI-powered filters and adjustments.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                  <Share2 className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share your digital scrapbooks with friends and family or export as PDF.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create Scrapbook Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
                <h3 className="text-xl font-bold">Create New Scrapbook</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scrapbook Title
                </label>
                <input
                  type="text"
                  value={newScrapbookTitle}
                  onChange={(e) => setNewScrapbookTitle(e.target.value)}
                  placeholder="Enter a title for your scrapbook"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createNewScrapbook}
                  disabled={!newScrapbookTitle.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TravelScrapbook;