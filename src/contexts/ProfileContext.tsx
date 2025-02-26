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
    
    // Base values - these change dramatically based on all combinations
    let baseValues = {
      // Format: [calories, carbs, sugars, protein, fat]
      // For males
      male: {
        underAge: {
          sedentary: [2000, 250, 25, 60, 65],
          moderate: [2300, 280, 30, 70, 75],
          active: [2600, 320, 35, 85, 85],
          athletic: [3000, 380, 40, 100, 90]
        },
        young: {
          sedentary: [2400, 300, 35, 70, 80],
          moderate: [2700, 330, 40, 80, 90],
          active: [3000, 380, 45, 100, 100],
          athletic: [3500, 450, 50, 120, 115]
        },
        middle: {
          sedentary: [2200, 275, 30, 65, 75],
          moderate: [2500, 300, 35, 75, 85],
          active: [2800, 350, 40, 90, 95],
          athletic: [3200, 400, 45, 105, 105]
        },
        older: {
          sedentary: [1900, 240, 20, 65, 65],
          moderate: [2100, 260, 25, 75, 70],
          active: [2400, 300, 30, 85, 80],
          athletic: [2700, 340, 35, 95, 90]
        }
      },
      // For females
      female: {
        underAge: {
          sedentary: [1800, 220, 20, 50, 60],
          moderate: [2000, 250, 25, 60, 65],
          active: [2300, 290, 30, 70, 75],
          athletic: [2600, 330, 35, 85, 85]
        },
        young: {
          sedentary: [1900, 240, 25, 55, 65],
          moderate: [2100, 270, 30, 65, 70],
          active: [2400, 310, 35, 80, 80],
          athletic: [2700, 350, 40, 95, 90]
        },
        middle: {
          sedentary: [1700, 220, 20, 50, 60],
          moderate: [1900, 250, 25, 60, 65],
          active: [2200, 280, 30, 75, 75],
          athletic: [2500, 320, 35, 90, 85]
        },
        older: {
          sedentary: [1600, 200, 15, 50, 55],
          moderate: [1800, 225, 20, 60, 60],
          active: [2000, 250, 25, 70, 70],
          athletic: [2200, 280, 30, 80, 75]
        }
      }
    };
    
    // Get the specific recommendation for this exact combination
    const specificRecommendation = baseValues[gender][age][activityLevel];
    
    // Create the recommendation object
    const dailyRecommendations = {
      calories: specificRecommendation[0],
      carbs: specificRecommendation[1],
      sugars: specificRecommendation[2],
      protein: specificRecommendation[3],
      fat: specificRecommendation[4]
    };
    
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