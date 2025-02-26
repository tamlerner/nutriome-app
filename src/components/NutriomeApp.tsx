import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Sun, Moon, ChevronDown, Info, AlertTriangle, Check } from 'lucide-react';

const NutritionScannerApp = () => {
  // App state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedValues, setScannedValues] = useState(null);
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  // Camera refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  // User profile
  const [userProfile, setUserProfile] = useState({
    gender: 'male',
    age: 'young',
    activityLevel: 'moderate'
  });
  
  // Add OCR guidance overlay
  const renderScanningOverlay = () => {
    return (
      <div className={`absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 ${isLiveScanning ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
        {/* Target area frame */}
        <div className="w-full flex-1 flex flex-col justify-center items-center">
          <div className="border-2 border-dashed border-white rounded-lg w-4/5 h-1/2 flex items-center justify-center">
            <div className="text-white text-center text-sm bg-black bg-opacity-50 p-2 rounded">
              {t('pointCamera')}
            </div>
          </div>
        </div>
        
        {/* Scanning tips */}
        <div className={`w-full ${darkMode ? 'bg-black bg-opacity-70' : 'bg-white bg-opacity-70'} p-2 rounded-lg`}>
          <p className="font-medium mb-1 text-center">{t('scanningTips')}</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span>{t('tip1')}</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span>{t('tip2')}</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span>{t('tip3')}</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span>{t('tip4')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Translations
  const translations = {
    en: {
      appTitle: "Nutriome",
      profile: "Profile",
      scanButton: "Scan Nutrition Label",
      captureButton: "Capture",
      cancelButton: "Cancel",
      scanAnother: "Scan Another Product",
      readyToScan: "Ready to scan",
      scanInstructions: "Point your camera at the nutrition facts label on a food package",
      gender: "Gender",
      male: "Male",
      female: "Female",
      ageGroup: "Age Group",
      underAge: "Under 18",
      young: "Young (18-30)",
      middle: "Middle-aged (31-55)",
      older: "Older (56+)",
      activityLevel: "Activity Level",
      sedentary: "Sedentary",
      moderate: "Moderately Active",
      active: "Very Active",
      athletic: "Athletic",
      calories: "Calories",
      totalFat: "Total Fat",
      saturatedFat: "Saturated Fat",
      carbs: "Total Carbohydrates",
      sugars: "Sugars",
      addedSugars: "Added Sugars",
      fiber: "Fiber",
      protein: "Protein",
      sodium: "Sodium",
      analysis: "Analysis",
      nutritionScore: "Nutrition Score",
      warnings: "Warnings",
      carbFiberRatio: "Carb-to-Fiber Ratio",
      sugarPercentage: "Added Sugars % of Carbs",
      warningHighSugar: "High in added sugars",
      warningHighCarbs: "High in carbohydrates",
      warningLowFiber: "Low in fiber",
      warningPoorRatio: "Poor carbohydrate-to-fiber ratio",
      serving: "Serving",
      recommendation: "Personalized Recommendation",
      servingsToLimit: "Maximum recommended servings per day:",
      dailyValuePercent: "Percent of your daily recommended intake:",
      servingsLabel: "servings",
      ofDailyCarbs: "of daily carbs",
      ofDailySugars: "of daily sugars"
    },
    es: {
      appTitle: "Nutriome",
      profile: "Perfil",
      scanButton: "Escanear Etiqueta Nutricional",
      captureButton: "Capturar",
      cancelButton: "Cancelar",
      scanAnother: "Escanear Otro Producto",
      readyToScan: "Listo para escanear",
      scanInstructions: "Apunte su cámara a la etiqueta de información nutricional",
      gender: "Género",
      male: "Hombre",
      female: "Mujer",
      ageGroup: "Grupo de Edad",
      underAge: "Menor de 18",
      young: "Joven (18-30)",
      middle: "Mediana edad (31-55)",
      older: "Mayor (56+)",
      activityLevel: "Nivel de Actividad",
      sedentary: "Sedentario",
      moderate: "Moderadamente Activo",
      active: "Muy Activo",
      athletic: "Atlético",
      calories: "Calorías",
      totalFat: "Grasa Total",
      saturatedFat: "Grasa Saturada",
      carbs: "Carbohidratos Totales",
      sugars: "Azúcares",
      addedSugars: "Azúcares Añadidos",
      fiber: "Fibra",
      protein: "Proteína",
      sodium: "Sodio",
      analysis: "Análisis",
      nutritionScore: "Puntuación Nutricional",
      warnings: "Advertencias",
      carbFiberRatio: "Relación Carbohidratos-Fibra",
      sugarPercentage: "% de Azúcares Añadidos",
      warningHighSugar: "Alto en azúcares añadidos",
      warningHighCarbs: "Alto en carbohidratos",
      warningLowFiber: "Bajo en fibra",
      warningPoorRatio: "Mala proporción de carbohidratos y fibra",
      serving: "Porción",
      recommendation: "Recomendación Personalizada",
      servingsToLimit: "Porciones máximas recomendadas por día:",
      dailyValuePercent: "Porcentaje de su ingesta diaria recomendada:",
      servingsLabel: "porciones",
      ofDailyCarbs: "de carbohidratos diarios",
      ofDailySugars: "de azúcares diarios"
    },
    fr: {
      appTitle: "Nutriome",
      profile: "Profil",
      scanButton: "Scanner l'Étiquette Nutritionnelle",
      captureButton: "Capturer",
      cancelButton: "Annuler",
      scanAnother: "Scanner un Autre Produit",
      readyToScan: "Prêt à scanner",
      scanInstructions: "Pointez votre caméra vers l'étiquette nutritionnelle",
      gender: "Genre",
      male: "Homme",
      female: "Femme",
      ageGroup: "Groupe d'Âge",
      underAge: "Moins de 18 ans",
      young: "Jeune (18-30)",
      middle: "Âge moyen (31-55)",
      older: "Sénior (56+)",
      activityLevel: "Niveau d'Activité",
      sedentary: "Sédentaire",
      moderate: "Modérément Actif",
      active: "Très Actif",
      athletic: "Athlétique",
      calories: "Calories",
      totalFat: "Matières Grasses",
      saturatedFat: "Graisses Saturées",
      carbs: "Glucides Totaux",
      sugars: "Sucres",
      addedSugars: "Sucres Ajoutés",
      fiber: "Fibres",
      protein: "Protéines",
      sodium: "Sodium",
      analysis: "Analyse",
      nutritionScore: "Score Nutritionnel",
      warnings: "Avertissements",
      carbFiberRatio: "Ratio Glucides-Fibres",
      sugarPercentage: "% de Sucres Ajoutés",
      warningHighSugar: "Élevé en sucres ajoutés",
      warningHighCarbs: "Élevé en glucides",
      warningLowFiber: "Faible en fibres",
      warningPoorRatio: "Mauvais ratio glucides-fibres",
      serving: "Portion",
      recommendation: "Recommandation Personnalisée",
      servingsToLimit: "Portions maximales recommandées par jour:",
      dailyValuePercent: "Pourcentage de votre apport quotidien recommandé:",
      servingsLabel: "portions",
      ofDailyCarbs: "de glucides quotidiens",
      ofDailySugars: "de sucres quotidiens"
    }
  };
  
  // Get translated text
  const t = (key) => translations[language][key] || key;
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  
  // Start camera
  const startScanning = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Simulate scan for demo
      simulateScan();
    }
  };
  
  // Stop camera
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsScanning(false);
    }
  };
  
  // Process video frames and perform live OCR
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [processingFrame, setProcessingFrame] = useState(false);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  // Process frames continuously when live scanning is enabled
  const processVideoFrame = (timestamp) => {
    if (!isLiveScanning || !videoRef.current || !canvasRef.current) {
      return;
    }
    
    // Limit processing to 5 frames per second to avoid performance issues
    if (previousTimeRef.current !== undefined) {
      const deltaTime = timestamp - previousTimeRef.current;
      
      if (deltaTime < 200) { // Only process every 200ms (5 FPS)
        requestRef.current = requestAnimationFrame(processVideoFrame);
        return;
      }
    }
    
    previousTimeRef.current = timestamp;
    
    // Don't process if we're already processing a frame
    if (!processingFrame) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Start OCR processing
      setProcessingFrame(true);
      
      // In a real app, we would:
      // 1. Extract the image data from the canvas
      // 2. Send it to an OCR service (Tesseract.js, Google Vision API, etc.)
      // 3. Process the results
      
      // Simulate OCR processing with a delay
      setTimeout(() => {
        extractNutritionData(canvas);
        setProcessingFrame(false);
      }, 500);
    }
    
    requestRef.current = requestAnimationFrame(processVideoFrame);
  };
  
  // Toggle live scanning mode
  const toggleLiveScanning = () => {
    if (!isLiveScanning) {
      setIsLiveScanning(true);
      requestRef.current = requestAnimationFrame(processVideoFrame);
    } else {
      setIsLiveScanning(false);
      cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
    }
  };
  
  // Extract nutrition data from the captured frame
  const extractNutritionData = (canvas) => {
    // In a real implementation, we would:
    // 1. Use a proper OCR library like Tesseract.js or a cloud OCR API
    // 2. Process the text to identify nutrition facts pattern
    // 3. Extract the relevant numerical values
    
    // For a more realistic demo, let's simulate the process with a basic implementation:
    
    // Get canvas image data
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // In a real app, we would now pass this imageData to an OCR service
    
    // For demo purposes, we'll simulate finding nutrition data occasionally
    const randomChance = Math.random();
    
    // Simulate detection rate based on frame quality (random in our demo)
    // In a real app, this would depend on actual image clarity
    if (randomChance < 0.2) {
      // For an actual implementation, we would extract real values from OCR result
      // For example (pseudocode):
      // 
      // const recognizedText = await tesseract.recognize(imageData);
      // const nutritionValues = extractNutritionValues(recognizedText);
      // 
      // function extractNutritionValues(text) {
      //   const calories = text.match(/calories\s+(\d+)/i)?.[1];
      //   const carbs = text.match(/carbohydrates\s+(\d+)/i)?.[1];
      //   ...and so on
      // }
      
      simulateScan();
    }
  };
  
  // Capture a single frame and process
  const captureImage = () => {
    if (isScanning && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // For demo, simulate results
      simulateScan();
      stopScanning();
    } else {
      simulateScan();
    }
  };
  
  // Simulate OCR scan
  const simulateScan = () => {
    const simulatedValues = {
      productName: "Chocolate Cereal",
      servingSize: "30g",
      calories: 120,
      totalFat: 2.5,
      saturatedFat: 1.2,
      carbohydrates: 22,
      sugars: 8,
      addedSugars: 7,
      fiber: 1.5,
      protein: 3,
      sodium: 180
    };
    
    setScannedValues(simulatedValues);
    analyzeNutrition(simulatedValues);
  };
  
  // Update user profile
  const updateProfile = (field, value) => {
    setUserProfile({
      ...userProfile,
      [field]: value
    });
    
    // Re-analyze with new profile if we have values
    if (scannedValues) {
      analyzeNutrition(scannedValues, { ...userProfile, [field]: value });
    }
  };
  
  // Get thresholds and daily recommendations based on profile
  const getProfileData = (profile) => {
    const { gender, age, activityLevel } = profile;
    
    // Base thresholds for product evaluation (per 100g)
    let thresholds = {
      highSugar: 10,
      highCarbs: 45,
      lowFiber: 3,
      poorCarbFiberRatio: 10
    };
    
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
      thresholds.highSugar += 2;
      thresholds.highCarbs += 5;
      dailyRecommendations.calories += 500;
      dailyRecommendations.carbs += 50;
      dailyRecommendations.sugars += 6;
      dailyRecommendations.protein += 10;
      dailyRecommendations.fat += 10;
    }
    
    // Age adjustments
    if (age === 'underAge') {
      thresholds.highSugar -= 4;
      thresholds.highCarbs -= 2;
      dailyRecommendations.calories -= 200;
      dailyRecommendations.carbs -= 30;
      dailyRecommendations.sugars -= 5;
      dailyRecommendations.protein -= 5;
    } else if (age === 'older') {
      thresholds.highSugar -= 3;
      thresholds.highCarbs -= 5;
      thresholds.poorCarbFiberRatio -= 2;
      dailyRecommendations.calories -= 200;
      dailyRecommendations.carbs -= 40;
      dailyRecommendations.sugars -= 8;
    } else if (age === 'middle') {
      thresholds.highSugar -= 1;
      thresholds.highCarbs -= 2;
      dailyRecommendations.calories -= 100;
      dailyRecommendations.carbs -= 20;
      dailyRecommendations.sugars -= 3;
    }
    
    // Activity level adjustments
    if (activityLevel === 'sedentary') {
      thresholds.highSugar -= 2;
      thresholds.highCarbs -= 5;
      dailyRecommendations.calories -= 300;
      dailyRecommendations.carbs -= 50;
      dailyRecommendations.sugars -= 5;
    } else if (activityLevel === 'moderate') {
      // No change from baseline
    } else if (activityLevel === 'active') {
      thresholds.highSugar += 2;
      thresholds.highCarbs += 8;
      dailyRecommendations.calories += 300;
      dailyRecommendations.carbs += 50;
      dailyRecommendations.sugars += 5;
      dailyRecommendations.protein += 15;
    } else if (activityLevel === 'athletic') {
      thresholds.highSugar += 4;
      thresholds.highCarbs += 15;
      dailyRecommendations.calories += 600;
      dailyRecommendations.carbs += 100;
      dailyRecommendations.sugars += 10;
      dailyRecommendations.protein += 30;
    }
    
    return { thresholds, dailyRecommendations };
  };
  
  // Analyze nutrition data
  const analyzeNutrition = (values, profile = userProfile) => {
    const { thresholds, dailyRecommendations } = getProfileData(profile);
    
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
    const warnings = [];
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
    
    // Generate personalized recommendations
    const recommendations = {
      servingsToReachCarbLimit,
      servingsToReachSugarLimit,
      dailyValues: dailyRecommendations,
      percentOfDaily: dailyPercentages
    };
    
    // Store analysis results
    setAnalysisResults({
      score,
      grade,
      color,
      warnings,
      carbFiberRatio,
      sugarPercentage,
      addedSugarPercentage,
      per100g,
      recommendations
    });
  };
  
  // Reset app
  const resetApp = () => {
    setScannedValues(null);
    setAnalysisResults(null);
  };
  
  // Prepare warning label for Chile-style display
  const renderWarningLabel = (warning) => {
    const icons = {
      warningHighSugar: (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-black p-2 mb-1">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <span className="text-xs font-bold">{t(warning)}</span>
        </div>
      ),
      warningHighCarbs: (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-black p-2 mb-1">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <span className="text-xs font-bold">{t(warning)}</span>
        </div>
      ),
      warningLowFiber: (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-black p-2 mb-1">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <span className="text-xs font-bold">{t(warning)}</span>
        </div>
      ),
      warningPoorRatio: (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-black p-2 mb-1">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <span className="text-xs font-bold">{t(warning)}</span>
        </div>
      )
    };
    
    return icons[warning];
  };
  
  // Determine theme-based classes
  const themeClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800';
  const cardClass = darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow';
  const buttonPrimaryClass = darkMode 
    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
    : 'bg-blue-600 hover:bg-blue-700 text-white';
  const buttonSecondaryClass = darkMode 
    ? 'bg-gray-700 hover:bg-gray-800 text-white' 
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
  const inputClass = darkMode
    ? 'bg-gray-700 border-gray-600 text-white'
    : 'bg-white border-gray-300 text-gray-800';
  const dividerClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className={`flex flex-col h-full max-w-md mx-auto p-4 ${themeClass} transition-colors duration-200`}>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('appTitle')}</h1>
        
        <div className="flex gap-3">
          <div className="flex rounded-lg p-1 bg-opacity-20 border">
            <button 
              className={`px-2 py-1 rounded ${language === 'en' ? 'bg-opacity-70 bg-blue-500 text-white' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`px-2 py-1 rounded ${language === 'es' ? 'bg-opacity-70 bg-blue-500 text-white' : ''}`}
              onClick={() => changeLanguage('es')}
            >
              ES
            </button>
            <button 
              className={`px-2 py-1 rounded ${language === 'fr' ? 'bg-opacity-70 bg-blue-500 text-white' : ''}`}
              onClick={() => changeLanguage('fr')}
            >
              FR
            </button>
          </div>
          
          <button 
            className="p-2 rounded-full"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-full ${cardClass}`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User size={16} />
              <span>{t('profile')}</span>
              <ChevronDown size={16} />
            </button>
            
            {isProfileOpen && (
              <div className={`absolute right-0 mt-2 w-64 ${cardClass} rounded-lg p-3 z-10`}>
                <h3 className="font-medium mb-2">{t('profile')}</h3>
                
                <div className="mb-2">
                  <label className="block text-sm mb-1">{t('gender')}</label>
                  <select 
                    className={`w-full p-2 border rounded ${inputClass}`}
                    value={userProfile.gender}
                    onChange={(e) => updateProfile('gender', e.target.value)}
                  >
                    <option value="male">{t('male')}</option>
                    <option value="female">{t('female')}</option>
                  </select>
                </div>
                
                <div className="mb-2">
                  <label className="block text-sm mb-1">{t('ageGroup')}</label>
                  <select 
                    className={`w-full p-2 border rounded ${inputClass}`}
                    value={userProfile.age}
                    onChange={(e) => updateProfile('age', e.target.value)}
                  >
                    <option value="underAge">{t('underAge')}</option>
                    <option value="young">{t('young')}</option>
                    <option value="middle">{t('middle')}</option>
                    <option value="older">{t('older')}</option>
                  </select>
                </div>
                
                <div className="mb-2">
                  <label className="block text-sm mb-1">{t('activityLevel')}</label>
                  <select 
                    className={`w-full p-2 border rounded ${inputClass}`}
                    value={userProfile.activityLevel}
                    onChange={(e) => updateProfile('activityLevel', e.target.value)}
                  >
                    <option value="sedentary">{t('sedentary')}</option>
                    <option value="moderate">{t('moderate')}</option>
                    <option value="active">{t('active')}</option>
                    <option value="athletic">{t('athletic')}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {!scannedValues ? (
          <div className="flex flex-col items-center">
            <div className={`w-full h-64 ${cardClass} rounded-xl flex items-center justify-center mb-4 overflow-hidden relative`}>
              {isScanning ? (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {renderScanningOverlay()}
                  {processingFrame && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-1 rounded flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      {t('scanningLive')}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Camera size={48} />
                  <p className="mt-2">{t('readyToScan')}</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex gap-3 flex-wrap justify-center">
              {isScanning ? (
                <>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium ${buttonPrimaryClass}`}
                    onClick={captureImage}
                  >
                    {t('captureButton')}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium ${isLiveScanning ? 'bg-green-600 hover:bg-green-700 text-white' : buttonSecondaryClass}`}
                    onClick={toggleLiveScanning}
                  >
                    {isLiveScanning ? t('liveScanningOn') : t('liveScanningOff')}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium ${buttonSecondaryClass}`}
                    onClick={stopScanning}
                  >
                    {t('cancelButton')}
                  </button>
                </>
              ) : (
                <button 
                  className={`px-6 py-3 rounded-lg font-medium ${buttonPrimaryClass}`}
                  onClick={startScanning}
                >
                  {t('scanButton')}
                </button>
              )}
            </div>
            
            {isLiveScanning && (
              <div className={`mt-3 p-2 rounded-lg text-xs text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                {processingFrame ? 
                  t('scanningLive') : 
                  t('pointCamera')}
              </div>
            )}
            
            <p className="text-center text-sm mt-6 opacity-70">
              {t('scanInstructions')}
            </p>
          </div>
        ) : (
          <div className={`${cardClass} rounded-xl p-4`}>
            {analysisResults && (
              <>
                {/* Chile-style warning stickers */}
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
                      {analysisResults.warnings.map((warning, index) => (
                        <div 
                          key={index} 
                          className="bg-black text-white p-2 rounded-lg m-1"
                        >
                          {renderWarningLabel(warning)}
                        </div>
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
              </>
            )}
            
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
            
            {analysisResults && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">{t('analysis')}</h3>
                
                <div className="flex flex-col gap-2 mb-4">
                  <div className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-1">
                      <span>{t('carbFiberRatio')}:</span>
                      <Info size={16} className="opacity-70" />
                    </div>
                    <span className={analysisResults.carbFiberRatio > 10 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                      {analysisResults.carbFiberRatio.toFixed(1)}:1
                    </span>
                  </div>
                  
                  <div className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} mb-4`}>
                  <h4 className="font-bold mb-2">{t('recommendation')}</h4>
                  
                  {/* Servings recommendation */}
                  <div className="mb-3">
                    <p className="mb-1">{t('servingsToLimit')}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center rounded-full w-12 h-12 ${darkMode ? 'bg-blue-800' : 'bg-blue-200'} font-bold text-xl`}>
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
                  <div className="mt-3 p-2 rounded ${darkMode ? 'bg-blue-800' : 'bg-white'} text-sm">
                    {(() => {
                      // Check profile characteristics
                      const isYoung = userProfile.age === 'young' || userProfile.age === 'underAge';
                      const isActive = userProfile.activityLevel === 'active' || userProfile.activityLevel === 'athletic';
                      const isSenior = userProfile.age === 'older';
                      
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
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            <button 
              className={`w-full mt-6 px-4 py-3 rounded-lg font-medium ${buttonPrimaryClass}`}
              onClick={resetApp}
            >
              {t('scanAnother')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NutritionScannerApp;