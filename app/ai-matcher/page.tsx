'use client';

import React from 'react';
import { Brain, Sparkles, MessageCircle, Zap, Database, Search } from 'lucide-react';
import portfolioData from '../../pranit-portfolio-json.json';
import GlassCard from '@/components/ui/glass-card';

export default function AiMatcherPage() {
  return (
    <>
      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-gray-800">Powered by RAG</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 bg-clip-text text-transparent">
              Pranit.AI
            </h1>
            
            <p className="text-xl text-gray-800 max-w-3xl mx-auto font-medium">
              Ask me anything about my experience, projects, or skills and get detailed answers powered by RAG technology.
            </p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <GlassCard className="p-6" intensity="medium" interactive hoverEffect>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Anything</h3>
                <p className="text-gray-700">
                  Get detailed answers about my experience, skills, and projects.
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6" intensity="medium" interactive hoverEffect>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">RAG-Powered</h3>
                <p className="text-gray-700">
                  Retrieval Augmented Generation for accurate, context-aware responses.
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6" intensity="medium" interactive hoverEffect>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">See How It Works</h3>
                <p className="text-gray-700">
                  Visualize the RAG process with our interactive demonstration.
                </p>
              </div>
            </GlassCard>
          </div>
          
          {/* Instructions */}
          <GlassCard className="p-8 mb-16 text-center" intensity="light">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
            <p className="text-gray-700 mb-6">
              Click the chat icon in the bottom right corner to start asking questions. You can also see how RAG works behind the scenes!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Limited to 5 questions per hour</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}