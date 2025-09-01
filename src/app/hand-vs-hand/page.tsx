'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import HandDisplay from '../../components/HandDisplay';
import EquitySlider from '../../components/EquitySlider';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { generateTwoRandomHands } from '../../utils/simpleRandomHands';
import { calculateHandVsHandEquity, formatEquityResult } from '../../utils/handVsHandEquity';
import type { HandVsHandScenario, HandVsHandResult } from '../../types/handVsHand';

export default function HandVsHandPage() {
  const [currentScenario, setCurrentScenario] = useState<HandVsHandScenario | null>(null);
  const [userEstimate, setUserEstimate] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<HandVsHandResult | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [problemNumber, setProblemNumber] = useState(1);

  // Generate initial scenario
  useEffect(() => {
    generateNewScenario();
  }, []);

  const generateNewScenario = () => {
    const [hand1, hand2] = generateTwoRandomHands();
    const scenario: HandVsHandScenario = {
      hand1,
      hand2,
      board: [], // Start with preflop for simplicity
      id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setCurrentScenario(scenario);
    setCurrentResult(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleSubmit = async () => {
    if (!currentScenario) return;
    
    setIsCalculating(true);
    
    try {
      // Give React a chance to re-render with the loading state
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Add a minimum loading time to show the loading state
      const startTime = Date.now();
      
      // Calculate equity using our lib-based utility
      const equity = calculateHandVsHandEquity(
        currentScenario.hand1,
        currentScenario.hand2,
        currentScenario.board
      );
      
      // Ensure minimum loading time of 500ms
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
      }
      
      // Format result for UI display
      const formattedResult = formatEquityResult(equity);
      const result: HandVsHandResult = {
        ...formattedResult,
        rawEquity: equity
      };
      setCurrentResult(result);
      
      // Check if user's estimate is correct (within 5 percentage points)
      const tolerance = 5;
      const difference = Math.abs(userEstimate - result.hand1Equity);
      setIsCorrect(difference <= tolerance);
      
      setShowResult(true);
    } catch (error) {
      console.error('Error calculating equity:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleNextProblem = () => {
    generateNewScenario();
    setUserEstimate(50);
    setProblemNumber(prev => prev + 1);
  };

  const handleEstimateChange = (value: number) => {
    setUserEstimate(value);
  };

  if (!currentScenario) {
    return (
      <PageWrapper title="Hand vs. Hand">
        <div className="text-center text-gray-400">Generating scenario...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Hand vs. Hand">


      {/* Hand Display */}
      <div className="my-8">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:gap-16">
          {/* Villain Hand - appears first on mobile, left on desktop */}
          <div className="order-1 sm:order-2">
            <HandDisplay 
              title="Villain" 
              cards={currentScenario.hand2}
            />
            <div className="mt-4 text-2xl font-bold text-gray-400 text-center">
              {showResult && currentResult 
                ? `${Math.round(currentResult.hand2Equity)}%`
                : `${Math.round(100 - userEstimate)}%`
              }
            </div>
          </div>

          {/* Hero Hand - appears second on mobile, right on desktop */}
          <div className="order-2 sm:order-1">
            <HandDisplay 
              title="Hero" 
              cards={currentScenario.hand1}
            />
            <div className="mt-4 text-2xl font-bold text-blue-400 text-center">
              {showResult && currentResult 
                ? `${Math.round(currentResult.hand1Equity)}%`
                : `${Math.round(userEstimate)}%`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Equity Estimation */}
      <div className="mb-8">
        <EquitySlider 
          value={userEstimate} 
          onChange={handleEstimateChange}
          correctAnswer={currentResult?.hand1Equity}
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
              disabled={isCalculating}
              isLoading={isCalculating}
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
