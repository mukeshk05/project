import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Trash2, Download, Bot, User as UserIcon, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    locations?: string[];
    dates?: string[];
    activities?: string[];
  };
}

interface ConversationGroup {
  date: string;
  messages: Message[];
}

const ChatHistory: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationGroup[]>([]);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'locations' | 'activities'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const messages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));

        // Group messages by date
        const grouped = groupMessagesByDate(messages);
        setConversations(grouped);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupMessagesByDate = (messages: Message[]): ConversationGroup[] => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups)
      .map(([date, messages]) => ({ date, messages }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const deleteConversation = async (date: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/chat/history/${date}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.date !== date));
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const exportConversation = (date: string) => {
    const conversation = conversations.find(conv => conv.date === date);
    if (!conversation) return;

    const content = conversation.messages
      .map(msg => `[${msg.timestamp.toLocaleTimeString()}] ${msg.role}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filterConversations = (conversations: ConversationGroup[]) => {
    if (!searchTerm && selectedFilter === 'all') return conversations;

    return conversations.map(group => ({
      ...group,
      messages: group.messages.filter(msg => {
        const matchesSearch = msg.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedFilter === 'locations') {
          return matchesSearch && msg.metadata?.locations && msg.metadata.locations.length > 0;
        }
        if (selectedFilter === 'activities') {
          return matchesSearch && msg.metadata?.activities && msg.metadata.activities.length > 0;
        }
        
        return matchesSearch;
      })
    })).filter(group => group.messages.length > 0);
  };

  const filteredConversations = filterConversations(conversations);

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
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h1 className="text-2xl font-bold">Chat History</h1>
            <p className="text-blue-100">View and manage your travel assistant conversations</p>
          </div>

          <div className="p-6 border-b">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Messages</option>
                <option value="locations">With Locations</option>
                <option value="activities">With Activities</option>
              </select>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y"
          >
            {filteredConversations.map((group) => (
              <motion.div
                key={group.date}
                variants={itemVariants}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-500" size={20} />
                    <h2 className="text-lg font-semibold">{group.date}</h2>
                    <span className="text-gray-500 text-sm">
                      ({group.messages.length} messages)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => exportConversation(group.date)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <Download size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteConversation(group.date)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDateExpansion(group.date)}
                      className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
                    >
                      {expandedDates.has(group.date) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedDates.has(group.date) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {group.messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-start gap-3 ${
                            message.role === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user'
                              ? 'bg-blue-500'
                              : 'bg-purple-500'
                          } text-white`}>
                            {message.role === 'user' ? (
                              <UserIcon size={16} />
                            ) : (
                              <Bot size={16} />
                            )}
                          </div>
                          <div className={`flex-1 p-4 rounded-xl ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100'
                          }`}>
                            <div className="mb-2">{message.content}</div>
                            <div className="flex items-center gap-2 text-xs">
                              <Clock size={12} />
                              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                            </div>
                            {message.metadata && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {message.metadata.locations?.map((location, i) => (
                                  <span key={i} className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                                    {location}
                                  </span>
                                ))}
                                {message.metadata.activities?.map((activity, i) => (
                                  <span key={i} className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Filter size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No conversations found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatHistory;