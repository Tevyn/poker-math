import { PotOddsProblem } from '../types/potOddsProblems';

export class PotOddsProblemManager {
  private currentProblem: PotOddsProblem | null = null;
  private problems: PotOddsProblem[] = [];

  constructor() {
    this.generateProblems();
  }

  private generateProblems() {
    // Generate realistic poker scenarios for pot odds
    const scenarios = [
      { pot: 100, call: 50 },     // 3:1 pot odds
      { pot: 200, call: 100 },    // 3:1 pot odds
      { pot: 150, call: 75 },     // 3:1 pot odds
      { pot: 300, call: 150 },    // 3:1 pot odds
      { pot: 100, call: 25 },     // 5:1 pot odds
      { pot: 200, call: 50 },     // 5:1 pot odds
      { pot: 400, call: 100 },    // 5:1 pot odds
      { pot: 100, call: 100 },    // 2:1 pot odds
      { pot: 200, call: 200 },    // 2:1 pot odds
      { pot: 150, call: 50 },     // 4:1 pot odds
      { pot: 300, call: 100 },    // 4:1 pot odds
      { pot: 100, call: 33 },     // 4:1 pot odds (approximately)
      { pot: 200, call: 67 },     // 4:1 pot odds (approximately)
      { pot: 150, call: 100 },    // 2.5:1 pot odds
      { pot: 300, call: 200 },    // 2.5:1 pot odds
      { pot: 100, call: 20 },     // 6:1 pot odds
      { pot: 200, call: 40 },     // 6:1 pot odds
      { pot: 400, call: 80 },     // 6:1 pot odds
      { pot: 100, call: 10 },     // 11:1 pot odds
      { pot: 200, call: 20 },     // 11:1 pot odds
    ];

    this.problems = scenarios.map((scenario, index) => ({
      id: `pot-odds-${index + 1}`,
      pot: scenario.pot,
      callAmount: scenario.call,
      description: `Pot: $${scenario.pot}, Amount to call: $${scenario.call}`
    }));
  }

  getRandomProblem(): PotOddsProblem {
    const randomIndex = Math.floor(Math.random() * this.problems.length);
    this.currentProblem = this.problems[randomIndex];
    return this.currentProblem;
  }

  calculateCurrentProblemPotOdds(): number {
    if (!this.currentProblem) {
      return 0;
    }

    // Pot odds = (pot + call amount) : call amount
    // We'll return the ratio as a decimal for easier comparison
    // e.g., 3:1 becomes 3.0, 2.5:1 becomes 2.5
    const potOdds = (this.currentProblem.pot + this.currentProblem.callAmount) / this.currentProblem.callAmount;
    
    // Round to 1 decimal place for cleaner display
    return Math.round(potOdds * 10) / 10;
  }
}
