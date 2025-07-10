"use client"

import * as React from "react"
import { useState } from "react"
import { Brain, Sparkles, Target, ArrowRight, CheckCircle, Star, Zap, Building, Home, DollarSign, Users, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { PortfolioData, ExpertiseArea } from "@/types/portfolio"
import portfolioData from '../pranit-portfolio-json.json'

interface MatchResult {
  skillArea: string;
  relevance: number;
  experience: string;
  businessValue: string;
  keywords: string[];
}

interface AISkillMatcherProps {
  portfolioData: PortfolioData;
  className?: string;
}

interface Match {
  type: 'experience' | 'project' | 'skill_area';
  item: any;
  relevance: number;
  reason: string;
}

const sampleRequirements = [
  {
    id: "ai-consultant",
    text: "Need an AI consultant to reduce our processing costs and build a RAG system",
    keywords: ["ai", "consultant", "cost", "optimization", "rag", "cost reduction"]
  },
  {
    id: "startup-leader",
    text: "Looking for a technical leader who has taken startups from 0 to revenue",
    keywords: ["startup", "leadership", "revenue", "zero to one", "technical leader"]
  },
  {
    id: "graphrag-expert",
    text: "Need GraphRAG implementation for document processing and knowledge extraction",
    keywords: ["graphrag", "document", "processing", "knowledge", "extraction", "microsoft"]
  },
  {
    id: "team-leader",
    text: "Seeking an AI engineer who can manage large teams and deliver on time",
    keywords: ["team", "management", "ai engineer", "delivery", "leadership"]
  }
];

function analyzeSkillMatch(requirements: string, portfolioData: PortfolioData): MatchResult[] {
  const reqWords = requirements.toLowerCase().split(/\s+/);
  const results: MatchResult[] = [];

  // Analyze against expertise areas
  portfolioData.areas_of_expertise.forEach(area => {
    let relevance = 0;
    const matchedKeywords: string[] = [];

    area.skills.forEach(skill => {
      reqWords.forEach(word => {
        if (skill.toLowerCase().includes(word) || word.includes(skill.toLowerCase())) {
          relevance += 0.2;
          if (!matchedKeywords.includes(skill)) {
            matchedKeywords.push(skill);
          }
        }
      });
    });

    // Check against skill matcher keywords
    Object.entries(portfolioData.ai_skill_matcher_keywords).forEach(([key, keywords]) => {
      keywords.forEach(keyword => {
        if (reqWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))) {
          relevance += 0.3;
          if (!matchedKeywords.includes(keyword)) {
            matchedKeywords.push(keyword);
          }
        }
      });
    });

    if (relevance > 0) {
      // Find relevant experience
      const relatedExp = portfolioData.experience.find(exp => 
        exp.skills_used.some(skill => 
          area.skills.some(areaSkill => 
            skill.toLowerCase().includes(areaSkill.toLowerCase())
          )
        )
      );

      results.push({
        skillArea: area.category,
        relevance: Math.min(relevance, 1),
        experience: relatedExp ? `${relatedExp.company} - ${relatedExp.business_impact}` : area.category,
        businessValue: relatedExp?.business_impact || `Expertise in ${area.category}`,
        keywords: matchedKeywords.slice(0, 4)
      });
    }
  });

  // Add specific achievements as skill areas
  portfolioData.career_highlights.forEach(highlight => {
    let relevance = 0;
    const matchedKeywords: string[] = [];

    reqWords.forEach(word => {
      if (highlight.achievement.toLowerCase().includes(word) || 
          highlight.context.toLowerCase().includes(word) ||
          highlight.impact.toLowerCase().includes(word)) {
        relevance += 0.25;
        matchedKeywords.push(word);
      }
    });

    if (relevance > 0) {
      results.push({
        skillArea: highlight.achievement,
        relevance: Math.min(relevance, 1),
        experience: highlight.context,
        businessValue: highlight.impact,
        keywords: matchedKeywords.slice(0, 4)
      });
    }
  });

  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 6);
}

export function AISkillMatcher({ portfolioData, className }: AISkillMatcherProps) {
  const [userInput, setUserInput] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const mockPortfolioData = {
    experience: [
      {
        id: 1,
        title: "Co-founder & CTO",
        company: "HyperWater.ai",
        business_impact: "Built GraphRAG system achieving 90% accuracy while reducing processing costs by 8x",
        achievements: [
          { description: "Implemented production-ready GraphRAG system handling thousands of documents" },
          { description: "Achieved 8x cost reduction in AI processing while maintaining 90% accuracy" },
          { description: "Led technical team from MVP to revenue-generating product" }
        ],
        skills_used: ["Python", "LangChain", "GraphRAG", "Vector Databases", "LLMs", "FastAPI"]
      },
      {
        id: 2,
        title: "Co-founder & CTO",
        company: "RoomieHub",
        business_impact: "Led cross-functional team of 20+ engineers to build AI-powered roommate matching platform",
        achievements: [
          { description: "Scaled platform to thousands of users with 50% improvement in match quality" },
          { description: "Built ML recommendation engine with real-time matching capabilities" },
          { description: "Achieved zero-to-revenue milestone with AI-driven platform" }
        ],
        skills_used: ["React", "Node.js", "Machine Learning", "Recommendation Systems", "AWS", "MongoDB"]
      }
    ],
    projects: [
      {
        id: 1,
        title: "GraphRAG Document Intelligence",
        description: "Advanced RAG system for complex document analysis and knowledge extraction",
        achievements: [
          "90% accuracy in document analysis",
          "8x cost reduction vs traditional methods",
          "Production deployment handling 10k+ documents"
        ],
        skills_used: ["Python", "LangChain", "Neo4j", "OpenAI", "FastAPI"],
        business_value: "Reduced operational costs by 80% while improving accuracy"
      },
      {
        id: 2,
        title: "AI-Powered Matching Engine",
        description: "Machine learning system for intelligent roommate compatibility matching",
        achievements: [
          "50% improvement in match satisfaction",
          "Real-time processing of user preferences",
          "Scalable to thousands of concurrent users"
        ],
        skills_used: ["Python", "TensorFlow", "Scikit-learn", "Redis", "PostgreSQL"],
        business_value: "Increased user retention by 40% through better matches"
      }
    ],
    areas_of_expertise: [
      {
        category: "Generative AI & LLMs",
        skills: ["GPT Integration", "LangChain", "RAG Systems", "Prompt Engineering", "Fine-tuning"]
      },
      {
        category: "Machine Learning",
        skills: ["TensorFlow", "PyTorch", "Scikit-learn", "MLOps", "Model Deployment"]
      },
      {
        category: "Full-Stack Development",
        skills: ["React", "Node.js", "Python", "FastAPI", "PostgreSQL", "MongoDB"]
      }
    ]
  };

  const analyzeUserNeeds = () => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const keywords = userInput.toLowerCase().split(' ').filter(word => word.length > 2)
      const matches: Match[] = []
      
      // Check experience matches
      mockPortfolioData.experience.forEach(exp => {
        const expText = `${exp.title} ${exp.company} ${exp.business_impact} ${exp.achievements.map(a => a.description).join(' ')} ${exp.skills_used.join(' ')}`.toLowerCase()
        const matchCount = keywords.filter(keyword => expText.includes(keyword)).length
        if (matchCount > 0) {
          matches.push({
            type: 'experience',
            item: exp,
            relevance: matchCount,
            reason: `${matchCount} keyword matches`
          })
        }
      })

      // Check project matches
      mockPortfolioData.projects.forEach(project => {
        const projectText = `${project.title} ${project.description} ${project.achievements.join(' ')} ${project.skills_used.join(' ')} ${project.business_value}`.toLowerCase()
        const matchCount = keywords.filter(keyword => projectText.includes(keyword)).length
        if (matchCount > 0) {
          matches.push({
            type: 'project',
            item: project,
            relevance: matchCount,
            reason: `${matchCount} keyword matches`
          })
        }
      })

      // Check skills matches
      mockPortfolioData.areas_of_expertise.forEach(area => {
        const skillsText = `${area.category} ${area.skills.join(' ')}`.toLowerCase()
        const matchCount = keywords.filter(keyword => skillsText.includes(keyword)).length
        if (matchCount > 0) {
          matches.push({
            type: 'skill_area',
            item: area,
            relevance: matchCount,
            reason: `Expert in ${area.category}`
          })
        }
      })

      // Sort by relevance and take top matches
      const sortedMatches = matches.sort((a, b) => b.relevance - a.relevance).slice(0, 4)
      
      setAnalysis({
        input: userInput,
        matches: sortedMatches,
        summary: sortedMatches.length > 0 
          ? `Found ${sortedMatches.length} relevant matches for your needs`
          : 'No direct matches found, but Pranit\'s diverse Gen AI experience may still be valuable'
      })
      
      setIsAnalyzing(false)
    }, 1500)
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance > 0.7) return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300"
    if (relevance > 0.4) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300"
    return "from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300"
  }

  const getRelevanceText = (relevance: number) => {
    if (relevance > 0.7) return "Perfect Match"
    if (relevance > 0.4) return "Good Match"
    return "Relevant"
  }

  const getSkillIcon = (skillArea: string) => {
    if (skillArea.toLowerCase().includes("startup") || skillArea.toLowerCase().includes("leadership")) {
      return <Building className="w-5 h-5" />
    }
    if (skillArea.toLowerCase().includes("ai") || skillArea.toLowerCase().includes("gen")) {
      return <Brain className="w-5 h-5" />
    }
    if (skillArea.toLowerCase().includes("cost") || skillArea.toLowerCase().includes("revenue")) {
      return <DollarSign className="w-5 h-5" />
    }
    if (skillArea.toLowerCase().includes("team") || skillArea.toLowerCase().includes("manage")) {
      return <Users className="w-5 h-5" />
    }
    return <Code className="w-5 h-5" />
  }

  return (
    <div className={cn(
      "relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden",
      className
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-white">AI-Powered Skill Matching</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            Find Your Perfect Match
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Tell me what you're looking for, and I'll show you exactly how my experience fits your needs.
          </p>
        </div>

        {/* Requirements Input */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">What Are You Looking For?</h2>
            </div>
            
            {/* Sample Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {sampleRequirements.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setUserInput(req.text)}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm text-white">{req.text}</p>
                </button>
              ))}
            </div>
            
            {/* Custom Input */}
            <div className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe what you're looking for: AI consultant, startup advisor, technical leader, GraphRAG expert..."
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
              />
              
              <button
                onClick={analyzeUserNeeds}
                disabled={!userInput.trim() || isAnalyzing}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing your needs...
                  </div>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analyze My Fit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Here's How I Can Help</h2>
              <p className="text-white/70 text-lg">{analysis.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {analysis.matches.map((match: Match, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "relative group bg-gradient-to-br backdrop-blur-xl rounded-xl border p-6 shadow-xl transition-all duration-500 hover:scale-105",
                    getRelevanceColor(match.relevance)
                  )}
                >
                  {/* Match Score */}
                  <div className="absolute -top-3 -right-3 flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-medium text-white">
                      {Math.round(match.relevance * 100)}%
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {getSkillIcon(match.item.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{match.item.category}</h3>
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                        {match.reason}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/80 mb-3">{match.item.title} at {match.item.company}</p>
                  <p className="text-xs text-white/60 mb-4">{match.item.business_impact}</p>
                  
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {match.item.skills_used.slice(0, 4).map((skill: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/80">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                      style={{ width: `${match.relevance * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">Perfect Match Found!</h3>
                <p className="text-white/70 mb-6">
                  Based on your requirements, I have exactly the experience you need. Let's discuss your project.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Let's Talk
                  </button>
                  <button className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                    View My Work
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISkillMatcher; 