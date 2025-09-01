import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateFullDeck,
  shuffleArray,
  dealRandomCards,
  generateRandomHand,
  generateTwoRandomHands,
  generateRandomBoard,
  generateRandomScenario
} from '../simpleRandomHands';
import type { Card } from '../lib/models';

describe('simpleRandomHands', () => {
  describe('generateFullDeck', () => {
    it('should generate a deck with 52 unique cards', () => {
      const deck = generateFullDeck();
      assert.strictEqual(deck.length, 52);
      
      // Check for uniqueness
      const uniqueCards = new Set(deck);
      assert.strictEqual(uniqueCards.size, 52);
    });

    it('should contain all expected ranks and suits', () => {
      const deck = generateFullDeck();
      const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
      const suits = ['s', 'h', 'c', 'd'];
      
      // Check that we have 4 of each rank
      for (const rank of ranks) {
        const rankCards = deck.filter(card => card[0] === rank);
        assert.strictEqual(rankCards.length, 4, `Should have 4 ${rank}s`);
      }
      
      // Check that we have 13 of each suit
      for (const suit of suits) {
        const suitCards = deck.filter(card => card[1] === suit);
        assert.strictEqual(suitCards.length, 13, `Should have 13 ${suit}s`);
      }
    });
  });

  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      assert.strictEqual(shuffled.length, original.length);
    });

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      assert.deepStrictEqual(original, originalCopy);
    });

    it('should contain the same elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      assert.deepStrictEqual(shuffled.sort(), original.sort());
    });
  });

  describe('dealRandomCards', () => {
    it('should deal the requested number of cards', () => {
      const cards = dealRandomCards(5);
      assert.strictEqual(cards.length, 5);
    });

    it('should deal unique cards', () => {
      const cards = dealRandomCards(10);
      const uniqueCards = new Set(cards);
      assert.strictEqual(uniqueCards.size, 10);
    });

    it('should exclude specified cards', () => {
      const excludedCards: Card[] = ['As', 'Kh'];
      const cards = dealRandomCards(5, excludedCards);
      
      for (const card of cards) {
        assert.ok(!excludedCards.includes(card), `Should not include excluded card ${card}`);
      }
    });

    it('should throw error if requesting too many cards', () => {
      assert.throws(() => {
        dealRandomCards(53); // More than deck size
      }, /Cannot deal 53 cards/);
    });

    it('should throw error if requesting more cards than available after exclusions', () => {
      const excludedCards: Card[] = ['As', 'Kh', 'Qd']; // Exclude 3 cards
      assert.throws(() => {
        dealRandomCards(51, excludedCards); // 52 - 3 = 49 available, requesting 51
      }, /Cannot deal 51 cards/);
    });
  });

  describe('generateRandomHand', () => {
    it('should generate a hand with exactly 2 cards', () => {
      const hand = generateRandomHand();
      assert.strictEqual(hand.length, 2);
    });

    it('should generate unique cards in the hand', () => {
      const hand = generateRandomHand();
      assert.notStrictEqual(hand[0], hand[1]);
    });

    it('should exclude specified cards', () => {
      const excludedCards: Card[] = ['As', 'Kh'];
      const hand = generateRandomHand(excludedCards);
      
      for (const card of hand) {
        assert.ok(!excludedCards.includes(card), `Should not include excluded card ${card}`);
      }
    });
  });

  describe('generateTwoRandomHands', () => {
    it('should generate two hands with 2 cards each', () => {
      const [hand1, hand2] = generateTwoRandomHands();
      assert.strictEqual(hand1.length, 2);
      assert.strictEqual(hand2.length, 2);
    });

    it('should generate hands with no overlapping cards', () => {
      const [hand1, hand2] = generateTwoRandomHands();
      const allCards = [...hand1, ...hand2];
      const uniqueCards = new Set(allCards);
      assert.strictEqual(uniqueCards.size, 4);
    });
  });

  describe('generateRandomBoard', () => {
    it('should generate a board with the requested number of cards', () => {
      for (let i = 0; i <= 5; i++) {
        const board = generateRandomBoard(i);
        assert.strictEqual(board.length, i, `Board should have ${i} cards`);
      }
    });

    it('should generate unique cards on the board', () => {
      const board = generateRandomBoard(5);
      const uniqueCards = new Set(board);
      assert.strictEqual(uniqueCards.size, 5);
    });

    it('should exclude specified cards', () => {
      const excludedCards: Card[] = ['As', 'Kh'];
      const board = generateRandomBoard(3, excludedCards);
      
      for (const card of board) {
        assert.ok(!excludedCards.includes(card), `Should not include excluded card ${card}`);
      }
    });

    it('should throw error for invalid board sizes', () => {
      assert.throws(() => {
        generateRandomBoard(-1);
      }, /Board must have between 0 and 5 cards/);

      assert.throws(() => {
        generateRandomBoard(6);
      }, /Board must have between 0 and 5 cards/);
    });
  });

  describe('generateRandomScenario', () => {
    it('should generate a scenario with two hands and empty board by default', () => {
      const scenario = generateRandomScenario();
      assert.strictEqual(scenario.hand1.length, 2);
      assert.strictEqual(scenario.hand2.length, 2);
      assert.strictEqual(scenario.board.length, 0);
    });

    it('should generate a scenario with specified board size', () => {
      const scenario = generateRandomScenario(3);
      assert.strictEqual(scenario.hand1.length, 2);
      assert.strictEqual(scenario.hand2.length, 2);
      assert.strictEqual(scenario.board.length, 3);
    });

    it('should generate all unique cards across hands and board', () => {
      const scenario = generateRandomScenario(5);
      const allCards = [...scenario.hand1, ...scenario.hand2, ...scenario.board];
      const uniqueCards = new Set(allCards);
      assert.strictEqual(uniqueCards.size, 9); // 2 + 2 + 5 cards, all unique
    });
  });
});
