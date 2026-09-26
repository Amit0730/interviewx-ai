'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingHero } from '@/components/LandingHero';
import { HowItWorks } from '@/components/HowItWorks';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ComparisonSection } from '@/components/ComparisonSection';
import { Footer } from '@/components/Footer';
import { InterviewSetupModal } from '@/components/InterviewSetupModal';
import { InterviewSimulator } from '@/components/InterviewSimulator';
import { FinalResults } from '@/components/FinalResults';
import { HistoryModal } from '@/components/HistoryModal';
import {
  InterviewCategory,
  InterviewDifficulty,
  InterviewRole,
  InterviewSession,
  AIStatusResponse,
  Question
} from '@/lib/types';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'landing' | 'interview' | 'results'>('landing');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [setupInitialCategory, setSetupInitialCategory] = useState<InterviewCategory>('DSA');
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string | undefined>(undefined);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Fetch AI server status on initial load
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        const data: AIStatusResponse = await res.json();
        setAiStatus(data);
      } catch (err) {
        console.warn('Could not fetch AI status, fallback to local', err);
        setAiStatus({
          configured: false,
          provider: 'local',
          modelName: 'Built-in Semantic Engine',
          label: 'Demo / Local Mode Active',
        });
      }
    }
    checkStatus();
  }, []);

  // Launch interview setup with specific category
  const handleOpenCategorySetup = (cat: InterviewCategory) => {
    setSetupInitialCategory(cat);
    setIsSetupOpen(true);
  };

  // Start Interview session from configuration
  const handleStartSession = async (config: {
    role: InterviewRole;
    difficulty: InterviewDifficulty;
    category: InterviewCategory;
    questionCount: number;
    customApiKey?: string;
  }) => {
    setIsSetupOpen(false);
    setLoadingQuestions(true);
    setCustomApiKey(config.customApiKey);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.role,
          difficulty: config.difficulty,
          category: config.category,
          count: config.questionCount,
        }),
      });

      const data = await response.json();
      const questions: Question[] = data.questions || [];

      const newSession: InterviewSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        role: config.role,
        difficulty: config.difficulty,
        category: config.category,
        questionCount: questions.length,
        createdAt: new Date().toISOString(),
        durationSeconds: 0,
        questions,
        answers: {},
        evaluations: {},
        overallScore: 0,
        metrics: {
          technicalKnowledge: 0,
          problemSolving: 0,
          communication: 0,
          overall: 0,
        },
        strongestCategory: config.category,
        areasForImprovement: [],
        isCompleted: false,
        mode: data.mode || (config.customApiKey ? 'cloud-ai' : 'local-ai'),
      };

      setActiveSession(newSession);
      setViewMode('interview');
    } catch (err) {
      console.error('Failed to generate session questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Complete interview session
  const handleSessionComplete = (completedSession: InterviewSession) => {
    setActiveSession(completedSession);
    setViewMode('results');
  };

  // Open past session from history
  const handleSelectHistorySession = (session: InterviewSession) => {
    setIsHistoryOpen(false);
    setActiveSession(session);
    setViewMode('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Interview In-Progress Chamber */}
      {viewMode === 'interview' && activeSession && (
        <InterviewSimulator
          session={activeSession}
          customApiKey={customApiKey}
          onComplete={handleSessionComplete}
          onExit={() => setViewMode('landing')}
        />
      )}

      {/* 2. Final Results View */}
      {viewMode === 'results' && activeSession && (
        <FinalResults
          session={activeSession}
          onRetake={() => {
            setSetupInitialCategory(activeSession.category);
            setIsSetupOpen(true);
          }}
          onViewHistory={() => setIsHistoryOpen(true)}
          onHome={() => setViewMode('landing')}
        />
      )}

      {/* 3. Landing Page View */}
      {viewMode === 'landing' && (
        <>
          <Navbar
            onOpenSetup={() => setIsSetupOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            aiStatus={aiStatus}
          />

          <main className="flex-1">
            <LandingHero
              onStartInterview={() => setIsSetupOpen(true)}
              onSelectCategory={(cat) => handleOpenCategorySetup(cat as InterviewCategory)}
            />

            <HowItWorks />

            <CategoryGrid
              onSelectCategory={(cat) => handleOpenCategorySetup(cat)}
            />

            <FeaturesSection />

            <ComparisonSection
              onStartInterview={() => setIsSetupOpen(true)}
            />
          </main>

          <Footer />
        </>
      )}

      {/* Setup Modal */}
      <InterviewSetupModal
        key={setupInitialCategory}
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStart={handleStartSession}
        initialCategory={setupInitialCategory}
        aiStatus={aiStatus}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSession={handleSelectHistorySession}
      />

      {/* Loading Overlay */}
      {loadingQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-white">Synthesizing Interview Track...</h3>
            <p className="text-xs text-slate-400">Calibrating questions and evaluation rubrics</p>
          </div>
        </div>
      )}
    </div>
  );
}
