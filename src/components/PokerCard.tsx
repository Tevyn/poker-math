interface PokerCardProps {
  rank: string;
  suit: string;
  className?: string;
}

export default function PokerCard({ rank, suit, className = "" }: PokerCardProps) {
  const isRedSuit = suit === '♥' || suit === '♦';
  
  return (
    <div className={`w-16 h-20 bg-white rounded-lg border-2 border-gray-600 flex items-center justify-center text-black font-bold shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
      <div className={`text-3xl font-bold ${isRedSuit ? 'text-red-600' : 'text-black'}`}>
        {rank}{suit}
      </div>
    </div>
  );
}
