'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface FixedMobileMenuProps {
  links: Array<{ href: string; label: string }>;
}

export default function FixedMobileMenu({ links }: FixedMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      {/* Fixed button at bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg md:hidden flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Full-screen overlay menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-900/95 via-teal-900/95 to-green-900/95 flex flex-col md:hidden">
          {/* Close button */}
          <div className="p-6 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-8 w-8 text-white" />
            </button>
          </div>

          {/* Menu items */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-full max-w-xs px-6 py-5 text-center text-white text-xl font-medium rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
                onClick={() => setIsOpen(false)}
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