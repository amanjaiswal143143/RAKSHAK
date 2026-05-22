/**
 * NearbyHelp Page - Quick access to nearby emergency services
 * Shows hospitals, police, fuel, towing services on map
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { nearbySearchService } from '../services/api/nearbySearch.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useOfflineMode } from '../hooks/useOfflineMode.js';
import { offlineManager } from '../services/offline/offlineManager.js';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons for different categories
const createCategoryIcon = (category) => {
  const icons = {
    hospital: '🏥',
    police: '👮',
    fuel: '⛽',
    towing: '🚗',
    pharmacy: '💊',
    fire_station: '🚒',
  };
  
  const colors = {
    hospital: '#ff4444',
    police: '#4444ff',
    fuel: '#ffaa00',
    towing: '#00aa00',
    pharmacy: '#ff00ff',
    fire_station: '#ff6600',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${colors[category] || '#888'};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    ">${icons[category] || '📍'}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Component to fit map bounds
const MapBounds = ({ locations, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0 || userLocation) {
      const bounds = L.latLngBounds([
        ...(userLocation ? [[userLocation.latitude, userLocation.longitude]] : []),
        ...locations.map(loc => [loc.latitude, loc.longitude]),
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, userLocation, map]);

  return null;
};

const NearbyHelp = () => {
  const { location } = useGeolocation();
  const { isOffline, formatOfflineDuration } = useOfflineMode();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [usingCachedData, setUsingCachedData] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '📍' },
    { id: 'hospital', name: 'Hospitals', icon: '🏥' },
    { id: 'police', name: 'Police', icon: '👮' },
    { id: 'fuel', name: 'Fuel', icon: '⛽' },
    { id: 'towing', name: 'Towing', icon: '🚗' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
    { id: 'fire_station', name: 'Fire', icon: '🚒' },
  ];

  useEffect(() => {
    const searchNearby = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);
      setUsingCachedData(false);

      try {
        let results;

        // If offline, try to use cached data
        if (isOffline) {
          const cachedPOIs = await offlineManager.getCachedEmergencyData(
            selectedCategory === 'all' ? null : selectedCategory
          );

          if (cachedPOIs.length > 0) {
            results = cachedPOIs;
            setUsingCachedData(true);
          } else {
            throw new Error('No cached data available. Please connect to internet first.');
          }
        } else {
          // Online - fetch fresh data
          if (selectedCategory === 'all') {
            results = await nearbySearchService.searchAllServices(
              location.latitude,
              location.longitude
            );
          } else {
            results = await nearbySearchService.searchByCategory(
              location.latitude,
              location.longitude,
              selectedCategory
            );
          }

          // Cache the results for offline use
          if (results.length > 0) {
            await offlineManager.cacheEmergencyData(location.latitude, location.longitude);
          }
        }

        // Calculate distances
        results = results.map(loc => ({
          ...loc,
          distance: nearbySearchService.calculateDistance(
            location.latitude,
            location.longitude,
            loc.latitude,
            loc.longitude
          ),
        }));

        // Sort by distance
        results.sort((a, b) => a.distance - b.distance);

        setNearbyLocations(results);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    searchNearby();
  }, [location, selectedCategory, isOffline]);

  const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-24 safe-area-top">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">
            Nearby <span className="text-neonBlue">Help</span>
          </h1>
          {isOffline && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-yellow-500 text-xs font-semibold">Offline Mode</span>
            </div>
          )}
        </div>
        <p className="text-gray-400">Find emergency services near you</p>
        {usingCachedData && (
          <p className="text-xs text-yellow-500 mt-1">Using cached data</p>
        )}
      </div>

      {/* Category Filter */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm
                transition-all duration-200
                ${selectedCategory === cat.id
                  ? 'bg-neonBlue text-black'
                  : 'bg-surface text-gray-400 hover:bg-surfaceLight'
                }
              `}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="px-6 mb-6">
        <div className="h-64 rounded-2xl overflow-hidden">
          {location ? (
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              {/* User location */}
              {location && (
                <Marker position={[location.latitude, location.longitude]}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}

              {/* Nearby locations */}
              {nearbyLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={[loc.latitude, loc.longitude]}
                  icon={createCategoryIcon(loc.category)}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{loc.name}</p>
                      <p className="text-xs text-gray-400">{formatDistance(loc.distance)} away</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              <MapBounds locations={nearbyLocations} userLocation={location} />
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-surface">
              <p className="text-gray-400">Getting your location...</p>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-6 mb-6">
          <Card className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-neonBlue border-t-transparent animate-spin" />
            <p className="text-gray-400">Searching nearby...</p>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 mb-6">
          <Card className="border-l-4 border-red-600">
            <p className="text-red-400 font-semibold mb-1">Error</p>
            <p className="text-sm text-gray-300">{error}</p>
          </Card>
        </div>
      )}

      {/* Results List */}
      {!loading && nearbyLocations.length > 0 && (
        <div className="px-6 space-y-3">
          {nearbyLocations.slice(0, 10).map((loc) => (
            <Card
              key={loc.id}
              className="hover:bg-surfaceLight transition-colors cursor-pointer"
              onClick={() => setSelectedLocation(loc)}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">
                  {nearbySearchService.getCategoryIcon(loc.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-white">{loc.name}</p>
                    <span className="text-xs text-neonBlue font-mono">
                      {formatDistance(loc.distance)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{loc.address}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDirections(loc.latitude, loc.longitude)}
                    >
                      🗺️ Directions
                    </Button>
                    {loc.phone && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCall(loc.phone)}
                      >
                        📞 Call
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && nearbyLocations.length === 0 && !error && (
        <div className="px-6">
          <Card className="text-center py-8">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400">No nearby services found</p>
            <p className="text-sm text-gray-500 mt-2">Try expanding your search area</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NearbyHelp;
