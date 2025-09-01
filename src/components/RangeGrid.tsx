'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface RangeGridProps {
  mode: 'study' | 'test' | 'readonly';
  selectedRange?: Record<string, string>; // hand -> action mapping
  onHandClick?: (hand: string, action: string) => void;
  selectedAction?: string; // For test mode: which action is currently selected
  className?: string;
  showResults?: boolean;
  correctActions?: Record<string, string>; // hand -> correct action mapping
  showLegend?: boolean; // Whether to show the legend
}

export default function RangeGrid({
  mode,
  selectedRange = {},
  onHandClick,
  selectedAction = 'raise',
  className = '',
  showResults = false,
  correctActions = {},
  showLegend = true
}: RangeGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  
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
      setIsDragging(true);
      handleHandClick(hand);
    }
  }, [mode, handleHandClick]);

  const handleMouseEnter = useCallback((hand: string) => {
    if (mode === 'test' && isDragging && onHandClick) {
      onHandClick(hand, selectedAction);
    }
  }, [mode, isDragging, onHandClick, selectedAction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, hand: string) => {
    if (mode === 'test') {
      e.preventDefault(); // Prevent scrolling
      setIsTouchDragging(true);
      handleHandClick(hand);
    }
  }, [mode, handleHandClick]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (mode === 'test' && isTouchDragging && gridRef.current) {
      e.preventDefault(); // Prevent scrolling
      
      // Get touch position relative to the grid
      const touch = e.touches[0];
      const gridRect = gridRef.current.getBoundingClientRect();
      const x = touch.clientX - gridRect.left;
      const y = touch.clientY - gridRect.top;
      
      // Find which cell the touch is over
      const cellSize = gridRect.width / 13; // 13 columns
      const colIndex = Math.floor(x / cellSize);
      const rowIndex = Math.floor(y / cellSize);
      
      // Ensure indices are within bounds
      if (colIndex >= 0 && colIndex < 13 && rowIndex >= 0 && rowIndex < 13) {
        const rank = ranks[rowIndex];
        const colRank = ranks[colIndex];
        let hand = '';
        
        if (rowIndex === colIndex) {
          hand = rank + colRank;
        } else if (rowIndex < colIndex) {
          hand = rank + colRank + 's';
        } else {
          hand = colRank + rank + 'o';
        }
        
        // Paint the cell
        if (onHandClick) {
          onHandClick(hand, selectedAction);
        }
      }
    }
  }, [mode, isTouchDragging, onHandClick, selectedAction, ranks]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (mode === 'test') {
      e.preventDefault();
      setIsTouchDragging(false);
    }
  }, [mode]);

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchEnd = () => {
      setIsTouchDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  const isInteractive = mode === 'test';

  return (
    <div className={`w-full ${className}`}>
      {/* Grid Container - responsive sizing */}
      <div className="w-full flex justify-center">
        <div 
          ref={gridRef}
          className="grid grid-cols-13 w-full max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
          style={{ touchAction: 'none' }} // Prevent default touch behaviors
        >
          {/* Grid Rows */}
          {ranks.map((rank, rowIndex) => (
            <div key={rank} className="contents">
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
                      aspect-square w-full max-w-[32px] sm:max-w-[40px] cursor-pointer border border-gray-700
                      transition-all duration-150 ease-in-out select-none relative
                      ${isSelected ? getHandColor(hand) : 'bg-gray-800 hover:bg-gray-700'}
                      ${isInteractive ? 'hover:scale-110' : ''}
                      ${isInteractive ? 'touch-manipulation' : ''}
                    `}
                    data-hand={hand}
                    onMouseDown={() => handleMouseDown(hand)}
                    onMouseEnter={() => handleMouseEnter(hand)}
                    onMouseUp={handleMouseUp}
                    onTouchStart={(e) => handleTouchStart(e, hand)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
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
      {showLegend && (
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
      )}
    </div>
  );
}
