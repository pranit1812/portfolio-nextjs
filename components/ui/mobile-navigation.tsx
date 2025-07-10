'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface MobileNavigationProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export default function MobileNavigation({ links }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden relative z-50">
      <button
        className="flex items-center justify-center p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors border-2 border-white/50 shadow-lg"
        onClick={() => {
          const newState = !isOpen;
          console.log('Mobile menu toggled:', newState);
          setIsOpen(newState);
        }}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border-2 border-blue-300 overflow-hidden z-50">
          <div className="py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-4 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium text-base"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}