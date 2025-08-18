'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import BoardDisplay from '../../components/BoardDisplay';
import HandSelectionGrid from '../../components/HandSelectionGrid';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { WhoWinsProblemManager } from '../../utils/whoWinsProblemManager';
import { WhoWinsProblem, WhoWinsResult } from '../../types/whoWinsProblems';

export default function WhoWinsPage() {
  const [problemManager] = useState(() => new WhoWinsProblemManager());
  const [currentProblem, setCurrentProblem] = useState<WhoWinsProblem | null>(null);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<WhoWinsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial problem
    const problem = problemManager.getRandomProblem();
    setCurrentProblem(problem);
    
    // Reset state
    setSelectedHandIndex(null);
    setShowResult(false);
    setResult(null);
    setError(null);
  }, [problemManager]);

  const handleSubmit = async () => {
    if (selectedHandIndex === null || !currentProblem) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const problemResult = await problemManager.submitAnswer(selectedHandIndex);
      if (problemResult) {
        setResult(problemResult);
        setShowResult(true);
      } else {
        setError('Failed to evaluate answer. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while evaluating your answer.');
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextProblem = () => {
    const problem = problemManager.getRandomProblem();
    setCurrentProblem(problem);
    
    // Reset state
    setSelectedHandIndex(null);
    setShowResult(false);
    setResult(null);
    setError(null);
  };

  const handleHandSelect = (index: number) => {
    setSelectedHandIndex(index);
  };

  if (!currentProblem) {
    return (
      <PageWrapper title="">
        <div className="text-center text-gray-300">Loading...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Who Wins?">
      {/* Board Display */}
      <div className="my-8">
        <BoardDisplay board={currentProblem.board} />
      </div>

      {/* Hand Selection Grid */}
      <div className="mb-8">
        <HandSelectionGrid
          playerHands={currentProblem.playerHands}
          selectedHandIndex={selectedHandIndex}
          onHandSelect={handleHandSelect}
          correctAnswerIndex={result?.correctAnswer ?? null}
          tieIndices={result?.tieIndices ?? []} // Pass tie indices for proper highlighting
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 text-center">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {/* Submit/Next Button */}
      <div className="mb-8">
        <div className="text-center">
          {!showResult ? (
            <SubmitButton 
              onSubmit={handleSubmit}
              disabled={selectedHandIndex === null || isLoading}
            />
          ) : (
            <NextProblemButton 
              onNextProblem={handleNextProblem}
            />
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center text-gray-400 text-sm">
          Evaluating hands...
        </div>
      )}
    </PageWrapper>
  );
}
