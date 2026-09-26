import { Question, QuestionEvaluation, InterviewDifficulty } from './types';

export interface EvaluationResult {
  evaluation: QuestionEvaluation;
  recommendedNextDifficulty: InterviewDifficulty;
  mode: 'cloud-ai' | 'local-ai';
}

/**
 * Intelligent deterministic local evaluator for zero-API key / demo mode.
 * Evaluates semantic depth, keyword accuracy, reasoning, and structure.
 */
export function evaluateAnswerLocally(
  question: Question,
  userAnswer: string
): QuestionEvaluation {
  const trimmed = userAnswer.trim();
  const lowerAnswer = trimmed.toLowerCase();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      questionId: question.id,
      userAnswer: '',
      score: 0,
      technicalAccuracy: 0,
      problemSolving: 0,
      communication: 0,
      doneWell: ['Attempted to open the question.'],
      missing: [
        'No answer was provided.',
        'Address the core conceptual differences and technical mechanisms requested.'
      ],
      improvedAnswer: question.sampleIdealAnswer,
      improvementTip: 'Never leave an interview question blank. Even stating initial assumptions, trade-offs, or partial definitions demonstrates candidate problem-solving.',
      keyTakeaway: 'Always state what you know and ask clarifying questions if stuck.'
    };
  }

  // 1. Keyword analysis
  const matchedKeywords: string[] = [];
  const missedKeywords: string[] = [];

  for (const kw of question.expectedKeywords) {
    const kwLower = kw.toLowerCase();
    // Match whole keyword or significant sub-token
    const subTokens = kwLower.split(' ').filter((t) => t.length > 3);
    const matched = lowerAnswer.includes(kwLower) || subTokens.some((t) => lowerAnswer.includes(t));
    if (matched) {
      matchedKeywords.push(kw);
    } else {
      missedKeywords.push(kw);
    }
  }

  const keywordCoverage = matchedKeywords.length / Math.max(1, question.expectedKeywords.length);

  // 2. Analytical & problem solving signals
  const reasoningTerms = [
    'because', 'however', 'trade-off', 'overhead', 'complexity',
    'time complexity', 'space complexity', 'o(1)', 'o(n)', 'o(log n)',
    'scales', 'bottleneck', 'memory', 'cache', 'synchronous', 'asynchronous',
    'difference', 'advantage', 'disadvantage', 'mitigate', 'contrast'
  ];
  const matchedReasoning = reasoningTerms.filter((term) => lowerAnswer.includes(term));
  const reasoningScore = Math.min(100, Math.round((matchedReasoning.length / 4) * 100));

  // 3. Communication & Structure
  let communicationScore = 50;
  if (wordCount >= 25 && wordCount <= 250) {
    communicationScore = 75;
  } else if (wordCount > 250) {
    communicationScore = 85;
  } else if (wordCount < 15) {
    communicationScore = 30;
  }

  // Bonus for structured formatting (bullet points, numbered lists, paragraphs)
  if (trimmed.includes('\n') || trimmed.includes('- ') || trimmed.includes('1.') || trimmed.includes('*')) {
    communicationScore = Math.min(100, communicationScore + 15);
  }

  // 4. Technical Accuracy Calculation
  let technicalAccuracy = Math.round(keywordCoverage * 80);
  if (wordCount >= 40 && keywordCoverage > 0.3) {
    technicalAccuracy += 15;
  }
  technicalAccuracy = Math.min(100, Math.max(15, technicalAccuracy));

  // 5. Problem Solving Calculation
  let problemSolving = Math.round((reasoningScore * 0.6) + (keywordCoverage * 40));
  if (wordCount > 50) problemSolving += 10;
  problemSolving = Math.min(100, Math.max(20, problemSolving));

  // 6. Overall Weighted Score
  const rawScore = (technicalAccuracy * 0.5) + (problemSolving * 0.3) + (communicationScore * 0.2);
  const finalScore = Math.min(100, Math.max(5, Math.round(rawScore)));

  // Generate dynamic feedback points
  const doneWell: string[] = [];
  if (matchedKeywords.length > 0) {
    doneWell.push(`Correctly identified key concepts: ${matchedKeywords.slice(0, 3).join(', ')}.`);
  }
  if (matchedReasoning.length >= 2) {
    doneWell.push(`Highlighted trade-offs and behavioral characteristics effectively.`);
  }
  if (wordCount >= 30) {
    doneWell.push(`Provided a coherent explanation with adequate descriptive context.`);
  }
  if (doneWell.length === 0) {
    doneWell.push('Shared an initial perspective on the topic.');
  }

  const missing: string[] = [];
  if (missedKeywords.length > 0) {
    missing.push(`Did not elaborate on critical elements: ${missedKeywords.slice(0, 3).join(', ')}.`);
  }
  if (reasoningScore < 50) {
    missing.push('Could explicitly discuss time/space complexity or system resource trade-offs.');
  }
  if (wordCount < 35) {
    missing.push('Response is relatively brief; interviewers expect deeper mechanistic explanations.');
  }
  if (missing.length === 0) {
    missing.push('Consider offering a quick concrete edge case or production pitfall.');
  }

  // Actionable tip
  let tip = 'Anchor your answer around concrete system constraints and time/space complexity tradeoffs.';
  if (question.category === 'DSA') {
    tip = 'Always articulate both the best/average/worst time complexity and auxiliary space overhead.';
  } else if (question.category === 'System Design') {
    tip = 'Frame system design answers with numbers, single points of failure, and bottleneck mitigation.';
  } else if (question.category === 'JavaScript' || question.category === 'React') {
    tip = 'Explain what happens in the engine/runtime runtime (memory references, event loop phases, or reconciliation tree diffing).';
  }

  return {
    questionId: question.id,
    userAnswer: trimmed,
    score: finalScore,
    technicalAccuracy,
    problemSolving,
    communication: communicationScore,
    doneWell,
    missing,
    improvedAnswer: question.sampleIdealAnswer,
    improvementTip: tip,
    keyTakeaway: `Master the core mechanism: ${question.expectedKeywords.slice(0, 2).join(' & ')}.`
  };
}

/**
 * Cloud AI Evaluator: Calls Google Gemini API if GEMINI_API_KEY is configured,
 * otherwise falls back seamlessly to OpenAI API or local semantic evaluator.
 */
export async function evaluateAnswerWithAI(
  question: Question,
  userAnswer: string,
  customApiKey?: string
): Promise<EvaluationResult> {
  const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const evaluation = await callGeminiAPI(question, userAnswer, geminiKey);
      const nextDiff = computeAdaptiveDifficulty(question.difficulty, evaluation.score);
      return {
        evaluation,
        recommendedNextDifficulty: nextDiff,
        mode: 'cloud-ai'
      };
    } catch (err) {
      console.warn('Gemini evaluation failed, falling back to local evaluator:', err);
    }
  }

  if (openAiKey) {
    try {
      const evaluation = await callOpenAiAPI(question, userAnswer, openAiKey);
      const nextDiff = computeAdaptiveDifficulty(question.difficulty, evaluation.score);
      return {
        evaluation,
        recommendedNextDifficulty: nextDiff,
        mode: 'cloud-ai'
      };
    } catch (err) {
      console.warn('OpenAI evaluation failed, falling back to local evaluator:', err);
    }
  }

  // Local fallback
  const localEval = evaluateAnswerLocally(question, userAnswer);
  const nextDiff = computeAdaptiveDifficulty(question.difficulty, localEval.score);
  return {
    evaluation: localEval,
    recommendedNextDifficulty: nextDiff,
    mode: 'local-ai'
  };
}

function computeAdaptiveDifficulty(
  current: InterviewDifficulty,
  score: number
): InterviewDifficulty {
  if (score >= 85) {
    return current === 'Easy' ? 'Medium' : 'Hard';
  } else if (score < 45) {
    return current === 'Hard' ? 'Medium' : 'Easy';
  }
  return current;
}

async function callGeminiAPI(
  question: Question,
  userAnswer: string,
  apiKey: string
): Promise<QuestionEvaluation> {
  const prompt = `You are a Principal Software Engineering Interviewer evaluating a candidate's answer.
QUESTION:
${question.question}

CATEGORY: ${question.category} | ROLE: ${question.role} | DIFFICULTY: ${question.difficulty}
EXPECTED KEYWORDS / CONCEPTS: ${question.expectedKeywords.join(', ')}
RUBRIC CRITERIA:
${question.rubricCriteria.join('\n')}

BENCHMARK IDEAL ANSWER:
${question.sampleIdealAnswer}

CANDIDATE'S SUBMITTED ANSWER:
"""${userAnswer}"""

Evaluate the candidate objectively. Return ONLY a single valid JSON object with EXACTLY this structure:
{
  "score": number between 0 and 100,
  "technicalAccuracy": number between 0 and 100,
  "problemSolving": number between 0 and 100,
  "communication": number between 0 and 100,
  "doneWell": ["concise bullet 1", "concise bullet 2"],
  "missing": ["concise missing point 1", "concise missing point 2"],
  "improvedAnswer": "comprehensive benchmark answer incorporating standard best practices",
  "improvementTip": "one actionable tip for real interviews",
  "keyTakeaway": "one key lesson to remember"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini API');

  const parsed = JSON.parse(text);
  return {
    questionId: question.id,
    userAnswer,
    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
    technicalAccuracy: Math.min(100, Math.max(0, Number(parsed.technicalAccuracy) || 0)),
    problemSolving: Math.min(100, Math.max(0, Number(parsed.problemSolving) || 0)),
    communication: Math.min(100, Math.max(0, Number(parsed.communication) || 0)),
    doneWell: Array.isArray(parsed.doneWell) ? parsed.doneWell : [String(parsed.doneWell)],
    missing: Array.isArray(parsed.missing) ? parsed.missing : [String(parsed.missing)],
    improvedAnswer: parsed.improvedAnswer || question.sampleIdealAnswer,
    improvementTip: parsed.improvementTip || 'Anchor answers with specific complexity tradeoffs.',
    keyTakeaway: parsed.keyTakeaway || 'Clarify assumptions early.'
  };
}

async function callOpenAiAPI(
  question: Question,
  userAnswer: string,
  apiKey: string
): Promise<QuestionEvaluation> {
  const prompt = `You are a Principal Software Engineering Interviewer evaluating a candidate's answer.
QUESTION: ${question.question}
CATEGORY: ${question.category} | ROLE: ${question.role}
BENCHMARK ANSWER: ${question.sampleIdealAnswer}
CANDIDATE ANSWER: """${userAnswer}"""

Evaluate objectively and output strict JSON with:
score (0-100), technicalAccuracy (0-100), problemSolving (0-100), communication (0-100),
doneWell (array of strings), missing (array of strings), improvedAnswer (string), improvementTip (string), keyTakeaway (string).`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API returned status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  const parsed = JSON.parse(text);

  return {
    questionId: question.id,
    userAnswer,
    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
    technicalAccuracy: Math.min(100, Math.max(0, Number(parsed.technicalAccuracy) || 0)),
    problemSolving: Math.min(100, Math.max(0, Number(parsed.problemSolving) || 0)),
    communication: Math.min(100, Math.max(0, Number(parsed.communication) || 0)),
    doneWell: Array.isArray(parsed.doneWell) ? parsed.doneWell : [String(parsed.doneWell)],
    missing: Array.isArray(parsed.missing) ? parsed.missing : [String(parsed.missing)],
    improvedAnswer: parsed.improvedAnswer || question.sampleIdealAnswer,
    improvementTip: parsed.improvementTip || 'Structure responses logically.',
    keyTakeaway: parsed.keyTakeaway || 'Highlight underlying mechanisms.'
  };
}
