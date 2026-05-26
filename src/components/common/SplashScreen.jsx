import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain } from 'lucide-react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-[9999]">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-500/10 blur-[140px]" />

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px]" />

      <div className="text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative mx-auto mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 rounded-full bg-red-500 blur-3xl"
          />

          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 flex items-center justify-center shadow-[0_0_80px_rgba(239,68,68,0.5)] border border-red-400/30">
            <Shield className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="text-6xl font-black tracking-tight text-white"
        >
          Rakshak
          <span className="text-red-500">
            {' '}
            AI
          </span>
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.6,
          }}
          className="text-gray-400 mt-4 text-lg"
        >
          Intelligent Emergency Protection
        </motion.p>

        {/* AI Indicator */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.9,
          }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-full bg-cyan-500 blur-xl"
            />

            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

              <p className="text-green-400 text-sm font-medium">
                AI Systems Active
              </p>
            </div>

            <p className="text-gray-500 text-xs mt-1">
              Initializing emergency protocols...
            </p>
          </div>
        </motion.div>

        {/* Loading */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.2,
          }}
          className="mt-12"
        >
          <div className="w-64 h-2 rounded-full bg-white/5 overflow-hidden mx-auto">
            <motion.div
              initial={{
                x: '-100%',
              }}
              animate={{
                x: '100%',
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="h-full w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;