import React from 'react';

interface ResultDisplayProps {
  userEstimate: number;
  correctAnswer: number;
  isCorrect: boolean;
  showResult: boolean;
  className?: string;
}

export default function ResultDisplay({ 
  userEstimate, 
  correctAnswer, 
  isCorrect, 
  showResult, 
  className = "" 
}: ResultDisplayProps) {
  if (!showResult) return null;

  const difference = Math.abs(userEstimate - correctAnswer);
  const tolerance = 5;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'} ${className}`}>
      <div className="text-center">
        <h3 className={`text-xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct! 🎉' : 'Incorrect 😔'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Your Estimate</div>
            <div className="text-2xl font-bold text-blue-400">{userEstimate.toFixed(1)}%</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Correct Answer</div>
            <div className="text-2xl font-bold text-green-400">{correctAnswer.toFixed(1)}%</div>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-sm text-gray-400 mb-1">Difference</div>
          <div className={`text-lg font-semibold ${difference <= tolerance ? 'text-green-400' : 'text-red-400'}`}>
            {difference.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">
            Tolerance: ±{tolerance}%
          </div>
        </div>

        {!isCorrect && (
          <div className="text-sm text-gray-300 bg-gray-700 rounded-lg p-3">
            <div className="font-medium mb-1">Your estimate was off by {difference.toFixed(1)}%</div>
            <div>You need to be within ±{tolerance}% to be correct.</div>
          </div>
        )}
      </div>
    </div>
  );
}
