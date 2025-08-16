import React from 'react';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
  className?: string;
}

export default function SubmitButton({ onSubmit, disabled = false, className = "" }: SubmitButtonProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled}
      className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none ${className}`}
    >
      Submit Estimate
    </button>
  );
}
