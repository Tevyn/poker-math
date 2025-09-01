## Relevant Files

- `lib/equity_utils.ts` - Core equity calculation functions from the new library
- `lib/evaluation_utils.ts` - Hand evaluation engine and card conversion utilities  
- `lib/models.ts` - TypeScript type definitions for Card, Combo, Equity
- `lib/constants.ts` - Poker constants and hand rankings
- `src/app/who-wins/page.tsx` - Who Wins page completely rebuilt using new lib utilities (COMPLETED)
- `src/utils/handVsHandEquity.ts` - REUSE: Hand vs hand equity calculator (ALREADY CREATED)
- `src/utils/simpleRandomHands.ts` - REUSE: Random hand generator using lib deck shuffling (ALREADY CREATED)
- `src/utils/whoWinsEquity.ts` - NEW: Multi-hand equity calculator for who-wins scenarios (CREATED)
- `src/utils/whoWinsScenarioGenerator.ts` - NEW: Random who-wins scenario generator using simpleRandomHands (CREATED)
- `src/types/whoWins.ts` - NEW: Type definitions for who-wins problems aligned with lib (CREATED)
- `src/components/PokerCard.tsx` - REUSE: Already updated to work with lib Card format
- `src/components/HandDisplay.tsx` - REUSE: Already updated to work with lib Card format
- `src/components/BoardDisplay.tsx` - Update to work with lib Card format directly
- `src/components/HandSelectionGrid.tsx` - Update to work with lib Card format and new types
- `src/components/PlayerHandCard.tsx` - Update to work with lib Card format directly
- `src/utils/__tests__/whoWinsEquity.test.ts` - Unit tests for multi-hand equity calculations

### Notes

- **REUSE EVERYTHING POSSIBLE** from hand-vs-hand migration (utilities, updated components)
- Focus on who-wins page using existing lib integration foundation
- Card format: lib native `Card = "As"` (already implemented)
- Multi-hand equity evaluation using lib's evaluation engine
- Replace WhoWinsProblemManager with simple random generation like hand-vs-hand

## Tasks

- [ ] 1.0 Create Who Wins specific utilities (reusing existing lib integration)
  - [x] 1.1 Create multi-hand equity calculator for who-wins scenarios (whoWinsEquity.ts)
  - [x] 1.2 Create new type definitions for who-wins problems aligned with lib (types/whoWins.ts)
  - [x] 1.3 Create random who-wins scenario generator using existing simpleRandomHands.ts
  - [ ] 1.4 Add unit tests for new who-wins utilities

- [x] 2.0 Update UI components for who-wins (reusing updated components where possible)
  - [x] 2.1 Update BoardDisplay component to work with lib Card format directly
- [x] 2.2 Update HandSelectionGrid to work with lib Card format and new types
- [x] 2.3 Update PlayerHandCard to work with lib Card format directly
  - [x] 2.4 Ensure all components work with native lib Card format (no parsing)

- [x] 3.0 Rebuild who-wins page using new utilities
  - [x] 3.1 Completely rewrite page.tsx using lib types natively
  - [x] 3.2 Remove dependencies on old WhoWinsProblemManager and complex problem system
- [x] 3.3 Use simple random scenario generation like hand-vs-hand page
  - [x] 3.4 Test full page functionality end-to-end
