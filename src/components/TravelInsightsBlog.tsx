import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Calendar, MapPin, TrendingUp, Filter, Search,
  ChevronDown, ChevronUp, ArrowRight, Clock, User, ThumbsUp,
  MessageSquare, Share2, Bookmark, BookmarkCheck
} from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: Date;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  likes: number;
  comments: number;
  trending: boolean;
}

const TravelInsightsBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      filterPosts();
    }
  }, [posts, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blog/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      setPosts(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((post: BlogPost) => post.category)));
      setCategories(uniqueCategories as string[]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Use mock data for development
      generateMockPosts();
      setIsLoading(false);
    }
  };

  const generateMockPosts = () => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Top 10 Hidden Beaches in Southeast Asia',
        excerpt: 'Discover secluded paradises away from the tourist crowds.',
        content: `
          <p>Southeast Asia is home to some of the world's most beautiful beaches, but many travelers only visit the well-known spots. In this article, we'll take you off the beaten path to discover hidden gems that offer pristine sands, crystal-clear waters, and a peaceful atmosphere away from the crowds.</p>
          
          <h2>1. Koh Rong Samloem, Cambodia</h2>
          <p>This island paradise features powdery white sand beaches and turquoise waters. The lack of roads and limited development means you'll experience true tranquility here.</p>
          
          <h2>2. Nacpan Beach, Philippines</h2>
          <p>Located in El Nido, this four-kilometer stretch of golden sand is far less crowded than other beaches in the area. The gentle waves make it perfect for swimming.</p>
          
          <h2>3. Koh Kradan, Thailand</h2>
          <p>This small island in the Andaman Sea offers some of Thailand's most beautiful coral reefs, perfect for snorkeling right off the beach.</p>
          
          <p>The best time to visit these hidden beaches is during the dry season (November to April), when you'll experience less rainfall and calmer seas. Remember to respect these pristine environments by taking all trash with you and avoiding damage to coral reefs.</p>
          
          <p>For the adventurous traveler willing to venture beyond the typical tourist path, these hidden beaches offer rewards of unspoiled beauty and authentic local experiences.</p>
        `,
        author: {
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        date: new Date('2024-02-15'),
        category: 'Destinations',
        tags: ['beaches', 'southeast asia', 'hidden gems', 'travel tips'],
        image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80&w=2000',
        readTime: 8,
        likes: 342,
        comments: 47,
        trending: true,
      },
      {
        id: '2',
        title: 'How to Travel Sustainably in 2024',
        excerpt: 'Practical tips for reducing your carbon footprint while exploring the world.',
        content: `
          <p>Sustainable travel is no longer just a trend—it's becoming a necessity as we face climate challenges. Here are practical ways to make your travels more environmentally friendly without sacrificing experiences.</p>
          
          <h2>Choose Eco-Friendly Transportation</h2>
          <p>When possible, opt for trains over planes for shorter distances. If flying is necessary, choose direct flights to reduce emissions and consider airlines with carbon offset programs.</p>
          
          <h2>Stay in Sustainable Accommodations</h2>
          <p>Look for hotels and hostels with green certifications. Many properties now use renewable energy, have water conservation systems, and implement waste reduction programs.</p>
          
          <h2>Support Local Communities</h2>
          <p>Eat at locally-owned restaurants, shop at local markets, and hire local guides. This ensures your tourism dollars benefit the communities you're visiting.</p>
          
          <p>Remember that sustainable travel isn't about perfection—it's about making better choices when possible. Even small changes in how we travel can collectively make a significant positive impact on our planet.</p>
          
          <p>As travelers, we have the power to demand more sustainable practices from the tourism industry through our booking choices and feedback.</p>
        `,
        author: {
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
        date: new Date('2024-03-05'),
        category: 'Sustainable Travel',
        tags: ['eco-friendly', 'sustainable', 'green travel', 'responsible tourism'],
        image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=2000',
        readTime: 6,
        likes: 215,
        comments: 32,
        trending: false,
      },
      {
        id: '3',
        title: 'Digital Nomad Guide: Best Cities for Remote Work',
        excerpt: 'Where to set up your laptop with the perfect balance of affordability, amenities, and lifestyle.',
        content: `
          <p>The digital nomad lifestyle has exploded in popularity, with more professionals than ever embracing location independence. But choosing the right base can make or break your remote work experience.</p>
          
          <h2>Chiang Mai, Thailand</h2>
          <p>A longtime favorite among digital nomads, Chiang Mai offers an unbeatable combination of low cost of living, fast internet, abundant coworking spaces, and a large expat community.</p>
          
          <h2>Lisbon, Portugal</h2>
          <p>With its vibrant culture, beautiful weather, and growing tech scene, Lisbon has become Europe's digital nomad hotspot. The city offers a high quality of life at a lower cost than other Western European capitals.</p>
          
          <h2>Medellín, Colombia</h2>
          <p>Once notorious for crime, Medellín has transformed into a modern, innovative city with perfect spring-like weather year-round. The affordable cost of living and growing number of coworking spaces make it ideal for remote workers.</p>
          
          <p>When choosing your digital nomad base, consider factors beyond just cost and internet speed. Think about time zone compatibility with your clients or company, visa requirements, healthcare access, and local community.</p>
          
          <p>The most successful digital nomads often establish a rotation between 2-3 favorite locations rather than constantly moving, allowing them to build deeper connections and maintain productivity.</p>
        `,
        author: {
          name: 'Alex Rivera',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        },
        date: new Date('2024-03-18'),
        category: 'Digital Nomad',
        tags: ['remote work', 'digital nomad', 'coworking', 'expat life'],
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000',
        readTime: 10,
        likes: 428,
        comments: 73,
        trending: true,
      },
      {
        id: '4',
        title: 'The Ultimate Guide to Street Food Safety',
        excerpt: 'How to enjoy local cuisine without risking your health.',
        content: `
          <p>Street food offers some of the most authentic and delicious culinary experiences when traveling, but concerns about food safety often hold travelers back. Here's how to enjoy local street food while minimizing health risks.</p>
          
          <h2>Look for Popular Stalls</h2>
          <p>Busy stalls with high turnover mean fresher ingredients and lower risk of foodborne illness. If locals are lining up, it's usually a good sign for both taste and safety.</p>
          
          <h2>Watch the Cooking Process</h2>
          <p>Choose stalls where you can see the food being cooked fresh at high temperatures. Avoid pre-cooked items sitting at room temperature.</p>
          
          <h2>Consider Timing</h2>
          <p>Eating at peak meal times ensures you're getting freshly prepared food rather than items that have been sitting out.</p>
          
          <p>While these precautions help, it's also wise to gradually introduce your system to local cuisine rather than diving into the most exotic options immediately. Start with cooked foods before trying raw dishes.</p>
          
          <p>Remember that an upset stomach doesn't always mean food poisoning—sometimes it's just your body adjusting to new bacteria and spices. Pack basic medications just in case, but don't let fear prevent you from experiencing one of travel's greatest pleasures.</p>
        `,
        author: {
          name: 'Priya Patel',
          avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        },
        date: new Date('2024-02-28'),
        category: 'Food & Dining',
        tags: ['street food', 'food safety', 'culinary travel', 'local cuisine'],
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000',
        readTime: 7,
        likes: 189,
        comments: 41,
        trending: false,
      },
    ];
    
    setPosts(mockPosts);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(mockPosts.map(post => post.category)));
    setCategories(uniqueCategories);
  };

  const filterPosts = () => {
    let filtered = [...posts];
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(filtered);
  };

  const toggleSavePost = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 text-center"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold mb-4">Travel Insights</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert advice, destination guides, and travel trends powered by AI and real traveler data
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(posts.flatMap(post => post.tags))).slice(0, 8).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-3 space-y-8"
          >
            {/* Featured Post */}
            {!selectedPost && posts.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative h-96">
                  <img
                    src={posts[0].image}
                    alt={posts[0].title}
                    className="w-full h-full object-cover"
                  />
                  {posts[0].trending && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <TrendingUp size={14} />
                      <span>Trending</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                    <div className="text-white/80 mb-2">
                      {posts[0].category} • {format(posts[0].date, 'MMMM d, yyyy')}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{posts[0].title}</h2>
                    <p className="text-white/90 mb-6">{posts[0].excerpt}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={posts[0].author.avatar}
                          alt={posts[0].author.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="text-white">{posts[0].author.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/80">
                        <Clock size={16} />
                        <span>{posts[0].readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={18} className="text-gray-500" />
                      <span>{posts[0].likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={18} className="text-gray-500" />
                      <span>{posts[0].comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSavePost(posts[0].id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {savedPosts.includes(posts[0].id) ? (
                        <BookmarkCheck size={20} className="text-blue-600" />
                      ) : (
                        <Bookmark size={20} className="text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedPost(posts[0])}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      Read Article
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Article List */}
            {!selectedPost && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.slice(1).map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      {post.trending && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <TrendingUp size={14} />
                          <span>Trending</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{format(post.date, 'MMMM d, yyyy')}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">{post.author.name}</p>
                            <p className="text-xs text-gray-500">{post.readTime} min read</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSavePost(post.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            {savedPosts.includes(post.id) ? (
                              <BookmarkCheck size={18} className="text-blue-600" />
                            ) : (
                              <Bookmark size={18} className="text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedPost(post)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Selected Article View */}
            {selectedPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative h-96">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full"
                  >
                    <ArrowRight className="rotate-180" size={24} />
                  </button>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>{selectedPost.category}</span>
                    <span>•</span>
                    <span>{format(selectedPost.date, 'MMMM d, yyyy')}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-6">{selectedPost.title}</h1>
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPost.author.avatar}
                        alt={selectedPost.author.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{selectedPost.author.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{selectedPost.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Share2 size={20} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => toggleSavePost(selectedPost.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {savedPosts.includes(selectedPost.id) ? (
                          <BookmarkCheck size={20} className="text-blue-600" />
                        ) : (
                          <Bookmark size={20} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div 
                    className="prose max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 hover:text-blue-600">
                        <ThumbsUp size={20} />
                        <span>{selectedPost.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-600">
                        <MessageSquare size={20} />
                        <span>{selectedPost.comments}</span>
                      </button>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Share Article
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TravelInsightsBlog;