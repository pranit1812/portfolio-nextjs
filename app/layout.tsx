import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import portfolioData from '../pranit-portfolio-json.json';
import ChatWidget from '../components/chat/chat-widget';
import GlassMobileNav from '../components/ui/glass-mobile-nav';
import { metadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { personalInfo } = portfolioData;
  
  const navLinks = [
    { href: "/ai-matcher", label: "AI Matcher" },
    { href: "/journey", label: "Journey" },
    { href: "/experience", label: "Experience" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 relative`}>
        {/* Animated Abstract Glassmorphism Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-300 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100 to-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
        </div>
        
        {/* Glass Mobile Navigation */}
        <GlassMobileNav
          name={personalInfo.name}
          links={navLinks}
        />
        
        {/* Main Content */}
        <div className="relative z-10">
          {children}
          <ChatWidget />
        </div>
      </body>
    </html>
  );
}
