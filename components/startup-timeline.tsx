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
    <div className="relative py-8 flex justify-center">
      {/* Vertical Timeline Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-teal-500 to-green-500 rounded-full z-0" style={{ transform: 'translateX(-50%)' }} />
      
      <div className="flex flex-col items-center space-y-12 relative z-10 w-full max-w-5xl mx-auto">
        {/* Centered "Open to Opportunities" card */}
        <div className="flex justify-center w-full px-4">
          <div className="w-full max-w-md md:max-w-2xl">
            <GlassCard
              className="p-5 md:p-6 w-full"
              intensity="medium"
              borderGlow
              interactive
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-500">{timelineData[0].title}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-700 via-teal-600 to-green-600 bg-clip-text text-transparent">{timelineData[0].company}</h3>
              <p className="text-gray-700 mb-4">{timelineData[0].businessImpact}</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {timelineData[0].keyMetrics.map((metric, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2 text-center shadow-sm">
                    <p className="text-xs text-blue-700 font-medium">{metric}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
        
        {/* Timeline items - vertical on mobile, alternating on desktop */}
        {timelineData.slice(1).map((item, index) => (
          <div key={item.id} className="w-full flex flex-col md:flex-row items-start md:items-center justify-center relative">
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10" style={{ transform: 'translateX(-50%)', marginTop: '1.5rem' }}></div>
            
            {/* Desktop: Alternating left/right cards */}
            <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'} pl-12 md:pl-0`}>
              <div className="relative max-w-md w-full mx-auto md:mx-0 md:ml-auto">
                <GlassCard
                  className="p-5 md:p-6 w-full"
                  intensity="medium"
                  interactive
                  hoverEffect
                  borderGlow
                  onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      item.isEducation ? 'bg-green-500' :
                      item.company.includes('HyperWater') ? 'bg-blue-500' :
                      item.company.includes('Roomie') ? 'bg-teal-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-500">{item.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-700 via-teal-600 to-green-600 bg-clip-text text-transparent">{item.company}</h3>
                  <h4 className="text-lg text-blue-600 mb-3">{item.title}</h4>
                  <p className="text-gray-700 mb-4">{item.businessImpact}</p>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {item.keyMetrics.map((metric, i) => (
                      <div key={i} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2 text-center shadow-sm">
                        <p className="text-xs text-blue-700 font-medium">{metric}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    {selectedItem === item.id ? 'Click to collapse' : 'Click to expand details →'}
                  </div>

                  {/* Expanded Details */}
                  {selectedItem === item.id && (
                    <div className="mt-4 p-4 w-full bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      <div className="space-y-5">
                        <div>
                          <h5 className="text-blue-700 font-medium mb-3">Key Achievements</h5>
                          <div className="space-y-2">
                            {item.achievements.map((achievement, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <p className="text-sm text-gray-800">{achievement}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-blue-700 font-medium mb-3">Technologies Used</h5>
                          <div className="flex flex-wrap gap-2">
                            {item.technologies.map((tech, i) => (
                              <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-blue-700 border border-white/30">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
            
            {/* Empty div for alternating layout on desktop */}
            <div className="hidden md:block md:w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 