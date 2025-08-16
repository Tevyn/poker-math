# Poker Equity Estimation - Task List

## Relevant Files

- `package.json` - Project dependencies and scripts configuration (updated with poker-odds-calculator)
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `src/app/layout.tsx` - Root layout with metadata and fonts
- `src/app/page.tsx` - Main landing page with poker equity app structure
- `src/app/globals.css` - Global styles and Tailwind CSS configuration
- `src/app/favicon.ico` - Application favicon
- `src/utils/pokerEquity.ts` - Poker equity calculation wrapper functions and utilities
- `src/types/pokerProblems.ts` - Type definitions for poker problems and results
- `src/data/sampleProblems.ts` - Sample dataset of hand vs. hand problems
- `src/utils/problemManager.ts` - Problem loading and management system
- `src/components/ProblemDisplay.tsx` - Problem display component for two hands
- `src/components/EquitySlider.tsx` - Equity estimation slider with ±5% precision and visual feedback
- `src/components/SubmitButton.tsx` - Submit button for equity estimates
- `src/components/ResultDisplay.tsx` - Result display showing estimate accuracy and feedback
- `src/components/NextProblemButton.tsx` - Navigation button for moving to next problem
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind
- `tailwind.config.ts` - Tailwind CSS configuration
- `next-env.d.ts` - Next.js TypeScript environment types

## Tasks

- [x] 1.0 Project Setup and Website Skeleton
  - [x] 1.1 Initialize new React/Next.js project with TypeScript
  - [x] 1.2 Set up basic project structure and dependencies
  - [x] 1.3 Create basic layout and navigation components
  - [x] 1.4 Set up basic styling system (CSS modules or Tailwind)
  - [x] 1.5 Create main page structure and routing
- [x] 2.0 Core Poker Equity Calculation Integration
  - [x] 2.1 Install and configure poker-odds-calculator npm package
  - [x] 2.2 Create wrapper functions for hand vs. hand equity calculations
  - [x] 2.3 Test equity calculations with known hand combinations
- [x] 3.0 Hand vs. Hand Problem Implementation
  - [x] 3.1 Design data structure for hand vs. hand problems
  - [x] 3.2 Create sample dataset of hand vs. hand problems with correct equity values
  - [x] 3.3 Implement problem loading and management system
  - [x] 3.4 Create problem display logic for two specific hands
- [x] 4.0 User Interface Components for Hand vs. Hand
  - [x] 4.1 Create card component with suit visualization
  - [x] 4.2 Create hand display component (two cards side by side)
  - [x] 4.3 Implement equity estimation slider (0-100% with ±5% precision)
  - [x] 4.4 Create submit button and result display components
  - [x] 4.5 Implement next problem button and navigation
- [ ] 5.0 Application Logic and State Management for Hand vs. Hand
  - [ ] 5.1 Implement problem state management (current problem, user estimate, result)
  - [ ] 5.2 Create estimation validation logic (±5% tolerance)
  - [ ] 5.3 Implement problem progression and navigation
  - [ ] 5.4 Add basic error handling and edge cases
  - [ ] 5.5 Integrate all components into working hand vs. hand flow

## Notes

- This implementation focuses solely on the "Hand vs. Hand" problem type to establish a solid foundation
- Using poker-odds-calculator npm package for accurate equity calculations
- The ±5% tolerance for correct answers should be clearly communicated to users
- Card suits should be displayed using Unicode symbols or SVG icons for clarity
- The slider should provide visual feedback when dragging to show the ±5% range
- All components should be responsive and work well on mobile devices
- Unit tests should be written alongside component development for better code quality
- The problem dataset should include a variety of hand combinations with known equity values for testing
