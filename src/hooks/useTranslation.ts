import { useState } from 'react';

export const translations = {
  en: {
    scan: 'Scan',
    results: 'Results',
    profile: 'Profile',
    scannerTitle: 'Nutrition Scanner',
    profileTitle: 'Profile Settings',
    personalProfile: 'Personal Profile',
    readyToScan: 'Ready to scan',
    scanButton: 'Scan Label',
    captureButton: 'Capture',
    cancelButton: 'Cancel',
    liveScanningOn: 'Live Scanning On',
    liveScanningOff: 'Live Scanning Off',
    scanningLive: 'Scanning...',
    pointCamera: 'Point camera at nutrition label',
    scanInstructions: 'Position the nutrition facts label within the frame',
    scanningTips: 'Scanning Tips',
    tip1: 'Good lighting',
    tip2: 'Hold steady',
    tip3: 'Align label',
    tip4: 'Clear view',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    ageGroup: 'Age Group',
    underAge: 'Under 18',
    young: 'Young Adult (18-30)',
    middle: 'Middle Age (31-55)',
    older: 'Senior (56+)',
    activityLevel: 'Activity Level',
    sedentary: 'Sedentary',
    moderate: 'Moderate',
    active: 'Active',
    athletic: 'Athletic',
    dailyRecommendations: 'Daily Recommendations',
    currentProfile: 'Current Profile',
    calories: 'Calories',
    carbs: 'Carbohydrates',
    addedSugars: 'Added Sugars',
    protein: 'Protein',
    totalFat: 'Total Fat',
    profileCombinationNote: 'Recommendations are calculated based on your profile combination'
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, setLanguage, language };
}; 