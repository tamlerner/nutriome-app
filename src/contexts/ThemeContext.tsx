import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define theme context type
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'en' | 'es' | 'fr';
  changeLanguage: (lang: 'en' | 'es' | 'fr') => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available, otherwise use defaults
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>(() => {
    const saved = localStorage.getItem('language');
    // Default to browser language if available and supported
    if (!saved) {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'es' || browserLang === 'fr') {
        return browserLang as 'es' | 'fr';
      }
      return 'en';
    }
    return saved as 'en' | 'es' | 'fr';
  });
  
  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  
  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Change language
  const changeLanguage = (lang: 'en' | 'es' | 'fr') => {
    setLanguage(lang);
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, language, changeLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};