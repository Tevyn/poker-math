import React from 'react';
import PlayerHandCard from './PlayerHandCard';
import { PlayerHand } from '../types/whoWinsProblems';

interface HandSelectionGridProps {
  playerHands: PlayerHand[];
  selectedHandIndex: number | null;
  onHandSelect: (index: number) => void;
  correctAnswerIndex: number | null;
  className?: string;
}

export default function HandSelectionGrid({ 
  playerHands, 
  selectedHandIndex, 
  onHandSelect, 
  correctAnswerIndex,
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
            onClick={() => onHandSelect(index)}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
