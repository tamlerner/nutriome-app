import { useState } from 'react';

const translations = {
  en: {
    scan: 'Scan',
    results: 'Results',
    profile: 'Profile',
    scannerTitle: 'Nutrition Scanner',
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
    tip4: 'Clear view'
  }
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, setLanguage, language };
}; 