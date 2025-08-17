import { WhoWinsProblem, WhoWinsResult } from '../types/whoWinsProblems';
import { generateRandomWhoWinsProblem } from './dynamicProblemGenerator';
import { calculateMultiHandEquity } from './pokerEquity';

export class WhoWinsProblemManager {
  private currentProblem: WhoWinsProblem | null = null;
  private problemHistory: WhoWinsResult[] = [];

  constructor() {
    // No initialization needed for equity-based approach
  }

  // Get a random problem
  getRandomProblem(): WhoWinsProblem {
    this.currentProblem = generateRandomWhoWinsProblem();
    return this.currentProblem;
  }

  // Get the current problem
  getCurrentProblem(): WhoWinsProblem | null {
    return this.currentProblem;
  }

  // Evaluate all hands and determine winner using equity calculations
  async evaluateHands(problem: WhoWinsProblem): Promise<{
    winner: number;
    handRanks: string[];
    handDescriptions: string[];
    isTie: boolean;
    tieIndices: number[];
  }> {
    try {
      // Use our equity calculator to determine winners
      const equityResult = calculateMultiHandEquity(problem.playerHands, problem.board);
      
      // For equity-based approach, we don't have specific hand ranks/descriptions
      // but we can determine the winner based on equity
      const winner = equityResult.winners[0];
      const isTie = equityResult.isTie;
      const tieIndices = equityResult.tieIndices;
      
      // Create placeholder hand ranks and descriptions since equity doesn't provide these
      const handRanks = problem.playerHands.map(() => 'Evaluated by Equity');
      const handDescriptions = problem.playerHands.map(() => 'Hand strength determined by equity calculation');
      
      return {
        winner,
        handRanks,
        handDescriptions,
        isTie,
        tieIndices
      };
    } catch (error) {
      console.error('Error evaluating hands with equity calculator:', error);
      throw new Error('Failed to evaluate hands');
    }
  }

  // Submit answer and get result
  async submitAnswer(userAnswer: number): Promise<WhoWinsResult | null> {
    if (!this.currentProblem) return null;
    
    try {
      const evaluation = await this.evaluateHands(this.currentProblem);
      const isCorrect = userAnswer === evaluation.winner;
      
      const result: WhoWinsResult = {
        problemId: this.currentProblem.id,
        userAnswer,
        correctAnswer: evaluation.winner,
        isCorrect,
        winningHandRank: evaluation.handRanks[evaluation.winner],
        winningHandDescription: evaluation.handDescriptions[evaluation.winner],
        isTie: evaluation.isTie,
        tieIndices: evaluation.tieIndices
      };
      
      this.problemHistory.push(result);
      return result;
    } catch (error) {
      console.error('Error submitting answer:', error);
      return null;
    }
  }

  // Get problem history
  getProblemHistory(): WhoWinsResult[] {
    return [...this.problemHistory];
  }

  // Reset the manager
  reset(): void {
    this.currentProblem = null;
    this.problemHistory = [];
  }
}
