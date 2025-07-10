'use client';

import React from 'react';
import Link from 'next/link';
import portfolioData from '../../pranit-portfolio-json.json';
import GlassCard from '@/components/ui/glass-card';

export default function ProjectsPage() {
  const { projects } = portfolioData;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <GlassCard className="w-full max-w-4xl mx-auto p-8 md:p-12" intensity="medium" borderGlow>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 bg-clip-text text-transparent text-center">Projects</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">Technical projects and innovative solutions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <GlassCard 
              key={project.id} 
              className="p-8" 
              intensity="light" 
              interactive 
              hoverEffect
              borderGlow={index % 2 === 0}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-purple-600 font-medium">{project.type}</span>
                {project.demo_available && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Demo Available</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.duration}</p>
              <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>
              
              <div className="mb-6">
                <h5 className="text-gray-900 font-semibold mb-3">Key Achievements</h5>
                <div className="space-y-2">
                  {project.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {project.skills_used.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-sm text-green-700 font-medium bg-green-50 p-3 rounded-lg mb-4">
                {project.business_value}
              </div>
              
              {project.github_link && (
                <div>
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium">
                    View Code →
                  </a>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}