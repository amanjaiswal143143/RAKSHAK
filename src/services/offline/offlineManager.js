/**
 * Offline Manager - Manages offline caching and retrieval
 * Coordinates between IndexedDB and Service Worker
 */

import { offlineCacheService } from './offlineCache.js';

export const offlineManager = {
  /**
   * Initialize offline mode
   */
  init: async () => {
    try {
      await offlineCacheService.initDB();
      await offlineManager.registerServiceWorker();
      await offlineManager.cacheEmergencyData();
      return true;
    } catch (error) {
      console.error('Failed to initialize offline mode:', error);
      return false;
    }
  },

  /**
   * Register Service Worker
   */
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    }
  },

  /**
   * Cache emergency data for offline use
   */
  cacheEmergencyData: async (latitude, longitude) => {
    try {
      if (!latitude || !longitude) {
        console.warn('Location required for emergency data caching');
        return;
      }

      // Cache POI data for emergency services
      const { nearbySearchService } = await import('../api/nearbySearch.js');
      
      const emergencyCategories = ['hospital', 'police', 'fuel', 'pharmacy', 'fire_station'];
      
      for (const category of emergencyCategories) {
        try {
          const pois = await nearbySearchService.searchByCategory(latitude, longitude, category);
          await offlineCacheService.cachePOIs(pois, latitude, longitude);
          console.log(`Cached ${pois.length} ${category} locations`);
        } catch (error) {
          console.error(`Failed to cache ${category} data:`, error);
        }
      }

      // Cache map tiles for 5km radius
      await offlineManager.cacheMapTiles(latitude, longitude);
      
      return true;
    } catch (error) {
      console.error('Failed to cache emergency data:', error);
      throw error;
    }
  },

  /**
   * Cache map tiles for a radius around a location
   */
  cacheMapTiles: async (centerLat, centerLng, radiusKm = 5) => {
    try {
      // Calculate tile range for the radius
      const zoomLevel = 14; // Good balance between detail and storage
      const tiles = offlineManager.calculateTileRange(centerLat, centerLng, radiusKm, zoomLevel);
      
      const tileUrls = tiles.map(tile => 
        `https://{s}.basemaps.cartocdn.com/dark_all/${tile.z}/${tile.x}/${tile.y}.png`
      );

      // Send tiles to service worker for caching
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const channel = new MessageChannel();
        navigator.serviceWorker.controller.postMessage(
          { type: 'CACHE_TILES', tiles: tileUrls },
          [channel.port2]
        );
      }

      return tileUrls.length;
    } catch (error) {
      console.error('Failed to cache map tiles:', error);
      throw error;
    }
  },

  /**
   * Calculate tile range for a radius
   */
  calculateTileRange: (centerLat, centerLng, radiusKm, zoom) => {
    const tiles = [];
    
    // Convert center to tile coordinates
    const centerTile = offlineManager.latLngToTile(centerLat, centerLng, zoom);
    
    // Calculate tile range based on radius
    const tileRadius = Math.ceil(radiusKm / (40075 / 256 * Math.pow(2, zoom)));
    
    for (let x = centerTile.x - tileRadius; x <= centerTile.x + tileRadius; x++) {
      for (let y = centerTile.y - tileRadius; y <= centerTile.y + tileRadius; y++) {
        tiles.push({ z: zoom, x, y });
      }
    }

    return tiles;
  },

  /**
   * Convert lat/lng to tile coordinates
   */
  latLngToTile: (lat, lng, zoom) => {
    const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
    const y = Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
    );
    return { x, y };
  },

  /**
   * Get cached emergency data
   */
  getCachedEmergencyData: async (category = null) => {
    try {
      const pois = await offlineCacheService.getCachedPOIs(category);
      return pois;
    } catch (error) {
      console.error('Failed to get cached emergency data:', error);
      return [];
    }
  },

  /**
   * Get cache statistics
   */
  getCacheStats: async () => {
    try {
      const indexedDBStats = await offlineCacheService.getCacheStats();
      
      let serviceWorkerStats = {};
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const channel = new MessageChannel();
        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_CACHE_STATS' },
          [channel.port2]
        );
        
        serviceWorkerStats = await new Promise((resolve) => {
          channel.port1.onmessage = (event) => resolve(event.data);
        });
      }

      return {
        indexedDB: indexedDBStats,
        serviceWorker: serviceWorkerStats,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  },

  /**
   * Clear all cache
   */
  clearCache: async () => {
    try {
      await offlineCacheService.clearAllCache();
      
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const channel = new MessageChannel();
        navigator.serviceWorker.controller.postMessage(
          { type: 'CLEAR_CACHE' },
          [channel.port2]
        );
        
        await new Promise((resolve) => {
          channel.port1.onmessage = (event) => resolve(event.data);
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  },

  /**
   * Check if offline mode is available
   */
  isOfflineAvailable: async () => {
    try {
      const stats = await offlineCacheService.getCacheStats();
      return stats.tileCount > 0 || stats.poiCount > 0;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get cached tile
   */
  getCachedTile: async (url) => {
    try {
      return await offlineCacheService.getCachedTile(url);
    } catch (error) {
      console.error('Failed to get cached tile:', error);
      return null;
    }
  },

  /**
   * Cache tile
   */
  cacheTile: async (url, blob) => {
    try {
      await offlineCacheService.cacheTile(url, blob);
    } catch (error) {
      console.error('Failed to cache tile:', error);
    }
  },
};
