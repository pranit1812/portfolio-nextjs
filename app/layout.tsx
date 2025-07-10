import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import portfolioData from '../pranit-portfolio-json.json'
import Link from 'next/link'
import ChatWidget from '../components/chat/chat-widget'
import GlassCard from '../components/ui/glass-card'
import MobileNavigation from '../components/ui/mobile-navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pranit Sehgal - Gen AI Engineer & Startup Leader',
  description: 'Gen AI Engineer and Startup Leader specializing in GraphRAG, AI/ML systems, and technical leadership. Building innovative AI solutions at scale.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { personalInfo } = portfolioData
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
        {/* Apple-style Liquid Glass Navigation Bar */}
        <div className="sticky top-4 z-20 px-4">
          <GlassCard
            className="rounded-full border border-white/30 shadow-lg mx-auto max-w-5xl"
            intensity="heavy"
            borderGlow
          >
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-700 via-teal-500 to-green-500 bg-clip-text text-transparent">{personalInfo.name}</Link>
                <MobileNavigation
                  links={[
                    { href: "/ai-matcher", label: "AI Matcher" },
                    { href: "/journey", label: "Journey" },
                    { href: "/experience", label: "Experience" },
                    { href: "/projects", label: "Projects" },
                    { href: "/skills", label: "Skills" },
                    { href: "/contact", label: "Contact" }
                  ]}
                />
                
                {/* Desktop navigation */}
                <div className="hidden md:flex space-x-1">
                  {[
                    { href: "/ai-matcher", label: "AI Matcher" },
                    { href: "/journey", label: "Journey" },
                    { href: "/experience", label: "Experience" },
                    { href: "/projects", label: "Projects" },
                    { href: "/skills", label: "Skills" },
                    { href: "/contact", label: "Contact" }
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 rounded-full text-gray-700 hover:text-teal-600 hover:bg-white/30 transition-all font-medium text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
          
        </div>
        {/* Main Content */}
        <div className="relative z-10">
          {children}
          <ChatWidget />
        </div>
      </body>
    </html>
  )
}
