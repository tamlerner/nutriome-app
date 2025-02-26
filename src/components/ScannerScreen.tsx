import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Info } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import Layout from './common/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { NutritionValues } from '../types';
import { processOCRResult } from '../utils/ocrProcessing';

const ScannerScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Camera and scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [processingFrame, setProcessingFrame] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
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
      // In a real app, show error to user
      simulateScan(); // For demo only
    }
  };
  
  // Stop camera
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsScanning(false);
      setIsLiveScanning(false);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
  };
  
  // Process video frames and perform live OCR
  const processVideoFrame = (timestamp: number) => {
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
      
      if (!context) return;
      
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
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = undefined;
    }
  };
  
  // Extract nutrition data from the captured frame
  const extractNutritionData = (canvas: HTMLCanvasElement) => {
    // In a real implementation, we would:
    // 1. Use a proper OCR library like Tesseract.js or a cloud OCR API
    // 2. Process the text to identify nutrition facts pattern
    // 3. Extract the relevant numerical values
    
    // For a more realistic demo, let's simulate the process with a basic implementation:
    
    // Get canvas image data
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // In a real app, we would now pass this imageData to an OCR service
    
    // For demo purposes, we'll simulate finding nutrition data occasionally
    const randomChance = Math.random();
    
    // Simulate detection rate based on frame quality (random in our demo)
    // In a real app, this would depend on actual image clarity
    if (randomChance < 0.2) {
      simulateScan();
    }
  };
  
  // Capture a single frame and process
  const captureImage = () => {
    if (isScanning && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
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
  
  // Simulate OCR result
  const simulateScan = () => {
    // In a real app, this would be the result of OCR processing
    const simulatedValues: NutritionValues = {
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
    
    // Process the results and navigate to the results screen
    processScannedResult(simulatedValues);
  };
  
  // Process scanned result and navigate to results screen
  const processScannedResult = (nutritionValues: NutritionValues) => {
    // Store the result (in a real app, use state management or localStorage)
    localStorage.setItem('lastScan', JSON.stringify(nutritionValues));
    
    // Navigate to results screen
    navigate('/results');
  };
  
  // Setup and cleanup for live processing
  useEffect(() => {
    // When live scanning is toggled, start/stop the processing
    if (isLiveScanning) {
      requestRef.current = requestAnimationFrame(processVideoFrame);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    // Cleanup function
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLiveScanning]);
  
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
        <div className={`w-full ${isDarkMode ? 'bg-black bg-opacity-70' : 'bg-white bg-opacity-70'} p-2 rounded-lg`}>
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
  
  // Button styling
  const buttonPrimaryClass = isDarkMode 
    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
    : 'bg-blue-600 hover:bg-blue-700 text-white';
  const buttonSecondaryClass = isDarkMode 
    ? 'bg-gray-700 hover:bg-gray-800 text-white' 
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
  const cardClass = isDarkMode ? 'bg-gray-800 shadow' : 'bg-white shadow';
  
  return (
    <Layout title={t('scannerTitle')}>
      <div className="p-4">
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
          <div className={`mt-3 p-2 rounded-lg text-xs text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            {processingFrame ? 
              t('scanningLive') : 
              t('pointCamera')}
          </div>
        )}
        
        <p className="text-center text-sm mt-6 opacity-70">
          {t('scanInstructions')}
        </p>
      </div>
    </Layout>
  );
};

export default ScannerScreen;