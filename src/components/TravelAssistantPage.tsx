import React, { useState, useEffect } from 'react';
import { Send, Loader, MapPin, Calendar, Users, Globe, Compass, Coffee, Utensils, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const TravelAssistantPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setConversation(data.messages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!user) {
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Please log in to use the Travel Assistant.'
      }]);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Authentication error. Please try logging in again.'
      }]);
      return;
    }

    const userMessage = message;
    setMessage('');
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    {
      text: "Plan a romantic weekend getaway",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      text: "Best hidden gems in Europe",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      text: "Local food recommendations in Tokyo",
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      text: "Family-friendly destinations",
      icon: <Users className="w-5 h-5" />,
    },
    {
      text: "Cultural experiences in Bali",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      text: "Best cafes in Paris",
      icon: <Coffee className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="bg-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-6">AI Travel Assistant</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">I can help you with:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>Destination Planning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Itinerary Creation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>Group Travel Tips</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      <span>Cultural Insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      <span>Travel Requirements</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Try asking about:</h3>
                  <div className="grid gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(prompt.text)}
                        className="flex items-center gap-2 p-2 rounded bg-blue-500 hover:bg-blue-400 transition-colors text-left"
                      >
                        {prompt.icon}
                        <span>{prompt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col h-[800px]">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {!user && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800">
                    Please log in to use the Travel Assistant.
                  </div>
                )}

                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-2">
                      <Loader className="animate-spin" size={20} />
                      <span className="text-gray-600">Planning your perfect trip...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t p-6">
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about your travel plans..."
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!user}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !user}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
                  >
                    <Send size={20} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAssistantPage;