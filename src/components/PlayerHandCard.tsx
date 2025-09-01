import React from 'react';
import PokerCard from './PokerCard';
import { PlayerHand } from '../types/whoWins';

interface PlayerHandCardProps {
  playerHand: PlayerHand;
  isSelected: boolean;
  isCorrectAnswer: boolean;
  isWinner: boolean; // New prop to handle both single winner and ties
  onClick: () => void;
  className?: string;
}

export default function PlayerHandCard({ 
  playerHand, 
  isSelected, 
  isCorrectAnswer,
  isWinner, // Use the new isWinner prop
  onClick, 
  className = "" 
}: PlayerHandCardProps) {
  const [card1, card2] = playerHand.cards;
  
  // Determine the styling based on selection and correctness
  let borderStyle = 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700';
  let textStyle = 'text-gray-300';
  
  if (isWinner) { // Use isWinner instead of isCorrectAnswer for green highlighting
    borderStyle = 'border-green-500 bg-green-900/20 shadow-lg shadow-green-500/25';
    textStyle = 'text-green-300';
  } else if (isSelected) {
    borderStyle = 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/25';
    textStyle = 'text-blue-300';
  }
  
  return (
    <div 
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105
        ${borderStyle}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="text-center mb-3">
        <h4 className={`text-sm font-medium ${textStyle}`}>
          {playerHand.name}
        </h4>
      </div>
      
      <div className="flex justify-center space-x-2">
        <PokerCard 
          card={card1}
          className="w-12 h-16 text-lg"
        />
        <PokerCard 
          card={card2}
          className="w-12 h-16 text-lg"
        />
      </div>
    </div>
  );
}
