import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Users, Crown, Star, Plus, Download, Share2,
  ChevronUp, ChevronDown, Search, UserPlus
} from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from '../context/AuthContext';

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  points: number;
  level: string;
  achievements: string[];
  rank: number;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  totalPoints: number;
  achievements: string[];
}

const GroupLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupLeaderboard(selectedGroup);
    } else {
      fetchGlobalLeaderboard();
    }
  }, [selectedGroup]);

  const fetchGlobalLeaderboard = async () => {
    try {
      const data = await leaderboardService.getGlobalLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
    }
  };

  const fetchGroupLeaderboard = async (groupId: string) => {
    try {
      const data = await leaderboardService.getGroupLeaderboard(groupId);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching group leaderboard:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await leaderboardService.createGroup(newGroupName, [user?._id || '']);
      setShowCreateGroup(false);
      setNewGroupName('');
      // Refresh groups list
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleExportHistory = async () => {
    try {
      setIsExporting(true);
      const blob = await leaderboardService.exportRewardHistory(user?._id || '');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reward-history.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting history:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Travel Buddies Leaderboard</h2>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateGroup(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={20} />
                Create Group
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportHistory}
                disabled={isExporting}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                <Download size={20} />
                Export History
              </motion.button>
            </div>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="w-64 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Your Groups</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedGroup ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    Global Ranking
                  </button>
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedGroup === group.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-4">
                {filteredLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={entry.avatar}
                          alt={entry.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{entry.username}</span>
                          {entry.rank <= 3 && (
                            <Crown
                              size={16}
                              className={
                                entry.rank === 1
                                  ? 'text-yellow-400'
                                  : entry.rank === 2
                                  ? 'text-gray-400'
                                  : 'text-orange-400'
                              }
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star size={16} />
                          <span>{entry.level}</span>
                          <span>•</span>
                          <span>{entry.points} points</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">#{entry.rank}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4">Create New Group</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter group name"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateGroup(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupLeaderboard;