import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define profile types
export interface UserProfile {
  gender: 'male' | 'female';
  age: 'underAge' | 'young' | 'middle' | 'older';
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'athletic';
}

// Define the context shape
interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updatedProfile: Partial<UserProfile>) => void;
  getDailyRecommendations: () => {
    calories: number;
    carbs: number;
    sugars: number;
    protein: number;
    fat: number;
  };
}

// Create context with default values
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>({
    gender: 'male',
    age: 'young',
    activityLevel: 'moderate'
  });

  // Update profile
  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(current => ({
      ...current,
      ...updatedProfile
    }));
  };

  // Calculate daily recommendations based on profile
  const getDailyRecommendations = () => {
    const { gender, age, activityLevel } = profile;
    
    // Base daily recommended values
    let dailyRecommendations = {
      calories: 2000,
      carbs: 250, // in grams
      sugars: 30, // in grams (added sugars)
      protein: 50, // in grams
      fat: 65, // in grams
    };
    
    // Gender adjustments
    if (gender === 'male') {
      dailyRecommendations.calories += 500;
      dailyRecommendations.carbs += 50;
      dailyRecommendations.sugars += 6;
      dailyRecommendations.protein += 10;
      dailyRecommendations.fat += 10;
    }
    
    // Age adjustments
    if (age === 'underAge') {
      dailyRecommendations.calories -= 200;
      dailyRecommendations.carbs -= 30;
      dailyRecommendations.sugars -= 5;
      dailyRecommendations.protein -= 5;
    } else if (age === 'older') {
      dailyRecommendations.calories -= 200;
      dailyRecommendations.carbs -= 40;
      dailyRecommendations.sugars -= 8;
    } else if (age === 'middle') {
      dailyRecommendations.calories -= 100;
      dailyRecommendations.carbs -= 20;
      dailyRecommendations.sugars -= 3;
    }
    
    // Activity level adjustments
    if (activityLevel === 'sedentary') {
      dailyRecommendations.calories -= 300;
      dailyRecommendations.carbs -= 50;
      dailyRecommendations.sugars -= 5;
    } else if (activityLevel === 'active') {
      dailyRecommendations.calories += 300;
      dailyRecommendations.carbs += 50;
      dailyRecommendations.sugars += 5;
      dailyRecommendations.protein += 15;
    } else if (activityLevel === 'athletic') {
      dailyRecommendations.calories += 600;
      dailyRecommendations.carbs += 100;
      dailyRecommendations.sugars += 10;
      dailyRecommendations.protein += 30;
    }
    
    return dailyRecommendations;
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, getDailyRecommendations }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook for using the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};