'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import GlassCard from './glass-card';

interface MobileNavigationProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export default function MobileNavigation({ links }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    const newState = !isOpen;
    console.log('Mobile menu toggled:', newState);
    setIsOpen(newState);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors border border-white/30"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6 text-blue-600" />
      </button>
      
      {/* Full-screen glass overlay menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-teal-900/80 to-green-900/80 backdrop-blur-md"></div>
          
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors border border-white/30 z-10"
            onClick={toggleMenu}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          {/* Menu content */}
          <div className="relative z-10 w-4/5 max-w-sm">
            <GlassCard
              className="rounded-2xl border-2 border-white/30 shadow-2xl"
              intensity="heavy"
              borderGlow
            >
              <div className="py-8 px-4">
                <div className="flex flex-col items-center space-y-4">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="w-full px-6 py-4 text-center text-white text-lg font-medium rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/10"
                      onClick={toggleMenu}
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