import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'primary' | 'danger' | 'success' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'none',
  onClick
}) => {
  const glowClasses = {
    primary: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]',
    danger: 'hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    success: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    none: 'hover:border-white/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${
        hoverEffect ? `cursor-pointer ${glowClasses[glowColor]}` : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
