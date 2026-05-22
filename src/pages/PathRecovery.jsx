/**
 * Path Recovery Page - Display last known path with map visualization
 * Battery-optimized tracking with manual controls
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import RecoveryMap from '../components/map/RecoveryMap';
import { useLocationTracker } from '../hooks/useLocationTracker';

const PathRecovery = () => {
  const [showMap, setShowMap] = useState(true);
  const {
    isTracking,
    currentLocation,
    pathHistory,
    error,
    stats,
    startTracking,
    stopTracking,
    clearHistory,
    batteryLevel,
  } = useLocationTracker({
    enabled: false, // Manual start
    updateInterval: 30000, // 30 seconds
    maxAccuracy: 100, // 100 meters
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background pb-24 safe-area-top"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Path <span className="text-neonBlue">Recovery</span>
        </h1>
        <p className="text-gray-400">Track your last known location path</p>
      </motion.div>

      {/* Tracking Controls */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <Card className="border-l-4 border-neonBlue">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Tracking Status</p>
              <p className={`text-xl font-bold ${isTracking ? 'text-neonGreen' : 'text-gray-400'}`}>
                {isTracking ? '● Active' : '○ Inactive'}
              </p>
            </div>
            <div className="text-4xl animate-pulse">
              {isTracking ? '📍' : '⏸️'}
            </div>
          </div>

          <div className="flex gap-2">
            {!isTracking ? (
              <Button variant="primary" size="lg" fullWidth onClick={startTracking}>
                Start Tracking
              </Button>
            ) : (
              <Button variant="danger" size="lg" fullWidth onClick={stopTracking}>
                Stop Tracking
              </Button>
            )}
          </div>

          {batteryLevel !== null && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-400">Battery:</span>
              <div className="flex-1 h-2 bg-surfaceLight rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    batteryLevel > 0.5 ? 'bg-neonGreen' : batteryLevel > 0.2 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${batteryLevel * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{Math.round(batteryLevel * 100)}%</span>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Stats */}
      {stats && stats.totalPoints > 0 && (
        <motion.div variants={itemVariants} className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center py-4">
              <p className="text-2xl font-bold text-neonBlue">{stats.totalPoints}</p>
              <p className="text-xs text-gray-400">Points</p>
            </Card>
            <Card className="text-center py-4">
              <p className="text-2xl font-bold text-neonGreen">{formatDistance(stats.distance)}</p>
              <p className="text-xs text-gray-400">Distance</p>
            </Card>
            <Card className="text-center py-4">
              <p className="text-2xl font-bold text-neonRed">{formatDuration(stats.duration)}</p>
              <p className="text-xs text-gray-400">Duration</p>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Map */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Path Map</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Hide' : 'Show'}
          </Button>
        </div>

        {showMap && (
          <RecoveryMap
            path={pathHistory}
            currentLocation={currentLocation}
            height="300px"
          />
        )}
      </motion.div>

      {/* Current Location */}
      {currentLocation && (
        <motion.div variants={itemVariants} className="px-6 mb-6">
          <Card className="border-l-4 border-neonGreen">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📍</div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Current Location</p>
                <p className="font-semibold text-white">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Accuracy: ±{currentLocation.accuracy?.toFixed(0)}m
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div variants={itemVariants} className="px-6 mb-6">
          <Card className="border-l-4 border-red-600">
            <p className="text-red-400 font-semibold mb-1">Error</p>
            <p className="text-sm text-gray-300">{error.message}</p>
          </Card>
        </motion.div>
      )}

      {/* Clear History */}
      {pathHistory.length > 0 && (
        <motion.div variants={itemVariants} className="px-6 mb-6">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={clearHistory}
          >
            Clear History
          </Button>
        </motion.div>
      )}

      {/* Info */}
      <motion.div variants={itemVariants} className="px-6">
        <Card className="bg-gradient-to-r from-surface to-surfaceLight">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-white mb-1">Battery Optimization</p>
              <p className="text-sm text-gray-300">
                Location updates are debounced and adjusted based on battery level. 
                Only the last 20 points are stored to minimize storage.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PathRecovery;
