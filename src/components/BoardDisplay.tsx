import React from 'react';
import PokerCard from './PokerCard';
import type { Card } from '../utils/lib/models';

interface BoardDisplayProps {
  board: Card[];
  className?: string;
}

export default function BoardDisplay({ board, className = "" }: BoardDisplayProps) {
  return (
    <div className={`text-center ${className}`}>
      <h3 className="text-lg font-medium text-gray-300 mb-4">Board</h3>
      <div className="flex justify-center space-x-2">
        {board.map((card, index) => (
          <PokerCard 
            key={index} 
            card={card}
            className="w-12 h-16 text-lg"
          />
        ))}
      </div>
    </div>
  );
}
