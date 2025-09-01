'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import BoardDisplay from '../../components/BoardDisplay';
import HandSelectionGrid from '../../components/HandSelectionGrid';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { generateRandomWhoWinsScenario } from '../../utils/whoWinsScenarioGenerator';
import { evaluateMultipleHands } from '../../utils/whoWinsEquity';
import type { 
  WhoWinsScenario, 
  WhoWinsScenarioResult,
  WhoWinsScenarioConfig 
} from '../../types/whoWins';

export default function WhoWinsPage() {
  const [currentScenario, setCurrentScenario] = useState<WhoWinsScenario | null>(null);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<WhoWinsScenarioResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a new scenario
  const generateNewScenario = () => {
    const config: Partial<WhoWinsScenarioConfig> = {
      numPlayers: 4,
      boardSize: 5, // River (complete board)
      includeTies: true,
    };
    
    const scenario = generateRandomWhoWinsScenario(config);
    setCurrentScenario(scenario);
    
    // Reset state
    setSelectedHandIndex(null);
    setShowResult(false);
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    // Generate initial scenario
    generateNewScenario();
  }, []);

  const handleSubmit = async () => {
    if (selectedHandIndex === null || !currentScenario) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Extract hands from player hands
      const hands = currentScenario.playerHands.map(ph => ph.cards);
      
      // Evaluate all hands
      const evaluation = evaluateMultipleHands(hands, currentScenario.board);
      
      // Create result
      const scenarioResult: WhoWinsScenarioResult = {
        scenarioId: currentScenario.id,
        userAnswer: selectedHandIndex,
        correctAnswer: evaluation.winningIndices[0], // First winner
        isCorrect: evaluation.winningIndices.includes(selectedHandIndex),
        isTie: evaluation.isTie,
        tieIndices: evaluation.winningIndices,
        winningHandRank: evaluation.winningHandRank,
        winningHandDescription: evaluation.winningHandDescription,
        allEvaluations: evaluation,
      };
      
      setResult(scenarioResult);
      setShowResult(true);
    } catch (err) {
      setError('An error occurred while evaluating your answer.');
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextProblem = () => {
    generateNewScenario();
  };

  const handleHandSelect = (index: number) => {
    setSelectedHandIndex(index);
  };

  if (!currentScenario) {
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
        <BoardDisplay board={currentScenario.board} />
      </div>

      {/* Hand Selection Grid */}
      <div className="mb-8">
        <HandSelectionGrid
          playerHands={currentScenario.playerHands}
          selectedHandIndex={selectedHandIndex}
          onHandSelect={handleHandSelect}
          correctAnswerIndex={result?.correctAnswer ?? null}
          tieIndices={result?.tieIndices ?? []}
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
