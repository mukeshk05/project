import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, MapPin, DollarSign, MessageSquare,
  ThumbsUp, ThumbsDown, Plus, X, Send, Clock
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface Suggestion {
  id: string;
  type: 'destination' | 'dates' | 'activity';
  content: string;
  author: string;
  votes: {
    up: string[];
    down: string[];
  };
  timestamp: Date;
}

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

const GroupTripMode: React.FC = () => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const inviteMember = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/group/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) throw new Error('Failed to send invitation');

      const data = await response.json();
      setMembers([...members, data.member]);
      setNewEmail('');
      setShowInvite(false);
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const addSuggestion = async (type: 'destination' | 'dates' | 'activity', content: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/group/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ type, content }),
      });

      if (!response.ok) throw new Error('Failed to add suggestion');

      const data = await response.json();
      setSuggestions([...suggestions, data.suggestion]);
    } catch (error) {
      console.error('Error adding suggestion:', error);
    }
  };

  const vote = async (suggestionId: string, voteType: 'up' | 'down') => {
    try {
      const response = await fetch(`http://localhost:5000/api/group/suggestions/${suggestionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ type: voteType }),
      });

      if (!response.ok) throw new Error('Failed to vote');

      const data = await response.json();
      setSuggestions(suggestions.map(s =>
        s.id === suggestionId ? { ...s, votes: data.votes } : s
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/group/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
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
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Planning Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Users className="text-blue-600" size={32} />
                  <h1 className="text-2xl font-bold">Group Trip Planning</h1>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInvite(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Invite Members
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2"
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                        {member.name[0]}
                      </div>
                    )}
                    <span>{member.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.status === 'accepted'
                        ? 'bg-green-100 text-green-600'
                        : member.status === 'declined'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        variants={itemVariants}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs mb-2 inline-block">
                              {suggestion.type}
                            </span>
                            <p className="text-gray-800">{suggestion.content}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Suggested by {suggestion.author}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => vote(suggestion.id, 'up')}
                              className="p-2 hover:bg-green-100 rounded-full transition-colors"
                            >
                              <ThumbsUp
                                size={20}
                                className={suggestion.votes.up.length > 0 ? 'text-green-500' : 'text-gray-400'}
                              />
                            </button>
                            <span>{suggestion.votes.up.length}</span>
                            <button
                              onClick={() => vote(suggestion.id, 'down')}
                              className="p-2 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <ThumbsDown
                                size={20}
                                className={suggestion.votes.down.length > 0 ? 'text-red-500' : 'text-gray-400'}
                              />
                            </button>
                            <span>{suggestion.votes.down.length}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-[800px] flex flex-col">
            <h2 className="text-xl font-bold mb-6">Group Chat</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    {message.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-800">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4">Invite Members</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowInvite(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={inviteMember}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Invitation
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

export default GroupTripMode;