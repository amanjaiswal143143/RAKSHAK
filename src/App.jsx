import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Emergency from './pages/Emergency';
import SOS from './pages/SOS';
import Nearby from './pages/Nearby';
import NearbyHelp from './pages/NearbyHelp';
import Guardian from './pages/Guardian';
import PathRecovery from './pages/PathRecovery';
import TrackTrip from './pages/TrackTrip';
import BottomNav from './components/layout/BottomNav';
import { NightModeProvider } from './contexts/NightModeContext';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

const PageWrapper = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/emergency" element={<PageWrapper><Emergency /></PageWrapper>} />
        <Route path="/sos" element={<PageWrapper><SOS /></PageWrapper>} />
        <Route path="/nearby" element={<PageWrapper><Nearby /></PageWrapper>} />
        <Route path="/nearby-help" element={<PageWrapper><NearbyHelp /></PageWrapper>} />
        <Route path="/guardian" element={<PageWrapper><Guardian /></PageWrapper>} />
        <Route path="/path-recovery" element={<PageWrapper><PathRecovery /></PageWrapper>} />
        <Route path="/track/:trackingId" element={<TrackTrip />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const App = () => {
  return (
    <NightModeProvider>
      <Router>
        <AppContent />
      </Router>
    </NightModeProvider>
  );
};

export default App;
