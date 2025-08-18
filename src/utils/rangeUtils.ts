import { rangeData } from '../data/rangeData';
import { PokerRange, RangeTestResult, HandPracticeQuestion } from '../types/rangeTypes';

// Generate the 13x13 hand matrix
export function generateHandMatrix(): string[] {
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const hands: string[] = [];
  
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 13; j++) {
      let hand: string;
      if (i === j) {
        // Pocket pairs (diagonal)
        hand = ranks[i] + ranks[j];
      } else if (i < j) {
        // Suited hands (above diagonal)
        hand = ranks[i] + ranks[j] + 's';
      } else {
        // Offsuit hands (below diagonal)
        hand = ranks[j] + ranks[i] + 'o';
      }
      hands.push(hand);
    }
  }
  
  return hands;
}

// Generate pattern view layout (13 rows, centered)
export function generatePatternLayout(): string[][] {
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const pattern: string[][] = [];
  
  // Generate each row based on highest rank
  for (let i = 0; i < 13; i++) {
    const row: string[] = [];
    const highRank = ranks[i];
    const lowerRanks = ranks.slice(i + 1); // Only ranks lower than current
    
    // Add offsuit hands (high rank first, in ascending order of low rank)
    for (let j = lowerRanks.length - 1; j >= 0; j--) {
      row.push(highRank + lowerRanks[j] + 'o');
    }
    
    // Add pocket pair (center)
    row.push(highRank + highRank);
    
    // Add suited hands (high rank first, in descending order of low rank)
    for (let j = 0; j < lowerRanks.length; j++) {
      row.push(highRank + lowerRanks[j] + 's');
    }
    
    // Calculate padding to center the row
    const totalHands = row.length;
    const maxWidth = 25; // Width of top row (Aces)
    const totalPadding = maxWidth - totalHands;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    
    // Add left padding (empty cells)
    for (let p = 0; p < leftPadding; p++) {
      row.unshift('');
    }
    
    // Add right padding (empty cells)
    for (let p = 0; p < rightPadding; p++) {
      row.push('');
    }
    
    pattern.push(row);
  }
  
  return pattern;
}

// Get the action for a specific hand in a range
export function getHandAction(hand: string, range: PokerRange): string {
  if (range.raise && range.raise.includes(hand)) {
    return 'raise';
  }
  if (range.call && range.call.includes(hand)) {
    return 'call';
  }
  return 'fold';
}

// Get the correct action for a hand in a specific range
export function getCorrectAction(hand: string, categoryId: string, rangeId: string): string {
  const range = rangeData[categoryId]?.ranges[rangeId];
  if (!range) return 'fold';
  
  return getHandAction(hand, range.range);
}

// Calculate accuracy score for a range test
export function calculateRangeTestScore(
  userSelections: Record<string, string>,
  correctSelections: Record<string, string>
): { accuracy: number; totalHands: number; correctHands: number } {
  const hands = Object.keys(correctSelections);
  const totalHands = hands.length;
  let correctHands = 0;
  
  for (const hand of hands) {
    const userAction = userSelections[hand] || 'fold';
    const correctAction = correctSelections[hand];
    
    if (userAction === correctAction) {
      correctHands++;
    }
  }
  
  const accuracy = totalHands > 0 ? (correctHands / totalHands) * 100 : 0;
  
  return {
    accuracy: Math.round(accuracy * 100) / 100, // Round to 2 decimal places
    totalHands,
    correctHands
  };
}



// Generate a random two-card hand (legacy format for backward compatibility)
export function generateRandomHand(): string {
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const rank1 = ranks[Math.floor(Math.random() * ranks.length)];
  const rank2 = ranks[Math.floor(Math.random() * ranks.length)];
  
  if (rank1 === rank2) {
    return rank1 + rank2; // Pocket pair
  } else if (ranks.indexOf(rank1) < ranks.indexOf(rank2)) {
    return rank1 + rank2 + 's'; // Suited
  } else {
    return rank2 + rank1 + 'o'; // Offsuit
  }
}

// Generate a hand practice question with correct actions for all ranges
export function generateHandPracticeQuestion(): HandPracticeQuestion {
  const hand = generateRandomHand();
  const correctActions: Record<string, string> = {};
  
  // Get correct actions for all ranges in all categories
  for (const categoryId of Object.keys(rangeData)) {
    for (const rangeId of Object.keys(rangeData[categoryId].ranges)) {
      const action = getCorrectAction(hand, categoryId, rangeId);
      correctActions[rangeId] = action;
    }
  }
  
  return {
    hand,
    correctActions
  };
}



// Check if a hand practice answer is correct
export function checkHandPracticeAnswer(
  hand: string,
  userAnswers: Record<string, string>,
  correctAnswers: Record<string, string>
): { isCorrect: boolean; accuracy: number } {
  const ranges = Object.keys(correctAnswers);
  let correctCount = 0;
  
  for (const rangeId of ranges) {
    const userAnswer = userAnswers[rangeId] || 'fold';
    const correctAnswer = correctAnswers[rangeId];
    
    if (userAnswer === correctAnswer) {
      correctCount++;
    }
  }
  
  const accuracy = ranges.length > 0 ? (correctCount / ranges.length) * 100 : 0;
  const isCorrect = accuracy === 100;
  
  return {
    isCorrect,
    accuracy: Math.round(accuracy * 100) / 100
  };
}

// Get all hands that should have a specific action in a range
export function getHandsByAction(range: PokerRange, action: string): string[] {
  switch (action) {
    case 'raise':
      return range.raise || [];
    case 'call':
      return range.call || [];
    case 'fold':
      // Fold hands are all hands not in raise or call
      const allHands = generateHandMatrix();
      const raiseHands = range.raise || [];
      const callHands = range.call || [];
      return allHands.filter(hand => 
        !raiseHands.includes(hand) && !callHands.includes(hand)
      );
    default:
      return [];
  }
}

// Convert hand notation to display format (e.g., "AKs" -> "A♠K♠")
export function formatHandDisplay(hand: string): string {
  if (hand.length === 2) {
    // Pocket pair
    return `${hand[0]}${hand[1]}`;
  } else if (hand.endsWith('s')) {
    // Suited hand
    return `${hand[0]}${hand[1]}s`;
  } else if (hand.endsWith('o')) {
    // Offsuit hand
    return `${hand[0]}${hand[1]}o`;
  }
  return hand;
}

// Convert WhoWins-style hand cards to range format
export function convertHandCardsToRangeFormat(handCards: [string, string]): string {
  const [card1, card2] = handCards;
  const rank1 = card1[0];
  const rank2 = card2[0];
  const suit1 = card1[1];
  const suit2 = card2[1];
  
  if (rank1 === rank2) {
    return rank1 + rank2; // Pocket pair
  } else if (suit1 === suit2) {
    // Suited - ensure higher rank first
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    if (ranks.indexOf(rank1) < ranks.indexOf(rank2)) {
      return rank1 + rank2 + 's';
    } else {
      return rank2 + rank1 + 's';
    }
  } else {
    // Offsuit - ensure higher rank first
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    if (ranks.indexOf(rank1) < ranks.indexOf(rank2)) {
      return rank1 + rank2 + 'o';
    } else {
      return rank2 + rank1 + 'o';
    }
  }
}
