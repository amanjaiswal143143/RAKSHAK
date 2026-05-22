/**
 * Offline Cache Service - Cache map tiles and POI data for offline access
 * Uses IndexedDB for efficient storage management
 */

const DB_NAME = 'RakshakOfflineDB';
const DB_VERSION = 1;
const STORE_TILES = 'map_tiles';
const STORE_POIS = 'poi_data';
const CACHE_RADIUS = 5000; // 5km radius
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB limit
const TILE_CACHE_DAYS = 7; // Cache tiles for 7 days

export const offlineCacheService = {
  db: null,

  /**
   * Initialize IndexedDB
   */
  initDB: async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        offlineCacheService.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create map tiles store
        if (!db.objectStoreNames.contains(STORE_TILES)) {
          const tileStore = db.createObjectStore(STORE_TILES, { keyPath: 'url' });
          tileStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create POI data store
        if (!db.objectStoreNames.contains(STORE_POIS)) {
          const poiStore = db.createObjectStore(STORE_POIS, { keyPath: 'id' });
          poiStore.createIndex('category', 'category', { unique: false });
          poiStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  },

  /**
   * Cache map tile
   */
  cacheTile: async (url, blob) => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_TILES], 'readwrite');
      const store = transaction.objectStore(STORE_TILES);

      const tile = {
        url,
        blob,
        timestamp: Date.now(),
      };

      const request = store.put(tile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get cached tile
   */
  getCachedTile: async (url) => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_TILES], 'readonly');
      const store = transaction.objectStore(STORE_TILES);
      const request = store.get(url);

      request.onsuccess = () => {
        const tile = request.result;
        if (!tile) {
          resolve(null);
          return;
        }

        // Check if tile is expired
        const age = Date.now() - tile.timestamp;
        if (age > TILE_CACHE_DAYS * 24 * 60 * 60 * 1000) {
          // Delete expired tile
          offlineCacheService.deleteTile(url);
          resolve(null);
          return;
        }

        resolve(tile.blob);
      };

      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Delete tile
   */
  deleteTile: async (url) => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_TILES], 'readwrite');
      const store = transaction.objectStore(STORE_TILES);
      const request = store.delete(url);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Cache POI data
   */
  cachePOIs: async (pois, centerLat, centerLng) => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_POIS], 'readwrite');
      const store = transaction.objectStore(STORE_POIS);

      const poisWithMetadata = pois.map(poi => ({
        ...poi,
        id: `${poi.category}_${poi.id}`,
        centerLat,
        centerLng,
        timestamp: Date.now(),
      }));

      poisWithMetadata.forEach(poi => {
        store.put(poi);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  /**
   * Get cached POIs
   */
  getCachedPOIs: async (category = null) => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_POIS], 'readonly');
      const store = transaction.objectStore(STORE_POIS);

      let request;
      if (category) {
        const index = store.index('category');
        request = index.getAll(category);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        const pois = request.result;
        // Filter out POIs older than 24 hours
        const freshPOIs = pois.filter(
          poi => Date.now() - poi.timestamp < 24 * 60 * 60 * 1000
        );
        resolve(freshPOIs);
      };

      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get cache size
   */
  getCacheSize: async () => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_TILES], 'readonly');
      const store = transaction.objectStore(STORE_TILES);
      const request = store.getAll();

      request.onsuccess = () => {
        const tiles = request.result;
        const size = tiles.reduce((total, tile) => total + tile.blob.size, 0);
        resolve(size);
      };

      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Clear expired tiles
   */
  clearExpiredTiles: async () => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_TILES], 'readwrite');
      const store = transaction.objectStore(STORE_TILES);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'next');

      const expiredThreshold = Date.now() - TILE_CACHE_DAYS * 24 * 60 * 60 * 1000;
      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.timestamp < expiredThreshold) {
            cursor.delete();
            deletedCount++;
          }
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };

      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Clear all cache
   */
  clearAllCache: async () => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = offlineCacheService.db.transaction([STORE_TILES, STORE_POIS], 'readwrite');
      
      transaction.objectStore(STORE_TILES).clear();
      transaction.objectStore(STORE_POIS).clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  /**
   * Check if cache is near limit
   */
  isCacheNearLimit: async () => {
    const size = await offlineCacheService.getCacheSize();
    return size > MAX_CACHE_SIZE * 0.8; // 80% of limit
  },

  /**
   * Get cache statistics
   */
  getCacheStats: async () => {
    if (!offlineCacheService.db) {
      await offlineCacheService.initDB();
    }

    return new Promise((resolve, reject) => {
      const tileTransaction = offlineCacheService.db.transaction([STORE_TILES], 'readonly');
      const tileStore = tileTransaction.objectStore(STORE_TILES);
      const tileRequest = tileStore.count();

      const poiTransaction = offlineCacheService.db.transaction([STORE_POIS], 'readonly');
      const poiStore = poiTransaction.objectStore(STORE_POIS);
      const poiRequest = poiStore.count();

      Promise.all([
        new Promise(r => { tileRequest.onsuccess = () => r(tileRequest.result); }),
        new Promise(r => { poiRequest.onsuccess = () => r(poiRequest.result); }),
        offlineCacheService.getCacheSize(),
      ]).then(([tileCount, poiCount, size]) => {
        resolve({
          tileCount,
          poiCount,
          size,
          sizeFormatted: `${(size / 1024 / 1024).toFixed(2)} MB`,
        });
      }).catch(reject);
    });
  },
};
