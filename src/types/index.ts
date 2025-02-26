// User profile types
export interface UserProfile {
    gender: 'male' | 'female';
    age: 'underAge' | 'young' | 'middle' | 'older';
    activityLevel: 'sedentary' | 'moderate' | 'active' | 'athletic';
  }
  
  // Nutrition values from label
  export interface NutritionValues {
    productName: string;
    servingSize: string;
    calories: number;
    totalFat: number;
    saturatedFat: number;
    carbohydrates: number;
    sugars: number;
    addedSugars: number;
    fiber: number;
    protein: number;
    sodium: number;
  }
  
  // Daily recommended values
  export interface DailyRecommendations {
    calories: number;
    carbs: number;
    sugars: number;
    protein: number;
    fat: number;
  }
  
  // Analysis results
  export interface AnalysisResults {
    score: number;
    grade: string;
    color: string;
    warnings: string[];
    carbFiberRatio: number;
    sugarPercentage: number;
    addedSugarPercentage: number;
    per100g: Record<string, number>;
    recommendations: {
      servingsToReachCarbLimit: number;
      servingsToReachSugarLimit: number;
      dailyValues: DailyRecommendations;
      percentOfDaily: Record<string, number>;
    };
  }