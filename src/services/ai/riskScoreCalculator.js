/**
 * Risk Score Calculator - Lightweight rule-based risk assessment
 * Calculates safety risk based on multiple factors without heavy ML
 */

export const riskScoreCalculator = {
  /**
   * Calculate overall risk score (0-100)
   * @param {Object} factors - Risk factors
   * @returns {Object} Risk assessment with score and level
   */
  calculateRisk: (factors = {}) => {
    const {
      isNightTime = false,
      isolationLevel = 0, // 0-1
      stopDuration = 0, // milliseconds
      networkQuality = 'good', // 'good', 'fair', 'poor'
      locationAccuracy = 10, // meters
      batteryLevel = 1, // 0-1
      nearbyEmergencyServices = 0, // count
      movementSpeed = 0, // km/h
    } = factors;

    // Calculate individual risk factors (0-100 each)
    const nightRisk = riskScoreCalculator.calculateNightRisk(isNightTime);
    const isolationRisk = riskScoreCalculator.calculateIsolationRisk(isolationLevel);
    const stopRisk = riskScoreCalculator.calculateStopRisk(stopDuration);
    const networkRisk = riskScoreCalculator.calculateNetworkRisk(networkQuality);
    const batteryRisk = riskScoreCalculator.calculateBatteryRisk(batteryLevel);
    const locationRisk = riskScoreCalculator.calculateLocationRisk(locationAccuracy);
    const emergencyRisk = riskScoreCalculator.calculateEmergencyRisk(nearbyEmergencyServices);
    const movementRisk = riskScoreCalculator.calculateMovementRisk(movementSpeed);

    // Weighted average of all factors
    const weights = {
      night: 0.25,
      isolation: 0.20,
      stop: 0.15,
      network: 0.10,
      battery: 0.10,
      location: 0.05,
      emergency: 0.10,
      movement: 0.05,
    };

    const weightedScore =
      nightRisk * weights.night +
      isolationRisk * weights.isolation +
      stopRisk * weights.stop +
      networkRisk * weights.network +
      batteryRisk * weights.battery +
      locationRisk * weights.location +
      emergencyRisk * weights.emergency +
      movementRisk * weights.movement;

    const score = Math.min(100, Math.max(0, weightedScore));
    const level = riskScoreCalculator.getRiskLevel(score);

    return {
      score: Math.round(score),
      level,
      factors: {
        night: { score: nightRisk, weight: weights.night },
        isolation: { score: isolationRisk, weight: weights.isolation },
        stop: { score: stopRisk, weight: weights.stop },
        network: { score: networkRisk, weight: weights.network },
        battery: { score: batteryRisk, weight: weights.battery },
        location: { score: locationRisk, weight: weights.location },
        emergency: { score: emergencyRisk, weight: weights.emergency },
        movement: { score: movementRisk, weight: weights.movement },
      },
    };
  },

  /**
   * Calculate night time risk
   */
  calculateNightRisk: (isNightTime) => {
    if (!isNightTime) return 0;
    const hour = new Date().getHours();
    
    // Higher risk late at night
    if (hour >= 22 || hour < 4) return 90; // 10 PM - 4 AM
    if (hour >= 20 || hour < 6) return 70; // 8 PM - 6 AM
    return 50; // 6 PM - 8 PM
  },

  /**
   * Calculate isolation risk
   */
  calculateIsolationRisk: (isolationLevel) => {
    // isolationLevel: 0 (safe) to 1 (very isolated)
    return isolationLevel * 100;
  },

  /**
   * Calculate stop duration risk
   */
  calculateStopRisk: (stopDuration) => {
    // stopDuration in milliseconds
    if (stopDuration < 5 * 60 * 1000) return 0; // < 5 minutes
    if (stopDuration < 15 * 60 * 1000) return 30; // 5-15 minutes
    if (stopDuration < 30 * 60 * 1000) return 60; // 15-30 minutes
    if (stopDuration < 60 * 60 * 1000) return 80; // 30-60 minutes
    return 100; // > 1 hour
  },

  /**
   * Calculate network quality risk
   */
  calculateNetworkRisk: (networkQuality) => {
    switch (networkQuality) {
      case 'good': return 0;
      case 'fair': return 30;
      case 'poor': return 70;
      case 'none': return 100;
      default: return 50;
    }
  },

  /**
   * Calculate battery risk
   */
  calculateBatteryRisk: (batteryLevel) => {
    if (batteryLevel > 0.5) return 0;
    if (batteryLevel > 0.2) return 30;
    if (batteryLevel > 0.1) return 70;
    return 100;
  },

  /**
   * Calculate location accuracy risk
   */
  calculateLocationRisk: (accuracy) => {
    // accuracy in meters
    if (accuracy < 50) return 0;
    if (accuracy < 100) return 20;
    if (accuracy < 200) return 50;
    return 80;
  },

  /**
   * Calculate emergency services risk
   */
  calculateEmergencyRisk: (nearbyEmergencyServices) => {
    // nearbyEmergencyServices: count of nearby emergency services
    if (nearbyEmergencyServices >= 5) return 0;
    if (nearbyEmergencyServices >= 3) return 20;
    if (nearbyEmergencyServices >= 1) return 50;
    return 100;
  },

  /**
   * Calculate movement risk
   */
  calculateMovementRisk: (movementSpeed) => {
    // movementSpeed in km/h
    if (movementSpeed > 5) return 0; // Moving normally
    if (movementSpeed > 0) return 30; // Moving slowly
    return 50; // Stationary
  },

  /**
   * Get risk level from score
   */
  getRiskLevel: (score) => {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'medium';
    return 'low';
  },

  /**
   * Get risk level color
   */
  getRiskLevelColor: (level) => {
    switch (level) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6600';
      case 'medium': return '#ffcc00';
      case 'low': return '#00ff00';
      default: return '#888888';
    }
  },

  /**
   * Get risk level icon
   */
  getRiskLevelIcon: (level) => {
    switch (level) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  },
};
