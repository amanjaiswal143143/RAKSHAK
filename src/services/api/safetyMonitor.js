/**
 * Safety Monitor Service - Background monitoring for unsafe stop detection
 * Detects when user stops moving at night in isolated areas
 */

const MOVEMENT_THRESHOLD = 10; // meters - minimum movement to consider "moving"
const STOP_DURATION_THRESHOLD = 5 * 60 * 1000; // 5 minutes - minimum stop duration
const GPS_UPDATE_INTERVAL = 60 * 1000; // 1 minute - GPS check interval
const ISOLATION_RADIUS = 500; // meters - radius to check for other locations
const MIN_LOCATIONS_FOR_ISOLATION = 3; // minimum nearby locations to consider area safe

export const safetyMonitorService = {
  isMonitoring: false,
  lastLocation: null,
  stopStartTime: null,
  movementHistory: [],
  checkInterval: null,

  /**
   * Start safety monitoring
   * @param {Function} onUnsafeStop - Callback when unsafe stop detected
   * @param {Object} options - Configuration options
   */
  startMonitoring: (onUnsafeStop, options = {}) => {
    if (safetyMonitorService.isMonitoring) {
      console.warn('Safety monitoring already active');
      return;
    }

    safetyMonitorService.isMonitoring = true;
    safetyMonitorService.movementHistory = [];
    safetyMonitorService.lastLocation = null;
    safetyMonitorService.stopStartTime = null;

    const {
      movementThreshold = MOVEMENT_THRESHOLD,
      stopDurationThreshold = STOP_DURATION_THRESHOLD,
      gpsUpdateInterval = GPS_UPDATE_INTERVAL,
    } = options;

    safetyMonitorService.checkInterval = setInterval(async () => {
      try {
        const location = await safetyMonitorService.getCurrentLocation();
        
        if (!location) {
          console.warn('Could not get location for safety check');
          return;
        }

        await safetyMonitorService.checkMovement(
          location,
          movementThreshold,
          stopDurationThreshold,
          onUnsafeStop
        );
      } catch (error) {
        console.error('Error in safety monitoring:', error);
      }
    }, gpsUpdateInterval);

    console.log('Safety monitoring started');
  },

  /**
   * Stop safety monitoring
   */
  stopMonitoring: () => {
    if (safetyMonitorService.checkInterval) {
      clearInterval(safetyMonitorService.checkInterval);
      safetyMonitorService.checkInterval = null;
    }
    safetyMonitorService.isMonitoring = false;
    safetyMonitorService.lastLocation = null;
    safetyMonitorService.stopStartTime = null;
    safetyMonitorService.movementHistory = [];
    console.log('Safety monitoring stopped');
  },

  /**
   * Get current location
   */
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: false, // Battery optimization
          timeout: 10000,
          maximumAge: 60000, // Accept 1-minute old location
        }
      );
    });
  },

  /**
   * Check movement patterns
   */
  checkMovement: async (
    currentLocation,
    movementThreshold,
    stopDurationThreshold,
    onUnsafeStop
  ) => {
    if (!safetyMonitorService.lastLocation) {
      safetyMonitorService.lastLocation = currentLocation;
      safetyMonitorService.movementHistory.push(currentLocation);
      return;
    }

    // Calculate distance from last location
    const distance = safetyMonitorService.calculateDistance(
      safetyMonitorService.lastLocation.latitude,
      safetyMonitorService.lastLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );

    // Check if user has moved significantly
    if (distance > movementThreshold) {
      // User is moving - reset stop timer
      safetyMonitorService.stopStartTime = null;
      safetyMonitorService.lastLocation = currentLocation;
      safetyMonitorService.movementHistory.push(currentLocation);
      
      // Keep only last 10 locations to save memory
      if (safetyMonitorService.movementHistory.length > 10) {
        safetyMonitorService.movementHistory.shift();
      }
      
      return;
    }

    // User has stopped moving
    if (!safetyMonitorService.stopStartTime) {
      safetyMonitorService.stopStartTime = Date.now();
    }

    // Check how long user has been stopped
    const stopDuration = Date.now() - safetyMonitorService.stopStartTime;

    if (stopDuration >= stopDurationThreshold) {
      // User has been stopped for threshold duration
      const isNightTime = await safetyMonitorService.isNightTime();
      const isIsolated = await safetyMonitorService.checkIsolation(currentLocation);

      if (isNightTime && isIsolated) {
        // Unsafe stop detected
        console.log('Unsafe stop detected - triggering safety check');
        if (onUnsafeStop) {
          onUnsafeStop({
            location: currentLocation,
            stopDuration,
            isolationLevel: safetyMonitorService.calculateIsolationLevel(currentLocation),
          });
        }
        
        // Reset to prevent repeated triggers
        safetyMonitorService.stopStartTime = null;
      }
    }
  },

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  },

  /**
   * Check if it's night time
   */
  isNightTime: async () => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  },

  /**
   * Check if area is isolated (simplified - would use real data in production)
   */
  checkIsolation: async (location) => {
    // In production, this would check:
    // - Nearby businesses/POIs from API
    // - Population density
    // - Street lighting data
    // - Crime statistics
    
    // For now, use a simple heuristic based on time and location
    const hour = new Date().getHours();
    
    // More isolated late at night
    if (hour >= 22 || hour < 4) {
      return true;
    }
    
    // Less isolated during evening
    if (hour >= 18 || hour < 6) {
      return Math.random() > 0.5; // 50% chance
    }
    
    return false;
  },

  /**
   * Calculate isolation level (0-1)
   */
  calculateIsolationLevel: (location) => {
    const hour = new Date().getHours();
    
    if (hour >= 22 || hour < 4) {
      return 0.9; // High isolation
    }
    
    if (hour >= 18 || hour < 6) {
      return 0.6; // Medium isolation
    }
    
    return 0.2; // Low isolation
  },

  /**
   * Get monitoring status
   */
  getStatus: () => {
    return {
      isMonitoring: safetyMonitorService.isMonitoring,
      lastLocation: safetyMonitorService.lastLocation,
      stopStartTime: safetyMonitorService.stopStartTime,
      movementHistory: safetyMonitorService.movementHistory,
      stopDuration: safetyMonitorService.stopStartTime
        ? Date.now() - safetyMonitorService.stopStartTime
        : 0,
    };
  },
};
