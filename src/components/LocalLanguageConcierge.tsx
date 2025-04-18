import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, MessageSquare, Send, Loader, User as UserIcon, Sparkles,
  Mic, MicOff, Volume2, VolumeX, Copy, Check, X, Download,
  Share2, Bookmark, BookmarkCheck, Zap, Search, Filter, ChevronDown,
  ChevronUp, Lightbulb, Book
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  timestamp: Date;
  language?: string;
  pronunciation?: string;
  context?: string;
}

interface Phrase {
  id: string;
  text: string;
  translation: string;
  pronunciation: string;
  category: string;
  language: string;
  saved: boolean;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LocalLanguageConcierge: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: 'fr'
  });
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [savedPhrases, setSavedPhrases] = useState<Phrase[]>([]);
  const [showSavedPhrases, setShowSavedPhrases] = useState(false);
  const [commonPhrases, setCommonPhrases] = useState<Phrase[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showContextInfo, setShowContextInfo] = useState(false);
  const [contextInfo, setContextInfo] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Bonjour! I'm your language concierge. I can help you communicate in French during your trip. Ask me how to say something, and I'll provide translations, pronunciation guides, and cultural context.",
        translation: "Hello! I'm your language concierge. I can help you communicate in French during your trip. Ask me how to say something, and I'll provide translations, pronunciation guides, and cultural context.",
        timestamp: new Date(),
        language: 'fr'
      }
    ]);

    // Initialize available languages
    setAvailableLanguages([
      { code: 'fr', name: 'French', nativeName: 'Français', flag: 'fr' },
      { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'es' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'it' },
      { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'de' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'jp' },
      { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'cn' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'pt' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'ru' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'sa' },
      { code: 'ko', name: 'Korean', nativeName: '한국어', flag: 'kr' }
    ]);

    // Initialize common phrases
    setCommonPhrases([
      {
        id: '1',
        text: 'Hello',
        translation: 'Bonjour',
        pronunciation: 'bohn-ZHOOR',
        category: 'Greetings',
        language: 'fr',
        saved: false
      },
      {
        id: '2',
        text: 'Thank you',
        translation: 'Merci',
        pronunciation: 'mehr-SEE',
        category: 'Greetings',
        language: 'fr',
        saved: false
      },
      {
        id: '3',
        text: 'Excuse me',
        translation: 'Excusez-moi',
        pronunciation: 'ex-koo-ZAY-mwah',
        category: 'Greetings',
        language: 'fr',
        saved: false
      },
      {
        id: '4',
        text: 'Where is the bathroom?',
        translation: 'Où sont les toilettes?',
        pronunciation: 'oo sohn lay twa-LET?',
        category: 'Practical',
        language: 'fr',
        saved: false
      },
      {
        id: '5',
        text: 'How much does this cost?',
        translation: 'Combien ça coûte?',
        pronunciation: 'kohm-BYEN sah KOOT?',
        category: 'Shopping',
        language: 'fr',
        saved: false
      },
      {
        id: '6',
        text: 'I would like to order',
        translation: 'Je voudrais commander',
        pronunciation: 'zhuh voo-DRAY kohm-ahn-DAY',
        category: 'Dining',
        language: 'fr',
        saved: false
      },
      {
        id: '7',
        text: 'Do you speak English?',
        translation: 'Parlez-vous anglais?',
        pronunciation: 'par-LAY-voo ahn-GLAY?',
        category: 'Practical',
        language: 'fr',
        saved: false
      },
      {
        id: '8',
        text: 'I don\'t understand',
        translation: 'Je ne comprends pas',
        pronunciation: 'zhuh nuh kohm-PRAHN pah',
        category: 'Practical',
        language: 'fr',
        saved: false
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update common phrases when language changes
    updateCommonPhrases();
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response based on user input and selected language
      const aiResponse = generateAiResponse(input, selectedLanguage);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        translation: aiResponse.translation,
        timestamp: new Date(),
        language: selectedLanguage.code,
        pronunciation: aiResponse.pronunciation,
        context: aiResponse.context
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const generateAiResponse = (userInput: string, language: Language): { 
    content: string; 
    translation: string; 
    pronunciation?: string;
    context?: string;
  } => {
    // This is a mock function that would be replaced with actual AI API call
    const lowerInput = userInput.toLowerCase();
    
    // Check if it's a translation request
    if (lowerInput.includes('how do you say') || lowerInput.includes('how to say') || lowerInput.includes('translate')) {
      // Extract the phrase to translate
      let phraseToTranslate = '';
      if (lowerInput.includes('how do you say')) {
        phraseToTranslate = userInput.split('how do you say')[1].trim();
        // Remove trailing punctuation
        phraseToTranslate = phraseToTranslate.replace(/[?.,!]$/, '');
      } else if (lowerInput.includes('how to say')) {
        phraseToTranslate = userInput.split('how to say')[1].trim();
        // Remove trailing punctuation
        phraseToTranslate = phraseToTranslate.replace(/[?.,!]$/, '');
      } else if (lowerInput.includes('translate')) {
        phraseToTranslate = userInput.split('translate')[1].trim();
        // Remove trailing punctuation
        phraseToTranslate = phraseToTranslate.replace(/[?.,!]$/, '');
      }
      
      // Generate mock translations based on language
      let translation = '';
      let pronunciation = '';
      let context = '';
      
      switch (language.code) {
        case 'fr':
          if (phraseToTranslate.includes('hello') || phraseToTranslate.includes('hi')) {
            translation = 'Bonjour';
            pronunciation = 'bohn-ZHOOR';
            context = 'Used as a greeting throughout the day. "Salut" is a more casual alternative among friends.';
          } else if (phraseToTranslate.includes('thank you') || phraseToTranslate.includes('thanks')) {
            translation = 'Merci';
            pronunciation = 'mehr-SEE';
            context = 'For extra politeness, you can say "Merci beaucoup" (thank you very much).';
          } else if (phraseToTranslate.includes('excuse me') || phraseToTranslate.includes('sorry')) {
            translation = 'Excusez-moi';
            pronunciation = 'ex-koo-ZAY-mwah';
            context = 'Used both to get someone\'s attention and to apologize for minor inconveniences.';
          } else if (phraseToTranslate.includes('bathroom') || phraseToTranslate.includes('toilet')) {
            translation = 'Où sont les toilettes?';
            pronunciation = 'oo sohn lay twa-LET?';
            context = 'In restaurants or public places, look for signs saying "WC" or "Toilettes".';
          } else if (phraseToTranslate.includes('how much') || phraseToTranslate.includes('cost')) {
            translation = 'Combien ça coûte?';
            pronunciation = 'kohm-BYEN sah KOOT?';
            context = 'When shopping, you can also point to an item and simply say "Combien?" (How much?)';
          } else {
            // Generic response for other phrases
            translation = `[${phraseToTranslate} in French]`;
            pronunciation = '[Pronunciation guide]';
            context = 'Remember that French pronunciation includes nasal sounds and silent letters at the end of many words.';
          }
          break;
        case 'es':
          if (phraseToTranslate.includes('hello') || phraseToTranslate.includes('hi')) {
            translation = 'Hola';
            pronunciation = 'OH-lah';
            context = '"Buenos días" (good morning), "Buenas tardes" (good afternoon), and "Buenas noches" (good evening) are also common greetings.';
          } else if (phraseToTranslate.includes('thank you') || phraseToTranslate.includes('thanks')) {
            translation = 'Gracias';
            pronunciation = 'GRAH-see-ahs';
            context = 'For extra politeness, you can say "Muchas gracias" (thank you very much).';
          } else {
            // Generic response for other phrases
            translation = `[${phraseToTranslate} in Spanish]`;
            pronunciation = '[Pronunciation guide]';
            context = 'Spanish is a phonetic language, so words are generally pronounced as they are spelled.';
          }
          break;
        case 'de':
          if (phraseToTranslate.includes('hello') || phraseToTranslate.includes('hi')) {
            translation = 'Hallo';
            pronunciation = 'HAH-loh';
            context = '"Guten Morgen" (good morning), "Guten Tag" (good day), and "Guten Abend" (good evening) are more formal greetings.';
          } else if (phraseToTranslate.includes('thank you') || phraseToTranslate.includes('thanks')) {
            translation = 'Danke';
            pronunciation = 'DAHN-kuh';
            context = 'For extra politeness, you can say "Vielen Dank" (thank you very much).';
          } else {
            // Generic response for other phrases
            translation = `[${phraseToTranslate} in German]`;
            pronunciation = '[Pronunciation guide]';
            context = 'German has some unique sounds like "ö", "ü", and "ä" that might take practice.';
          }
          break;
        default:
          translation = `[${phraseToTranslate} in ${language.name}]`;
          pronunciation = '[Pronunciation guide]';
          context = `This is how you would say it in ${language.name}.`;
      }
      
      return {
        content: translation,
        translation: phraseToTranslate,
        pronunciation,
        context
      };
    }
    
    // For general language questions
    if (lowerInput.includes('common phrases') || lowerInput.includes('useful phrases')) {
      return {
        content: `Here are some useful phrases in ${language.name}:\n\n1. Hello - ${language.code === 'fr' ? 'Bonjour' : language.code === 'es' ? 'Hola' : language.code === 'de' ? 'Hallo' : 'Hello'}\n2. Thank you - ${language.code === 'fr' ? 'Merci' : language.code === 'es' ? 'Gracias' : language.code === 'de' ? 'Danke' : 'Thank you'}\n3. Excuse me - ${language.code === 'fr' ? 'Excusez-moi' : language.code === 'es' ? 'Disculpe' : language.code === 'de' ? 'Entschuldigung' : 'Excuse me'}\n4. Yes/No - ${language.code === 'fr' ? 'Oui/Non' : language.code === 'es' ? 'Sí/No' : language.code === 'de' ? 'Ja/Nein' : 'Yes/No'}\n5. Please - ${language.code === 'fr' ? 'S\'il vous plaît' : language.code === 'es' ? 'Por favor' : language.code === 'de' ? 'Bitte' : 'Please'}`,
        translation: `Here are some useful phrases in ${language.name}:\n\n1. Hello - Hello\n2. Thank you - Thank you\n3. Excuse me - Excuse me\n4. Yes/No - Yes/No\n5. Please - Please`,
        context: `These are essential phrases that will help you communicate during your trip to a ${language.name}-speaking country.`
      };
    }
    
    if (lowerInput.includes('learn') || lowerInput.includes('study') || lowerInput.includes('practice')) {
      return {
        content: `To learn ${language.name}, I recommend starting with basic greetings and common phrases. Practice pronunciation daily and try to use the language in context. Here are some resources:\n\n1. Duolingo - Free language learning app\n2. Memrise - Vocabulary focused learning\n3. ${language.name} podcasts for beginners\n4. Language exchange with native speakers\n\nWould you like me to teach you some basic phrases to get started?`,
        translation: `To learn ${language.name}, I recommend starting with basic greetings and common phrases. Practice pronunciation daily and try to use the language in context. Here are some resources:\n\n1. Duolingo - Free language learning app\n2. Memrise - Vocabulary focused learning\n3. ${language.name} podcasts for beginners\n4. Language exchange with native speakers\n\nWould you like me to teach you some basic phrases to get started?`,
        context: `Learning a new language takes time and consistent practice. Start with small, achievable goals and celebrate your progress.`
      };
    }
    
    // Default response
    return {
      content: `Je peux vous aider à communiquer en ${language.name}. Demandez-moi comment dire quelque chose, et je vous fournirai des traductions et des guides de prononciation.`,
      translation: `I can help you communicate in ${language.name}. Ask me how to say something, and I'll provide translations and pronunciation guides.`,
      context: `Feel free to ask about specific phrases or situations you might encounter during your travels.`
    };
  };

  const updateCommonPhrases = () => {
    // Update common phrases based on selected language
    const phrases: { [key: string]: Phrase[] } = {
      'fr': [
        {
          id: '1',
          text: 'Hello',
          translation: 'Bonjour',
          pronunciation: 'bohn-ZHOOR',
          category: 'Greetings',
          language: 'fr',
          saved: false
        },
        {
          id: '2',
          text: 'Thank you',
          translation: 'Merci',
          pronunciation: 'mehr-SEE',
          category: 'Greetings',
          language: 'fr',
          saved: false
        },
        {
          id: '3',
          text: 'Excuse me',
          translation: 'Excusez-moi',
          pronunciation: 'ex-koo-ZAY-mwah',
          category: 'Greetings',
          language: 'fr',
          saved: false
        },
        {
          id: '4',
          text: 'Where is the bathroom?',
          translation: 'Où sont les toilettes?',
          pronunciation: 'oo sohn lay twa-LET?',
          category: 'Practical',
          language: 'fr',
          saved: false
        },
        {
          id: '5',
          text: 'How much does this cost?',
          translation: 'Combien ça coûte?',
          pronunciation: 'kohm-BYEN sah KOOT?',
          category: 'Shopping',
          language: 'fr',
          saved: false
        },
        {
          id: '6',
          text: 'I would like to order',
          translation: 'Je voudrais commander',
          pronunciation: 'zhuh voo-DRAY kohm-ahn-DAY',
          category: 'Dining',
          language: 'fr',
          saved: false
        },
        {
          id: '7',
          text: 'Do you speak English?',
          translation: 'Parlez-vous anglais?',
          pronunciation: 'par-LAY-voo ahn-GLAY?',
          category: 'Practical',
          language: 'fr',
          saved: false
        },
        {
          id: '8',
          text: 'I don\'t understand',
          translation: 'Je ne comprends pas',
          pronunciation: 'zhuh nuh kohm-PRAHN pah',
          category: 'Practical',
          language: 'fr',
          saved: false
        }
      ],
      'es': [
        {
          id: '1',
          text: 'Hello',
          translation: 'Hola',
          pronunciation: 'OH-lah',
          category: 'Greetings',
          language: 'es',
          saved: false
        },
        {
          id: '2',
          text: 'Thank you',
          translation: 'Gracias',
          pronunciation: 'GRAH-see-ahs',
          category: 'Greetings',
          language: 'es',
          saved: false
        },
        {
          id: '3',
          text: 'Excuse me',
          translation: 'Disculpe',
          pronunciation: 'dees-KOOL-peh',
          category: 'Greetings',
          language: 'es',
          saved: false
        },
        {
          id: '4',
          text: 'Where is the bathroom?',
          translation: '¿Dónde está el baño?',
          pronunciation: 'DOHN-deh es-TAH el BAH-nyoh?',
          category: 'Practical',
          language: 'es',
          saved: false
        },
        {
          id: '5',
          text: 'How much does this cost?',
          translation: '¿Cuánto cuesta esto?',
          pronunciation: 'KWAHN-toh KWES-tah ES-toh?',
          category: 'Shopping',
          language: 'es',
          saved: false
        },
        {
          id: '6',
          text: 'I would like to order',
          translation: 'Me gustaría ordenar',
          pronunciation: 'meh goo-stah-REE-ah or-deh-NAR',
          category: 'Dining',
          language: 'es',
          saved: false
        },
        {
          id: '7',
          text: 'Do you speak English?',
          translation: '¿Habla inglés?',
          pronunciation: 'AH-blah een-GLAYS?',
          category: 'Practical',
          language: 'es',
          saved: false
        },
        {
          id: '8',
          text: 'I don\'t understand',
          translation: 'No entiendo',
          pronunciation: 'noh en-tee-EN-doh',
          category: 'Practical',
          language: 'es',
          saved: false
        }
      ],
      'de': [
        {
          id: '1',
          text: 'Hello',
          translation: 'Hallo',
          pronunciation: 'HAH-loh',
          category: 'Greetings',
          language: 'de',
          saved: false
        },
        {
          id: '2',
          text: 'Thank you',
          translation: 'Danke',
          pronunciation: 'DAHN-kuh',
          category: 'Greetings',
          language: 'de',
          saved: false
        },
        {
          id: '3',
          text: 'Excuse me',
          translation: 'Entschuldigung',
          pronunciation: 'ent-SHOOL-di-goong',
          category: 'Greetings',
          language: 'de',
          saved: false
        },
        {
          id: '4',
          text: 'Where is the bathroom?',
          translation: 'Wo ist die Toilette?',
          pronunciation: 'voh ist dee toy-LET-uh?',
          category: 'Practical',
          language: 'de',
          saved: false
        },
        {
          id: '5',
          text: 'How much does this cost?',
          translation: 'Wie viel kostet das?',
          pronunciation: 'vee feel KOS-tet dahs?',
          category: 'Shopping',
          language: 'de',
          saved: false
        },
        {
          id: '6',
          text: 'I would like to order',
          translation: 'Ich möchte bestellen',
          pronunciation: 'ikh MÖKH-tuh buh-SHTEL-en',
          category: 'Dining',
          language: 'de',
          saved: false
        },
        {
          id: '7',
          text: 'Do you speak English?',
          translation: 'Sprechen Sie Englisch?',
          pronunciation: 'SHPREH-khen zee ENG-lish?',
          category: 'Practical',
          language: 'de',
          saved: false
        },
        {
          id: '8',
          text: 'I don\'t understand',
          translation: 'Ich verstehe nicht',
          pronunciation: 'ikh fer-SHTEY-uh nikht',
          category: 'Practical',
          language: 'de',
          saved: false
        }
      ],
      'it': [
        {
          id: '1',
          text: 'Hello',
          translation: 'Ciao',
          pronunciation: 'CHOW',
          category: 'Greetings',
          language: 'it',
          saved: false
        },
        {
          id: '2',
          text: 'Thank you',
          translation: 'Grazie',
          pronunciation: 'GRAH-tsee-eh',
          category: 'Greetings',
          language: 'it',
          saved: false
        },
        {
          id: '3',
          text: 'Excuse me',
          translation: 'Scusi',
          pronunciation: 'SKOO-zee',
          category: 'Greetings',
          language: 'it',
          saved: false
        },
        {
          id: '4',
          text: 'Where is the bathroom?',
          translation: 'Dov\'è il bagno?',
          pronunciation: 'doh-VEH eel BAH-nyoh?',
          category: 'Practical',
          language: 'it',
          saved: false
        }
      ],
      'ja': [
        {
          id: '1',
          text: 'Hello',
          translation: 'こんにちは',
          pronunciation: 'Kon-ni-chi-wa',
          category: 'Greetings',
          language: 'ja',
          saved: false
        },
        {
          id: '2',
          text: 'Thank you',
          translation: 'ありがとう',
          pronunciation: 'A-ri-ga-tou',
          category: 'Greetings',
          language: 'ja',
          saved: false
        },
        {
          id: '3',
          text: 'Excuse me',
          translation: 'すみません',
          pronunciation: 'Su-mi-ma-sen',
          category: 'Greetings',
          language: 'ja',
          saved: false
        },
        {
          id: '4',
          text: 'Where is the bathroom?',
          translation: 'お手洗いはどこですか？',
          pronunciation: 'O-te-a-rai wa do-ko des-ka?',
          category: 'Practical',
          language: 'ja',
          saved: false
        }
      ]
    };
    
    // Set phrases for the selected language, or default to French if not available
    setCommonPhrases(phrases[selectedLanguage.code] || phrases['fr']);
  };

  const toggleSavePhrase = (phrase: Phrase) => {
    // Toggle saved status
    const updatedPhrase = { ...phrase, saved: !phrase.saved };
    
    // Update common phrases
    setCommonPhrases(commonPhrases.map(p => 
      p.id === phrase.id ? updatedPhrase : p
    ));
    
    // Update saved phrases list
    if (updatedPhrase.saved) {
      setSavedPhrases([...savedPhrases, updatedPhrase]);
    } else {
      setSavedPhrases(savedPhrases.filter(p => p.id !== phrase.id));
    }
  };

  const speakText = (text: string, language: string) => {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = language;
    
    // Events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Speak
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getCategories = () => {
    const categories = new Set<string>();
    commonPhrases.forEach(phrase => categories.add(phrase.category));
    return Array.from(categories);
  };

  const getFilteredPhrases = () => {
    return commonPhrases.filter(phrase => {
      const matchesCategory = !activeCategory || phrase.category === activeCategory;
      const matchesSearch = !searchTerm || 
        phrase.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phrase.translation.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              variants={itemVariants}
              className="inline-block p-4 bg-white rounded-full shadow-lg mb-4"
            >
              <Globe className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Local Language Concierge
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Communicate confidently in any language with AI-powered translations and cultural context
            </motion.p>
          </div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Language Selector */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Select Language</h2>
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`fi fi-${selectedLanguage.flag} w-6 h-6 rounded-sm object-cover`}></span>
                      <div>
                        <p className="font-medium">{selectedLanguage.name}</p>
                        <p className="text-sm text-gray-500">{selectedLanguage.nativeName}</p>
                      </div>
                    </div>
                    {showLanguageSelector ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  <AnimatePresence>
                    {showLanguageSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {availableLanguages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              setSelectedLanguage(language);
                              setShowLanguageSelector(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                          >
                            <span className={`fi fi-${language.flag} w-6 h-6 rounded-sm object-cover`}></span>
                            <div className="text-left">
                              <p className="font-medium">{language.name}</p>
                              <p className="text-sm text-gray-500">{language.nativeName}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Common Phrases */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Common Phrases</h2>
                  <button
                    onClick={() => setShowSavedPhrases(!showSavedPhrases)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    {showSavedPhrases ? 'All Phrases' : 'Saved Phrases'}
                    <Bookmark size={16} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search phrases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      !activeCategory
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    All
                  </button>
                  {getCategories().map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category === activeCategory ? null : category)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        category === activeCategory
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {(showSavedPhrases ? savedPhrases : getFilteredPhrases()).map((phrase) => (
                    <div
                      key={phrase.id}
                      className="p-3 border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium">{phrase.text}</p>
                        <button
                          onClick={() => toggleSavePhrase(phrase)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          {phrase.saved ? (
                            <BookmarkCheck size={16} className="text-blue-600" />
                          ) : (
                            <Bookmark size={16} />
                          )}
                        </button>
                      </div>
                      <p className="text-blue-600 font-medium">{phrase.translation}</p>
                      <p className="text-sm text-gray-500 mt-1">{phrase.pronunciation}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => speakText(phrase.translation, selectedLanguage.code)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Volume2 size={16} />
                        </button>
                        <button
                          onClick={() => setInput(`How do you say "${phrase.text}"?`)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(phrase.translation)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(showSavedPhrases ? savedPhrases : getFilteredPhrases()).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {showSavedPhrases ? (
                        <>
                          <Bookmark className="mx-auto mb-2 text-gray-300" size={24} />
                          <p>No saved phrases yet</p>
                        </>
                      ) : (
                        <>
                          <Search className="mx-auto mb-2 text-gray-300" size={24} />
                          <p>No phrases found</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Chat Header */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={24} />
                      <div>
                        <h2 className="text-xl font-bold">Language Assistant</h2>
                        <p className="text-blue-100">Currently speaking: {selectedLanguage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={stopSpeaking}
                        disabled={!isSpeaking}
                        className={`p-2 rounded-full transition-colors ${
                          isSpeaking
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'text-white/40 cursor-not-allowed'
                        }`}
                      >
                        <VolumeX size={20} />
                      </button>
                      <button
                        onClick={() => {}}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <Zap size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-3 max-w-[80%] ${
                          message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100'
                          }`}>
                            {message.role === 'user' ? <UserIcon size={20} /> : <Globe size={20} />}
                          </div>
                          <div>
                            <div className={`p-4 rounded-xl ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100'
                            }`}>
                              <p className="mb-2">{message.content}</p>
                              {message.translation && message.role === 'assistant' && (
                                <p className="text-sm opacity-70">{message.translation}</p>
                              )}
                              {message.pronunciation && (
                                <p className={`text-sm ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
                                  {message.pronunciation}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs opacity-70 mt-2">
                                <Clock size={12} />
                                <span>{message.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                            
                            {message.role === 'assistant' && (
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => speakText(message.content, selectedLanguage.code)}
                                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                  <Volume2 size={16} />
                                </button>
                                <button
                                  onClick={() => navigator.clipboard.writeText(message.content)}
                                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                  <Copy size={16} />
                                </button>
                                {message.context && (
                                  <button
                                    onClick={() => {
                                      setContextInfo(message.context || null);
                                      setShowContextInfo(true);
                                    }}
                                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                  >
                                    <Lightbulb size={16} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Globe size={20} />
                      </div>
                      <div className="bg-gray-100 p-4 rounded-xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Ask how to say something in ${selectedLanguage.name}...`}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader className="animate-spin" size={20} />
                      ) : (
                        <Send size={20} />
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                <Globe className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">10+ Languages</h3>
              <p className="text-gray-600">
                Communicate confidently in multiple languages with accurate translations and cultural context.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                <Volume2 className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Pronunciation Help</h3>
              <p className="text-gray-600">
                Learn how to say phrases correctly with phonetic guides and audio pronunciations.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                <Lightbulb className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Cultural Context</h3>
              <p className="text-gray-600">
                Understand the cultural nuances behind phrases to communicate more effectively.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Cultural Context Modal */}
      <AnimatePresence>
        {showContextInfo && contextInfo && (
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Cultural Context</h3>
                <button
                  onClick={() => setShowContextInfo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="text-blue-600" size={20} />
                  <h4 className="font-semibold text-blue-800">Language Insight</h4>
                </div>
                <p className="text-blue-700">{contextInfo}</p>
              </div>
              
              <button
                onClick={() => setShowContextInfo(false)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocalLanguageConcierge;