import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateHandVsHandEquity,
  approximateHandVsHandEquity,
  equityToPercentage,
  formatEquityResult
} from '../handVsHandEquity';
import type { Card, Combo } from '../lib/models';

describe('handVsHandEquity', () => {
  describe('calculateHandVsHandEquity', () => {
    it('should calculate equity for pocket aces vs pocket kings (no board)', () => {
      const hand1: Combo = ['As', 'Ad'];
      const hand2: Combo = ['Ks', 'Kd'];
      const result = calculateHandVsHandEquity(hand1, hand2);
      
      // AA vs KK should heavily favor AA (roughly 82% vs 18%)
      assert.ok(result.equity > 0.8, `AA should have >80% equity, got ${result.equity}`);
      assert.ok(result.equity < 0.85, `AA should have <85% equity, got ${result.equity}`);
      assert.ok(result.win > 0.8, `AA should have >80% win rate, got ${result.win}`);
      assert.ok(result.draw < 0.01, `Draw rate should be very low, got ${result.draw}`);
    });

    it('should calculate equity for identical hands (should be 50/50)', () => {
      const hand1: Combo = ['As', 'Kh'];
      const hand2: Combo = ['Ad', 'Ks'];
      const result = calculateHandVsHandEquity(hand1, hand2);
      
      // Identical hands should be close to 50/50
      assert.ok(Math.abs(result.equity - 0.5) < 0.01, `Should be close to 50%, got ${result.equity}`);
    });

    it('should calculate equity with a complete board', () => {
      const hand1: Combo = ['As', 'Kh'];
      const hand2: Combo = ['Qd', 'Js'];
      const board: Card[] = ['Ah', 'Kd', 'Qc', 'Jh', '2s']; // Two pair for both
      const result = calculateHandVsHandEquity(hand1, hand2, board);
      
      // With a complete board, result should be deterministic
      assert.ok(result.equity === 1 || result.equity === 0 || result.equity === 0.5);
      assert.strictEqual(result.win + result.draw, result.equity);
    });

    it('should calculate equity with partial board (flop)', () => {
      const hand1: Combo = ['As', 'Ah'];
      const hand2: Combo = ['Ks', 'Kd'];
      const board: Card[] = ['Ac', '2h', '3s']; // Set for hand1
      const result = calculateHandVsHandEquity(hand1, hand2, board);
      
      // Set of aces should heavily dominate pocket kings
      assert.ok(result.equity > 0.9, `Set should dominate, got ${result.equity}`);
    });

    it('should return valid probability values', () => {
      const hand1: Combo = ['7h', '8h'];
      const hand2: Combo = ['9s', 'Ts'];
      const result = calculateHandVsHandEquity(hand1, hand2);
      
      // All probabilities should be between 0 and 1
      assert.ok(result.equity >= 0 && result.equity <= 1);
      assert.ok(result.win >= 0 && result.win <= 1);
      assert.ok(result.draw >= 0 && result.draw <= 1);
      
      // Win + 0.5 * draw should equal equity
      assert.ok(Math.abs(result.win + 0.5 * result.draw - result.equity) < 0.0001);
    });
  });

  describe('approximateHandVsHandEquity', () => {
    it('should approximate equity reasonably close to exact calculation', () => {
      const hand1: Combo = ['As', 'Ad'];
      const hand2: Combo = ['Ks', 'Kd'];
      
      const exact = calculateHandVsHandEquity(hand1, hand2);
      const approximate = approximateHandVsHandEquity(hand1, hand2, [], 50000);
      
      // Should be within 2% of exact calculation
      assert.ok(Math.abs(exact.equity - approximate.equity) < 0.02, 
        `Approximation should be close to exact: exact=${exact.equity}, approx=${approximate.equity}`);
    });

    it('should handle complete board correctly', () => {
      const hand1: Combo = ['As', 'Kh'];
      const hand2: Combo = ['Qd', 'Js'];
      const board: Card[] = ['Ah', 'Kd', 'Qc', 'Jh', '2s'];
      
      const exact = calculateHandVsHandEquity(hand1, hand2, board);
      const approximate = approximateHandVsHandEquity(hand1, hand2, board, 1000);
      
      // With complete board, both should give identical results
      assert.strictEqual(exact.equity, approximate.equity);
      assert.strictEqual(exact.win, approximate.win);
      assert.strictEqual(exact.draw, approximate.draw);
    });

    it('should return valid probability values', () => {
      const hand1: Combo = ['7h', '8h'];
      const hand2: Combo = ['9s', 'Ts'];
      const result = approximateHandVsHandEquity(hand1, hand2, [], 1000);
      
      // All probabilities should be between 0 and 1
      assert.ok(result.equity >= 0 && result.equity <= 1);
      assert.ok(result.win >= 0 && result.win <= 1);
      assert.ok(result.draw >= 0 && result.draw <= 1);
      
      // Win + 0.5 * draw should equal equity
      assert.ok(Math.abs(result.win + 0.5 * result.draw - result.equity) < 0.01); // Allow small variance for approximation
    });
  });

  describe('equityToPercentage', () => {
    it('should convert equity to percentage correctly', () => {
      assert.strictEqual(equityToPercentage(0.5), 50);
      assert.strictEqual(equityToPercentage(0.8234), 82.34);
      assert.strictEqual(equityToPercentage(0), 0);
      assert.strictEqual(equityToPercentage(1), 100);
    });

    it('should round to 2 decimal places', () => {
      assert.strictEqual(equityToPercentage(0.123456), 12.35);
      assert.strictEqual(equityToPercentage(0.876543), 87.65);
    });
  });

  describe('formatEquityResult', () => {
    it('should format equity result correctly', () => {
      const equity = {
        win: 0.6,
        draw: 0.1,
        equity: 0.65
      };
      
      const formatted = formatEquityResult(equity);
      
      assert.strictEqual(formatted.hand1Equity, 65);
      assert.strictEqual(formatted.hand2Equity, 35);
      assert.strictEqual(formatted.hand1Win, 60);
      assert.strictEqual(formatted.hand2Win, 30);
      assert.strictEqual(formatted.tie, 10);
    });

    it('should handle edge cases correctly', () => {
      const equity = {
        win: 1,
        draw: 0,
        equity: 1
      };
      
      const formatted = formatEquityResult(equity);
      
      assert.strictEqual(formatted.hand1Equity, 100);
      assert.strictEqual(formatted.hand2Equity, 0);
      assert.strictEqual(formatted.hand1Win, 100);
      assert.strictEqual(formatted.hand2Win, 0);
      assert.strictEqual(formatted.tie, 0);
    });

    it('should ensure percentages sum correctly', () => {
      const equity = {
        win: 0.4,
        draw: 0.2,
        equity: 0.5
      };
      
      const formatted = formatEquityResult(equity);
      
      // Hand equities should sum to 100
      assert.strictEqual(formatted.hand1Equity + formatted.hand2Equity, 100);
      
      // Win rates + tie should sum to 100
      assert.strictEqual(formatted.hand1Win + formatted.hand2Win + formatted.tie, 100);
    });
  });

  describe('integration tests', () => {
    it('should handle various hand matchups correctly', () => {
      const testCases = [
        {
          name: 'High pair vs low pair',
          hand1: ['As', 'Ad'] as Combo,
          hand2: ['2h', '2c'] as Combo,
          expectedHand1Advantage: true
        },
        {
          name: 'Suited connectors vs offsuit cards',
          hand1: ['9h', 'Th'] as Combo,
          hand2: ['Ac', '2d'] as Combo,
          expectedHand1Advantage: false // A2o should be slightly favored
        },
        {
          name: 'Overcards vs pair',
          hand1: ['As', 'Kd'] as Combo,
          hand2: ['Qh', 'Qc'] as Combo,
          expectedHand1Advantage: false // Pair should be favored
        }
      ];

      for (const testCase of testCases) {
        const result = calculateHandVsHandEquity(testCase.hand1, testCase.hand2);
        const hand1Favored = result.equity > 0.5;
        
        assert.strictEqual(hand1Favored, testCase.expectedHand1Advantage, 
          `${testCase.name}: Expected hand1 advantage ${testCase.expectedHand1Advantage}, got ${hand1Favored} (equity: ${result.equity})`);
      }
    });
  });
});
