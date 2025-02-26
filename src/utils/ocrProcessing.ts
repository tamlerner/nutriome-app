import { NutritionValues } from '../types';

// Process the OCR results to extract nutrition information
export const processOCRResult = (ocrText: string): NutritionValues | null => {
  // In a real app, this would have a sophisticated algorithm to parse
  // nutrition labels based on recognized text patterns.
  
  try {
    // Extract serving size
    const servingSizeMatch = ocrText.match(/serving size[:\s]+([0-9.]+)\s*([a-z]+)/i);
    const servingSize = servingSizeMatch 
      ? `${servingSizeMatch[1]}${servingSizeMatch[2]}`
      : "100g"; // Default if not found
    
    // Extract calories
    const caloriesMatch = ocrText.match(/calories[:\s]+([0-9]+)/i);
    const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : 0;
    
    // Extract total fat
    const totalFatMatch = ocrText.match(/total fat[:\s]+([0-9.]+)\s*g/i);
    const totalFat = totalFatMatch ? parseFloat(totalFatMatch[1]) : 0;
    
    // Extract saturated fat
    const saturatedFatMatch = ocrText.match(/saturated fat[:\s]+([0-9.]+)\s*g/i);
    const saturatedFat = saturatedFatMatch ? parseFloat(saturatedFatMatch[1]) : 0;
    
    // Extract carbohydrates
    const carbsMatch = ocrText.match(/total carbohydrate[s]?[:\s]+([0-9.]+)\s*g/i);
    const carbohydrates = carbsMatch ? parseFloat(carbsMatch[1]) : 0;
    
    // Extract sugars
    const sugarsMatch = ocrText.match(/sugars[:\s]+([0-9.]+)\s*g/i);
    const sugars = sugarsMatch ? parseFloat(sugarsMatch[1]) : 0;
    
    // Extract added sugars
    const addedSugarsMatch = ocrText.match(/added sugars[:\s]+([0-9.]+)\s*g/i);
    const addedSugars = addedSugarsMatch ? parseFloat(addedSugarsMatch[1]) : 0;
    
    // Extract fiber
    const fiberMatch = ocrText.match(/dietary fiber[:\s]+([0-9.]+)\s*g/i);
    const fiber = fiberMatch ? parseFloat(fiberMatch[1]) : 0;
    
    // Extract protein
    const proteinMatch = ocrText.match(/protein[:\s]+([0-9.]+)\s*g/i);
    const protein = proteinMatch ? parseFloat(proteinMatch[1]) : 0;
    
    // Extract sodium
    const sodiumMatch = ocrText.match(/sodium[:\s]+([0-9]+)\s*mg/i);
    const sodium = sodiumMatch ? parseInt(sodiumMatch[1]) : 0;
    
    // Extract product name (this would require more sophisticated logic in a real app)
    const productName = extractProductName(ocrText);
    
    // Create nutrition values object
    return {
      productName,
      servingSize,
      calories,
      totalFat,
      saturatedFat,
      carbohydrates,
      sugars,
      addedSugars: addedSugars || sugars * 0.7, // Estimate if not explicitly stated
      fiber,
      protein,
      sodium
    };
  } catch (error) {
    console.error("Error processing OCR text:", error);
    return null;
  }
};

// Helper function to extract product name
const extractProductName = (ocrText: string): string => {
  // This is a simplified example - in a real app, this would be more sophisticated
  // Could look for large text at the top of the label, brand names, etc.
  
  // Try to find "Nutrition Facts" and take the text before it
  const parts = ocrText.split(/nutrition facts/i);
  if (parts.length > 1 && parts[0].trim()) {
    // Take the last line before "Nutrition Facts" as the product name
    const lines = parts[0].trim().split('\n');
    return lines[lines.length - 1].trim();
  }
  
  // Fallback: just return "Unknown Product"
  return "Unknown Product";
};