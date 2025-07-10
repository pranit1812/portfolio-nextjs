'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import GlassCard from './glass-card';

interface NavigationProps {
  name: string;
  links: Array<{ href: string; label: string }>;
}

export default function NavigationWithMobile({ name, links }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Apple-style Liquid Glass Navigation Bar */}
      <div className="sticky top-4 z-20 px-4">
        <div className="relative">
          <GlassCard
            className="rounded-full border border-white/30 shadow-lg mx-auto max-w-5xl"
            intensity="heavy"
            borderGlow
          >
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-700 via-teal-500 to-green-500 bg-clip-text text-transparent">{name}</Link>
                <div className="flex items-center">
                  {/* Desktop navigation */}
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
                  
                  {/* Mobile menu button */}
                  <button
                    className="md:hidden flex items-center justify-center p-3 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-colors border border-white/40 shadow-lg"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Toggle mobile menu"
                  >
                    <Menu className="h-6 w-6 text-blue-700" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Full-screen mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-gradient-to-br from-blue-900/95 via-teal-900/95 to-green-900/95 flex flex-col">
          {/* Header with close button */}
          <div className="p-4 flex justify-end">
            <button
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Menu items */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-full max-w-xs px-6 py-4 text-center text-white text-xl font-medium rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}