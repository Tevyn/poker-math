import { calculateHandRangeEquity, approximateHandRangeEquity } from "./lib/equity_utils";
import { convertRangeSelectionToCombos } from "./rangeConverter";
import type { Card, Combo, Equity } from "./lib/models";
import type { PokerRange } from "../types/rangeTypes";
import type { HandVsRangeResult } from "../types/handVsRange";

/**
 * Timeout wrapper for equity calculations to prevent infinite hanging
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
};

/**
 * Calculate exact hand vs range equity given hero hand, villain range, and board
 * Integrates with calculateHandRangeEquity from lib/equity_utils.ts
 */
export const calculateHandVsRangeEquity = async (
  heroHand: Combo,
  villainRange: PokerRange,
  board: Card[] = [],
  useExactCalculation: boolean = true
): Promise<Equity> => {

  
  // Convert villain range to combos
  const allVillainCombos = convertRangeSelectionToCombos(villainRange);
  
  if (allVillainCombos.length === 0) {
    throw new Error("Villain range is empty");
  }
  
  // Filter out villain combos that conflict with hero hand or board
  const heroCards = new Set(heroHand);
  const boardCards = new Set(board);
  const conflictCards = new Set([...heroCards, ...boardCards]);
  
  const villainCombos = allVillainCombos.filter(combo => {
    return !combo.some(card => conflictCards.has(card));
  });
  
  
  if (villainCombos.length === 0) {
    throw new Error("No valid villain combos remain after removing conflicts with hero hand and board");
  }
  
  // Validate hero hand and board compatibility (should pass now since we filtered conflicts)
  validateHandAndBoard(heroHand, villainCombos, board);
  
  // Use the appropriate calculation method
  
  // For large ranges, automatically switch to Monte Carlo to prevent hanging
  const shouldUseMonteCarlo = !useExactCalculation || villainCombos.length > 2;
  
  if (shouldUseMonteCarlo) {
    // Wrap in promise for timeout protection
    const calculationPromise = new Promise<Equity>((resolve) => {
      const result = approximateHandRangeEquity(heroHand, villainCombos, 100000);
      resolve(result);
    });
    
    const result = await withTimeout(
      calculationPromise, 
      30000, // 30 second timeout
      'Monte Carlo equity calculation timed out after 30 seconds'
    );
    
    return result;
  } else {
    // Wrap in promise for timeout protection
    const calculationPromise = new Promise<Equity>((resolve) => {
      const result = calculateHandRangeEquity(heroHand, villainCombos, board);
      resolve(result);
    });
    
    const result = await withTimeout(
      calculationPromise, 
      60000, // 60 second timeout for exact calculation
      'Exact equity calculation timed out after 60 seconds'
    );
    
    return result;
  }
};

/**
 * Validate that hero hand and villain combos are compatible with the board
 */
const validateHandAndBoard = (heroHand: Combo, villainCombos: Combo[], board: Card[]): void => {
  const allCards = new Set([...heroHand, ...board]);
  
  // Check for card conflicts between hero hand and board
  if (allCards.size !== heroHand.length + board.length) {
    throw new Error("Hero hand conflicts with board cards");
  }
  
  // Check for conflicts between hero hand and villain combos
  for (const villainCombo of villainCombos) {
    const villainCards = new Set(villainCombo);
    const intersection = new Set([...allCards].filter(card => villainCards.has(card)));
    
    if (intersection.size > 0) {
      throw new Error("Hero hand conflicts with villain range");
    }
  }
  
  // Check for conflicts between board and villain combos
  for (const villainCombo of villainCombos) {
    const villainCards = new Set(villainCombo);
    const intersection = new Set([...board].filter(card => villainCards.has(card)));
    
    if (intersection.size > 0) {
      throw new Error("Board conflicts with villain range");
    }
  }
};

/**
 * Convert equity to percentage for UI display
 */
export const equityToPercentage = (equity: number): number => {
  return Math.round(equity * 100 * 100) / 100; // Round to 2 decimal places
};

/**
 * Format equity results for display
 */
export const formatHandVsRangeResult = (equity: Equity): HandVsRangeResult => {
  return {
    heroEquity: equityToPercentage(equity.equity),
    villainEquity: equityToPercentage(1 - equity.equity),
    heroWin: equityToPercentage(equity.win),
    villainWin: equityToPercentage(1 - equity.win - equity.draw),
    tie: equityToPercentage(equity.draw),
    rawEquity: equity,
  };
};

/**
 * Process range for equity calculation with validation
 */
export const processRangeForEquity = (range: PokerRange): {
  combos: Combo[];
  stats: {
    totalCombos: number;
    totalHands: number;
    actionBreakdown: Record<string, number>;
  };
} => {
  const combos = convertRangeSelectionToCombos(range);
  
  const stats = {
    totalCombos: combos.length,
    totalHands: (range.raise?.length || 0) + (range.call?.length || 0) + (range.fold?.length || 0),
    actionBreakdown: {
      raise: range.raise?.length || 0,
      call: range.call?.length || 0,
      fold: range.fold?.length || 0,
    },
  };
  
  return { combos, stats };
};

/**
 * Calculate equity with detailed breakdown
 */
export const calculateDetailedEquity = async (
  heroHand: Combo,
  villainRange: PokerRange,
  board: Card[] = [],
  useExactCalculation: boolean = true
): Promise<{
  equity: Equity;
  result: HandVsRangeResult;
  rangeStats: {
    totalCombos: number;
    totalHands: number;
    actionBreakdown: Record<string, number>;
  };
}> => {
  const { combos: allCombos, stats } = processRangeForEquity(villainRange);
  
  if (allCombos.length === 0) {
    throw new Error("Villain range is empty");
  }
  
  // Filter out villain combos that conflict with hero hand or board
  const heroCards = new Set(heroHand);
  const boardCards = new Set(board);
  const conflictCards = new Set([...heroCards, ...boardCards]);
  
  const combos = allCombos.filter(combo => {
    return !combo.some(card => conflictCards.has(card));
  });
  
  if (combos.length === 0) {
    throw new Error("No valid villain combos remain after removing conflicts with hero hand and board");
  }
  
  validateHandAndBoard(heroHand, combos, board);
  
  // Use the same logic as the main function for consistency
  const shouldUseMonteCarlo = !useExactCalculation || combos.length > 2;
  
  let equity: Equity;
  if (shouldUseMonteCarlo) {
    const calculationPromise = new Promise<Equity>((resolve) => {
      const result = approximateHandRangeEquity(heroHand, combos, 10000);
      resolve(result);
    });
    equity = await withTimeout(
      calculationPromise, 
      30000,
      'Monte Carlo equity calculation timed out after 30 seconds'
    );
  } else {
    const calculationPromise = new Promise<Equity>((resolve) => {
      const result = calculateHandRangeEquity(heroHand, combos, board);
      resolve(result);
    });
    equity = await withTimeout(
      calculationPromise, 
      60000,
      'Exact equity calculation timed out after 60 seconds'
    );
  }
    
  const result = formatHandVsRangeResult(equity);
  
  return {
    equity,
    result,
    rangeStats: stats,
  };
};

/**
 * Format equity result for user feedback
 */
export const formatEquityFeedback = (
  userEstimate: number,
  actualResult: HandVsRangeResult,
  tolerance: number = 5
): {
  isCorrect: boolean;
  difference: number;
  feedback: string;
  accuracy: 'excellent' | 'good' | 'fair' | 'poor';
} => {
  const difference = Math.abs(userEstimate - actualResult.heroEquity);
  const isCorrect = difference <= tolerance;
  
  let accuracy: 'excellent' | 'good' | 'fair' | 'poor';
  if (difference <= tolerance / 2) {
    accuracy = 'excellent';
  } else if (difference <= tolerance) {
    accuracy = 'good';
  } else if (difference <= tolerance * 2) {
    accuracy = 'fair';
  } else {
    accuracy = 'poor';
  }
  
  let feedback = '';
  if (isCorrect) {
    feedback = `Great job! Your estimate of ${userEstimate}% was within ${tolerance} percentage points of the actual ${actualResult.heroEquity}%.`;
  } else {
    const direction = userEstimate > actualResult.heroEquity ? 'high' : 'low';
    feedback = `Your estimate of ${userEstimate}% was ${difference.toFixed(1)} percentage points too ${direction}. The actual equity is ${actualResult.heroEquity}%.`;
  }
  
  return {
    isCorrect,
    difference,
    feedback,
    accuracy,
  };
};
