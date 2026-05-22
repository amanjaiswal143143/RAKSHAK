/**
 * useOfflineMode Hook - Detect offline/online status
 * Provides offline state and network status information
 */

import { useState, useEffect } from 'react';

export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastOnline, setLastOnline] = useState(Date.now());
  const [networkType, setNetworkType] = useState('unknown');

  useEffect(() => {
    // Check initial network type
    if (navigator.connection) {
      setNetworkType(navigator.connection.effectiveType);
    }

    const handleOnline = () => {
      setIsOffline(false);
      setLastOnline(Date.now());
      if (navigator.connection) {
        setNetworkType(navigator.connection.effectiveType);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleConnectionChange = () => {
      if (navigator.connection) {
        setNetworkType(navigator.connection.effectiveType);
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  const getOfflineDuration = () => {
    return isOffline ? Date.now() - lastOnline : 0;
  };

  const formatOfflineDuration = (ms) => {
    if (ms === 0) return 'Online';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return {
    isOffline,
    lastOnline,
    networkType,
    getOfflineDuration,
    formatOfflineDuration,
  };
};
