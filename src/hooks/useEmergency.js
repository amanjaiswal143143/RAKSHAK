/**
 * useEmergency Hook - Custom hook for emergency SOS functionality
 */

import { useState, useCallback } from 'react';
import { emergencyService } from '../services/api/emergency.js';
import { useGeolocation } from './useGeolocation.js';

export const useEmergency = () => {
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { location, getLocation } = useGeolocation();

  // Trigger SOS emergency
  const triggerSOS = useCallback(async (emergencyData = {}) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get fresh location
      let loc;
      try {
        loc = await getLocation();
      } catch (locError) {
        console.warn('Could not get location, proceeding without it:', locError);
      }

      // Create emergency record
      const emergencyRecord = await emergencyService.createEmergency({
        type: 'SOS',
        ...emergencyData,
        location: loc,
      });

      setEmergency(emergencyRecord);
      setSuccess(true);
      
      return emergencyRecord;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getLocation]);

  // Update emergency status
  const updateStatus = useCallback(async (id, status) => {
    try {
      await emergencyService.updateEmergencyStatus(id, status);
      setEmergency(prev => ({ ...prev, status }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get recent emergencies
  const getRecentEmergencies = useCallback(async (limit = 10) => {
    try {
      return await emergencyService.getRecentEmergencies(limit);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Sync offline emergencies
  const syncEmergencies = useCallback(async () => {
    try {
      await emergencyService.syncEmergencies();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setEmergency(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    emergency,
    loading,
    error,
    success,
    location,
    triggerSOS,
    updateStatus,
    getRecentEmergencies,
    syncEmergencies,
    reset,
  };
};
