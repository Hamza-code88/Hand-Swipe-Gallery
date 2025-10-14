// src/components/GestureGallery.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageModal from './ImageModal';

const GestureGallery = ({ images, onGestureDetected, isCameraActive }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
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
    
    // Notify parent about gesture
    onGestureDetected(direction === 'next' ? 'swipe_right' : 'swipe_left');
  };

  const handleZoom = (zoomType) => {
    onGestureDetected(zoomType === 'in' ? 'pinch_in' : 'pinch_out');
  };

  return (
    <div className="relative">
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

      {/* Camera Status */}
      {isCameraActive && (
        <motion.div
          className="fixed top-20 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2 z-40"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Camera Active</span>
        </motion.div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={closeImage}
            onNavigate={navigateImage}
            onZoom={handleZoom}
            currentIndex={currentIndex}
            totalImages={images.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestureGallery;