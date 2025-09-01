# Hand vs Range Implementation Plan

## Overview
Create a new "Hand vs Range" page that follows the same pattern as the existing "Hand vs Hand" page, but allows the villain to have a range of hands displayed using the RangeGrid component. The page will use a fixed range (Open Raise LJ) for simplicity and integrate with the existing equity calculation system from the lib utilities.

## Requirements
1. Function similarly to the existing hand vs hand page
2. Display villain range using RangeGrid.tsx component with the LJ Open Raise range
3. Calculate equity correctly using the existing lib utilities
4. Add active links to homepage and navigation
5. Maintain consistent UI/UX with existing pages

## Implementation Tasks

### 1. Create Types and Interfaces
**File:** `src/types/handVsRange.ts`
- Define `HandVsRangeScenario` interface (similar to HandVsHandScenario but with range instead of second hand)
- Define `HandVsRangeResult` interface for equity results
- Define `HandVsRangeSettings` interface for configuration
- Define `HandVsRangeSession` interface for practice session state
- Define utility types for range selection and display

### 2. Create Equity Calculation Utility
**File:** `src/utils/handVsRangeEquity.ts`
- Implement `calculateHandVsRangeEquity` function that:
  - Takes hero hand, villain range (from rangeData), and board
  - Converts range to combos using `descriptorToHands` and `handsToCombos`
  - Uses the existing `calculateHandRangeEquity` from lib/equity_utils.ts
  - Returns formatted equity results for UI display
- Add helper functions for range processing and result formatting
- Include conversion utility to go from rangeData format to lib format

### 3. Create Range Conversion Utility
**File:** `src/utils/rangeConverter.ts`
- Implement `convertRangeSelectionToCombos` function to bridge format gap
- Convert from rangeData format (hand arrays) to lib format (Array<Combo>)
- Handle filtering by action type (raise/call vs fold)
- Use existing lib functions: `descriptorToHands` and `handsToCombos`

### 4. Create Hand vs Range Page Component
**File:** `src/app/hand-vs-range/page.tsx`
- Create main page component following hand-vs-hand pattern
- Use fixed LJ Open Raise range from rangeData
- Include state management for:
  - Current scenario (hero hand + fixed villain range + board)
  - User's equity estimate
  - Calculation results and display
  - Problem progression
- Integrate with RangeGrid for villain range display
- Include equity slider and result display components

### 5. Create Range Display Component
**File:** `src/components/VillainRangeDisplay.tsx`
- Wrapper component around RangeGrid specifically for villain range display
- Convert LJ Open Raise range to RangeGrid format (hand->action mapping)
- Add range statistics display (number of combos, range percentage)
- Display range in 'readonly' mode

### 6. Update Navigation Links
**Files:** 
- `src/app/page.tsx` - Update homepage to make Hand vs Range link active
- `src/components/Header.tsx` - Update navigation menu to make Hand vs Range link active

### 7. Integration and Testing
- Test equity calculations against known scenarios
- Verify range display and interaction
- Ensure consistent UI/UX with existing pages
- Test performance with large ranges

## Technical Implementation Details

### Fixed Range Usage
- Use LJ Open Raise range from rangeData: `rangeData.open_raises.ranges.lj.range.raise`

### Range to Combos Conversion Flow
```typescript
// Convert LJ Open Raise range to combos for equity calculation
LJ Range (string[]) 
  → Join with commas: hands.join(', ')
  → descriptorToHands(descriptor) 
  → handsToCombos(hands, new Map()) 
  → Array<Combo> for equity calculation
```

### Equity Calculation Integration
```typescript
// Use existing lib utilities for accurate calculations
const ljRange = rangeData.open_raises.ranges.lj.range.raise;
const villainCombos = convertRangeArrayToCombos(ljRange);
const equity = calculateHandRangeEquity(heroHand, villainCombos, board);
const formattedResult = formatEquityResult(equity);
```

### Range Display Strategy
- Convert LJ range to RangeGrid format: `{ "AA": "raise", "KK": "raise", ... }`
- Use RangeGrid in 'readonly' mode for villain range display
- Color-code hands by action (raise=red for all LJ hands, fold=gray for others)
- Show range statistics (41 combos, ~16.6% of all hands)

### Performance Considerations
- LJ range has ~41 hands which expands to reasonable number of combos
- Use exact calculations since range size is manageable
- Implement loading states for calculations
- Cache results for repeated scenarios with same hero hand

## File Structure
```
src/
├── app/
│   └── hand-vs-range/
│       └── page.tsx                    # Main page component
├── types/
│   └── handVsRange.ts                  # Type definitions
├── utils/
│   ├── handVsRangeEquity.ts           # Equity calculation utilities
│   └── rangeConverter.ts              # Range format conversion utilities
└── components/
    └── VillainRangeDisplay.tsx        # Range display component
```

## Dependencies
- Existing lib utilities (equity_utils.ts, range_utils.ts, descriptor.ts)
- RangeGrid component
- Existing UI components (EquitySlider, HandDisplay, etc.)
- Existing type definitions from lib/models.ts
- rangeData.ts for the LJ Open Raise range

## Success Criteria
1. Page loads and functions without errors
2. Equity calculations are accurate (verified against known scenarios)
3. LJ range displays correctly in RangeGrid
4. Performance is acceptable for the fixed range size
5. UI/UX is consistent with existing pages
6. Navigation links are properly updated and functional
7. Page handles edge cases gracefully (invalid hero hands, board conflicts)

## Detailed Task Breakdown

### Relevant Files

- `src/types/handVsRange.ts` - Type definitions for hand vs range scenarios, results, and settings
- `src/utils/handVsRangeEquity.ts` - Equity calculation utilities for hand vs range scenarios
- `src/utils/rangeConverter.ts` - Range format conversion utilities
- `src/app/hand-vs-range/page.tsx` - Main page component for hand vs range practice
- `src/components/VillainRangeDisplay.tsx` - Range display component wrapper for RangeGrid
- `src/app/page.tsx` - Homepage navigation updates
- `src/components/Header.tsx` - Header navigation updates

### Tasks

- [x] 1.0 Create Type Definitions and Interfaces
  - [x] 1.1 Create `HandVsRangeScenario` interface with hero hand, villain range, and board properties
  - [x] 1.2 Create `HandVsRangeResult` interface for equity calculation results
  - [x] 1.3 Create `HandVsRangeSettings` interface for page configuration options
  - [x] 1.4 Create `HandVsRangeSession` interface for practice session state management
  - [x] 1.5 Create utility types for range selection and display formatting

- [x] 2.0 Implement Equity Calculation Utilities
  - [x] 2.1 Create `calculateHandVsRangeEquity` function that takes hero hand, villain range, and board
  - [x] 2.2 Implement range to combos conversion using existing lib utilities
  - [x] 2.3 Integrate with `calculateHandRangeEquity` from lib/equity_utils.ts
  - [x] 2.4 Add helper functions for range processing and result formatting
  - [x] 2.5 Create conversion utility to bridge rangeData format to lib format

- [x] 3.0 Create Range Conversion Utilities
  - [x] 3.1 Implement `convertRangeSelectionToCombos` function to handle format conversion
  - [x] 3.2 Convert from rangeData format (hand arrays) to lib format (Array<Combo>)
  - [x] 3.3 Handle filtering by action type (raise/call vs fold)
  - [x] 3.4 Integrate with existing `descriptorToHands` and `handsToCombos` functions

- [x] 4.0 Build Hand vs Range Page Component
  - [x] 4.1 Create main page component following hand-vs-hand pattern
  - [x] 4.2 Implement state management for current scenario (hero hand + fixed villain range + board)
  - [x] 4.3 Add state for user's equity estimate and calculation results
  - [x] 4.4 Integrate with RangeGrid for villain range display
  - [x] 4.5 Include equity slider and result display components
  - [x] 4.6 Add problem progression functionality

- [x] 5.0 Create Range Display Components
  - [x] 5.1 Create `VillainRangeDisplay` wrapper component around RangeGrid
  - [x] 5.2 Convert LJ Open Raise range to RangeGrid format (hand->action mapping)
  - [x] 5.3 Add range statistics display (number of combos, range percentage)
  - [x] 5.4 Implement 'readonly' mode for villain range display
  - [x] 5.5 Add color coding for hands by action (raise=red, fold=gray)

- [x] 6.0 Add Range Selection Feature
  - [x] 6.1 Add category and range selection dropdowns similar to range study page
  - [x] 6.2 Implement dynamic range loading based on user selection
  - [x] 6.3 Update villain range display to show selected range name
  - [x] 6.4 Ensure range changes trigger new scenario generation
  - [x] 6.5 Maintain consistent UI/UX with range study page

- [ ] 7.0 Update Navigation and Integration
  - [ ] 7.1 Update homepage (`src/app/page.tsx`) to include Hand vs Range link
  - [ ] 7.2 Update header navigation (`src/components/Header.tsx`) to include Hand vs Range link
  - [ ] 7.3 Ensure proper routing and navigation state management
  - [ ] 7.4 Test navigation links and page transitions
  - [ ] 7.5 Verify Hand vs Range link appears on homepage navigation grid
  - [ ] 7.6 Verify Hand vs Range link appears in header navigation menu
  - [ ] 7.7 Test that Hand vs Range link routes to `/hand-vs-range` page
