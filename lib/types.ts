export type InterviewRole =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'AI/ML Engineer'
  | 'Data Scientist'
  | 'Software Engineer';

export type InterviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export type InterviewCategory =
  | 'DSA'
  | 'JavaScript'
  | 'React'
  | 'Python'
  | 'Java'
  | 'SQL'
  | 'Operating Systems'
  | 'DBMS'
  | 'Computer Networks'
  | 'System Design'
  | 'AI/ML';

export interface Question {
  id: string;
  question: string;
  category: InterviewCategory;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  context?: string;
  expectedKeywords: string[];
  rubricCriteria: string[];
  sampleIdealAnswer: string;
  hints?: string[];
}

export interface QuestionEvaluation {
  questionId: string;
  score: number; // 0 - 100
  technicalAccuracy: number; // 0 - 100
  problemSolving: number; // 0 - 100
  communication: number; // 0 - 100
  doneWell: string[];
  missing: string[];
  improvedAnswer: string;
  improvementTip: string;
  keyTakeaway: string;
  userAnswer: string;
}

export interface PerformanceMetrics {
  technicalKnowledge: number;
  problemSolving: number;
  communication: number;
  overall: number;
}

export interface InterviewSession {
  id: string;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  category: InterviewCategory;
  questionCount: number;
  createdAt: string;
  completedAt?: string;
  durationSeconds: number;
  questions: Question[];
  answers: Record<string, string>;
  evaluations: Record<string, QuestionEvaluation>;
  overallScore: number;
  metrics: PerformanceMetrics;
  strongestCategory: string;
  areasForImprovement: string[];
  isCompleted: boolean;
  mode: 'cloud-ai' | 'local-ai';
}

export interface AIStatusResponse {
  configured: boolean;
  provider: 'gemini' | 'openai' | 'local';
  modelName: string;
  label: string;
}
