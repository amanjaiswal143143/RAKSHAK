import React, { memo } from 'react';
import { motion } from 'framer-motion';

const QuickActionCard = ({ icon, title, subtitle, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
    whileHover={{ y: -2 }}
    className="glass w-full min-h-[96px] rounded-2xl border border-white/10 px-4 py-3 text-left shadow-[0_12px_22px_rgba(0,0,0,0.24)]"
  >
    <div className="flex items-start gap-3">
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/60 mt-1">{subtitle}</p>
      </div>
    </div>
  </motion.button>
);

export default memo(QuickActionCard);
