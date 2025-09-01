import type { Card, Combo, Equity } from "../utils/lib/models";
import type { PokerRange } from "./rangeTypes";

/**
 * Hand vs Range scenario using lib native types
 */
export interface HandVsRangeScenario {
  /** Hero's hand (two cards) */
  heroHand: Combo;
  /** Villain's range (from rangeData format) */
  villainRange: PokerRange;
  /** Board cards (0-5 cards) */
  board: Card[];
  /** Unique identifier for the scenario */
  id: string;
}

/**
 * Equity calculation result formatted for UI display
 */
export interface HandVsRangeResult {
  /** Hero hand equity percentage (0-100) */
  heroEquity: number;
  /** Villain range equity percentage (0-100) */
  villainEquity: number;
  /** Hero hand win percentage (0-100) */
  heroWin: number;
  /** Villain range win percentage (0-100) */
  villainWin: number;
  /** Tie percentage (0-100) */
  tie: number;
  /** Raw equity data from lib */
  rawEquity: Equity;
}

/**
 * Settings for hand vs range practice
 */
export interface HandVsRangeSettings {
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
  /** Whether to show villain range display */
  showVillainRange: boolean;
  /** Whether to show range statistics */
  showRangeStats: boolean;
}

/**
 * Practice session state
 */
export interface HandVsRangeSession {
  /** Current scenario being practiced */
  currentScenario: HandVsRangeScenario | null;
  /** All guesses made in this session */
  guesses: HandVsRangeGuess[];
  /** Session settings */
  settings: HandVsRangeSettings;
  /** Session start time */
  startTime: Date;
  /** Current problem number */
  problemNumber: number;
}

/**
 * User's guess and result comparison
 */
export interface HandVsRangeGuess {
  /** Scenario ID this guess is for */
  scenarioId: string;
  /** User's estimated equity for hero hand (0-100) */
  userEstimate: number;
  /** Actual equity result */
  actualResult: HandVsRangeResult;
  /** Whether the guess was within acceptable range */
  isCorrect: boolean;
  /** Difference between guess and actual (percentage points) */
  difference: number;
}

/**
 * Statistics for a practice session
 */
export interface HandVsRangeStats {
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
 * Default settings for hand vs range practice
 */
export const DEFAULT_HAND_VS_RANGE_SETTINGS: HandVsRangeSettings = {
  includeBoard: false,
  boardSize: 0,
  tolerance: 5, // 5 percentage points
  useExactCalculation: true,
  simulations: 10000,
  showVillainRange: true,
  showRangeStats: true,
};

/**
 * Helper type for range display in UI
 */
export interface RangeDisplayState {
  /** Whether this hand is in the villain's range */
  inRange: boolean;
  /** Action type for this hand (raise/call/fold) */
  action: 'raise' | 'call' | 'fold' | 'none';
  /** Whether this hand is highlighted */
  highlighted: boolean;
  /** Whether this hand is disabled */
  disabled: boolean;
}

/**
 * UI state for hand vs range page
 */
export interface HandVsRangePageState {
  /** Current scenario */
  scenario: HandVsRangeScenario | null;
  /** User's current estimate */
  userEstimate: number;
  /** Whether result is currently shown */
  showResult: boolean;
  /** Current guess result */
  currentGuess: HandVsRangeGuess | null;
  /** Whether calculation is in progress */
  calculating: boolean;
  /** Error message if any */
  error: string | null;
  /** Session statistics */
  sessionStats: HandVsRangeStats;
  /** Range display state */
  rangeDisplay: Record<string, RangeDisplayState>;
}