import React from 'react';

interface HandPracticeRowProps {
  rangeName: string;
  userAnswer: string | null;
  correctAnswer: string;
  onAnswerSelect: (action: string) => void;
  showResult: boolean;
}

export default function HandPracticeRow({ 
  rangeName, 
  userAnswer, 
  correctAnswer, 
  onAnswerSelect, 
  showResult 
}: HandPracticeRowProps) {
  const getButtonStyle = (action: string) => {
    if (!showResult) {
      return userAnswer === action 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600';
    }
    
    // Show result styling
    if (userAnswer === action) {
      if (action === correctAnswer) {
        return 'bg-blue-600 text-white ring-2 ring-green-400 ring-opacity-75'; // Correct answer with green glow
      } else {
        return 'bg-red-600 text-white'; // Wrong answer
      }
    } else if (action === correctAnswer) {
      return 'bg-gray-700 text-gray-300 ring-2 ring-green-400 ring-opacity-75'; // Correct answer (not selected by user) with green glow
    } else {
      return 'bg-gray-700 text-gray-300'; // Not selected, not correct
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-3">
      <div className="text-gray-200 font-medium min-w-[120px]">
        {rangeName}
      </div>
      
      <div className="flex space-x-2">
        {['raise', 'call', 'fold'].map((action) => (
          <button
            key={action}
            onClick={() => onAnswerSelect(action)}
            disabled={showResult}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              getButtonStyle(action)
            } ${
              !showResult ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
