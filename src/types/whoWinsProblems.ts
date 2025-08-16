export interface WhoWinsProblem {
  id: string;
  board: string[]; // 5 community cards, e.g., ['Ah', 'Ks', 'Qd', 'Jc', 'Th']
  playerHands: PlayerHand[]; // Array of 6 player hands
}

export interface PlayerHand {
  id: string;
  name: string; // e.g., "Player 1", "Player 2"
  cards: [string, string]; // e.g., ['As', 'Ad']
}

export interface WhoWinsResult {
  problemId: string;
  userAnswer: number; // Index of selected hand
  correctAnswer: number;
  isCorrect: boolean;
  winningHandRank?: string; // e.g., "Straight Flush", "Four of a Kind"
  winningHandDescription?: string; // e.g., "Straight Flush, Ace High"
  isTie: boolean; // Whether there are multiple winners
  tieIndices: number[]; // Indices of all winning hands in case of tie
}
