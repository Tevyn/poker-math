import type { Card, Combo } from "../utils/lib/models";
import type { WhoWinsResult } from "../utils/whoWinsEquity";

/**
 * A who-wins scenario with multiple player hands and a board
 */
export interface WhoWinsScenario {
  id: string;
  board: Card[]; // 5 community cards (flop + turn + river)
  playerHands: PlayerHand[]; // Array of player hands (typically 2-6 players)
}

/**
 * A single player's hand in a who-wins scenario
 */
export interface PlayerHand {
  id: string;
  name: string; // e.g., "Player 1", "Player 2", "Alice", "Bob"
  cards: Combo; // Two cards using lib Card format
}

/**
 * Result of a who-wins scenario evaluation
 */
export interface WhoWinsScenarioResult {
  scenarioId: string;
  userAnswer: number; // Index of the hand the user selected
  correctAnswer: number; // Index of the winning hand (first winner in case of tie)
  isCorrect: boolean; // Whether the user selected a winning hand
  isTie: boolean; // Whether there are multiple winners
  tieIndices: number[]; // Indices of all winning hands in case of tie
  winningHandRank: string; // e.g., "Straight Flush", "Four of a Kind"
  winningHandDescription: string; // e.g., "Straight Flush, Ace High"
  allEvaluations: WhoWinsResult; // Complete evaluation results for all hands
}

/**
 * Configuration for generating who-wins scenarios
 */
export interface WhoWinsScenarioConfig {
  numPlayers: number; // Number of players (2-6)
  boardSize: number; // Number of board cards (0-5, 0=preflop, 3=flop, 4=turn, 5=river)
  includeTies: boolean; // Whether to prefer scenarios that might result in ties
  minHandStrength?: string; // Minimum hand strength to include (optional filter)
}

/**
 * Default configuration for who-wins scenarios
 */
export const DEFAULT_WHO_WINS_CONFIG: WhoWinsScenarioConfig = {
  numPlayers: 4,
  boardSize: 5, // River (complete board)
  includeTies: true,
};
