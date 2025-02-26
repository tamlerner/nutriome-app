import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Camera, User, BarChart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../contexts/ThemeContext';

const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  
  const navClass = isDarkMode 
    ? 'bg-gray-900 text-gray-100 border-t border-gray-800' 
    : 'bg-white text-gray-800 border-t border-gray-200 shadow-lg';
  
  const activeClass = isDarkMode
    ? 'text-blue-400'
    : 'text-blue-600';
    
  const inactiveClass = isDarkMode
    ? 'text-gray-400'
    : 'text-gray-500';
  
  return (
    <nav className={`${navClass} py-2 px-4`}>
      <div className="flex justify-around items-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Camera size={24} />
          <span className="text-xs mt-1">{t('scan')}</span>
        </NavLink>
        
        <NavLink 
          to="/results" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? activeClass : inactiveClass}`
          }
        >
          <BarChart size={24} />
          <span className="text-xs mt-1">{t('results')}</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? activeClass : inactiveClass}`
          }
        >
          <User size={24} />
          <span className="text-xs mt-1">{t('profile')}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;