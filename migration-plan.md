# Migration Plan: From poker-odds-calculator NPM Package to Local Library

## Overview

This document outlines the step-by-step migration from the `poker-odds-calculator` NPM package to the new local library in `@lib/`. The migration will replace all equity calculations, hand evaluations, and poker logic with the new high-performance library while maintaining existing application functionality.

## Current State Analysis

### Current Dependencies
- **NPM Package**: `poker-odds-calculator` v0.4.0
- **Usage**: Hand vs Hand equity calculations, multi-hand equity calculations
- **Card Format**: String format like "Ah", "Ks", "2d" (Ace of hearts, King of spades, 2 of diamonds)

### Current Interfaces
```typescript
// Current interfaces in src/utils/pokerEquity.ts
interface PokerHand {
  card1: string; // "Ah"
  card2: string; // "Ks"
}

interface EquityResult {
  hand1Equity: number;
  hand2Equity: number;
  tiePercentage: number;
}

interface MultiHandEquityResult {
  handEquities: number[];
  winners: number[];
  isTie: boolean;
  tieIndices: number[];
}
```

### New Library Interfaces
```typescript
// New library interfaces in lib/models.ts
type Card = `${Rank}${Suit}`; // "As", "Kh", "2d"
type Combo = [Card, Card];

interface Equity {
  win: number;    // Win percentage (0-1)
  draw: number;   // Draw percentage (0-1)  
  equity: number; // Total equity (0-1)
}
```

## Migration Strategy

### Phase 1: Adapter Layer Creation
Create adapter functions to bridge the gap between current interfaces and new library interfaces.

### Phase 2: Core Function Migration
Replace the core equity calculation functions while maintaining existing APIs.

### Phase 3: Testing & Validation
Ensure all existing functionality works with the new library.

### Phase 4: Cleanup
Remove old dependencies and update package.json.

## Detailed Migration Steps

### Step 1: Create Card Format Adapter

**File**: `src/utils/cardAdapter.ts`

```typescript
import type { Card as LibCard } from '../../lib/models';

// Convert from current format to lib format
export function convertToLibCard(cardString: string): LibCard {
  // Current: "Ah", "Ks", "2d", "Tc"
  // Lib: "As", "Kh", "2d", "Tc"
  const rank = cardString[0];
  const suit = cardString[1];
  
  // Map suit characters if needed
  const suitMap: Record<string, string> = {
    'h': 'h',  // hearts
    'd': 'd',  // diamonds  
    'c': 'c',  // clubs
    's': 's'   // spades
  };
  
  return `${rank}${suitMap[suit]}` as LibCard;
}

// Convert from lib format to current format
export function convertFromLibCard(libCard: LibCard): string {
  return libCard; // Same format, no conversion needed
}

// Convert PokerHand to Combo
export function convertPokerHandToCombo(hand: PokerHand): [LibCard, LibCard] {
  return [
    convertToLibCard(hand.card1),
    convertToLibCard(hand.card2)
  ];
}

// Convert board array to lib format
export function convertBoardToLib(board: string[]): LibCard[] {
  return board.map(convertToLibCard);
}
```

### Step 2: Create Equity Adapter

**File**: `src/utils/equityAdapter.ts`

```typescript
import { calculateHandRangeEquity, calculateHandHandEquity } from '../../lib/equity_utils';
import { convertPokerHandToCombo, convertBoardToLib } from './cardAdapter';
import type { PokerHand, EquityResult, MultiHandEquityResult } from './pokerEquity';
import type { Combo } from '../../lib/models';

// Adapter for hand vs hand equity calculation
export function calculateHandVsHandEquityAdapter(
  hand1: PokerHand, 
  hand2: PokerHand
): EquityResult {
  const combo1 = convertPokerHandToCombo(hand1);
  const combo2 = convertPokerHandToCombo(hand2);
  
  // Use new library function for hand vs hand
  const equity = calculateHandHandEquity(combo1, combo2, []);
  
  // Convert from 0-1 to 0-100 percentage format
  const hand1Equity = equity.win * 100;
  const hand2Equity = (1 - equity.win - equity.draw) * 100;
  const tiePercentage = equity.draw * 100;
  
  return {
    hand1Equity: Math.round(hand1Equity * 100) / 100,
    hand2Equity: Math.round(hand2Equity * 100) / 100,
    tiePercentage: Math.round(tiePercentage * 100) / 100
  };
}

// Adapter for multi-hand equity calculation
export function calculateMultiHandEquityAdapter(
  playerHands: { cards: [string, string] }[],
  board: string[]
): MultiHandEquityResult {
  // Convert hands to combos
  const combos: Combo[] = playerHands.map(hand => [
    convertToLibCard(hand.cards[0]),
    convertToLibCard(hand.cards[1])
  ]);
  
  // Convert board
  const libBoard = convertBoardToLib(board);
  
  // Calculate equity for each hand against all others
  const handEquities: number[] = [];
  const scores: number[] = [];
  
  // For each hand, calculate its equity against the field
  for (let i = 0; i < combos.length; i++) {
    const hand = combos[i];
    const opponents = combos.filter((_, index) => index !== i);
    
    if (opponents.length === 0) {
      handEquities.push(100);
      scores.push(1);
      continue;
    }
    
    // Calculate equity against all opponents
    const equity = calculateHandRangeEquity(hand, opponents, libBoard);
    const equityPercentage = equity.equity * 100;
    
    handEquities.push(Math.round(equityPercentage * 100) / 100);
    scores.push(equity.equity);
  }
  
  // Find winners (highest equity)
  const maxEquity = Math.max(...scores);
  const winners: number[] = [];
  scores.forEach((equity, index) => {
    if (Math.abs(equity - maxEquity) < 0.001) { // Account for floating point precision
      winners.push(index);
    }
  });
  
  const isTie = winners.length > 1;
  
  return {
    handEquities,
    winners: [winners[0]], // For display purposes, use first winner
    isTie,
    tieIndices: winners
  };
}
```

### Step 3: Update Core Utility Function

**File**: `src/utils/pokerEquity.ts` (Update existing file)

```typescript
// Remove old import
// import { CardGroup, OddsCalculator } from 'poker-odds-calculator';

// Add new imports
import { 
  calculateHandVsHandEquityAdapter, 
  calculateMultiHandEquityAdapter 
} from './equityAdapter';

// Keep existing interfaces unchanged
export interface PokerHand {
  card1: string;
  card2: string;
}

export interface EquityResult {
  hand1Equity: number;
  hand2Equity: number;
  tiePercentage: number;
}

export interface MultiHandEquityResult {
  handEquities: number[];
  winners: number[];
  isTie: boolean;
  tieIndices: number[];
}

// Replace function implementation
export function calculateHandVsHandEquity(hand1: PokerHand, hand2: PokerHand): EquityResult {
  try {
    return calculateHandVsHandEquityAdapter(hand1, hand2);
  } catch (error) {
    console.error('Error calculating poker equity:', error);
    throw new Error('Failed to calculate poker equity');
  }
}

// Replace function implementation
export function calculateMultiHandEquity(
  playerHands: { cards: [string, string] }[],
  board: string[]
): MultiHandEquityResult {
  try {
    return calculateMultiHandEquityAdapter(playerHands, board);
  } catch (error) {
    console.error('Error calculating multi-hand equity:', error);
    throw new Error('Failed to calculate multi-hand equity');
  }
}

// Keep utility functions unchanged
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

export function isValidCardString(cardString: string): boolean {
  const validRanks = '23456789TJQKA';
  const validSuits = 'hdcs';
  
  return cardString.length === 2 && 
         validRanks.includes(cardString[0]) && 
         validSuits.includes(cardString[1]);
}

export function isValidPokerHand(hand: PokerHand): boolean {
  return isValidCardString(hand.card1) && 
         isValidCardString(hand.card2) && 
         hand.card1 !== hand.card2;
}
```

### Step 4: Handle Missing Functions

The new library might not have a direct `calculateHandHandEquity` function. We need to implement this using the available functions:

**File**: `lib/equity_utils.ts` (Add to existing file)

```typescript
// Add this function to the lib if it doesn't exist
export const calculateHandHandEquity = (
  hand1: Combo,
  hand2: Combo,
  dealtBoard: Array<Card>
): Equity => {
  // Use calculateHandRangeEquity with hand2 as a single-combo range
  return calculateHandRangeEquity(hand1, [hand2], dealtBoard);
};
```

### Step 5: Enhanced Multi-Hand Evaluation

For better multi-hand evaluation, we might need to create a more sophisticated adapter:

**File**: `src/utils/multiHandEvaluator.ts`

```typescript
import { evaluate, findWinners } from '../../lib/evaluation_utils';
import { cardToInt } from '../../lib/evaluation_utils';
import { convertToLibCard } from './cardAdapter';
import type { Combo } from '../../lib/models';

export function evaluateMultiHandWinners(
  playerHands: { cards: [string, string] }[],
  board: string[]
): {
  winners: number[];
  handScores: number[];
  isTie: boolean;
} {
  // Convert all hands and board to lib format
  const libHands: Combo[] = playerHands.map(hand => [
    convertToLibCard(hand.cards[0]),
    convertToLibCard(hand.cards[1])
  ]);
  
  const libBoard = board.map(convertToLibCard);
  
  // Evaluate each hand
  const handScores: number[] = [];
  
  for (const hand of libHands) {
    const handInts = hand.map(cardToInt);
    const boardInts = libBoard.map(cardToInt);
    const score = evaluate(boardInts, handInts);
    handScores.push(score);
  }
  
  // Find winners (lower score is better in this library)
  const winners = findWinners(handScores);
  const isTie = winners.length > 1;
  
  return {
    winners,
    handScores,
    isTie
  };
}
```

### Step 6: Update Problem Managers

**File**: `src/utils/whoWinsProblemManager.ts` (Update existing)

```typescript
import { WhoWinsProblem, WhoWinsResult } from '../types/whoWinsProblems';
import { generateRandomWhoWinsProblem } from './dynamicProblemGenerator';
import { calculateMultiHandEquity } from './pokerEquity';
import { evaluateMultiHandWinners } from './multiHandEvaluator';

export class WhoWinsProblemManager {
  private currentProblem: WhoWinsProblem | null = null;
  private problemHistory: WhoWinsResult[] = [];

  // ... keep existing methods ...

  // Update this method to use hand evaluation instead of just equity
  async evaluateHands(problem: WhoWinsProblem): Promise<{
    winner: number;
    handRanks: string[];
    handDescriptions: string[];
    isTie: boolean;
    tieIndices: number[];
  }> {
    try {
      // Use direct hand evaluation for more accurate results
      const evaluation = evaluateMultiHandWinners(problem.playerHands, problem.board);
      
      // Convert hand scores to readable descriptions
      const handRanks = evaluation.handScores.map(score => {
        // Convert numeric score to hand rank description
        return this.scoreToHandRank(score);
      });
      
      const handDescriptions = handRanks.map(rank => {
        return this.handRankToDescription(rank);
      });
      
      return {
        winner: evaluation.winners[0],
        handRanks,
        handDescriptions,
        isTie: evaluation.isTie,
        tieIndices: evaluation.winners
      };
    } catch (error) {
      console.error('Error evaluating hands:', error);
      throw new Error('Failed to evaluate hands');
    }
  }

  private scoreToHandRank(score: number): string {
    // Map numeric scores to hand rankings
    // Lower scores are better hands in this library
    if (score <= 10) return "Straight Flush";
    if (score <= 166) return "Four of a Kind";
    if (score <= 322) return "Full House";
    if (score <= 1599) return "Flush";
    if (score <= 1609) return "Straight";
    if (score <= 2467) return "Three of a Kind";
    if (score <= 3325) return "Two Pair";
    if (score <= 6185) return "One Pair";
    return "High Card";
  }

  private handRankToDescription(rank: string): string {
    const descriptions: Record<string, string> = {
      "Straight Flush": "A straight flush - five cards in sequence, all of the same suit",
      "Four of a Kind": "Four of a kind - four cards of the same rank",
      "Full House": "Full house - three of a kind plus a pair",
      "Flush": "Flush - five cards of the same suit",
      "Straight": "Straight - five cards in sequence",
      "Three of a Kind": "Three of a kind - three cards of the same rank",
      "Two Pair": "Two pair - two different pairs",
      "One Pair": "One pair - two cards of the same rank",
      "High Card": "High card - no other hand ranking"
    };
    
    return descriptions[rank] || "Unknown hand";
  }
}
```

### Step 7: Update Package Dependencies

**File**: `package.json`

```json
{
  "dependencies": {
    "next": "15.4.6",
    // Remove this line:
    // "poker-odds-calculator": "^0.4.0",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

### Step 8: Testing Strategy

Create test files to ensure migration works correctly:

**File**: `src/utils/__tests__/equityMigration.test.ts`

```typescript
import { calculateHandVsHandEquity, calculateMultiHandEquity } from '../pokerEquity';

describe('Equity Migration Tests', () => {
  test('Hand vs Hand equity calculation', () => {
    const hand1 = { card1: 'As', card2: 'Ah' }; // Pocket Aces
    const hand2 = { card1: 'Ks', card2: 'Kh' }; // Pocket Kings
    
    const result = calculateHandVsHandEquity(hand1, hand2);
    
    // AA vs KK should heavily favor AA (around 80-82%)
    expect(result.hand1Equity).toBeGreaterThan(80);
    expect(result.hand1Equity).toBeLessThan(85);
    expect(result.hand2Equity).toBeGreaterThan(15);
    expect(result.hand2Equity).toBeLessThan(20);
    expect(result.tiePercentage).toBeLessThan(5);
  });

  test('Multi-hand equity with board', () => {
    const hands = [
      { cards: ['As', 'Ah'] as [string, string] },
      { cards: ['Ks', 'Kh'] as [string, string] },
      { cards: ['Qc', 'Qd'] as [string, string] }
    ];
    const board = ['2s', '7h', 'Td', 'Jc', '9s'];
    
    const result = calculateMultiHandEquity(hands, board);
    
    expect(result.handEquities).toHaveLength(3);
    expect(result.winners).toHaveLength(1);
    expect(result.winners[0]).toBeGreaterThanOrEqual(0);
    expect(result.winners[0]).toBeLessThan(3);
  });
});
```

### Step 9: Error Handling & Fallbacks

**File**: `src/utils/migrationHelpers.ts`

```typescript
// Helper functions for migration edge cases

export function validateLibraryIntegration(): boolean {
  try {
    // Test basic library functions
    const testCard = 'As';
    // Add basic validation tests here
    return true;
  } catch (error) {
    console.error('Library integration validation failed:', error);
    return false;
  }
}

export function handleMigrationError(error: Error, context: string): never {
  console.error(`Migration error in ${context}:`, error);
  throw new Error(`Migration failed: ${error.message}`);
}
```

## Implementation Timeline

### Week 1: Foundation
- [ ] Create card adapter utilities
- [ ] Create basic equity adapter
- [ ] Test basic hand vs hand calculations

### Week 2: Core Migration
- [ ] Update pokerEquity.ts with new implementations
- [ ] Update all problem managers
- [ ] Implement multi-hand evaluation

### Week 3: Testing & Refinement
- [ ] Comprehensive testing of all features
- [ ] Performance optimization
- [ ] Bug fixes and edge cases

### Week 4: Cleanup & Documentation
- [ ] Remove old dependencies
- [ ] Update documentation
- [ ] Final testing and deployment

## Risk Mitigation

### Performance Concerns
- **Risk**: New library might be slower for some operations
- **Mitigation**: Benchmark critical paths and optimize if needed

### Accuracy Differences
- **Risk**: Results might differ slightly from old library
- **Mitigation**: Create side-by-side comparison tests during migration

### Missing Features
- **Risk**: New library might not support all current features
- **Mitigation**: Implement missing features or create workarounds

## Success Criteria

1. ✅ All existing functionality works without user-visible changes
2. ✅ No degradation in performance for typical use cases  
3. ✅ All tests pass with new library
4. ✅ poker-odds-calculator dependency successfully removed
5. ✅ Application builds and runs without errors

## Post-Migration Opportunities

After successful migration, consider leveraging additional features from the new library:
- Range vs Range equity calculations
- Advanced hand evaluation features
- Performance optimizations for large calculations
- More detailed hand analysis capabilities

This migration will provide a solid foundation for future poker analysis features while maintaining backward compatibility with existing functionality.
