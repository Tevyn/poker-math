'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EquitySlider from '../../components/EquitySlider';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { BreakevenProblemManager } from '../../utils/breakevenProblemManager';
import { BreakevenProblem } from '../../types/breakevenProblems';

export default function BreakevenPage() {
  const [problemManager] = useState(() => new BreakevenProblemManager());
  const [currentProblem, setCurrentProblem] = useState<BreakevenProblem | null>(null);
  const [userEstimate, setUserEstimate] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  useEffect(() => {
    // Get initial problem
    const problem = problemManager.getRandomProblem();
    setCurrentProblem(problem);
    
    // Calculate correct answer
    const breakeven = problemManager.calculateCurrentProblemBreakeven();
    setCorrectAnswer(breakeven);
  }, [problemManager]);

  const handleSubmit = () => {
    if (!correctAnswer) return;
    
    const difference = Math.abs(userEstimate - correctAnswer);
    const tolerance = 5;
    setIsCorrect(difference <= tolerance);
    setShowResult(true);
  };

  const handleNextProblem = () => {
    const problem = problemManager.getRandomProblem();
    setCurrentProblem(problem);
    
    // Calculate correct answer for new problem
    const breakeven = problemManager.calculateCurrentProblemBreakeven();
    setCorrectAnswer(breakeven);
    
    setUserEstimate(50);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleEstimateChange = (value: number) => {
    setUserEstimate(value);
  };

  if (!currentProblem || correctAnswer === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-100 hover:text-gray-300 transition-colors">
              Poker Equity Estimation
            </Link>
            <nav className="flex space-x-6">
              <Link href="/hand-vs-hand" className="text-gray-300 hover:text-gray-100 transition-colors">
                Hand vs. Hand
              </Link>
              <Link href="/breakeven" className="text-blue-400 font-medium">
                Breakeven
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-100">
            Breakeven Percentage
          </h1>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Problem Display */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16">
              {/* Pot and Bet Information */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100 mb-4">Pot Size</div>
                <div className="text-4xl font-bold text-green-400">
                  ${currentProblem.pot}
                </div>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">VS</div>
              </div>

              {/* Opponent's Bet */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100 mb-4">Opponent&apos;s Bet</div>
                <div className="text-4xl font-bold text-red-400">
                  ${currentProblem.opponentBet}
                </div>
              </div>
            </div>
          </div>

          {/* Breakeven Calculation Display */}
          <div className="mb-8 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(userEstimate)}%
            </div>
          </div>

          {/* Breakeven Estimation Slider */}
          <div className="mb-8">
            <EquitySlider 
              value={userEstimate} 
              onChange={handleEstimateChange}
              correctAnswer={correctAnswer}
              showResult={showResult}
              isCorrect={isCorrect}
            />
          </div>

          {/* Submit/Next Button */}
          <div className="mb-8">
            <div className="text-center">
              {!showResult ? (
                <SubmitButton 
                  onSubmit={handleSubmit}
                />
              ) : (
                <NextProblemButton 
                  onNextProblem={handleNextProblem}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
