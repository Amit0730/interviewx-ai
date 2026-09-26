'use client';

import React from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
  Terminal,
  Lock,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Multidimensional AI Rubrics',
      description: 'Unlike generic LLM summaries, InterviewX scores answers across three distinct criteria: Technical Accuracy, Problem Solving & Trade-offs, and Communication Clarity.',
      badge: 'Analytical Scoring',
    },
    {
      icon: Zap,
      title: 'Zero-Config Local & Cloud AI',
      description: 'Equipped with a built-in semantic NLP evaluation engine that works out of the box with zero API keys, plus optional native Google Gemini & OpenAI server integration.',
      badge: 'Hybrid Engine',
    },
    {
      icon: TrendingUp,
      title: 'Adaptive Difficulty Tuning',
      description: 'The simulator dynamically calibrates follow-up challenge complexity based on candidate accuracy, ensuring Junior to Senior engineers stay engaged.',
      badge: 'Adaptive',
    },
    {
      icon: Clock,
      title: 'Pacing & Pressure Timer',
      description: 'Train your pacing with an elapsed interview timer. Unlike harsh auto-fail systems, InterviewX lets you finish complete thoughts while tracking speed.',
      badge: 'Realistic HUD',
    },
    {
      icon: Terminal,
      title: 'Developer Monospace Workspace',
      description: 'A dedicated markdown and code-friendly answer canvas with quick code snippet inserts, complexity notations (O(1), O(N)), and keyboard submission shortcuts.',
      badge: 'Dev UX',
    },
    {
      icon: Lock,
      title: 'Private Local Storage Analytics',
      description: 'Session history, question performance, and historical progression are persisted 100% privately in your browser storage with zero tracking or account mandates.',
      badge: 'Privacy First',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-950/70 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
            Engineered for Serious Preparation
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Every feature is calibrated to mimic real high-bar technical interviews at top engineering organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between hover:border-violet-500/40 hover:bg-slate-900/80 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Production verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
