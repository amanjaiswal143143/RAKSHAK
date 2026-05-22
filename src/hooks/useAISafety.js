/**
 * useAISafety Hook - Hook for AI safety intelligence
 * Provides risk assessment and smart suggestions
 */

import { useState, useEffect, useCallback } from 'react';
import { aiSafetyEngine } from '../services/ai/aiSafetyEngine.js';
import { useGeolocation } from './useGeolocation.js';
import { useNightMode } from '../contexts/NightModeContext';
import { useOfflineMode } from './useOfflineMode.js';

export const useAISafety = (options = {}) => {
  const { enabled = true, updateInterval = 60000 } = options;
  const { location } = useGeolocation();
  const { isNightMode } = useNightMode();
  const { isOffline, networkType } = useOfflineMode();
  
  const [safetyAnalysis, setSafetyAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSafety = useCallback(async () => {
    if (!enabled || !location) return;

    setLoading(true);
    setError(null);

    try {
      // Determine network quality
      const networkQuality = isOffline ? 'none' : 
        networkType === 'slow-2g' || networkType === '2g' ? 'poor' :
        networkType === '3g' ? 'fair' : 'good';

      // Get battery level
      const batteryLevel = navigator.getBattery ? 
        (await navigator.getBattery()).level : 1;

      // Calculate isolation level (simplified)
      const isolationLevel = isNightMode ? 0.7 : 0.3;

      // Get nearby services (would come from nearbySearchService)
      const nearbyServices = []; // Would be populated in real implementation

      const context = {
        location,
        isNightMode,
        stopDuration: 0, // Would come from movement detection
        networkQuality,
        batteryLevel,
        nearbyServices,
        movementSpeed: 0, // Would come from movement detection
        isolationLevel,
        isSharingTrip: false, // Would come from trip sharing
      };

      const analysis = aiSafetyEngine.analyzeSafety(context);
      setSafetyAnalysis(analysis);
      
      // Save to history
      aiSafetyEngine.addToHistory(analysis);
    } catch (err) {
      setError(err.message);
      console.error('AI safety analysis failed:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled, location, isNightMode, isOffline, networkType]);

  useEffect(() => {
    analyzeSafety();

    const interval = setInterval(analyzeSafety, updateInterval);

    return () => clearInterval(interval);
  }, [analyzeSafety, updateInterval]);

  return {
    safetyAnalysis,
    loading,
    error,
    analyzeSafety,
    riskScore: safetyAnalysis?.riskScore || 0,
    riskLevel: safetyAnalysis?.riskLevel || 'low',
    suggestions: safetyAnalysis?.suggestions || [],
    priority: safetyAnalysis?.priority?.level || 'low',
  };
};
