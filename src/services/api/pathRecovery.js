/**
 * Path Recovery Service - Lightweight GPS tracking for last known path
 * Stores only last 20 coordinates with auto-cleanup
 * Battery optimized with debounced updates
 */

const MAX_COORDINATES = 20;
const STORAGE_KEY = 'rakshak_path_history';
const DB_NAME = 'RakshakPathDB';
const DB_VERSION = 1;
const STORE_NAME = 'path_history';

export const pathRecoveryService = {
  /**
   * Initialize IndexedDB for path storage
   */
  initDB: async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  },

  /**
   * Save location point with auto-cleanup of old coordinates
   * @param {Object} location - Location data with lat, lng, timestamp
   */
  saveLocation: async (location) => {
    try {
      const db = await pathRecoveryService.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Get all existing locations
      const allLocations = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Add new location
      const newLocation = {
        id: crypto.randomUUID(),
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || null,
        timestamp: location.timestamp || Date.now(),
      };

      await new Promise((resolve, reject) => {
        const request = store.add(newLocation);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Remove oldest if exceeding max
      if (allLocations.length >= MAX_COORDINATES) {
        const sorted = [...allLocations, newLocation].sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = sorted.slice(0, sorted.length - MAX_COORDINATES);

        for (const loc of toRemove) {
          await new Promise((resolve, reject) => {
            const request = store.delete(loc.id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      }

      return newLocation;
    } catch (error) {
      console.error('Error saving location to path recovery:', error);
      // Fallback to localStorage
      pathRecoveryService.saveToLocalStorage(newLocation);
      return newLocation;
    }
  },

  /**
   * Fallback to localStorage
   */
  saveToLocalStorage: (location) => {
    try {
      const history = pathRecoveryService.getFromLocalStorage();
      const newHistory = [...history, location].slice(-MAX_COORDINATES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Get all stored locations
   */
  getLocations: async () => {
    try {
      const db = await pathRecoveryService.initDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const locations = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return locations.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Error getting locations from IndexedDB:', error);
      return pathRecoveryService.getFromLocalStorage();
    }
  },

  /**
   * Get from localStorage fallback
   */
  getFromLocalStorage: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return [];
    }
  },

  /**
   * Clear all location history
   */
  clearHistory: async () => {
    try {
      const db = await pathRecoveryService.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  /**
   * Get path statistics
   */
  getStats: async () => {
    const locations = await pathRecoveryService.getLocations();
    
    if (locations.length === 0) {
      return {
        totalPoints: 0,
        duration: 0,
        distance: 0,
        firstPoint: null,
        lastPoint: null,
      };
    }

    const firstPoint = locations[0];
    const lastPoint = locations[locations.length - 1];
    const duration = lastPoint.timestamp - firstPoint.timestamp;

    // Calculate approximate distance (Haversine formula simplified)
    let distance = 0;
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      distance += pathRecoveryService.calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
    }

    return {
      totalPoints: locations.length,
      duration,
      distance: Math.round(distance),
      firstPoint,
      lastPoint,
    };
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
   * Export path as GeoJSON
   */
  exportAsGeoJSON: async () => {
    const locations = await pathRecoveryService.getLocations();
    
    return {
      type: 'Feature',
      properties: {
        timestamp: Date.now(),
        pointCount: locations.length,
      },
      geometry: {
        type: 'LineString',
        coordinates: locations.map((loc) => [loc.longitude, loc.latitude]),
      },
    };
  },
};
