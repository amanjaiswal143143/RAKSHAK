/**
 * useTripTracking Hook - Real-time location updates for active trips
 * Automatically updates trip location when sharing is active
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { tripSharingService } from '../services/api/tripSharing.js';
import { useGeolocation } from './useGeolocation.js';

export const useTripTracking = (trackingId, enabled = false) => {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const { location } = useGeolocation();
  const updateIntervalRef = useRef(null);

  const updateTripLocation = useCallback(async () => {
    if (!trackingId || !location) return;

    try {
      await tripSharingService.updateLocation(trackingId, {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      });
      setError(null);
    } catch (err) {
      console.error('Error updating trip location:', err);
      setError(err.message);
    }
  }, [trackingId, location]);

  useEffect(() => {
    if (enabled && trackingId && location) {
      setIsTracking(true);
      setError(null);

      // Initial update
      updateTripLocation();

      // Set up interval for updates (every 30 seconds)
      updateIntervalRef.current = setInterval(() => {
        updateTripLocation();
      }, 30000); // 30 seconds

      return () => {
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
        }
        setIsTracking(false);
      };
    } else {
      setIsTracking(false);
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    }
  }, [enabled, trackingId, location, updateTripLocation]);

  return {
    isTracking,
    error,
    updateLocation: updateTripLocation,
  };
};
