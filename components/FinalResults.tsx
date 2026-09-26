'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  BookOpen,
  TrendingUp,
  FileText
} from 'lucide-react';
import { InterviewSession, QuestionEvaluation } from '@/lib/types';
import { playSuccessFanfare, playClickSound } from '@/lib/sound';
import { saveInterviewSession } from '@/lib/history';

interface FinalResultsProps {
  session: InterviewSession;
  onRetake: () => void;
  onViewHistory: () => void;
  onHome: () => void;
}

export function FinalResults({
  session,
  onRetake,
  onViewHistory,
  onHome,
}: FinalResultsProps) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Trigger celebration and persist to history
  useEffect(() => {
    saveInterviewSession(session);

    if (session.overallScore >= 70) {
      playSuccessFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [session]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const getGradeTier = (score: number) => {
    if (score >= 90) return { label: 'Principal / Staff Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 80) return { label: 'Senior Ready', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    if (score >= 65) return { label: 'Mid-Level Ready', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' };
    return { label: 'Foundational / Practice Needed', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
  };

  const grade = getGradeTier(session.overallScore);

  const toggleQuestion = (id: string) => {
    playClickSound();
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const handleDownloadJSON = () => {
    playClickSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(session, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `interviewx-${session.category}-${session.role}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  const evaluationsList = Object.values(session.evaluations);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span>Interview Performance Summary</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Interview Performance
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {session.role} • {session.category} • {session.difficulty} Level
          </p>
        </div>

        {/* Hero Score & Grade Card */}
        <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Score Ring / Gauge */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="relative w-44 h-44 flex items-center justify-center rounded-full bg-slate-950 border-4 border-indigo-500/20 shadow-inner">
                <div className="text-center">
                  <span className="text-6xl font-black text-white font-mono">
                    {session.overallScore}
                  </span>
                  <span className="text-lg text-slate-500 block font-normal">%</span>
                </div>
              </div>
              <div className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${grade.bg} ${grade.color}`}>
                {grade.label}
              </div>
            </div>

            {/* Visual Performance Chart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Competency Breakdown</span>
                </span>
                <span className="text-slate-500 font-mono">Normalized</span>
              </div>

              {/* Technical Knowledge */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Technical Knowledge</span>
                  <span className="text-cyan-400 font-mono font-bold">{session.metrics.technicalKnowledge}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${session.metrics.technicalKnowledge}%` }}
                  />
                </div>
              </div>

              {/* Problem Solving */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Problem Solving & Trade-offs</span>
                  <span className="text-indigo-400 font-mono font-bold">{session.metrics.problemSolving}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                    style={{ width: `${session.metrics.problemSolving}%` }}
                  />
                </div>
              </div>

              {/* Communication */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Communication & Structure</span>
                  <span className="text-violet-400 font-mono font-bold">{session.metrics.communication}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${session.metrics.communication}%` }}
                  />
                </div>
              </div>

              {/* Overall */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-semibold">Overall Rating</span>
                  <span className="text-emerald-400 font-mono font-bold">{session.metrics.overall}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${session.metrics.overall}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Summary Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Questions Answered</div>
            <div className="text-2xl font-bold text-white font-mono">
              {evaluationsList.length} / {session.questions.length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Average Score</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {session.overallScore}%
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Time Taken</div>
            <div className="text-2xl font-bold text-indigo-400 font-mono">
              {formatTime(session.durationSeconds)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Strongest Category</div>
            <div className="text-lg font-bold text-emerald-400 truncate" title={session.strongestCategory}>
              {session.strongestCategory}
            </div>
          </div>
        </div>

        {/* Areas Needing Improvement Box */}
        <div className="rounded-2xl bg-slate-900/80 border border-amber-500/20 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Targeted Areas for Improvement</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {session.areasForImprovement.map((area, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">→</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section: Detailed Question-by-Question Feedback */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Detailed Question Review</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Click to expand answers & rubrics
            </span>
          </div>

          <div className="space-y-4">
            {session.questions.map((q, idx) => {
              const evalItem: QuestionEvaluation | undefined = session.evaluations[q.id];
              const isExpanded = expandedQuestionId === q.id || (expandedQuestionId === null && idx === 0);

              return (
                <div
                  key={q.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg transition-all"
                >
                  {/* Header / Click to Toggle */}
                  <div
                    onClick={() => toggleQuestion(q.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                        Q{idx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-1">
                          {q.question}
                        </h3>
                        <span className="text-xs text-slate-400">{q.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {evalItem && (
                        <span className="text-sm font-bold font-mono px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-white">
                          {evalItem.score}/100
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && evalItem && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 text-xs sm:text-sm">
                      {/* Full Question Statement */}
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Full Question
                        </div>
                        <p className="text-slate-200">{q.question}</p>
                      </div>

                      {/* Candidate Submitted Answer */}
                      <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Candidate Answer
                        </div>
                        <p className="text-slate-300 font-mono whitespace-pre-wrap text-xs leading-relaxed">
                          {evalItem.userAnswer || '(No answer provided)'}
                        </p>
                      </div>

                      {/* What was done well */}
                      <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-4">
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>What was done well</span>
                        </div>
                        <ul className="space-y-1 text-slate-300">
                          {evalItem.doneWell.map((pt: string, i: number) => (
                            <li key={i}>• {pt}</li>
                          ))}
                        </ul>
                      </div>

                      {/* What was missing */}
                      <div className="rounded-xl bg-amber-950/20 border border-amber-500/20 p-4">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" />
                          <span>What was missing</span>
                        </div>
                        <ul className="space-y-1 text-slate-300">
                          {evalItem.missing.map((pt: string, i: number) => (
                            <li key={i}>• {pt}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Suggested Benchmark Answer */}
                      <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                        <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>Benchmark Model Answer</span>
                        </div>
                        <p className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                          {evalItem.improvedAnswer}
                        </p>
                      </div>

                      {/* Improvement Tip */}
                      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                        <strong>Improvement Tip:</strong> {evalItem.improvementTip}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onRetake}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Interview</span>
            </button>
            <button
              onClick={onViewHistory}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-sm"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>View History</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Download report data as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Print / Save PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onHome}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
