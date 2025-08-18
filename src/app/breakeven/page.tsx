'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
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
    <PageWrapper title="Breakeven Percentage">
      {/* Problem Display */}
      <div className="my-8">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16">
          {/* Pot and Bet Information */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-100 mb-4">Pot Size</div>
            <div className="text-4xl font-bold text-green-400">
              ${currentProblem.pot}
            </div>
          </div>

          {/* Opponent's Bet */}
          <div className="text-center my-8">
            <div className="text-lg font-bold text-gray-100 mb-4">Opponent&apos;s Bet</div>
            <div className="text-4xl font-bold text-red-400">
              ${currentProblem.opponentBet}
            </div>
          </div>
        </div>
      </div>

      {/* Breakeven Calculation Display */}
      <div className="text-center">
        <div className="text-lg font-bold text-gray-100 mb-4">Breakeven Percentage</div>
        <div className="text-4xl font-bold text-blue-400">
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
          mode="percentage"
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
    </PageWrapper>
  );
}
