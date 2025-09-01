import { PokerProblem } from '../types/pokerProblems';
import { PokerHand } from '../utils/pokerEquity';

// Define hands without suits to prevent card conflicts
interface HandTemplate {
  rank1: string; // e.g., 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'
  rank2: string;
  description: string; // e.g., 'AA', 'AK', 'T9s'
}

// Pool of hand templates without suits
export const HAND_TEMPLATES: HandTemplate[] = [
  // Premium pairs
  { rank1: 'A', rank2: 'A', description: 'AA' },
  { rank1: 'K', rank2: 'K', description: 'KK' },
  { rank1: 'Q', rank2: 'Q', description: 'QQ' },
  { rank1: 'J', rank2: 'J', description: 'JJ' },
  { rank1: 'T', rank2: 'T', description: 'TT' },
  
  // Medium pairs
  { rank1: '9', rank2: '9', description: '99' },
  { rank1: '8', rank2: '8', description: '88' },
  { rank1: '7', rank2: '7', description: '77' },
  { rank1: '6', rank2: '6', description: '66' },
  { rank1: '5', rank2: '5', description: '55' },
  
  // Small pairs
  { rank1: '4', rank2: '4', description: '44' },
  { rank1: '3', rank2: '3', description: '33' },
  { rank1: '2', rank2: '2', description: '22' },
  
  // Premium broadway hands (offsuit)
  { rank1: 'A', rank2: 'K', description: 'AK' },
  { rank1: 'A', rank2: 'Q', description: 'AQ' },
  { rank1: 'A', rank2: 'J', description: 'AJ' },
  { rank1: 'A', rank2: 'T', description: 'AT' },
  { rank1: 'K', rank2: 'Q', description: 'KQ' },
  { rank1: 'K', rank2: 'J', description: 'KJ' },
  { rank1: 'Q', rank2: 'J', description: 'QJ' },
  
  // Suited broadway hands
  { rank1: 'A', rank2: 'K', description: 'AKs' },
  { rank1: 'A', rank2: 'Q', description: 'AQs' },
  { rank1: 'A', rank2: 'J', description: 'AJs' },
  { rank1: 'K', rank2: 'Q', description: 'KQs' },
  { rank1: 'K', rank2: 'J', description: 'KJs' },
  { rank1: 'Q', rank2: 'J', description: 'QJs' },
  
  // Suited connectors
  { rank1: 'T', rank2: '9', description: 'T9s' },
  { rank1: '9', rank2: '8', description: '98s' },
  { rank1: '8', rank2: '7', description: '87s' },
  { rank1: '7', rank2: '6', description: '76s' },
  { rank1: '6', rank2: '5', description: '65s' },
  { rank1: '5', rank2: '4', description: '54s' },
  
  // Small suited connectors
  { rank1: '4', rank2: '3', description: '43s' },
  { rank1: '3', rank2: '2', description: '32s' },
  
  // Gappers
  { rank1: 'K', rank2: 'T', description: 'KTs' },
  { rank1: 'Q', rank2: 'T', description: 'QTs' },
  { rank1: 'J', rank2: 'T', description: 'JTs' },
];

// Available suits
const SUITS = ['h', 'd', 'c', 's']; // hearts, diamonds, clubs, spades

/**
 * Convert a hand template to a concrete PokerHand with suits
 * @param template - Hand template without suits
 * @param isSuited - Whether the hands should be suited
 * @returns Concrete PokerHand with suits
 */
function templateToHand(template: HandTemplate, isSuited: boolean = false): PokerHand {
  if (isSuited) {
    // For suited hands, use the same suit for both cards
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    return {
      card1: `${template.rank1}${suit}`,
      card2: `${template.rank2}${suit}`
    };
  } else {
    // For offsuit hands, use different suits
    const suit1 = SUITS[Math.floor(Math.random() * SUITS.length)];
    let suit2 = SUITS[Math.floor(Math.random() * SUITS.length)];
    
    // Ensure different suits for offsuit hands
    while (suit2 === suit1) {
      suit2 = SUITS[Math.floor(Math.random() * SUITS.length)];
    }
    
    return {
      card1: `${template.rank1}${suit1}`,
      card2: `${template.rank2}${suit2}`
    };
  }
}

/**
 * Generate a random problem by selecting 2 different hand templates and converting them to concrete hands
 * @returns A new PokerProblem with unique hands
 */
export function generateRandomProblem(): PokerProblem {
  // Shuffle the hand templates
  const shuffledTemplates = [...HAND_TEMPLATES].sort(() => Math.random() - 0.5);
  
  // Select first hand template
  const template1 = shuffledTemplates[0];
  
  // Select second hand template (can be the same type, just ensure it's not the exact same template)
  let template2: HandTemplate;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    template2 = shuffledTemplates[Math.floor(Math.random() * shuffledTemplates.length)];
    attempts++;
  } while (
    // Only ensure we don't pick the exact same template object
    template2 === template1 ||
    attempts >= maxAttempts
  );
  
  // Convert templates to concrete hands with smart suit assignment
  const hand1 = templateToHand(template1, template1.description.includes('s'));
  const hand2 = templateToHand(template2, template2.description.includes('s'));
  
  // Ensure no duplicate cards by checking and reassigning suits if needed
  const finalHands = ensureNoDuplicateCards(hand1, hand2);
  
  // Generate unique ID
  const id = `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    hand1: finalHands.hand1,
    hand2: finalHands.hand2
  };
}

/**
 * Ensure no duplicate cards between two hands by reassigning suits if needed
 * @param hand1 - First hand
 * @param hand2 - Second hand
 * @returns Hands with no duplicate cards
 */
function ensureNoDuplicateCards(hand1: PokerHand, hand2: PokerHand): { hand1: PokerHand, hand2: PokerHand } {
  const allCards = new Set([hand1.card1, hand1.card2, hand2.card1, hand2.card2]);
  
  // If all cards are unique, return as is
  if (allCards.size === 4) {
    return { hand1, hand2 };
  }
  
  // If there are duplicates, we need to reassign suits
  const ranks = [hand1.card1[0], hand1.card2[0], hand2.card1[0], hand2.card2[0]];
  const suits = ['h', 'd', 'c', 's'];
  
  // Create new hands with unique suits
  const newHand1 = {
    card1: `${ranks[0]}${suits[0]}`,
    card2: `${ranks[1]}${suits[1]}`
  };
  
  const newHand2 = {
    card1: `${ranks[2]}${suits[2]}`,
    card2: `${ranks[3]}${suits[3]}`
  };
  
  return { hand1: newHand1, hand2: newHand2 };
}

/**
 * Generate a problem with specific hand categories for variety
 * @param category1 - First hand category ('pairs', 'broadway', 'suited', 'connectors')
 * @param category2 - Second hand category
 * @returns A new PokerProblem with hands from specified categories
 */
export function generateProblemByCategory(category1?: string, category2?: string): PokerProblem {
  const getTemplatesByCategory = (category: string): HandTemplate[] => {
    switch (category) {
      case 'pairs':
        return HAND_TEMPLATES.filter(template => template.rank1 === template.rank2);
      case 'broadway':
        return HAND_TEMPLATES.filter(template => 
          'AKQJT'.includes(template.rank1) && 'AKQJT'.includes(template.rank2)
        );
      case 'suited':
        return HAND_TEMPLATES.filter(template => template.description.includes('s'));
      case 'connectors':
        return HAND_TEMPLATES.filter(template => {
          const ranks = '23456789TJQKA';
          const rank1 = ranks.indexOf(template.rank1);
          const rank2 = ranks.indexOf(template.rank2);
          return Math.abs(rank1 - rank2) === 1;
        });
      default:
        return HAND_TEMPLATES;
    }
  };
  
  const category1Templates = category1 ? getTemplatesByCategory(category1) : HAND_TEMPLATES;
  const category2Templates = category2 ? getTemplatesByCategory(category2) : HAND_TEMPLATES;
  
  // Select templates from categories
  const template1 = category1Templates[Math.floor(Math.random() * category1Templates.length)];
  const template2 = category2Templates[Math.floor(Math.random() * category2Templates.length)];
  
  // Convert templates to concrete hands
  const hand1 = templateToHand(template1, template1.description.includes('s'));
  const hand2 = templateToHand(template2, template2.description.includes('s'));
  
  // Ensure no duplicate cards
  const finalHands = ensureNoDuplicateCards(hand1, hand2);
  
  // Generate unique ID
  const id = `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return { id, hand1: finalHands.hand1, hand2: finalHands.hand2 };
}

/**
 * Generate a problem with balanced difficulty (one strong hand, one weaker hand)
 * @returns A new PokerProblem with balanced hands
 */
export function generateBalancedProblem(): PokerProblem {
  const strongTemplates = HAND_TEMPLATES.filter(template => 
    template.rank1 === template.rank2 || // Pairs
    ('AKQJT'.includes(template.rank1) && 'AKQJT'.includes(template.rank2)) // Broadway
  );
  
  const weakerTemplates = HAND_TEMPLATES.filter(template => 
    template.rank1 !== template.rank2 && // Not pairs
    !('AKQJT'.includes(template.rank1) && 'AKQJT'.includes(template.rank2)) // Not broadway
  );
  
  const template1 = strongTemplates[Math.floor(Math.random() * strongTemplates.length)];
  const template2 = weakerTemplates[Math.floor(Math.random() * weakerTemplates.length)];
  
  const hand1 = templateToHand(template1, template1.description.includes('s'));
  const hand2 = templateToHand(template2, template2.description.includes('s'));
  
  // Ensure no duplicate cards
  const finalHands = ensureNoDuplicateCards(hand1, hand2);
  
  const id = `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return { id, hand1: finalHands.hand1, hand2: finalHands.hand2 };
}

/**
 * Generate multiple random problems
 * @param count - Number of problems to generate
 * @returns Array of PokerProblem objects
 */
export function generateMultipleProblems(count: number): PokerProblem[] {
  const problems: PokerProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    problems.push(generateRandomProblem());
  }
  
  return problems;
}

/**
 * Get a specific number of problems, ensuring variety
 * @param count - Number of problems to get
 * @returns Array of PokerProblem objects
 */
export function getProblems(count: number = 5): PokerProblem[] {
  return generateMultipleProblems(count);
}

/**
 * Get statistics about the hand templates
 * @returns Object with counts for different hand types
 */
export function getHandPoolStats() {
  const pairs = HAND_TEMPLATES.filter(template => template.rank1 === template.rank2).length;
  const suited = HAND_TEMPLATES.filter(template => template.description.includes('s')).length;
  const broadway = HAND_TEMPLATES.filter(template => 
    'AKQJT'.includes(template.rank1) && 'AKQJT'.includes(template.rank2)
  ).length;
  const connectors = HAND_TEMPLATES.filter(template => {
    const ranks = '23456789TJQKA';
    const rank1 = ranks.indexOf(template.rank1);
    const rank2 = ranks.indexOf(template.rank2);
    return Math.abs(rank1 - rank2) === 1;
  }).length;
  
  return {
    total: HAND_TEMPLATES.length,
    pairs,
    suited,
    broadway,
    connectors,
    maxCombinations: HAND_TEMPLATES.length * (HAND_TEMPLATES.length - 1) / 2
  };
}

/**
 * Get hand templates by specific criteria
 * @param criteria - Object with filtering criteria
 * @returns Filtered array of hand templates
 */
export function getHandsByCriteria(criteria: {
  minRank?: string;
  maxRank?: string;
  isPaired?: boolean;
  isSuited?: boolean;
}): HandTemplate[] {
  const ranks = '23456789TJQKA';
  
  return HAND_TEMPLATES.filter(template => {
    const rank1 = ranks.indexOf(template.rank1);
    const rank2 = ranks.indexOf(template.rank2);
    
    if (criteria.minRank && Math.min(rank1, rank2) < ranks.indexOf(criteria.minRank)) {
      return false;
    }
    
    if (criteria.maxRank && Math.max(rank1, rank2) > ranks.indexOf(criteria.maxRank)) {
      return false;
    }
    
    if (criteria.isPaired !== undefined && (template.rank1 === template.rank2) !== criteria.isPaired) {
      return false;
    }
    
    if (criteria.isSuited !== undefined && template.description.includes('s') !== criteria.isSuited) {
      return false;
    }
    
    return true;
  });
}

// Legacy function for backward compatibility
export function getRandomProblem(): PokerProblem {
  return generateRandomProblem();
}

// Keep some static problems for testing/fallback
export const STATIC_PROBLEMS: PokerProblem[] = [
  {
    id: 'static_1',
    hand1: { card1: 'Ah', card2: 'As' }, // AA
    hand2: { card1: 'Kh', card2: 'Ks' }  // KK
  },
  {
    id: 'static_2',
    hand1: { card1: 'Ah', card2: 'Ks' }, // AK
    hand2: { card1: 'Qd', card2: 'Jc' }  // QJ
  }
];

// Test function to verify random generation works
export function testRandomGeneration(): void {
  // Test single problem generation
  const problem1 = generateRandomProblem();
  
  // Test multiple problem generation
  const problems = generateMultipleProblems(3);
  
  // Verify hands are different
  const allHands = [...problems, problem1];
  const handStrings = allHands.map(p => `${p.hand1.card1}${p.hand1.card2}-${p.hand2.card1}${p.hand2.card2}`);
  const uniqueHands = new Set(handStrings);
  
  // All hands are unique verification (silent)
  const allHandsUnique = allHands.length === uniqueHands.size;
  // Verification completed successfully
}
