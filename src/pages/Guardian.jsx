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

    const { data, error } =
      await supabase
        .from('guardians')
        .select('*')
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

            console.log(
              'Tracking:',
              trackingId,
              latitude,
              longitude
            );

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

      {/* BACKGROUND */}

      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-600/10 blur-[120px]" />

      {/* TOAST */}

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
              shadow-lg
              flex
              items-center
              gap-3
            "
          >

            <CheckCircle2 className="w-5 h-5" />

            {successMessage}

          </motion.div>
        )}

      </AnimatePresence>

      {/* HEADER */}

      <div className="relative z-10 flex items-center justify-between mb-8">

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-4xl font-black">
              Guardian
            </h1>

            <span className="text-green-400 text-4xl font-black">
              AI
            </span>

          </div>

          <p className="text-gray-400 mt-2">
            Trusted emergency network
          </p>

        </div>

        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-purple-500/20 to-green-500/20 border border-white/10 flex items-center justify-center backdrop-blur-xl">

          <Shield className="w-7 h-7 text-purple-400" />

        </div>

      </div>

      {/* AI CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-white/[0.04]
          border
          border-white/10
          backdrop-blur-2xl
          p-6
          mb-8
        "
      >

        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />

        <div className="relative flex items-center gap-4">

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">

            <Sparkles className="w-8 h-8 text-white" />

          </div>

          <div>

            <h2 className="text-xl font-bold">
              Rakshak Guardian Shield
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Guardians receive live alerts,
              tracking, and emergency updates.
            </p>

          </div>

        </div>

      </motion.div>

      {/* SHARE LIVE TRIP */}

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

      {/* TRIP LINK */}

      {tripLink && (

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-4 mb-8 backdrop-blur-xl">

          <div className="flex items-center justify-between gap-3">

            <div className="overflow-hidden">

              <p className="text-xs text-gray-400 mb-1">
                Live Tracking Link
              </p>

              <p className="text-green-400 truncate text-sm">
                {tripLink}
              </p>

            </div>

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  tripLink
                )
              }
              className="
                w-12
                h-12
                rounded-2xl
                bg-green-500/10
                border
                border-green-500/20
                flex
                items-center
                justify-center
              "
            >

              <Copy className="w-5 h-5 text-green-400" />

            </button>

          </div>

        </div>
      )}

      {/* TITLE */}

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

      {/* EMPTY */}

      {guardians.length === 0 && (

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

          <User
            className="mx-auto mb-4 text-gray-500"
            size={40}
          />

          <h3 className="text-lg font-semibold mb-2">
            No Guardians Added
          </h3>

          <p className="text-gray-400 text-sm">
            Add trusted contacts
          </p>

        </div>
      )}

      {/* GUARDIAN LIST */}

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

      {/* ADD MODAL */}

      <AnimatePresence>

        {showAddModal && (
          <>
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
              onClick={() =>
                setShowAddModal(false)
              }
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{
                y: 100,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 100,
                opacity: 0,
              }}
              className="
                fixed
                bottom-0
                left-0
                right-0
                bg-zinc-950
                border-t
                border-zinc-800
                rounded-t-[36px]
                p-6
                pb-44
                z-50
                max-h-[85vh]
                overflow-y-auto
              "
            >

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">
                  Add Guardian
                </h2>

                <button
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  <X />
                </button>

              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Guardian Name"
                  value={newGuardian.name}
                  onChange={(e) =>
                    setNewGuardian({
                      ...newGuardian,
                      name: e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-2xl
                    px-4
                    py-4
                    outline-none
                  "
                />

                <input
                  type="text"
                  placeholder="+91xxxxxxxxxx"
                  value={newGuardian.phone}
                  onChange={(e) =>
                    setNewGuardian({
                      ...newGuardian,
                      phone: e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-2xl
                    px-4
                    py-4
                    outline-none
                  "
                />

                <input
                  type="text"
                  placeholder="Relationship"
                  value={
                    newGuardian.relationship
                  }
                  onChange={(e) =>
                    setNewGuardian({
                      ...newGuardian,
                      relationship:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-2xl
                    px-4
                    py-4
                    outline-none
                  "
                />

                <motion.button
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={
                    handleAddGuardian
                  }
                  className="
                    w-full
                    bg-gradient-to-r
                    from-purple-600
                    to-pink-600
                    rounded-2xl
                    py-4
                    font-semibold
                    mt-4
                  "
                >

                  Save Guardian

                </motion.button>

              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Guardian;