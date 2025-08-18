'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import HandDisplay from '../../components/HandDisplay';
import HandPracticeRow from '../../components/HandPracticeRow';
import SubmitButton from '../../components/SubmitButton';
import NextProblemButton from '../../components/NextProblemButton';
import { generateHandPracticeQuestion, checkHandPracticeAnswer } from '../../utils/rangeUtils';
import { HandPracticeQuestion } from '../../types/rangeTypes';
import { rangeData } from '../../data/rangeData';
import { generateRandomWhoWinsProblem } from '../../utils/dynamicProblemGenerator';

// Helper function to convert WhoWins hand format to card objects for display
function parseHandFromWhoWins(handCards: [string, string]): [{ rank: string; suit: string }, { rank: string; suit: string }] {
  const [card1, card2] = handCards;
  
  const parseCard = (cardString: string): { rank: string; suit: string } => {
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
  };
  
  return [parseCard(card1), parseCard(card2)];
}

export default function HandPracticePage() {
  const [selectedCategory, setSelectedCategory] = useState('open_raises');
  const [currentQuestion, setCurrentQuestion] = useState<HandPracticeQuestion | null>(null);
  const [currentHandCards, setCurrentHandCards] = useState<[string, string] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; accuracy: number } | null>(null);

  useEffect(() => {
    // Get initial question
    const question = generateHandPracticeQuestion();
    setCurrentQuestion(question);
    
    // Generate initial hand cards using WhoWins utilities
    const handCards = generateRandomHandFromWhoWins();
    setCurrentHandCards(handCards);
    
    // Reset state
    setUserAnswers({});
    setShowResult(false);
    setResult(null);
  }, []);

  // Function to generate a random hand using WhoWins utilities
  const generateRandomHandFromWhoWins = (): [string, string] => {
    const problem = generateRandomWhoWinsProblem();
    // Extract the first player's hand
    return problem.playerHands[0].cards;
  };

  // Function to convert WhoWins hand format to range format
  const convertHandCardsToRangeFormat = (handCards: [string, string]): string => {
    const [card1, card2] = handCards;
    const rank1 = card1[0];
    const rank2 = card2[0];
    const suit1 = card1[1];
    const suit2 = card2[1];
    
    if (rank1 === rank2) {
      return rank1 + rank2; // Pocket pair
    } else if (suit1 === suit2) {
      // Suited - check if ranks are in correct order
      const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
      const rank1Index = ranks.indexOf(rank1);
      const rank2Index = ranks.indexOf(rank2);
      
      if (rank1Index < rank2Index) {
        return rank1 + rank2 + 's';
      } else {
        return rank2 + rank1 + 's';
      }
    } else {
      // Offsuit - check if ranks are in correct order
      const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
      const rank1Index = ranks.indexOf(rank1);
      const rank2Index = ranks.indexOf(rank2);
      
      if (rank1Index < rank2Index) {
        return rank1 + rank2 + 'o';
      } else {
        return rank2 + rank1 + 'o';
      }
    }
  };

  // Function to get correct action for a hand in a range
  const getCorrectAction = (hand: string, categoryId: string, rangeId: string): string => {
    const range = rangeData[categoryId]?.ranges[rangeId];
    if (!range) return 'fold';
    
    if (range.range.raise && range.range.raise.includes(hand)) {
      return 'raise';
    } else if (range.range.call && range.range.call.includes(hand)) {
      return 'call';
    }
    return 'fold';
  };

  // Get available categories and ranges for the selected category
  const categories = Object.keys(rangeData);
  const ranges = Object.keys(rangeData[selectedCategory]?.ranges || {});

  const handleAnswerSelect = (rangeId: string, action: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [rangeId]: action
    }));
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;
    
    const checkResult = checkHandPracticeAnswer(
      currentQuestion.hand,
      userAnswers,
      currentQuestion.correctActions
    );
    
    setResult(checkResult);
    setShowResult(true);
  };

  const handleNextHand = () => {
    // Generate a new random hand using WhoWins utilities
    const handCards = generateRandomHandFromWhoWins();
    const hand = convertHandCardsToRangeFormat(handCards);
    
    // Create a new question with the new hand
    const correctActions: Record<string, string> = {};
    Object.keys(rangeData).forEach(categoryId => {
      Object.keys(rangeData[categoryId].ranges).forEach(rangeId => {
        const action = getCorrectAction(hand, categoryId, rangeId);
        correctActions[rangeId] = action;
      });
    });
    
    const question = { hand, correctActions };
    setCurrentQuestion(question);
    setCurrentHandCards(handCards);
    
    // Reset state
    setUserAnswers({});
    setShowResult(false);
    setResult(null);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Reset state when category changes
    setUserAnswers({});
    setShowResult(false);
    setResult(null);
  };

  if (!currentQuestion) {
    return (
      <PageWrapper title="">
        <div className="text-center text-gray-300">Loading...</div>
      </PageWrapper>
    );
  }

  // Get range names for the selected category only
  const rangeNames: Record<string, string> = {};
  Object.keys(rangeData[selectedCategory]?.ranges || {}).forEach(rangeId => {
    rangeNames[rangeId] = rangeData[selectedCategory].ranges[rangeId].name;
  });

  return (
    <PageWrapper title="Hand Practice">
      {/* Category Selection */}
      <div className="mb-8 max-w-md mx-auto">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
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
      </div>

      {/* Hand Display */}
      <div className="my-8">
        <div className="text-center">
          {currentHandCards && (
            <HandDisplay 
              title="" 
              cards={parseHandFromWhoWins(currentHandCards)} 
            />
          )}
        </div>
      </div>

      {/* Range Practice Rows */}
      <div className="mb-8 max-w-md mx-auto">
        {/* Quick Action Buttons */}
        <div className="flex justify-end space-x-4 mb-4">
          <button
            onClick={() => {
              const newAnswers: Record<string, string> = {};
              Object.keys(rangeData[selectedCategory]?.ranges || {}).forEach(rangeId => {
                newAnswers[rangeId] = 'raise';
              });
              setUserAnswers(newAnswers);
            }}
            disabled={showResult}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white rounded-lg font-semibold transition-colors text-sm"
          >
            Raise All
          </button>
          <button
            onClick={() => {
              const newAnswers: Record<string, string> = {};
              Object.keys(rangeData[selectedCategory]?.ranges || {}).forEach(rangeId => {
                newAnswers[rangeId] = 'fold';
              });
              setUserAnswers(newAnswers);
            }}
            disabled={showResult}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white rounded-lg font-semibold transition-colors text-sm"
          >
            Fold All
          </button>
        </div>
        
        {Object.keys(rangeData[selectedCategory]?.ranges || {}).map((rangeId) => {
          const correctAction = currentQuestion.correctActions[rangeId] || 'fold';
          return (
            <HandPracticeRow
              key={rangeId}
              rangeName={rangeNames[rangeId] || rangeId}
              userAnswer={userAnswers[rangeId] || null}
              correctAnswer={correctAction}
              onAnswerSelect={(action) => handleAnswerSelect(rangeId, action)}
              showResult={showResult}
            />
          );
        })}
      </div>

      {/* Submit/Next Button */}
      <div className="mb-8">
        <div className="text-center">
          {!showResult ? (
            <SubmitButton 
              onSubmit={handleSubmit}
              disabled={Object.keys(userAnswers).length === 0}
            />
          ) : (
            <NextProblemButton 
              onNextProblem={handleNextHand}
            />
          )}
        </div>
      </div>

      {/* Result Display */}
      {showResult && result && result.isCorrect && (
        <div className="text-center mb-8">
          <div className="text-xl font-bold text-green-400">
            Perfect!
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
