/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        surfaceLight: '#2a2a2a',
        emergency: '#ff0000',
        emergencyDark: '#cc0000',
        neonRed: '#ff3333',
        neonBlue: '#00d4ff',
        neonGreen: '#00ff88',
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        nightBackground: '#050505',
        nightSurface: '#0f0f0f',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'night-glow': 'nightGlow 3s ease-in-out infinite alternate',
        'emergency-breathe': 'emergencyBreathe 2.4s ease-in-out infinite',
        'heartbeat-trace': 'heartbeatTrace 2.8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #ff0000, 0 0 10px #ff0000' },
          '100%': { boxShadow: '0 0 20px #ff0000, 0 0 30px #ff0000' },
        },
        nightGlow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.3)' },
        },
        emergencyBreathe: {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.035)', filter: 'brightness(1.12)' },
        },
        heartbeatTrace: {
          '0%': { opacity: '0.45' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.45' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
