import { cardToInt, evaluate } from "./lib/evaluation_utils";
import type { Card, Combo } from "./lib/models";

/**
 * Evaluate multiple hands on a given board and determine the winner(s)
 */
export interface HandEvaluation {
  handIndex: number;
  score: number;
  handRank: string;
  handDescription: string;
}

export interface WhoWinsResult {
  winningIndices: number[];
  isTie: boolean;
  evaluations: HandEvaluation[];
  winningHandRank: string;
  winningHandDescription: string;
}

/**
 * Get hand rank name from evaluation score
 */
const getHandRankName = (score: number): string => {
  // Lower scores are better in the evaluation system
  if (score <= 1) return "High Card";
  if (score <= 10) return "Pair";
  if (score <= 166) return "Two Pair";
  if (score <= 322) return "Three of a Kind";
  if (score <= 1599) return "Straight";
  if (score <= 1609) return "Flush";
  if (score <= 2467) return "Full House";
  if (score <= 3325) return "Four of a Kind";
  return "Straight Flush";
};

/**
 * Get detailed hand description
 */
const getHandDescription = (score: number): string => {
  const rank = getHandRankName(score);
  // For now, return the rank name. Could be enhanced with more details
  return rank;
};

/**
 * Evaluate multiple hands on a given board and determine the winner(s)
 */
export const evaluateMultipleHands = (
  hands: Combo[],
  board: Card[]
): WhoWinsResult => {
  if (hands.length === 0) {
    throw new Error("At least one hand must be provided");
  }

  // Convert board to integers
  const boardInts = board.map(cardToInt);

  // Evaluate each hand
  const evaluations: HandEvaluation[] = hands.map((hand, index) => {
    const handInts = hand.map(cardToInt);
    const score = evaluate(boardInts, handInts);
    const handRank = getHandRankName(score);
    const handDescription = getHandDescription(score);

    return {
      handIndex: index,
      score,
      handRank,
      handDescription,
    };
  });

  // Find the best score (lowest score wins)
  const bestScore = Math.min(...evaluations.map(e => e.score));

  // Find all hands with the best score (winners)
  const winningEvaluations = evaluations.filter(e => e.score === bestScore);
  const winningIndices = winningEvaluations.map(e => e.handIndex);
  const isTie = winningIndices.length > 1;

  // Get the winning hand rank and description
  const winningHandRank = winningEvaluations[0].handRank;
  const winningHandDescription = winningEvaluations[0].handDescription;

  return {
    winningIndices,
    isTie,
    evaluations,
    winningHandRank,
    winningHandDescription,
  };
};

/**
 * Check if a specific hand index is a winner
 */
export const isHandWinner = (
  handIndex: number,
  result: WhoWinsResult
): boolean => {
  return result.winningIndices.includes(handIndex);
};

/**
 * Get the equity of a specific hand against all other hands
 * This is useful for showing individual hand strength
 */
export const getHandEquity = (
  targetHandIndex: number,
  hands: Combo[],
  board: Card[]
): number => {
  const result = evaluateMultipleHands(hands, board);
  
  if (result.isTie) {
    // If it's a tie and our hand is involved, return partial equity
    if (result.winningIndices.includes(targetHandIndex)) {
      return 1 / result.winningIndices.length;
    }
    return 0;
  }
  
  // If our hand is the sole winner
  if (result.winningIndices.includes(targetHandIndex)) {
    return 1;
  }
  
  return 0;
};
