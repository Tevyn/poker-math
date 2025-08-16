import { PokerHand } from '../utils/pokerEquity';

export interface PokerProblem {
  id: string;
  hand1: PokerHand;
  hand2: PokerHand;
}

export interface ProblemResult {
  problemId: string;
  userEstimate: number;
  correctEquity: number;
  isCorrect: boolean;
}
