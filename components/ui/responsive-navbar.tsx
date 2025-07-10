'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface ResponsiveNavbarProps {
  name: string;
  links: Array<{ href: string; label: string }>;
}

export default function ResponsiveNavbar({ name, links }: ResponsiveNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Name */}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-700 via-teal-500 to-green-500 bg-clip-text text-transparent">
            {name}
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-white/30 transition-all font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:text-blue-900 hover:bg-white/30 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/20 backdrop-blur-md">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-white/30 hover:text-teal-600"
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