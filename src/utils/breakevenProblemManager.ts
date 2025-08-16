import { BreakevenProblem } from '../types/breakevenProblems';

export class BreakevenProblemManager {
  private currentProblem: BreakevenProblem | null = null;
  private problems: BreakevenProblem[] = [];

  constructor() {
    this.generateProblems();
  }

  private generateProblems() {
    // Generate realistic poker scenarios
    const scenarios = [
      { pot: 100, bet: 50 },    // 50% breakeven
      { pot: 200, bet: 100 },   // 33.33% breakeven
      { pot: 150, bet: 75 },    // 33.33% breakeven
      { pot: 300, bet: 150 },   // 33.33% breakeven
      { pot: 100, bet: 25 },    // 20% breakeven
      { pot: 200, bet: 50 },    // 20% breakeven
      { pot: 400, bet: 100 },   // 20% breakeven
      { pot: 100, bet: 100 },   // 50% breakeven
      { pot: 200, bet: 200 },   // 50% breakeven
      { pot: 150, bet: 50 },    // 25% breakeven
      { pot: 300, bet: 100 },   // 25% breakeven
      { pot: 100, bet: 33 },    // 24.8% breakeven
      { pot: 200, bet: 67 },    // 25.1% breakeven
      { pot: 150, bet: 100 },   // 40% breakeven
      { pot: 300, bet: 200 },   // 40% breakeven
    ];

    this.problems = scenarios.map((scenario, index) => ({
      id: `breakeven-${index + 1}`,
      pot: scenario.pot,
      opponentBet: scenario.bet,
      description: `Pot: $${scenario.pot}, Opponent bets $${scenario.bet}`
    }));
  }

  getRandomProblem(): BreakevenProblem {
    const randomIndex = Math.floor(Math.random() * this.problems.length);
    this.currentProblem = this.problems[randomIndex];
    return this.currentProblem;
  }

  calculateCurrentProblemBreakeven(): number {
    if (!this.currentProblem) {
      return 0;
    }

    // amount_to_call = opponent_bet
    // total_pot_after_call = total_pot + opponent_bet + amount_to_call
    // breakeven_percentage = amount_to_call / total_pot_after_call
    const amountToCall = this.currentProblem.opponentBet;
    const totalPotAfterCall = this.currentProblem.pot + this.currentProblem.opponentBet + amountToCall;
    const breakevenPercentage = amountToCall / totalPotAfterCall;

    return breakevenPercentage * 100; // Return as percentage (not rounded)
  }
}
