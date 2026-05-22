/**
 * Nearby Search Service - Search for nearby help locations
 * Uses OpenStreetMap Overpass API for POI data
 */

const SEARCH_RADIUS = 2000; // 2km search radius
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

export const nearbySearchService = {
  /**
   * Search for nearby POIs using Overpass API
   * @param {number} latitude - Current latitude
   * @param {number} longitude - Current longitude
   * @param {Array} categories - POI categories to search
   * @returns {Promise<Array>} Array of POIs
   */
  searchNearby: async (latitude, longitude, categories = []) => {
    try {
      if (!latitude || !longitude) {
        throw new Error('Location coordinates required');
      }

      const query = nearbySearchService.buildOverpassQuery(
        latitude,
        longitude,
        categories
      );

      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      return nearbySearchService.parseOverpassResponse(data);
    } catch (error) {
      console.error('Error searching nearby:', error);
      throw error;
    }
  },

  /**
   * Build Overpass API query
   */
  buildOverpassQuery: (latitude, longitude, categories) => {
    const radius = SEARCH_RADIUS;
    
    // Define category filters
    const categoryFilters = {
      hospital: '["amenity"="hospital"]',
      police: '["amenity"="police"]',
      fuel: '["amenity"="fuel"]',
      towing: '["service"="tow_truck"]',
      pharmacy: '["amenity"="pharmacy"]',
      fire_station: '["amenity"="fire_station"]',
    };

    // Build query for requested categories
    const filters = categories
      .map(cat => categoryFilters[cat])
      .filter(Boolean)
      .join('|');

    const query = `
      [out:json][timeout:25];
      (
        node${filters}(around:${radius},${latitude},${longitude});
      );
      out body;
      >;
      out skel qt;
    `;

    return `data=${encodeURIComponent(query)}`;
  },

  /**
   * Parse Overpass API response
   */
  parseOverpassResponse: (data) => {
    if (!data.elements) return [];

    return data.elements.map(element => {
      const tags = element.tags || {};
      
      // Determine category based on tags
      let category = 'other';
      if (tags.amenity === 'hospital') category = 'hospital';
      else if (tags.amenity === 'police') category = 'police';
      else if (tags.amenity === 'fuel') category = 'fuel';
      else if (tags.service === 'tow_truck') category = 'towing';
      else if (tags.amenity === 'pharmacy') category = 'pharmacy';
      else if (tags.amenity === 'fire_station') category = 'fire_station';

      return {
        id: element.id,
        name: tags.name || 'Unknown',
        category,
        latitude: element.lat,
        longitude: element.lon,
        address: nearbySearchService.formatAddress(tags),
        phone: tags.phone || tags['contact:phone'] || null,
        hours: tags.opening_hours || null,
        distance: null, // Will be calculated by caller
        tags,
      };
    });
  },

  /**
   * Format address from tags
   */
  formatAddress: (tags) => {
    const parts = [];
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  },

  /**
   * Calculate distance between two points
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
   * Get category icon
   */
  getCategoryIcon: (category) => {
    const icons = {
      hospital: '🏥',
      police: '👮',
      fuel: '⛽',
      towing: '🚗',
      pharmacy: '💊',
      fire_station: '🚒',
      other: '📍',
    };
    return icons[category] || icons.other;
  },

  /**
   * Get category color
   */
  getCategoryColor: (category) => {
    const colors = {
      hospital: '#ff4444',
      police: '#4444ff',
      fuel: '#ffaa00',
      towing: '#00aa00',
      pharmacy: '#ff00ff',
      fire_station: '#ff6600',
      other: '#888888',
    };
    return colors[category] || colors.other;
  },

  /**
   * Search by category
   */
  searchByCategory: async (latitude, longitude, category) => {
    return nearbySearchService.searchNearby(latitude, longitude, [category]);
  },

  /**
   * Search all emergency services
   */
  searchEmergencyServices: async (latitude, longitude) => {
    return nearbySearchService.searchNearby(latitude, longitude, [
      'hospital',
      'police',
      'fire_station',
      'pharmacy',
    ]);
  },

  /**
   * Search all services
   */
  searchAllServices: async (latitude, longitude) => {
    return nearbySearchService.searchNearby(latitude, longitude, [
      'hospital',
      'police',
      'fuel',
      'towing',
      'pharmacy',
      'fire_station',
    ]);
  },
};
