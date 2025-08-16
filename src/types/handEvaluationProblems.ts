export interface WhoWinsProblem {
  id: string;
  board: string[]; // e.g., ['Ah', 'Ks', 'Qd', 'Jc', 'Th']
  pocketOptions: string[][]; // e.g., [['As', 'Ad'], ['Kh', 'Kd'], ['Qh', 'Qc']]
  correctAnswer: number; // index of the winning hand
  description?: string;
}

export interface BestHandProblem {
  id: string;
  board: string[]; // e.g., ['Ah', 'Ks', 'Qd', 'Jc', 'Th']
  correctAnswer: string; // e.g., 'Straight Flush', 'Four of a Kind', etc.
  description?: string;
}

export interface HandEvaluationResult {
  problemId: string;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
}
