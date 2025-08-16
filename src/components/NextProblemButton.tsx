import React from 'react';

interface NextProblemButtonProps {
  onNextProblem: () => void;
  disabled?: boolean;
  className?: string;
}

export default function NextProblemButton({ onNextProblem, disabled = false, className = "" }: NextProblemButtonProps) {
  return (
    <button
      onClick={onNextProblem}
      disabled={disabled}
      className={`px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none ${className}`}
    >
      Next Problem →
    </button>
  );
}
