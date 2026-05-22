/**
 * Night Mode Context - Manages night safety mode state
 * Automatically activates after sunset with enhanced emergency features
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { sunsetDetectionService } from '../services/api/sunsetDetection.js';
import { useGeolocation } from '../hooks/useGeolocation.js';

const NightModeContext = createContext(null);

export const NightModeProvider = ({ children }) => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [lightLevel, setLightLevel] = useState(1);
  const [timeUntilSunset, setTimeUntilSunset] = useState(null);
  const { location } = useGeolocation();

  // Check night mode status based on location and time
  useEffect(() => {
    const checkNightMode = async () => {
      if (location) {
        try {
          const isNight = await sunsetDetectionService.isNightTime(
            location.latitude,
            location.longitude
          );
          setIsNightMode(isNight);

          const level = await sunsetDetectionService.getLightLevel(
            location.latitude,
            location.longitude
          );
          setLightLevel(level);

          const minutes = await sunsetDetectionService.getTimeUntilSunset(
            location.latitude,
            location.longitude
          );
          setTimeUntilSunset(minutes);
        } catch (error) {
          console.error('Error checking night mode:', error);
          // Fallback to simple time check
          const hour = new Date().getHours();
          setIsNightMode(hour < 6 || hour >= 18);
        }
      } else {
        // Fallback when location not available
        const hour = new Date().getHours();
        setIsNightMode(hour < 6 || hour >= 18);
      }
    };

    checkNightMode();

    // Check every 5 minutes
    const interval = setInterval(checkNightMode, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);

  // Manual override for testing
  const setNightMode = (value) => {
    setIsNightMode(value);
  };

  const value = {
    isNightMode,
    lightLevel,
    timeUntilSunset,
    setNightMode,
  };

  return (
    <NightModeContext.Provider value={value}>
      {children}
    </NightModeContext.Provider>
  );
};

export const useNightMode = () => {
  const context = useContext(NightModeContext);
  if (!context) {
    throw new Error('useNightMode must be used within NightModeProvider');
  }
  return context;
};
