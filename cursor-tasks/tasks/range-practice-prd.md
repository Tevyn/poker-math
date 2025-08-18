# Range Practice & Hand Practice PRD

## Overview

This PRD outlines the implementation of interactive range practice and hand practice features for the poker math application. These features will integrate seamlessly with the existing UI patterns, components, utils, and minimalist design while providing comprehensive range study and testing capabilities.

## Problem Types

### 1. Range Study
Users can view and study pre-defined poker ranges in a 13x13 grid layout.
- Display ranges with color-coded actions: Raise (red), Call (blue), Fold (gray)
- Navigate between different ranges within the Open Raises category
- Read-only mode for studying
- Reuse existing Header component and navigation patterns

### 2. Range Testing
Users test their knowledge by reconstructing ranges from memory.
- Present empty 13x13 grid for specific poker situation
- User selects action (raise/call only) then clicks/drags to paint hands
- Clicking a hand with the same action reverts it to fold
- Submit for scoring with accuracy percentage and visual feedback
- Show correct/incorrect markers on each cell after submission, except for correctly folded hands, which will remain empty for visual clarity

### 3. Hand Practice
Users practice decision-making with randomly generated hands against multiple ranges.
- User selects a category (for now only Open Raises)
- Display two random cards using existing card display patterns
- Present rows for each range in the category (for Open Raises, this will be LJ, HJ, CO, BTN, SB, BB)
- User selects correct action (raise/call/fold) for each range
- Show results by highlighting correct actions in green (similar to WhoWins pattern)

## User Interface Design

### Reuse Existing Components
- **Header Component**: Reuse existing header with dropdown for range selection
- **Navigation**: Follow existing navigation patterns and layout
- **Minimalist Design**: Maintain clean, focused presentation without decorative elements

### Grid Layout (Primary View)
- **13x13 Matrix**: Standard poker range grid with hands arranged as:
  - Pocket pairs on diagonal (AA, KK, QQ, etc.)
  - Suited hands above diagonal (AKs, AQs, etc.)
  - Offsuit hands below diagonal (AKo, AQo, etc.)
- **Color Coding**:
  - Red: Raise actions
  - Blue: Call actions  
  - Gray: Fold actions (default)
- **Interactive Elements**: Click and drag functionality to select multiple hands

### Hand Display
- **Reuse Card Components**: Use existing card display patterns from other modes
- **Card Visualization**: Two poker cards with proper suit symbols and colors
  - Consistent styling with existing card displays

### Action Selection
- **Button Interface**: Raise/Call buttons with visual selection state
- **Paint-First Interaction**: User selects action first, then paints onto grid
- **Toggle Logic**: Clicking same action removes it (sets to fold)

## Mobile Interaction Design

### Simplified Mobile Approach
Based on your requirements for a streamlined mobile experience:

- **Disabled Scrolling**: When in range practice mode, page scrolling is disabled
- **Paint-First Interaction**: User selects action (raise/call) first, then paints onto grid
- **Touch-Friendly Cells**: Ensure adequate touch target sizes (44px minimum)
- **Clear Visual Feedback**: Immediate visual response to touch interactions
- **Consistent with Desktop**: Same interaction pattern across all devices

## Functional Requirements

### Core Features
1. **Grid Rendering**: Display 13x13 poker range grid with proper hand labels
2. **Action Selection**: Allow users to assign raise/call/fold actions to hands
3. **Drag Functionality**: Click and drag to select multiple hands efficiently
4. **Mobile Touch Support**: Disabled scrolling with paint-first interaction
5. **Range Data Management**: Use Open Raises data from prototype's initializeDefaultRanges
6. **Scoring System**: Calculate accuracy percentage and provide feedback
7. **Hand Generation**: Generate random two-card poker hands
8. **Multi-Range Practice**: Present all ranges in category for single hand evaluation

### Study Mode
1. **Range Navigation**: Reuse existing header dropdown patterns for range selection
2. **Visual Display**: Show optimal ranges with color-coded actions (red/blue/gray)
3. **Open Raises Category**: Initial category with LJ, HJ, CO, BTN, SB, BB ranges
4. **Read-Only Grid**: Non-interactive display for studying
5. **Extensible Structure**: Design to support future categories

### Testing Mode
1. **Empty Grid**: Present blank 13x13 grid for user input
2. **Action-First Painting**: User selects raise/call, then clicks/drags to paint hands
3. **Toggle Logic**: Clicking same action reverts hand to fold
4. **Submit Function**: Calculate and display accuracy score
5. **Visual Feedback**: Show correct/incorrect indicators on each cell
6. **Clear Function**: Reset grid to start over

### Hand Practice Mode
1. **Random Hand Display**: Generate and show two random cards using existing card components
2. **Category Selection**: Choose Open Raises category (extensible for future categories)
3. **Range Rows**: Display row for each range (LJ, HJ, CO, BTN, SB, BB)
4. **Action Selection**: User selects raise/call/fold for each range
5. **WhoWins-Style Results**: Highlight correct actions in green instead of text feedback
6. **Next Hand**: Generate new random hand for continued practice
7. **No Running Stats**: Remove statistics tracking to match existing app patterns

## Technical Implementation

### Data Structure
```typescript
interface PokerRange {
  raise?: string[];  // ["AA", "KK", "AKs", ...]
  call?: string[];   // ["QQ", "JJ", "AQs", ...]
  // fold is implicit (hands not in raise/call arrays)
}

interface RangeData {
  id: string;
  name: string;
  range: PokerRange;
}

interface Category {
  name: string;
  ranges: Record<string, RangeData>;
}

interface HandPracticeQuestion {
  hand: string;        // "AKs"
  card1: string;       // "A♠"
  card2: string;       // "K♦"
  ranges: RangeData[]; // All ranges in selected category
}
```

### Initial Data Source
- **Use Prototype Data**: Extract Open Raises category from initializeDefaultRanges in script.js
- **Range Structure**: LJ, HJ, CO, BTN, SB, BB with their respective ranges
- **Extensible Design**: Structure to easily add more categories in the future

### Mobile Implementation
```typescript
interface RangePracticeState {
  selectedAction: 'raise' | 'call';
  userSelections: Record<string, 'raise' | 'call'>;
  scrollingDisabled: boolean;
  
  handleCellClick(hand: string): void;
  handleCellDrag(hand: string): void;
  toggleAction(hand: string): void;
}
```

### Component Integration
- **Reuse Existing Components**: Header, navigation, card displays, buttons
- **Consistent Styling**: Match existing color schemes and typography
- **Responsive Design**: Adapt to existing responsive breakpoints
- **Accessibility**: Follow existing accessibility patterns

## User Experience Flow

### Study Flow
1. User clicks Range Study card on dashboard
2. Header dropdown shows Open Raises ranges (LJ, HJ, CO, BTN, SB, BB)
3. Grid displays optimal range with color-coded actions (red/blue/gray)
4. User can switch between different ranges to study
5. Read-only grid for pure study experience

### Testing Flow
1. User clicks Range Practice card on dashboard
2. System presents specific range with empty grid
3. User selects action (raise/call) from action buttons
4. User clicks/drags to paint selected action onto hands
5. Clicking same action on a hand reverts it to fold
6. User clicks "Submit" to check answers
7. System shows accuracy score with green/red indicators on each cell
8. User can clear and try again or select new range

### Hand Practice Flow
1. User clicks Hand Practice card on dashboard
2. System generates random two-card hand using existing card components
3. Interface shows rows for each range in Open Raises (LJ, HJ, CO, BTN, SB, BB)
4. User selects raise/call/fold action for each range row
5. User clicks "Check Answers" to see results
6. System highlights correct actions in green (WhoWins style)
7. User clicks "Next Hand" to continue practice
8. No running statistics - focus on immediate feedback

## Mobile-Specific Considerations

### Simplified Mobile Experience
- **Disabled Scrolling**: Page scrolling disabled during range practice
- **Touch Target Sizes**: Minimum 44px x 44px for all interactive elements
- **Grid Cells**: Scale appropriately for screen size while maintaining usability
- **Action-First Flow**: Same paint-first interaction as desktop

### Responsive Layout
- **Consistent Experience**: Same interaction patterns across all devices
- **Adaptive Grid**: Adjust grid size and cell spacing for different screen sizes
- **Button Layout**: Maintain action button accessibility on mobile
- **Typography**: Ensure hand labels remain readable at all sizes

## Design Principles

### Reuse Existing Patterns
- **Component Consistency**: Use existing Header, navigation, and card components
- **Color Scheme**: Maintain existing color palette with red/blue/gray for actions
- **Minimalist Approach**: Clean, focused presentation without unnecessary elements
- **Interaction Consistency**: Follow established patterns from WhoWins and other modes

### Extensible Architecture
- **Category Structure**: Design to easily add more categories beyond Open Raises
- **Range Management**: Flexible system for managing range data
- **Component Modularity**: Reusable components for different practice modes

## Implementation Priority
1. **Phase 1**: Study mode with Open Raises ranges using existing components
2. **Phase 2**: Range testing mode with paint-first interaction
3. **Phase 3**: Hand practice mode with WhoWins-style feedback
4. **Phase 4**: Mobile optimization and touch interaction refinement
5. **Phase 5**: Additional categories and advanced features

## Success Metrics
- **User Engagement**: Time spent in range practice modes
- **Learning Effectiveness**: Improvement in testing mode accuracy
- **Feature Adoption**: Usage rates across study/test/practice modes
- **Mobile Usability**: Successful interaction completion rates on mobile devices
