'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  interactive?: boolean;
  hoverEffect?: boolean;
  borderGlow?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  intensity = 'medium',
  interactive = false,
  hoverEffect = false,
  borderGlow = false,
  onClick,
}: GlassCardProps) {
  // Define blur intensity levels
  const blurIntensity = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl',
  };

  // Define background opacity levels
  const bgOpacity = {
    light: 'bg-white/10',
    medium: 'bg-white/20',
    heavy: 'bg-white/30',
  };

  // Define border opacity levels
  const borderOpacity = {
    light: 'border-white/10',
    medium: 'border-white/20',
    heavy: 'border-white/40',
  };

  return (
    <motion.div
      className={cn(
        // Base glass styles
        'relative rounded-xl border shadow-lg overflow-hidden',
        // Dynamic intensity classes
        blurIntensity[intensity],
        bgOpacity[intensity],
        borderOpacity[intensity],
        // Conditional interactive styles
        interactive && 'transition-all duration-300',
        hoverEffect && 'hover:bg-white/40 hover:shadow-xl',
        borderGlow && 'before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-r before:from-blue-600/20 before:via-teal-500/20 before:to-green-500/20 before:blur-xl before:opacity-70',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={interactive ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
    >
      {/* Glass highlight effect - top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Glass overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 pointer-events-none" />
    </motion.div>
  );
}

export default GlassCard;