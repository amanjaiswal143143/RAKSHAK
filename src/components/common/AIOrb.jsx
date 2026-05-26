import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const AIOrb = () => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl"
      />

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-24 h-24 rounded-full border border-cyan-400/30"
      />

      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="
          relative
          w-20
          h-20
          rounded-full
          bg-gradient-to-br
          from-cyan-500
          to-blue-600
          flex
          items-center
          justify-center
          shadow-2xl
          shadow-cyan-500/40
        "
      >
        <Brain className="w-9 h-9 text-white" />
      </motion.div>
    </div>
  );
};

export default AIOrb;