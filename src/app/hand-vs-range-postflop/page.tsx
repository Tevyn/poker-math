'use client';

import { useState, useEffect, useMemo } from 'react';
import PageWrapper from '../../components/PageWrapper';
import HandDisplay from '../../components/HandDisplay';
import BoardDisplay from '../../components/BoardDisplay';
import EquitySlider from '../../components/EquitySlider';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { generateRandomHand, generateRandomBoard } from '../../utils/simpleRandomHands';
import { calculateHandVsRangeEquity, formatHandVsRangeResult } from '../../utils/handVsRangeEquity';
import { convertRangeToRangeGridFormat } from '../../utils/rangeConverter';
import { rangeData, getCategoryIds, getRangeIds, getRange } from '../../data/rangeData';
import RangeGrid from '../../components/RangeGrid';
import type { HandVsRangeScenario, HandVsRangeResult } from '../../types/handVsRange';
import type { PokerRange } from '../../types/rangeTypes';

export default function HandVsRangePostflopPage() {
  const [currentScenario, setCurrentScenario] = useState<HandVsRangeScenario | null>(null);
  const [userEstimate, setUserEstimate] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<HandVsRangeResult | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [problemNumber, setProblemNumber] = useState(1);
  
  // Range selection state
  const [selectedCategory, setSelectedCategory] = useState('open_raises');
  const [selectedRange, setSelectedRange] = useState('lj');
  
  // Board size selection state
  const [boardSize, setBoardSize] = useState<'flop' | 'turn' | 'river'>('flop');

  // Get available categories and ranges
  const categories = useMemo(() => getCategoryIds(), []);
  const ranges = useMemo(() => getRangeIds(selectedCategory), [selectedCategory]);

  // Get the selected villain range
  const villainRange: PokerRange | null = useMemo(() => {
    const rangeData = getRange(selectedCategory, selectedRange);
    return rangeData?.range || null;
  }, [selectedCategory, selectedRange]);
  
  // Convert range to RangeGrid format
  const villainRangeGridFormat = useMemo(() => {
    if (!villainRange) return {};
    return convertRangeToRangeGridFormat(villainRange);
  }, [villainRange]);

  // Get the display name for the current range
  const currentRangeName = useMemo(() => {
    const category = rangeData[selectedCategory];
    if (!category) return '';
    
    const range = category.ranges[selectedRange];
    return range ? range.name : '';
  }, [selectedCategory, selectedRange]);

  // Generate initial scenario
  useEffect(() => {
    generateNewScenario();
  }, [villainRange, boardSize]);

  const generateNewScenario = () => {
    if (!villainRange) return;
    
    const heroHand = generateRandomHand();
    
    // Generate board cards based on selected board size
    const boardCardCount = boardSize === 'flop' ? 3 : boardSize === 'turn' ? 4 : 5;
    const board = generateRandomBoard(boardCardCount, heroHand);
    
    const scenario: HandVsRangeScenario = {
      heroHand,
      villainRange,
      board,
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
      
      // Calculate equity using our hand vs range utility
      const equity = await calculateHandVsRangeEquity(
        currentScenario.heroHand,
        currentScenario.villainRange,
        currentScenario.board
      );
      
      // Ensure minimum loading time of 500ms
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
      }
      
      // Format result for UI display
      const formattedResult = formatHandVsRangeResult(equity);
      setCurrentResult(formattedResult);
      
      // Check if user's estimate is correct (within 5 percentage points)
      const tolerance = 5;
      const difference = Math.abs(userEstimate - formattedResult.heroEquity);
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

  if (!currentScenario || !villainRange) {
    return (
      <PageWrapper title="Hand vs. Range: Postflop">
        <div className="text-center text-gray-400">Generating scenario...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Hand vs. Range: Postflop">
      {/* Range Selection Controls */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                // Reset to first available range when category changes
                const newRanges = getRangeIds(e.target.value);
                setSelectedRange(newRanges[0] || '');
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((categoryId) => {
                const category = rangeData[categoryId];
                return (
                  <option key={categoryId} value={categoryId}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Range Selection */}
          <div>
            <label htmlFor="range" className="block text-sm font-medium text-gray-300 mb-2">
              Position
            </label>
            <select
              id="range"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ranges.map((rangeId) => {
                const range = rangeData[selectedCategory]?.ranges[rangeId];
                return (
                  <option key={rangeId} value={rangeId}>
                    {range?.name || rangeId}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Board Size Selection */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Board Size
          </label>
          <div className="flex justify-center space-x-4">
            {(['flop', 'turn', 'river'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setBoardSize(size)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  boardSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)} ({size === 'flop' ? '3' : size === 'turn' ? '4' : '5'} cards)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Board Display */}
      <div className="mb-8">
        <BoardDisplay board={currentScenario.board} />
      </div>

      {/* Hand Display */}
      <div className="my-8">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:gap-16">
          {/* Villain Range - appears first on mobile, left on desktop */}
          <div className="order-1 sm:order-2">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Villain ({currentRangeName})</h3>
            </div>
            <RangeGrid
              mode="readonly"
              selectedRange={villainRangeGridFormat}
              className="max-w-xs mx-auto"
              showLegend={false}
            />
            <div className="mt-4 text-2xl font-bold text-gray-400 text-center">
              {showResult && currentResult 
                ? `${Math.round(currentResult.villainEquity)}%`
                : `${Math.round(100 - userEstimate)}%`
              }
            </div>
          </div>

          {/* Hero Hand - appears second on mobile, right on desktop */}
          <div className="order-2 sm:order-1">
            <HandDisplay 
              title="Hero" 
              cards={currentScenario.heroHand}
            />
            <div className="mt-4 text-2xl font-bold text-blue-400 text-center">
              {showResult && currentResult 
                ? `${Math.round(currentResult.heroEquity)}%`
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
          correctAnswer={currentResult?.heroEquity}
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
