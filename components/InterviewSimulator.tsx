'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  ArrowRight,
  Sparkles,
  Code,
  List,
  Award,
  ChevronDown,
  ChevronUp,
  XCircle,
  Check
} from 'lucide-react';
import {
  Question,
  QuestionEvaluation,
  InterviewSession,
} from '@/lib/types';
import { playClickSound, playSubmitSound } from '@/lib/sound';

interface InterviewSimulatorProps {
  session: InterviewSession;
  customApiKey?: string;
  onComplete: (updatedSession: InterviewSession) => void;
  onExit: () => void;
}

export function InterviewSimulator({
  session: initialSession,
  customApiKey,
  onComplete,
  onExit,
}: InterviewSimulatorProps) {
  const [session, setSession] = useState<InterviewSession>(initialSession);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<QuestionEvaluation | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showBenchmarkExpanded, setShowBenchmarkExpanded] = useState<boolean>(false);
  const [confirmExit, setConfirmExit] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active question
  const currentQuestion: Question | undefined = session.questions[currentIndex];
  const totalQuestions = session.questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Timer loop
  useEffect(() => {
    if (isPaused || currentEvaluation) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, currentEvaluation]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Keyboard shortcut Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!evaluating && !currentEvaluation && userAnswer.trim().length > 0) {
        handleSubmitAnswer();
      }
    }
  };

  // Helper text insertions
  const insertText = (template: string) => {
    playClickSound();
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + template + text.substring(end);
    setUserAnswer(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length, start + template.length);
    }, 10);
  };

  // Submit Answer & Evaluate
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || evaluating) return;
    setEvaluating(true);
    playSubmitSound();

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer: userAnswer.trim(),
          customApiKey,
        }),
      });

      const data = await response.json();
      if (data.success && data.evaluation) {
        const evaluation: QuestionEvaluation = data.evaluation;
        setCurrentEvaluation(evaluation);

        // Update session in state
        setSession((prev) => {
          const updatedAnswers = { ...prev.answers, [currentQuestion.id]: userAnswer.trim() };
          const updatedEvaluations = { ...prev.evaluations, [currentQuestion.id]: evaluation };
          return {
            ...prev,
            answers: updatedAnswers,
            evaluations: updatedEvaluations,
            durationSeconds: elapsedSeconds,
          };
        });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setEvaluating(false);
    }
  };

  // Advance to Next Question or Complete Session
  const handleNextQuestion = () => {
    playClickSound();

    if (isLastQuestion) {
      // Calculate overall final results
      const allEvaluations = Object.values(session.evaluations);
      if (currentEvaluation && !session.evaluations[currentQuestion.id]) {
        allEvaluations.push(currentEvaluation);
      }

      const totalScore = allEvaluations.reduce((acc, ev) => acc + ev.score, 0);
      const overallAvg = allEvaluations.length > 0 ? Math.round(totalScore / allEvaluations.length) : 0;

      const techTotal = allEvaluations.reduce((acc, ev) => acc + ev.technicalAccuracy, 0);
      const probTotal = allEvaluations.reduce((acc, ev) => acc + ev.problemSolving, 0);
      const commTotal = allEvaluations.reduce((acc, ev) => acc + ev.communication, 0);

      const finalSession: InterviewSession = {
        ...session,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
        overallScore: overallAvg,
        metrics: {
          technicalKnowledge: Math.round(techTotal / Math.max(1, allEvaluations.length)),
          problemSolving: Math.round(probTotal / Math.max(1, allEvaluations.length)),
          communication: Math.round(commTotal / Math.max(1, allEvaluations.length)),
          overall: overallAvg,
        },
        strongestCategory: session.category,
        areasForImprovement: [
          'Address concrete architectural trade-offs earlier.',
          'Quantify time/space complexity or system thresholds explicitly.',
          'State edge cases and failure mode handling upfront.',
        ],
      };

      onComplete(finalSession);
    } else {
      // Advance to next index
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setCurrentEvaluation(null);
      setShowHints(false);
      setShowBenchmarkExpanded(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Questions Loaded</h2>
          <p className="text-sm text-slate-400 mb-6">Unable to retrieve questions for this configuration.</p>
          <button
            onClick={onExit}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Top HUD Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <span>{session.role}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">{session.category}</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hidden sm:inline">
            {session.difficulty}
          </span>
        </div>

        {/* Stepper pills */}
        <div className="hidden md:flex items-center gap-1.5">
          {session.questions.map((q, idx) => {
            const isCompleted = idx < currentIndex || (idx === currentIndex && currentEvaluation !== null);
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={q.id}
                className={`h-2 rounded-full transition-all ${
                  isCurrent
                    ? 'w-8 bg-cyan-400'
                    : isCompleted
                    ? 'w-4 bg-indigo-500'
                    : 'w-4 bg-slate-800'
                }`}
                title={`Question ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Right HUD: Timer + Pause + Exit */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setIsPaused(!isPaused);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            title={isPaused ? 'Resume Timer' : 'Pause Timer'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              playClickSound();
              setConfirmExit(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-slate-800 transition-colors"
            title="Exit Interview"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Interview Chamber */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start space-y-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-900 pb-3">
          <span className="font-semibold text-slate-300">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(((currentIndex) / totalQuestions) * 100)}% Complete</span>
        </div>

        {/* Question Statement Box */}
        <div className="rounded-2xl bg-slate-900/80 border border-indigo-500/25 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
              Technical Prompt
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {currentQuestion.difficulty} Level
            </span>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Context Snippet if available */}
          {currentQuestion.context && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{currentQuestion.context}</pre>
            </div>
          )}

          {/* Hints Toggle */}
          {currentQuestion.hints && currentQuestion.hints.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowHints(!showHints);
                }}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHints ? 'Hide Interviewer Hint' : 'Need a hint?'}</span>
              </button>
              {showHints && (
                <div className="mt-2 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 animate-in fade-in duration-200">
                  <ul className="list-disc list-inside space-y-1">
                    {currentQuestion.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Answer Editor (Active state before submission) */}
        {!currentEvaluation && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-xl flex flex-col space-y-3">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Your Response:</span>
                <span className="hidden sm:inline">(Structure your thoughts clearly)</span>
              </div>

              {/* Formatting Helper Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => insertText('\n```\n// Code snippet here\n```\n')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors border border-slate-700"
                  title="Insert code block"
                >
                  <Code className="w-3 h-3" />
                  <span className="hidden sm:inline">Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertText('\n- Point: ')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors border border-slate-700"
                  title="Insert bullet point"
                >
                  <List className="w-3 h-3" />
                  <span className="hidden sm:inline">Bullet</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertText('O(1) time and O(N) space')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700 font-mono"
                  title="Insert Big-O complexity"
                >
                  O(N)
                </button>
              </div>
            </div>

            {/* Answer Textarea */}
            <textarea
              ref={textareaRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={evaluating}
              rows={8}
              placeholder="Explain the technical mechanisms, tradeoffs, and architectural considerations... Use paragraphs or bullet points for maximum clarity."
              className="w-full bg-slate-950 rounded-xl border border-slate-800 p-4 text-sm sm:text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-y leading-relaxed"
            />

            {/* Editor Footer: Word Count & Submit CTA */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{userAnswer.length} chars</span>
                <span className="hidden md:inline">• Ctrl + Enter to submit</span>
              </div>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={evaluating || userAnswer.trim().length === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
              >
                {evaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Post-Submission Instant Evaluation Card */}
        {currentEvaluation && (
          <div className="rounded-2xl bg-slate-900 border border-emerald-500/30 p-6 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Score & Tier Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Evaluation Completed</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Answer Assessment</h3>
              </div>

              {/* Overall Question Score */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-black text-white font-mono">
                    {currentEvaluation.score}
                    <span className="text-base text-slate-400 font-normal">/100</span>
                  </div>
                  <div className="text-[11px] font-semibold uppercase text-emerald-400">
                    {currentEvaluation.score >= 80 ? 'Strong Answer' : currentEvaluation.score >= 50 ? 'Solid Foundation' : 'Needs Polish'}
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Breakdown Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 mb-1">Technical Accuracy</div>
                <div className="text-lg font-bold text-cyan-400 font-mono">
                  {currentEvaluation.technicalAccuracy}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 mb-1">Problem Solving & Trade-offs</div>
                <div className="text-lg font-bold text-indigo-400 font-mono">
                  {currentEvaluation.problemSolving}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 mb-1">Communication & Clarity</div>
                <div className="text-lg font-bold text-violet-400 font-mono">
                  {currentEvaluation.communication}%
                </div>
              </div>
            </div>

            {/* What Was Done Well */}
            <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>What was done well</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                {currentEvaluation.doneWell.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Was Missing */}
            <div className="rounded-xl bg-amber-950/20 border border-amber-500/20 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>What was missing or could be improved</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                {currentEvaluation.missing.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benchmark Model Answer (Collapsible) */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowBenchmarkExpanded(!showBenchmarkExpanded);
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-indigo-300 hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Benchmark Model Answer</span>
                </div>
                {showBenchmarkExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showBenchmarkExpanded && (
                <div className="p-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono bg-slate-950/90 whitespace-pre-line">
                  {currentEvaluation.improvedAnswer}
                </div>
              )}
            </div>

            {/* Pro Tip Callout */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Interviewer Takeaway:</strong> {currentEvaluation.improvementTip}
              </div>
            </div>

            {/* Next Question / Finish CTA */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-xl shadow-indigo-600/30 border border-indigo-400/40 transition-all transform active:scale-95 text-sm sm:text-base"
              >
                <span>{isLastQuestion ? 'View Final Results 🏆' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Pause Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl">
            <Pause className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Interview Paused</h3>
            <p className="text-xs text-slate-400 mb-6">Take a breath. Your timer is on hold.</p>
            <button
              onClick={() => {
                playClickSound();
                setIsPaused(false);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Resume Interview
            </button>
          </div>
        </div>
      )}

      {/* Confirm Exit Modal */}
      {confirmExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Quit Current Interview?</h3>
            <p className="text-xs text-slate-400 mb-6">Progress for uncompleted questions will not be saved.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmExit(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onExit();
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Quit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
