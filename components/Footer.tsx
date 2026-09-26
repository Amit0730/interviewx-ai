'use client';

import React from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Interview<span className="text-cyan-400">X</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mb-4 leading-relaxed">
              Interactive AI-powered technical interview simulator for developers and engineering students. Master the concepts that matter.
            </p>
            {/* Disclaimer box */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 max-w-md">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Educational Notice:</strong> InterviewX is an autonomous practice simulation. AI scores and evaluations are provided for preparation and feedback; they do not represent or guarantee hiring decisions by any specific employer.
              </span>
            </div>
          </div>

          {/* Supported Roles */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Supported Tracks</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Frontend Developer</li>
              <li>Backend Developer</li>
              <li>Full Stack Developer</li>
              <li>AI/ML Engineer</li>
              <li>Data Scientist</li>
              <li>Software Engineer</li>
            </ul>
          </div>

          {/* Quick Links & GitHub */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Open Source & Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Amit0730/interviewx-ai"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current text-slate-400" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">Interview Categories</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Features & Tech Stack</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} InterviewX. Engineered with Next.js, TypeScript, Tailwind CSS & AI.
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built with precision for software engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
