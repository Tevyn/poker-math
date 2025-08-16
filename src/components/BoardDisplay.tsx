import React from 'react';
import PokerCard from './PokerCard';

interface BoardDisplayProps {
  board: string[];
  className?: string;
}

// Helper function to convert card string to rank and suit
function parseCard(cardString: string): { rank: string; suit: string } {
  const rank = cardString[0];
  const suitCode = cardString[1];
  
  const suitSymbols: { [key: string]: string } = {
    'h': '♥',
    'd': '♦',
    'c': '♣',
    's': '♠'
  };
  
  return {
    rank: rank === 'T' ? '10' : rank,
    suit: suitSymbols[suitCode] || suitCode
  };
}

export default function BoardDisplay({ board, className = "" }: BoardDisplayProps) {
  return (
    <div className={`text-center ${className}`}>
      <h3 className="text-lg font-medium text-gray-300 mb-4">Board</h3>
      <div className="flex justify-center space-x-2">
        {board.map((card, index) => {
          const { rank, suit } = parseCard(card);
          return (
            <PokerCard 
              key={index} 
              rank={rank} 
              suit={suit} 
              className="w-12 h-16 text-lg"
            />
          );
        })}
      </div>
    </div>
  );
}
