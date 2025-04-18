import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import 'flag-icons/css/flag-icons.min.css';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'sidebar' | 'minimal';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'dropdown',
  className = ''
}) => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguageData = supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const renderDropdown = () => (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={`fi fi-${currentLanguageData.flag} w-5 h-5 rounded-sm object-cover`}></span>
        <span className="hidden sm:inline">{currentLanguageData.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="py-1">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`fi fi-${language.flag} w-5 h-5 rounded-sm object-cover`}></span>
                    <span>{language.name}</span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check size={16} className="text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderSidebar = () => (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Globe size={18} />
        <span>Language</span>
      </h3>
      <div className="space-y-1">
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-colors ${
              currentLanguage === language.code
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className={`fi fi-${language.flag} w-5 h-5 rounded-sm object-cover`}></span>
            <span>{language.name}</span>
            {currentLanguage === language.code && (
              <Check size={16} className="ml-auto text-blue-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className={`flex items-center gap-1 ${className}`}>
      <Globe size={16} className="text-gray-500" />
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-transparent border-none focus:outline-none text-sm"
      >
        {supportedLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );

  switch (variant) {
    case 'sidebar':
      return renderSidebar();
    case 'minimal':
      return renderMinimal();
    case 'dropdown':
    default:
      return renderDropdown();
  }
};

export default LanguageSwitcher;