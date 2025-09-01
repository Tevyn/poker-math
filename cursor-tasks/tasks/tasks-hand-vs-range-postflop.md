## Relevant Files

- `src/app/hand-vs-range/page.tsx` - Current Hand vs. Range page that needs to be renamed to Preflop
- `src/app/hand-vs-range-postflop/page.tsx` - New postflop page to be created
- `src/components/BoardDisplay.tsx` - Board display component to be extended for 3-5 cards
- `src/types/handVsRange.ts` - Types that may need extension for postflop scenarios
- `src/utils/handVsRangeEquity.ts` - Equity calculation utility (already supports board cards)
- `src/app/layout.tsx` - Main layout for navigation updates

### Notes

- The existing handVsRangeEquity utility already supports board cards, so no changes needed there
- BoardDisplay component currently works but may need styling adjustments for different board sizes
- Reuse as much as possible from the existing preflop implementation
- Focus on minimal UI changes using existing components

## Tasks

- [x] 1.0 Rename current hand-vs-range page to "Hand vs. Range: Preflop"
  - [x] 1.1 Update page title and folder name in the existing hand-vs-range/page.tsx
  - [x] 1.2 Update navigation/routing if needed to reflect the new name

- [x] 2.0 Create new "Hand vs. Range: Postflop" page with board selection
  - [x] 2.1 Create new directory `src/app/hand-vs-range-postflop/`
  - [x] 2.2 Copy existing hand-vs-range page as starting template
  - [x] 2.3 Add board size selection UI (Flop=3, Turn=4, River=5 cards)
  - [x] 2.4 Integrate board generation into scenario creation
  - [x] 2.5 Update page title to "Hand vs. Range: Postflop"

- [x] 3.0 Extend BoardDisplay component to support 3-5 cards
  - [x] 3.1 Review current BoardDisplay implementation for any needed improvements
  - [x] 3.2 Test BoardDisplay with different card counts (3, 4, 5)
  - [x] 3.3 Adjust styling if needed for proper display of varying board sizes

- [x] 4.0 Implement postflop equity calculation integration
  - [x] 4.1 Update scenario generation to include random board cards
  - [x] 4.2 Ensure equity calculation properly uses board cards (already implemented)
  - [x] 4.3 Test equity calculations with different board sizes

- [x] 5.0 Add navigation for postflip
  - [x] 5.1 Update main navigation to include both preflop and postflop links
  - [x] 5.2 Remove the homescreen card and nav item from range vs range

