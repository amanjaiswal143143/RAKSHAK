import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const AnimatedHeartbeat = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="h-10 rounded-2xl glass border border-white/10 px-3 py-2 overflow-hidden">
      <svg viewBox="0 0 280 36" className="w-full h-full text-neonRed" aria-hidden="true">
        <motion.path
          d="M0 18H42L53 8L64 28L76 12L88 18H124L136 18L147 9L158 27L170 13L182 18H280"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0.15, opacity: 0.45 }}
          animate={reduceMotion ? { pathLength: 1, opacity: 0.9 } : { pathLength: [0.15, 1, 0.15], opacity: [0.45, 1, 0.45] }}
          transition={reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};

export default memo(AnimatedHeartbeat);
