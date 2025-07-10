"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Lightbulb,
  Code,
  Rocket,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  Building,
  Home,
  Brain,
  BarChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Experience } from "@/types/portfolio";

interface StartupMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  stage: "idea" | "development" | "launch" | "growth" | "revenue";
  icon: React.ReactNode;
  company: "HyperWater.ai" | "RoomieHub";
  metrics?: {
    label: string;
    value: string;
  }[];
  achievements?: string[];
  businessValue: string;
}

interface StartupTimelineProps {
  experiences: Experience[];
  className?: string;
}

const stageColors = {
  idea: {
    primary: "#3b82f6",
    secondary: "#dbeafe",
    gradient: "from-blue-500 to-indigo-600"
  },
  development: {
    primary: "#8b5cf6",
    secondary: "#ede9fe",
    gradient: "from-purple-500 to-violet-600"
  },
  launch: {
    primary: "#f59e0b",
    secondary: "#fef3c7",
    gradient: "from-amber-500 to-orange-600"
  },
  growth: {
    primary: "#10b981",
    secondary: "#d1fae5",
    gradient: "from-emerald-500 to-green-600"
  },
  revenue: {
    primary: "#ef4444",
    secondary: "#fee2e2",
    gradient: "from-red-500 to-pink-600"
  }
};

function createMilestonesFromExperience(experience: Experience): StartupMilestone[] {
  const isHyperWater = experience.id === "hyperwater_ai";
  const companyIcon = isHyperWater ? <Building className="h-4 w-4" /> : <Home className="h-4 w-4" />;
  
  const baseMilestones: StartupMilestone[] = [
    {
      id: `${experience.id}-idea`,
      title: `${experience.company} - Initial Vision`,
      description: isHyperWater 
        ? "AI-powered construction industry solution with GraphRAG for architectural drawings"
        : "AI-powered roommate matching platform with personalized recommendations",
      date: "2024-06-01", // Approximate start dates
      stage: "idea",
      icon: <Lightbulb className="h-4 w-4" />,
      company: experience.company as "HyperWater.ai" | "RoomieHub",
      businessValue: "Identified market opportunity in underserved sector",
      achievements: ["Market research", "Problem validation", "Initial concept"]
    },
    {
      id: `${experience.id}-development`,
      title: "AI System Development",
      description: isHyperWater
        ? "Built GraphRAG system for architectural drawings with vision models and RLHF feedback"
        : "Developed LLaMA-based AI features with matching algorithms and content moderation",
      date: "2024-07-01",
      stage: "development",
      icon: <Brain className="h-4 w-4" />,
      company: experience.company as "HyperWater.ai" | "RoomieHub",
      metrics: isHyperWater ? [
        { label: "GraphRAG Accuracy", value: "90%" },
        { label: "Cost Reduction", value: "8x" }
      ] : [
        { label: "Team Size", value: "20+ engineers" },
        { label: "Safety Improvement", value: "50%" }
      ],
      businessValue: experience.achievements[0]?.business_value || "Core AI capabilities built",
      achievements: experience.achievements.slice(0, 2).map(a => a.description)
    },
    {
      id: `${experience.id}-launch`,
      title: "Platform Launch",
      description: isHyperWater
        ? "Deployed GraphRAG system with bid recommendation module and cost optimization"
        : "Launched AI-powered matching platform with LLaMA integration on AWS",
      date: "2024-09-01",
      stage: "launch",
      icon: <Rocket className="h-4 w-4" />,
      company: experience.company as "HyperWater.ai" | "RoomieHub",
      metrics: isHyperWater ? [
        { label: "Processing Speed", value: "2.25x faster" },
        { label: "Document Accuracy", value: "90%" }
      ] : [
        { label: "Matching Algorithm", value: "Cosine Similarity" },
        { label: "Platform Type", value: "Serverless" }
      ],
      businessValue: experience.achievements[2]?.business_value || "Product successfully deployed",
      achievements: experience.achievements.slice(2, 4).map(a => a.description)
    },
    {
      id: `${experience.id}-revenue`,
      title: "Revenue Generation",
      description: `${experience.company} achieved profitability through ${experience.business_impact}`,
      date: "2024-11-01",
      stage: "revenue",
      icon: <DollarSign className="h-4 w-4" />,
      company: experience.company as "HyperWater.ai" | "RoomieHub",
      metrics: [
        { label: "Status", value: "Revenue Positive" },
        { label: "Impact", value: experience.business_impact.split(' ').slice(0, 3).join(' ') }
      ],
      businessValue: experience.business_impact,
      achievements: [
        "Zero to revenue achieved",
        experience.leadership_role,
        "Sustainable business model"
      ]
    }
  ];

  return baseMilestones;
}

function TimelineItem({ 
  milestone, 
  index, 
  isActive, 
  onClick 
}: { 
  milestone: StartupMilestone; 
  index: number; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  const stageColor = stageColors[milestone.stage];
  const isHyperWater = milestone.company === "HyperWater.ai";

  return (
    <motion.div
      className="relative flex items-center cursor-pointer group"
      onClick={onClick}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* Company badge */}
      <div className={cn(
        "absolute -top-3 left-0 px-2 py-1 rounded-full text-xs font-medium",
        "backdrop-blur-md border",
        isHyperWater 
          ? "bg-blue-500/20 border-blue-500/30 text-blue-300" 
          : "bg-purple-500/20 border-purple-500/30 text-purple-300"
      )}>
        {milestone.company}
      </div>

      {/* Timeline dot */}
      <motion.div
        className={cn(
          "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-300",
          "backdrop-blur-md bg-white/10 border-white/20",
          isActive && "scale-125 shadow-lg"
        )}
        style={{
          backgroundColor: isActive ? stageColor.primary : 'rgba(255,255,255,0.1)',
          borderColor: isActive ? stageColor.primary : 'rgba(255,255,255,0.2)',
          boxShadow: isActive ? `0 0 30px ${stageColor.primary}40` : 'none'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="text-white"
          animate={{ 
            color: isActive ? '#ffffff' : '#94a3b8',
            scale: isActive ? 1.1 : 1 
          }}
          transition={{ duration: 0.2 }}
        >
          {milestone.icon}
        </motion.div>

        {/* Orbital dots for active state */}
        {isActive && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * 2 * Math.PI;
              const radius = 30;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: stageColor.primary,
                    left: '50%',
                    top: '50%',
                    x: x - 4,
                    y: y - 4,
                  }}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.2 }
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        className={cn(
          "ml-6 p-6 rounded-xl backdrop-blur-md border transition-all duration-300 min-w-[400px]",
          "bg-white/5 border-white/10",
          isActive && "bg-white/10 border-white/20 shadow-xl"
        )}
        style={{
          boxShadow: isActive ? `0 8px 32px ${stageColor.primary}20` : 'none'
        }}
        whileHover={{ scale: 1.02 }}
        layout
      >
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
          <div className={cn(
            "px-2 py-1 rounded-md text-xs font-medium",
            `bg-gradient-to-r ${stageColor.gradient} text-white`
          )}>
            {milestone.stage.toUpperCase()}
          </div>
        </div>
        
        <p className="text-white/80 mb-4 leading-relaxed">
          {milestone.description}
        </p>

        {/* Business Value Highlight */}
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <BarChart className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">Business Impact</span>
          </div>
          <p className="text-sm text-green-200">{milestone.businessValue}</p>
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {milestone.metrics && (
                <div className="grid grid-cols-2 gap-4">
                  {milestone.metrics.map((metric, i) => (
                    <motion.div
                      key={i}
                      className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="text-sm text-white/60">{metric.label}</div>
                      <div className="text-lg font-semibold text-white">{metric.value}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {milestone.achievements && (
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Key Achievements
                  </h4>
                  <div className="space-y-1">
                    {milestone.achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2 text-sm text-white/70"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        {achievement}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function StartupTimeline({ experiences, className }: StartupTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get startup experiences (HyperWater.ai and RoomieHub)
  const startupExperiences = experiences.filter(exp => 
    exp.type === "Startup Leadership" && 
    (exp.id === "hyperwater_ai" || exp.id === "roomiehub")
  );

  // Create milestones from experiences
  const allMilestones = startupExperiences.flatMap(exp => createMilestonesFromExperience(exp));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
        className
      )}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, #10b981 0%, transparent 50%),
            radial-gradient(circle at 60% 90%, #ef4444 0%, transparent 50%)
          `,
          y: backgroundY
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="h-8 w-8 text-green-400" />
            <h1 className="text-5xl font-bold text-white">
              Zero to Revenue
            </h1>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Two AI startups, two revenue-generating success stories. See how Pranit led HyperWater.ai and RoomieHub from initial concepts to profitable businesses.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300 font-medium">HyperWater.ai</span>
              <span className="text-white/60">Construction AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-400" />
              <span className="text-purple-300 font-medium">RoomieHub</span>
              <span className="text-white/60">Matching Platform</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {allMilestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.id}
                milestone={milestone}
                index={index}
                isActive={activeIndex === index}
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">2</div>
            <div className="text-white/80">Startups Led to Revenue</div>
          </div>
          <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">8x</div>
            <div className="text-white/80">Cost Optimization Achieved</div>
          </div>
          <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">20+</div>
            <div className="text-white/80">Engineers Managed</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StartupTimeline; 