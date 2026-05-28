import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import Card from '../components/common/Card';

import CountdownModal from '../components/emergency/CountdownModal';

import { useNightMode } from '../contexts/NightModeContext';

import { useMovementDetection } from '../hooks/useMovementDetection';

import { supabase } from '../supabase/client';

const SOS = () => {

  const { isNightMode } =
    useNightMode();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [emergencyId, setEmergencyId] =
    useState('');

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

    if (showSuccess) {

      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () =>
        clearTimeout(timer);
    }

  }, [showSuccess]);

  /* ---------------- SOS ---------------- */

  const handleSOS = async () => {

    setLoading(true);

    setError('');

    try {

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          try {

            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            const emergencyCode =
              crypto.randomUUID();

            /* CURRENT USER */

            const user =
              await supabase.auth.getUser();

            const userId =
              user.data.user?.id;

            if (!userId) {

              setError(
                'Please login first'
              );

              setLoading(false);

              return;
            }

            /* FETCH ONLY CURRENT USER GUARDIANS */

            const {
              data: guardians,
              error: guardianError,
            } = await supabase
              .from('guardians')
              .select('*')
              .eq('user_id', userId);

            if (guardianError) {

              console.log(
                guardianError
              );
            }

            if (
              !guardians ||
              guardians.length === 0
            ) {

              setError(
                'No guardians found'
              );

              setLoading(false);

              return;
            }

            /* SEND WHATSAPP ALERT */

            const response =
              await fetch(
                'https://rakshak-backend-7t7e.onrender.com/send-sos',
                {
                  method: 'POST',

                  headers: {
                    'Content-Type':
                      'application/json',
                  },

                  body: JSON.stringify({
                    guardians,
                    latitude,
                    longitude,
                  }),
                }
              );

            if (!response.ok) {

              throw new Error(
                'Failed to send WhatsApp alert'
              );
            }

            /* SAVE SOS */

            const { error } =
              await supabase
                .from('sos_alerts')
                .insert([
                  {
                    message:
                      'Emergency SOS Triggered',

                    latitude:
                      latitude.toString(),

                    longitude:
                      longitude.toString(),

                    user_id: userId,
                  },
                ]);

            if (error) {

              setError(
                'Failed to save SOS'
              );

              setLoading(false);

              return;
            }

            setEmergencyId(
              emergencyCode
            );

            setShowSuccess(true);

            setLoading(false);

          } catch (err) {

            console.log(err);

            setError(err.message);

            setLoading(false);
          }
        },

        () => {

          setError(
            'Location permission denied'
          );

          setLoading(false);
        }
      );

    } catch (err) {

      console.log(err);

      setError(err.message);

      setLoading(false);
    }
  };

  /* ---------------- SAFE ---------------- */

  const handleConfirmSafe = () => {

    setShowSafetyModal(false);

    resetDetection();
  };

  /* ---------------- AUTO SOS ---------------- */

  const handleSafetyTimeout =
    async () => {

      setShowSafetyModal(false);

      handleSOS();
    };

  return (

    <div className="min-h-screen bg-black text-white pb-32 px-5 pt-8 relative overflow-hidden">

      {/* BACKGROUND */}

      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-500/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-500/10 blur-[120px]" />

      {/* HEADER */}

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

      {/* LOADING */}

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

      {/* SUCCESS */}

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

            <p className="text-xs text-gray-500 mt-4">
              Emergency ID:
              {' '}
              {emergencyId.slice(0, 8)}
            </p>

          </motion.div>
        )}

      </AnimatePresence>

      {/* MAIN BUTTON */}

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

              <div className="text-8xl">
                🚨
              </div>

              <h2 className="text-5xl font-black text-white mt-2">
                SOS
              </h2>

              <p className="text-white/80 mt-2 text-sm">
                Tap Once For Emergency
              </p>

            </motion.button>

          </motion.div>
        )}

      </AnimatePresence>

      {/* ERROR */}

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