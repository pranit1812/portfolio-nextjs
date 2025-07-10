'use client';

import React from 'react';
import portfolioData from '../../pranit-portfolio-json.json';
import StartupTimeline from '../../components/startup-timeline';
import GlassCard from '@/components/ui/glass-card';

export default function JourneyPage() {
  return (
    <div className="py-8 md:py-12 px-4">
      <GlassCard className="w-full max-w-5xl mx-auto p-6 md:p-10" intensity="medium" borderGlow>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-700 via-teal-600 to-green-600 bg-clip-text text-transparent text-center">My Journey</h1>
        <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 text-center">From education to startups - explore my professional path and milestones.</p>
        
        {/* Pass both education and experience data to the timeline component */}
        <StartupTimeline
          experiences={portfolioData.experience}
          education={portfolioData.education}
        />
      </GlassCard>
    </div>
  );
}