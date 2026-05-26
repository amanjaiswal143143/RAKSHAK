import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const Nearby = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const nearbyServices = [
    { icon: '🏥', name: 'City Hospital', distance: '1.2 km', type: 'Hospital', phone: '108' },
    { icon: '🏥', name: 'Apollo Hospital', distance: '2.5 km', type: 'Hospital', phone: '108' },
    { icon: '👮', name: 'Central Police Station', distance: '0.8 km', type: 'Police', phone: '100' },
    { icon: '🔥', name: 'Fire Station 1', distance: '1.5 km', type: 'Fire', phone: '101' },
    { icon: '🏥', name: 'AIIMS Hospital', distance: '3.2 km', type: 'Hospital', phone: '108' },
    { icon: '👮', name: 'Traffic Police', distance: '0.5 km', type: 'Police', phone: '100' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background pb-24 safe-area-top"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Nearby <span className="text-neonBlue">Help</span>
        </h1>
        <p className="text-gray-400">Find emergency services near you</p>
      </motion.div>

      {/* Map Placeholder */}
      <div className="h-[300px] rounded-3xl overflow-hidden border border-zinc-800 mb-6">

  <MapContainer
    center={[21.1702, 72.8311]}
    zoom={13}
    scrollWheelZoom={true}
    className="h-full w-full z-0"
  >

    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {/* Hospital */}

    <Marker position={[21.1702, 72.8311]}>
      <Popup>
        City Hospital 🚑
      </Popup>
    </Marker>

    {/* Police */}

    <Marker position={[21.1802, 72.8211]}>
      <Popup>
        Police Station 👮
      </Popup>
    </Marker>

    {/* Fire */}

    <Marker position={[21.1602, 72.8411]}>
      <Popup>
        Fire Station 🔥
      </Popup>
    </Marker>

  </MapContainer>

</div>

      {/* Filter Buttons */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="primary" size="sm">All</Button>
          <Button variant="secondary" size="sm">Hospitals</Button>
          <Button variant="secondary" size="sm">Police</Button>
          <Button variant="secondary" size="sm">Fire</Button>
        </div>
      </motion.div>

      {/* Nearby Services List */}
      <motion.div variants={itemVariants} className="px-6">
        <h2 className="text-lg font-semibold text-white mb-4">Nearby Services</h2>
        <div className="space-y-3">
          {nearbyServices.map((service, index) => (
            <Card key={index} className="hover:bg-surfaceLight transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-surfaceLight rounded-xl flex items-center justify-center text-3xl">
                    {service.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{service.name}</p>
                    <p className="text-sm text-gray-400">{service.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neonBlue">📍 {service.distance}</span>
                    </div>
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Call
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Emergency Note */}
      <motion.div variants={itemVariants} className="px-6 mt-6">
        <Card className="border-l-4 border-emergency">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="font-semibold text-emergency mb-1">Emergency Note</p>
              <p className="text-sm text-gray-300">
                In life-threatening situations, call emergency services immediately using the SOS button.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Nearby;
