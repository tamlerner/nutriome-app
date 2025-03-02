import { NutritionValues, UserProfile } from '../types';

interface DailyRecommendations {
  calories: number;
  carbs: number;
  sugars: number;
  protein: number;
  fat: number;
}

interface AnalysisResults {
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

// Get thresholds based on profile
const getThresholds = (profile: UserProfile) => {
  const { gender, age, activityLevel } = profile;
  
  // Complete matrix of thresholds based on all combinations
  // Format: [highSugar, highCarbs, lowFiber, poorCarbFiberRatio]
  const thresholdMatrix = {
    male: {
      underAge: {
        sedentary: [6, 38, 3.5, 8],      // Young males need less sugar, especially if sedentary
        moderate: [8, 43, 3, 9],
        active: [10, 51, 3, 10],
        athletic: [12, 58, 3, 11]        // Athletic youth can tolerate more carbs
      },
      young: {
        sedentary: [8, 40, 3, 8],
        moderate: [10, 45, 3, 9],
        active: [12, 53, 3, 10],
        athletic: [14, 60, 3, 11]
      },
      middle: {
        sedentary: [7, 38, 3, 8],
        moderate: [9, 43, 3, 9],
        active: [11, 51, 3, 10],
        athletic: [13, 58, 3, 10]
      },
      older: {
        sedentary: [5, 35, 3.5, 7],      // Older people need stricter thresholds
        moderate: [7, 40, 3.5, 8],
        active: [9, 48, 3, 8],
        athletic: [11, 55, 3, 9]
      }
    },
    female: {
      underAge: {
        sedentary: [5, 35, 3.5, 8],
        moderate: [7, 40, 3, 9],
        active: [9, 48, 3, 9],
        athletic: [11, 55, 3, 10]
      },
      young: {
        sedentary: [7, 37, 3, 8],
        moderate: [9, 42, 3, 9],
        active: [11, 50, 3, 9],
        athletic: [13, 57, 3, 10]
      },
      middle: {
        sedentary: [6, 35, 3, 8],
        moderate: [8, 40, 3, 9],
        active: [10, 48, 3, 9],
        athletic: [12, 55, 3, 9]
      },
      older: {
        sedentary: [4, 32, 3.5, 6],      // Older women need the strictest thresholds
        moderate: [6, 37, 3.5, 7],
        active: [8, 45, 3, 8],
        athletic: [10, 52, 3, 8]
      }
    }
  };
  
  // Get the specific thresholds for this exact profile combination
  const specificThreshold = thresholdMatrix[gender][age][activityLevel];
  
  // Create the thresholds object
  return {
    highSugar: specificThreshold[0],
    highCarbs: specificThreshold[1],
    lowFiber: specificThreshold[2],
    poorCarbFiberRatio: specificThreshold[3]
  };
};

// Analyze nutrition data
export const analyzeNutrition = (
  values: NutritionValues, 
  profile: UserProfile,
  dailyRecommendations: DailyRecommendations
): AnalysisResults => {
  const thresholds = getThresholds(profile);
  
  // Calculate per 100g values for comparison
  const servingGrams = parseFloat(values.servingSize);
  const factor = 100 / servingGrams;
  const per100g = {
    calories: values.calories * factor,
    carbs: values.carbohydrates * factor,
    sugars: values.sugars * factor,
    addedSugars: values.addedSugars * factor,
    fiber: values.fiber * factor,
    protein: values.protein * factor,
    fat: values.totalFat * factor
  };
  
  // Calculate carb quality metrics
  const carbFiberRatio = per100g.carbs / per100g.fiber;
  const sugarPercentage = (per100g.sugars / per100g.carbs) * 100;
  const addedSugarPercentage = (per100g.addedSugars / per100g.carbs) * 100;
  
  // Generate warnings based on thresholds
  const warnings: string[] = [];
  if (per100g.addedSugars > thresholds.highSugar) {
    warnings.push("warningHighSugar");
  }
  
  if (per100g.carbs > thresholds.highCarbs) {
    warnings.push("warningHighCarbs");
  }
  
  if (per100g.fiber < thresholds.lowFiber) {
    warnings.push("warningLowFiber");
  }
  
  if (carbFiberRatio > thresholds.poorCarbFiberRatio) {
    warnings.push("warningPoorRatio");
  }
  
  // Calculate score (0-100, higher is better)
  let score = 100;
  
  // Penalize for added sugars (major factor)
  score -= Math.min(40, addedSugarPercentage * 2);
  
  // Penalize for poor carb-fiber ratio
  score -= Math.min(30, Math.max(0, carbFiberRatio - 5) * 3);
  
  // Reward for protein content
  score += Math.min(10, per100g.protein);
  
  // Ensure score stays in 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Create letter grade
  let grade = "E";
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";
  
  // Set color based on grade
  let color = "#e74c3c"; // Red (E)
  if (grade === "A") color = "#2ecc71"; // Green
  else if (grade === "B") color = "#27ae60"; // Darker green
  else if (grade === "C") color = "#f39c12"; // Yellow/Orange
  else if (grade === "D") color = "#e67e22"; // Orange
  
  // Calculate percentage of daily recommendations
  const dailyPercentages = {
    calories: (values.calories / dailyRecommendations.calories) * 100,
    carbs: (values.carbohydrates / dailyRecommendations.carbs) * 100,
    sugars: (values.addedSugars / dailyRecommendations.sugars) * 100,
    protein: (values.protein / dailyRecommendations.protein) * 100,
    fat: (values.totalFat / dailyRecommendations.fat) * 100
  };
  
  // Calculate how many servings would reach daily limit for carbs
  const servingsToReachCarbLimit = Math.floor(dailyRecommendations.carbs / values.carbohydrates);
  
  // Calculate how many servings would reach daily limit for sugars
  const servingsToReachSugarLimit = Math.floor(dailyRecommendations.sugars / values.addedSugars);
  
  return {
    score,
    grade,
    color,
    warnings,
    carbFiberRatio,
    sugarPercentage,
    addedSugarPercentage,
    per100g,
    recommendations: {
      servingsToReachCarbLimit,
      servingsToReachSugarLimit,
      dailyValues: dailyRecommendations,
      percentOfDaily: dailyPercentages
    }
  };
};