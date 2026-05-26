import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  X,
  Phone,
  MapPin,
  Shield,
  WifiOff,
  Brain,
  Navigation,
  Users,
  Activity,
  Siren,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const EmergencyActionPanel = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const emergencyActions = [
    {
      id: 'sos',
      icon: <Siren className="w-7 h-7" />,
      title: 'Emergency SOS',
      description:
        'Trigger instant emergency response',
      color:
        'from-red-500 via-red-600 to-red-700',
      glow: 'shadow-red-500/30',
      action: () => navigate('/sos'),
      priority: 'critical',
    },

    {
      id: 'location',
      icon: <MapPin className="w-7 h-7" />,
      title: 'Share Location',
      description:
        'Send live coordinates instantly',
      color:
        'from-blue-500 via-cyan-500 to-blue-700',
      glow: 'shadow-cyan-500/30',
      action: () => navigate('/guardian'),
      priority: 'high',
    },

    {
      id: 'hospital',
      icon: (
        <Navigation className="w-7 h-7" />
      ),
      title: 'Nearby Hospitals',
      description:
        'Find closest emergency care',
      color:
        'from-green-500 via-emerald-500 to-green-700',
      glow: 'shadow-green-500/30',
      action: () => navigate('/nearby'),
      priority: 'high',
    },

    {
      id: 'guardian',
      icon: <Users className="w-7 h-7" />,
      title: 'Guardian Alert',
      description:
        'Notify trusted contacts',
      color:
        'from-purple-500 via-pink-500 to-purple-700',
      glow: 'shadow-purple-500/30',
      action: () => navigate('/guardian'),
      priority: 'medium',
    },

    {
      id: 'offline',
      icon: <WifiOff className="w-7 h-7" />,
      title: 'Offline Rescue',
      description:
        'Emergency access without internet',
      color:
        'from-zinc-600 via-zinc-700 to-zinc-800',
      glow: 'shadow-zinc-500/30',
      action: () => navigate('/nearby'),
      priority: 'medium',
    },

    {
      id: 'ai',
      icon: <Brain className="w-7 h-7" />,
      title: 'Rakshak AI',
      description:
        'Emergency AI assistant guidance',
      color:
        'from-cyan-500 via-blue-500 to-cyan-700',
      glow: 'shadow-cyan-500/30',
      action: () => navigate('/ai-chat'),
      priority: 'low',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow =
        'hidden';
    } else {
      document.body.style.overflow =
        'unset';
    }

    return () => {
      document.body.style.overflow =
        'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              bg-black/70
              backdrop-blur-xl
              z-50
            "
          />

          {/* Panel */}
          <motion.div
            initial={{
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: '100%',
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="
              fixed
              bottom-0
              left-0
              right-0
              z-50
              rounded-t-[40px]
              border-t
              border-white/10
              bg-black/95
              backdrop-blur-3xl
              overflow-hidden
              max-h-[92vh]
              overflow-y-auto
            "
          >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-red-500/10 blur-[120px]" />

            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-16 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="relative z-10 px-6 pt-4 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black text-white">
                      Emergency
                    </h2>

                    <span className="text-red-500 text-3xl font-black">
                      Actions
                    </span>
                  </div>

                  <p className="text-gray-400 mt-2">
                    Fast emergency response
                    system
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* AI Status */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  relative
                  overflow-hidden
                  mt-6
                  rounded-[32px]
                  bg-white/[0.04]
                  border
                  border-white/10
                  backdrop-blur-2xl
                  p-5
                "
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />

                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 rounded-full bg-cyan-500 blur-xl"
                    />

                    <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

                      <p className="text-green-400 text-sm font-medium">
                        Rakshak AI Active
                      </p>
                    </div>

                    <h3 className="text-white font-bold text-lg">
                      Intelligent Emergency
                      Protection
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      AI-powered rescue guidance,
                      offline support, and live
                      safety response.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="relative z-10 px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                {emergencyActions.map(
                  (action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      whileHover={{
                        scale: 1.02,
                      }}
                      onClick={() => {
                        action.action();
                        onClose();
                      }}
                      className={`
                        relative
                        overflow-hidden
                        rounded-[32px]
                        p-5
                        text-left
                        bg-gradient-to-br
                        ${action.color}
                        shadow-2xl
                        ${action.glow}
                      `}
                    >
                      {/* Priority Pulse */}
                      {action.priority ===
                        'critical' && (
                        <motion.div
                          animate={{
                            scale: [
                              1,
                              1.3,
                              1,
                            ],
                            opacity: [
                              0.5,
                              1,
                              0.5,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat:
                              Infinity,
                          }}
                          className="absolute top-3 right-3 w-3 h-3 rounded-full bg-white"
                        />
                      )}

                      {/* Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                      {/* Icon */}
                      <div className="relative w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center mb-4">
                        {action.icon}
                      </div>

                      {/* Text */}
                      <div className="relative">
                        <h3 className="text-white font-bold text-base leading-tight">
                          {action.title}
                        </h3>

                        <p className="text-white/80 text-xs mt-2 leading-relaxed">
                          {
                            action.description
                          }
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="relative flex justify-end mt-5">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </motion.button>
                  )
                )}
              </div>

              {/* Emergency Notice */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  relative
                  overflow-hidden
                  mt-6
                  rounded-[32px]
                  bg-red-500/10
                  border
                  border-red-500/20
                  backdrop-blur-2xl
                  p-5
                "
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />

                <div className="relative flex gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-7 h-7 text-red-400" />
                  </div>

                  <div>
                    <h3 className="text-red-400 font-bold text-lg mb-2">
                      Emergency Notice
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      During real emergencies,
                      use Emergency SOS for
                      instant location sharing,
                      guardian alerts, and rescue
                      assistance.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Sparkles className="w-4 h-4" />

                  <p>
                    Rakshak AI Emergency System
                    Active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmergencyActionPanel;