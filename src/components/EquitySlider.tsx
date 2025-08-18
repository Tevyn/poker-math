import React from 'react';

interface EquitySliderProps {
  value: number;
  onChange: (value: number) => void;
  correctAnswer?: number;
  showResult?: boolean;
  isCorrect?: boolean;
  className?: string;
  // Mode-based configuration
  mode: 'pot-odds' | 'percentage';
  // Legacy props for backward compatibility and pot-odds customization
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
  mode,
  // Legacy props for backward compatibility and pot-odds customization
  min,
  max,
  step,
  labelFormat,
  tolerance,
  customTicks,
  customLabels
}: EquitySliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  // For percentage mode, use the original working logic
  if (mode === 'percentage') {
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

  // For pot-odds mode, use the existing flexible logic
  const config = {
    min: min || 1,
    max: max || 12,
    step: step || 0.1,
    labelFormat: labelFormat || 'ratio',
    tolerance: tolerance || 0.5,
    displayMin: min || 1,
    displayMax: max || 12
  };

  // Calculate tolerance range based on current value and tolerance
  const toleranceLeft = Math.max(config.min, value - config.tolerance);
  const toleranceRight = Math.min(config.max, value + config.tolerance);

  // Generate ticks and labels for pot-odds mode
  const ticks = customTicks || Array.from(
    { length: Math.floor((config.max - config.min) / config.step) + 1 }, 
    (_, i) => config.min + i * config.step
  );
  const labels = customLabels || ticks.map(tick => 
    config.labelFormat === 'percentage' ? `${Math.round(tick)}%` : `${tick}:1`
  );

  // Calculate positions as percentages of the display range
  const getPositionPercentage = (value: number) => {
    return ((value - config.displayMin) / (config.displayMax - config.displayMin)) * 100;
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
            {config.labelFormat === 'percentage' ? `${Math.round(correctAnswer)}%` : `${correctAnswer}:1`}
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
          min={config.min}
          max={config.max}
          step={config.step}
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
