/**
 * CountdownModal Component - "Are You Safe?" modal with countdown
 * Auto-triggers SOS if user doesn't respond within 30 seconds
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import Card from '../common/Card';

const CountdownModal = ({ 
  isOpen, 
  onClose, 
  onConfirmSafe, 
  onTimeout, 
  countdownSeconds = 30 
}) => {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen || isConfirmed) {
      setCountdown(countdownSeconds);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeout) {
            onTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isConfirmed, countdownSeconds, onTimeout]);

  const handleConfirmSafe = useCallback(() => {
    setIsConfirmed(true);
    if (onConfirmSafe) {
      onConfirmSafe();
    }
    // Close modal after short delay
    setTimeout(() => {
      onClose();
      setIsConfirmed(false);
    }, 500);
  }, [onConfirmSafe, onClose]);

  const handleIgnore = useCallback(() => {
    // User explicitly ignores - treat as unsafe
    if (onTimeout) {
      onTimeout();
    }
    onClose();
  }, [onTimeout, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-emergency bg-surface">
            <div className="text-center p-6">
              {/* Warning Icon */}
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-6xl mb-4"
              >
                ⚠️
              </motion.div>

              {/* Countdown Circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#333"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#ff0000"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: 352 }}
                    animate={{
                      strokeDashoffset: 352 - (352 * (countdown / countdownSeconds)),
                    }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {countdown}
                  </span>
                </div>
              </div>

              {/* Message */}
              <h2 className="text-2xl font-bold text-white mb-2">
                Are You Safe?
              </h2>
              <p className="text-gray-400 mb-6">
                We noticed you've stopped moving in an isolated area at night. 
                Please confirm you're safe or we'll send help.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="success"
                  size="lg"
                  fullWidth
                  onClick={handleConfirmSafe}
                  disabled={isConfirmed}
                >
                  {isConfirmed ? '✓ Confirmed' : "I'm Safe"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleIgnore}
                >
                  Need Help
                </Button>
              </div>

              {/* Auto-send warning */}
              <p className="text-xs text-gray-500 mt-4">
                SOS will be automatically sent in {countdown} seconds if no response
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CountdownModal;
