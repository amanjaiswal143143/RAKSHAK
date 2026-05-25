import React, { memo } from 'react';
import { motion } from 'framer-motion';

const GuardianCard = ({ name, relation, status, lastSeen, onShareTrip }) => {
  const isOnline = status === 'online';

  return (
    <motion.div
      whileHover={{ y: -1.5 }}
      className="glass rounded-2xl border border-white/10 px-4 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-lg">👤</div>
          <div>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-white/60">{relation}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.12em] border ${isOnline ? 'bg-neonGreen/15 text-neonGreen border-neonGreen/40' : 'bg-white/5 text-white/60 border-white/15'}`}>
          {status}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/60">Last seen: {lastSeen}</p>
        <button
          type="button"
          onClick={onShareTrip}
          className="text-xs font-semibold text-neonBlue hover:text-white transition-colors"
        >
          Share Trip
        </button>
      </div>
    </motion.div>
  );
};

export default memo(GuardianCard);
