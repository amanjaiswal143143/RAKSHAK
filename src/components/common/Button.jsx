import React from 'react';
import { motion } from 'framer-motion';
import { useNightMode } from '../../contexts/NightModeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false
}) => {
  const { isNightMode } = useNightMode();

  const variants = {
    primary: 'bg-emergency hover:bg-emergencyDark text-white',
    secondary: 'bg-surface hover:bg-surfaceLight text-white border border-glassBorder',
    ghost: 'bg-transparent hover:bg-glass text-white',
    danger: 'bg-emergency hover:bg-emergencyDark text-white animate-glow',
    success: 'bg-neonGreen hover:bg-green-600 text-black',
  };

  // Night mode: increase button sizes by 20%
  const sizes = {
    sm: isNightMode ? 'px-5 py-2.5 text-sm' : 'px-4 py-2 text-sm',
    md: isNightMode ? 'px-7 py-3.5 text-base' : 'px-6 py-3 text-base',
    lg: isNightMode ? 'px-10 py-5 text-lg' : 'px-8 py-4 text-lg',
    xl: isNightMode ? 'px-14 py-7 text-xl' : 'px-12 py-6 text-xl',
  };

  // Night mode: increased contrast with stronger borders
  const nightModeClasses = isNightMode ? 'border-2 border-white/20 shadow-lg' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-xl font-semibold
        transition-all duration-200
        ${nightModeClasses}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default Button;
