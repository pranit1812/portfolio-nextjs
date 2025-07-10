'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import GlassCard from './glass-card';
import { motion } from 'framer-motion';

interface GlassMobileNavProps {
  name: string;
  links: Array<{ href: string; label: string }>;
}

export default function GlassMobileNav({ name, links }: GlassMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="sticky top-4 z-30 px-4">
        <GlassCard
          className="rounded-full border border-white/30 shadow-lg"
          intensity="heavy"
          borderGlow
        >
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo/Name */}
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-700 via-teal-500 to-green-500 bg-clip-text text-transparent">
                {name}
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-full text-gray-700 hover:text-teal-600 hover:bg-white/30 transition-all font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center justify-center p-3 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-colors border border-white/40 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6 text-blue-700" />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </nav>
      
      {/* Full-screen Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop with glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-teal-900/80 to-green-900/80 backdrop-blur-md"></div>
          
          {/* Close Button */}
          <div className="absolute top-6 right-6 z-50">
            <motion.button
              onClick={() => setIsOpen(false)}
              className="p-4 rounded-full bg-white/30 hover:bg-white/40 transition-colors border border-white/40 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close mobile menu"
            >
              <X className="h-7 w-7 text-white" />
            </motion.button>
          </div>
          
          {/* Menu Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <GlassCard
              className="rounded-2xl w-4/5 max-w-sm"
              intensity="medium"
              borderGlow
              interactive
            >
              <div className="py-8 px-4">
                <div className="flex flex-col items-center space-y-4">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="w-full px-6 py-4 text-center text-white text-lg font-medium rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/10 shadow-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
}