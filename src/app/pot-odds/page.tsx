'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
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
    <PageWrapper title="Pot Odds">
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
          mode="pot-odds"
          // Pot odds specific configuration
          min={1}
          max={12}
          step={0.1}
          labelFormat="ratio"
          tolerance={0.5}
          customTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          customLabels={['1:1', '2:1', '3:1', '4:1', '5:1', '6:1', '7:1', '8:1', '9:1', '10:1', '11:1', '12:1']}
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
