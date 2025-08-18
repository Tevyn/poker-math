# Poker Equity Estimation PRD

## Problem Types

### 1. Hand vs. Hand
Two specific hands shown. User estimates their equity percentage.
- Example: AA:82% vs KK:18% (numbers may be wrong)

### 2. Hand vs. Range  
Specific hand vs opponent's range grid. User estimates equity against the highlighted range.
- Example: KdKc:63% vs top-15%-range:37%

### 3. Range vs. Range
Two range grids. User estimates left and right ranges' equity vs each other.

### 4. Range Construction
User is presented with a constructed range. User enters the % form of that range

## Interface

### Estimation Mechanic
- Estimate slider (0-100%)
- Drag to estimate within ±5% of the selected point
- There's some visual indication of the top ad bottom of the ±5% when the user is dragging the slider
- Click submit to submit
- Show actual value after submission
- If it's within the ±5% that the user selected, show correct
- Next button to proceed

### Visual Design
- Minimal background
- Cards clearly and minimally rendered with suits
- Range grids: 13x13 matrix with highlighted cells
- Large number display during estimation
- No decorative elements

## Functional Requirements
1. The system must integrate with a third-party poker equity calculation library for accurate percentage calculations
2. The system must load problems from a pre-defined dataset (no dynamic generation required)
3. The system must display one problem at a time with a "Next Problem" button to advance
4. The system must provide a drag slider (0-100%) for equity estimation input
5. The system must disable the submit button until user makes an estimation via the slider
6. The system must show the correct equity percentage after user submits their estimate
7. The system must indicate whether the user's estimate falls within ±5% of the correct answer
8. The system must display poker hands as card graphics with suits clearly visible
9. The system must display range grids as 13x13 matrices with pre-highlighted cells (read-only)
10. The system must be responsive across desktop, tablet, and mobile screen sizes

## Technical Considerations
- **Poker Equity Library**: Need to research and select a JavaScript poker equity calculation library (candidates to evaluate: poker-evaluator, pokersolver, or similar npm packages)
- **Problem Data Structure**: Pre-defined problems will be stored as JSON/JavaScript objects containing hand/range data and correct equity values
- **No Persistence**: No database or local storage required - stateless session-based operation
- **Performance**: Equity calculations handled by library, UI should prioritize smooth slider interactions