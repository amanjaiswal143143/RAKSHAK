/**
 * Location Service - Handles GPS coordinate capture
 */

export const locationService = {
  /**
   * Get current GPS coordinates
   * @returns {Promise<Object>} Location data with coordinates and accuracy
   */
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || null,
            altitudeAccuracy: position.coords.altitudeAccuracy || null,
            heading: position.coords.heading || null,
            speed: position.coords.speed || null,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  },

  /**
   * Watch location changes
   * @param {Function} callback - Callback function for location updates
   * @returns {Function} Cleanup function to stop watching
   */
  watchPosition: (callback) => {
    if (!navigator.geolocation) {
      callback(new Error('Geolocation is not supported'), null);
      return () => {};
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback(null, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        callback(new Error(`Geolocation error: ${error.message}`), null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  },

  /**
   * Check if geolocation permission is granted
   * @returns {Promise<string>} Permission state
   */
  checkPermission: async () => {
    if (!navigator.permissions) {
      return 'prompt';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      return 'prompt';
    }
  },

  /**
   * Request geolocation permission
   * @returns {Promise<Object>} Location data
   */
  requestPermission: () => {
    return locationService.getCurrentLocation();
  },
};
