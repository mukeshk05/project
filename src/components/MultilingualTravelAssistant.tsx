import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Loader, Bot, User as UserIcon, Sparkles,
  Mic, MicOff, Globe, ArrowRight, Clock, Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  originalContent?: string;
  timestamp: Date;
}

const MultilingualTravelAssistant: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, translateText, isTranslating } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when component mounts
    const addWelcomeMessage = async () => {
      const welcomeMessage = t('assistant.welcomeMessage');
      const translatedWelcome = await translateText(welcomeMessage);
      
      setMessages([{
        role: 'assistant',
        content: translatedWelcome,
        originalContent: welcomeMessage,
        timestamp: new Date()
      }]);
    };
    
    addWelcomeMessage();
  }, [currentLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    resetTranscript();

    // Add user message in current language
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      // Translate user message to English for the API if not already in English
      const messageForApi = currentLanguage !== 'en' 
        ? await translateText(userMessage, 'en')
        : userMessage;

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          message: messageForApi,
          language: currentLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Translate the response to the current language if not English
      const translatedResponse = currentLanguage !== 'en'
        ? await translateText(data.response)
        : data.response;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: translatedResponse,
        originalContent: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage = t('common.error');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true, language: currentLanguage });
      setIsListening(true);
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

  const suggestedPrompts = [
    t('assistant.examplePrompts.prompt1'),
    t('assistant.examplePrompts.prompt2'),
    t('assistant.examplePrompts.prompt3'),
    t('assistant.examplePrompts.prompt4')
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="text-white" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white">{t('assistant.title')}</h1>
                <p className="text-blue-100">{t('assistant.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Globe size={16} />
              <span>{currentLanguage.toUpperCase()}</span>
              {isTranslating && (
                <span className="ml-2 flex items-center gap-1">
                  <Loader size={12} className="animate-spin" />
                  <span>Translating...</span>
                </span>
              )}
            </div>
          </div>

          <div className="h-[600px] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center text-gray-500 mt-4"
                >
                  <Sparkles className="mx-auto mb-4 text-blue-500" size={32} />
                  <p className="text-lg font-semibold mb-3">{t('assistant.welcomeMessage')}</p>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="font-medium mb-2">{t('assistant.examplePrompts.title')}</p>
                    <div className="space-y-2">
                      {suggestedPrompts.map((prompt, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setInput(prompt)}
                          className="block w-full text-left p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${
                        msg.role === 'user' ? 'flex-row-reverse' : ''
                      }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100'
                        }`}>
                          {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                        </div>
                        <div className={`p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100'
                        }`}>
                          <p className="mb-2">{msg.content}</p>
                          <div className="flex items-center gap-2 text-xs opacity-70">
                            <Clock size={12} />
                            <span>{msg.timestamp.toLocaleTimeString()}</span>
                            
                            {msg.originalContent && msg.originalContent !== msg.content && (
                              <button 
                                className="flex items-center gap-1 hover:underline"
                                title="View original text"
                              >
                                <Languages size={12} />
                                <span>Original</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                {browserSupportsSpeechRecognition && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={toggleListening}
                    className={`p-3 rounded-full transition-colors ${
                      isListening
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </motion.button>
                )}
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('assistant.askMe')}
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultilingualTravelAssistant;