'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface BasicNavigationProps {
  name: string;
  links: Array<{ href: string; label: string }>;
}

export default function BasicNavigation({ name, links }: BasicNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/20 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-700 via-teal-500 to-green-500 bg-clip-text text-transparent">
              {name}
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
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
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none shadow-md"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-br from-blue-900/90 via-teal-900/90 to-green-900/90 backdrop-blur-md">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-lg text-white hover:bg-white/20 font-medium text-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}