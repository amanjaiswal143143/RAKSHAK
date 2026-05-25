import React, { memo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EmergencyActionPanel = ({ open, onClose, actions }) => {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close emergency panel"
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Emergency actions"
            className="fixed bottom-0 left-0 right-0 z-[100] rounded-t-[28px] border-t border-white/20 bg-gradient-to-b from-[#181818] to-[#0d0d0d] px-5 pb-[calc(env(safe-area-inset-bottom,20px)+1rem)] pt-4 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
            initial={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0.8, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0.8, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            <div className="mx-auto h-1.5 w-14 rounded-full bg-white/30 mb-4" />
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">Emergency action panel</p>
              <h2 className="text-xl font-bold text-white mt-1">Choose an action</h2>
            </div>
            <div className="space-y-2.5 max-h-[62vh] overflow-y-auto pb-2">
              {actions.map((action) => (
                <motion.button
                  key={action.id}
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-left flex items-center gap-3"
                  onClick={() => {
                    action.onClick();
                    if (!action.keepOpen) {
                      onClose();
                    }
                  }}
                >
                  <span className="h-10 w-10 rounded-xl bg-neonRed/20 text-neonRed flex items-center justify-center text-lg shadow-[0_0_15px_rgba(255,51,51,0.35)]">
                    {action.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{action.title}</p>
                    <p className="text-xs text-white/60 mt-0.5">{action.subtitle}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(EmergencyActionPanel);
