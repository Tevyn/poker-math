import type { Card } from '../utils/lib/models';
import { SUITS_TO_HTML } from '../utils/lib/constants';

interface PokerCardProps {
  card: Card;
  className?: string;
}

export default function PokerCard({ card, className = "" }: PokerCardProps) {
  // Parse Card format (e.g., "As" -> rank: "A", suit: "s")
  const rank = card.slice(0, -1);
  const suit = card.slice(-1) as keyof typeof SUITS_TO_HTML;
  const suitSymbol = SUITS_TO_HTML[suit];
  
  const isRedSuit = suit === 'h' || suit === 'd';
  
  return (
    <div className={`w-16 h-20 bg-white rounded-lg border-2 border-gray-600 flex items-center justify-center text-black font-bold shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
      <div className={`text-3xl font-bold ${isRedSuit ? 'text-red-600' : 'text-black'}`}>
        {rank}{suitSymbol}
      </div>
    </div>
  );
}
