import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

import {
  Shield,
  Battery,
  MapPin,
  Users,
  Phone,
  Navigation,
  WifiOff,
  Brain,
  LogOut,
} from 'lucide-react';

import { supabase }
from '../supabase/client';

import EmergencyActionPanel from '../components/emergency/EmergencyActionPanel';

import AIOrb from '../components/common/AIOrb';

import { useAISafety } from '../hooks/useAISafety.js';

const Home = () => {

  const navigate = useNavigate();

  const {
    safetyAnalysis,
    riskScore,
    riskLevel,
    suggestions,
  } = useAISafety();

  const [isEmergencyPanelOpen, setIsEmergencyPanelOpen] =
    useState(false);

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);

  const [batteryLevel, setBatteryLevel] =
    useState(100);

  useEffect(() => {

    const handleOnline = () =>
      setIsOnline(true);

    const handleOffline = () =>
      setIsOnline(false);

    window.addEventListener(
      'online',
      handleOnline
    );

    window.addEventListener(
      'offline',
      handleOffline
    );

    if (navigator.getBattery) {

      navigator.getBattery().then(
        (battery) => {

          setBatteryLevel(
            Math.round(
              battery.level * 100
            )
          );

          battery.addEventListener(
            'levelchange',
            () => {

              setBatteryLevel(
                Math.round(
                  battery.level * 100
                )
              );
            }
          );
        }
      );
    }

    return () => {

      window.removeEventListener(
        'online',
        handleOnline
      );

      window.removeEventListener(
        'offline',
        handleOffline
      );
    };

  }, []);

  /* LOGOUT */

  const handleLogout =
    async () => {

      await supabase.auth.signOut();

      window.location.href =
        '/auth';
    };

  const quickActions = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Nearby Help',
      action: () => navigate('/nearby'),
      gradient:
        'from-blue-600/20 to-cyan-600/20',
      border:
        'border-cyan-500/20',
    },

    {
      icon: <Users className="w-5 h-5" />,
      label: 'Guardians',
      action: () =>
        navigate('/guardian'),
      gradient:
        'from-purple-600/20 to-pink-600/20',
      border:
        'border-purple-500/20',
    },

    {
      icon: (
        <Navigation className="w-5 h-5" />
      ),
      label: 'Safe Trip',
      action: () =>
        navigate('/guardian'),
      gradient:
        'from-green-600/20 to-emerald-600/20',
      border:
        'border-green-500/20',
    },

    {
      icon: (
        <WifiOff className="w-5 h-5" />
      ),
      label: 'Offline Mode',
      action: () =>
        navigate('/nearby'),
      gradient:
        'from-zinc-700/20 to-zinc-800/20',
      border:
        'border-zinc-500/20',
    },
  ];

  return (

    <div className="min-h-screen bg-black text-white pb-28 overflow-hidden relative">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[140px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-600/10 blur-[120px]" />

      <div className="absolute top-1/3 left-0 w-[250px] h-[250px] bg-purple-600/10 blur-[100px]" />

      {/* HEADER */}

      <div className="relative z-10 px-6 pt-8">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-black tracking-tight">

              Rakshak{' '}

              <span className="text-red-500">
                AI
              </span>

            </h1>

            <p className="text-gray-400 mt-1 text-sm">
              Emergency Protection System
            </p>

          </div>

          <div className="flex flex-col items-end gap-2">

            {/* ONLINE STATUS */}

            <div
              className={`px-4 py-2 rounded-full border backdrop-blur-xl ${
                isOnline
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >

              <div className="flex items-center gap-2">

                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isOnline
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

                <span className="text-xs font-medium">

                  {isOnline
                    ? 'Online'
                    : 'Offline'}

                </span>

              </div>

            </div>

            {/* LOGOUT BUTTON */}

            <button
              onClick={handleLogout}
              className="
                px-3
                py-2
                rounded-xl
                bg-red-500/10
                border
                border-red-500/20
                text-red-400
                text-xs
                font-medium
                backdrop-blur-xl
              "
            >

              Logout

            </button>

          </div>

        </div>

        {/* HEARTBEAT */}

        <div className="mt-5 h-[2px] rounded-full overflow-hidden bg-white/5">

          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="h-full w-40 bg-gradient-to-r from-transparent via-red-500 to-transparent"
          />

        </div>

      </div>

      {/* HERO */}

      <div className="relative z-10 px-6 mt-8">

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 blur-3xl rounded-full" />

          <div className="flex items-center justify-between">

            <div className="flex-1">

              <div className="flex items-center gap-2 mb-3">

                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

                <p className="text-green-400 text-sm font-medium">
                  AI Monitoring Active
                </p>

              </div>

              <h2 className="text-3xl font-bold leading-tight">

                Your Intelligent

                <span className="block text-red-500">
                  Safety Guardian
                </span>

              </h2>

              <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-xs">

                AI-powered emergency assistance,
                offline rescue support, and
                real-time protection during
                critical situations.

              </p>

              {/* HERO BUTTONS */}

              <div className="flex gap-3 mt-5 flex-wrap">

                <button
                  onClick={() =>
                    navigate('/ai-chat')
                  }
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    bg-cyan-500/10
                    border
                    border-cyan-500/20
                    text-cyan-400
                    font-medium
                    backdrop-blur-xl
                  "
                >

                  Talk To AI

                </button>

                <button
                  onClick={() =>
                    navigate('/guardian')
                  }
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    text-purple-300
                    font-medium
                    backdrop-blur-xl
                  "
                >

                  Guardians

                </button>

              </div>

              {/* STATS */}

              <div className="flex gap-3 mt-5">

                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">

                  <p className="text-xs text-gray-400">
                    Response
                  </p>

                  <p className="text-white font-bold">
                    2.1s
                  </p>

                </div>

                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">

                  <p className="text-xs text-gray-400">
                    Safety
                  </p>

                  <p className="text-green-400 font-bold">
                    Active
                  </p>

                </div>

              </div>

            </div>

            <div className="ml-4">

              <AIOrb />

            </div>

          </div>

        </div>

      </div>

       {/* SOS BUTTON */}

      <div className="relative z-10 flex justify-center mt-8">

        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            setIsEmergencyPanelOpen(true)
          }
          className="
            relative
            w-56
            h-56
            rounded-full
            bg-gradient-to-br
            from-red-500
            via-red-600
            to-red-800
            flex
            flex-col
            items-center
            justify-center
            border
            border-red-400/30
            shadow-[0_0_90px_rgba(239,68,68,0.45)]
          "
        >

          <Phone className="w-14 h-14 text-white mb-3" />

          <h2 className="text-3xl font-black tracking-widest">

            SOS

          </h2>

          <p className="text-xs text-white/80 mt-1">

            Emergency Help

          </p>

        </motion.button>

      </div>

      {/* QUICK ACTIONS */}

      <div className="relative z-10 px-6 mt-10">

        <h2 className="text-xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {quickActions.map(
            (action, index) => (

              <motion.button
                key={index}
                whileTap={{
                  scale: 0.96,
                }}
                whileHover={{
                  scale: 1.02,
                }}
                onClick={action.action}
                className={`
                  relative
                  overflow-hidden
                  rounded-3xl
                  p-5
                  text-left
                  border
                  ${action.border}
                  bg-gradient-to-br
                  ${action.gradient}
                  backdrop-blur-2xl
                `}
              >

                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">

                  {action.icon}

                </div>

                <p className="font-semibold text-white">

                  {action.label}

                </p>

              </motion.button>

            )
          )}

        </div>

      </div>

     

      {/* STATUS */}

      <div className="relative z-10 px-6 mt-10">

        <div className="grid grid-cols-2 gap-4">

          <div
            onClick={() =>
              navigate('/guardian')
            }
            className="
              rounded-3xl
              bg-white/[0.04]
              border
              border-white/10
              backdrop-blur-2xl
              p-5
              cursor-pointer
            "
          >

            <div className="flex items-center gap-2 mb-3">

              <Shield className="w-5 h-5 text-purple-400" />

              <span className="text-gray-400 text-sm">

                Guardians

              </span>

            </div>

            <p className="text-white font-bold text-lg">

              Active

            </p>

          </div>

          <div
            className="
              rounded-3xl
              bg-white/[0.04]
              border
              border-white/10
              backdrop-blur-2xl
              p-5
            "
          >

            <div className="flex items-center gap-2 mb-3">

              <Battery className="w-5 h-5 text-green-400" />

              <span className="text-gray-400 text-sm">

                Battery

              </span>

            </div>

            <p className="text-white font-bold text-lg">

              {batteryLevel}%

            </p>

          </div>

        </div>

      </div>

      {/* FLOATING AI */}

      <motion.button
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        whileTap={{
          scale: 0.92,
        }}
        onClick={() =>
          navigate('/ai-chat')
        }
        className="
          fixed
          bottom-32
          right-5
          z-50
          w-16
          h-16
          rounded-full
          bg-gradient-to-br
          from-cyan-400
          to-blue-600
          shadow-[0_0_40px_rgba(34,211,238,0.45)]
          flex
          items-center
          justify-center
          text-white
        "
      >

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >

          <Brain className="w-7 h-7" />

        </motion.div>

      </motion.button>

      {/* EMERGENCY PANEL */}

      <EmergencyActionPanel
        isOpen={isEmergencyPanelOpen}
        onClose={() =>
          setIsEmergencyPanelOpen(false)
        }
      />

    </div>
  );
};

export default Home;