"use client";

import React, { useState } from 'react';
import GlassCard from '@/components/ui/glass-card';

interface TimelineItem {
  id: string;
  company: string;
  title: string;
  duration: string;
  businessImpact: string;
  achievements: string[];
  keyMetrics: string[];
  technologies: string[];
  isEducation?: boolean;
}

interface StartupTimelineProps {
  experiences: any[];
  education?: any[];
}

export default function StartupTimeline({ experiences, education = [] }: StartupTimelineProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Create a combined timeline with both education and all experiences
  const allExperiences = experiences || [];
  
  // Map education data to timeline format
  const educationItems = education.map(edu => ({
    id: `edu_${edu.institution}`,
    company: edu.institution,
    title: edu.degree,
    duration: edu.duration,
    businessImpact: `Focus areas: ${edu.focus_areas.join(', ')}`,
    achievements: [`GPA: ${edu.gpa}`],
    keyMetrics: [
      edu.location,
      edu.focus_areas[0],
      edu.focus_areas[1] || '',
      edu.focus_areas[2] || ''
    ],
    technologies: edu.focus_areas,
    isEducation: true
  }));

  // Add "open to opportunities" status node
  const statusNode: TimelineItem = {
    id: "status-uk-london",
    company: "Open to Opportunities",
    title: "UK, London Area",
    duration: "",
    businessImpact: "Currently seeking new roles in the UK, London area. Let's connect!",
    achievements: [],
    keyMetrics: ["Available", "Consulting", "Full-time", "London"],
    technologies: [],
    isEducation: false
  };

  // Combine and sort all items chronologically (newest first)
  const timelineData: TimelineItem[] = [
    statusNode,
    ...[
      ...educationItems,
      ...allExperiences.map(exp => ({
        id: exp.id,
        company: exp.company,
        title: exp.title,
        duration: exp.duration,
        businessImpact: exp.business_impact,
        achievements: exp.achievements?.map((a: any) => a.description) || [],
        keyMetrics: exp.company === "HyperWater.ai" ? [
          "90% accuracy rate",
          "8x cost reduction",
          "10k+ documents processed",
          "Zero to revenue achieved"
        ] : [
          "20+ engineers led",
          "50% match improvement",
          "Thousands of users",
          "40% retention increase"
        ],
        technologies: exp.skills_used || []
      }))
    ].sort((a, b) => {
      // Extract years for sorting (newest first)
      const aYear = parseInt(a.duration.split(' - ')[0].split('/')[1] || '0');
      const bYear = parseInt(b.duration.split(' - ')[0].split('/')[1] || '0');
      return bYear - aYear;
    })
  ];

  return (
    <div className="relative py-16 flex justify-center">
      {/* Vertical Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full z-0" style={{ transform: 'translateX(-50%)' }} />
      <div className="flex flex-col items-center space-y-16 relative z-10 w-full max-w-5xl mx-auto">
        {/* Centered "Open to Opportunities" card */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-2xl">
            <GlassCard className="p-6 w-full" intensity="medium" borderGlow>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-sm font-medium text-gray-500">{timelineData[0].title}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{timelineData[0].company}</h3>
              <h4 className="text-lg text-purple-600 mb-3">{timelineData[0].title}</h4>
              <p className="text-gray-700 mb-4">{timelineData[0].businessImpact}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {timelineData[0].keyMetrics.map((metric, i) => (
                  <div key={i} className="bg-green-100 border border-green-300 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-700 font-medium">{metric}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
        {/* Alternating left/right cards for the rest, touching the center line */}
        {timelineData.slice(1).map((item, index) => (
          <div key={item.id} className="w-full flex items-center justify-center relative">
                          {index % 2 === 0 ? (
              <>
                <div className="flex justify-end w-1/2 pr-4">
                  <div className="relative max-w-2xl w-full">
                    <GlassCard 
                      className="p-6 w-full" 
                      intensity="medium" 
                      interactive 
                      hoverEffect
                      borderGlow
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${
                          item.isEducation ? 'bg-green-500' : 
                          item.company.includes('HyperWater') ? 'bg-blue-500' : 
                          item.company.includes('Roomie') ? 'bg-purple-500' : 
                          'bg-pink-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-500">{item.duration}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.company}</h3>
                      <h4 className="text-lg text-purple-600 mb-3">{item.title}</h4>
                      <p className="text-gray-700 mb-4">{item.businessImpact}</p>
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {item.keyMetrics.map((metric, i) => (
                          <div key={i} className="bg-green-100 border border-green-300 rounded-lg p-2 text-center">
                            <p className="text-xs text-green-700 font-medium">{metric}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-purple-600 hover:text-purple-800">
                        {selectedItem === item.id ? 'Click to collapse' : 'Click to expand details →'}
                      </div>

                      {/* Expanded Details */}
                      {selectedItem === item.id && (
                        <GlassCard className="mt-4 p-6 w-full" intensity="light">
                          <div className="space-y-6">
                            <div>
                              <h5 className="text-purple-700 font-medium mb-3">Key Achievements</h5>
                              <div className="space-y-2">
                                {item.achievements.map((achievement, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <p className="text-sm text-gray-800">{achievement}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-purple-700 font-medium mb-3">Technologies Used</h5>
                              <div className="flex flex-wrap gap-2">
                                {item.technologies.map((tech, i) => (
                                  <span key={i} className="px-3 py-1 bg-purple-100 rounded-full text-xs text-purple-700">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      )}
                    </GlassCard>
                  </div>
                </div>
                <div className="w-1/2" />
              </>
            ) : (
              <>
                <div className="w-1/2" />
                <div className="flex justify-start w-1/2 pl-4">
                  <div className="relative max-w-2xl w-full">
                    <GlassCard 
                      className="p-6 w-full" 
                      intensity="medium" 
                      interactive 
                      hoverEffect
                      borderGlow
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${
                          item.isEducation ? 'bg-green-500' : 
                          item.company.includes('HyperWater') ? 'bg-blue-500' : 
                          item.company.includes('Roomie') ? 'bg-purple-500' : 
                          'bg-pink-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-500">{item.duration}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.company}</h3>
                      <h4 className="text-lg text-purple-600 mb-3">{item.title}</h4>
                      <p className="text-gray-700 mb-4">{item.businessImpact}</p>
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {item.keyMetrics.map((metric, i) => (
                          <div key={i} className="bg-green-100 border border-green-300 rounded-lg p-2 text-center">
                            <p className="text-xs text-green-700 font-medium">{metric}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-purple-600 hover:text-purple-800">
                        {selectedItem === item.id ? 'Click to collapse' : 'Click to expand details →'}
                      </div>

                      {/* Expanded Details */}
                      {selectedItem === item.id && (
                        <GlassCard className="mt-4 p-6 w-full" intensity="light">
                          <div className="space-y-6">
                            <div>
                              <h5 className="text-purple-700 font-medium mb-3">Key Achievements</h5>
                              <div className="space-y-2">
                                {item.achievements.map((achievement, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <p className="text-sm text-gray-800">{achievement}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-purple-700 font-medium mb-3">Technologies Used</h5>
                              <div className="flex flex-wrap gap-2">
                                {item.technologies.map((tech, i) => (
                                  <span key={i} className="px-3 py-1 bg-purple-100 rounded-full text-xs text-purple-700">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      )}
                    </GlassCard>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 