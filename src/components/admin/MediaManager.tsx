import React, { useState, useEffect } from 'react';
import { Image, Video, Upload, Trash2, Edit2, MoveVertical, AlertCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Media {
  _id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  alt: string;
  thumbnail?: string;
  status: 'active' | 'inactive';
  order: number;
}

interface MediaManagerProps {
  destinationId?: string;
  packageId?: string;
}

const MediaManager: React.FC<MediaManagerProps> = ({ destinationId, packageId }) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);

  useEffect(() => {
    fetchMedia();
  }, [destinationId, packageId, selectedType]);

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        ...(destinationId && { destinationId }),
        ...(packageId && { packageId }),
        ...(selectedType !== 'all' && { type: selectedType }),
      });

      const response = await fetch(`http://localhost:5000/api/admin/media?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      setMedia(data.media);
    } catch (error) {
      setError('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setMedia(updatedItems);

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/admin/media/reorder', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: updatedItems.map((item, index) => ({
            id: item._id,
            order: index,
          })),
        }),
      });
    } catch (error) {
      setError('Failed to update media order');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      setMedia(media.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete media');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Media>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/media/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update media');
      }

      const updatedMedia = await response.json();
      setMedia(media.map(item => item._id === id ? updatedMedia : item));
      setEditingMedia(null);
    } catch (error) {
      setError('Failed to update media');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Media Manager</h2>
        <div className="flex gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'all' | 'image' | 'video')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Upload Media
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="media-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {media.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="relative">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.alt || item.caption}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="relative w-full h-48">
                            <img
                              src={item.thumbnail}
                              alt={item.caption}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Video className="text-white w-12 h-12" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div {...provided.dragHandleProps} className="cursor-move">
                            <MoveVertical size={20} className="text-gray-400" />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingMedia(item)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{item.caption}</p>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Media Modal */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Edit Media</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={editingMedia.caption}
                  onChange={(e) => setEditingMedia({
                    ...editingMedia,
                    caption: e.target.value,
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={editingMedia.alt}
                  onChange={(e) => setEditingMedia({
                    ...editingMedia,
                    alt: e.target.value,
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingMedia.status}
                  onChange={(e) => setEditingMedia({
                    ...editingMedia,
                    status: e.target.value as 'active' | 'inactive',
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingMedia(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(editingMedia._id, {
                  caption: editingMedia.caption,
                  alt: editingMedia.alt,
                  status: editingMedia.status,
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;