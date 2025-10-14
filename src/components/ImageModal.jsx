// src/components/ImageModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const ImageModal = ({ image, onClose, onNavigate, onZoom, currentIndex, totalImages }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onClose, onNavigate]);

  const handleZoomIn = () => {
    const newScale = scale + 0.5;
    setScale(newScale);
    onZoom('in');
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.5, scale - 0.5);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
    onZoom('out');
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.01;
      const newScale = Math.max(0.5, Math.min(3, scale + delta));
      setScale(newScale);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      {/* Navigation Buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
      >
        <ChevronLeft size={48} />
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
      >
        <ChevronRight size={48} />
      </button>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
        <button
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
          onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
        >
          <ZoomOut size={24} />
        </button>
        <button
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-3 rounded-lg transition-all"
          onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
          onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
        >
          <ZoomIn size={24} />
        </button>
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 text-white text-lg z-10">
        {currentIndex + 1} / {totalImages}
      </div>

      {/* Image */}
      <motion.div
        className="relative max-w-full max-h-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        <motion.img
          src={image.src}
          alt={image.alt}
          className="max-w-full max-h-full object-contain"
          style={{
            scale,
            x: position.x,
            y: position.y,
          }}
          drag={scale > 1}
          dragConstraints={{
            left: -100,
            right: 100,
            top: -100,
            bottom: 100,
          }}
          onDrag={(event, info) => {
            if (scale > 1) {
              setPosition({
                x: info.offset.x,
                y: info.offset.y,
              });
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ImageModal;