'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import EquitySlider from '../../components/EquitySlider';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { PotOddsProblemManager } from '../../utils/potOddsProblemManager';
import { PotOddsProblem } from '../../types/potOddsProblems';

export default function PotOddsPage() {
  const [problemManager] = useState(() => new PotOddsProblemManager());
  const [currentProblem, setCurrentProblem] = useState<PotOddsProblem | null>(null);
  const [userEstimate, setUserEstimate] = useState(3);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  useEffect(() => {
    // Get initial problem
    const problem = problemManager.getRandomProblem();
    setCurrentProblem(problem);
    
    // Calculate correct answer
    const potOdds = problemManager.calculateCurrentProblemPotOdds();
    setCorrectAnswer(potOdds);
  }, [problemManager]);

  const handleSubmit = () => {
    if (!correctAnswer) return;
    
    const difference = Math.abs(userEstimate - correctAnswer);
    const tolerance = 0.5; // 0.5 ratio difference tolerance
    setIsCorrect(difference <= tolerance);
    setShowResult(true);
  };

  const handleNextProblem = () => {
    const problem = problemManager.getRandomProblem();
    setCurrentProblem(problem);
    
    // Calculate correct answer for new problem
    const potOdds = problemManager.calculateCurrentProblemPotOdds();
    setCorrectAnswer(potOdds);
    
    setUserEstimate(3);
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
      <Header />

      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-2">
          <h1 className="text-m font-medium text-gray-600">
            Pot Odds
          </h1>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Problem Display */}
          <div className="my-8">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16">
              {/* Pot Information */}
              <div className="text-center">
                <div className="text-lg font-bold text-gray-100 mb-4">Pot Size</div>
                <div className="text-4xl font-bold text-green-400">
                  ${currentProblem.pot}
                </div>
              </div>

              {/* Amount to Call */}
              <div className="text-center my-8">
                <div className="text-lg font-bold text-gray-100 mb-4">Amount to Call</div>
                <div className="text-4xl font-bold text-red-400">
                  ${currentProblem.callAmount}
                </div>
              </div>
            </div>
          </div>

          {/* Pot Odds Display */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-100 mb-4">Pot Odds</div>
            <div className="text-4xl font-bold text-blue-400">
              {userEstimate}:1
            </div>
          </div>

          {/* Pot Odds Estimation Slider */}
          <div className="mb-8">
            <EquitySlider 
              value={userEstimate} 
              onChange={handleEstimateChange}
              correctAnswer={correctAnswer}
              showResult={showResult}
              isCorrect={isCorrect}
              // Pot odds specific configuration
              min={1}
              max={12}
              step={0.1}
              labelFormat="ratio"
              tolerance={0.5}
              customTicks={[1, 2, 3, 4, 5, 6, 8, 10, 12]}
              customLabels={['1:1', '2:1', '3:1', '4:1', '5:1', '6:1', '8:1', '10:1', '12:1']}
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
