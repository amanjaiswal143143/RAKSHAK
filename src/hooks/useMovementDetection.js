/**
 * useMovementDetection Hook - Monitors movement patterns for safety
 * Battery-optimized with debounced checks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { safetyMonitorService } from '../services/api/safetyMonitor.js';
import { useNightMode } from '../contexts/NightModeContext';

export const useMovementDetection = (options = {}) => {
  const {
    enabled = false,
    onUnsafeStop = null,
    movementThreshold = 10,
    stopDurationThreshold = 5 * 60 * 1000, // 5 minutes
    gpsUpdateInterval = 60 * 1000, // 1 minute
  } = options;

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [unsafeStopDetected, setUnsafeStopDetected] = useState(false);
  const [stopData, setStopData] = useState(null);
  const [error, setError] = useState(null);
  const { isNightMode } = useNightMode();

  const onUnsafeStopRef = useRef(onUnsafeStop);

  // Update ref when callback changes
  useEffect(() => {
    onUnsafeStopRef.current = onUnsafeStop;
  }, [onUnsafeStop]);

  // Handle unsafe stop detection
  const handleUnsafeStop = useCallback((data) => {
    setUnsafeStopDetected(true);
    setStopData(data);
    setError(null);

    if (onUnsafeStopRef.current) {
      onUnsafeStopRef.current(data);
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!isNightMode) {
      console.log('Movement detection only active at night');
      return;
    }

    try {
      safetyMonitorService.startMonitoring(handleUnsafeStop, {
        movementThreshold,
        stopDurationThreshold,
        gpsUpdateInterval,
      });
      setIsMonitoring(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsMonitoring(false);
    }
  }, [isNightMode, movementThreshold, stopDurationThreshold, gpsUpdateInterval, handleUnsafeStop]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    safetyMonitorService.stopMonitoring();
    setIsMonitoring(false);
    setUnsafeStopDetected(false);
    setStopData(null);
  }, []);

  // Reset detection state
  const resetDetection = useCallback(() => {
    setUnsafeStopDetected(false);
    setStopData(null);
    setError(null);
  }, []);

  // Get current status
  const getStatus = useCallback(() => {
    return safetyMonitorService.getStatus();
  }, []);

  // Auto-start when enabled and night mode is active
  useEffect(() => {
    if (enabled && isNightMode && !isMonitoring) {
      startMonitoring();
    } else if ((!enabled || !isNightMode) && isMonitoring) {
      stopMonitoring();
    }

    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [enabled, isNightMode, isMonitoring, startMonitoring, stopMonitoring]);

  return {
    isMonitoring,
    unsafeStopDetected,
    stopData,
    error,
    startMonitoring,
    stopMonitoring,
    resetDetection,
    getStatus,
  };
};
