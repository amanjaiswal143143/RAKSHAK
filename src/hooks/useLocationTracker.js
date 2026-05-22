/**
 * useLocationTracker Hook - Battery-optimized GPS tracking with debouncing
 * Tracks last known path with minimal battery impact
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { pathRecoveryService } from '../services/api/pathRecovery.js';

export const useLocationTracker = (options = {}) => {
  const {
    enabled = false,
    updateInterval = 30000, // 30 seconds default
    maxAccuracy = 100, // meters
    onLocationUpdate = null,
  } = options;

  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const watchIdRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const debounceTimerRef = useRef(null);
  const batteryLevelRef = useRef(null);

  // Check battery level for optimization
  const checkBattery = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        batteryLevelRef.current = battery.level;
        
        // Adjust update interval based on battery
        if (battery.level < 0.2) {
          return 60000; // 1 minute for low battery
        } else if (battery.level < 0.5) {
          return 45000; // 45 seconds for medium battery
        }
        return updateInterval;
      } catch (err) {
        console.warn('Battery API not available:', err);
        return updateInterval;
      }
    }
    return updateInterval;
  }, [updateInterval]);

  // Debounced location update
  const debouncedUpdate = useCallback(
    (location) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateRef.current;
        const adjustedInterval = await checkBattery();

        // Only update if enough time has passed
        if (timeSinceLastUpdate >= adjustedInterval) {
          lastUpdateRef.current = now;
          
          // Save to path recovery service
          await pathRecoveryService.saveLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            timestamp: location.timestamp || now,
          });

          // Update state
          setCurrentLocation(location);
          setPathHistory(await pathRecoveryService.getLocations());
          setStats(await pathRecoveryService.getStats());

          if (onLocationUpdate) {
            onLocationUpdate(location);
          }
        }
      }, 1000); // 1 second debounce
    },
    [checkBattery, onLocationUpdate]
  );

  // Start tracking
  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation not supported'));
      return;
    }

    try {
      setError(null);
      setIsTracking(true);

      // Get initial location
      const initialLocation = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      debouncedUpdate(initialLocation);

      // Start watching
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };

          // Filter out low accuracy readings
          if (location.accuracy <= maxAccuracy) {
            debouncedUpdate(location);
          }
        },
        (err) => {
          setError(new Error(`Location error: ${err.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );
    } catch (err) {
      setError(err);
      setIsTracking(false);
    }
  }, [debouncedUpdate, maxAccuracy]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setIsTracking(false);
  }, []);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await pathRecoveryService.getLocations();
        setPathHistory(history);
        setStats(await pathRecoveryService.getStats());
        
        if (history.length > 0) {
          setCurrentLocation(history[history.length - 1]);
        }
      } catch (err) {
        console.error('Error loading history:', err);
      }
    };

    loadHistory();
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (enabled && !isTracking) {
      startTracking();
    } else if (!enabled && isTracking) {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled, isTracking, startTracking, stopTracking]);

  // Clear history
  const clearHistory = useCallback(async () => {
    await pathRecoveryService.clearHistory();
    setPathHistory([]);
    setStats(null);
    setCurrentLocation(null);
  }, []);

  // Export path
  const exportPath = useCallback(async () => {
    return await pathRecoveryService.exportAsGeoJSON();
  }, []);

  return {
    isTracking,
    currentLocation,
    pathHistory,
    error,
    stats,
    startTracking,
    stopTracking,
    clearHistory,
    exportPath,
    batteryLevel: batteryLevelRef.current,
  };
};
