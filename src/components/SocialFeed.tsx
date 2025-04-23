import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, Heart, MessageSquare, Bookmark, MoreHorizontal, 
  MapPin, Calendar, Globe, User, Image, Camera, Send, 
  X, Filter, Search, ChevronDown, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images?: string[];
  location?: string;
  destination?: string;
  tripDates?: {
    start: Date;
    end: Date;
  };
  likes: number;
  comments: Comment[];
  createdAt: Date;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
  likes: number;
}

const SocialFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostLocation, setNewPostLocation] = useState('');
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPosts: Post[] = [
        {
          id: '1',
          userId: '101',
          userName: 'Sarah Johnson',
          userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
          content: 'Just arrived in Santorini! The views are absolutely breathtaking. Can t wait to explore the white-washed buildings and catch the famous sunset. Any recommendations?',
          images: [
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000'
          ],
          location: 'Oia, Santorini, Greece',
          destination: 'Santorini',
          tripDates: {
            start: new Date('2024-03-15'),
            end: new Date('2024-03-22')
          },
          likes: 124,
          comments: [
            {
              id: 'c1',
              userId: '102',
              userName: 'Michael Chen',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Michael',
              content: 'Make sure to visit Santo Wines for a wine tasting with an amazing view!',
              createdAt: new Date('2024-03-15T15:30:00'),
              likes: 8
            },
            {
              id: 'c2',
              userId: '103',
              userName: 'Emma Wilson',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma',
              content: 'The Red Beach is a must-see! And definitely have dinner at Ammoudi Bay.',
              createdAt: new Date('2024-03-15T16:45:00'),
              likes: 5
            }
          ],
          createdAt: new Date('2024-03-15T14:20:00'),
          isLiked: false,
          isBookmarked: false,
          tags: ['Greece', 'Santorini', 'IslandLife', 'Travel']
        },
        {
          id: '2',
          userId: '104',
          userName: 'David Rodriguez',
          userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
          content: 'Hiking through the lush rainforests of Costa Rica was an unforgettable experience. We saw sloths, toucans, and even a rare quetzal bird! The biodiversity here is incredible.',
          images: [
            'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=2000'
          ],
          location: 'Monteverde Cloud Forest, Costa Rica',
          destination: 'Costa Rica',
          tripDates: {
            start: new Date('2024-02-20'),
            end: new Date('2024-03-05')
          },
          likes: 87,
          comments: [
            {
              id: 'c3',
              userId: '105',
              userName: 'Priya Patel',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
              content: 'This is on my bucket list! Did you do the zip-lining there?',
              createdAt: new Date('2024-03-10T09:15:00'),
              likes: 3
            }
          ],
          createdAt: new Date('2024-03-10T08:45:00'),
          isLiked: true,
          isBookmarked: true,
          tags: ['CostaRica', 'Rainforest', 'Wildlife', 'Adventure']
        },
        {
          id: '3',
          userId: '106',
          userName: 'Olivia Thompson',
          userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Olivia',
          content: 'Pro tip for Tokyo travelers: get the 72-hour metro pass and a pocket WiFi. Makes navigating the city so much easier! Also, dont miss the teamLab Borderless digital art museum - its mind-blowing!',
          location: 'Tokyo, Japan',
          destination: 'Tokyo',
          likes: 156,
          comments: [
            {
              id: 'c4',
              userId: '107',
              userName: 'James Wilson',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=James',
              content: 'Thanks for the tips! How crowded was the museum?',
              createdAt: new Date('2024-03-12T14:20:00'),
              likes: 2
            },
            {
              id: 'c5',
              userId: '106',
              userName: 'Olivia Thompson',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Olivia',
              content: 'It gets pretty busy, especially on weekends. I recommend going early on a weekday if possible!',
              createdAt: new Date('2024-03-12T15:05:00'),
              likes: 4
            }
          ],
          createdAt: new Date('2024-03-12T13:30:00'),
          isLiked: false,
          isBookmarked: true,
          tags: ['Tokyo', 'Japan', 'TravelTips', 'DigitalArt']
        }
      ];
      
      setPosts(mockPosts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
    }
  };

  const handlePostSubmit = () => {
    if (!newPost.trim() && newPostImages.length === 0) return;
    
    const post: Post = {
      id: uuidv4(),
      userId: user?._id || 'anonymous',
      userName: user?.name || 'Anonymous User',
      userAvatar: user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anonymous',
      content: newPost,
      images: newPostImages.length > 0 ? newPostImages : undefined,
      location: newPostLocation || undefined,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      isLiked: false,
      isBookmarked: false,
      tags: extractHashtags(newPost)
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    setNewPostImages([]);
    setNewPostLocation('');
    setIsPostingModalOpen(false);
  };

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // In a real app, you would upload these files to a server
    // For demo purposes, we'll use local URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setNewPostImages([...newPostImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    setNewPostImages(newPostImages.filter((_, i) => i !== index));
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const toggleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    
    const comment: Comment = {
      id: uuidv4(),
      userId: user?._id || 'anonymous',
      userName: user?.name || 'Anonymous User',
      userAvatar: user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anonymous',
      content,
      createdAt: new Date(),
      likes: 0
    };
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));
    
    setNewComment('');
  };

  const getFilteredPosts = () => {
    let filtered = [...posts];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(term) ||
        post.userName.toLowerCase().includes(term) ||
        post.location?.toLowerCase().includes(term) ||
        post.destination?.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'following':
          // In a real app, you would filter by followed users
          filtered = filtered.filter(post => ['101', '104'].includes(post.userId));
          break;
        case 'trending':
          filtered = filtered.filter(post => post.likes > 100);
          break;
        case 'nearby':
          // In a real app, you would filter by geolocation
          filtered = filtered.filter(post => post.location?.includes('Santorini'));
          break;
        case 'bookmarked':
          filtered = filtered.filter(post => post.isBookmarked);
          break;
      }
    }
    
    return filtered;
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

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Travel Social Feed</h1>
              <p className="text-gray-600">Connect with fellow travelers and share your experiences</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPostingModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Share2 size={20} />
              <span>Share Experience</span>
            </motion.button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search posts, people, or destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'following', 'trending', 'nearby', 'bookmarked'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Share2 className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? 'No posts match your search criteria'
                  : activeFilter !== 'all'
                  ? `No posts in the "${activeFilter}" category`
                  : 'Be the first to share your travel experience!'}
              </p>
              <button
                onClick={() => setIsPostingModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.userAvatar}
                        alt={post.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{post.userName}</h3>
                        {post.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span>{post.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {format(post.createdAt, 'MMM d, yyyy')}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4">
                    <p className="mb-4">{post.content}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 mb-4`}>
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post by ${post.userName}`}
                          className="w-full h-64 object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {/* Trip Details */}
                  {post.destination && post.tripDates && (
                    <div className="px-4 py-3 bg-blue-50 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Globe size={16} />
                        <span>{post.destination}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Calendar size={16} />
                        <span>
                          {format(post.tripDates.start, 'MMM d')} - {format(post.tripDates.end, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 ${
                          post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                      >
                        <MessageSquare size={20} />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`${
                        post.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                      }`}
                    >
                      <Bookmark size={20} className={post.isBookmarked ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Preview Comments */}
                  {post.comments.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50">
                      {post.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3 mb-3 last:mb-0">
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="bg-white p-3 rounded-lg">
                              <p className="font-medium text-sm">{comment.userName}</p>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{format(comment.createdAt, 'MMM d, h:mm a')}</span>
                              <button className="hover:text-blue-500">Reply</button>
                              <div className="flex items-center gap-1">
                                <Heart size={12} />
                                <span>{comment.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="text-blue-600 text-sm mt-2 hover:underline"
                        >
                          View all {post.comments.length} comments
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isPostingModalOpen && (
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
                <h3 className="text-xl font-bold">Share Your Travel Experience</h3>
                <button
                  onClick={() => setIsPostingModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anonymous'}
                    alt={user?.name || 'Anonymous User'}
                    className="w-10 h-10 rounded-full"
                  />
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your travel story..."
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  />
                </div>
                
                {newPostImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {newPostImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Add Photos"
                  >
                    <Image size={20} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Take Photo"
                  >
                    <Camera size={20} />
                  </button>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={newPostLocation}
                      onChange={(e) => setNewPostLocation(e.target.value)}
                      placeholder="Add location"
                      className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePostSubmit}
                    disabled={!newPost.trim() && newPostImages.length === 0}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Share2 size={20} />
                    <span>Post</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
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
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Images Section */}
              {selectedPost.images && selectedPost.images.length > 0 ? (
                <div className="md:w-1/2 h-[50vh] md:h-auto relative">
                  <img
                    src={selectedPost.images[0]}
                    alt={`Post by ${selectedPost.userName}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <X size={20} />
                </button>
              )}

              {/* Content and Comments Section */}
              <div className={`${selectedPost.images && selectedPost.images.length > 0 ? 'md:w-1/2' : 'w-full'} flex flex-col`}>
                {/* Post Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.userAvatar}
                      alt={selectedPost.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedPost.userName}</h3>
                      {selectedPost.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span>{selectedPost.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(selectedPost.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>

                {/* Post Content */}
                <div className="p-4 border-b">
                  <p className="mb-4">{selectedPost.content}</p>
                  {selectedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Trip Details */}
                  {selectedPost.destination && selectedPost.tripDates && (
                    <div className="py-3 bg-blue-50 rounded-lg flex items-center gap-4 px-4 mb-4">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Globe size={16} />
                        <span>{selectedPost.destination}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Calendar size={16} />
                        <span>
                          {format(selectedPost.tripDates.start, 'MMM d')} - {format(selectedPost.tripDates.end, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => toggleLike(selectedPost.id)}
                        className={`flex items-center gap-1 ${
                          selectedPost.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} className={selectedPost.isLiked ? 'fill-current' : ''} />
                        <span>{selectedPost.likes}</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MessageSquare size={20} />
                        <span>{selectedPost.comments.length}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(selectedPost.id)}
                      className={`${
                        selectedPost.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                      }`}
                    >
                      <Bookmark size={20} className={selectedPost.isBookmarked ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h4 className="font-semibold mb-4">Comments</h4>
                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-sm">{comment.userName}</p>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{format(comment.createdAt, 'MMM d, h:mm a')}</span>
                            <button className="hover:text-blue-500">Reply</button>
                            <div className="flex items-center gap-1">
                              <Heart size={12} />
                              <span>{comment.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Comment */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anonymous'}
                      alt={user?.name || 'Anonymous User'}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full pr-10 pl-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addComment(selectedPost.id, newComment);
                          }
                        }}
                      />
                      <button
                        onClick={() => addComment(selectedPost.id, newComment)}
                        disabled={!newComment.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 disabled:text-gray-300"
                      >
                        <Send size={20} />
                      </button>
                    </div>
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

export default SocialFeed;