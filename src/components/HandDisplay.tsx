import PokerCard from './PokerCard';

interface Card {
  rank: string;
  suit: string;
}

interface HandDisplayProps {
  title: string;
  cards: [Card, Card];
  className?: string;
}

export default function HandDisplay({ title, cards, className = "" }: HandDisplayProps) {
  const [card1, card2] = cards;
  
  return (
    <div className={`text-center ${className}`}>
      <h3 className="text-lg font-medium text-gray-300 mb-4">{title}</h3>
      <div className="flex space-x-2 justify-center">
        <PokerCard rank={card1.rank} suit={card1.suit} />
        <PokerCard rank={card2.rank} suit={card2.suit} />
      </div>
    </div>
  );
}
