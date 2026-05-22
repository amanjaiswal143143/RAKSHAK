import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNightMode } from '../../contexts/NightModeContext';

const navItems = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/emergency', icon: '🚨', label: 'Emergency' },
  { path: '/sos', icon: '🆘', label: 'SOS' },
  { path: '/nearby-help', icon: '📍', label: 'Nearby' },
  { path: '/guardian', icon: '🛡️', label: 'Guardian' },
  { path: '/path-recovery', icon: '🗺️', label: 'Path' },
];

const BottomNav = () => {
  const location = useLocation();
  const { isNightMode } = useNightMode();

  // Night mode: prioritize SOS, hide less critical items
  const visibleItems = isNightMode
    ? navItems.filter(item => item.path === '/sos' || item.path === '/' || item.path === '/emergency')
    : navItems;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 glass-strong safe-area-bottom z-50 ${isNightMode ? 'border-t-2 border-emergency/30' : ''}`}>
      <div className={`flex justify-around items-center max-w-lg mx-auto ${isNightMode ? 'gap-2' : ''}`}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isEmergency = item.path === '/sos';
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center
                ${isNightMode ? 'py-4 px-6 min-w-[70px]' : 'py-3 px-4 min-w-[60px]'}
                transition-all duration-200
                ${isActive ? 'text-neonRed' : 'text-gray-400'}
                ${isNightMode && isEmergency ? 'text-emergency' : ''}
              `}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.3 : 1,
                  y: isActive ? -6 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`
                  ${isNightMode ? 'text-3xl' : 'text-2xl'} mb-1
                  ${isEmergency ? 'animate-pulse-fast' : ''}
                  ${isNightMode && isEmergency ? 'animate-night-glow' : ''}
                `}
              >
                {item.icon}
              </motion.div>
              <span className={`font-medium ${isNightMode ? 'text-sm' : 'text-xs'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
