import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import Card from '../components/common/Card';

import CountdownModal from '../components/emergency/CountdownModal';

import { useEmergency } from '../hooks/useEmergency';

import { useNightMode } from '../contexts/NightModeContext';

import { useMovementDetection } from '../hooks/useMovementDetection';

const SOS = () => {
  const {
    triggerSOS,
    loading,
    error,
    success,
    emergency,
    reset,
  } = useEmergency();

  const { isNightMode } = useNightMode();

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [showSafetyModal, setShowSafetyModal] =
    useState(false);

  const {
    stopData,
    resetDetection,
  } = useMovementDetection({
    enabled: true,

    onUnsafeStop: () => {
      setShowSafetyModal(true);
    },
  });

  useEffect(() => {
    if (success) {
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);

        reset();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, reset]);

  /* SOS */

  const handleSOS = async () => {
    try {
      await triggerSOS({
        type: 'SOS',

        metadata: {
          source: 'one_tap_sos',
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* SAFE */

  const handleConfirmSafe = () => {
    setShowSafetyModal(false);

    resetDetection();
  };

  /* AUTO SOS */

  const handleSafetyTimeout =
    async () => {
      setShowSafetyModal(false);

      await triggerSOS({
        type: 'AUTO_SOS',

        metadata: {
          reason:
            'unsafe_stop_timeout',

          stopData,
        },
      });
    };

  return (
    <div className="min-h-screen bg-black text-white pb-32 px-5 pt-8 relative overflow-hidden">

      {/* Background Glows */}

      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-500/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-500/10 blur-[120px]" />

      {/* Header */}

      <div className="text-center relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <h1 className="text-5xl font-black tracking-tight">
            Emergency
            <span className="text-red-500">
              {' '}SOS
            </span>
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Instant AI-powered emergency response
          </p>
        </motion.div>

      </div>

      {/* AI ALERT BAR */}

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
          mt-8
          bg-white/[0.04]
          border
          border-white/10
          rounded-3xl
          p-5
          backdrop-blur-2xl
          relative
          overflow-hidden
        "
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-3xl rounded-full" />

        <div className="relative flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-3xl">
            🚨
          </div>

          <div>
            <h2 className="font-bold text-lg">
              Rakshak Emergency Shield
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              AI monitors emergency conditions
              and instantly alerts guardians.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Loading */}

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="flex flex-col items-center justify-center mt-24"
          >

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="
                w-40
                h-40
                rounded-full
                border-[6px]
                border-red-500
                border-t-transparent
                shadow-[0_0_80px_rgba(239,68,68,0.5)]
              "
            />

            <h2 className="text-3xl font-black mt-8 text-red-400">
              Sending Emergency Alert...
            </h2>

            <p className="text-gray-400 mt-3">
              Sharing live location with guardians
            </p>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}

      <AnimatePresence>
        {showSuccess && !loading && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
            }}
            className="flex flex-col items-center justify-center mt-24"
          >

            <div className="
              w-44
              h-44
              rounded-full
              bg-green-500
              flex
              items-center
              justify-center
              shadow-[0_0_90px_rgba(34,197,94,0.5)]
            ">
              <span className="text-8xl">
                ✓
              </span>
            </div>

            <h2 className="text-4xl font-black text-green-400 mt-8">
              SOS SENT
            </h2>

            <p className="text-gray-400 mt-3">
              Emergency contacts notified successfully
            </p>

            {emergency && (
              <p className="text-xs text-gray-500 mt-4">
                Emergency ID:
                {' '}
                {emergency.id?.slice(0, 8)}
              </p>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main SOS */}

      <AnimatePresence>
        {!loading && !showSuccess && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="flex flex-col items-center justify-center mt-20 relative z-10"
          >

            {/* Pulse Rings */}

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="
                absolute
                w-80
                h-80
                rounded-full
                bg-red-500/20
                blur-3xl
              "
            />

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >

              {/* SOS BUTTON */}

              <motion.button
                whileTap={{
                  scale: 0.92,
                }}
                onClick={handleSOS}
                className="
                  relative
                  w-60
                  h-60
                  rounded-full
                  bg-gradient-to-br
                  from-red-400
                  via-red-500
                  to-red-700
                  flex
                  flex-col
                  items-center
                  justify-center
                  shadow-[0_0_100px_rgba(239,68,68,0.7)]
                  border
                  border-red-300/30
                "
              >

                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="text-8xl"
                >
                  🚨
                </motion.div>

                <h2 className="text-5xl font-black text-white mt-2">
                  SOS
                </h2>

                <p className="text-white/80 mt-2 text-sm">
                  Tap Once For Emergency
                </p>

              </motion.button>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-10"
          >
            <Card className="border border-red-500/30 bg-red-500/10 rounded-3xl">
              <p className="text-red-400 font-bold">
                Error Sending SOS
              </p>

              <p className="text-sm text-gray-300 mt-2">
                {error}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Cards */}

      {!isNightMode && (
        <div className="space-y-4 mt-20">

          <Card className="bg-white/5 border border-cyan-500/20 rounded-3xl">
            <div className="flex items-center gap-4">

              <div className="text-4xl">
                📍
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Live Location
                </p>

                <p className="font-bold">
                  Shared automatically
                </p>
              </div>

            </div>
          </Card>

          <Card className="bg-white/5 border border-green-500/20 rounded-3xl">
            <div className="flex items-center gap-4">

              <div className="text-4xl">
                👥
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Guardians
                </p>

                <p className="font-bold">
                  Emergency contacts notified
                </p>
              </div>

            </div>
          </Card>

          <Card className="bg-white/5 border border-red-500/20 rounded-3xl">
            <div className="flex items-center gap-4">

              <div className="text-4xl">
                🚑
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Response System
                </p>

                <p className="font-bold">
                  Nearby emergency services alerted
                </p>
              </div>

            </div>
          </Card>

        </div>
      )}

      {/* NIGHT MODE */}

      {isNightMode && (
        <div className="mt-16">

          <Card className="bg-red-500/10 border border-red-500/20 rounded-3xl">

            <div className="flex items-center gap-4">

              <div className="text-4xl">
                🌙
              </div>

              <div>
                <p className="text-red-400 font-bold">
                  Night Safety Mode
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Emergency optimized interface active
                </p>
              </div>

            </div>

          </Card>

        </div>
      )}

      {/* SAFETY MODAL */}

      <CountdownModal
        isOpen={showSafetyModal}
        onClose={() =>
          setShowSafetyModal(false)
        }
        onConfirmSafe={handleConfirmSafe}
        onTimeout={handleSafetyTimeout}
        countdownSeconds={30}
      />
    </div>
  );
};

export default SOS;