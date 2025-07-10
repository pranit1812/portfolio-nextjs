'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import GlassCard from './glass-card';

interface MobileMenuProps {
  links: Array<{ href: string; label: string }>;
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center justify-center p-3 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-colors border border-white/40 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6 text-blue-700" />
      </button>

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