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
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden flex items-center"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>
      
      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="mt-2 md:hidden">
          <GlassCard
            className="rounded-xl border border-white/30 shadow-lg mx-auto"
            intensity="medium"
            borderGlow
          >
            <div className="py-2 px-4">
              <div className="flex flex-col space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 rounded-lg text-gray-700 hover:text-teal-600 hover:bg-white/30 transition-all font-medium text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}