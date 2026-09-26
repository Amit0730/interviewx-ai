'use client';

import React from 'react';
import { Sliders, HelpCircle, Bot, BarChart3, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Configure Your Track',
      description: 'Choose your desired target role (Frontend, Backend, AI/ML, etc.), select difficulty level, and pick from 11 specialized technical categories.',
      icon: Sliders,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      number: '02',
      title: 'Step-by-Step Simulation',
      description: 'Face authentic interview challenges presented one question at a time, complete with realistic context, code blocks, and an active timer.',
      icon: HelpCircle,
      color: 'from-indigo-500 to-violet-600',
    },
    {
      number: '03',
      title: 'Instant Multi-Metric Rubric',
      description: 'Receive immediate detailed evaluation analyzing Technical Accuracy, Problem Solving, and Communication, plus benchmark answers and missing points.',
      icon: Bot,
      color: 'from-violet-500 to-fuchsia-600',
    },
    {
      number: '04',
      title: 'Analytics & Continuous Mastery',
      description: 'Review overall performance radar charts, track session history in local storage, and identify strengths and weak topics to focus your preparation.',
      icon: BarChart3,
      color: 'from-fuchsia-500 to-cyan-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-950/60 border-t border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Workflow Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
            How InterviewX Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            A structured, repeatable methodology designed to transform interview anxiety into technical confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-700/80 group-hover:text-indigo-400/40 transition-colors font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time feedback loop</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
