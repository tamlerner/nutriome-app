import React from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useTranslation } from '../hooks/useTranslation';
import Layout from './common/Layout';

const ProfileScreen: React.FC = () => {
  const { profile, updateProfile, getDailyRecommendations } = useProfile();
  const { t } = useTranslation();
  
  // Get daily recommendations based on current profile
  const recommendations = getDailyRecommendations();
  
  return (
    <Layout title={t('profileTitle')}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{t('personalProfile')}</h2>
        
        <div className="space-y-4 mb-6">
          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('gender')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`py-2 px-4 rounded-lg border ${
                  profile.gender === 'male' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ gender: 'male' })}
              >
                {t('male')}
              </button>
              <button
                className={`py-2 px-4 rounded-lg border ${
                  profile.gender === 'female' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ gender: 'female' })}
              >
                {t('female')}
              </button>
            </div>
          </div>
          
          {/* Age Group Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('ageGroup')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`py-2 px-4 rounded-lg border ${
                  profile.age === 'underAge' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ age: 'underAge' })}
              >
                {t('underAge')}
              </button>
              <button
                className={`py-2 px-4 rounded-lg border ${
                  profile.age === 'young' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ age: 'young' })}
              >
                {t('young')}
              </button>
              <button
                className={`py-2 px-4 rounded-lg border ${
                  profile.age === 'middle' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ age: 'middle' })}
              >
                {t('middle')}
              </button>
              <button
                className={`py-2 px-4 rounded-lg border ${
                  profile.age === 'older' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ age: 'older' })}
              >
                {t('older')}
              </button>
            </div>
          </div>
          
          {/* Activity Level Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('activityLevel')}</label>
            <div className="space-y-2">
              <button
                className={`w-full py-2 px-4 rounded-lg border ${
                  profile.activityLevel === 'sedentary' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ activityLevel: 'sedentary' })}
              >
                {t('sedentary')}
              </button>
              <button
                className={`w-full py-2 px-4 rounded-lg border ${
                  profile.activityLevel === 'moderate' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ activityLevel: 'moderate' })}
              >
                {t('moderate')}
              </button>
              <button
                className={`w-full py-2 px-4 rounded-lg border ${
                  profile.activityLevel === 'active' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ activityLevel: 'active' })}
              >
                {t('active')}
              </button>
              <button
                className={`w-full py-2 px-4 rounded-lg border ${
                  profile.activityLevel === 'athletic' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => updateProfile({ activityLevel: 'athletic' })}
              >
                {t('athletic')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Daily Recommendations Based on Profile */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">{t('dailyRecommendations')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t('calories')}:</span>
              <span className="font-medium">{recommendations.calories} kcal</span>
            </div>
            <div className="flex justify-between">
              <span>{t('carbs')}:</span>
              <span className="font-medium">{recommendations.carbs}g</span>
            </div>
            <div className="flex justify-between">
              <span>{t('addedSugars')}:</span>
              <span className="font-medium">{recommendations.sugars}g</span>
            </div>
            <div className="flex justify-between">
              <span>{t('protein')}:</span>
              <span className="font-medium">{recommendations.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span>{t('totalFat')}:</span>
              <span className="font-medium">{recommendations.fat}g</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileScreen;