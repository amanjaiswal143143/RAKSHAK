import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { motion } from 'framer-motion';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { tripSharingService } from '../services/api/tripSharing.js';

/* ---------------- MARKER FIX ---------------- */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',

  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ---------------- CUSTOM ICON ---------------- */

const liveIcon = L.divIcon({
  className: 'custom-live-marker',

  html: `
    <div style="
      width:28px;
      height:28px;
      border-radius:50%;
      background:#22c55e;
      border:4px solid white;
      box-shadow:0 0 25px #22c55e;
    "></div>
  `,

  iconSize: [28, 28],

  iconAnchor: [14, 14],
});

const TrackTrip = () => {

  const { trackingId } =
    useParams();

  const [locations, setLocations] =
    useState([]);

  const [latestLocation,
    setLatestLocation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ---------------- FETCH LIVE ---------------- */

  useEffect(() => {

    const fetchLocations =
      async () => {

        try {

          const data =
            await tripSharingService.getTripLocations(
              trackingId
            );

          setLocations(data);

          if (data.length > 0) {
            setLatestLocation(data[0]);
          }

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    fetchLocations();

    const interval =
      setInterval(() => {

        fetchLocations();

      }, 4000);

    return () =>
      clearInterval(interval);

  }, [trackingId]);

  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-center">

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
              w-16
              h-16
              border-4
              border-green-500
              border-t-transparent
              rounded-full
              mx-auto
              mb-5
            "
          />

          <p className="text-white text-lg">
            Loading Live Tracking...
          </p>

        </div>

      </div>
    );
  }

  /* ---------------- NO DATA ---------------- */

  if (!latestLocation) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center px-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center max-w-md">

          <div className="text-6xl mb-5">
            📍
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            No Live Data
          </h2>

          <p className="text-gray-400">
            Waiting for location updates...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND */}

      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-green-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[120px]" />

      {/* HEADER */}

      <div className="relative z-10 p-6">

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            bg-white/[0.04]
            border
            border-white/10
            backdrop-blur-2xl
            rounded-[32px]
            p-6
            mb-6
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-black">
                Live Tracking
              </h1>

              <p className="text-gray-400 mt-2">
                Guardian tracking active
              </p>

            </div>

            <div className="flex items-center gap-2">

              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

              <span className="text-green-400 font-medium">
                LIVE
              </span>

            </div>

          </div>

        </motion.div>

        {/* MAP */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="
            h-[500px]
            rounded-[36px]
            overflow-hidden
            border
            border-white/10
            shadow-[0_0_50px_rgba(34,197,94,0.15)]
          "
        >

          <MapContainer
            center={[
              parseFloat(
                latestLocation.latitude
              ),
              parseFloat(
                latestLocation.longitude
              ),
            ]}
            zoom={16}
            style={{
              height: '100%',
              width: '100%',
            }}
          >

            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <Marker
              position={[
                parseFloat(
                  latestLocation.latitude
                ),
                parseFloat(
                  latestLocation.longitude
                ),
              ]}
              icon={liveIcon}
            >

              <Popup>

                🚨 User Live Location

              </Popup>

            </Marker>

          </MapContainer>

        </motion.div>

        {/* INFO */}

        <div className="grid grid-cols-1 gap-5 mt-6">

          <div className="
            bg-white/[0.04]
            border
            border-white/10
            rounded-[28px]
            p-5
            backdrop-blur-2xl
          ">

            <p className="text-gray-400 text-sm mb-2">
              Tracking ID
            </p>

            <p className="text-green-400 font-mono break-all">
              {trackingId}
            </p>

          </div>

          <div className="
            bg-white/[0.04]
            border
            border-white/10
            rounded-[28px]
            p-5
            backdrop-blur-2xl
          ">

            <p className="text-gray-400 text-sm mb-2">
              Current Coordinates
            </p>

            <p className="text-white">
              Latitude:
              {' '}
              {latestLocation.latitude}
            </p>

            <p className="text-white mt-2">
              Longitude:
              {' '}
              {latestLocation.longitude}
            </p>

          </div>

          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${latestLocation.latitude},${latestLocation.longitude}`,
                '_blank'
              )
            }
            className="
              w-full
              py-5
              rounded-[28px]
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              font-bold
              text-lg
              shadow-[0_0_40px_rgba(34,197,94,0.3)]
            "
          >

            Open In Google Maps

          </button>

        </div>

      </div>

    </div>
  );
};

export default TrackTrip;