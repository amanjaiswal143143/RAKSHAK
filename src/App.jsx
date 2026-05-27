import React, { useState, useEffect } from 'react';
import { supabase } from './supabase/client';
import Auth from './pages/Auth';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

/* ---------------- PAGES ---------------- */

import Home from './pages/Home';
import Emergency from './pages/Emergency';
import SOS from './pages/SOS';
import Nearby from './pages/Nearby';
import NearbyHelp from './pages/NearbyHelp';
import Guardian from './pages/Guardian';
import PathRecovery from './pages/PathRecovery';
import TrackTrip from './pages/TrackTrip';
import AIChat from './pages/AIChat';

/* ---------------- COMPONENTS ---------------- */

import BottomNav from './components/layout/BottomNav';
import SplashScreen from './components/common/SplashScreen';

/* ---------------- CONTEXT ---------------- */

import { NightModeProvider } from './contexts/NightModeContext';

/* ---------------- PAGE ANIMATION ---------------- */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 25,
    scale: 0.98,
  },

  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  exit: {
    opacity: 0,
    y: -25,
    scale: 0.98,
  },
};

const pageTransition = {
  duration: 0.35,
  ease: 'easeInOut',
};

const AnimatedPage = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------------- APP ROUTES ---------------- */

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">

      {/* RED GLOW */}
      <div className="fixed top-[-100px] left-[-100px] w-[350px] h-[350px] bg-red-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* CYAN GLOW */}
      <div className="fixed bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* PURPLE GLOW */}
      <div className="fixed top-[40%] left-[40%] w-[250px] h-[250px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 pb-24">

        <Routes>

          {/* AUTH */}
          <Route
            path="/auth"
            element={
              <AnimatedPage>
                <Auth />
              </AnimatedPage>
            }
          />

          {/* HOME */}
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />

          {/* EMERGENCY */}
          <Route
            path="/emergency"
            element={
              <AnimatedPage>
                <Emergency />
              </AnimatedPage>
            }
          />

          {/* SOS */}
          <Route
            path="/sos"
            element={
              <AnimatedPage>
                <SOS />
              </AnimatedPage>
            }
          />

          {/* NEARBY */}
          <Route
            path="/nearby"
            element={
              <AnimatedPage>
                <Nearby />
              </AnimatedPage>
            }
          />

          {/* NEARBY HELP */}
          <Route
            path="/nearby-help"
            element={
              <AnimatedPage>
                <NearbyHelp />
              </AnimatedPage>
            }
          />

          {/* GUARDIAN */}
          <Route
            path="/guardian"
            element={
              <AnimatedPage>
                <Guardian />
              </AnimatedPage>
            }
          />

          {/* PATH RECOVERY */}
          <Route
            path="/path-recovery"
            element={
              <AnimatedPage>
                <PathRecovery />
              </AnimatedPage>
            }
          />

          {/* TRACKING */}
          <Route
            path="/track/:trackingId"
            element={
              <AnimatedPage>
                <TrackTrip />
              </AnimatedPage>
            }
          />

          {/* AI CHAT */}
          <Route
            path="/ai-chat"
            element={
              <AnimatedPage>
                <AIChat />
              </AnimatedPage>
            }
          />

        </Routes>

        {/* BOTTOM NAVIGATION */}
        <BottomNav />

      </div>
    </div>
  );
};

/* ---------------- MAIN APP ---------------- */

function App() {

  const [loading, setLoading] =
    useState(true);

  console.log(supabase);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 1800);

    return () => clearTimeout(timer);

  }, []);

  /* SPLASH SCREEN */

  if (loading) {

    return <SplashScreen />;
  }

  return (
    <NightModeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </NightModeProvider>
  );
}

export default App;