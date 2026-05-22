/**
 * Sunset Detection Service - Determines if it's night time
 * Uses geolocation to calculate sunset time for current location
 */

export const sunsetDetectionService = {
  /**
   * Calculate sunset time for given coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {Date} date - Date to calculate for (default: today)
   * @returns {Promise<Date>} Sunset time
   */
  calculateSunset: async (latitude, longitude, date = new Date()) => {
    // Simplified sunset calculation (approximate)
    // For production, use a more accurate library like 'suncalc'
    
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Approximate sunset calculation based on latitude and day of year
    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
    const hourAngle = Math.acos(
      (Math.sin(-0.83 * (Math.PI / 180)) - Math.sin(latitude * (Math.PI / 180)) * Math.sin(declination * (Math.PI / 180))) /
      (Math.cos(latitude * (Math.PI / 180)) * Math.cos(declination * (Math.PI / 180)))
    );
    
    const sunsetHour = 12 - (hourAngle * (180 / Math.PI)) / 15 + (longitude / 15);
    
    const sunset = new Date(date);
    sunset.setHours(Math.floor(sunsetHour), (sunsetHour % 1) * 60, 0, 0);
    
    return sunset;
  },

  /**
   * Check if it's currently night time
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<boolean>} True if it's night
   */
  isNightTime: async (latitude, longitude) => {
    try {
      const now = new Date();
      const sunset = await sunsetDetectionService.calculateSunset(latitude, longitude, now);
      
      // Add 30 minutes buffer after sunset
      const nightStart = new Date(sunset.getTime() + 30 * 60 * 1000);
      
      return now >= nightStart;
    } catch (error) {
      console.error('Error calculating sunset:', error);
      // Fallback: use simple time-based check (6 PM to 6 AM)
      const hour = new Date().getHours();
      return hour < 6 || hour >= 18;
    }
  },

  /**
   * Get time until sunset
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<number>} Minutes until sunset
   */
  getTimeUntilSunset: async (latitude, longitude) => {
    try {
      const now = new Date();
      const sunset = await sunsetDetectionService.calculateSunset(latitude, longitude, now);
      const diff = sunset - now;
      return Math.max(0, Math.floor(diff / (1000 * 60)));
    } catch (error) {
      console.error('Error calculating time until sunset:', error);
      return 0;
    }
  },

  /**
   * Get current light level (0-1)
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<number>} Light level (0 = night, 1 = day)
   */
  getLightLevel: async (latitude, longitude) => {
    try {
      const now = new Date();
      const sunset = await sunsetDetectionService.calculateSunset(latitude, longitude, now);
      
      const nightStart = new Date(sunset.getTime() + 30 * 60 * 1000);
      const nightEnd = new Date(sunset.getTime() - 60 * 60 * 1000); // 1 hour before sunset
      
      if (now < nightEnd) {
        return 1; // Full day
      } else if (now >= nightStart) {
        return 0; // Full night
      } else {
        // Transition period
        const transitionDuration = nightStart - nightEnd;
        const elapsed = now - nightEnd;
        return 1 - (elapsed / transitionDuration);
      }
    } catch (error) {
      console.error('Error calculating light level:', error);
      const hour = new Date().getHours();
      if (hour < 6 || hour >= 18) return 0;
      return 1;
    }
  },
};
