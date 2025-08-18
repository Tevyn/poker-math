'use client';

import { useState, useCallback, useEffect } from 'react';

interface RangeGridProps {
  mode: 'study' | 'test' | 'readonly';
  selectedRange?: Record<string, string>; // hand -> action mapping
  onHandClick?: (hand: string, action: string) => void;
  selectedAction?: string; // For test mode: which action is currently selected
  className?: string;
  showResults?: boolean;
  correctActions?: Record<string, string>; // hand -> correct action mapping
}

export default function RangeGrid({
  mode,
  selectedRange = {},
  onHandClick,
  selectedAction = 'raise',
  className = '',
  showResults = false,
  correctActions = {}
}: RangeGridProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const getHandAction = useCallback((hand: string): string => {
    return selectedRange[hand] || 'fold';
  }, [selectedRange]);

  const getHandColor = (hand: string): string => {
    const action = getHandAction(hand);
    switch (action) {
      case 'raise':
        return 'bg-red-600 hover:bg-red-700';
      case 'call':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'fold':
        return 'bg-gray-700 hover:bg-gray-600';
      default:
        return 'bg-gray-700 hover:bg-gray-600';
    }
  };

  const handleHandClick = useCallback((hand: string) => {
    if (mode === 'test' && onHandClick) {
      const currentAction = getHandAction(hand);
      const newAction = currentAction === selectedAction ? 'fold' : selectedAction;
      onHandClick(hand, newAction);
    }
  }, [mode, onHandClick, selectedAction, getHandAction]);

  const handleMouseDown = useCallback((hand: string) => {
    if (mode === 'test') {
      setIsMouseDown(true);
      // Paint the cell on mouse down
      const currentAction = getHandAction(hand);
      const newAction = currentAction === selectedAction ? 'fold' : selectedAction;
      if (onHandClick) {
        onHandClick(hand, newAction);
      }
    }
  }, [mode, onHandClick, selectedAction, getHandAction]);

  const handleMouseEnter = useCallback((hand: string) => {
    if (mode === 'test' && isMouseDown && onHandClick) {
      // Paint cells as mouse moves over them while held down
      const currentAction = getHandAction(hand);
      const newAction = currentAction === selectedAction ? 'fold' : selectedAction;
      onHandClick(hand, newAction);
    }
  }, [mode, isMouseDown, onHandClick, selectedAction, getHandAction]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  // Global mouse up handler to ensure mouse down state is reset
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const handleTouchStart = useCallback((hand: string) => {
    if (mode === 'test') {
      handleHandClick(hand);
    }
  }, [mode, handleHandClick]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (mode === 'test' && isMouseDown) {
      e.preventDefault();
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.getAttribute('data-hand')) {
        const hand = element.getAttribute('data-hand')!;
        if (onHandClick) {
          onHandClick(hand, selectedAction);
        }
      }
    }
  }, [mode, isMouseDown, onHandClick, selectedAction]);

  const isInteractive = mode === 'test';

  return (
    <div className={`relative ${className}`}>
      {/* Grid Container */}
      <div className="relative overflow-x-auto">
        <div className="inline-block min-w-max">

          {/* Grid Rows */}
          {ranks.map((rank, rowIndex) => (
            <div key={rank} className="flex items-center">
              {/* Grid Cells */}
              {ranks.map((colRank, colIndex) => {
                let hand = '';
                
                if (rowIndex === colIndex) {
                  // Pocket pair (diagonal)
                  hand = rank + colRank;
                } else if (rowIndex < colIndex) {
                  // Suited hand (above diagonal)
                  hand = rank + colRank + 's';
                } else {
                  // Offsuit hand (below diagonal)
                  hand = colRank + rank + 'o';
                }

                const action = getHandAction(hand);
                const isSelected = action !== 'fold';
                
                return (
                  <div
                    key={`${rank}-${colRank}`}
                    className={`
                      w-8 h-8 border border-gray-600 rounded-sm cursor-pointer
                      transition-all duration-150 ease-in-out select-none relative
                      ${isSelected ? getHandColor(hand) : 'bg-gray-800 hover:bg-gray-700'}
                      ${isInteractive ? 'hover:scale-110' : ''}
                      ${isInteractive ? 'touch-manipulation' : ''}
                    `}
                    data-hand={hand}
                    onMouseDown={() => handleMouseDown(hand)}
                    onMouseEnter={() => handleMouseEnter(hand)}
                    onMouseUp={handleMouseUp}
                    onTouchStart={() => handleTouchStart(hand)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                    title={`${hand}: ${action}`}
                  >
                    {/* Hand Label */}
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={`
                        text-xs font-mono font-bold
                        ${isSelected ? 'text-white' : 'text-gray-400'}
                      `}>
                        {hand.length === 2 ? hand : hand}
                      </span>
                    </div>
                    
                    {/* Results Overlay */}
                    {showResults && (
                      <div className="absolute bottom-0 right-0 pointer-events-none">
                        {(() => {
                          const userAction = selectedRange[hand] || 'fold';
                          const correctAction = correctActions[hand] || 'fold';
                          const isCorrect = userAction === correctAction;
                          const shouldHaveAction = correctAction !== 'fold';
                          
                          // Show results on all cells that should have actions
                          if (shouldHaveAction) {
                            if (isCorrect) {
                              return <span className="text-green-400 text-sm font-bold [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">✓</span>;
                            } else {
                              return <span className="text-red-400 text-sm font-bold [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">✗</span>;
                            }
                          }
                          
                          // Also show X on cells where user added an action but shouldn't have
                          if (!shouldHaveAction && userAction !== 'fold') {
                            return <span className="text-red-400 text-sm font-bold [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">✗</span>;
                          }
                          
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
          <span className="text-gray-300">Raise</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
          <span className="text-gray-300">Call</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
          <span className="text-gray-300">Fold</span>
        </div>
      </div>


    </div>
  );
}
