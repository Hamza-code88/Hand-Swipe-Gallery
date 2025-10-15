// src/components/CameraView.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {  AnimatePresence } from 'framer-motion';
import { HandLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

const CameraView = ({ isActive, onGestureDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const lastGestureTimeRef = useRef(0);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingCPU, setIsUsingCPU] = useState(false);

  // Gesture state
  const gestureStateRef = useRef({
    lastPinchDistance: null,
    lastSwipePosition: null,
    lastSwipeTime: null,
    zoomLevel: 1
  });

  const initializeHandLandmarker = useCallback(async () => {
    try {
      console.log("Initializing MediaPipe Hands...");
      
      const vision = await FilesetResolver.forVisionTasks(
        "/wasm/vision_wasm_internal.wasm" // Local path for offline use
      );

      // Try GPU first, fallback to CPU if needed
      let handLandmarker;
      try {
        console.log("Attempting GPU acceleration...");
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task", // Local model path
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        console.log("GPU acceleration enabled");
        setIsUsingCPU(false);
      } catch (gpuError) {
        console.warn("GPU initialization failed, falling back to CPU:", gpuError);
        
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
            delegate: "CPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        console.log("CPU fallback enabled");
        setIsUsingCPU(true);
      }

      handLandmarkerRef.current = handLandmarker;
      setIsInitialized(true);
      setError(null);
      console.log("MediaPipe Hands initialized successfully");
      
    } catch (error) {
      console.error("Error initializing MediaPipe Hands:", error);
      setError(`Failed to initialize hand tracking: ${error.message}`);
      setIsInitialized(false);
    }
  }, []);

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + 
      Math.pow(point2.y - point1.y, 2)
    );
  };

  const detectGestures = useCallback((landmarks) => {
    if (!landmarks || landmarks.length === 0) return;

    const currentTime = Date.now();
    const state = gestureStateRef.current;
    const GESTURE_COOLDOWN = 800; // ms between gestures

    // Use first hand detected
    const hand = landmarks[0];
    
    // Pinch detection (using thumb and index finger)
    const thumbTip = hand[4]; // THUMB_TIP
    const indexTip = hand[8]; // INDEX_FINGER_TIP
    
    const pinchDistance = calculateDistance(
      { x: thumbTip.x, y: thumbTip.y },
      { x: indexTip.x, y: indexTip.y }
    );

    // Swipe detection (using wrist movement)
    const wrist = hand[0]; // WRIST
    const currentPosition = { x: wrist.x, y: wrist.y };

    // Pinch gesture detection
    if (state.lastPinchDistance !== null) {
      const pinchDiff = state.lastPinchDistance - pinchDistance;
      const pinchThreshold = 0.03; // Reduced threshold for better sensitivity

      if (Math.abs(pinchDiff) > pinchThreshold && 
          currentTime - lastGestureTimeRef.current > GESTURE_COOLDOWN) {
        
        if (pinchDiff > 0) {
          console.log("Pinch in detected");
          onGestureDetected('pinch_in');
        } else {
          console.log("Pinch out detected");
          onGestureDetected('pinch_out');
        }
        lastGestureTimeRef.current = currentTime;
      }
    }

    // Swipe gesture detection
    if (state.lastSwipePosition !== null && state.lastSwipeTime !== null) {
      const timeDiff = currentTime - state.lastSwipeTime;
      const swipeThreshold = 0.08; // Reduced threshold
      const minSwipeTime = 100;   // Reduced minimum time
      const maxSwipeTime = 800;   // Reduced maximum time

      if (timeDiff > minSwipeTime && timeDiff < maxSwipeTime) {
        const swipeX = currentPosition.x - state.lastSwipePosition.x;
        const swipeY = currentPosition.y - state.lastSwipePosition.y;

        // Horizontal swipe (prioritize over vertical)
        if (Math.abs(swipeX) > swipeThreshold && 
            Math.abs(swipeX) > Math.abs(swipeY) * 2 && // More strict horizontal requirement
            currentTime - lastGestureTimeRef.current > GESTURE_COOLDOWN) {
          
          if (swipeX > 0) {
            console.log("Swipe right detected");
            onGestureDetected('swipe_right');
          } else {
            console.log("Swipe left detected");
            onGestureDetected('swipe_left');
          }
          lastGestureTimeRef.current = currentTime;
        }
      }
    }

    // Update state
    state.lastPinchDistance = pinchDistance;
    state.lastSwipePosition = currentPosition;
    state.lastSwipeTime = currentTime;
  }, [onGestureDetected]);

  const predictWebcam = useCallback(async () => {
    if (!videoRef.current || !handLandmarkerRef.current || !isActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    if (video.videoWidth > 0 && video.readyState >= 2) {
      // Set canvas dimensions to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      try {
        const results = handLandmarkerRef.current.detectForVideo(video, Date.now());
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
          if (!handDetected) setHandDetected(true);
          
          // Draw hand landmarks
          const drawingUtils = new DrawingUtils(ctx);
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              { color: "#00FF00", lineWidth: 2 }
            );
            drawingUtils.drawLandmarks(landmarks, {
              color: "#FF0000",
              lineWidth: 1,
              radius: 2
            });
          }

          // Detect gestures
          detectGestures(results.landmarks);
        } else {
          if (handDetected) setHandDetected(false);
          // Reset gesture state when no hand is detected
          gestureStateRef.current.lastPinchDistance = null;
          gestureStateRef.current.lastSwipePosition = null;
        }
      } catch (detectionError) {
        console.error("Detection error:", detectionError);
        // Continue running even if one frame fails
      }
    }

    // Continue the loop
    if (isActive && isInitialized) {
      animationRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [isActive, isInitialized, handDetected, detectGestures]);

  const startCamera = useCallback(async () => {
    try {
      console.log("Starting camera...");
      
      // Stop any existing stream
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadeddata = () => {
          console.log("Camera started successfully");
          predictWebcam();
        };
        
        videoRef.current.onerror = (e) => {
          console.error("Video error:", e);
          setError("Failed to start camera feed");
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError(`Camera access denied: ${error.message}`);
    }
  }, [predictWebcam]);

  // Initialize hand landmarker when component mounts and is active
  useEffect(() => {
    if (isActive && !isInitialized && !error) {
      initializeHandLandmarker();
    }
  }, [isActive, isInitialized, error, initializeHandLandmarker]);

  // Start/stop camera based on active state
  useEffect(() => {
    if (isActive && isInitialized) {
      startCamera();
    } else {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      
      setHandDetected(false);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, isInitialized, startCamera]);

  // Reset gesture state when component unmounts
  useEffect(() => {
    return () => {
      gestureStateRef.current = {
        lastPinchDistance: null,
        lastSwipePosition: null,
        lastSwipeTime: null,
        zoomLevel: 1
      };
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed bottom-4 right-4 w-64 h-48 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-green-500 z-30"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
            
            {/* Status Indicators */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                handDetected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {handDetected ? '✋ Hand' : '❌ No Hand'}
              </div>
              {isUsingCPU && (
                <div className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                  ⚡ CPU Mode
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center p-2">
                <p className="text-white text-xs text-center">{error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback message when WebGL completely fails */}
      {error && isActive && (
        <motion.div
          className="fixed bottom-24 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-40 max-w-sm"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="font-semibold mb-2">WebGL Required</h3>
          <p className="text-sm">
            Your browser doesn't support WebGL acceleration. Please try:
          </p>
          <ul className="text-xs mt-2 list-disc list-inside">
            <li>Updating your browser</li>
            <li>Enabling hardware acceleration</li>
            <li>Using Chrome or Firefox</li>
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default CameraView;