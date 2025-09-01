import React from 'react';
import PokerCard from './PokerCard';
import type { Card } from '../utils/lib/models';

interface BoardDisplayProps {
  board: Card[];
  className?: string;
}

export default function BoardDisplay({ board, className = "" }: BoardDisplayProps) {
  // Adjust spacing based on number of cards
  const getSpacingClass = (cardCount: number) => {
    if (cardCount <= 3) return "space-x-2";
    if (cardCount === 4) return "space-x-1";
    return "space-x-1"; // 5 cards
  };

  // Adjust card size for larger boards on smaller screens
  const getCardSizeClass = (cardCount: number) => {
    if (cardCount <= 3) return "w-12 h-16";
    if (cardCount === 4) return "w-11 h-15";
    return "w-10 h-14"; // 5 cards - slightly smaller to fit better
  };

  return (
    <div className={`text-center ${className}`}>
      <h3 className="text-lg font-medium text-gray-300 mb-4">Board</h3>
      <div className={`flex justify-center ${getSpacingClass(board.length)} flex-wrap`}>
        {board.map((card, index) => (
          <PokerCard 
            key={index} 
            card={card}
            className={`${getCardSizeClass(board.length)} text-lg`}
          />
        ))}
      </div>
    </div>
  );
}
