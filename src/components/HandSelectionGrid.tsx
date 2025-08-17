import React from 'react';
import PlayerHandCard from './PlayerHandCard';
import { PlayerHand } from '../types/whoWinsProblems';

interface HandSelectionGridProps {
  playerHands: PlayerHand[];
  selectedHandIndex: number | null;
  onHandSelect: (index: number) => void;
  correctAnswerIndex: number | null;
  tieIndices?: number[]; // Add tie indices for handling multiple winners
  className?: string;
}

export default function HandSelectionGrid({ 
  playerHands, 
  selectedHandIndex, 
  onHandSelect, 
  correctAnswerIndex,
  tieIndices = [], // Default to empty array
  className = "" 
}: HandSelectionGridProps) {
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {playerHands.map((playerHand, index) => (
          <PlayerHandCard
            key={playerHand.id}
            playerHand={playerHand}
            isSelected={selectedHandIndex === index}
            isCorrectAnswer={correctAnswerIndex === index}
            isWinner={correctAnswerIndex === index || tieIndices.includes(index)} // Check if this hand is a winner
            onClick={() => onHandSelect(index)}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
