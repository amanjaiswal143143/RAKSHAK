import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { tripSharingService } from '../services/api/tripSharing.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useTripTracking } from '../hooks/useTripTracking.js';

const Guardian = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [trackingUrl, setTrackingUrl] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const { location } = useGeolocation();
  
  // Enable real-time location updates when sharing is active
  const { isTracking } = useTripTracking(trackingId, isSharing);
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

  const guardians = [
    { name: 'Father', phone: '+91 98765 43210', status: 'online', lastSeen: '2 min ago' },
    { name: 'Mother', phone: '+91 98765 43211', status: 'online', lastSeen: '5 min ago' },
    { name: 'Sister', phone: '+91 98765 43212', status: 'offline', lastSeen: '1 hour ago' },
  ];

  const handleShareTrip = async () => {
    try {
      const trip = await tripSharingService.createTrip({
        destination: destination || null,
        notes: notes || null,
      });
      setTrackingUrl(trip.trackingUrl);
      setTrackingId(trip.trackingId);
      setIsSharing(true);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing trip:', error);
      alert('Failed to create trip. Please try again.');
    }
  };

  const handleEndTrip = async () => {
    if (trackingId) {
      try {
        await tripSharingService.endTrip(trackingId);
        setIsSharing(false);
        setTrackingUrl('');
        setTrackingId('');
        setShowShareModal(false);
      } catch (error) {
        console.error('Error ending trip:', error);
      }
    }
  };

  const copyTrackingUrl = () => {
    navigator.clipboard.writeText(trackingUrl);
    alert('Tracking link copied to clipboard!');
  };

  const shareTrackingUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Track my trip',
          text: 'Follow my live location',
          url: trackingUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyTrackingUrl();
    }
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
          Guardian <span className="text-neonGreen">Tracking</span>
        </h1>
        <p className="text-gray-400">Manage your emergency contacts</p>
      </motion.div>

      {/* My Location Status */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <Card className="border-l-4 border-neonGreen">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">My Location</p>
              <p className="font-semibold text-white">Sharing with guardians</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neonGreen rounded-full animate-pulse"></div>
              <span className="text-sm text-neonGreen">Active</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" fullWidth>
              Pause Sharing
            </Button>
            <Button variant="primary" size="sm" fullWidth>
              Update Location
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Add Guardian Button */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <Button variant="primary" size="lg" fullWidth onClick={() => setShowShareModal(true)}>
          + Add Guardian
        </Button>
      </motion.div>

      {/* Share Trip Button */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <Button 
          variant={isSharing ? 'danger' : 'success'} 
          size="lg" 
          fullWidth
          onClick={isSharing ? handleEndTrip : handleShareTrip}
        >
          {isSharing ? '🛑 End Trip Sharing' : '📍 Share Trip'}
        </Button>
      </motion.div>

      {/* Guardians List */}
      <motion.div variants={itemVariants} className="px-6">
        <h2 className="text-lg font-semibold text-white mb-4">My Guardians</h2>
        <div className="space-y-3">
          {guardians.map((guardian, index) => (
            <Card key={index} className="hover:bg-surfaceLight transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surfaceLight rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <p className="font-semibold text-white">{guardian.name}</p>
                    <p className="text-sm text-gray-400">{guardian.phone}</p>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  guardian.status === 'online' 
                    ? 'bg-neonGreen bg-opacity-20 text-neonGreen' 
                    : 'bg-gray-600 bg-opacity-20 text-gray-400'
                }`}>
                  {guardian.status}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last seen: {guardian.lastSeen}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Call</Button>
                  <Button variant="ghost" size="sm">Message</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Location History */}
      <motion.div variants={itemVariants} className="px-6 mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Location Updates</h2>
        <Card className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-glassBorder">
            <div className="w-2 h-2 bg-neonGreen rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-white">Location shared</p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-glassBorder">
            <div className="w-2 h-2 bg-neonBlue rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-white">Emergency alert sent</p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-white">Location paused</p>
              <p className="text-xs text-gray-400">3 hours ago</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Safety Tips */}
      <motion.div variants={itemVariants} className="px-6 mt-6">
        <Card className="bg-gradient-to-r from-surface to-surfaceLight">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-white mb-1">Guardian Tips</p>
              <p className="text-sm text-gray-300">
                Keep your guardians updated about your location. In emergencies, they'll be notified automatically.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Share Trip Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <Card className="border-2 border-neonGreen bg-surface">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {isSharing ? 'Trip Sharing Active' : 'Share Your Trip'}
                  </h2>

                  {isSharing ? (
                    <div className="space-y-4">
                      <div className="bg-neonGreen/10 rounded-lg p-4 border border-neonGreen/30">
                        <p className="text-sm text-gray-400 mb-1">Tracking Link</p>
                        <p className="text-neonGreen font-mono text-sm break-all">
                          {trackingUrl}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="primary" size="lg" fullWidth onClick={copyTrackingUrl}>
                          📋 Copy Link
                        </Button>
                        <Button variant="success" size="lg" fullWidth onClick={shareTrackingUrl}>
                          📤 Share
                        </Button>
                      </div>

                      <Button variant="danger" size="lg" fullWidth onClick={handleEndTrip}>
                        🛑 End Trip
                      </Button>

                      <Button variant="ghost" size="lg" fullWidth onClick={() => setShowShareModal(false)}>
                        Close
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Destination (Optional)</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="e.g., Home, Office, Gym"
                          className="w-full px-4 py-3 bg-surfaceLight border border-glassBorder rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Notes (Optional)</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any notes about your trip..."
                          rows={3}
                          className="w-full px-4 py-3 bg-surfaceLight border border-glassBorder rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="success" size="lg" fullWidth onClick={handleShareTrip}>
                          📍 Start Sharing
                        </Button>
                        <Button variant="ghost" size="lg" fullWidth onClick={() => setShowShareModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Guardian;
