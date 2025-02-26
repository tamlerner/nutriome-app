import React, { useMemo } from 'react';
import { Leaf, Apple } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../contexts/ThemeContext';

interface SeasonalProduceProps {
  showTitle?: boolean;
}

// Define seasonal produce data by month
const SEASONAL_PRODUCE = {
  1: { // January
    fruits: ['Apples', 'Pears', 'Kiwis', 'Lemons', 'Oranges', 'Clementines'],
    vegetables: ['Carrots', 'Leeks', 'Endives', 'Cabbages', 'Beetroots', 'Pumpkins', 'Turnips', 'Potatoes']
  },
  2: { // February
    fruits: ['Apples', 'Pears', 'Kiwis', 'Lemons', 'Oranges'],
    vegetables: ['Carrots', 'Leeks', 'Endives', 'Cabbages', 'Beetroots', 'Pumpkins', 'Turnips', 'Potatoes']
  },
  3: { // March
    fruits: ['Apples', 'Pears', 'Kiwis', 'Lemons'],
    vegetables: ['Carrots', 'Leeks', 'Endives', 'Cabbages', 'Beetroots', 'Spinach', 'Radishes', 'Asparagus']
  },
  4: { // April
    fruits: ['Apples', 'Kiwis'],
    vegetables: ['Asparagus', 'Spinach', 'Radishes', 'Lettuce', 'Peas', 'Carrots', 'Leeks']
  },
  5: { // May
    fruits: ['Strawberries', 'Rhubarb'],
    vegetables: ['Asparagus', 'Spinach', 'Radishes', 'Lettuce', 'Peas', 'Carrots', 'Fennel', 'Artichokes']
  },
  6: { // June
    fruits: ['Cherries', 'Strawberries', 'Raspberries', 'Melons'],
    vegetables: ['Zucchini', 'Tomatoes', 'Cucumbers', 'Peppers', 'Eggplants', 'Green Beans', 'Lettuce']
  },
  7: { // July
    fruits: ['Peaches', 'Apricots', 'Raspberries', 'Melons', 'Plums'],
    vegetables: ['Zucchini', 'Tomatoes', 'Cucumbers', 'Peppers', 'Eggplants', 'Green Beans', 'Lettuce']
  },
  8: { // August
    fruits: ['Peaches', 'Nectarines', 'Plums', 'Grapes', 'Figs'],
    vegetables: ['Zucchini', 'Tomatoes', 'Cucumbers', 'Peppers', 'Eggplants', 'Green Beans', 'Lettuce']
  },
  9: { // September
    fruits: ['Grapes', 'Figs', 'Apples', 'Pears'],
    vegetables: ['Zucchini', 'Tomatoes', 'Peppers', 'Eggplants', 'Pumpkins', 'Mushrooms']
  },
  10: { // October
    fruits: ['Apples', 'Pears', 'Grapes', 'Kiwis'],
    vegetables: ['Pumpkins', 'Mushrooms', 'Cabbages', 'Leeks', 'Carrots', 'Potatoes']
  },
  11: { // November
    fruits: ['Apples', 'Pears', 'Kiwis'],
    vegetables: ['Cabbages', 'Leeks', 'Carrots', 'Potatoes', 'Endives', 'Pumpkins']
  },
  12: { // December
    fruits: ['Apples', 'Pears', 'Kiwis', 'Clementines', 'Oranges'],
    vegetables: ['Cabbages', 'Leeks', 'Carrots', 'Potatoes', 'Endives', 'Pumpkins']
  }
};

const SeasonalProduce: React.FC<SeasonalProduceProps> = ({ showTitle = true }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // Get current month (1-12)
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);
  
  // Get seasonal produce for current month
  const seasonalProduce = SEASONAL_PRODUCE[currentMonth as keyof typeof SEASONAL_PRODUCE];
  
  // Get month name
  const monthName = useMemo(() => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  }, []);
  
  // Get season name
  const getSeason = useMemo(() => {
    // Northern hemisphere seasons
    if ([12, 1, 2].includes(currentMonth)) return t('winter');
    if ([3, 4, 5].includes(currentMonth)) return t('spring');
    if ([6, 7, 8].includes(currentMonth)) return t('summer');
    return t('autumn');
  }, [currentMonth, t]);
  
  // Card styles based on theme
  const cardClass = isDarkMode 
    ? 'bg-gray-800 border border-gray-700' 
    : 'bg-white border border-gray-200';
  
  // Section styles based on theme
  const sectionClass = isDarkMode
    ? 'bg-gray-700'
    : 'bg-gray-50';
  
  // Get seasonal color based on current season
  const seasonalColor = useMemo(() => {
    switch (getSeason) {
      case t('winter'): return 'bg-blue-100 text-blue-800';
      case t('spring'): return 'bg-green-100 text-green-800';
      case t('summer'): return 'bg-yellow-100 text-yellow-800';
      case t('autumn'): return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [getSeason, t]);
  
  return (
    <div className={`rounded-lg ${cardClass} overflow-hidden`}>
      {showTitle && (
        <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold">{t('seasonalProduce')}</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${seasonalColor}`}>
              {getSeason}
            </span>
          </div>
          <p className="text-sm opacity-70 mt-1">{t('inSeason')} {monthName}</p>
        </div>
      )}
      
      <div className="p-3">
        {/* Fruits section */}
        <div className={`rounded-lg ${sectionClass} p-2 mb-3`}>
          <div className="flex items-center mb-2">
            <Apple size={18} className="mr-2 text-red-500" />
            <h3 className="font-medium">{t('fruits')}</h3>
          </div>
          <div className="flex flex-wrap gap-1">
            {seasonalProduce.fruits.map((fruit) => (
              <span 
                key={fruit}
                className={`text-xs px-2 py-1 rounded-full 
                  ${isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}
              >
                {fruit}
              </span>
            ))}
          </div>
        </div>
        
        {/* Vegetables section */}
        <div className={`rounded-lg ${sectionClass} p-2`}>
          <div className="flex items-center mb-2">
            <Leaf size={18} className="mr-2 text-green-500" />
            <h3 className="font-medium">{t('vegetables')}</h3>
          </div>
          <div className="flex flex-wrap gap-1">
            {seasonalProduce.vegetables.map((vegetable) => (
              <span 
                key={vegetable}
                className={`text-xs px-2 py-1 rounded-full 
                  ${isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'}`}
              >
                {vegetable}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalProduce;