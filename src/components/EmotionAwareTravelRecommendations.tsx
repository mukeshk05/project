import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Loader, MapPin, Calendar, Users, Smile, Frown, Meh, ThumbsUp, ThumbsDown } from 'lucide-react';


interface Recommendation {
    id: string;
    destination: string;
    description: string;
    emotionMatch: number;
    image: string;
    bestTime: string;
    budget: {
        low: number;
        high: number;
    };
    activities: string[];
    tags: string[];
}

interface EmotionAwareTravelRecommendationsProps {
    onRecommendationSelect?: (recommendation: Recommendation) => void;
}

const EmotionAwareTravelRecommendations: React.FC<EmotionAwareTravelRecommendationsProps> = ({
                                                                                                 onRecommendationSelect
                                                                                             }) => {
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [emotionResults, setEmotionResults] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
    const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike' | null>>({});

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsAnalyzing(true);
        setEmotionResults(null);
        setRecommendations([]);

        try {
            // Analyze emotions in the query
           // const analysis = await analyzeEmotions(query);
            setEmotionResults(analysis);

            // Generate mock recommendations based on the emotion
            const mockRecommendations = generateMockRecommendations(analysis.emotion);
            setRecommendations(mockRecommendations);

            if (mockRecommendations.length > 0) {
                setSelectedRecommendation(mockRecommendations[0]);
            }
        } catch (error) {
            console.error('Error analyzing emotions:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateMockRecommendations = (emotion: string): Recommendation[] => {
        // Generate different recommendations based on detected emotion
        switch (emotion.toLowerCase()) {
            case 'happy':
            case 'excited':
                return [
                    {
                        id: '1',
                        destination: 'Bali, Indonesia',
                        description: 'Vibrant island with beautiful beaches, perfect for celebrating your positive mood with adventure and relaxation.',
                        emotionMatch: 95,
                        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'April to October',
                        budget: { low: 1200, high: 3000 },
                        activities: ['Beach relaxation', 'Surfing', 'Temple visits', 'Jungle trekking'],
                        tags: ['Beach', 'Adventure', 'Culture', 'Relaxation']
                    },
                    {
                        id: '2',
                        destination: 'Barcelona, Spain',
                        description: 'Energetic city with stunning architecture, vibrant nightlife, and beautiful beaches to match your upbeat mood.',
                        emotionMatch: 90,
                        image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'May to June',
                        budget: { low: 1500, high: 3500 },
                        activities: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Beach day'],
                        tags: ['City', 'Architecture', 'Nightlife', 'Food']
                    }
                ];

            case 'relaxed':
            case 'calm':
                return [
                    {
                        id: '3',
                        destination: 'Kyoto, Japan',
                        description: 'Serene temples, peaceful gardens, and traditional tea houses to maintain your calm state of mind.',
                        emotionMatch: 97,
                        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'March to May or October to November',
                        budget: { low: 1800, high: 4000 },
                        activities: ['Temple visits', 'Traditional tea ceremony', 'Bamboo forest walk', 'Hot springs'],
                        tags: ['Culture', 'Tranquility', 'Nature', 'History']
                    },
                    {
                        id: '4',
                        destination: 'Maldives',
                        description: 'Pristine beaches and crystal-clear waters perfect for maintaining your peaceful state.',
                        emotionMatch: 94,
                        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'November to April',
                        budget: { low: 2500, high: 8000 },
                        activities: ['Snorkeling', 'Beach relaxation', 'Spa treatments', 'Overwater bungalow stay'],
                        tags: ['Luxury', 'Beach', 'Relaxation', 'Romance']
                    }
                ];

            case 'sad':
            case 'stressed':
                return [
                    {
                        id: '5',
                        destination: 'Costa Rica',
                        description: 'Lush rainforests, wildlife, and healing hot springs to lift your spirits and reduce stress.',
                        emotionMatch: 92,
                        image: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'December to April',
                        budget: { low: 1400, high: 3200 },
                        activities: ['Wildlife watching', 'Hot springs', 'Rainforest hikes', 'Beach relaxation'],
                        tags: ['Nature', 'Wellness', 'Adventure', 'Healing']
                    },
                    {
                        id: '6',
                        destination: 'Sedona, Arizona',
                        description: 'Red rock landscapes and spiritual vortexes known for their healing energy to help improve your mood.',
                        emotionMatch: 89,
                        image: 'https://images.unsplash.com/photo-1527234525551-13f8d19b6f40?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'March to May or September to November',
                        budget: { low: 1200, high: 2800 },
                        activities: ['Vortex meditation', 'Hiking', 'Spa treatments', 'Stargazing'],
                        tags: ['Spiritual', 'Nature', 'Wellness', 'Healing']
                    }
                ];

            case 'adventurous':
            case 'curious':
                return [
                    {
                        id: '7',
                        destination: 'New Zealand',
                        description: 'Epic landscapes and adrenaline-pumping activities to satisfy your adventurous spirit.',
                        emotionMatch: 98,
                        image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'December to February',
                        budget: { low: 2200, high: 5000 },
                        activities: ['Bungee jumping', 'Hiking', 'Lord of the Rings tours', 'Glacier exploration'],
                        tags: ['Adventure', 'Nature', 'Outdoors', 'Scenic']
                    },
                    {
                        id: '8',
                        destination: 'Peru',
                        description: 'Ancient ruins, diverse landscapes, and rich culture to explore and satisfy your curiosity.',
                        emotionMatch: 94,
                        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'May to September',
                        budget: { low: 1600, high: 3800 },
                        activities: ['Machu Picchu', 'Sacred Valley', 'Amazon rainforest', 'Lake Titicaca'],
                        tags: ['History', 'Culture', 'Adventure', 'Nature']
                    }
                ];

            default:
                return [
                    {
                        id: '9',
                        destination: 'Portugal',
                        description: 'Diverse experiences from historic cities to beautiful beaches, suitable for any mood.',
                        emotionMatch: 85,
                        image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'March to May or September to October',
                        budget: { low: 1300, high: 3000 },
                        activities: ['Lisbon exploration', 'Porto wine tasting', 'Algarve beaches', 'Sintra castles'],
                        tags: ['Culture', 'Food', 'Beach', 'History']
                    },
                    {
                        id: '10',
                        destination: 'Thailand',
                        description: 'Something for everyone - temples, islands, food, and adventure.',
                        emotionMatch: 82,
                        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=2000',
                        bestTime: 'November to March',
                        budget: { low: 1000, high: 2500 },
                        activities: ['Bangkok temples', 'Island hopping', 'Street food tours', 'Elephant sanctuaries'],
                        tags: ['Culture', 'Food', 'Beach', 'Budget-friendly']
                    }
                ];
        }
    };

    const handleRecommendationClick = (recommendation: Recommendation) => {
        setSelectedRecommendation(recommendation);
        if (onRecommendationSelect) {
            onRecommendationSelect(recommendation);
        }
    };

    const handleFeedback = (id: string, type: 'like' | 'dislike') => {
        setFeedback(prev => ({
            ...prev,
            [id]: prev[id] === type ? null : type
        }));
    };

    const getEmotionIcon = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case 'happy':
            case 'excited':
                return <Smile className="text-green-500" />;
            case 'sad':
            case 'stressed':
                return <Frown className="text-red-500" />;
            case 'relaxed':
            case 'calm':
                return <Smile className="text-blue-500" />;
            default:
                return <Meh className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <Heart className="text-pink-500" size={24} />
                <h2 className="text-2xl font-bold">Emotion-Aware Travel Recommendations</h2>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-4">
                        Tell us how you're feeling or what kind of experience you're looking for, and we'll recommend destinations that match your emotional state.
                    </p>
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="I'm feeling adventurous and want to explore somewhere new..."
                            className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isAnalyzing}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                        >
                            {isAnalyzing ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <Search size={20} />
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {emotionResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {getEmotionIcon(emotionResults.emotion)}
                                <h3 className="font-semibold">
                                    Detected Emotion: <span className="text-pink-600">{emotionResults.emotion}</span>
                                </h3>
                            </div>
                            <p className="text-gray-700">
                                Based on your input, we've found destinations that would complement your current emotional state.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {recommendations.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="font-semibold text-lg">Recommended Destinations</h3>
                            {recommendations.map((rec) => (
                                <motion.div
                                    key={rec.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRecommendationClick(rec)}
                                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                        selectedRecommendation?.id === rec.id
                                            ? 'bg-pink-50 border-2 border-pink-500'
                                            : 'bg-white border hover:bg-pink-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{rec.destination}</h4>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                <MapPin size={14} />
                                                <span>{rec.tags.join(' • ')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">
                                            <Heart size={12} />
                                            <span>{rec.emotionMatch}% match</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {selectedRecommendation && (
                            <motion.div
                                key={selectedRecommendation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="lg:col-span-2 space-y-6"
                            >
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                    <img
                                        src={selectedRecommendation.image}
                                        alt={selectedRecommendation.destination}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h2 className="text-2xl font-bold">{selectedRecommendation.destination}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar size={16} />
                                            <span>Best time: {selectedRecommendation.bestTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border">
                                    <p className="text-gray-700 mb-4">{selectedRecommendation.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Best Time</p>
                                                <p className="font-medium">{selectedRecommendation.bestTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Budget Range</p>
                                                <p className="font-medium">${selectedRecommendation.budget.low} - ${selectedRecommendation.budget.high}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Heart className="text-pink-500" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Emotion Match</p>
                                                <p className="font-medium">{selectedRecommendation.emotionMatch}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium mb-2">Recommended Activities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRecommendation.activities.map((activity, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                >
                          {activity}
                        </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleFeedback(selectedRecommendation.id, 'like')}
                                                className={`p-2 rounded-full ${
                                                    feedback[selectedRecommendation.id] === 'like'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                                                }`}
                                            >
                                                <ThumbsUp size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleFeedback(selectedRecommendation.id, 'dislike')}
                                                className={`p-2 rounded-full ${
                                                    feedback[selectedRecommendation.id] === 'dislike'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                                }`}
                                            >
                                                <ThumbsDown size={20} />
                                            </button>
                                        </div>
                                        <button className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                                            Explore Packages
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmotionAwareTravelRecommendations;