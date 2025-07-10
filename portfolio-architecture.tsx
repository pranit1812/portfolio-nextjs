import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Database, Globe, Cpu, MessageCircle, Smartphone, Cloud, Code, Zap, Brain, FileText, Users, Eye } from 'lucide-react';

type SectionName = 'frontend' | 'backend' | 'data' | 'features';

type ExpandedSections = {
  [key in SectionName]: boolean;
};

const ArchitectureDesigner = () => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    frontend: true,
    backend: true,
    data: true,
    features: true
  });

  const toggleSection = (section: SectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const ComponentBox = ({
    title,
    items,
    icon: Icon,
    color,
    section
  }: {
    title: string;
    items: Array<{
      name: string;
      description: string;
      tech?: string[];
    }>;
    icon: React.ElementType;
    color: string;
    section: SectionName;
  }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-xl">
      <div 
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => toggleSection(section)}
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {expandedSections[section] ? <ChevronDown className="w-4 h-4 text-white/70" /> : <ChevronRight className="w-4 h-4 text-white/70" />}
      </div>
      {expandedSections[section] && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="font-medium text-white text-sm">{item.name}</div>
              <div className="text-white/70 text-xs mt-1">{item.description}</div>
              {item.tech && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tech.map((t, i) => (
                    <span key={i} className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const frontendComponents = [
    {
      name: "Portfolio UI",
      description: "Glassmorphism design, responsive, JSON-driven content",
      tech: ["React/Next.js", "Tailwind CSS", "Framer Motion"]
    },
    {
      name: "Pranit.AI Chat Widget",
      description: "Bottom-right chatbot with 5-question limit per user",
      tech: ["React", "WebSocket", "LocalStorage"]
    },
    {
      name: "Interactive Resume Sections",
      description: "Dynamic sections populated from JSON data",
      tech: ["React Components", "JSON Schema"]
    },
    {
      name: "Blog/Documentation Viewer",
      description: "Markdown renderer with syntax highlighting",
      tech: ["MDX", "Prism.js", "React Markdown"]
    }
  ];

  const backendComponents = [
    {
      name: "Pranit.AI API",
      description: "Gen AI chatbot backend with rate limiting",
      tech: ["Node.js/Python", "OpenAI/Anthropic API", "Redis"]
    },
    {
      name: "Content Management",
      description: "JSON data serving and blog content management",
      tech: ["Express.js", "File System", "JSON Validation"]
    },
    {
      name: "Analytics & Tracking",
      description: "User interaction tracking and portfolio analytics",
      tech: ["Analytics API", "PostgreSQL", "Rate Limiting"]
    }
  ];

  const dataComponents = [
    {
      name: "Portfolio JSON Schema",
      description: "Structured data for work, education, projects, publications",
      tech: ["JSON Schema", "TypeScript Types"]
    },
    {
      name: "Chat Conversation Store",
      description: "Store chat history and user question limits",
      tech: ["Redis", "Session Management"]
    },
    {
      name: "Blog Content",
      description: "Markdown files or CMS for blog posts",
      tech: ["Markdown", "Front Matter", "Git-based CMS"]
    }
  ];

  const uniqueFeatures = [
    {
      name: "AI Code Review Showcase",
      description: "Live demo of your GraphRAG work with interactive explanations",
      tech: ["Interactive Demos", "Code Visualization"]
    },
    {
      name: "Knowledge Graph Visualizer",
      description: "Interactive visualization of your expertise connections",
      tech: ["D3.js", "Network Graphs", "Gen AI Concepts"]
    },
    {
      name: "AI Project Playground",
      description: "Mini-demos of your AI projects visitors can interact with",
      tech: ["Web Workers", "TensorFlow.js", "Model Demos"]
    },
    {
      name: "Smart Resume Parser",
      description: "AI that explains your resume sections in different contexts",
      tech: ["NLP", "Context Switching", "Dynamic Explanations"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Pranit's Gen AI Portfolio Architecture</h1>
          <p className="text-white/70">Modern, AI-powered portfolio with glassmorphism UI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComponentBox 
            title="Frontend Layer" 
            items={frontendComponents}
            icon={Globe}
            color="text-green-400"
            section="frontend"
          />
          <ComponentBox 
            title="Backend Services" 
            items={backendComponents}
            icon={Cloud}
            color="text-blue-400"
            section="backend"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComponentBox 
            title="Data Layer" 
            items={dataComponents}
            icon={Database}
            color="text-yellow-400"
            section="data"
          />
          <ComponentBox 
            title="🚀 Unique Gen AI Features" 
            items={uniqueFeatures}
            icon={Brain}
            color="text-purple-400"
            section="features"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Architecture Flow
          </h3>
          <div className="text-white/80 space-y-2">
            <div>1. <strong>JSON Data</strong> → Populates all portfolio sections dynamically</div>
            <div>2. <strong>Pranit.AI Chat</strong> → Answers questions about you (5 per user limit)</div>
            <div>3. <strong>Glassmorphism UI</strong> → Clean, modern design with backdrop blur effects</div>
            <div>4. <strong>Gen AI Showcase</strong> → Interactive demos of your GraphRAG and AI work</div>
            <div>5. <strong>Mobile Responsive</strong> → Optimized for all device sizes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDesigner;