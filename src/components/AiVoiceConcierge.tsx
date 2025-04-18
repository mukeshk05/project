import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Volume2, VolumeX, Settings, 
  Loader, MessageSquare, Bot, User as UserIcon, 
  Sparkles, Check, X, Play, Pause, Clock, 
  Calendar, MapPin, Plane, Hotel, Car, Utensils
} from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

const AiVoiceConcierge: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice: 'en-US-Standard-B',
    rate: 1,
    pitch: 1,
    volume: 1
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [wakeWord, setWakeWord] = useState('hey assistant');
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI Voice Concierge. You can ask me about travel information, booking assistance, or local recommendations. How can I help you today?",
        timestamp: new Date()
      }
    ]);

    // Get available voices
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    getVoices();
    
    // Chrome needs this event to get voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices;
    }

    return () => {
      // Clean up
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript && isListening) {
      // Check for wake word if wake word mode is active
      if (isWakeWordActive && !isWakeWordDetected) {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes(wakeWord.toLowerCase())) {
          setIsWakeWordDetected(true);
          resetTranscript();
        }
      } else if (transcript.trim() && !isProcessing) {
        // Process the command if not already processing
        handleVoiceCommand(transcript);
      }
    }
  }, [transcript, isListening, isWakeWordActive, isWakeWordDetected, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      setIsWakeWordDetected(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
      resetTranscript();
    }
  };

  const toggleWakeWordMode = () => {
    setIsWakeWordActive(!isWakeWordActive);
    setIsWakeWordDetected(false);
    resetTranscript();
  };

  const handleVoiceCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    resetTranscript();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: command,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // In a real app, this would be an API call to a language model
      // For demo purposes, we'll simulate a delay and use predefined responses
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = generateResponse(command);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      speakText(response);
      
      // Reset wake word detection
      setIsWakeWordDetected(false);
    } catch (error) {
      console.error('Error processing voice command:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Speak the error message
      speakText(errorMessage.content);
      
      // Reset wake word detection
      setIsWakeWordDetected(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateResponse = (command: string): string => {
    // Simple rule-based responses for demo purposes
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      return "Hello there! How can I assist with your travel plans today?";
    } else if (lowerCommand.includes('weather')) {
      return "The weather at your destination is currently sunny with a high of 75°F. Perfect for sightseeing!";
    } else if (lowerCommand.includes('flight') && lowerCommand.includes('book')) {
      return "I'd be happy to help you book a flight. Could you tell me your departure city, destination, and preferred dates?";
    } else if (lowerCommand.includes('hotel') && lowerCommand.includes('recommend')) {
      return "Based on your preferences, I recommend the Grand Hotel in the city center. It has a 4.8-star rating and is close to major attractions.";
    } else if (lowerCommand.includes('restaurant') || lowerCommand.includes('eat')) {
      return "There are several highly-rated restaurants nearby. La Maison offers excellent French cuisine, while Sakura has authentic Japanese options. Would you like me to make a reservation?";
    } else if (lowerCommand.includes('attraction') || lowerCommand.includes('visit') || lowerCommand.includes('see')) {
      return "The top attractions in this area include the National Museum, Central Park, and the Historic District. The museum is open until 6 PM today.";
    } else if (lowerCommand.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "I understand you're interested in travel assistance. Could you provide more details about what you're looking for?";
    }
  };

  const speakText = (text: string) => {
    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if available
    if (availableVoices.length > 0) {
      const selectedVoice = availableVoices.find(voice => voice.name === voiceSettings.voice) || availableVoices[0];
      utterance.voice = selectedVoice;
    }
    
    // Apply settings
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;
    
    // Events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Store reference for potential cancellation
    synthesisRef.current = utterance;
    
    // Speak
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <X className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold mb-4">Browser Not Supported</h2>
          <p className="text-gray-600 mb-6">
            Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="text-white" size={28} />
                <div>
                  <h1 className="text-2xl font-bold">AI Voice Concierge</h1>
                  <p className="text-blue-100">Your hands-free travel assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <Settings size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopSpeaking}
                  disabled={!isSpeaking}
                  className={`p-2 rounded-full transition-colors ${
                    isSpeaking
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-white/40 cursor-not-allowed'
                  }`}
                >
                  <VolumeX size={20} />
                </motion.button>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm">
                {isListening ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span>
                      {isWakeWordActive && !isWakeWordDetected
                        ? `Listening for "${wakeWord}"...`
                        : isProcessing
                        ? 'Processing...'
                        : 'Listening...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-3 w-3 rounded-full bg-gray-300"></span>
                    <span>Microphone off</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className={`mb-4 flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {message.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                      </div>
                      <div>
                        <div className={`p-4 rounded-xl ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border shadow-sm'
                        }`}>
                          <p className="mb-1">{message.content}</p>
                          <div className="text-xs opacity-70 flex items-center gap-1">
                            <Clock size={12} />
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => speakText(message.content)}
                            className="mt-2 flex items-center gap-1 text-purple-600 text-sm hover:text-purple-800"
                          >
                            <Volume2 size={14} />
                            <span>Play audio</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Bot size={20} />
                  </div>
                  <div className="p-4 rounded-xl bg-white border shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Controls */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4 ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                </motion.button>
                <p className="text-gray-600 text-sm mb-4">
                  {isListening ? 'Tap to stop listening' : 'Tap to start listening'}
                </p>
                
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={isWakeWordActive}
                      onChange={toggleWakeWordMode}
                      className="rounded text-blue-600"
                    />
                    <span>Wake word mode</span>
                  </label>
                  {isWakeWordActive && (
                    <div className="text-sm text-blue-600 font-medium">
                      "{wakeWord}"
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Try saying:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { text: "What's the weather like?", icon: Cloud },
                    { text: "Book a flight to Paris", icon: Plane },
                    { text: "Recommend a hotel in Tokyo", icon: Hotel },
                    { text: "Find restaurants near me", icon: Utensils }
                  ].map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border text-sm"
                    >
                      <suggestion.icon size={16} className="text-blue-500" />
                      <span>{suggestion.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Voice Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Voice Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice
                  </label>
                  <select
                    value={voiceSettings.voice}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, voice: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Rate: {voiceSettings.rate.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.rate}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pitch: {voiceSettings.pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.pitch}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, pitch: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume: {voiceSettings.volume.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.volume}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, volume: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wake Word
                  </label>
                  <input
                    type="text"
                    value={wakeWord}
                    onChange={(e) => setWakeWord(e.target.value)}
                    placeholder="e.g., hey assistant"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Say this phrase to activate the assistant when in wake word mode
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      // Test the current voice settings
                      speakText("This is a test of the voice settings. How does this sound?");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Play size={20} />
                    <span>Test Voice</span>
                  </button>
                  
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiVoiceConcierge;