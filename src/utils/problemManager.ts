import { PokerProblem, ProblemResult } from '../types/pokerProblems';
import { getRandomProblem } from '../data/sampleProblems';
import { calculateHandVsHandEquity } from './pokerEquity';

export class ProblemManager {
  private currentProblem: PokerProblem | null = null;
  private problemHistory: ProblemResult[] = [];

  // Get a random problem
  getRandomProblem(): PokerProblem {
    this.currentProblem = getRandomProblem();
    return this.currentProblem;
  }

  // Get the current problem
  getCurrentProblem(): PokerProblem | null {
    return this.currentProblem;
  }

  // Calculate equity for the current problem
  calculateCurrentProblemEquity(): number | null {
    if (!this.currentProblem) return null;
    
    try {
      const result = calculateHandVsHandEquity(
        this.currentProblem.hand1, 
        this.currentProblem.hand2
      );
      return result.hand1Equity;
    } catch (error) {
      console.error('Error calculating equity:', error);
      return null;
    }
  }

  // Submit an answer and get result
  submitAnswer(userEstimate: number): ProblemResult | null {
    if (!this.currentProblem) return null;
    
    const correctEquity = this.calculateCurrentProblemEquity();
    if (correctEquity === null) return null;
    
    const isCorrect = Math.abs(userEstimate - correctEquity) <= 5; // ±5% tolerance
    
    const result: ProblemResult = {
      problemId: this.currentProblem.id,
      userEstimate,
      correctEquity,
      isCorrect
    };
    
    this.problemHistory.push(result);
    return result;
  }

  // Get problem history
  getProblemHistory(): ProblemResult[] {
    return [...this.problemHistory];
  }

  // Reset the manager
  reset(): void {
    this.currentProblem = null;
    this.problemHistory = [];
  }
}
