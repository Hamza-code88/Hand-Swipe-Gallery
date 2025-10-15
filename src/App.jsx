// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GestureGallery from './components/GestureGallery';
import CameraView from './components/CameraView';
import HelpOverlay from './components/HelpOverlay';
import GestureIndicator from './components/GestureIndicator';
import TouchFallback from './components/TouchFallback';

// Sample images
const sampleImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    alt: 'Mountain landscape'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    alt: 'Ocean view'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    alt: 'Forest path'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    alt: 'Sunset'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    alt: 'Northern lights'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e',
    alt: 'Lakeside'
  }
];

function App() {
  const [showHelp, setShowHelp] = useState(true);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [useTouchFallback, setUseTouchFallback] = useState(false);
  const [browserSupport, setBrowserSupport] = useState({
    hasWebGL: true,
    hasCamera: true,
    isMobile: false
  });

  // Check browser capabilities on mount
  useEffect(() => {
    const checkCapabilities = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasWebGL = checkWebGLSupport();
      const hasCamera = navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
      
      setBrowserSupport({
        hasWebGL,
        hasCamera,
        isMobile
      });

      // Auto-enable touch fallback on mobile or if WebGL fails
      if (isMobile || !hasWebGL) {
        setUseTouchFallback(true);
      }
    };

    checkCapabilities();
  }, []);

  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };

  const handleGestureDetected = (gesture) => {
    setCurrentGesture(gesture);
    setTimeout(() => setCurrentGesture(null), 1500);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
    if (!useTouchFallback) {
      setIsCameraActive(true);
    }
  };

  const toggleControlMode = () => {
    if (useTouchFallback) {
      setUseTouchFallback(false);
      setIsCameraActive(true);
    } else {
      setUseTouchFallback(true);
      setIsCameraActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gesture Gallery</h1>
            <div className="flex space-x-3">
              <button
                onClick={toggleControlMode}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  useTouchFallback 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                {useTouchFallback ? 'Touch Mode' : 'Camera Mode'}
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Browser Support Warning */}
      {!browserSupport.hasWebGL && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-yellow-700">
              ⚠️ Your browser has limited WebGL support. Using touch fallback mode for better experience.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {useTouchFallback ? (
          <TouchFallback 
            images={sampleImages}
            onGestureDetected={handleGestureDetected}
          />
        ) : (
          <GestureGallery 
            images={sampleImages} 
            onGestureDetected={handleGestureDetected}
            isCameraActive={isCameraActive}
          />
        )}
      </main>

      {/* Camera View */}
      {!useTouchFallback && (
        <CameraView 
          isActive={isCameraActive}
          onGestureDetected={handleGestureDetected}
        />
      )}

      {/* Gesture Indicator */}
      <GestureIndicator gesture={currentGesture} />

      {/* Help Overlay */}
      <AnimatePresence>
        {showHelp && (
          <HelpOverlay 
            onClose={handleCloseHelp} 
            useTouchFallback={useTouchFallback}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;