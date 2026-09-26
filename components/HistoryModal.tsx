'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  History as HistoryIcon,
  Trash2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { InterviewSession } from '@/lib/types';
import {
  getInterviewHistory,
  deleteInterviewSession,
  clearInterviewHistory,
  computeHistoryAnalytics
} from '@/lib/history';
import { playClickSound } from '@/lib/sound';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: InterviewSession) => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  onSelectSession,
}: HistoryModalProps) {
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setHistory(getInterviewHistory());
        setConfirmClear(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    deleteInterviewSession(id);
    setHistory((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAll = () => {
    playClickSound();
    clearInterviewHistory();
    setHistory([]);
    setConfirmClear(false);
  };

  const analytics = computeHistoryAnalytics(history);

  const filteredHistory = filterRole === 'all'
    ? history
    : history.filter((s) => s.role === filterRole);

  const roles = Array.from(new Set(history.map((s) => s.role)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Interview Session History</h2>
              <p className="text-xs text-slate-400">Track scores, review past answers, and evaluate performance trends</p>
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

        {/* Analytics Top Bar */}
        {history.length > 0 && (
          <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Sessions</div>
              <div className="text-lg font-bold text-white font-mono">{analytics.totalInterviews}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Average Score</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">{analytics.averageScore}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Best Score</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{analytics.bestScore}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Practice Time</div>
              <div className="text-lg font-bold text-indigo-400 font-mono">{analytics.totalTimeMinutes}m</div>
            </div>
          </div>
        )}

        {/* Filter bar */}
        {roles.length > 1 && (
          <div className="px-6 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Filter Role:</span>
            <div className="flex gap-1.5 overflow-x-auto">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-2.5 py-1 rounded-lg font-medium border ${
                  filterRole === 'all'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                All
              </button>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`px-2.5 py-1 rounded-lg font-medium border whitespace-nowrap ${
                    filterRole === r
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <HistoryIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">No Interview Sessions Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Completed interview results are saved automatically to your browser storage.
              </p>
            </div>
          ) : (
            filteredHistory.map((s) => {
              const formattedDate = new Date(s.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    playClickSound();
                    onSelectSession(s);
                  }}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-950 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Score badge */}
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col items-center justify-center font-mono font-bold text-white shrink-0">
                      <span className="text-base text-cyan-400">{s.overallScore || 0}</span>
                      <span className="text-[9px] text-slate-500 leading-none">%</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {s.role}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                          {s.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {formattedDate}
                        </span>
                        <span>•</span>
                        <span>{s.questionCount} Questions</span>
                        <span>•</span>
                        <span>{s.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(s.id, e)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 text-xs">
            <span className="text-slate-500">{history.length} total saved sessions</span>

            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-rose-400 text-[11px]">Clear all session history?</span>
                <button
                  onClick={handleClearAll}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
