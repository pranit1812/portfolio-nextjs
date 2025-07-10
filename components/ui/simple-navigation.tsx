'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface SimpleNavigationProps {
  name: string;
  links: Array<{ href: string; label: string }>;
}

export default function SimpleNavigation({ name, links }: SimpleNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-4 z-20 px-4">
      <div className="mx-auto max-w-5xl rounded-full border border-white/30 shadow-lg bg-white/20 backdrop-blur-md">
        <div className="px-6 py-3 flex items-center justify-between">
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
          
          {/* Mobile Navigation */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-white/30 hover:bg-white/40 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-blue-700" />
              ) : (
                <Menu className="h-6 w-6 text-blue-700" />
              )}
            </button>
            
            {/* Mobile Menu Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/30">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-800 hover:bg-white/50 hover:text-teal-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}