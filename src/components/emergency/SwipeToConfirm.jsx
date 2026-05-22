/**
 * SwipeToConfirm Component - Massive swipe slider for SOS activation
 * Prevents accidental taps with swipe gesture
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const SwipeToConfirm = ({ onConfirm, text = 'SWIPE TO SEND SOS', color = 'bg-emergency' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef(null);
  const handleRef = useRef(null);
  const controls = useAnimation();

  const THRESHOLD = 0.85; // 85% swipe required to confirm

  // Haptic feedback simulation
  const triggerHaptic = (intensity = 'medium') => {
    if (navigator.vibrate) {
      const duration = intensity === 'light' ? 10 : intensity === 'medium' ? 25 : 50;
      navigator.vibrate(duration);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    triggerHaptic('light');
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    if (progress >= THRESHOLD) {
      handleConfirm();
    } else {
      // Snap back
      setProgress(0);
      triggerHaptic('light');
    }
  };

  const handleDrag = (event, info) => {
    if (!containerRef.current || !handleRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const handleWidth = handleRef.current.offsetWidth;
    const maxDrag = containerWidth - handleWidth;
    
    const newProgress = Math.min(Math.max(info.offset.x / maxDrag, 0), 1);
    setProgress(newProgress);

    // Haptic feedback at 50% and 75%
    if (newProgress > 0.5 && newProgress < 0.55) {
      triggerHaptic('medium');
    } else if (newProgress > 0.75 && newProgress < 0.8) {
      triggerHaptic('medium');
    }
  };

  const handleConfirm = async () => {
    setIsConfirmed(true);
    setProgress(1);
    triggerHaptic('heavy');
    
    // Success animation
    await controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    });

    if (onConfirm) {
      onConfirm();
    }
  };

  const reset = () => {
    setIsConfirmed(false);
    setProgress(0);
    controls.set({ scale: 1 });
  };

  return (
    <div className="w-full px-6">
      <motion.div
        ref={containerRef}
        className={`
          relative h-20 rounded-2xl overflow-hidden
          ${isConfirmed ? color : 'bg-surface'}
          border-2 ${isConfirmed ? 'border-emergency' : 'border-glassBorder'}
          cursor-pointer select-none touch-none
        `}
        animate={controls}
      >
        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`
              text-lg font-bold tracking-wider
              ${isConfirmed ? 'text-white' : 'text-gray-500'}
            `}
            animate={{
              opacity: progress > 0.3 ? 0 : 1,
            }}
          >
            {text}
          </motion.span>
        </div>

        {/* Progress fill */}
        <motion.div
          className={`absolute inset-y-0 left-0 ${color}`}
          style={{ width: `${progress * 100}%` }}
          animate={{
            backgroundColor: progress >= THRESHOLD ? '#00ff00' : undefined,
          }}
        />

        {/* Swipe handle */}
        <motion.div
          ref={handleRef}
          className={`
            absolute top-0 bottom-0 w-20 rounded-xl
            ${color} shadow-lg
            flex items-center justify-center
            cursor-grab active:cursor-grabbing
            z-10
          `}
          style={{ left: `${progress * (containerRef.current?.offsetWidth - 80 || 0)}px` }}
          drag="x"
          dragConstraints={{
            left: 0,
            right: containerRef.current?.offsetWidth - 80 || 0,
          }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 0.95 }}
          animate={{
            backgroundColor: progress >= THRESHOLD ? '#00ff00' : undefined,
          }}
        >
          <motion.div
            className="text-3xl"
            animate={{
              x: progress * 20,
              rotate: progress * 360,
            }}
          >
            {isConfirmed ? '✓' : '→'}
          </motion.div>
        </motion.div>

        {/* Success indicator */}
        {isConfirmed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-emergency"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="text-xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              SOS SENT!
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SwipeToConfirm;
