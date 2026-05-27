/**
 * Emergency Service - Handles SOS logic and Supabase integration
 */

import { supabase, isSupabaseConfigured } from '../../supabase/client.js';
import { locationService } from './location.js';
import { indexedDBService } from '../offline/indexedDB.js';

export const emergencyService = {
  /**
   * Create emergency record
   * @param {Object} emergencyData - Emergency data
   * @returns {Promise<Object>} Created emergency record
   */
  createEmergency: async (emergencyData = {}) => {
    try {
      // Get current location
      const location = await locationService.getCurrentLocation();
      
      const emergency = {
        id: crypto.randomUUID(),
        type: emergencyData.type || 'SOS',
        status: 'active',
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: new Date().toISOString(),
        metadata: emergencyData.metadata || {},
      };

      // Try to save to Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('emergencies')
            .insert([emergency])
            .select()
            .single();

          if (error) throw error;
          
          // Also save to IndexedDB as backup
          await indexedDBService.saveEmergency(emergency);
          
          return data;
        } catch (supabaseError) {
          console.error('Supabase error, saving locally:', supabaseError);
          // Fallback to IndexedDB only
          await indexedDBService.saveEmergency(emergency);
          return emergency;
        }
      } else {
        // Save to IndexedDB only if Supabase not configured
        await indexedDBService.saveEmergency(emergency);
        return emergency;
      }
    } catch (error) {
      console.error('Error creating emergency:', error);
      
      // Create emergency without location if geolocation fails
      const emergency = {
        id: crypto.randomUUID(),
        type: emergencyData.type || 'SOS',
        status: 'active',
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: new Date().toISOString(),
        metadata: emergencyData.metadata || {},
        error: error.message,
      };

      await indexedDBService.saveEmergency(emergency);
      return emergency;
    }
  },

  /**
   * Update emergency status
   * @param {string} id - Emergency ID
   * @param {string} status - New status
   */
  updateEmergencyStatus: async (id, status) => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('emergencies')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      }
      
      // Update in IndexedDB
      const db = await indexedDBService.initDB();
      const emergency = await db.get('emergencies', id);
      if (emergency) {
        emergency.status = status;
        emergency.updatedAt = new Date().toISOString();
        await db.put('emergencies', emergency);
      }

      return true;
    } catch (error) {
      console.error('Error updating emergency status:', error);
      throw error;
    }
  },

  /**
   * Get emergency by ID
   * @param {string} id - Emergency ID
   */
  getEmergency: async (id) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('emergencies')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } else {
        const db = await indexedDBService.initDB();
        return await db.get('emergencies', id);
      }
    } catch (error) {
      console.error('Error getting emergency:', error);
      throw error;
    }
  },

  /**
   * Sync unsynced emergencies to Supabase
   */
  syncEmergencies: async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, skipping sync');
      return;
    }

    try {
      const unsynced = await indexedDBService.getUnsyncedEmergencies();
      
      for (const emergency of unsynced) {
        try {
          const { error } = await supabase
            .from('emergencies')
            .insert([emergency]);

          if (error) throw error;

          await indexedDBService.markAsSynced(emergency.id);
        } catch (error) {
          console.error(`Error syncing emergency ${emergency.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error syncing emergencies:', error);
    }
  },

  /**
   * Get recent emergencies
   * @param {number} limit - Number of emergencies to fetch
   */
  getRecentEmergencies: async (limit = 10) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('emergencies')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data;
      } else {
        const db = await indexedDBService.initDB();
        const all = await db.getAll('emergencies');
        return all
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit);
      }
    } catch (error) {
      console.error('Error getting recent emergencies:', error);
      throw error;
    }
  },
};
