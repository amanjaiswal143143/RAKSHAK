/**
 * AI Safety Engine - Lightweight safety intelligence
 * Rule-based logic for smart safety decisions without heavy ML
 */

import { riskScoreCalculator } from './riskScoreCalculator.js';

export const aiSafetyEngine = {
  /**
   * Analyze current safety situation
   * @param {Object} context - Current context data
   * @returns {Object} Safety analysis with risk score and recommendations
   */
  analyzeSafety: (context = {}) => {
    const {
      location,
      isNightMode,
      stopDuration,
      networkQuality,
      batteryLevel,
      nearbyServices,
      movementSpeed,
    } = context;

    // Calculate risk score
    const riskAssessment = riskScoreCalculator.calculateRisk({
      isNightTime: isNightMode,
      isolationLevel: context.isolationLevel || 0,
      stopDuration: stopDuration || 0,
      networkQuality: networkQuality || 'good',
      locationAccuracy: location?.accuracy || 10,
      batteryLevel: batteryLevel || 1,
      nearbyEmergencyServices: nearbyServices?.length || 0,
      movementSpeed: movementSpeed || 0,
    });

    // Generate smart suggestions
    const suggestions = aiSafetyEngine.generateSuggestions(context, riskAssessment);

    // Determine emergency priority
    const priority = aiSafetyEngine.determineEmergencyPriority(riskAssessment);

    return {
      riskScore: riskAssessment.score,
      riskLevel: riskAssessment.level,
      riskFactors: riskAssessment.factors,
      suggestions,
      priority,
      timestamp: Date.now(),
    };
  },

  /**
   * Generate smart suggestions based on context
   */
  generateSuggestions: (context, riskAssessment) => {
    const suggestions = [];
    const {
      location,
      isNightMode,
      stopDuration,
      networkQuality,
      batteryLevel,
      nearbyServices,
    } = context;

    // Night time suggestions
    if (isNightMode) {
      suggestions.push({
        type: 'warning',
        priority: 'medium',
        message: 'It\'s nighttime. Stay in well-lit areas and avoid shortcuts.',
        icon: '🌙',
      });

      if (riskAssessment.score > 50) {
        suggestions.push({
          type: 'alert',
          priority: 'high',
          message: 'Night risk elevated. Consider sharing your trip with a guardian.',
          icon: '⚠️',
        });
      }
    }

    // Isolation suggestions
    if (context.isolationLevel > 0.7) {
      suggestions.push({
        type: 'warning',
        priority: 'high',
        message: 'You appear to be in an isolated area. Stay alert.',
        icon: '📍',
      });
    }

    // Long stop suggestions
    if (stopDuration > 15 * 60 * 1000) {
      suggestions.push({
        type: 'alert',
        priority: 'high',
        message: 'You\'ve been stopped for over 15 minutes. Are you safe?',
        icon: '⏱️',
      });
    }

    // Network quality suggestions
    if (networkQuality === 'poor' || networkQuality === 'none') {
      suggestions.push({
        type: 'warning',
        priority: 'medium',
        message: 'Entering low-network zone. Emergency features may be limited.',
        icon: '📶',
      });

      if (networkQuality === 'none') {
        suggestions.push({
          type: 'critical',
          priority: 'critical',
          message: 'No network connection. Offline mode activated.',
          icon: '📵',
        });
      }
    }

    // Battery suggestions
    if (batteryLevel < 0.2) {
      suggestions.push({
        type: 'critical',
        priority: 'high',
        message: 'Battery critically low. Save power and find a charger.',
        icon: '🔋',
      });
    } else if (batteryLevel < 0.5) {
      suggestions.push({
        type: 'warning',
        priority: 'low',
        message: 'Battery below 50%. Consider charging soon.',
        icon: '🔋',
      });
    }

    // Emergency services suggestions
    if (nearbyServices && nearbyServices.length > 0) {
      const nearestHospital = nearbyServices.find(s => s.category === 'hospital');
      if (nearestHospital) {
        const distance = nearestHospital.distance || 0;
        suggestions.push({
          type: 'info',
          priority: 'low',
          message: `Nearest hospital is ${distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`} away.`,
          icon: '🏥',
          action: 'navigate',
          location: nearestHospital,
        });
      }

      const nearestPolice = nearbyServices.find(s => s.category === 'police');
      if (nearestPolice) {
        const distance = nearestPolice.distance || 0;
        suggestions.push({
          type: 'info',
          priority: 'low',
          message: `Nearest police station is ${distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`} away.`,
          icon: '👮',
          action: 'navigate',
          location: nearestPolice,
        });
      }
    }

    // Trip sharing suggestion
    if (riskAssessment.score > 60 && !context.isSharingTrip) {
      suggestions.push({
        type: 'recommendation',
        priority: 'medium',
        message: 'Share your live trip with a guardian for added safety.',
        icon: '📍',
        action: 'shareTrip',
      });
    }

    // Sort suggestions by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  },

  /**
   * Determine emergency priority based on risk assessment
   */
  determineEmergencyPriority: (riskAssessment) => {
    const { score, level } = riskAssessment;

    if (score >= 80 || level === 'critical') {
      return {
        level: 'critical',
        action: 'immediate',
        message: 'Immediate attention required',
      };
    }

    if (score >= 60 || level === 'high') {
      return {
        level: 'high',
        action: 'urgent',
        message: 'Urgent action recommended',
      };
    }

    if (score >= 40 || level === 'medium') {
      return {
        level: 'medium',
        action: 'monitor',
        message: 'Monitor situation',
      };
    }

    return {
      level: 'low',
      action: 'none',
      message: 'Normal safety level',
    };
  },

  /**
   * Get safety trend over time
   */
  getSafetyTrend: (history) => {
    if (!history || history.length < 2) {
      return { trend: 'stable', change: 0 };
    }

    const recent = history.slice(-5);
    const avgRisk = recent.reduce((sum, h) => sum + h.riskScore, 0) / recent.length;
    const prevAvg = history.slice(-10, -5).reduce((sum, h) => sum + h.riskScore, 0) / 5;
    
    const change = avgRisk - prevAvg;

    if (change > 10) return { trend: 'increasing', change };
    if (change < -10) return { trend: 'decreasing', change };
    return { trend: 'stable', change };
  },

  /**
   * Predict future risk (simple rule-based)
   */
  predictRisk: (currentContext, timeHorizonMinutes = 30) => {
    const predictions = [];
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + timeHorizonMinutes * 60 * 1000);
    const futureHour = futureTime.getHours();

    // Predict if it will be night
    const willBeNight = futureHour < 6 || futureHour >= 18;
    if (willBeNight && !currentContext.isNightMode) {
      predictions.push({
        type: 'warning',
        message: `Night will fall in ${timeHorizonMinutes} minutes. Risk will increase.`,
        factor: 'night',
      });
    }

    // Predict battery drain
    const currentBattery = currentContext.batteryLevel || 1;
    const estimatedDrain = 0.05 * (timeHorizonMinutes / 30); // 5% per 30 minutes
    const futureBattery = currentBattery - estimatedDrain;
    if (futureBattery < 0.2) {
      predictions.push({
        type: 'warning',
        message: `Battery may drop below 20% in ${timeHorizonMinutes} minutes.`,
        factor: 'battery',
      });
    }

    return predictions;
  },

  /**
   * Get safety score history
   */
  getScoreHistory: (maxItems = 10) => {
    // In production, this would fetch from IndexedDB or local storage
    // For now, return empty array
    return [];
  },

  /**
   * Add safety score to history
   */
  addToHistory: (safetyAnalysis) => {
    // In production, this would save to IndexedDB or local storage
    console.log('Safety analysis saved to history:', safetyAnalysis);
  },
};
