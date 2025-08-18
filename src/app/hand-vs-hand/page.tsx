'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import HandDisplay from '../../components/HandDisplay';
import EquitySlider from '../../components/EquitySlider';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { ProblemManager } from '../../utils/problemManager';
import { PokerProblem } from '../../types/pokerProblems';

// Helper function to convert card string to rank and suit
function parseCard(cardString: string): { rank: string; suit: string } {
  const rank = cardString[0];
  const suitCode = cardString[1];
  
  const suitSymbols: { [key: string]: string } = {
    'h': '♥',
    'd': '♦',
    'c': '♣',
    's': '♠'
  };
  
  return {
    rank: rank === 'T' ? '10' : rank,
    suit: suitSymbols[suitCode] || suitCode
  };
}

export default function HandVsHandPage() {
  const [problemManager] = useState(() => new ProblemManager());
  const [currentProblem, setCurrentProblem] = useState<PokerProblem | null>(null);
  const [userEstimate, setUserEstimate] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  useEffect(() => {
    // Get initial problem
    const problem = problemManager.getRandomProblem();
    setCurrentProblem(problem);
    
    // Calculate correct answer
    const equity = problemManager.calculateCurrentProblemEquity();
    setCorrectAnswer(equity);
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
    const equity = problemManager.calculateCurrentProblemEquity();
    setCorrectAnswer(equity);
    
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

  const correctHand2Equity = 100 - correctAnswer;

  return (
    <PageWrapper title="Hand vs. Hand">
      {/* Problem Display */}
      <div className="my-8">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:gap-16">
          {/* Second Hand - appears first on mobile, left on desktop */}
          <div className="order-1 sm:order-2">
            <HandDisplay 
              title="Villain" 
              cards={[
                parseCard(currentProblem.hand2.card1),
                parseCard(currentProblem.hand2.card2)
              ]} 
            />
            <div className="mt-4 text-2xl font-bold text-gray-400 text-center">
              {Math.round(100 - userEstimate)}%
            </div>
          </div>

          {/* First Hand - appears second on mobile, right on desktop */}
          <div className="order-2 sm:order-1">
            <HandDisplay 
              title="Hero" 
              cards={[
                parseCard(currentProblem.hand1.card1),
                parseCard(currentProblem.hand1.card2)
              ]} 
            />
            <div className="mt-4 text-2xl font-bold text-blue-400 text-center">
              {Math.round(userEstimate)}%
            </div>
          </div>
        </div>
      </div>

      {/* Equity Estimation */}
      <div className="mb-8">
        <EquitySlider 
          value={userEstimate} 
          onChange={handleEstimateChange}
          correctAnswer={correctAnswer}
          showResult={showResult}
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
