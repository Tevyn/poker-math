import { WhoWinsProblem, PlayerHand } from '../types/whoWinsProblems';

// Card representation using the existing string format
interface Card {
  rank: string;
  suit: string;
  toString(): string;
}

class PlayingCard implements Card {
  constructor(public rank: string, public suit: string) {}

  toString(): string {
    return this.rank + this.suit;
  }
}

// Standard deck creation
function createDeck(): PlayingCard[] {
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const suits = ['h', 's', 'd', 'c']; // hearts, spades, diamonds, clubs
  const deck: PlayingCard[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(new PlayingCard(rank, suit));
    }
  }

  return deck;
}

// Fisher-Yates shuffle algorithm
function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Deal cards from deck
function dealCards(deck: PlayingCard[], count: number): [PlayingCard[], PlayingCard[]] {
  const dealt = deck.slice(0, count);
  const remaining = deck.slice(count);
  return [dealt, remaining];
}

// Generate a unique problem ID
let problemCounter = 1;
function generateProblemId(): string {
  return `ww-dynamic-${problemCounter++}`;
}

// Main function to generate a random WhoWins problem
export function generateRandomWhoWinsProblem(): WhoWinsProblem {
  // Create and shuffle deck
  const deck = shuffleDeck(createDeck());
  
  // Deal 2 cards to each of 6 players (12 cards total)
  const [playerCards, remainingAfterPlayers] = dealCards(deck, 12);
  
  // Deal 5 community cards to the board
  const [boardCards, remainingCards] = dealCards(remainingAfterPlayers, 5);
  
  // Create player hands
  const playerHands: PlayerHand[] = [];
  for (let i = 0; i < 6; i++) {
    const startIndex = i * 2;
    const playerCardsSlice = playerCards.slice(startIndex, startIndex + 2);
    
    playerHands.push({
      id: `p${i + 1}`,
      name: `Player ${i + 1}`,
      cards: [playerCardsSlice[0].toString(), playerCardsSlice[1].toString()]
    });
  }
  
  // Create the board
  const board = boardCards.map(card => card.toString());
  
  return {
    id: generateProblemId(),
    board,
    playerHands
  };
}

// Utility function to generate multiple problems
export function generateMultipleProblems(count: number): WhoWinsProblem[] {
  const problems: WhoWinsProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(generateRandomWhoWinsProblem());
  }
  return problems;
}
