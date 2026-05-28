import React, {
  useState,
  useEffect,
} from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { supabase }
from './supabase/client';

import { NightModeProvider }
from './contexts/NightModeContext';

/* PAGES */

import Home from './pages/Home';
import Auth from './pages/Auth';
import SOS from './pages/SOS';
import Guardian from './pages/Guardian';
import Nearby from './pages/Nearby';
import AIChat from './pages/AIChat';

function App() {

  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(({ data }) => {

        setSession(
          data.session
        );

        setLoading(false);
      });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setSession(session);
      }
    );

    return () => {

      listener.subscription.unsubscribe();
    };

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center text-white">

        Loading...

      </div>
    );
  }

  return (

    <NightModeProvider>

      <Router>

        <Routes>

          {/* DEFAULT */}

          <Route
            path="/"
            element={
              session
                ? <Navigate to="/home" />
                : <Navigate to="/auth" />
            }
          />

          {/* AUTH */}

          <Route
            path="/auth"
            element={
              session
                ? <Navigate to="/home" />
                : <Auth />
            }
          />

          {/* HOME */}

          <Route
            path="/home"
            element={
              session
                ? <Home />
                : <Navigate to="/auth" />
            }
          />

          {/* SOS */}

          <Route
            path="/sos"
            element={
              session
                ? <SOS />
                : <Navigate to="/auth" />
            }
          />

          {/* GUARDIAN */}

          <Route
            path="/guardian"
            element={
              session
                ? <Guardian />
                : <Navigate to="/auth" />
            }
          />

          {/* NEARBY */}

          <Route
            path="/nearby"
            element={
              session
                ? <Nearby />
                : <Navigate to="/auth" />
            }
          />

          {/* AI CHAT */}

          <Route
            path="/ai-chat"
            element={
              session
                ? <AIChat />
                : <Navigate to="/auth" />
            }
          />

        </Routes>

      </Router>

    </NightModeProvider>
  );
}

export default App;