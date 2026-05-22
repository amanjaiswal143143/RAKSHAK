/**
 * RecoveryMap Component - Lightweight map for path visualization
 * Uses Leaflet with dark theme tiles for emergency UI
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color = '#ff0000') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const startIcon = createCustomIcon('#00ff88');
const endIcon = createCustomIcon('#ff0000');
const pathIcon = createCustomIcon('#00d4ff');

// Component to fit bounds when path changes
const MapBounds = ({ path }) => {
  const map = useMap();

  useEffect(() => {
    if (path && path.length > 0) {
      const bounds = L.latLngBounds(path.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [path, map]);

  return null;
};

const RecoveryMap = ({ path, currentLocation, height = '400px' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !path || path.length === 0) {
    return (
      <div
        className="bg-surface rounded-2xl flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-6">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="text-gray-400 text-sm">No path data available</p>
          <p className="text-gray-500 text-xs mt-1">Start tracking to see your path</p>
        </div>
      </div>
    );
  }

  const pathCoordinates = path.map(p => [p.latitude, p.longitude]);
  const startPosition = pathCoordinates[0];
  const endPosition = pathCoordinates[pathCoordinates.length - 1];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ height }}>
      <MapContainer
        center={endPosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        {/* Dark theme tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Path line */}
        <Polyline
          positions={pathCoordinates}
          color="#00d4ff"
          weight={4}
          opacity={0.8}
          lineCap="round"
          lineJoin="round"
        />

        {/* Start marker */}
        <Marker position={startPosition} icon={startIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-green-400">Start Point</p>
              <p className="text-xs text-gray-400">
                {new Date(path[0].timestamp).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* End marker */}
        <Marker position={endPosition} icon={endIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-red-400">Current Location</p>
              <p className="text-xs text-gray-400">
                {new Date(path[path.length - 1].timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Accuracy: ±{path[path.length - 1].accuracy?.toFixed(0)}m
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Intermediate markers (only if path is long) */}
        {path.length > 5 && path.slice(1, -1).map((point, index) => {
          if (index % 3 === 0) { // Show every 3rd intermediate point
            return (
              <Marker
                key={point.id}
                position={[point.latitude, point.longitude]}
                icon={pathIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-400">Waypoint {index + 1}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(point.timestamp).toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}

        {/* Fit bounds to path */}
        <MapBounds path={path} />
      </MapContainer>
    </div>
  );
};

export default RecoveryMap;
