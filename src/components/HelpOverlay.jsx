// src/components/HelpOverlay.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Hand, ZoomIn, Move, Cpu, AlertTriangle } from 'lucide-react';

const HelpOverlay = ({ onClose, useTouchFallback }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Gesture Controls Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Introduction */}
          <div className="text-center">
            <Hand size={48} className="mx-auto text-blue-600 mb-4" />
            <p className="text-lg text-gray-700 mb-2">
              Control the image gallery using {useTouchFallback ? 'touch gestures' : 'hand gestures detected by your camera'}
            </p>
            <p className="text-sm text-gray-500">
              Works completely offline - no internet required after initial setup
            </p>
          </div>

          {/* Mode Indicator */}
          <div className={`text-center p-4 rounded-lg ${
            useTouchFallback ? 'bg-green-100 border border-green-300' : 'bg-blue-100 border border-blue-300'
          }`}>
            <h3 className="text-lg font-semibold mb-2">
              Current Mode: {useTouchFallback ? '📱 Touch Controls' : '📷 Camera Gestures'}
            </h3>
            <p className="text-sm opacity-75">
              You can switch modes using the toggle button in the header
            </p>
          </div>

          {/* Show appropriate instructions based on mode */}
          {useTouchFallback ? (
            // Touch Mode Instructions
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">←→</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Swipe to Navigate</h3>
                <p className="text-green-700">Swipe left/right on images to navigate between them</p>
                <div className="mt-3 text-sm text-green-600">
                  <strong>Tip:</strong> Swipe horizontally when viewing fullscreen images
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">↔</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Pinch to Zoom</h3>
                <p className="text-green-700">Use two fingers to pinch and zoom in/out on images</p>
                <div className="mt-3 text-sm text-green-600">
                  <strong>Tip:</strong> Spread fingers to zoom in, pinch to zoom out
                </div>
              </div>
            </div>
          ) : (
            // Camera Mode Instructions
            <div className="grid md:grid-cols-2 gap-6">
              {/* Swipe Gesture */}
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex justify-center mb-4">
                  <motion.div
                    className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white"
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Move size={32} />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2 text-center">Swipe Navigation</h3>
                <p className="text-blue-700 text-center">
                  Swipe your hand <strong>left or right</strong> to navigate between images
                </p>
                <div className="mt-3 text-sm text-blue-600 text-center">
                  <strong>Tip:</strong> Make smooth, deliberate movements
                </div>
              </div>

              {/* Pinch Gesture */}
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex justify-center space-x-1 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white"
                    animate={{ scale: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ZoomIn size={24} />
                  </motion.div>
                  <motion.div
                    className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white"
                    animate={{ scale: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ZoomIn size={24} />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2 text-center">Pinch to Zoom</h3>
                <p className="text-purple-700 text-center">
                  <strong>Pinch in</strong> to zoom out, <strong>pinch out</strong> to zoom in
                </p>
                <div className="mt-3 text-sm text-purple-600 text-center">
                  <strong>Tip:</strong> Use thumb and index finger
                </div>
              </div>
            </div>
          )}

          {/* Requirements & Troubleshooting */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Requirements */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                <Cpu size={20} className="mr-2" />
                System Requirements
              </h3>
              <ul className="text-green-800 space-y-2 text-sm">
                {useTouchFallback ? (
                  <>
                    <li>• Touch-enabled device (phone, tablet, touchscreen)</li>
                    <li>• Modern browser with touch support</li>
                    <li>• No additional hardware required</li>
                    <li>• Works on all devices with touch input</li>
                  </>
                ) : (
                  <>
                    <li>• Modern browser (Chrome, Firefox, Edge)</li>
                    <li>• WebGL support (hardware acceleration)</li>
                    <li>• Camera with 480p+ resolution</li>
                    <li>• Good lighting conditions</li>
                    <li>• Stable hand positions</li>
                  </>
                )}
              </ul>
            </div>

            {/* Troubleshooting */}
            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                Troubleshooting
              </h3>
              <ul className="text-yellow-800 space-y-2 text-sm">
                {useTouchFallback ? (
                  <>
                    <li>• Ensure your device supports touch input</li>
                    <li>• Try different swipe speeds and directions</li>
                    <li>• Use two fingers for pinch gestures</li>
                    <li>• Make sure the image is in fullscreen view</li>
                    <li>• Check if touch is working in other apps</li>
                  </>
                ) : (
                  <>
                    <li>• Allow camera permissions when prompted</li>
                    <li>• Ensure good lighting on your hands</li>
                    <li>• Keep hands within camera view</li>
                    <li>• Update browser if gestures don't work</li>
                    <li>• Enable hardware acceleration in browser</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {useTouchFallback ? 'Touch Controls' : 'Camera Preview'}
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              {useTouchFallback 
                ? 'Touch gestures work directly on the images in fullscreen mode:'
                : 'The small camera preview in the corner shows:'
              }
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {useTouchFallback ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Swipe: Navigate between images</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Pinch: Zoom in and out</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Tap: Select and close images</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Works on all touch devices</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Green landmarks: Hand detected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Red dots: Finger positions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Yellow badge: CPU fallback mode</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Red badge: No hand detected</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Get Started Button */}
          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
            >
              Start Using {useTouchFallback ? 'Touch Controls' : 'Gestures'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpOverlay;