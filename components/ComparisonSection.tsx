'use client';

import React from 'react';
import { Check, X, Sparkles, Play, ArrowRight } from 'lucide-react';
import { playClickSound } from '@/lib/sound';

interface ComparisonSectionProps {
  onStartInterview: () => void;
}

export function ComparisonSection({ onStartInterview }: ComparisonSectionProps) {
  const comparisonRows = [
    {
      feature: 'Instant Mechanistic Feedback',
      interviewX: true,
      leetcode: false,
      humanMocks: true,
      note: 'Analyzes what was correct and exactly what concepts were omitted',
    },
    {
      feature: 'Full Architecture & Systems Coverage',
      interviewX: true,
      leetcode: false,
      humanMocks: true,
      note: 'Covers OS, DBMS, Networks, and System Design beyond just code syntax',
    },
    {
      feature: 'Zero Cost & Infinite Repetition',
      interviewX: true,
      leetcode: true,
      humanMocks: false,
      note: 'Human mock services cost $150–$300/hr; InterviewX is unlimited and free',
    },
    {
      feature: 'Private & Zero Sign-Up Required',
      interviewX: true,
      leetcode: false,
      humanMocks: false,
      note: 'Runs immediately with local session history in your browser',
    },
    {
      feature: 'Adaptive Difficulty Auto-Tuning',
      interviewX: true,
      leetcode: false,
      humanMocks: true,
      note: 'Scales complexity up or down based on candidate technical depth',
    },
    {
      feature: 'Benchmark Ideal Answers Provided',
      interviewX: true,
      leetcode: true,
      humanMocks: true,
      note: 'Clear, production-quality model responses for every question',
    },
  ];

  return (
    <section id="comparison" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Competitive Edge
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
            Why Use InterviewX?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Traditional coding sites test if tests pass. Real interviewers test your ability to reason about systems. InterviewX bridges the gap.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-md mb-14">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="py-4 px-6 text-sm font-semibold text-slate-300">Feature Comparison</th>
                <th className="py-4 px-6 text-sm font-bold text-cyan-400 bg-indigo-950/40 border-l border-r border-indigo-500/20">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>InterviewX</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Static LeetCode</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-400">Human Mock Platforms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{row.feature}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{row.note}</div>
                  </td>
                  <td className="py-4 px-6 bg-indigo-950/20 border-l border-r border-indigo-500/10">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <Check className="w-5 h-5 text-emerald-400" />
                      <span>Yes</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {row.leetcode ? (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Check className="w-4 h-4 text-slate-400" />
                        <span>Partial</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <X className="w-4 h-4 text-slate-600" />
                        <span>No</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {row.humanMocks ? (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Check className="w-4 h-4 text-slate-400" />
                        <span>Yes ($$$)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <X className="w-4 h-4 text-slate-600" />
                        <span>No</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Start Interview CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to test your real technical readiness?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Choose your engineering role and target subject. Run a complete mock interview session in minutes.
          </p>
          <button
            onClick={() => {
              playClickSound();
              onStartInterview();
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Interview Simulator Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
