import { 
  generateRandomHand, 
  generateRandomBoard, 
  dealRandomCards 
} from "./simpleRandomHands";
import type { Card, Combo } from "./lib/models";
import type { 
  WhoWinsScenario, 
  PlayerHand, 
  WhoWinsScenarioConfig
} from "../types/whoWins";
import { DEFAULT_WHO_WINS_CONFIG } from "../types/whoWins";

/**
 * Generate a random who-wins scenario with multiple players
 */
export const generateRandomWhoWinsScenario = (
  config: Partial<WhoWinsScenarioConfig> = {}
): WhoWinsScenario => {
  const finalConfig = { ...DEFAULT_WHO_WINS_CONFIG, ...config };
  
  // Validate configuration
  if (finalConfig.numPlayers < 2 || finalConfig.numPlayers > 6) {
    throw new Error("Number of players must be between 2 and 6");
  }
  
  if (finalConfig.boardSize < 0 || finalConfig.boardSize > 5) {
    throw new Error("Board size must be between 0 and 5");
  }

  // Generate all player hands first
  const playerHands: PlayerHand[] = [];
  const allDealtCards: Card[] = [];

  for (let i = 0; i < finalConfig.numPlayers; i++) {
    const hand = generateRandomHand(allDealtCards);
    allDealtCards.push(...hand);
    
    const playerHand: PlayerHand = {
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      cards: hand,
    };
    
    playerHands.push(playerHand);
  }

  // Generate board using remaining cards
  const board = generateRandomBoard(finalConfig.boardSize, allDealtCards);

  // Create scenario
  const scenario: WhoWinsScenario = {
    id: generateScenarioId(),
    board,
    playerHands,
  };

  return scenario;
};

/**
 * Generate a scenario ID
 */
const generateScenarioId = (): string => {
  return `who-wins-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate multiple random scenarios
 */
export const generateMultipleWhoWinsScenarios = (
  count: number,
  config: Partial<WhoWinsScenarioConfig> = {}
): WhoWinsScenario[] => {
  const scenarios: WhoWinsScenario[] = [];
  
  for (let i = 0; i < count; i++) {
    scenarios.push(generateRandomWhoWinsScenario(config));
  }
  
  return scenarios;
};

/**
 * Generate a scenario with custom player names
 */
export const generateWhoWinsScenarioWithNames = (
  playerNames: string[],
  config: Partial<WhoWinsScenarioConfig> = {}
): WhoWinsScenario => {
  if (playerNames.length < 2 || playerNames.length > 6) {
    throw new Error("Number of player names must be between 2 and 6");
  }

  const scenario = generateRandomWhoWinsScenario({
    ...config,
    numPlayers: playerNames.length,
  });

  // Update player names
  scenario.playerHands.forEach((hand, index) => {
    hand.name = playerNames[index];
  });

  return scenario;
};

/**
 * Generate a scenario with a specific board size (flop, turn, river)
 */
export const generateWhoWinsScenarioByStage = (
  stage: 'preflop' | 'flop' | 'turn' | 'river',
  config: Partial<WhoWinsScenarioConfig> = {}
): WhoWinsScenario => {
  const boardSizes = {
    preflop: 0,
    flop: 3,
    turn: 4,
    river: 5,
  };

  return generateRandomWhoWinsScenario({
    ...config,
    boardSize: boardSizes[stage],
  });
};
