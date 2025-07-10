'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface FloatingMobileMenuProps {
  links: Array<{ href: string; label: string }>;
}

export default function FloatingMobileMenu({ links }: FloatingMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating menu button - fixed at bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg md:hidden"
        aria-label="Open mobile menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Full-screen overlay menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900/95 via-teal-900/95 to-green-900/95 flex flex-col md:hidden">
          {/* Close button */}
          <div className="p-6 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close mobile menu"
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