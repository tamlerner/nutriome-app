import React, { ReactNode } from 'react';
import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { isDarkMode, toggleDarkMode, language, changeLanguage } = useTheme();
  const { t } = useTranslation();
  
  // Dynamic classes based on theme
  const headerClass = isDarkMode 
    ? 'bg-gray-900 text-white border-b border-gray-800' 
    : 'bg-white text-gray-800 border-b border-gray-200 shadow-sm';
  
  const bodyClass = isDarkMode
    ? 'bg-gray-800 text-gray-100'
    : 'bg-gray-50 text-gray-800';
  
  return (
    <div className={`min-h-full flex flex-col ${bodyClass}`}>
      {/* Header */}
      <header className={`${headerClass} px-4 py-3 flex justify-between items-center`}>
        <h1 className="text-xl font-bold">{title}</h1>
        
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20">
              <Globe size={20} />
            </button>
            
            <div className="absolute right-0 mt-2 py-2 w-24 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20 hidden group-hover:block">
              <button 
                className={`block px-4 py-2 text-sm w-full text-left ${language === 'en' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                English
              </button>
              <button 
                className={`block px-4 py-2 text-sm w-full text-left ${language === 'es' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                onClick={() => changeLanguage('es')}
              >
                Español
              </button>
              <button 
                className={`block px-4 py-2 text-sm w-full text-left ${language === 'fr' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                onClick={() => changeLanguage('fr')}
              >
                Français
              </button>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <button 
            className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;