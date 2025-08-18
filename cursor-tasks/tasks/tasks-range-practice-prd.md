## Relevant Files

- `src/app/range-study/page.tsx` - Range study page component with range selection and display
- `src/app/range-practice/page.tsx` - Range testing page component for recreating ranges with interactive grid and scoring
- `src/app/hand-practice/page.tsx` - Hand practice page component for individual hand decisions
- `src/components/RangeGrid.tsx` - 13x13 poker range grid component for displaying and interacting with ranges (no X/Y axis labels)
- `src/components/Header.tsx` - Header component with navigation menu (no range selection functionality)
- `src/components/RangeActionSelector.tsx` - Action selection component for raise/call/fold buttons
- `src/components/HandPracticeRow.tsx` - Component for displaying range rows in hand practice mode
- `src/data/rangeData.ts` - Range data structure and Open Raises category data
- `src/utils/rangeUtils.ts` - Utility functions for range calculations, hand generation, and scoring
- `src/utils/rangeProblemManager.ts` - Problem manager for range testing and hand practice modes
- `src/types/rangeTypes.ts` - TypeScript type definitions for range practice features (PokerRange, RangeData, Category, HandPracticeQuestion, etc.)
- `src/styles/range-practice.css` - Specific styles for range practice components (if needed beyond globals)

### Notes

- Reuse existing components like Header, PokerCard, and navigation patterns
- Follow existing color scheme: red for raise, blue for call, gray for fold
- Maintain mobile-first responsive design with touch-friendly interactions
- Integrate with existing routing structure: `/range-study/`, `/range-practice/`, `/hand-practice/`
- **IMPORTANT**: Range selection dropdowns are NEVER to be added to the Header component - range selection only exists on individual range pages

## Tasks

- [ ] 1.0 Set Up Range Practice Foundation and Data Structure
  - [x] 1.1 Create TypeScript type definitions in `src/types/rangeTypes.ts` for PokerRange, RangeData, Category, and HandPracticeQuestion interfaces
  - [x] 1.2 Extract and adapt Open Raises data from prototype script.js into `src/data/rangeData.ts` with proper TypeScript structure
  - [x] 1.3 Create utility functions in `src/utils/rangeUtils.ts` for hand matrix generation, hand action lookup, and scoring calculations
  - [x] 1.4 Create shared RangeGrid component in `src/components/RangeGrid.tsx` for 13x13 poker range display with proper hand labeling

- [x] 2.0 Implement Range Study Mode
  - [x] 2.1 Create range study page at `src/app/range-study/page.tsx` with Header integration and range selection
  - [x] 2.2 ~~Implement range selection dropdown in Header component to navigate between LJ, HJ, CO, BTN ranges~~ (REMOVED - range selection only on range-study page, never to be added to Header again)
  - [x] 2.3 Configure RangeGrid component for read-only study mode with color-coded actions (red/blue/gray)
  - [x] 2.4 Add range display with proper visual hierarchy and hand positioning (pairs on diagonal, suited above, offsuit below)
  - [x] 2.5 Ensure responsive design works across desktop and mobile devices

- [x] 3.0 Implement Range Testing Mode with Interactive Grid
  - [x] 3.1 Create range testing page at `src/app/range-practice/page.tsx` with empty grid and action selection
  - [x] 3.2 Implement RangeActionSelector component with raise/call buttons and visual selection state
  - [x] 3.3 Add paint-first interaction logic: select action first, then click/drag to paint hands
  - [x] 3.4 Implement click and drag functionality for efficient multi-hand selection
  - [x] 3.5 Add toggle logic: clicking same action on a hand reverts it to fold
  - [x] 3.6 Create submit functionality with accuracy scoring and visual feedback (green/red indicators)
  - [x] 3.7 Implement clear function to reset grid and start over
  - [x] 3.8 Add mobile touch support with disabled scrolling during range practice

- [x] 4.0 Implement Hand Practice Mode
  - [x] 4.1 Create hand practice page at `src/app/hand-practice/page.tsx` with random hand display
  - [x] 4.2 Implement random two-card hand generation using existing card components (reuse PokerCard styling)
  - [x] 4.3 Create HandPracticeRow component for each range (LJ, HJ, CO, BTN, SB, BB) with action selection
  - [x] 4.4 Add action selection interface (raise/call/fold buttons) for each range row
  - [x] 4.5 Implement answer checking logic against correct range actions
  - [x] 4.6 Add WhoWins-style results display with green highlighting for correct actions
  - [x] 4.7 Create "Next Hand" functionality to generate new random hands for continued practice
  - [x] 4.8 Integrate with existing NextProblemButton component pattern

- [ ] 5.0 Mobile Optimization and Touch Interactions
  - [ ] 5.1 Implement touch-friendly grid cells with minimum 44px touch targets
  - [ ] 5.2 Optimize grid scaling and cell spacing for different screen sizes
  - [ ] 5.3 Ensure action buttons remain accessible and properly sized on mobile
  - [ ] 5.4 Test and refine touch drag functionality for painting multiple hands
