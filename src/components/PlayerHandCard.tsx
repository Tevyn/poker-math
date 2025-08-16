import React from 'react';
import PokerCard from './PokerCard';
import { PlayerHand } from '../types/whoWinsProblems';

interface PlayerHandCardProps {
  playerHand: PlayerHand;
  isSelected: boolean;
  isCorrectAnswer: boolean;
  onClick: () => void;
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

export default function PlayerHandCard({ 
  playerHand, 
  isSelected, 
  isCorrectAnswer,
  onClick, 
  className = "" 
}: PlayerHandCardProps) {
  const [card1, card2] = playerHand.cards;
  const parsedCard1 = parseCard(card1);
  const parsedCard2 = parseCard(card2);
  
  // Determine the styling based on selection and correctness
  let borderStyle = 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700';
  let textStyle = 'text-gray-300';
  
  if (isCorrectAnswer) {
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
          rank={parsedCard1.rank} 
          suit={parsedCard1.suit} 
          className="w-12 h-16 text-lg"
        />
        <PokerCard 
          rank={parsedCard2.rank} 
          suit={parsedCard2.suit} 
          className="w-12 h-16 text-lg"
        />
      </div>
    </div>
  );
}
