'use client';

import React from 'react';
import portfolioData from '../../pranit-portfolio-json.json';
import StartupTimeline from '../../components/startup-timeline';
import GlassCard from '@/components/ui/glass-card';

export default function JourneyPage() {
  return (
    <div className="min-h-screen py-6 md:py-12 px-4 lg:px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-700 via-teal-600 to-green-600 bg-clip-text text-transparent">
            My Journey
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
            From education to startups - explore my professional path and milestones.
          </p>
        </div>
        
        {/* Timeline Section */}
        <GlassCard 
          className="w-full p-4 md:p-8 lg:p-10" 
          intensity="medium" 
          borderGlow
        >
          <StartupTimeline
            experiences={portfolioData.experience}
            education={portfolioData.education}
          />
        </GlassCard>
      </div>
    </div>
  );
}