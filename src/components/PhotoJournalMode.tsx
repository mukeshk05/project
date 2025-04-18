import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Image, MapPin, Calendar, Edit3, Share2,
  Download, Plus, X, Globe, Heart, MessageSquare,
  Upload, Trash2, Save, Search, Filter, ChevronDown,
  ChevronUp, Loader, Tag, Pencil
} from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface Photo {
  id: string;
  url: string;
  caption: string;
  location: string;
  date: Date;
  tags: string[];
  likes: number;
}

interface Journal {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  coverPhoto: string;
  photos: Photo[];
  isPublic: boolean;
  likes: number;
  views: number;
}

const PhotoJournalMode: React.FC = () => {
  const { t } = useTranslation();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'date',
    timeRange: 'all',
  });
  const [newJournal, setNewJournal] = useState<Partial<Journal>>({
    title: '',
    description: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(),
    isPublic: false,
    photos: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJournals: Journal[] = [
        {
          id: '1',
          title: 'Summer in Santorini',
          description: 'Exploring the beautiful white and blue buildings, amazing sunsets, and delicious food of Santorini.',
          location: 'Santorini, Greece',
          startDate: new Date('2023-06-15'),
          endDate: new Date('2023-06-22'),
          coverPhoto: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
          photos: [
            {
              id: 'p1',
              url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000',
              caption: 'Sunset in Oia',
              location: 'Oia, Santorini',
              date: new Date('2023-06-16'),
              tags: ['sunset', 'architecture', 'ocean'],
              likes: 24
            },
            {
              id: 'p2',
              url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=2000',
              caption: 'Blue domes and white buildings',
              location: 'Fira, Santorini',
              date: new Date('2023-06-17'),
              tags: ['architecture', 'church', 'blue'],
              likes: 18
            },
            {
              id: 'p3',
              url: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&q=80&w=2000',
              caption: 'Enjoying local cuisine',
              location: 'Ammoudi Bay, Santorini',
              date: new Date('2023-06-19'),
              tags: ['food', 'seafood', 'restaurant'],
              likes: 15
            }
          ],
          isPublic: true,
          likes: 42,
          views: 156
        },
        {
          id: '2',
          title: 'Tokyo Adventures',
          description: 'Exploring the vibrant streets, peaceful temples, and amazing food scene of Tokyo.',
          location: 'Tokyo, Japan',
          startDate: new Date('2023-09-10'),
          endDate: new Date('2023-09-18'),
          coverPhoto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=2000',
          photos: [
            {
              id: 'p4',
              url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=2000',
              caption: 'Tokyo skyline at night',
              location: 'Shinjuku, Tokyo',
              date: new Date('2023-09-11'),
              tags: ['skyline', 'night', 'cityscape'],
              likes: 31
            },
            {
              id: 'p5',
              url: 'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?auto=format&fit=crop&q=80&w=2000',
              caption: 'Sensoji Temple',
              location: 'Asakusa, Tokyo',
              date: new Date('2023-09-13'),
              tags: ['temple', 'culture', 'architecture'],
              likes: 27
            },
            {
              id: 'p6',
              url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=2000',
              caption: 'Street food at Tsukiji',
              location: 'Tsukiji, Tokyo',
              date: new Date('2023-09-15'),
              tags: ['food', 'market', 'street food'],
              likes: 22
            }
          ],
          isPublic: true,
          likes: 58,
          views: 203
        }
      ];
      
      setJournals(mockJournals);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  const handleCreateJournal = () => {
    setIsCreating(true);
    setNewJournal({
      title: '',
      description: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      isPublic: false,
      photos: [],
    });
  };

  const handleSaveJournal = () => {
    if (!newJournal.title || !newJournal.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    const journal: Journal = {
      id: Date.now().toString(),
      title: newJournal.title!,
      description: newJournal.description || '',
      location: newJournal.location!,
      startDate: newJournal.startDate!,
      endDate: newJournal.endDate!,
      coverPhoto: newJournal.photos && newJournal.photos.length > 0 
        ? newJournal.photos[0].url 
        : 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=2000',
      photos: newJournal.photos as Photo[] || [],
      isPublic: newJournal.isPublic || false,
      likes: 0,
      views: 0
    };
    
    setJournals([journal, ...journals]);
    setIsCreating(false);
    setNewJournal({});
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate file processing
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Create new photo objects
      const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        caption: '',
        location: newJournal.location || '',
        date: new Date(),
        tags: [],
        likes: 0
      }));
      
      // Add to new journal
      setNewJournal(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...newPhotos]
      }));
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }, 3000);
  };

  const removePhoto = (photoId: string) => {
    setNewJournal(prev => ({
      ...prev,
      photos: prev.photos?.filter(p => p.id !== photoId)
    }));
  };

  const updatePhotoCaption = (photoId: string, caption: string) => {
    setNewJournal(prev => ({
      ...prev,
      photos: prev.photos?.map(p => 
        p.id === photoId ? { ...p, caption } : p
      )
    }));
  };

  const addTagToPhoto = (photoId: string, tag: string) => {
    setNewJournal(prev => ({
      ...prev,
      photos: prev.photos?.map(p => 
        p.id === photoId ? { ...p, tags: [...p.tags, tag] } : p
      )
    }));
  };

  const removeTagFromPhoto = (photoId: string, tagIndex: number) => {
    setNewJournal(prev => ({
      ...prev,
      photos: prev.photos?.map(p => 
        p.id === photoId ? { 
          ...p, 
          tags: p.tags.filter((_, i) => i !== tagIndex) 
        } : p
      )
    }));
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

  const filteredJournals = journals.filter(journal => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        journal.title.toLowerCase().includes(term) ||
        journal.description.toLowerCase().includes(term) ||
        journal.location.toLowerCase().includes(term) ||
        journal.photos.some(photo => 
          photo.caption.toLowerCase().includes(term) ||
          photo.tags.some(tag => tag.toLowerCase().includes(term))
        )
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Camera className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold">Photo Journal</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateJournal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Journal
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.div
                key="create-journal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Create New Journal</h2>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newJournal.title || ''}
                      onChange={(e) => setNewJournal({ ...newJournal, title: e.target.value })}
                      placeholder="Enter a title for your journal"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={newJournal.location || ''}
                      onChange={(e) => setNewJournal({ ...newJournal, location: e.target.value })}
                      placeholder="Where did you travel?"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newJournal.startDate ? format(newJournal.startDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setNewJournal({ ...newJournal, startDate: new Date(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newJournal.endDate ? format(newJournal.endDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setNewJournal({ ...newJournal, endDate: new Date(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newJournal.description || ''}
                    onChange={(e) => setNewJournal({ ...newJournal, description: e.target.value })}
                    placeholder="Write about your travel experience..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    {isUploading ? (
                      <div>
                        <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
                        <p className="text-gray-600 mb-2">Uploading photos...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto mb-4 text-gray-400" size={32} />
                        <p className="text-gray-600 mb-2">Drag and drop photos here, or</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Browse Files
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {newJournal.photos && newJournal.photos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Uploaded Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {newJournal.photos.map((photo) => (
                        <div key={photo.id} className="border rounded-lg overflow-hidden">
                          <div className="relative h-48">
                            <img
                              src={photo.url}
                              alt={photo.caption || 'Uploaded photo'}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="p-4">
                            <input
                              type="text"
                              value={photo.caption}
                              onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                              placeholder="Add a caption..."
                              className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            />
                            <div className="flex flex-wrap gap-2 mb-2">
                              {photo.tags.map((tag, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                                >
                                  <span>{tag}</span>
                                  <button
                                    onClick={() => removeTagFromPhoto(photo.id, index)}
                                    className="hover:text-blue-800"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add tag..."
                                className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value) {
                                    addTagToPhoto(photo.id, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Add tag..."]`) as HTMLInputElement;
                                  if (input && input.value) {
                                    addTagToPhoto(photo.id, input.value);
                                    input.value = '';
                                  }
                                }}
                                className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newJournal.isPublic || false}
                    onChange={(e) => setNewJournal({ ...newJournal, isPublic: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="isPublic" className="text-gray-700">
                    Make this journal public (share with community)
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveJournal}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    Save Journal
                  </button>
                </div>
              </motion.div>
            ) : selectedJournal ? (
              <motion.div
                key="journal-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <button
                    onClick={() => setSelectedJournal(null)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    ← Back to journals
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>

                <div className="relative h-80 rounded-xl overflow-hidden mb-8">
                  <img
                    src={selectedJournal.coverPhoto}
                    alt={selectedJournal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedJournal.title}</h2>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{selectedJournal.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {format(selectedJournal.startDate, 'MMM d')} - {format(selectedJournal.endDate, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-8">{selectedJournal.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedJournal.photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      variants={itemVariants}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <div className="relative h-64">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{photo.caption}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{photo.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{format(photo.date, 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {photo.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="journal-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search journals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="likes">Sort by Likes</option>
                    <option value="views">Sort by Views</option>
                  </select>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="year">This Year</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                {filteredJournals.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-xl font-semibold mb-2">No journals found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm
                        ? 'No journals match your search criteria'
                        : 'Start by creating your first photo journal'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={handleCreateJournal}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Journal
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJournals.map((journal) => (
                      <motion.div
                        key={journal.id}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-48 cursor-pointer" onClick={() => setSelectedJournal(journal)}>
                          <img
                            src={journal.coverPhoto}
                            alt={journal.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-xl font-bold text-white">{journal.title}</h3>
                            <div className="flex items-center gap-2 text-white/90 text-sm">
                              <MapPin size={14} />
                              <span>{journal.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>
                                {format(journal.startDate, 'MMM d')} - {format(journal.endDate, 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Image size={16} />
                              <span>{journal.photos.length} photos</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-2">{journal.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-gray-500">
                                <Heart size={16} />
                                <span>{journal.likes}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <Globe size={16} />
                                <span>{journal.views}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedJournal(journal)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Journal
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-2/3 h-[50vh] md:h-auto relative">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="md:w-1/3 p-6 overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">{selectedPhoto.caption}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-400" size={20} />
                    <span>{selectedPhoto.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={20} />
                    <span>{format(selectedPhoto.date, 'MMMM d, yyyy')}</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhoto.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                      <Heart size={20} />
                      <span>{selectedPhoto.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                      <MessageSquare size={20} />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-green-600">
                      <Share2 size={20} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoJournalMode;