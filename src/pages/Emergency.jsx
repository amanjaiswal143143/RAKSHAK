import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Emergency = () => {
  const navigate = useNavigate();

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

  const emergencyTypes = [
    { icon: '🚗', title: 'Road Accident', color: 'bg-red-600' },
    { icon: '🏥', title: 'Medical Emergency', color: 'bg-blue-600' },
    { icon: '🔥', title: 'Fire', color: 'bg-orange-600' },
    { icon: '👮', title: 'Police Help', color: 'bg-purple-600' },
    { icon: '🌪️', title: 'Natural Disaster', color: 'bg-green-600' },
    { icon: '⚠️', title: 'Other Emergency', color: 'bg-yellow-600' },
  ];

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
          Emergency <span className="text-emergency">Dashboard</span>
        </h1>
        <p className="text-gray-400">Report an emergency quickly</p>
      </motion.div>

      {/* Current Location */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <Card className="border-l-4 border-neonBlue">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📍</div>
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Current Location</p>
              <p className="font-semibold text-white">Detecting location...</p>
            </div>
            <div className="w-3 h-3 bg-neonGreen rounded-full animate-pulse"></div>
          </div>
        </Card>
      </motion.div>

      {/* Emergency Types */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Select Emergency Type</h2>
        <div className="grid grid-cols-2 gap-4">
          {emergencyTypes.map((type, index) => (
            <Card
              key={index}
              hover
              className={`text-center py-6 ${type.color} bg-opacity-20 border-2 border-opacity-30`}
              style={{ borderColor: type.color.replace('bg-', '') }}
            >
              <div className="text-4xl mb-2">{type.icon}</div>
              <p className="font-semibold text-sm">{type.title}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Quick SOS */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <Button
          variant="danger"
          size="xl"
          fullWidth
          onClick={() => navigate('/sos')}
          className="animate-glow"
        >
          🆘 IMMEDIATE SOS
        </Button>
      </motion.div>

      {/* Recent Reports */}
      <motion.div variants={itemVariants} className="px-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Reports</h2>
        <Card className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-glassBorder">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emergency bg-opacity-20 rounded-full flex items-center justify-center">
                🚗
              </div>
              <div>
                <p className="font-semibold text-sm">Road Accident</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-neonGreen bg-opacity-20 text-neonGreen rounded-full">
              Resolved
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center">
                🏥
              </div>
              <div>
                <p className="font-semibold text-sm">Medical Emergency</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-neonGreen bg-opacity-20 text-neonGreen rounded-full">
              Resolved
            </span>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Emergency;
