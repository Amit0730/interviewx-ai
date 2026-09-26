'use client';

import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Volume2, VolumeX, Moon, Sun, Terminal, Play } from 'lucide-react';
import { isAudioMuted, toggleAudioMute, playClickSound } from '@/lib/sound';
import { AIStatusResponse } from '@/lib/types';

interface NavbarProps {
  onOpenSetup: () => void;
  onOpenHistory: () => void;
  aiStatus: AIStatusResponse | null;
}

export function Navbar({ onOpenSetup, onOpenHistory, aiStatus }: NavbarProps) {
  const [muted, setMuted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMuted(isAudioMuted());
      const savedTheme = localStorage.getItem('interviewx_theme');
      if (savedTheme === 'light') {
        setIsLight(true);
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleSound = () => {
    const next = toggleAudioMute();
    setMuted(next);
    if (!next) playClickSound();
  };

  const handleToggleTheme = () => {
    playClickSound();
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('interviewx_theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('interviewx_theme', 'dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                Interview<span className="text-cyan-400">X</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Technical Interview Simulator</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#categories" className="hover:text-cyan-400 transition-colors">Categories</a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#comparison" className="hover:text-cyan-400 transition-colors">Why InterviewX</a>
        </nav>

        {/* Right Action Icons & CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* AI Mode Indicator Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              aiStatus?.configured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
            title={aiStatus?.label || 'AI Mode'}
          >
            <span className={`w-2 h-2 rounded-full ${aiStatus?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{aiStatus?.configured ? 'Cloud AI Active' : 'Demo / Local Mode'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title="Toggle Light/Dark Theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* History Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenHistory();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all"
          >
            <HistoryIcon className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Start CTA */}
          <button
            onClick={() => {
              playClickSound();
              onOpenSetup();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-600/25 border border-indigo-400/30 transition-all transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Interview</span>
          </button>
        </div>
      </div>
    </header>
  );
}
