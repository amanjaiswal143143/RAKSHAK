import React, { memo } from 'react';
import { motion } from 'framer-motion';

const toneStyles = {
  success: 'bg-neonGreen/15 text-neonGreen border-neonGreen/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  danger: 'bg-emergency/20 text-neonRed border-neonRed/40',
  info: 'bg-neonBlue/15 text-neonBlue border-neonBlue/30',
};

const StatusIndicator = ({
  label,
  value,
  tone = 'info',
  pulse = false,
  className = '',
}) => (
  <div className={`glass rounded-2xl px-4 py-3 border ${toneStyles[tone]} ${className}`}>
    <p className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-1">{label}</p>
    <div className="flex items-center gap-2">
      <motion.span
        className={`h-2.5 w-2.5 rounded-full ${tone === 'danger' ? 'bg-neonRed' : tone === 'warning' ? 'bg-yellow-400' : tone === 'success' ? 'bg-neonGreen' : 'bg-neonBlue'}`}
        animate={pulse ? { scale: [1, 1.15, 1] } : undefined}
        transition={pulse ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  </div>
);

export default memo(StatusIndicator);
