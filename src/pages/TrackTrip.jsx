/**
 * TrackTrip Page - Public tracking page for live trip monitoring
 * Accessible via tracking link without login
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import { tripSharingService } from '../services/api/tripSharing.js';

const TrackTrip = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        const result = await tripSharingService.getTripByTrackingId(trackingId);

        if (result.expired) {
          setError('This tracking link has expired');
          setTripData(result.data);
        } else if (result.completed) {
          setTripData(result.data);
        } else if (result.active) {
          setTripData(result.data);
          setLastUpdate(new Date());

          // Subscribe to real-time updates
          const unsubscribe = tripSharingService.subscribeToUpdates(
            trackingId,
            (updatedData) => {
              setTripData(updatedData);
              setLastUpdate(new Date());
            }
          );

          return () => unsubscribe();
        }
      } catch (err) {
        setError('Trip not found or invalid tracking ID');
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [trackingId]);

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDuration = (dateString) => {
    if (!dateString) return '0m';
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-emergency border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white text-lg">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-l-4 border-red-600">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-2">Trip Not Found</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emergency text-white rounded-xl font-semibold"
            >
              Go to Home
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Live Trip Tracking
          </h1>
          <p className="text-gray-400">
            Tracking ID: <span className="text-neonBlue font-mono">{trackingId}</span>
          </p>
        </motion.div>

        {/* Trip Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className={`border-l-4 ${
            tripData.status === 'completed' ? 'border-neonGreen' : 'border-emergency'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className={`text-xl font-bold ${
                  tripData.status === 'completed' ? 'text-neonGreen' : 'text-emergency'
                }`}>
                  {tripData.status === 'completed' ? 'Trip Completed' : 'In Progress'}
                </p>
              </div>
              <div className="text-4xl animate-pulse">
                {tripData.status === 'completed' ? '✅' : '📍'}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Location Info */}
        {tripData.current_latitude && tripData.current_longitude && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="border-l-4 border-neonBlue">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🗺️</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-2">Current Location</p>
                  <p className="text-white font-mono text-sm mb-1">
                    Lat: {parseFloat(tripData.current_latitude).toFixed(6)}
                  </p>
                  <p className="text-white font-mono text-sm mb-2">
                    Lng: {parseFloat(tripData.current_longitude).toFixed(6)}
                  </p>
                  {tripData.accuracy && (
                    <p className="text-xs text-gray-500">
                      Accuracy: ±{parseFloat(tripData.accuracy).toFixed(0)}m
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Trip Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <Card>
            <p className="text-sm text-gray-400 mb-1">Started</p>
            <p className="text-white font-semibold">{formatTime(tripData.created_at)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-400 mb-1">Duration</p>
            <p className="text-white font-semibold">{formatDuration(tripData.created_at)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-400 mb-1">Last Update</p>
            <p className="text-white font-semibold">{formatTime(tripData.last_updated)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-400 mb-1">Expires</p>
            <p className="text-white font-semibold">{formatTime(tripData.expires_at)}</p>
          </Card>
        </motion.div>

        {/* Trip Notes */}
        {tripData.metadata?.destination && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <Card className="border-l-4 border-neonGreen">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎯</div>
                <div>
                  <p className="text-sm text-gray-400">Destination</p>
                  <p className="text-white font-semibold">{tripData.metadata.destination}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {tripData.metadata?.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <Card>
              <div className="flex items-start gap-3">
                <div className="text-3xl">📝</div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Notes</p>
                  <p className="text-white">{tripData.metadata.notes}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Live Indicator */}
        {tripData.status === 'active' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emergency/10 rounded-full border border-emergency/30">
              <div className="w-2 h-2 bg-emergency rounded-full animate-pulse" />
              <span className="text-emergency text-sm font-semibold">Live Tracking Active</span>
            </div>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </motion.div>
        )}

        {/* Completed Message */}
        {tripData.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neonGreen/10 rounded-full border border-neonGreen/30">
              <span className="text-neonGreen text-sm font-semibold">Trip Completed Safely</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackTrip;
