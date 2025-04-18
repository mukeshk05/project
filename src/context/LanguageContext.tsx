import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OpenAI } from 'openai';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  supportedLanguages: { code: string; name: string; flag: string }[];
  translateText: (text: string, targetLang?: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: 'gb' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'ja', name: '日本語', flag: 'jp' },
  { code: 'zh', name: '中文', flag: 'cn' }
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [openai, setOpenai] = useState<OpenAI | null>(null);

  useEffect(() => {
    // Initialize OpenAI client if API key is available
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      setOpenai(new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Note: In production, API calls should be proxied through a backend
      }));
    }
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const translateText = async (text: string, targetLang?: string): Promise<string> => {
    if (!text) return '';
    
    const language = targetLang || i18n.language;
    
    // If language is English or OpenAI is not available, return original text
    if (language === 'en' || !openai) {
      return text;
    }
    
    setIsTranslating(true);
    
    try {
      // For development/demo purposes, we'll use a mock translation
      // In production, you would use the OpenAI API
      const mockTranslations: Record<string, Record<string, string>> = {
        'Hello, how can I help you plan your trip?': {
          es: '¡Hola! ¿Cómo puedo ayudarte a planificar tu viaje?',
          fr: 'Bonjour, comment puis-je vous aider à planifier votre voyage ?',
          de: 'Hallo, wie kann ich Ihnen bei der Planung Ihrer Reise helfen?',
          ja: 'こんにちは、旅行の計画をお手伝いできますか？',
          zh: '你好，我能帮你规划旅行吗？'
        },
        'Where would you like to go?': {
          es: '¿A dónde te gustaría ir?',
          fr: 'Où aimeriez-vous aller ?',
          de: 'Wohin möchten Sie reisen?',
          ja: 'どこに行きたいですか？',
          zh: '你想去哪里？'
        }
      };
      
      // Check if we have a mock translation
      if (mockTranslations[text] && mockTranslations[text][language]) {
        return mockTranslations[text][language];
      }
      
      // If we have OpenAI configured, use it for translation
      if (openai) {
        const response = await openai.chat.completions.create({
          model: "gpt-4.5-preview-2025-02-27",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the following text to ${language}. Preserve formatting and maintain the original meaning. Only return the translated text, nothing else.`
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        });
        
        return response.choices[0].message.content || text;
      }
      
      // Fallback to original text
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: i18n.language,
        changeLanguage,
        supportedLanguages,
        translateText,
        isTranslating
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};