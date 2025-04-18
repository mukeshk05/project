import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader, X, Bot, User as UserIcon, Sparkles, History, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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

const TravelAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setConversation(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ message: userMessage, user }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Simulate typing effect
      setIsTyping(true);
      const words = data.response.split(' ');
      let currentResponse = '';

      for (let i = 0; i < words.length; i++) {
        currentResponse += words[i] + ' ';
        setConversation(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: currentResponse.trim(), timestamp: new Date() }
        ]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    "What are the best places to visit in Bali?",
    "Plan a 3-day trip to Paris",
    "Budget-friendly hotels in Santorini",
    "Best time to visit Tokyo",
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const bubbleVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const tabVariants = {
    inactive: {
      color: "#6B7280",
      backgroundColor: "transparent",
    },
    active: {
      color: "#2563EB",
      backgroundColor: "#EFF6FF",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            variants={bubbleVariants}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 group"
          >
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">Travel Assistant</span>
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Bot size={24} className="animate-pulse" />
                  <h3 className="font-semibold">AI Travel Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-4">
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === 'chat' ? 'active' : 'inactive'}
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <MessageSquare size={20} />
                  <span>Chat</span>
                </motion.button>

                <motion.button
                  variants={tabVariants}
                  animate={activeTab === 'history' ? 'active' : 'inactive'}
                  onClick={() => setActiveTab('history')}
                  className="px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <History size={20} />
                  <span>History</span>
                </motion.button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'chat' ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {conversation.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 mt-4"
                      >
                        <Sparkles className="mx-auto mb-4 text-blue-500" size={32} />
                        <p className="text-lg font-semibold mb-3">Hello! I'm your AI travel assistant.</p>
                        <p className="mb-4">I can help you plan your perfect trip with personalized recommendations.</p>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <p className="font-medium mb-2">Try asking about:</p>
                          <div className="space-y-2">
                            {suggestedPrompts.map((prompt, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setMessage(prompt)}
                                className="block w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                {prompt}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {conversation.map((msg, index) => (
                        <motion.div
                          key={index}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[80%] ${
                            msg.role === 'user' ? 'flex-row-reverse' : ''
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              msg.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-purple-500 text-white'
                            }`}>
                              {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-3 rounded-2xl ${
                              msg.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white shadow-sm'
                            }`}>
                              {msg.content}
                              <div className={`text-xs mt-1 ${
                                msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                              }`}>
                                {msg.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-gray-500"
                      >
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm">AI is typing...</span>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about your travel plans..."
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-shadow disabled:opacity-70"
                      >
                        {isLoading ? (
                          <Loader className="animate-spin" size={20} />
                        ) : (
                          <Send size={20} />
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 p-4 bg-gray-50 overflow-y-auto"
                >
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {conversation.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-sm p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {msg.role === 'user' ? (
                            <UserIcon className="text-blue-500" size={16} />
                          ) : (
                            <Bot className="text-purple-500" size={16} />
                          )}
                          <span className="text-sm text-gray-500">
                            {msg.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{msg.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TravelAssistant;