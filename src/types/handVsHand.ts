import type { Card, Combo, Equity } from "../utils/lib/models";

/**
 * Hand vs Hand scenario using lib native types
 */
export interface HandVsHandScenario {
  /** First hand (two cards) */
  hand1: Combo;
  /** Second hand (two cards) */
  hand2: Combo;
  /** Board cards (0-5 cards) */
  board: Card[];
  /** Unique identifier for the scenario */
  id: string;
}

/**
 * Equity calculation result formatted for UI display
 */
export interface HandVsHandResult {
  /** Hand 1 equity percentage (0-100) */
  hand1Equity: number;
  /** Hand 2 equity percentage (0-100) */
  hand2Equity: number;
  /** Hand 1 win percentage (0-100) */
  hand1Win: number;
  /** Hand 2 win percentage (0-100) */
  hand2Win: number;
  /** Tie percentage (0-100) */
  tie: number;
  /** Raw equity data from lib */
  rawEquity: Equity;
}

/**
 * User's guess and result comparison
 */
export interface HandVsHandGuess {
  /** Scenario ID this guess is for */
  scenarioId: string;
  /** User's estimated equity for hand 1 (0-100) */
  userEstimate: number;
  /** Actual equity result */
  actualResult: HandVsHandResult;
  /** Whether the guess was within acceptable range */
  isCorrect: boolean;
  /** Difference between guess and actual (percentage points) */
  difference: number;
}

/**
 * Settings for hand vs hand practice
 */
export interface HandVsHandSettings {
  /** Whether to show board cards */
  includeBoard: boolean;
  /** Number of board cards to show (0-5) */
  boardSize: number;
  /** Tolerance for "correct" answers (percentage points) */
  tolerance: number;
  /** Whether to use exact calculation or Monte Carlo approximation */
  useExactCalculation: boolean;
  /** Number of simulations for Monte Carlo (if not using exact) */
  simulations: number;
}

/**
 * Practice session state
 */
export interface HandVsHandSession {
  /** Current scenario being practiced */
  currentScenario: HandVsHandScenario | null;
  /** All guesses made in this session */
  guesses: HandVsHandGuess[];
  /** Session settings */
  settings: HandVsHandSettings;
  /** Session start time */
  startTime: Date;
  /** Current problem number */
  problemNumber: number;
}

/**
 * Statistics for a practice session
 */
export interface HandVsHandStats {
  /** Total problems attempted */
  totalProblems: number;
  /** Number of correct guesses */
  correctGuesses: number;
  /** Accuracy percentage */
  accuracy: number;
  /** Average difference from correct answer */
  averageDifference: number;
  /** Best (lowest) difference */
  bestDifference: number;
  /** Worst (highest) difference */
  worstDifference: number;
  /** Session duration in milliseconds */
  sessionDuration: number;
}

/**
 * Default settings for hand vs hand practice
 */
export const DEFAULT_HAND_VS_HAND_SETTINGS: HandVsHandSettings = {
  includeBoard: false,
  boardSize: 0,
  tolerance: 5, // 5 percentage points
  useExactCalculation: true,
  simulations: 10000,
};

/**
 * Helper type for card selection in UI
 */
export interface CardSelection {
  /** Whether this card is selected */
  selected: boolean;
  /** Whether this card is available for selection */
  available: boolean;
  /** Whether this card is disabled */
  disabled: boolean;
}

/**
 * UI state for hand vs hand page
 */
export interface HandVsHandPageState {
  /** Current scenario */
  scenario: HandVsHandScenario | null;
  /** User's current estimate */
  userEstimate: number;
  /** Whether result is currently shown */
  showResult: boolean;
  /** Current guess result */
  currentGuess: HandVsHandGuess | null;
  /** Whether calculation is in progress */
  calculating: boolean;
  /** Error message if any */
  error: string | null;
  /** Session statistics */
  sessionStats: HandVsHandStats;
}
