import PokerCard from './PokerCard';
import type { Combo } from '../utils/lib/models';

interface HandDisplayProps {
  title: string;
  cards: Combo;
  className?: string;
}

export default function HandDisplay({ title, cards, className = "" }: HandDisplayProps) {
  const [card1, card2] = cards;
  
  return (
    <div className={`text-center ${className}`}>
      <h3 className="text-lg font-medium text-gray-300 mb-4">{title}</h3>
      <div className="flex space-x-2 justify-center">
        <PokerCard card={card1} />
        <PokerCard card={card2} />
      </div>
    </div>
  );
}
