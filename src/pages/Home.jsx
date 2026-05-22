import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAISafety } from '../hooks/useAISafety.js';
import { riskScoreCalculator } from '../services/ai/riskScoreCalculator.js';

const Home = () => {
  const navigate = useNavigate();
  const { safetyAnalysis, riskScore, riskLevel, suggestions } = useAISafety();

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background pb-24 safe-area-top"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="p-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          Rakshak <span className="text-neonRed text-glow">AI</span>
        </h1>
        <p className="text-gray-400">Your Emergency Response Companion</p>
      </motion.div>

      {/* AI Safety Score */}
      {safetyAnalysis && (
        <motion.div variants={itemVariants} className="px-6 mb-6">
          <Card className={`border-l-4 ${
            riskLevel === 'critical' ? 'border-red-600' :
            riskLevel === 'high' ? 'border-orange-500' :
            riskLevel === 'medium' ? 'border-yellow-500' :
            'border-neonGreen'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">AI Safety Score</p>
                <p className="text-3xl font-bold text-white">
                  {riskScore}/100
                  <span className="text-lg ml-2">
                    {riskScoreCalculator.getRiskLevelIcon(riskLevel)}
                  </span>
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                riskLevel === 'critical' ? 'bg-red-600 text-white' :
                riskLevel === 'high' ? 'bg-orange-500 text-white' :
                riskLevel === 'medium' ? 'bg-yellow-500 text-black' :
                'bg-neonGreen text-black'
              }`}>
                {riskLevel.toUpperCase()}
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  riskLevel === 'critical' ? 'bg-red-600' :
                  riskLevel === 'high' ? 'bg-orange-500' :
                  riskLevel === 'medium' ? 'bg-yellow-500' :
                  'bg-neonGreen'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* AI Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <motion.div variants={itemVariants} className="px-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">AI Suggestions</h2>
          <div className="space-y-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <Card key={index} className={`border-l-4 ${
                suggestion.priority === 'critical' ? 'border-red-600' :
                suggestion.priority === 'high' ? 'border-orange-500' :
                suggestion.priority === 'medium' ? 'border-yellow-500' :
                'border-neonBlue'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{suggestion.icon}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{suggestion.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Emergency Status Card */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <Card className="border-l-4 border-emergency">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">System Status</p>
              <p className="text-xl font-bold text-neonGreen">● Online</p>
            </div>
            <div className="text-4xl animate-pulse-slow">🛡️</div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card hover onClick={() => navigate('/sos')} className="text-center py-8">
            <div className="text-5xl mb-3">🆘</div>
            <p className="font-semibold text-emergency">SOS</p>
          </Card>
          <Card hover onClick={() => navigate('/emergency')} className="text-center py-8">
            <div className="text-5xl mb-3">🚨</div>
            <p className="font-semibold">Emergency</p>
          </Card>
          <Card hover onClick={() => navigate('/nearby')} className="text-center py-8">
            <div className="text-5xl mb-3">📍</div>
            <p className="font-semibold">Nearby Help</p>
          </Card>
          <Card hover onClick={() => navigate('/guardian')} className="text-center py-8">
            <div className="text-5xl mb-3">🛡️</div>
            <p className="font-semibold">Guardian</p>
          </Card>
        </div>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h2>
        <Card className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-glassBorder">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👮</span>
              <div>
                <p className="font-semibold">Police</p>
                <p className="text-sm text-gray-400">100</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Call</Button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-glassBorder">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚑</span>
              <div>
                <p className="font-semibold">Ambulance</p>
                <p className="text-sm text-gray-400">108</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Call</Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-semibold">Fire</p>
                <p className="text-sm text-gray-400">101</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Call</Button>
          </div>
        </Card>
      </motion.div>

      {/* Safety Tips */}
      <motion.div variants={itemVariants} className="px-6">
        <h2 className="text-lg font-semibold text-white mb-4">Safety Tips</h2>
        <Card className="bg-gradient-to-r from-surface to-surfaceLight">
          <p className="text-gray-300 text-sm leading-relaxed">
            In case of emergency, stay calm. Use the SOS button for immediate assistance. 
            Your location will be shared with emergency services automatically.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Home;
