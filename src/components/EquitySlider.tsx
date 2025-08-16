import React from 'react';

interface EquitySliderProps {
  value: number;
  onChange: (value: number) => void;
  correctAnswer?: number;
  showResult?: boolean;
  isCorrect?: boolean;
  className?: string;
  // New flexible props
  min?: number;
  max?: number;
  step?: number;
  labelFormat?: 'percentage' | 'ratio';
  tolerance?: number;
  customTicks?: number[];
  customLabels?: string[];
}

export default function EquitySlider({ 
  value, 
  onChange, 
  correctAnswer, 
  showResult = false, 
  isCorrect = false,
  className = "",
  // Default values for backward compatibility
  min = 5,
  max = 95,
  step = 1,
  labelFormat = 'percentage',
  tolerance = 5,
  customTicks,
  customLabels
}: EquitySliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  // Calculate tolerance range based on current value and tolerance
  const toleranceLeft = Math.max(min, value - tolerance);
  const toleranceRight = Math.min(max, value + tolerance);
  const toleranceWidth = toleranceRight - toleranceLeft;

  // Generate ticks and labels
  const ticks = customTicks || Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step);
  const labels = customLabels || ticks.map(tick => 
    labelFormat === 'percentage' ? `${Math.round(tick)}%` : `${tick}:1`
  );

  // Calculate positions as percentages of the slider range
  const getPositionPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
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
              left: `${getPositionPercentage(correctAnswer)}%`,
              bottom: '100%'
            }}
          >
            {labelFormat === 'percentage' ? `${Math.round(correctAnswer)}%` : `${correctAnswer}:1`}
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
              left: `${getPositionPercentage(toleranceLeft)}%`,
              width: `${getPositionPercentage(toleranceRight) - getPositionPercentage(toleranceLeft)}%`
            }}
          />
          
          {/* Current Value Indicator */}
          <div 
            className={`absolute h-3 rounded-full transition-all duration-300 ${
              showResult ? 'bg-blue-500' : 'bg-blue-500'
            }`}
            style={{
              left: `${getPositionPercentage(value)}%`,
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
                left: `${getPositionPercentage(correctAnswer)}%`,
                width: '4px',
                transform: 'translateX(-50%)'
              }}
            />
          )}
        </div>

        {/* Ticks */}
        <div className="relative w-full mt-0">
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute w-px h-2 bg-gray-500"
              style={{
                left: `${getPositionPercentage(tick)}%`,
                transform: 'translateX(-50%)'
              }}
            />
          ))}
        </div>

        {/* Labels below tick marks */}
        <div className="relative w-full mt-3">
          {ticks.map((tick, index) => (
            <div
              key={tick}
              className="absolute text-xs text-gray-400 pt-1"
              style={{
                left: `${getPositionPercentage(tick)}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {labels[index]}
            </div>
          ))}
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
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
