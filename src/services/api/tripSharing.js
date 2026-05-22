/**
 * Trip Sharing Service - Generate and manage temporary tracking links
 * No login required, lightweight real-time updates via Supabase
 */

import { supabase } from '../supabase/client.js';

export const tripSharingService = {
  /**
   * Generate a unique tracking ID
   */
  generateTrackingId: () => {
    return crypto.randomUUID().slice(0, 8); // Short 8-character ID
  },

  /**
   * Create a new trip sharing session
   * @param {Object} tripData - Trip information
   * @returns {Promise<Object>} Trip session with tracking ID
   */
  createTrip: async (tripData = {}) => {
    try {
      const trackingId = tripSharingService.generateTrackingId();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      const { data, error } = await supabase
        .from('trip_sharing')
        .insert([
          {
            tracking_id: trackingId,
            status: 'active',
            expires_at: expiresAt.toISOString(),
            metadata: {
              destination: tripData.destination || null,
              notes: tripData.notes || null,
              created_at: new Date().toISOString(),
            },
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        trackingId: data.tracking_id,
        expiresAt: data.expires_at,
        trackingUrl: `${window.location.origin}/track/${data.tracking_id}`,
      };
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  /**
   * Update trip location
   * @param {string} trackingId - Trip tracking ID
   * @param {Object} location - Location data
   */
  updateLocation: async (trackingId, location) => {
    try {
      const { error } = await supabase
        .from('trip_sharing')
        .update({
          current_latitude: location.latitude,
          current_longitude: location.longitude,
          accuracy: location.accuracy,
          last_updated: new Date().toISOString(),
        })
        .eq('tracking_id', trackingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },

  /**
   * End trip and expire link
   * @param {string} trackingId - Trip tracking ID
   */
  endTrip: async (trackingId) => {
    try {
      const { error } = await supabase
        .from('trip_sharing')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('tracking_id', trackingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error ending trip:', error);
      throw error;
    }
  },

  /**
   * Get trip data by tracking ID (public access)
   * @param {string} trackingId - Trip tracking ID
   * @returns {Promise<Object>} Trip data
   */
  getTripByTrackingId: async (trackingId) => {
    try {
      const { data, error } = await supabase
        .from('trip_sharing')
        .select('*')
        .eq('tracking_id', trackingId)
        .single();

      if (error) throw error;

      // Check if trip is expired
      if (new Date(data.expires_at) < new Date()) {
        return { expired: true, data };
      }

      // Check if trip is completed
      if (data.status === 'completed') {
        return { completed: true, data };
      }

      return { active: true, data };
    } catch (error) {
      console.error('Error getting trip:', error);
      throw error;
    }
  },

  /**
   * Subscribe to real-time location updates
   * @param {string} trackingId - Trip tracking ID
   * @param {Function} callback - Callback for updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToUpdates: (trackingId, callback) => {
    const subscription = supabase
      .channel(`trip_${trackingId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trip_sharing',
          filter: `tracking_id=eq.${trackingId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  /**
   * Check if trip is active
   * @param {string} trackingId - Trip tracking ID
   * @returns {Promise<boolean>} True if active
   */
  isTripActive: async (trackingId) => {
    try {
      const result = await tripSharingService.getTripByTrackingId(trackingId);
      return result.active === true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get active trips for user (optional - for dashboard)
   * @returns {Promise<Array>} Active trips
   */
  getActiveTrips: async () => {
    try {
      const { data, error } = await supabase
        .from('trip_sharing')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting active trips:', error);
      return [];
    }
  },
};
