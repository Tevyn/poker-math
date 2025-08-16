import { WhoWinsProblem, WhoWinsResult } from '../types/whoWinsProblems';
import { generateRandomWhoWinsProblem } from './dynamicProblemGenerator';

// Define the pokersolver Hand interface based on the actual types
interface PokerHand {
  name: string;
  descr: string;
  cardPool: string[];
  rank: number;
}

interface PokerHandClass {
  solve(cards: string[]): PokerHand;
  winners(hands: PokerHand[]): PokerHand[];
}

export class WhoWinsProblemManager {
  private currentProblem: WhoWinsProblem | null = null;
  private problemHistory: WhoWinsResult[] = [];
  private Hand: PokerHandClass | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Initialize pokersolver
    this.initializePokersolver();
  }

  private async initializePokersolver() {
    try {
      if (typeof window !== 'undefined') {
        // Browser environment - try dynamic import
        try {
          const pokersolver = await import('pokersolver');
          this.Hand = pokersolver.Hand;
          this.isInitialized = true;
        } catch (importError) {
          console.error('Failed to import pokersolver:', importError);
          throw new Error('Pokersolver initialization failed');
        }
      } else {
        // Node.js environment - use dynamic import for consistency
        try {
          const pokersolver = await import('pokersolver');
          this.Hand = pokersolver.Hand;
          this.isInitialized = true;
        } catch (importError) {
          console.error('Failed to import pokersolver in Node.js:', importError);
          throw new Error('Pokersolver initialization failed');
        }
      }
    } catch (error) {
      console.error('Error initializing pokersolver:', error);
      throw new Error('Pokersolver initialization failed');
    }
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

  // Wait for pokersolver to be initialized
  async waitForInitialization(): Promise<void> {
    if (this.isInitialized) return;
    
    return new Promise((resolve) => {
      const checkInit = () => {
        if (this.isInitialized) {
          resolve();
        } else if (this.Hand) {
          this.isInitialized = true;
          resolve();
        } else {
          setTimeout(checkInit, 100);
        }
      };
      checkInit();
    });
  }

  // Evaluate all hands and determine winner using pokersolver
  async evaluateHands(problem: WhoWinsProblem): Promise<{
    winner: number;
    handRanks: string[];
    handDescriptions: string[];
    isTie: boolean;
    tieIndices: number[];
  }> {
    await this.waitForInitialization();
    
    if (!this.Hand) {
      throw new Error('Pokersolver not initialized');
    }

    try {
      // Create hand objects for each player
      const hands = problem.playerHands.map(playerHand => {
        const allCards = [...problem.board, ...playerHand.cards];
        return this.Hand!.solve(allCards);
      });
      
      // Find the highest rank among all hands
      const highestRank = Math.max(...hands.map(h => h.rank));
      
      // Find all players with the highest rank
      const winningIndices: number[] = [];
      hands.forEach((hand, index) => {
        if (hand.rank === highestRank) {
          winningIndices.push(index);
        }
      });
      
      // Check if there's a tie
      const isTie = winningIndices.length > 1;
      
      // If there's a tie, we need to compare the hands more carefully
      let finalWinners: number[] = winningIndices;
      
      if (isTie) {
        // Get the winning hand type to compare descriptions
        const winningHands = hands.filter(h => h.rank === highestRank);
        
        // For hands of the same rank, we need to determine which one is actually better
        // Use pokersolver's winners() function to properly rank hands of the same type
        const rankedWinners = this.Hand!.winners(winningHands);
        
        if (rankedWinners.length > 1) {
          // Multiple players have exactly the same hand (true tie)
          // Find the indices of all players with the winning hand
          const trueTieIndices: number[] = [];
          winningHands.forEach((hand, index) => {
            if (rankedWinners.some(winner => winner.descr === hand.descr)) {
              trueTieIndices.push(winningIndices[index]);
            }
          });
          finalWinners = trueTieIndices;
        } else {
          // Only one player has the best hand of this rank
          // Find which player has the winning hand
          const winnerIndex = winningHands.findIndex(hand => 
            rankedWinners.some(winner => winner.descr === hand.descr)
          );
          finalWinners = [winningIndices[winnerIndex]];
        }
      }
      
      // For display purposes, use the first winner
      const displayWinner = finalWinners[0] ?? 0;

      return {
        winner: displayWinner,
        handRanks: hands.map((h: PokerHand) => h.name),
        handDescriptions: hands.map((h: PokerHand) => h.descr),
        isTie: finalWinners.length > 1,
        tieIndices: finalWinners
      };
    } catch (error) {
      console.error('Error evaluating hands with pokersolver:', error);
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
