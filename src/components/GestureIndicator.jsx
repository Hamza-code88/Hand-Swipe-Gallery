// src/components/GestureIndicator.jsx
import React from 'react';
import {  AnimatePresence } from 'framer-motion';
import { Move, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

const GestureIndicator = ({ gesture }) => {
  const getGestureConfig = (gestureType) => {
    switch (gestureType) {
      case 'swipe_left':
        return {
          icon: <ChevronLeft size={32} />,
          text: 'Swipe Left',
          color: 'bg-blue-500'
        };
      case 'swipe_right':
        return {
          icon: <ChevronRight size={32} />,
          text: 'Swipe Right',
          color: 'bg-blue-500'
        };
      case 'pinch_in':
        return {
          icon: <ZoomIn size={32} />,
          text: 'Zoom In',
          color: 'bg-purple-500'
        };
      case 'pinch_out':
        return {
          icon: <ZoomOut size={32} />,
          text: 'Zoom Out',
          color: 'bg-purple-500'
        };
      default:
        return null;
    }
  };

  const config = getGestureConfig(gesture);

  return (
    <AnimatePresence>
      {gesture && config && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className={`${config.color} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm bg-opacity-90`}>
            <div className="flex items-center justify-center">
              {config.icon}
            </div>
            <span className="text-lg font-semibold">{config.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GestureIndicator;