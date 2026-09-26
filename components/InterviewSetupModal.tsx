'use client';

import React, { useState } from 'react';
import {
  X,
  Play,
  Clock,
  Key,
  CheckCircle,
  Code2
} from 'lucide-react';
import {
  InterviewCategory,
  InterviewDifficulty,
  InterviewRole,
  AIStatusResponse
} from '@/lib/types';
import { playClickSound } from '@/lib/sound';

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (config: {
    role: InterviewRole;
    difficulty: InterviewDifficulty;
    category: InterviewCategory;
    questionCount: number;
    customApiKey?: string;
  }) => void;
  initialCategory?: InterviewCategory;
  aiStatus: AIStatusResponse | null;
}

export function InterviewSetupModal({
  isOpen,
  onClose,
  onStart,
  initialCategory = 'DSA',
  aiStatus,
}: InterviewSetupModalProps) {
  const [role, setRole] = useState<InterviewRole>('Software Engineer');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Medium');
  const [category, setCategory] = useState<InterviewCategory>(initialCategory);
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  if (!isOpen) return null;

  const roles: InterviewRole[] = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'AI/ML Engineer',
    'Data Scientist',
    'Software Engineer',
  ];

  const difficulties: { level: InterviewDifficulty; desc: string; color: string }[] = [
    { level: 'Easy', desc: 'Junior / Foundational core mechanics', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { level: 'Medium', desc: 'Mid-level / Standard real-world depth', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
    { level: 'Hard', desc: 'Senior / Staff architectural trade-offs', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
  ];

  const categories: InterviewCategory[] = [
    'DSA',
    'JavaScript',
    'React',
    'Python',
    'Java',
    'SQL',
    'Operating Systems',
    'DBMS',
    'Computer Networks',
    'System Design',
    'AI/ML',
  ];

  const estimatedMinutes = questionCount * (difficulty === 'Hard' ? 5 : difficulty === 'Medium' ? 4 : 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    onStart({
      role,
      difficulty,
      category,
      questionCount,
      customApiKey: customApiKey.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Configure Interview Session</h2>
              <p className="text-xs text-slate-400">Customize target role, difficulty, and technical domain</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* 1. Target Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              1. Target Engineering Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {roles.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setRole(r);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-left font-medium text-xs sm:text-sm border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              2. Target Difficulty
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {difficulties.map((d) => {
                const isSelected = difficulty === d.level;
                return (
                  <button
                    key={d.level}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setDifficulty(d.level);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? `${d.color} shadow-sm border-current`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-0.5">{d.level}</div>
                    <div className="text-[11px] text-slate-400">{d.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              3. Interview Subject / Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const isSelected = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setCategory(c);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Question Count & Duration Estimator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                4. Number of Questions
              </label>
              <div className="flex items-center gap-2">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setQuestionCount(num);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      questionCount === num
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Estimated Duration
              </label>
              <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Approx. {estimatedMinutes} minutes total</span>
              </div>
            </div>
          </div>

          {/* AI Mode Info & Optional Custom Key */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${aiStatus?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-slate-300 font-medium">
                  {aiStatus?.configured ? `Connected: ${aiStatus.modelName}` : 'Built-in Semantic Local Engine'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-indigo-400 hover:text-indigo-300 text-[11px] underline"
              >
                {showKeyInput ? 'Hide Key Setting' : 'Provide Custom Gemini Key (Optional)'}
              </button>
            </div>

            {showKeyInput && (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="Enter Google Gemini API Key (Optional)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Kept only in ephemeral session memory. Never logged or saved.
                </p>
              </div>
            )}
          </div>

          {/* Pre-flight Checklist */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Session Ready</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              You will be presented 1 question at a time with an elapsed timer. You will receive immediate feedback after every answer before proceeding.
            </p>
          </div>

          {/* Start CTA */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-xl shadow-indigo-600/30 border border-indigo-400/40 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Interview ({questionCount} Questions)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
