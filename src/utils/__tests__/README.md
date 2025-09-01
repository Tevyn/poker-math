# Unit Tests for Poker Math Utilities

This directory contains unit tests for the poker math utilities using Node.js's built-in test runner.

## Running Tests

```bash
npm test
```

## Test Files

- **`simpleRandomHands.test.ts`** - Tests for the random hand generation utilities
  - Deck generation and shuffling
  - Card dealing with exclusions
  - Random hand and board generation
  - Scenario generation

- **`handVsHandEquity.test.ts`** - Tests for hand vs hand equity calculations
  - Exact equity calculations
  - Monte Carlo approximations
  - Percentage formatting
  - Integration tests with known hand matchups

## Test Framework

These tests use Node.js's built-in test runner (available in Node 18+) with TypeScript support via the `--experimental-strip-types` flag. This approach:

- Requires no additional dependencies
- Provides fast test execution
- Offers clean, readable test output
- Supports TypeScript natively

## Test Coverage

The tests cover:
- ✅ Core functionality of all utility functions
- ✅ Edge cases and error conditions
- ✅ Known poker hand matchup results
- ✅ Mathematical accuracy of equity calculations
- ✅ Proper handling of board states (preflop, flop, turn, river)

## Adding New Tests

When adding new utilities, create corresponding test files following the naming pattern `*.test.ts` and place them in this directory.
