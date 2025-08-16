import React from 'react';

interface EquitySliderProps {
  value: number;
  onChange: (value: number) => void;
  correctAnswer?: number;
  showResult?: boolean;
  isCorrect?: boolean;
  className?: string;
}

export default function EquitySlider({ 
  value, 
  onChange, 
  correctAnswer, 
  showResult = false, 
  isCorrect = false,
  className = "" 
}: EquitySliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Hidden placeholder to maintain spacing */}
      <div className="mb-4 text-center">
        <div className="text-sm font-medium text-transparent">
          Placeholder
        </div>
      </div>

      {/* Correct Answer Label - only show after submission */}
      {showResult && correctAnswer !== undefined && (
        <div className="relative mb-4">
          <div 
            className={`absolute text-sm font-medium transform -translate-x-1/2 ${
              isCorrect ? 'text-green-400' : 'text-yellow-400'
            }`}
            style={{
              left: `${correctAnswer}%`,
              bottom: '100%'
            }}
          >
            {Math.round(correctAnswer)}%
          </div>
        </div>
      )}

      <div className="relative mb-6">
        {/* Slider Track */}
        <div className="w-full h-3 bg-gray-700 rounded-full">
          {/* Tolerance Range Indicator */}
          <div 
            className="absolute h-3 bg-blue-200 rounded-full opacity-30"
            style={{
              left: `${Math.max(0, value - 5)}%`,
              width: `${Math.min(100, value + 5) - Math.max(0, value - 5)}%`
            }}
          />
          
          {/* Current Value Indicator */}
          <div 
            className={`absolute h-3 rounded-full transition-all duration-300 ${
              showResult ? 'bg-blue-500' : 'bg-blue-500'
            }`}
            style={{
              left: `${value}%`,
              width: '2px',
              transform: 'translateX(-50%)'
            }}
          />
          
          {/* Correct Answer Indicator (only show after submission) */}
          {showResult && correctAnswer !== undefined && (
            <div 
              className={`absolute h-3 rounded-full ${
                isCorrect ? 'bg-green-400' : 'bg-yellow-400'
              }`}
              style={{
                left: `${correctAnswer}%`,
                width: '4px',
                transform: 'translateX(-50%)'
              }}
            />
          )}
        </div>

        {/* 5% Ticks */}
        <div className="relative w-full mt-0">
          {Array.from({ length: 21 }, (_, i) => i * 5).map((tick) => (
            <div
              key={tick}
              className="absolute w-px h-2 bg-gray-500"
              style={{
                left: `${tick}%`,
                transform: 'translateX(-50%)'
              }}
            />
          ))}
        </div>

        {/* Percentage Labels below tick marks */}
        <div className="relative w-full mt-3">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
            <div
              key={tick}
              className="absolute text-xs text-gray-400 pt-1"
              style={{
                left: `${tick}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {tick}%
            </div>
          ))}
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min="5"
          max="95"
          step="1"
          value={value}
          onChange={handleSliderChange}
          onMouseDown={() => {}}
          onMouseUp={() => {}}
          onTouchStart={() => {}}
          onTouchEnd={() => {}}
          className="absolute top-0 w-full h-3 opacity-0 cursor-pointer"
        />
      </div>

      {/* Hidden placeholder to maintain spacing */}
      <div className="text-center mt-3">
        <div className="text-sm text-transparent mb-1">Placeholder</div>
        <div className="text-lg font-bold text-transparent">
          Placeholder
        </div>
      </div>
    </div>
  );
}
