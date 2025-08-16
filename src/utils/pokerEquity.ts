import { CardGroup, OddsCalculator } from 'poker-odds-calculator';

export interface PokerHand {
  card1: string; // e.g., "Ah" for Ace of hearts
  card2: string; // e.g., "Ks" for King of spades
}

export interface EquityResult {
  hand1Equity: number;
  hand2Equity: number;
  tiePercentage: number;
}

/**
 * Calculate equity between two poker hands (pre-flop)
 * @param hand1 - First hand (two cards)
 * @param hand2 - Second hand (two cards)
 * @returns Equity percentages for both hands and tie percentage
 */
export function calculateHandVsHandEquity(hand1: PokerHand, hand2: PokerHand): EquityResult {
  try {
    // Convert our hand format to CardGroup format
    const hand1Cards = CardGroup.fromString(`${hand1.card1}${hand1.card2}`);
    const hand2Cards = CardGroup.fromString(`${hand2.card1}${hand2.card2}`);
    
    // Calculate odds (no board cards for pre-flop)
    const result = OddsCalculator.calculate([hand1Cards, hand2Cards]);
    
    // Extract equity percentages
    const hand1Equity = result.equities[0].getEquity();
    const hand2Equity = result.equities[1].getEquity();
    
    // Calculate tie percentage (remaining percentage)
    const tiePercentage = Math.max(0, 100 - hand1Equity - hand2Equity);
    
    return {
      hand1Equity: Math.round(hand1Equity * 100) / 100, // Round to 2 decimal places
      hand2Equity: Math.round(hand2Equity * 100) / 100,
      tiePercentage: Math.round(tiePercentage * 100) / 100
    };
  } catch (error) {
    console.error('Error calculating poker equity:', error);
    throw new Error('Failed to calculate poker equity');
  }
}

/**
 * Convert card string to display format
 * @param cardString - Card string like "Ah", "Ks", "2d"
 * @returns Formatted card string like "A♥", "K♠", "2♦"
 */
export function formatCardForDisplay(cardString: string): string {
  const rank = cardString[0];
  const suit = cardString[1];
  
  const suitSymbols: { [key: string]: string } = {
    'h': '♥',
    'd': '♦',
    'c': '♣',
    's': '♠'
  };
  
  return `${rank}${suitSymbols[suit] || suit}`;
}

/**
 * Validate card string format
 * @param cardString - Card string to validate
 * @returns True if valid format (e.g., "Ah", "Ks", "2d")
 */
export function isValidCardString(cardString: string): boolean {
  const validRanks = '23456789TJQKA';
  const validSuits = 'hdcs';
  
  return cardString.length === 2 && 
         validRanks.includes(cardString[0]) && 
         validSuits.includes(cardString[1]);
}

/**
 * Validate poker hand format
 * @param hand - Hand object to validate
 * @returns True if both cards are valid and different
 */
export function isValidPokerHand(hand: PokerHand): boolean {
  return isValidCardString(hand.card1) && 
         isValidCardString(hand.card2) && 
         hand.card1 !== hand.card2;
}
