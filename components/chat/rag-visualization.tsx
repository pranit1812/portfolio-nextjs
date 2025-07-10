'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, Search, Database, Cpu, MessageSquare, Lightbulb, ArrowDown } from 'lucide-react';
import EmbeddingVisualization from './embedding-visualization';
import GlassCard from '../ui/glass-card';

interface RagData {
  question: string;
  embedding: number[];
  retrievedChunks: { id: string; text: string; source: string }[];
  answer: string;
  context?: string;
  totalChunks?: number;
}

interface RAGVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
  ragData: RagData | null;
}

const RAGVisualization: React.FC<RAGVisualizationProps> = ({ isOpen, onClose, ragData }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const totalSteps = 4;
  
  // Refs for each step section
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  
  // InView states for each step
  const step1InView = useInView(stepRefs[0], { amount: 0.5 });
  const step2InView = useInView(stepRefs[1], { amount: 0.5 });
  const step3InView = useInView(stepRefs[2], { amount: 0.5 });
  const step4InView = useInView(stepRefs[3], { amount: 0.5 });
  
  // Container ref for scrolling
  const containerRef = useRef<HTMLDivElement>(null);

  // Track if scroll is from user or auto-scroll
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  // Auto-scrolling effect
  useEffect(() => {
    if (isOpen && autoScrollEnabled) {
      const scrollTimer = setTimeout(() => {
        if (activeStep < totalSteps) {
          setIsAutoScrolling(true);
          const nextStep = activeStep + 1;
          setActiveStep(nextStep);
          stepRefs[nextStep - 1]?.current?.scrollIntoView({ behavior: 'smooth' });
          
          // Reset auto-scrolling flag after animation completes
          setTimeout(() => {
            setIsAutoScrolling(false);
          }, 1000);
        } else {
          // Loop back to first step after reaching the end
          setTimeout(() => {
            if (autoScrollEnabled) {
              setIsAutoScrolling(true);
              setActiveStep(1);
              stepRefs[0]?.current?.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                setIsAutoScrolling(false);
              }, 1000);
            }
          }, 3000); // Wait a bit longer at the final step
        }
      }, 5000); // 5 seconds per step
      
      return () => clearTimeout(scrollTimer);
    }
  }, [isOpen, activeStep, autoScrollEnabled, totalSteps]);
  
  // Update active step based on which section is in view
  useEffect(() => {
    // Only update based on view if not auto-scrolling
    if (!isAutoScrolling) {
      if (step1InView) setActiveStep(1);
      else if (step2InView) setActiveStep(2);
      else if (step3InView) setActiveStep(3);
      else if (step4InView) setActiveStep(4);
    }
  }, [step1InView, step2InView, step3InView, step4InView, isAutoScrolling]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
      setAutoScrollEnabled(true);
      // Scroll to top when opened
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [isOpen]);

  // If no RAG data is available, show a placeholder with corrected data
  const placeholderData: RagData = {
    question: "What is your experience with GraphRAG?",
    embedding: Array(10).fill(0).map(() => Math.random() * 2 - 1),
    retrievedChunks: [
      { 
        id: "skills-graphrag", 
        text: "GraphRAG is one of my core AI/ML frameworks. I've used it for knowledge graphing and reasoning over text in multiple projects.", 
        source: "Technical Skills" 
      },
      { 
        id: "project-graphrag", 
        text: "I implemented GraphRAG to improve context retrieval by 35% for our enterprise knowledge base system.", 
        source: "Projects" 
      }
    ],
    answer: "GraphRAG is one of my core AI/ML frameworks that I've used for knowledge graphing and reasoning over text. In one notable project, I implemented GraphRAG to improve context retrieval by 35% for an enterprise knowledge base system."
  };

  const data = ragData || placeholderData;
  const isPlaceholder = !ragData;

  // Scroll to a specific step
  const scrollToStep = (stepIndex: number) => {
    setIsAutoScrolling(true); // Prevent InView from changing the step during scroll
    setActiveStep(stepIndex);
    setAutoScrollEnabled(false);
    stepRefs[stepIndex - 1]?.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Reset auto-scrolling flag after animation completes
    setTimeout(() => {
      setIsAutoScrolling(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center pt-16 px-4 pb-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="overflow-hidden rounded-xl shadow-2xl flex flex-col h-full" intensity="medium" borderGlow>
              {/* Header */}
              <header className="bg-gradient-to-r from-blue-700 to-teal-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-yellow-300" size={20} />
                  <h2 className="font-bold text-xl text-white">How Retrieval-Augmented Generation (RAG) Works</h2>
                  {isPlaceholder && (
                    <span className="bg-yellow-500/20 text-white px-2 py-0.5 rounded-full text-xs">
                      Demo Mode
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </header>

              {/* Gap between header and nav */}
              <div className="h-2 bg-gray-800/30"></div>
              
              {/* Step Indicator */}
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 border-b border-white/20 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1 text-sm font-medium">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToStep(i + 1)}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          activeStep === i + 1
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-white/30'
                        }`}
                      >
                        Step {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                      className={`text-xs px-2 py-1 rounded ${autoScrollEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {autoScrollEnabled ? 'Auto-Scrolling (5s)' : 'Manual Navigation'}
                    </button>
                    {/* No text here */}
                  </div>
                </div>
              </div>

              {/* Content Area - Single scrollable container */}
              <div
                ref={containerRef}
                className="flex-1 overflow-y-auto bg-white/5 backdrop-blur-sm scroll-smooth max-h-[80vh]"
                onScroll={() => {
                  // Only disable auto-scrolling if it's a user-initiated scroll
                  if (autoScrollEnabled && !isAutoScrolling) {
                    setAutoScrollEnabled(false);
                  }
                }}
              >
                {/* Step 1: Question Processing */}
                <div
                  ref={stepRefs[0]}
                  className="p-6 py-8 flex flex-col justify-center border-b border-white/10"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepHeader
                      icon={<Search className="text-blue-600" />}
                      title="Step 1: Question Processing"
                      subtitle="Your question is analyzed and converted into a numerical representation"
                      active={activeStep === 1}
                    />
                    <div className="mt-4 space-y-4">
                      <GlassCard className="p-4 rounded-lg" intensity="light">
                        <h4 className="font-medium text-blue-700 mb-2">Your Question:</h4>
                        <p className="text-gray-700">{data.question}</p>
                      </GlassCard>
                      
                      <GlassCard className="p-4 rounded-lg" intensity="light">
                        <h4 className="font-medium text-gray-700 mb-2">Vector Embedding:</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Your question is transformed into a high-dimensional vector using OpenAI's embedding model.
                          This numerical representation captures the semantic meaning of your question.
                        </p>
                        <div className="bg-white/30 p-3 rounded border border-white/30 overflow-x-auto backdrop-blur-sm">
                          <code className="text-xs text-gray-700 font-mono">
                            [{data.embedding.slice(0, 10).map(n => n.toFixed(4)).join(', ')}...]
                          </code>
                        </div>
                      </GlassCard>
                    </div>
                    
                    {/* Step indicator */}
                    <div className="mt-6 flex justify-center">
                      <div className="px-3 py-1 bg-blue-100/50 text-blue-700 rounded-full text-xs font-medium">
                        Step 1 of 4
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Step 2: Knowledge Retrieval */}
                <div
                  ref={stepRefs[1]}
                  className="p-6 py-8 flex flex-col justify-center border-b border-white/10"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepHeader
                      icon={<Database className="text-teal-600" />}
                      title="Step 2: Knowledge Retrieval"
                      subtitle="Finding the most relevant information from Pranit's portfolio"
                      active={activeStep === 2}
                    />
                    <div className="mt-4 space-y-4">
                      <GlassCard className="p-4 rounded-lg" intensity="light">
                        <h4 className="font-medium text-blue-700 mb-2">Vector Similarity Search:</h4>
                        <p className="text-sm text-gray-700 mb-4">
                          The system compares your question's vector with pre-computed vectors from chunks of Pranit's portfolio.
                          The <strong>two most semantically similar chunks</strong> are retrieved to provide context for answering your question.
                        </p>
                        
                        <GlassCard className="overflow-hidden rounded-lg" intensity="light">
                          <div className="p-3 bg-blue-100/30 border-b border-blue-200/30 flex justify-between items-center backdrop-blur-sm">
                            <span className="font-medium text-blue-700">Vector Similarity Visualization</span>
                            <span className="text-xs text-blue-600">
                              {data.totalChunks || "~50"} total chunks in database
                            </span>
                          </div>
                          <div className="p-4 h-96">
                            <EmbeddingVisualization 
                              questionEmbedding={data.embedding}
                              retrievedChunks={data.retrievedChunks}
                              highlightClosest={true}
                            />
                          </div>
                        </GlassCard>
                      </GlassCard>
                    </div>
                    
                    {/* Step indicator */}
                    <div className="mt-6 flex justify-center">
                      <div className="px-3 py-1 bg-blue-100/50 text-blue-700 rounded-full text-xs font-medium">
                        Step 2 of 4
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Step 3: Context Assembly */}
                <div
                  ref={stepRefs[2]}
                  className="p-6 py-8 flex flex-col justify-center border-b border-white/10"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepHeader
                      icon={<Cpu className="text-green-500" />}
                      title="Step 3: Context Assembly"
                      subtitle="Combining the retrieved information into a coherent context"
                      active={activeStep === 3}
                    />
                    <div className="mt-4 space-y-4">
                      <GlassCard className="p-4 rounded-lg" intensity="light">
                        <h4 className="font-medium text-green-700 mb-2">Retrieved Information:</h4>
                        <div className="space-y-3">
                          {data.retrievedChunks.map((chunk, index) => (
                            <GlassCard key={index} className={`p-3 rounded-lg ${index < 2 ? 'ring-2 ring-green-300' : ''}`} intensity="light">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-green-700">Chunk {index + 1}</span>
                                <span className="bg-green-100/50 text-green-700 px-2 py-0.5 rounded text-xs backdrop-blur-sm">
                                  {chunk.source}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{chunk.text}</p>
                            </GlassCard>
                          ))}
                        </div>
                      </GlassCard>
                      
                      <GlassCard className="p-4 rounded-lg" intensity="light">
                        <h4 className="font-medium text-gray-700 mb-2">Assembled Context:</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          The retrieved chunks are combined into a coherent context that will be sent to the language model.
                        </p>
                        <div className="bg-white/30 p-3 rounded border border-white/30 max-h-40 overflow-y-auto backdrop-blur-sm">
                          <p className="text-sm text-gray-700">
                            {data.context || data.retrievedChunks.map(chunk => chunk.text).join("\n\n")}
                          </p>
                        </div>
                      </GlassCard>
                    </div>
                    
                    {/* Step indicator */}
                    <div className="mt-6 flex justify-center">
                      <div className="px-3 py-1 bg-green-100/50 text-green-700 rounded-full text-xs font-medium">
                        Step 3 of 4
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Step 4: Response Generation */}
                <div
                  ref={stepRefs[3]}
                  className="p-6 py-8 flex flex-col justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepHeader
                      icon={<MessageSquare className="text-blue-500" />}
                      title="Step 4: Response Generation"
                      subtitle="Creating a personalized answer based on the retrieved context"
                      active={activeStep === 4}
                    />
                    <div className="mt-4 space-y-4">
                      <GlassCard className="p-4 rounded-lg" intensity="light">
                        <h4 className="font-medium text-blue-700 mb-2">Language Model Processing:</h4>
                        <p className="text-sm text-gray-700 mb-4">
                          The language model (OpenAI's GPT-4) receives your question along with the assembled context.
                          It generates a response that's grounded in Pranit's actual experience and portfolio.
                        </p>
                        
                        <GlassCard className="p-4 rounded-lg" intensity="light">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0">
                              <MessageSquare size={16} className="text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Final Answer:</h5>
                              <div className="text-gray-700 space-y-2">
                                {data.answer.split('\n').map((paragraph, i) => (
                                  <p key={i}>{paragraph}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      </GlassCard>
                      
                      <GlassCard className="p-4 rounded-lg" intensity="light">
                        <h4 className="font-medium text-teal-700 mb-2">Why This Matters:</h4>
                        <p className="text-gray-700">
                          This Retrieval-Augmented Generation (RAG) approach ensures that responses are:
                        </p>
                        <ul className="mt-2 space-y-1 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-teal-500">•</span>
                            <span>Factually accurate and grounded in Pranit's actual experience</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-teal-500">•</span>
                            <span>Transparent about the sources of information used</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-teal-500">•</span>
                            <span>Relevant to your specific question</span>
                          </li>
                        </ul>
                      </GlassCard>
                    </div>
                  </motion.div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper components
interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  active: boolean;
}

const StepHeader: React.FC<StepHeaderProps> = ({ icon, title, subtitle, active }) => (
  <div className="flex items-start gap-4">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
      active 
        ? 'bg-white/50 shadow-lg scale-110' 
        : 'bg-white/30 backdrop-blur-sm'
    }`}>
      {icon}
    </div>
    <div>
      <h3 className={`text-xl font-bold transition-all duration-300 ${
        active ? 'text-gray-900 scale-105' : 'text-gray-800'
      }`}>{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  </div>
);

export default RAGVisualization;