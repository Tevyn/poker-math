import type { Card, Combo } from "./lib/models";
import { RANKS, SUITS } from "./lib/constants";

/**
 * Generate a full deck of 52 cards
 */
export const generateFullDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push(`${rank}${suit}` as Card);
    }
  }
  return deck;
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Deal random cards from a deck, ensuring no duplicates
 */
export const dealRandomCards = (numCards: number, excludedCards: Card[] = []): Card[] => {
  const fullDeck = generateFullDeck();
  const availableDeck = fullDeck.filter(card => !excludedCards.includes(card));
  
  if (numCards > availableDeck.length) {
    throw new Error(`Cannot deal ${numCards} cards from deck with only ${availableDeck.length} available cards`);
  }
  
  const shuffledDeck = shuffleArray(availableDeck);
  return shuffledDeck.slice(0, numCards);
};

/**
 * Generate a random two-card hand (combo)
 */
export const generateRandomHand = (excludedCards: Card[] = []): Combo => {
  const cards = dealRandomCards(2, excludedCards);
  return [cards[0], cards[1]];
};

/**
 * Generate two random hands for hand-vs-hand comparison
 */
export const generateTwoRandomHands = (): [Combo, Combo] => {
  const hand1 = generateRandomHand();
  const hand2 = generateRandomHand(hand1);
  return [hand1, hand2];
};

/**
 * Generate a random board (flop, turn, river)
 */
export const generateRandomBoard = (numCards: number, excludedCards: Card[] = []): Card[] => {
  if (numCards < 0 || numCards > 5) {
    throw new Error("Board must have between 0 and 5 cards");
  }
  return dealRandomCards(numCards, excludedCards);
};

/**
 * Generate a complete random scenario: two hands + board
 */
export const generateRandomScenario = (boardSize: number = 0): {
  hand1: Combo;
  hand2: Combo;
  board: Card[];
} => {
  const [hand1, hand2] = generateTwoRandomHands();
  const allDealtCards = [...hand1, ...hand2];
  const board = generateRandomBoard(boardSize, allDealtCards);
  
  return {
    hand1,
    hand2,
    board
  };
};
