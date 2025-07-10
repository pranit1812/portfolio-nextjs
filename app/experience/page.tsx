'use client';

import React from 'react';
import Link from 'next/link';
import portfolioData from '../../pranit-portfolio-json.json';
import GlassCard from '@/components/ui/glass-card';

export default function ExperiencePage() {
  const { experience } = portfolioData;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <GlassCard className="w-full max-w-4xl mx-auto p-8 md:p-12" intensity="medium" borderGlow>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 bg-clip-text text-transparent text-center">Experience</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">Professional experience and leadership roles.</p>
        <div className="space-y-8">
          {experience.map((exp, index) => (
            <GlassCard key={exp.id} className="p-8" intensity="light" interactive>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-purple-600 font-medium">{exp.type}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                  <h4 className="text-xl text-purple-600 font-semibold mb-2">{exp.company}</h4>
                  <p className="text-gray-600 mb-2">{exp.duration}</p>
                  <p className="text-gray-600">{exp.location}</p>
                </div>
                
                <div className="lg:w-2/3">
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="text-green-700 font-semibold mb-2">Business Impact</h5>
                    <p className="text-green-800">{exp.business_impact}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="text-gray-900 font-semibold mb-3">Key Achievements</h5>
                      <div className="space-y-2">
                        {exp.achievements.slice(0, 3).map((achievement, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">{achievement.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-gray-900 font-semibold mb-3">Technologies</h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills_used.slice(0, 6).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <strong className="text-gray-900">Leadership:</strong> {exp.leadership_role}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );
} 