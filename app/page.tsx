'use client';

import React, { useEffect, useState } from 'react';
import portfolioData from '../pranit-portfolio-json.json';
import Link from 'next/link';
import Image from 'next/image';
import GlassCard from '@/components/ui/glass-card';

export default function HomePage() {
  const { personalInfo } = portfolioData;

  // Parallax state for background blobs
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use our enhanced GlassCard component instead of custom classes

  return (
    <div className="py-16 px-4">
      {/* Parallax Blobs */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `calc(10vh + ${scrollY * 0.2}px)`,
            left: "5vw",
            width: 350,
            height: 350,
            background: "radial-gradient(circle at 60% 40%, #0d4b9e 0%, #0ea5e9 100%)",
            opacity: 0.5,
            filter: "blur(60px)",
            borderRadius: "50%",
            transition: "background 0.3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: `calc(60vh + ${scrollY * 0.1}px)`,
            right: "10vw",
            width: 400,
            height: 400,
            background: "radial-gradient(circle at 40% 60%, #059669 0%, #4ade80 100%)",
            opacity: 0.4,
            filter: "blur(80px)",
            borderRadius: "50%",
            transition: "background 0.3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: `calc(120vh + ${scrollY * 0.15}px)`,
            left: "40vw",
            width: 300,
            height: 300,
            background: "radial-gradient(circle at 50% 50%, #43e97b 0%, #38f9d7 100%)",
            opacity: 0.3,
            filter: "blur(70px)",
            borderRadius: "50%",
            transition: "background 0.3s",
          }}
        />
      </div>
      <div className="text-center max-w-6xl mx-auto">
        {/* Profile Image with background glow */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-6 md:-inset-8 rounded-full bg-gradient-to-r from-blue-500 to-green-400 blur-2xl opacity-40 z-0"></div>
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl backdrop-blur-sm z-10">
              <Image
                src="/profile.jpg"
                alt="Pranit Sehgal"
                width={256}
                height={256}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 backdrop-blur-sm border border-green-200/60 rounded-full mb-8">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 text-sm font-medium">{personalInfo.availability}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-teal-700 to-gray-900 bg-clip-text text-transparent break-words max-w-full md:max-w-4xl mx-auto">
          {personalInfo.name}
        </h1>
        <h2 className="text-2xl md:text-4xl mb-8 text-teal-600 font-semibold">{personalInfo.title}</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">{personalInfo.tagline}</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {personalInfo.highlighted_achievements.map((achievement, index) => (
            <GlassCard
              key={index}
              className="w-full sm:w-1/2 lg:w-1/3 max-w-xs p-4"
              intensity="medium"
              borderGlow={index % 2 === 0}
              interactive
            >
              <p className="text-sm text-gray-800 font-medium">{achievement}</p>
            </GlassCard>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Link href="/ai-matcher" className="block group">
            <GlassCard
              className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 h-full"
              intensity="medium"
              interactive
              hoverEffect
              borderGlow
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">Pranit.AI</h3>
              <p className="text-gray-700">Ask me any questions about my resume and projects and get a detailed answer back.</p>
            </GlassCard>
          </Link>

          <Link href="/journey" className="block group">
            <GlassCard
              className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 h-full"
              intensity="medium"
              interactive
              hoverEffect
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">My Journey</h3>
              <p className="text-gray-700">From education to startups - explore my professional path and milestones.</p>
            </GlassCard>
          </Link>

          <Link href="/experience" className="block group">
            <GlassCard
              className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 h-full"
              intensity="medium"
              interactive
              hoverEffect
            >
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">Experience</h3>
              <p className="text-gray-700">Professional experience and leadership roles</p>
            </GlassCard>
          </Link>

          <Link href="/projects" className="block group">
            <GlassCard
              className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 h-full"
              intensity="medium"
              interactive
              hoverEffect
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">Projects</h3>
              <p className="text-gray-700">Technical projects and innovative solutions</p>
            </GlassCard>
          </Link>

          <Link href="/skills" className="block group">
            <GlassCard
              className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 h-full"
              intensity="medium"
              interactive
              hoverEffect
            >
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">Technical Skills</h3>
              <p className="text-gray-700">Technology stack and areas of expertise</p>
            </GlassCard>
          </Link>

          <Link href="/contact" className="block group">
            <GlassCard
              className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 h-full"
              intensity="medium"
              interactive
              hoverEffect
              borderGlow
            >
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">Get In Touch</h3>
              <p className="text-gray-700">Let's discuss your next AI project</p>
            </GlassCard>
          </Link>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a href={personalInfo.contact.github} target="_blank" rel="noopener noreferrer" 
             className="px-8 py-3 bg-gray-900/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-800 transition-all font-medium shadow-lg">
            GitHub
          </a>
          <a href={personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer"
             className="px-8 py-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg">
            LinkedIn
          </a>
          <a href={`mailto:${personalInfo.contact.email}`}
             className="px-8 py-3 bg-teal-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-teal-700 transition-all font-medium shadow-lg">
            Email Me
          </a>
        </div>
      </div>
    </div>
  );
}