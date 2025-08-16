'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-100 hover:text-gray-300 transition-colors">
              Poker Equity Estimation
            </Link>
            <nav className="flex space-x-6">
              <Link href="/hand-vs-hand" className="text-blue-400 font-medium">
                Hand vs. Hand
              </Link>
              <Link href="/breakeven" className="text-gray-300 hover:text-gray-100 transition-colors">
                Breakeven
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-100">
            Hand vs. Hand
          </h1>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Problem Display */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16">
              {/* First Hand */}
              <div className="text-center">
                <HandDisplay 
                  title="Your Hand" 
                  cards={[
                    parseCard(currentProblem.hand1.card1),
                    parseCard(currentProblem.hand1.card2)
                  ]} 
                />
                <div className="mt-4 text-2xl font-bold text-blue-400">
                  {Math.round(userEstimate)}%
                </div>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">VS</div>
              </div>

              {/* Second Hand */}
              <div className="text-center">
                <HandDisplay 
                  title="Their Hand" 
                  cards={[
                    parseCard(currentProblem.hand2.card1),
                    parseCard(currentProblem.hand2.card2)
                  ]} 
                />
                <div className="mt-4 text-2xl font-bold text-gray-400">
                  {Math.round(100 - userEstimate)}%
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
