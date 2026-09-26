import { InterviewSession } from './types';

const STORAGE_KEY = 'interviewx_history_v1';

export function getInterviewHistory(): InterviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read interview history:', err);
    return [];
  }
}

export function saveInterviewSession(session: InterviewSession): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getInterviewHistory();
    // Prepend new session (newest first)
    const existingIndex = history.findIndex((h) => h.id === session.id);
    if (existingIndex >= 0) {
      history[existingIndex] = session;
    } else {
      history.unshift(session);
    }
    // Limit to latest 50 sessions
    const trimmed = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save interview session:', err);
  }
}

export function deleteInterviewSession(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getInterviewHistory().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to delete interview session:', err);
  }
}

export function clearInterviewHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear interview history:', err);
  }
}

export interface HistoryAnalytics {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  totalTimeMinutes: number;
  roleBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, { count: number; avgScore: number }>;
  bestScore: number;
}

export function computeHistoryAnalytics(history: InterviewSession[]): HistoryAnalytics {
  if (history.length === 0) {
    return {
      totalInterviews: 0,
      completedInterviews: 0,
      averageScore: 0,
      totalTimeMinutes: 0,
      roleBreakdown: {},
      categoryBreakdown: {},
      bestScore: 0,
    };
  }

  const completed = history.filter((s) => s.isCompleted);
  const totalScore = completed.reduce((acc, s) => acc + (s.overallScore || 0), 0);
  const totalSec = history.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const bestScore = completed.reduce((max, s) => Math.max(max, s.overallScore || 0), 0);

  const roleBreakdown: Record<string, number> = {};
  const categoryStats: Record<string, { total: number; count: number }> = {};

  history.forEach((s) => {
    roleBreakdown[s.role] = (roleBreakdown[s.role] || 0) + 1;
    if (!categoryStats[s.category]) {
      categoryStats[s.category] = { total: 0, count: 0 };
    }
    categoryStats[s.category].count += 1;
    categoryStats[s.category].total += s.overallScore || 0;
  });

  const categoryBreakdown: Record<string, { count: number; avgScore: number }> = {};
  Object.entries(categoryStats).forEach(([cat, data]) => {
    categoryBreakdown[cat] = {
      count: data.count,
      avgScore: data.count > 0 ? Math.round(data.total / data.count) : 0,
    };
  });

  return {
    totalInterviews: history.length,
    completedInterviews: completed.length,
    averageScore: completed.length > 0 ? Math.round(totalScore / completed.length) : 0,
    totalTimeMinutes: Math.round(totalSec / 60),
    roleBreakdown,
    categoryBreakdown,
    bestScore,
  };
}
