'use client';

import React from 'react';
import Link from 'next/link';
import portfolioData from '../../pranit-portfolio-json.json';
import GlassCard from '@/components/ui/glass-card';

export default function SkillsPage() {
  const { technical_skills, areas_of_expertise } = portfolioData;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <GlassCard className="w-full max-w-6xl mx-auto p-8 md:p-12" intensity="medium" borderGlow>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 bg-clip-text text-transparent text-center">Technical Skills</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">Technology stack and areas of expertise.</p>
        {/* Distribute all skill categories evenly across 3 columns */}
        {(() => {
          type SkillEntry = {
            label: string;
            skills: { name: string; level: string; icon?: string }[];
            key: string;
          };
          const skillEntries: SkillEntry[] = Object.entries(technical_skills).map(([category, skills]) => ({
            label: category.replace(/_/g, ' '),
            skills: skills as { name: string; level: string; icon?: string }[],
            key: category
          }));

          // Split into 3 columns as evenly as possible
          const columns: SkillEntry[][] = [[], [], []];
          skillEntries.forEach((entry, i) => {
            columns[i % 3].push(entry);
          });

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="space-y-6">
                  {col.map((entry: SkillEntry) => (
                    <GlassCard key={entry.key} className="p-6" intensity="light" interactive>
                      <h4 className="text-lg font-semibold mb-4 text-pink-600 capitalize">
                        {entry.label}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {entry.skills.map((skill, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                                <div className="text-xs text-gray-600">{skill.level}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                skill.level === 'Expert' ? 'bg-green-100 text-green-700' :
                                skill.level === 'Advanced' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {skill.level}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}
      </GlassCard>
    </div>
  );
}