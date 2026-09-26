'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Code2, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { playClickSound } from '@/lib/sound';

interface LandingHeroProps {
  onStartInterview: () => void;
  onSelectCategory: (cat: string) => void;
}

export function LandingHero({ onStartInterview, onSelectCategory }: LandingHeroProps) {
  const [quickAnswer, setQuickAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [quickResult, setQuickResult] = useState<{
    score: number;
    good: string;
    tip: string;
  } | null>(null);

  const sampleQuestion = {
    title: 'Quick Practice: DSA & System Concepts',
    question: 'Why does a Hash Map lookup have an amortized O(1) time complexity, and in what scenario can it degrade to O(N)?',
  };

  const handleQuickEvaluate = async () => {
    if (!quickAnswer.trim()) return;
    setEvaluating(true);
    playClickSound();

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: {
            id: 'demo-hero',
            question: sampleQuestion.question,
            category: 'DSA',
            role: 'Software Engineer',
            difficulty: 'Medium',
            expectedKeywords: ['hash function', 'collision', 'bucket', 'separate chaining', 'open addressing', 'load factor', 'worst case'],
            rubricCriteria: ['Mentions hash function indexing', 'Explains collision handling', 'Explains load factor'],
            sampleIdealAnswer: 'A Hash Map computes bucket indices directly using a hash function, yielding O(1) random bucket access. When multiple keys hash to the same bucket index (collisions), lookup traverses the bucket chain (e.g. linked list). If many keys collide (or hash function is poor), lookup degrades to O(N). Resizing at a load factor threshold keeps chains short.',
          },
          userAnswer: quickAnswer,
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setQuickResult({
          score: data.evaluation.score,
          good: data.evaluation.doneWell[0] || 'Good technical articulation.',
          tip: data.evaluation.improvementTip || 'Consider addressing collision resolution.',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Neon Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-Powered Technical Interview Simulator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Zero Setup Required</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Practice technical interviews.
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Get instant feedback.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 mb-9 leading-relaxed max-w-2xl mx-auto">
            Master software engineering, system design, and algorithms with 
            scenario-driven questions, real-time rubric evaluation, and actionable benchmark solutions.
          </p>

          {/* Main Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => {
                playClickSound();
                onStartInterview();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Full Interview</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>

            <a
              href="#categories"
              onClick={() => {
                playClickSound();
                onSelectCategory('DSA');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all backdrop-blur-md"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Explore 11 Categories</span>
            </a>
          </div>

          {/* Key Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">6 Roles</div>
              <p className="text-xs text-slate-400">Frontend to AI/ML & System Design</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">11 Domains</div>
              <p className="text-xs text-slate-400">DSA, OS, Networks, DBMS & more</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-1">Adaptive</div>
              <p className="text-xs text-slate-400">Dynamic difficulty auto-tuning</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">100% Free</div>
              <p className="text-xs text-slate-400">Local demo & cloud AI supported</p>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Sandbox */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl p-5 sm:p-7 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Interactive Live Teaser
                </span>
              </div>
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                1-Minute Test
              </span>
            </div>

            <p className="text-sm sm:text-base font-medium text-slate-100 mb-3">
              {sampleQuestion.question}
            </p>

            <textarea
              value={quickAnswer}
              onChange={(e) => setQuickAnswer(e.target.value)}
              placeholder="Type your explanation here (e.g., hash function computes bucket index directly, collisions happen when two keys share the same hash, separate chaining...)"
              rows={3}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono"
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {quickAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={handleQuickEvaluate}
                disabled={evaluating || !quickAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
              >
                {evaluating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Get Instant AI Feedback</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Result Drawer */}
            {quickResult && (
              <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                      Instant Rubric Score
                    </span>
                  </div>
                  <span className="text-lg font-bold text-white bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    {quickResult.score} / 100
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-1.5">
                  <strong className="text-emerald-400">Well done:</strong> {quickResult.good}
                </p>
                <p className="text-xs text-slate-400">
                  <strong className="text-indigo-400">Pro tip:</strong> {quickResult.tip}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
