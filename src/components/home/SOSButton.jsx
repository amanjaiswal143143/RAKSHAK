import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const SOSButton = ({ onClick, disabled = false }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex items-center justify-center py-4">
      <motion.div
        className="absolute h-52 w-52 rounded-full border border-neonRed/30"
        animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.4, 0.15, 0.4] }}
        transition={reduceMotion ? undefined : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-64 w-64 rounded-full border border-neonRed/15"
        animate={reduceMotion ? undefined : { scale: [1, 1.22, 1], opacity: [0.26, 0.06, 0.26] }}
        transition={reduceMotion ? undefined : { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />

      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.96 }}
        className="relative h-44 w-44 min-h-[176px] min-w-[176px] rounded-full border border-neonRed/70 bg-gradient-to-b from-[#ff5757] to-[#9f0000] text-white shadow-[0_0_35px_rgba(255,51,51,0.65)] focus:outline-none focus-visible:ring-4 focus-visible:ring-neonRed/40"
        aria-label="Open emergency actions"
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={reduceMotion ? undefined : { boxShadow: ['0 0 0 0 rgba(255,51,51,0.45)', '0 0 0 14px rgba(255,51,51,0)', '0 0 0 0 rgba(255,51,51,0)'] }}
          transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="relative z-10 text-5xl font-black tracking-[0.18em]">SOS</span>
      </motion.button>
    </div>
  );
};

export default memo(SOSButton);
