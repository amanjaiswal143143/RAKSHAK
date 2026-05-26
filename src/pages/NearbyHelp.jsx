import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import {
  Navigation,
  Phone,
  MapPin,
  X,
  WifiOff,
  Activity,
  Brain,
  Sparkles,
  Siren,
} from 'lucide-react';

import { nearbySearchService } from '../services/api/nearbySearch.js';

import { useGeolocation } from '../hooks/useGeolocation.js';

import { useOfflineMode } from '../hooks/useOfflineMode.js';

import { offlineManager } from '../services/offline/offlineManager.js';

// Marker Fix
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',

  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Category Icons
const createCategoryIcon = (
  category
) => {
  const icons = {
    hospital: '🏥',
    police: '👮',
    fuel: '⛽',
    towing: '🚗',
    pharmacy: '💊',
    fire_station: '🚒',
  };

  const colors = {
    hospital: '#ef4444',
    police: '#3b82f6',
    fuel: '#f59e0b',
    towing: '#10b981',
    pharmacy: '#a855f7',
    fire_station: '#f97316',
  };

  return L.divIcon({
    className: 'custom-marker',

    html: `
      <div style="
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: ${colors[category]};
        border: 3px solid white;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:22px;
        box-shadow: 0 0 25px ${colors[category]};
      ">
        ${icons[category]}
      </div>
    `,

    iconSize: [48, 48],

    iconAnchor: [24, 24],
  });
};

// User Marker
const createUserLocationIcon =
  () => {
    return L.divIcon({
      className: 'user-marker',

      html: `
      <div style="
        width: 26px;
        height: 26px;
        border-radius:50%;
        background:#22c55e;
        border:4px solid white;
        box-shadow:0 0 30px #22c55e;
      "></div>
    `,

      iconSize: [26, 26],

      iconAnchor: [13, 13],
    });
  };

// Auto Bounds
const MapBounds = ({
  locations,
  userLocation,
}) => {
  const map = useMap();

  useEffect(() => {
    if (
      locations.length > 0 ||
      userLocation
    ) {
      const bounds = L.latLngBounds([
        ...(userLocation
          ? [
              [
                userLocation.latitude,
                userLocation.longitude,
              ],
            ]
          : []),

        ...locations.map((loc) => [
          loc.latitude,
          loc.longitude,
        ]),
      ]);

      map.fitBounds(bounds, {
        padding: [50, 50],
      });
    }
  }, [locations, userLocation, map]);

  return null;
};

const NearbyHelp = () => {
  const { location } =
    useGeolocation();

  const { isOffline } =
    useOfflineMode();

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('all');

  const [
    nearbyLocations,
    setNearbyLocations,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState(null);

  const [
    showLocationDetail,
    setShowLocationDetail,
  ] = useState(false);

  const categories = [
    {
      id: 'all',
      name: 'All',
      icon: '📍',
    },

    {
      id: 'hospital',
      name: 'Hospitals',
      icon: '🏥',
    },

    {
      id: 'police',
      name: 'Police',
      icon: '👮',
    },

    {
      id: 'fuel',
      name: 'Fuel',
      icon: '⛽',
    },

    {
      id: 'towing',
      name: 'Towing',
      icon: '🚗',
    },
  ];

  useEffect(() => {
    const searchNearby =
      async () => {
        if (!location) return;

        setLoading(true);

        try {
          let results;

          if (isOffline) {
            results =
              await offlineManager.getCachedEmergencyData();
          } else {
            if (
              selectedCategory === 'all'
            ) {
              results =
                await nearbySearchService.searchAllServices(
                  location.latitude,
                  location.longitude
                );
            } else {
              results =
                await nearbySearchService.searchByCategory(
                  location.latitude,
                  location.longitude,
                  selectedCategory
                );
            }

            await offlineManager.cacheEmergencyData(
              location.latitude,
              location.longitude
            );
          }

          results = results.map(
            (loc) => ({
              ...loc,

              distance:
                nearbySearchService.calculateDistance(
                  location.latitude,
                  location.longitude,
                  loc.latitude,
                  loc.longitude
                ),
            })
          );

          results.sort(
            (a, b) =>
              a.distance - b.distance
          );

          setNearbyLocations(results);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    searchNearby();
  }, [
    location,
    selectedCategory,
    isOffline,
  ]);

  const formatDistance = (
    meters
  ) => {
    if (meters < 1000)
      return `${Math.round(
        meters
      )}m`;

    return `${(
      meters / 1000
    ).toFixed(1)}km`;
  };

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleDirections = (
    lat,
    lng
  ) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-28 overflow-hidden relative">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-600/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-600/10 blur-[120px]" />

      {/* AI Banner */}
      <div className="relative z-10 px-6 pt-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            relative
            overflow-hidden
            rounded-[32px]
            bg-white/[0.04]
            border
            border-white/10
            backdrop-blur-2xl
            p-5
            mb-5
          "
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full" />

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-cyan-500 blur-xl"
              />

              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

                <p className="text-green-400 text-sm font-medium">
                  Rakshak AI Active
                </p>
              </div>

              <h2 className="text-white text-xl font-bold">
                Nearby Emergency Scan
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                AI is scanning nearby
                hospitals, police stations,
                rescue services, and fuel
                stations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Banner */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            bg-red-500/10
            border
            border-red-500/20
            backdrop-blur-2xl
            p-4
            mb-6
          "
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-red-500 blur-xl"
              />

              <div className="relative w-14 h-14 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <Siren className="w-7 h-7 text-white" />
              </div>
            </div>

            <div>
              <p className="text-red-400 font-bold text-lg">
                Emergency Rescue Mode
              </p>

              <p className="text-gray-300 text-sm mt-1">
                Fastest emergency services
                prioritized using AI.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-4xl font-black">
              Nearby
              <span className="text-cyan-400">
                {' '}
                Help
              </span>
            </h1>

            <p className="text-gray-400 mt-2">
              Emergency services near you
            </p>
          </div>

          {isOffline && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <WifiOff className="w-4 h-4 text-yellow-400" />

              <span className="text-yellow-400 text-sm">
                Offline
              </span>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map((cat) => (
            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              key={cat.id}
              onClick={() =>
                setSelectedCategory(
                  cat.id
                )
              }
              className={`
                flex-shrink-0
                px-5
                py-3
                rounded-2xl
                border
                backdrop-blur-xl
                transition-all
                ${
                  selectedCategory ===
                  cat.id
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }
              `}
            >
              <span className="mr-2">
                {cat.icon}
              </span>

              {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative z-10 px-6 mt-6">
        <div
          className="
            h-[420px]
            rounded-[36px]
            overflow-hidden
            border
            border-white/10
            shadow-[0_0_60px_rgba(59,130,246,0.15)]
          "
        >
          {location ? (
           <MapContainer
  key={`${location.latitude}-${location.longitude}`}
  center={[
    location.latitude,
    location.longitude,
  ]}
              zoom={14}
              style={{
                height: '100%',
                width: '100%',
              }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

              {/* User */}
              <Marker
                position={[
                  location.latitude,
                  location.longitude,
                ]}
                icon={createUserLocationIcon()}
              >
                <Popup>
                  Your Location
                </Popup>
              </Marker>

              {/* Locations */}
              {nearbyLocations.map(
                (loc) => (
                  <Marker
                    key={loc.id}
                    position={[
                      loc.latitude,
                      loc.longitude,
                    ]}
                    icon={createCategoryIcon(
                      loc.category
                    )}
                  >
                    <Popup>
                      {loc.name}
                    </Popup>
                  </Marker>
                )
              )}

              <MapBounds
                locations={
                  nearbyLocations
                }
                userLocation={location}
              />
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-zinc-900">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mb-4" />

                <p className="text-gray-400">
                  Fetching location...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="px-6 mt-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mb-4" />

            <p className="text-gray-400">
              Scanning nearby emergency
              services...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-6 mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5">
            <p className="text-red-400">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      <div className="px-6 mt-6">
        <div className="rounded-[28px] bg-white/[0.04] border border-white/10 backdrop-blur-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <h3 className="text-white font-bold">
                AI Suggestions
              </h3>

              <p className="text-gray-400 text-sm">
                Smart emergency insights
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white text-sm">
                Nearest hospital prioritized
                due to low response time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white text-sm">
                Offline rescue cache is
                available for this area.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {!loading &&
        nearbyLocations.length >
          0 && (
          <div className="px-6 mt-6 space-y-4">
            {nearbyLocations
              .slice(0, 10)
              .map((loc, index) => (
                <motion.div
                  key={loc.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  whileHover={{
                    scale: 1.01,
                  }}
                  onClick={() => {
                    setSelectedLocation(
                      loc
                    );

                    setShowLocationDetail(
                      true
                    );
                  }}
                  className="
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-[32px]
                    p-5
                    backdrop-blur-2xl
                    cursor-pointer
                  "
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-3xl">
                      {nearbySearchService.getCategoryIcon(
                        loc.category
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-white font-bold text-lg">
                          {loc.name}
                        </h3>

                        <span className="text-cyan-400 text-sm font-mono">
                          {formatDistance(
                            loc.distance
                          )}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mt-2">
                        {loc.address}
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            handleDirections(
                              loc.latitude,
                              loc.longitude
                            );
                          }}
                          className="
                          px-4
                          py-2
                          rounded-2xl
                          bg-blue-600
                          text-white
                          text-sm
                        "
                        >
                          Directions
                        </button>

                        {loc.phone && (
                          <button
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();

                              handleCall(
                                loc.phone
                              );
                            }}
                            className="
                            px-4
                            py-2
                            rounded-2xl
                            bg-green-600
                            text-white
                            text-sm
                          "
                          >
                            Call
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}

      {/* Modal */}
      <AnimatePresence>
        {showLocationDetail &&
          selectedLocation && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                onClick={() =>
                  setShowLocationDetail(
                    false
                  )
                }
                className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50"
              />

              <motion.div
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 100,
                  opacity: 0,
                }}
                className="
                fixed
                bottom-4
                left-4
                right-4
                z-50
              "
              >
                <div className="bg-zinc-950 border border-white/10 rounded-[36px] p-6 backdrop-blur-3xl">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-white">
                      {
                        selectedLocation.name
                      }
                    </h2>

                    <button
                      onClick={() =>
                        setShowLocationDetail(
                          false
                        )
                      }
                      className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-cyan-400 mt-1" />

                      <p className="text-gray-300">
                        {
                          selectedLocation.address
                        }
                      </p>
                    </div>

                    {selectedLocation.phone && (
                      <div className="flex gap-3">
                        <Phone className="w-5 h-5 text-green-400 mt-1" />

                        <p className="text-gray-300">
                          {
                            selectedLocation.phone
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={() =>
                        handleDirections(
                          selectedLocation.latitude,
                          selectedLocation.longitude
                        )
                      }
                      className="py-4 rounded-2xl bg-blue-600 text-white font-semibold"
                    >
                      Directions
                    </button>

                    {selectedLocation.phone && (
                      <button
                        onClick={() =>
                          handleCall(
                            selectedLocation.phone
                          )
                        }
                        className="py-4 rounded-2xl bg-green-600 text-white font-semibold"
                      >
                        Call
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
      </AnimatePresence>
    </div>
  );
};

export default NearbyHelp;