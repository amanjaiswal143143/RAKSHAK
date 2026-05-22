/**
 * IndexedDB Service - Offline storage for emergency data
 */

import { openDB } from 'idb';

const DB_NAME = 'RakshakDB';
const DB_VERSION = 1;
const STORE_NAME = 'emergencies';

export const indexedDBService = {
  /**
   * Initialize IndexedDB
   */
  initDB: async () => {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('synced', 'synced');
        }
      },
    });
  },

  /**
   * Save emergency data to IndexedDB
   * @param {Object} emergencyData - Emergency data to save
   */
  saveEmergency: async (emergencyData) => {
    try {
      const db = await indexedDBService.initDB();
      const data = {
        ...emergencyData,
        synced: false,
        createdAt: new Date().toISOString(),
      };
      await db.put(STORE_NAME, data);
      return data;
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Get all emergencies from IndexedDB
   */
  getAllEmergencies: async () => {
    try {
      const db = await indexedDBService.initDB();
      return await db.getAll(STORE_NAME);
    } catch (error) {
      console.error('Error getting emergencies from IndexedDB:', error);
      throw error;
    }
  },

  /**
   * Get unsynced emergencies
   */
  getUnsyncedEmergencies: async () => {
    try {
      const db = await indexedDBService.initDB();
      const allEmergencies = await db.getAllFromIndex(STORE_NAME, 'synced', false);
      return allEmergencies;
    } catch (error) {
      console.error('Error getting unsynced emergencies:', error);
      throw error;
    }
  },

  /**
   * Mark emergency as synced
   * @param {string} id - Emergency ID
   */
  markAsSynced: async (id) => {
    try {
      const db = await indexedDBService.initDB();
      const emergency = await db.get(STORE_NAME, id);
      if (emergency) {
        emergency.synced = true;
        emergency.syncedAt = new Date().toISOString();
        await db.put(STORE_NAME, emergency);
      }
    } catch (error) {
      console.error('Error marking emergency as synced:', error);
      throw error;
    }
  },

  /**
   * Delete emergency from IndexedDB
   * @param {string} id - Emergency ID
   */
  deleteEmergency: async (id) => {
    try {
      const db = await indexedDBService.initDB();
      await db.delete(STORE_NAME, id);
    } catch (error) {
      console.error('Error deleting emergency:', error);
      throw error;
    }
  },

  /**
   * Clear all emergencies (for testing)
   */
  clearAll: async () => {
    try {
      const db = await indexedDBService.initDB();
      await db.clear(STORE_NAME);
    } catch (error) {
      console.error('Error clearing emergencies:', error);
      throw error;
    }
  },
};
