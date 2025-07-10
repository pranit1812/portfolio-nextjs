'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Brain, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/glass-card';
import RAGVisualization from './rag-visualization';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RagData {
  question: string;
  embedding: number[];
  retrievedChunks: { id: string; text: string; source: string }[];
  answer: string;
  context?: string;
  totalChunks?: number;
}

function formatAssistantMessage(content: string) {
  return content.split('\n').map((line, i) => (
    <p key={i} className="mb-2">{line.trim()}</p>
  ));
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRagDemo, setShowRagDemo] = useState(false);
  const [lastRagData, setLastRagData] = useState<RagData | null>(null);
  const [remainingQuestions, setRemainingQuestions] = useState(5);
  const [globalRemaining, setGlobalRemaining] = useState(25);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);
  
  // Ask a question (custom or sample)
  const askQuestion = async (question: string) => {
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/pranit-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: error.error || 'You have reached your daily question limit. Please try again tomorrow.'
          }]);
          setRemainingQuestions(0);
          throw new Error(error.error || 'Rate limit exceeded');
        }
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      
      if (data.remaining !== undefined) {
        setRemainingQuestions(data.remaining);
      }
      
      if (data.globalRemaining !== undefined) {
        setGlobalRemaining(data.globalRemaining);
      }
      
      setLastRagData({
        question: data.question,
        embedding: data.embedding,
        retrievedChunks: data.retrievedChunks,
        answer: data.answer,
        context: data.context,
        totalChunks: data.totalChunks
      });
    } catch (error: any) {
      console.error('Error in askQuestion:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please try again later.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await askQuestion(input.trim());
  };

  // Handle sample question click
  const handleSampleQuestion = (question: string) => {
    if (!isLoading) {
      askQuestion(question);
    }
  };

  const toggleChat = () => setIsOpen(prev => !prev);
  const toggleRagDemo = () => setShowRagDemo(prev => !prev);

  // Sample questions
  const sampleQuestions = [
    "What is your experience with GraphRAG?",
    "How did you reduce AI processing costs by 8x?",
    "Tell me about your startup leadership experience",
    "What AI frameworks have you worked with?"
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-3 sm:p-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-colors ring-4 ring-blue-300 ring-opacity-50"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
            '0 20px 25px -5px rgba(37, 99, 235, 0.6)',
            '0 10px 25px -5px rgba(37, 99, 235, 0.5)'
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut" 
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-[95%] max-w-md sm:w-full"
          >
            <GlassCard className="overflow-hidden rounded-xl shadow-2xl flex flex-col" intensity="medium" borderGlow>
              {/* Fixed Header */}
              <div className="bg-gradient-to-r from-blue-600/90 to-teal-500/90 backdrop-blur-md p-4 text-white flex items-center justify-between border-b border-white/20">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Brain className="text-white" size={20} />
                    <h3 className="font-bold text-white">Pranit.AI</h3>
                    <div className="flex gap-1">
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white">
                        You: {remainingQuestions}
                      </span>
                      <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs text-white">
                        App: {globalRemaining}
                    </span>
                    </div>
                  </div>
                  <button
                    onClick={toggleRagDemo}
                    className="bg-white/20 hover:bg-white/30 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <Info size={14} className="hidden sm:inline text-white" />
                    <span className="whitespace-nowrap text-white">See How It Works</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Message Area */}
              <div 
                ref={messageContainerRef}
                className="overflow-y-auto p-4 space-y-4 bg-white/10 backdrop-blur-sm max-h-[50vh] sm:max-h-[400px] min-h-[100px]"
              >
                {/* Welcome Message - Compact horizontal layout */}
                {messages.length === 0 && (
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-blue-100/50 backdrop-blur-sm mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-blue-800 font-medium text-sm">Hi, I'm Pranit.AI!</h3>
                      <p className="text-gray-600 text-xs">
                        Ask me anything about Pranit's experience, projects, or skills.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sample Questions - Only shown when no messages */}
                {messages.length === 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {sampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSampleQuestion(question)}
                        className="text-sm text-left px-4 py-3 rounded-lg bg-white/70 hover:bg-blue-50 text-gray-700 transition-colors border border-blue-100/50 shadow-sm backdrop-blur-sm"
                        disabled={isLoading}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {/* Messages */}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/80 shadow-sm border border-blue-100/50 text-gray-700 backdrop-blur-sm'
                      }`}
                    >
                      {message.role === 'assistant'
                        ? formatAssistantMessage(message.content)
                        : message.content}
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white/80 shadow-sm border border-blue-100/50 backdrop-blur-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Completely redesigned */}
              <div className="bg-white/30 backdrop-blur-md border-t border-white/20 mt-auto">
                <form onSubmit={handleSubmit} className="flex">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-4 bg-teal-500/80 backdrop-blur-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600/90 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RAG Demo Modal */}
      <RAGVisualization
        isOpen={showRagDemo}
        onClose={toggleRagDemo}
        ragData={lastRagData}
      />
    </>
  );
}