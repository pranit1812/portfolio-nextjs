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
  isStatus?: boolean;
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
    achievements: [`GPA: ${edu.gpa}`, `Location: ${edu.location}`],
    keyMetrics: [
      edu.location,
      edu.focus_areas[0],
      edu.focus_areas[1] || '',
      edu.focus_areas[2] || ''
    ].filter(Boolean),
    technologies: edu.focus_areas,
    isEducation: true,
    isStatus: false
  }));

  // Add "open to opportunities" status node
  const statusNode: TimelineItem = {
    id: "status-europe-uk",
    company: "Open to AI Developer Opportunities",
    title: "Europe and UK",
    duration: "Current",
    businessImpact: "Currently seeking AI Developer roles in Europe and UK (visa sponsorship required). Let's connect!",
    achievements: ["Available for immediate start", "Open to consulting and full-time roles", "Visa sponsorship required"],
    keyMetrics: ["Available", "AI/ML", "Europe & UK", "Visa Support"],
    technologies: [],
    isEducation: false,
    isStatus: true
  };

  // Combine and sort all items chronologically (newest first)
  const timelineData: TimelineItem[] = [
    statusNode,
    ...[
      ...allExperiences.map(exp => ({
        id: exp.id,
        company: exp.company,
        title: exp.title,
        duration: exp.duration,
        businessImpact: exp.business_impact || exp.summary || '',
        achievements: exp.achievements?.map((a: any) => a.description || a) || [],
        keyMetrics: exp.company === "HyperWater.ai" ? [
          "90% accuracy rate",
          "8x cost reduction",
          "10k+ documents processed",
          "Zero to revenue achieved"
        ] : exp.company === "RoomieHub" ? [
          "20+ engineers led",
          "50% match improvement",
          "Thousands of users",
          "40% retention increase"
        ] : [],
        technologies: exp.skills_used || [],
        isEducation: false,
        isStatus: false
      })),
      ...educationItems
    ].sort((a, b) => {
      // Custom sorting: status first, then by year (newest first)
      if (a.isStatus) return -1;
      if (b.isStatus) return 1;
      
      // Extract years for sorting (newest first)
      const aYear = parseInt((a.duration.match(/\d{4}/) || ['0'])[0]);
      const bYear = parseInt((b.duration.match(/\d{4}/) || ['0'])[0]);
      return bYear - aYear;
    })
  ];

  const getItemColor = (item: TimelineItem) => {
    if (item.isStatus) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (item.isEducation) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (item.company.includes('HyperWater')) return 'bg-gradient-to-r from-purple-500 to-purple-600';
    if (item.company.includes('Roomie')) return 'bg-gradient-to-r from-teal-500 to-teal-600';
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  const getDotColor = (item: TimelineItem) => {
    if (item.isStatus) return 'border-blue-500 bg-blue-500';
    if (item.isEducation) return 'border-green-500 bg-green-500';
    if (item.company.includes('HyperWater')) return 'border-purple-500 bg-purple-500';
    if (item.company.includes('Roomie')) return 'border-teal-500 bg-teal-500';
    return 'border-blue-500 bg-blue-500';
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Timeline line - positioned for better mobile/desktop experience */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-teal-500 to-green-500"></div>
      
      <div className="space-y-8">
        {timelineData.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Timeline dot */}
            <div className={`absolute left-4 md:left-6 w-4 h-4 rounded-full border-2 bg-white ${getDotColor(item)} shadow-lg z-10`}></div>
            
            {/* Content card */}
            <div className="ml-12 md:ml-16">
                <GlassCard
                className={`p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  item.isStatus ? 'ring-2 ring-blue-500/50' : ''
                }`}
                  intensity="medium"
                borderGlow={item.isStatus}
                  interactive
                  onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className={`w-3 h-3 rounded-full ${getItemColor(item)}`}></div>
                    <span className="text-sm font-semibold text-gray-700">{item.duration}</span>
                    {item.isEducation && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Education</span>
                    )}
                    {item.isStatus && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Available</span>
                    )}
                  </div>
                </div>

                {/* Company and Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-700 via-teal-600 to-green-600 bg-clip-text text-transparent">
                  {item.company}
                </h3>
                <h4 className="text-lg text-blue-600 mb-3 font-medium">{item.title}</h4>
                
                {/* Business Impact */}                <p className="text-gray-800 mb-4 leading-relaxed font-medium">{item.businessImpact}</p>
                  
                {/* Key Metrics Grid */}
                {item.keyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {item.keyMetrics.map((metric, i) => (
                      <div key={i} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg p-3 text-center shadow-sm">
                        <p className="text-sm text-blue-700 font-medium">{metric}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Expand/Collapse indicator */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    {selectedItem === item.id ? '↑ Click to collapse' : '↓ Click to expand details'}
                  </div>
                  {item.technologies.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {item.technologies.length} technologies
                    </div>
                  )}
                  </div>

                  {/* Expanded Details */}
                  {selectedItem === item.id && (
                  <div className="mt-6 p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 space-y-6">
                    {/* Achievements */}
                    {item.achievements.length > 0 && (
                        <div>
                        <h5 className="text-blue-700 font-semibold mb-3 flex items-center gap-2">
                          <span>🏆</span> Key Achievements
                        </h5>
                          <div className="space-y-2">
                            {item.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-gray-800 leading-relaxed">{achievement}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                    )}
                    
                    {/* Technologies */}
                    {item.technologies.length > 0 && (
                        <div>
                        <h5 className="text-blue-700 font-semibold mb-3 flex items-center gap-2">
                          <span>🛠️</span> Technologies & Skills
                        </h5>
                          <div className="flex flex-wrap gap-2">
                            {item.technologies.map((tech, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm text-blue-700 border border-white/40 font-medium"
                            >
                                {tech}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                    </div>
                  )}
                </GlassCard>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
} 