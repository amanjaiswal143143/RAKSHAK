import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SwipeToConfirm from '../components/emergency/SwipeToConfirm';
import CountdownModal from '../components/emergency/CountdownModal';
import { useEmergency } from '../hooks/useEmergency';
import { useNightMode } from '../contexts/NightModeContext';
import { useMovementDetection } from '../hooks/useMovementDetection';

const SOS = () => {
  const { triggerSOS, loading, error, success, emergency, reset } = useEmergency();
  const { isNightMode } = useNightMode();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  
  const {
    unsafeStopDetected,
    stopData,
    resetDetection,
  } = useMovementDetection({
    enabled: true,
    onUnsafeStop: (data) => {
      setShowSafetyModal(true);
    },
  });

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      // Auto-reset after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, reset]);

  const handleSOSConfirm = async () => {
    try {
      await triggerSOS({ type: 'SOS', metadata: { source: 'mobile_app' } });
    } catch (err) {
      console.error('SOS failed:', err);
    }
  };

  const handleConfirmSafe = () => {
    setShowSafetyModal(false);
    resetDetection();
  };

  const handleSafetyTimeout = async () => {
    setShowSafetyModal(false);
    // Auto-trigger SOS when safety check times out
    await triggerSOS({ 
      type: 'AUTO_SOS', 
      metadata: { 
        source: 'safety_monitor',
        reason: 'unsafe_stop_timeout',
        stopData 
      } 
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background pb-24 safe-area-top flex flex-col"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Emergency <span className="text-emergency text-glow">SOS</span>
        </h1>
        <p className="text-gray-400">Swipe to send emergency alert</p>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center px-6"
          >
            <div className="text-center">
              <motion.div
                className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-emergency border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xl font-semibold text-white mb-2">Sending SOS...</p>
              <p className="text-sm text-gray-400">Capturing location</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {showSuccess && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex-1 flex items-center justify-center px-6"
          >
            <div className="text-center">
              <motion.div
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-neonGreen flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <span className="text-6xl">✓</span>
              </motion.div>
              <p className="text-2xl font-bold text-neonGreen mb-2">SOS Sent!</p>
              <p className="text-sm text-gray-400 mb-4">Emergency services alerted</p>
              {emergency && (
                <div className="text-xs text-gray-500">
                  ID: {emergency.id.slice(0, 8)}...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Slider - Only show when not loading or success */}
      <AnimatePresence>
        {!loading && !showSuccess && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex-1 flex items-center justify-center"
          >
            <div className="w-full px-6">
              <SwipeToConfirm
                onConfirm={handleSOSConfirm}
                text="SWIPE TO SEND SOS"
                color="bg-emergency"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-6 mb-6"
          >
            <Card className="border-l-4 border-red-600">
              <p className="text-red-400 font-semibold mb-1">Error</p>
              <p className="text-sm text-gray-300">{error}</p>
              <p className="text-xs text-gray-500 mt-2">Emergency saved locally</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Cards - Hide in night mode to reduce distractions */}
      <AnimatePresence>
        {!isNightMode && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="px-6 space-y-4"
          >
            <Card className="border-l-4 border-neonBlue">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📍</div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-semibold">Will be shared automatically</p>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-neonGreen">
              <div className="flex items-center gap-3">
                <div className="text-3xl">👥</div>
                <div>
                  <p className="text-sm text-gray-400">Emergency Contacts</p>
                  <p className="font-semibold">Guardians will be notified</p>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-neonRed">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🚨</div>
                <div>
                  <p className="text-sm text-gray-400">Response Time</p>
                  <p className="font-semibold">Emergency services alerted</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Night mode indicator */}
      <AnimatePresence>
        {isNightMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            <Card className="border-l-4 border-emergency bg-emergency/10">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🌙</div>
                <div>
                  <p className="text-sm text-emergency font-semibold">Night Safety Mode Active</p>
                  <p className="text-xs text-gray-400">Interface simplified for emergencies</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety Check Modal */}
      <CountdownModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        onConfirmSafe={handleConfirmSafe}
        onTimeout={handleSafetyTimeout}
        countdownSeconds={30}
      />
    </motion.div>
  );
};

export default SOS;
