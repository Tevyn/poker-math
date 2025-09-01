import { cardToInt, evaluate, combinations } from "./lib/evaluation_utils";
import type { Card, Combo, Equity } from "./lib/models";

/**
 * All card integers for creating a deck (from lib/equity_utils.ts)
 */
const ALLCARDS = [
  69634, 73730, 81922, 98306, 135427, 139523, 147715, 164099, 266757, 270853, 279045, 295429,
  529159, 533255, 541447, 557831, 1053707, 1057803, 1065995, 1082379, 2102541, 2106637, 2114829,
  2131213, 4199953, 4204049, 4212241, 4228625, 8394515, 8398611, 8406803, 8423187, 16783383,
  16787479, 16795671, 16812055, 33560861, 33564957, 33573149, 33589533, 67115551, 67119647,
  67127839, 67144223, 134224677, 134228773, 134236965, 134253349, 268442665, 268446761, 268454953,
  268471337,
];

/**
 * Create a deck of card integers excluding specified cards
 */
const getDeck = (exclusions: Set<number>): number[] => {
  const cards = [];
  for (const card of ALLCARDS) {
    if (!exclusions.has(card)) {
      cards.push(card);
    }
  }
  return cards;
};

/**
 * Calculate exact hand vs hand equity given two hands and an optional board
 */
export const calculateHandVsHandEquity = (
  hand1: Combo,
  hand2: Combo,
  board: Card[] = []
): Equity => {
  let wins = 0;
  let ties = 0;
  let totalSimulations = 0;

  // Convert cards to integers
  const hand1Ints = hand1.map(cardToInt);
  const hand2Ints = hand2.map(cardToInt);
  const boardInts = board.map(cardToInt);

  // Create exclusion set for used cards
  const exclusions = new Set([...hand1Ints, ...hand2Ints, ...boardInts]);

  // Get available deck
  const deck = getDeck(exclusions);
  const remainingCards = 5 - boardInts.length;

  if (remainingCards === 0) {
    // Board is complete, just evaluate both hands
    const score1 = evaluate(boardInts, hand1Ints);
    const score2 = evaluate(boardInts, hand2Ints);
    
    if (score1 < score2) {
      wins = 1;
    } else if (score1 === score2) {
      ties = 1;
    }
    totalSimulations = 1;
  } else {
    // Generate all possible board completions
    const boardCombinations = combinations(deck, remainingCards);
    
    for (const boardCompletion of boardCombinations) {
      const fullBoard = [...boardInts, ...boardCompletion];
      
      const score1 = evaluate(fullBoard, hand1Ints);
      const score2 = evaluate(fullBoard, hand2Ints);
      
      if (score1 < score2) {
        wins += 1;
      } else if (score1 === score2) {
        ties += 1;
      }
      totalSimulations += 1;
    }
  }

  return {
    win: wins / totalSimulations,
    draw: ties / totalSimulations,
    equity: (wins + ties * 0.5) / totalSimulations,
  };
};

/**
 * Calculate approximate hand vs hand equity using Monte Carlo simulation
 * Useful for scenarios where exact calculation would be too slow
 */
export const approximateHandVsHandEquity = (
  hand1: Combo,
  hand2: Combo,
  board: Card[] = [],
  simulations: number = 10000
): Equity => {
  let wins = 0;
  let ties = 0;

  // Convert cards to integers
  const hand1Ints = hand1.map(cardToInt);
  const hand2Ints = hand2.map(cardToInt);
  const boardInts = board.map(cardToInt);

  // Create exclusion set for used cards
  const exclusions = new Set([...hand1Ints, ...hand2Ints, ...boardInts]);
  const remainingCards = 5 - boardInts.length;

  if (remainingCards === 0) {
    // Board is complete, just evaluate both hands
    const score1 = evaluate(boardInts, hand1Ints);
    const score2 = evaluate(boardInts, hand2Ints);
    
    if (score1 < score2) {
      return { win: 1, draw: 0, equity: 1 };
    } else if (score1 === score2) {
      return { win: 0, draw: 1, equity: 0.5 };
    } else {
      return { win: 0, draw: 0, equity: 0 };
    }
  }

  // Get available deck
  const deck = getDeck(exclusions);

  for (let i = 0; i < simulations; i++) {
    // Randomly sample remaining cards for the board
    const shuffledDeck = [...deck];
    for (let j = shuffledDeck.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledDeck[j], shuffledDeck[k]] = [shuffledDeck[k], shuffledDeck[j]];
    }
    
    const boardCompletion = shuffledDeck.slice(0, remainingCards);
    const fullBoard = [...boardInts, ...boardCompletion];
    
    const score1 = evaluate(fullBoard, hand1Ints);
    const score2 = evaluate(fullBoard, hand2Ints);
    
    if (score1 < score2) {
      wins += 1;
    } else if (score1 === score2) {
      ties += 1;
    }
  }

  return {
    win: wins / simulations,
    draw: ties / simulations,
    equity: (wins + ties * 0.5) / simulations,
  };
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
export interface EquityResult {
  hand1Equity: number;
  hand2Equity: number;
  hand1Win: number;
  hand2Win: number;
  tie: number;
}

export const formatEquityResult = (equity: Equity): EquityResult => {
  return {
    hand1Equity: equityToPercentage(equity.equity),
    hand2Equity: equityToPercentage(1 - equity.equity),
    hand1Win: equityToPercentage(equity.win),
    hand2Win: equityToPercentage(1 - equity.win - equity.draw),
    tie: equityToPercentage(equity.draw),
  };
};
