// src/components/TouchFallback.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageModal from './ImageModal';

const TouchFallback = ({ images, onGestureDetected }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setScale(1);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setScale(1);
  };

  const navigateImage = (direction) => {
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
    setScale(1);
    
    onGestureDetected(direction === 'next' ? 'swipe_right' : 'swipe_left');
  };

  const handleTouchStart = (e) => {
    if (!selectedImage) return;
    
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scale: scale
    };
  };

  const handleTouchMove = (e) => {
    if (!selectedImage || e.touches.length !== 2) return;
    
    e.preventDefault();
    
    // Handle pinch zoom
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const distance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
    
    const startDistance = Math.hypot(
      touchStartRef.current.x - (touchStartRef.current.x + 50), // Reference distance
      touchStartRef.current.y - (touchStartRef.current.y + 50)
    );
    
    const newScale = Math.max(0.5, Math.min(3, (distance / startDistance) * touchStartRef.current.scale));
    setScale(newScale);
    
    if (newScale > touchStartRef.current.scale + 0.1) {
      onGestureDetected('pinch_out');
      touchStartRef.current.scale = newScale;
    } else if (newScale < touchStartRef.current.scale - 0.1) {
      onGestureDetected('pinch_in');
      touchStartRef.current.scale = newScale;
    }
  };

  const handleTouchEnd = (e) => {
    if (!selectedImage || e.changedTouches.length !== 1) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Swipe detection (only if not zoomed in)
    if (scale === 1 && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        navigateImage('prev');
      } else {
        navigateImage('next');
      }
    }
  };

  return (
    <div className="relative">
      {/* Touch Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📱 Touch Controls Active</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              ←→
            </div>
            <span>Swipe to navigate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              ↕
            </div>
            <span>Pinch to zoom</span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="aspect-square bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openImage(image, index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Image Modal with Touch Support */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImage}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ scale }}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain touch-none"
              />
              
              {/* Zoom Indicator */}
              {scale !== 1 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {Math.round(scale * 100)}%
                </div>
              )}
            </motion.div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeImage}
            >
              ✕
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 text-white text-lg z-10 bg-black bg-opacity-50 rounded-full px-3 py-1">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TouchFallback;