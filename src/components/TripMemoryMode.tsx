import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Image, MapPin, Calendar, Edit3, Share2,
  Download, Plus, X, Globe, Heart, MessageSquare,
  Upload, Trash2, Save
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';

// Ensure '@uppy/react' is installed by running:
// npm install @uppy/react
import ImageEditor from '@uppy/image-editor';
import AwsS3 from '@uppy/aws-s3';


interface Memory {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  photos: {
    url: string;
    caption: string;
  }[];
  tags: string[];
  likes: number;
  comments: {
    author: string;
    text: string;
    timestamp: Date;
  }[];
}

const TripMemoryMode: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [newMemory, setNewMemory] = useState<Partial<Memory>>({
    title: '',
    description: '',
    location: '',
    date: new Date(),
    photos: [],
    tags: [],
  });

  const uppy = useRef(new Uppy({
    restrictions: {
      maxFileSize: 2097152, // 2MB
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*'],
    },
  }).use(ImageEditor, {
    quality: 0.8,
  }).use(AwsS3, {
    companionUrl: 'http://localhost:5000',
  }));

  const generateAIDescription = async (photos: File[]) => {
    try {
      const formData = new FormData();
      photos.forEach(photo => formData.append('photos', photo));

      const response = await fetch('http://localhost:5000/api/memories/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze photos');

      const data = await response.json();
      setNewMemory(prev => ({
        ...prev,
        description: data.description,
        tags: data.tags,
      }));
    } catch (error) {
      console.error('Error analyzing photos:', error);
    }
  };

  const saveMemory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newMemory),
      });

      if (!response.ok) throw new Error('Failed to save memory');

      const savedMemory = await response.json();
      setMemories([...memories, savedMemory]);
      setNewMemory({
        title: '',
        description: '',
        location: '',
        date: new Date(),
        photos: [],
        tags: [],
      });
      setShowUploader(false);
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/memories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete memory');

      setMemories(memories.filter(m => m.id !== id));
      setSelectedMemory(null);
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const exportMemory = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/memories/${id}/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to export memory');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memory-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting memory:', error);
    }
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
              <h1 className="text-2xl font-bold">Trip Memories</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploader(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Memory
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => setSelectedMemory(memory)}
              >
                {memory.photos[0] && (
                  <div className="relative h-48">
                    <img
                      src={memory.photos[0].url}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                      <h3 className="text-white font-semibold">{memory.title}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <MapPin size={16} />
                        <span>{memory.location}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{memory.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={16} />
                      <span>{memory.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={16} />
                      <span>{memory.comments.length}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{memory.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {memory.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
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
      </div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
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
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                {selectedMemory.photos[0] && (
                  <img
                    src={selectedMemory.photos[0].url}
                    alt={selectedMemory.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full"
                  >
                    <Edit3 size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => exportMemory(selectedMemory.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full"
                  >
                    <Download size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMemory(null)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={selectedMemory.title}
                      onChange={(e) => setSelectedMemory({
                        ...selectedMemory,
                        title: e.target.value,
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={selectedMemory.description}
                      onChange={(e) => setSelectedMemory({
                        ...selectedMemory,
                        description: e.target.value,
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Save changes
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4">{selectedMemory.title}</h2>
                    <div className="flex items-center gap-4 text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{selectedMemory.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{selectedMemory.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{selectedMemory.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedMemory.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedMemory.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          {photo.caption && (
                            <p className="text-sm text-gray-500 mt-1">{photo.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploader && (
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
              className="bg-white rounded-2xl max-w-4xl w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Memory</h2>
                <button
                  onClick={() => setShowUploader(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    placeholder="Enter a title for your memory"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={newMemory.location}
                        onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
                        placeholder="Where was this memory created?"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                      <DatePicker
                        selected={newMemory.date}
                        onChange={(date) => setNewMemory({ ...newMemory, date })}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos
                  </label>
                  <Dashboard
                    uppy={uppy.current}
                    plugins={['ImageEditor']}
                    metaFields={[
                      { id: 'caption', name: 'Caption', placeholder: 'Add a caption...' },
                    ]}
                    height={300}
                    width="100%"
                    showLinkToFileUploadResult={false}
                    proudlyDisplayPoweredByUppy={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => generateAIDescription([])}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Globe size={16} />
                      Generate AI description
                    </button>
                  </div>
                  <textarea
                    value={newMemory.description}
                    onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                    placeholder="Describe your memory..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newMemory.tags?.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => setNewMemory({
                            ...newMemory,
                            tags: newMemory.tags?.filter((_, i) => i !== index),
                          })}
                          className="hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          setNewMemory({
                            ...newMemory,
                            tags: [...(newMemory.tags || []), e.currentTarget.value],
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a tag..."]') as HTMLInputElement;
                        if (input.value) {
                          setNewMemory({
                            ...newMemory,
                            tags: [...(newMemory.tags || []), input.value],
                          });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowUploader(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveMemory}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    Save Memory
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

export default TripMemoryMode;