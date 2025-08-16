import React from 'react';
import { PokerProblem } from '../types/pokerProblems';
import { formatCardForDisplay } from '../utils/pokerEquity';

interface ProblemDisplayProps {
  problem: PokerProblem;
}

export default function ProblemDisplay({ problem }: ProblemDisplayProps) {
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Hand vs Hand</h2>
      
      <div className="flex items-center space-x-8">
        {/* Hand 1 */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm text-gray-600">Hand 1</div>
          <div className="flex space-x-2">
            <div className="w-16 h-20 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center text-2xl font-bold text-red-700">
              {formatCardForDisplay(problem.hand1.card1)}
            </div>
            <div className="w-16 h-20 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center text-2xl font-bold text-red-700">
              {formatCardForDisplay(problem.hand1.card2)}
            </div>
          </div>
        </div>

        {/* VS */}
        <div className="text-2xl font-bold text-gray-400">VS</div>

        {/* Hand 2 */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm text-gray-600">Hand 2</div>
          <div className="flex space-x-2">
            <div className="w-16 h-20 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-700">
              {formatCardForDisplay(problem.hand2.card1)}
            </div>
            <div className="w-16 h-20 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-700">
              {formatCardForDisplay(problem.hand2.card2)}
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-center">
        What is the equity of Hand 1 vs Hand 2?
      </div>
    </div>
  );
}
