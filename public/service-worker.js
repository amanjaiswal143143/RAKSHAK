/**
 * Service Worker for Rakshak AI - Offline Rescue Mode
 * Caches map tiles and essential resources for offline access
 */

const CACHE_NAME = 'rakshak-v1';
const CACHE_VERSION = 'v1';

// Resources to cache on install
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Dynamic cache for map tiles and API responses
const DYNAMIC_CACHE = 'rakshak-dynamic-v1';

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle map tile requests
  if (url.hostname.includes('basemaps.cartocdn.com') || url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request).then((networkResponse) => {
            // Cache the tile for offline use
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle API requests
  if (url.hostname.includes('overpass-api.de')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Check if cache is fresh (less than 1 hour old)
            const cachedDate = cachedResponse.headers.get('date');
            if (cachedDate) {
              const cacheAge = Date.now() - new Date(cachedDate).getTime();
              if (cacheAge < 60 * 60 * 1000) {
                return cachedResponse;
              }
            }
          }

          return fetch(event.request).then((networkResponse) => {
            // Cache API response for 1 hour
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              cache.put(event.request, responseToCache);
            }
            return networkResponse;
          }).catch(() => {
            // Return cached response if network fails
            return cache.match(event.request);
          });
        });
      })
    );
    return;
  }

  // Handle static resources
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache static resources
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});

// Message event - handle messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_TILES') {
    // Cache tiles in a specific area
    cacheTilesInArea(event.data.tiles);
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    // Clear dynamic cache
    caches.delete(DYNAMIC_CACHE).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }

  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    // Get cache statistics
    getCacheStats().then((stats) => {
      event.ports[0].postMessage(stats);
    });
  }
});

// Cache tiles in a specific area
async function cacheTilesInArea(tiles) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachePromises = tiles.map((tileUrl) => {
    return fetch(tileUrl).then((response) => {
      if (response && response.status === 200) {
        cache.put(tileUrl, response);
      }
    });
  });

  await Promise.all(cachePromises);
}

// Get cache statistics
async function getCacheStats() {
  const staticCache = await caches.open(CACHE_NAME);
  const dynamicCache = await caches.open(DYNAMIC_CACHE);

  const staticKeys = await staticCache.keys();
  const dynamicKeys = await dynamicCache.keys();

  let staticSize = 0;
  let dynamicSize = 0;

  for (const request of staticKeys) {
    const response = await staticCache.match(request);
    if (response) {
      const blob = await response.blob();
      staticSize += blob.size;
    }
  }

  for (const request of dynamicKeys) {
    const response = await dynamicCache.match(request);
    if (response) {
      const blob = await response.blob();
      dynamicSize += blob.size;
    }
  }

  return {
    staticSize,
    dynamicSize,
    staticCount: staticKeys.length,
    dynamicCount: dynamicKeys.length,
  };
}
