import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';
import { useProfile } from '../contexts/ProfileContext';
import Layout from './common/Layout';
import { NutritionValues } from '../types';
import { analyzeNutrition } from '../utils/nutritionCalculator';

const ResultsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { profile, getDailyRecommendations } = useProfile();
  const navigate = useNavigate();
  
  // State to store nutrition values and analysis results
  const [scannedValues, setScannedValues] = useState<NutritionValues | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  
  // Load data when component mounts
  useEffect(() => {
    const savedScan = localStorage.getItem('lastScan');
    if (savedScan) {
      const parsedScan = JSON.parse(savedScan);
      setScannedValues(parsedScan);
      
      // Analyze the nutrition data
      const dailyRecommendations = getDailyRecommendations();
      const results = analyzeNutrition(parsedScan, profile, dailyRecommendations);
      setAnalysisResults(results);
    } else {
      // No scan data, redirect to scanner
      navigate('/');
    }
  }, [profile, navigate, getDailyRecommendations]);
  
  // If no data, show loading
  if (!scannedValues || !analysisResults) {
    return (
      <Layout title={t('resultsTitle')}>
        <div className="flex justify-center items-center h-64">
          <p>{t('loading')}</p>
        </div>
      </Layout>
    );
  }
  
  // Styling classes based on theme
  const cardClass = isDarkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow';
  const dividerClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const buttonPrimaryClass = isDarkMode 
    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
    : 'bg-blue-600 hover:bg-blue-700 text-white';
  
  // Render warning label
  const renderWarningLabel = (warning: string) => {
    return (
      <div className="bg-black text-white p-2 rounded-lg m-1">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-black p-2 mb-1">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <span className="text-xs font-bold">{t(warning)}</span>
        </div>
      </div>
    );
  };
  
  // Handle scanning another product
  const handleScanAnother = () => {
    navigate('/');
  };
  
  // Generate personalized recommendation
  const getPersonalizedRecommendation = () => {
    // Check profile characteristics
    const isYoung = profile.age === 'young' || profile.age === 'underAge';
    const isActive = profile.activityLevel === 'active' || profile.activityLevel === 'athletic';
    const isSenior = profile.age === 'older';
    
    // Generate personalized recommendation
    if (analysisResults.recommendations.percentOfDaily.carbs > 30) {
      if (isActive) {
        return `This ${scannedValues.productName} provides ${analysisResults.recommendations.percentOfDaily.carbs.toFixed(0)}% of your daily carbohydrate needs, which is suitable for your active lifestyle.`;
      } else {
        return `This ${scannedValues.productName} provides ${analysisResults.recommendations.percentOfDaily.carbs.toFixed(0)}% of your daily carbohydrate needs. Consider limiting to ${analysisResults.recommendations.servingsToReachCarbLimit} servings daily.`;
      }
    } else if (analysisResults.recommendations.percentOfDaily.sugars > 25) {
      if (isSenior) {
        return `This product is high in added sugars (${analysisResults.recommendations.percentOfDaily.sugars.toFixed(0)}% of your daily limit). For your age profile, consider lower-sugar alternatives.`;
      } else if (isYoung && !isActive) {
        return `This product contains ${analysisResults.recommendations.percentOfDaily.sugars.toFixed(0)}% of your daily added sugar limit, which is relatively high.`;
      } else {
        return `This product contains ${analysisResults.recommendations.percentOfDaily.sugars.toFixed(0)}% of your daily added sugar limit.`;
      }
    } else if (analysisResults.carbFiberRatio > 10) {
      return `This product has a poor carb-to-fiber ratio (${analysisResults.carbFiberRatio.toFixed(1)}:1). Consider pairing with high-fiber foods.`;
    } else {
      if (isActive) {
        return `This product is a good choice for your active lifestyle, providing balanced nutrition.`;
      } else if (isSenior) {
        return `This product is generally appropriate for your nutritional needs.`;
      } else {
        return `This product fits well within your daily nutritional requirements.`;
      }
    }
  };
  
  return (
    <Layout title={t('resultsTitle')}>
      <div className="p-4">
        <div className={`${cardClass} rounded-xl p-4`}>
          {/* Chile-style warning stickers and grade */}
          <div className="flex flex-col items-center mb-6">
            {/* Large grade display */}
            <div 
              className="flex items-center justify-center mb-3 w-20 h-20 rounded-full text-white text-4xl font-bold"
              style={{ backgroundColor: analysisResults.color }}
            >
              {analysisResults.grade}
            </div>
            
            {/* Score meter */}
            <div className="w-full max-w-xs">
              <p className="font-medium text-center mb-1">
                {t('nutritionScore')}: {analysisResults.score.toFixed(0)}/100
              </p>
              <div className="w-full bg-gray-300 h-2.5 rounded-full">
                <div 
                  className="h-2.5 rounded-full"
                  style={{ 
                    width: `${analysisResults.score}%`, 
                    backgroundColor: analysisResults.color 
                  }}
                ></div>
              </div>
            </div>
            
            {/* Warning labels */}
            {analysisResults.warnings.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap justify-center">
                {analysisResults.warnings.map((warning: string, index: number) => (
                  <div key={index}>{renderWarningLabel(warning)}</div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-xl">{scannedValues.productName}</h2>
              <p className="opacity-70">{t('serving')}: {scannedValues.servingSize}</p>
            </div>
          </div>
          
          {/* Nutrition Facts */}
          <div className={`divide-y ${dividerClass}`}>
            <div className="py-2 flex justify-between">
              <span className="font-medium">{t('calories')}</span>
              <span>{scannedValues.calories}</span>
            </div>
            
            <div className="py-2 flex justify-between">
              <span className="font-medium">{t('totalFat')}</span>
              <span>{scannedValues.totalFat}g</span>
            </div>
            
            <div className="py-2 flex justify-between pl-4 opacity-80">
              <span>{t('saturatedFat')}</span>
              <span>{scannedValues.saturatedFat}g</span>
            </div>
            
            <div className="py-2 flex justify-between">
              <span className="font-medium">{t('carbs')}</span>
              <span>{scannedValues.carbohydrates}g</span>
            </div>
            
            <div className="py-2 flex justify-between pl-4 opacity-80">
              <span>{t('sugars')}</span>
              <span>{scannedValues.sugars}g</span>
            </div>
            
            <div className="py-2 flex justify-between pl-4 opacity-80">
              <span>{t('addedSugars')}</span>
              <span>{scannedValues.addedSugars}g</span>
            </div>
            
            <div className="py-2 flex justify-between pl-4 opacity-80">
              <span>{t('fiber')}</span>
              <span>{scannedValues.fiber}g</span>
            </div>
            
            <div className="py-2 flex justify-between">
              <span className="font-medium">{t('protein')}</span>
              <span>{scannedValues.protein}g</span>
            </div>
            
            <div className="py-2 flex justify-between">
              <span className="font-medium">{t('sodium')}</span>
              <span>{scannedValues.sodium}mg</span>
            </div>
          </div>
          
          {/* Analysis and Recommendations */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">{t('analysis')}</h3>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-1">
                  <span>{t('carbFiberRatio')}:</span>
                  <Info size={16} className="opacity-70" />
                </div>
                <span className={analysisResults.carbFiberRatio > 10 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                  {analysisResults.carbFiberRatio.toFixed(1)}:1
                </span>
              </div>
              
              <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-1">
                  <span>{t('sugarPercentage')}:</span>
                  <Info size={16} className="opacity-70" />
                </div>
                <span className={analysisResults.addedSugarPercentage > 25 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                  {analysisResults.addedSugarPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* Personalized Recommendations Section */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} mb-4`}>
              <h4 className="font-bold mb-2">{t('recommendation')}</h4>
              
              {/* Servings recommendation */}
              <div className="mb-3">
                <p className="mb-1">{t('servingsToLimit')}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center rounded-full w-12 h-12 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-200'} font-bold text-xl`}>
                      {analysisResults.recommendations.servingsToReachCarbLimit}
                    </div>
                    <span className="ml-2">{t('servingsLabel')}</span>
                  </div>
                  <span className="text-sm opacity-70">({t('ofDailyCarbs')})</span>
                </div>
              </div>
              
              {/* Daily values percentage */}
              <p className="mb-1">{t('dailyValuePercent')}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('carbs')}</span>
                    <span className={analysisResults.recommendations.percentOfDaily.carbs > 25 ? "text-yellow-500 font-medium" : ""}>
                      {analysisResults.recommendations.percentOfDaily.carbs.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 h-2 rounded-full">
                    <div 
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${Math.min(100, analysisResults.recommendations.percentOfDaily.carbs)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('addedSugars')}</span>
                    <span className={analysisResults.recommendations.percentOfDaily.sugars > 25 ? "text-yellow-500 font-medium" : ""}>
                      {analysisResults.recommendations.percentOfDaily.sugars.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 h-2 rounded-full">
                    <div 
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${Math.min(100, analysisResults.recommendations.percentOfDaily.sugars)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Dynamic recommendation message */}
              <div className={`mt-3 p-2 rounded ${isDarkMode ? 'bg-blue-800' : 'bg-white'} text-sm`}>
                {getPersonalizedRecommendation()}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <button 
              className={`w-full py-3 rounded-lg font-medium ${buttonPrimaryClass}`}
              onClick={handleScanAnother}
            >
              {t('scanAnother')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsScreen;