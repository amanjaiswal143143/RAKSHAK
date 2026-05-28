import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '../supabase/client';

import {
  Shield,
  Phone,
  MessageCircle,
  Copy,
  Share2,
  X,
  Plus,
  Trash2,
  User,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const Guardian = () => {

  const [guardians, setGuardians] =
    useState([]);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [tripLink, setTripLink] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [newGuardian, setNewGuardian] =
    useState({
      name: '',
      phone: '',
      relationship: '',
    });

  /* ---------------- LOAD GUARDIANS ---------------- */

  useEffect(() => {

    fetchGuardians();

  }, []);

  const fetchGuardians = async () => {

    const user =
      await supabase.auth.getUser();

    const userId =
      user.data.user?.id;

    if (!userId) return;

    const { data, error } =
      await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .order('id', {
          ascending: false,
        });

    if (!error) {

      setGuardians(data);
    }
  };

  /* ---------------- TOAST ---------------- */

  const showToast = (message) => {

    setSuccessMessage(message);

    setTimeout(() => {

      setSuccessMessage('');

    }, 3000);
  };

  /* ---------------- ADD GUARDIAN ---------------- */

  const handleAddGuardian =
    async () => {

      if (
        !newGuardian.name ||
        !newGuardian.phone ||
        !newGuardian.relationship
      ) {

        showToast(
          'Please fill all fields'
        );

        return;
      }

      const user =
        await supabase.auth.getUser();

      const userId =
        user.data.user?.id;

      if (!userId) {

        showToast(
          'Please login first'
        );

        return;
      }

      const { error } =
        await supabase
          .from('guardians')
          .insert([
            {
              name:
                newGuardian.name,

              phone:
                newGuardian.phone,

              relationship:
                newGuardian.relationship,

              user_id: userId,
            },
          ]);

      if (!error) {

        fetchGuardians();

        setNewGuardian({
          name: '',
          phone: '',
          relationship: '',
        });

        setShowAddModal(false);

        showToast(
          'Guardian added successfully!'
        );

      } else {

        console.log(error);

        showToast(
          'Failed to add guardian'
        );
      }
    };

  /* ---------------- DELETE ---------------- */

  const handleDeleteGuardian =
    async (id) => {

      await supabase
        .from('guardians')
        .delete()
        .eq('id', id);

      fetchGuardians();

      showToast(
        'Guardian removed'
      );
    };

  /* ---------------- CALL ---------------- */

  const callGuardian = (phone) => {

    window.location.href =
      `tel:${phone}`;
  };

  /* ---------------- MESSAGE ---------------- */

  const messageGuardian =
    (phone) => {

      window.location.href =
        `sms:${phone}`;
    };

  /* ---------------- LIVE TRACKING ---------------- */

  const generateTripLink =
    async () => {

      try {

        const trackingId =
          crypto.randomUUID();

        const link =
          `${window.location.origin}/track/${trackingId}`;

        setTripLink(link);

        navigator.clipboard.writeText(
          link
        );

        showToast(
          'Live trip started!'
        );

        navigator.geolocation.watchPosition(

          async (position) => {

            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            const user =
              await supabase.auth.getUser();

            const userId =
              user.data.user?.id;

            const { error } =
              await supabase
                .from('live_tracking')
                .insert([
                  {
                    tracking_id:
                      trackingId,

                    latitude:
                      latitude.toString(),

                    longitude:
                      longitude.toString(),

                    user_id: userId,
                  },
                ]);

            if (error) {

              console.log(error);

            } else {

              console.log(
                'Live location inserted'
              );
            }

          },

          (err) => {

            console.log(err);
          },

          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );

      } catch (err) {

        console.log(err);

        showToast(
          'Failed to start trip'
        );
      }
    };

  return (

    <div className="min-h-screen bg-black text-white pb-28 overflow-hidden relative px-4 pt-6">

      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-600/10 blur-[120px]" />

      <AnimatePresence>

        {successMessage && (

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="
              fixed
              top-6
              left-1/2
              -translate-x-1/2
              z-[100]
              bg-green-500/20
              border
              border-green-500/30
              backdrop-blur-xl
              px-6
              py-4
              rounded-2xl
              text-green-300
              font-medium
            "
          >

            {successMessage}

          </motion.div>
        )}

      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-black">
            Guardian AI
          </h1>

          <p className="text-gray-400 mt-2">
            Trusted emergency network
          </p>

        </div>

      </div>

      <motion.button
        whileTap={{
          scale: 0.97,
        }}
        onClick={generateTripLink}
        className="
          w-full
          rounded-3xl
          py-5
          font-semibold
          text-lg
          bg-gradient-to-r
          from-green-500
          to-emerald-600
          mb-6
        "
      >

        <div className="flex items-center justify-center gap-3">

          <Share2 className="w-5 h-5" />

          Share Live Trip

        </div>

      </motion.button>

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-bold">
          My Guardians
        </h2>

        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            setShowAddModal(true)
          }
          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-2xl
            bg-purple-600/20
            border
            border-purple-500/30
            text-purple-300
          "
        >

          <Plus className="w-4 h-4" />

          Add

        </motion.button>

      </div>

      <div className="space-y-5">

        {guardians.map((guardian) => (

          <motion.div
            key={guardian.id}
            className="
              bg-white/[0.04]
              border
              border-white/10
              rounded-[32px]
              p-5
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-xl font-bold">
                  {guardian.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {guardian.phone}
                </p>

                <p className="text-green-400 text-xs mt-2">
                  {guardian.relationship}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    callGuardian(
                      guardian.phone
                    )
                  }
                  className="w-12 h-12 rounded-2xl bg-green-600/20 flex items-center justify-center"
                >

                  <Phone className="w-5 h-5 text-green-400" />

                </button>

                <button
                  onClick={() =>
                    messageGuardian(
                      guardian.phone
                    )
                  }
                  className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center"
                >

                  <MessageCircle className="w-5 h-5 text-blue-400" />

                </button>

                <button
                  onClick={() =>
                    handleDeleteGuardian(
                      guardian.id
                    )
                  }
                  className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center"
                >

                  <Trash2 className="w-5 h-5 text-red-400" />

                </button>

              </div>

            </div>

          </motion.div>
        ))}

      </div>

    </div>
  );
};

export default Guardian;