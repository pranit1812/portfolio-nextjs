'use client';

import React, { useState } from 'react';
import portfolioData from '../../pranit-portfolio-json.json';
import Link from 'next/link';
import Image from 'next/image';
import GlassCard from '@/components/ui/glass-card';

export default function ContactPage() {
  const { personalInfo } = portfolioData;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');
    try {
      const res = await fetch('/api/contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <GlassCard className="w-full max-w-4xl mx-auto p-8 md:p-12" intensity="medium" borderGlow>
        {/* Header with Profile Image */}
        <div className="text-center mb-12">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl backdrop-blur-sm">
                <Image
                  src="/profile.jpg"
                  alt="Pranit Sehgal"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-green-400 rounded-full blur opacity-30 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-teal-700 to-gray-900 bg-clip-text text-transparent">
            Let's Connect
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Ready to build something amazing with AI? I'd love to hear about your project and explore how we can work together.
          </p>
        </div>
        {/* Contact Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <GlassCard className="p-8" intensity="light" interactive>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-teal-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 text-xl">📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <a href={`mailto:${personalInfo.contact.email}`} className="text-gray-900 hover:text-teal-600 transition-colors">
                      {personalInfo.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">💼</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">LinkedIn</p>
                    <a href={personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-blue-600 transition-colors">
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-xl">💻</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">GitHub</p>
                    <a href={personalInfo.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-600 transition-colors">
                      View My Code
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📱</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <a href={`tel:${personalInfo.contact.phone}`} className="text-gray-900 hover:text-green-600 transition-colors">
                      {personalInfo.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8" intensity="light" interactive>
              <h3 className="text-xl font-bold text-gray-900 mb-4">What I Can Help With</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-3">
                  <span className="text-teal-600">•</span>
                  <span>AI/ML Strategy & Implementation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-teal-600">•</span>
                  <span>GraphRAG & Knowledge Systems</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-teal-600">•</span>
                  <span>Startup Technology Leadership</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-teal-600">•</span>
                  <span>Team Building & Engineering Culture</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-teal-600">•</span>
                  <span>Product Development & Scaling</span>
                </li>
              </ul>
            </GlassCard>
          </div>
          {/* Quick Message Form */}
          <GlassCard className="p-8" intensity="light" interactive>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell me about your project or how I can help..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-teal-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-teal-700 transition-all font-medium shadow-lg"
              >
                Send Message
              </button>
              {status === 'success' && (
                <div className="text-green-700 text-sm mt-2">Message sent! Thank you.</div>
              )}
              {status === 'error' && (
                <div className="text-red-700 text-sm mt-2">Something went wrong. Please try again.</div>
              )}
            </form>
          </GlassCard>
        </div>
        {/* Call to Action */}
        <div className="text-center mt-16">
          <GlassCard className="p-8" intensity="light" interactive borderGlow>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
            <p className="text-gray-700 mb-6">
              Whether you're looking to implement AI solutions, need technical leadership, or want to discuss innovative projects, I'm here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={`mailto:${personalInfo.contact.email}?subject=Let's discuss your AI project`}
                className="px-8 py-3 bg-teal-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-teal-700 transition-all font-medium shadow-lg"
              >
                Email Me Directly
              </a>
              <a 
                href={personalInfo.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg"
              >
                Connect on LinkedIn
              </a>
            </div>
          </GlassCard>
        </div>
      </GlassCard>
    </div>
  );
}