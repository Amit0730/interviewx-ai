import { NextRequest, NextResponse } from 'next/server';
import { getFilteredQuestions } from '@/lib/questions';
import { InterviewCategory, InterviewDifficulty, InterviewRole, Question } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const role: InterviewRole = body.role || 'Software Engineer';
    const difficulty: InterviewDifficulty = body.difficulty || 'Medium';
    const category: InterviewCategory = body.category || 'DSA';
    const count: number = Math.min(15, Math.max(1, Number(body.count) || 3));

    // Retrieve curated vetted questions
    const questions: Question[] = getFilteredQuestions(role, difficulty, category, count);

    return NextResponse.json({
      success: true,
      questions,
      total: questions.length,
      mode: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY ? 'cloud-ai' : 'local-ai',
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate questions.' },
      { status: 500 }
    );
  }
}
