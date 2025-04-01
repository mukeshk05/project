import React, { useState } from 'react';
import { MessageSquare, Send, Loader, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TravelAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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
    "What are the best places to visit in Bali?",
    "Plan a 3-day trip to Paris",
    "Budget-friendly hotels in Santorini",
    "Best time to visit Tokyo",
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <MessageSquare size={24} />
          <span className="hidden md:inline">Travel Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <h3 className="font-semibold">AI Travel Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close assistant"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800">
                Please log in to use the Travel Assistant.
              </div>
            )}

            {conversation.length === 0 && user && (
              <div className="text-center text-gray-500 mt-4">
                <p className="text-lg font-semibold mb-3">👋 Hello! I'm your AI travel assistant.</p>
                <p className="mb-4">I can help you plan your perfect trip with personalized recommendations and expert advice.</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Try asking about:</p>
                  <ul className="space-y-2 text-left">
                    <li>• Destination recommendations</li>
                    <li>• Custom itinerary planning</li>
                    <li>• Local attractions and hidden gems</li>
                    <li>• Travel tips and cultural insights</li>
                    <li>• Budget planning and saving tips</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="font-medium mb-2">Quick prompts:</p>
                  <div className="space-y-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(prompt)}
                        className="block w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
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
                <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                  <Loader className="animate-spin" size={16} />
                  <span className="text-gray-600">Planning your perfect trip...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your travel plans..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!user}
              />
              <button
                type="submit"
                disabled={isLoading || !user}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TravelAssistant;