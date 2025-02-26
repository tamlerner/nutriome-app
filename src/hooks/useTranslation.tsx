import { useTheme } from '../contexts/ThemeContext';
import translations from '../utils/translations';

interface UseTranslationReturn {
  t: (key: string) => string;
  currentLanguage: string;
}

export const useTranslation = (): UseTranslationReturn => {
  const { language } = useTheme();
  
  // Translate a key
  const t = (key: string): string => {
    // Get the translations for the current language
    const currentTranslations = translations[language];
    
    // Return the translation or the key if not found
    return currentTranslations[key] || key;
  };
  
  return {
    t,
    currentLanguage: language
  };
};