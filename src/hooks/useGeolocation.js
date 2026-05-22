/**
 * useGeolocation Hook - Custom hook for GPS location management
 */

import { useState, useEffect, useCallback } from 'react';
import { locationService } from '../services/api/location.js';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('prompt');

  // Check permission on mount
  useEffect(() => {
    locationService.checkPermission().then(setPermission);
  }, []);

  // Get current location
  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loc = await locationService.getCurrentLocation();
      setLocation(loc);
      setPermission('granted');
      return loc;
    } catch (err) {
      setError(err.message);
      setPermission('denied');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Watch location changes
  const watchLocation = useCallback((callback) => {
    const cleanup = locationService.watchPosition((err, loc) => {
      if (err) {
        setError(err.message);
      } else {
        setLocation(loc);
        if (callback) callback(loc);
      }
    });
    return cleanup;
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    try {
      const loc = await locationService.requestPermission();
      setLocation(loc);
      setPermission('granted');
      return loc;
    } catch (err) {
      setError(err.message);
      setPermission('denied');
      throw err;
    }
  }, []);

  return {
    location,
    error,
    loading,
    permission,
    getLocation,
    watchLocation,
    requestPermission,
    hasPermission: permission === 'granted',
  };
};
