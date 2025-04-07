import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, History } from 'lucide-react';
import TravelAssistantPage from "./TravelAssistantPage.tsx";
import ChatHistory from "./ChatHistory.tsx";

function AssistantPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MessageSquare className="text-blue-500" size={24} />
                            </motion.div>
                            <span className="text-xl font-bold text-gray-800">Travel Assistant</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link to="/chat">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <MessageSquare size={20} />
                                    <span>Chat</span>
                                </motion.button>
                            </Link>
                            <Link to="/chat-history">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <History size={20} />
                                    <span>History</span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<TravelAssistantPage />} />
                <Route path="/chat" element={<TravelAssistantPage />} />
                <Route path="/chat-history" element={<ChatHistory />} />
            </Routes>

        </div>
    );
}

export default AssistantPage