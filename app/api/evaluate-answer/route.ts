import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswerWithAI } from '@/lib/evaluator';
import { Question } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: Question = body.question;
    const userAnswer: string = body.userAnswer ?? '';
    const customApiKey: string | undefined = body.customApiKey;

    if (!question || !question.id) {
      return NextResponse.json(
        { success: false, error: 'Valid question object is required.' },
        { status: 400 }
      );
    }

    // Evaluate using cloud AI or deterministic semantic fallback
    const result = await evaluateAnswerWithAI(question, userAnswer, customApiKey);

    return NextResponse.json({
      success: true,
      evaluation: result.evaluation,
      recommendedNextDifficulty: result.recommendedNextDifficulty,
      mode: result.mode,
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to evaluate answer.' },
      { status: 500 }
    );
  }
}
