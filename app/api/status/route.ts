import { NextResponse } from 'next/server';
import { AIStatusResponse } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
  const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);

  let status: AIStatusResponse;

  if (geminiConfigured) {
    status = {
      configured: true,
      provider: 'gemini',
      modelName: 'Gemini 2.5 Flash',
      label: 'Cloud AI Active (Gemini)',
    };
  } else if (openAiConfigured) {
    status = {
      configured: true,
      provider: 'openai',
      modelName: 'GPT-4o Mini',
      label: 'Cloud AI Active (OpenAI)',
    };
  } else {
    status = {
      configured: false,
      provider: 'local',
      modelName: 'Built-in Semantic Engine',
      label: 'Demo / Local Mode Active',
    };
  }

  return NextResponse.json(status);
}
