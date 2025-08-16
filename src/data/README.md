# Poker Problem Generation System

This module provides a dynamic system for generating poker hand vs. hand problems for equity training.

## Overview

Instead of static sample problems, the system now uses a pool of hand templates that can be randomly selected from to create unique problems. This provides much more variety and prevents users from memorizing specific hand combinations.

## Key Features

- **Template-based**: Stores hand types without suits to prevent card conflicts
- **Smart suit assignment**: Automatically ensures no duplicate cards within problems
- **Same hand types allowed**: Both players can have the same hand type (e.g., both KK) with different suits
- **Variety**: Users see different hand combinations each time

## Hand Templates

The `HAND_TEMPLATES` contains 50+ different poker hand types including:
- **Premium pairs**: AA, KK, QQ, JJ, TT
- **Medium pairs**: 99, 88, 77, 66, 55
- **Small pairs**: 44, 33, 22
- **Premium broadway**: AK, AQ, AJ, AT, KQ, KJ, QJ
- **Suited broadway**: AKs, AQs, AJs, KQs, KJs, QJs
- **Suited connectors**: T9s, 98s, 87s, 76s, 65s, 54s
- **Small suited connectors**: 43s, 32s
- **Gappers**: KTs, QTs, JTs

## Core Functions

### `generateRandomProblem()`
Generates a completely random problem by selecting 2 hand templates and converting them to concrete hands with unique suits.

### `generateProblemByCategory(category1?, category2?)`
Generates a problem with hands from specific categories:
- `'pairs'` - Only paired hands
- `'broadway'` - Only broadway card combinations
- `'suited'` - Only suited hands
- `'connectors'` - Only connector hands

### `generateBalancedProblem()`
Generates a problem with balanced difficulty - one strong hand (pairs/broadway) vs. one weaker hand.

### `generateMultipleProblems(count)`
Generates multiple random problems at once.

### `getProblems(count = 5)`
Convenience function to get a specific number of problems.

## Utility Functions

### `getHandPoolStats()`
Returns statistics about the hand templates including counts for different hand types.

### `getHandsByCriteria(criteria)`
Filters hand templates based on specific criteria:
- `minRank` - Minimum card rank
- `maxRank` - Maximum card rank  
- `isPaired` - Whether hands must be paired
- `isSuited` - Whether hands must be suited

## How It Works

1. **Template Selection**: Randomly select 2 hand templates (can be the same type)
2. **Suit Assignment**: Assign suits randomly while respecting suited/offsuit requirements
3. **Duplicate Prevention**: Check for duplicate cards and reassign suits if needed
4. **Result**: Guaranteed unique 4-card problem for the poker-odds-calculator

## Usage Examples

```typescript
import { 
  generateRandomProblem, 
  generateProblemByCategory,
  generateBalancedProblem,
  getHandPoolStats 
} from './sampleProblems';

// Generate a random problem
const problem = generateRandomProblem();

// Generate a problem with specific categories
const pairVsBroadway = generateProblemByCategory('pairs', 'broadway');

// Generate a balanced problem
const balanced = generateBalancedProblem();

// Get pool statistics
const stats = getHandPoolStats();
console.log(`Total hands: ${stats.total}, Pairs: ${stats.pairs}`);
```

## Backward Compatibility

The system maintains backward compatibility with the existing `getRandomProblem()` function, so existing code will continue to work without changes.

## Benefits

1. **Variety**: Users see different hand combinations each time
2. **Scalability**: Easy to add new hand types to the pool
3. **Flexibility**: Can generate problems by category or difficulty
4. **Uniqueness**: Each problem gets a unique ID
5. **Maintainability**: Centralized hand management
6. **Reliability**: Guaranteed no duplicate cards within problems
7. **Realistic**: Allows same hand types (e.g., both players can have KK)
