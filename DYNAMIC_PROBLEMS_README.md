# Dynamic Problem Generation for Who Wins

## Overview
The Who Wins module now generates problems dynamically instead of using pre-defined static problems. This provides infinite variety and more realistic poker scenarios.

## What Changed

### 1. New Dynamic Problem Generator
- **File**: `src/utils/dynamicProblemGenerator.ts`
- **Function**: Creates a standard 52-card deck, shuffles it, and deals cards to players and board
- **Benefits**: 
  - Infinite problem variety
  - Realistic card distribution
  - No duplicate cards between players and board

### 2. Updated Problem Manager
- **File**: `src/utils/whoWinsProblemManager.ts`
- **Change**: Now imports from `dynamicProblemGenerator` instead of static `whoWinsProblems`
- **Result**: Same public API, but problems are generated on-the-fly

### 3. Maintained Compatibility
- **Data Structure**: All existing `WhoWinsProblem` interfaces remain identical
- **UI Components**: No changes needed to `ProblemDisplay`, `HandSelectionGrid`, etc.
- **Problem IDs**: Now use format `"ww-dynamic-001"`, `"ww-dynamic-002"`, etc.

## How It Works

1. **Deck Creation**: Standard 52-card deck with ranks A-K-Q-J-T-9-8-7-6-5-4-3-2 and suits h-s-d-c
2. **Shuffling**: Fisher-Yates shuffle algorithm for proper randomization
3. **Dealing**: 
   - 2 cards to each of 6 players (12 cards total)
   - 5 community cards to the board
4. **Validation**: Ensures no duplicate cards between players and board
5. **Problem Generation**: Creates problem object matching existing structure

## Technical Details

- **Card Format**: Maintains existing string format (`'Ah'`, `'Ks'`, etc.)
- **Player Count**: Configurable (currently set to 6 players)
- **Board Size**: Always 5 community cards
- **Randomization**: Uses `Math.random()` for shuffling

## Benefits

- **Educational Value**: Players see realistic poker situations
- **Infinite Practice**: No more repetitive problems
- **Realistic Scenarios**: Cards are actually dealt like in real poker
- **Easy Maintenance**: No need to manually create new problems
- **Scalable**: Can easily adjust player count, board size, etc.

## Future Enhancements

- **Difficulty Levels**: Generate problems with specific hand types
- **Player Count**: Make number of players configurable
- **Board States**: Generate flop, turn, or river scenarios
- **Hand Types**: Focus on specific poker hand categories

## Testing

The system has been tested to ensure:
- No duplicate cards between players and board
- Proper card format validation
- Correct problem structure generation
- Seamless integration with existing UI components
- Proper winner determination using pokersolver

---

## ⚠️ Known Issues

**Hand Evaluator Bugs**: We are currently working through some edge cases and bugs in the hand evaluation logic. While the basic functionality works, there may be scenarios where the winner determination is not completely accurate. We are actively debugging and improving the pokersolver integration to ensure 100% accuracy across all poker scenarios.

## Bug Fixes

### Winner Determination Logic (Fixed)
- **Issue**: Previous logic incorrectly used `Hand.winners()` and tried to match `cardPool` arrays
- **Problem**: This approach failed to properly identify which specific player hands were winners
- **Solution**: 
  - Compare hand ranks directly to find highest rank
  - For ties, use `Hand.winners()` to properly rank hands of the same type
  - Correctly handle scenarios where players have same rank but different hand descriptions
  - Properly distinguish between true ties and different hands of same rank
- **Result**: Accurate winner determination for all poker scenarios including proper tie detection
