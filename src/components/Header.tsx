'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-100 hover:text-gray-300 transition-colors">
              Poker Math
            </Link>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-gray-100 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute top-0 right-0 w-full h-full bg-gray-900 shadow-xl border-l border-gray-800 overflow-y-auto sm:w-80">
            {/* Close Button */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-100 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 pb-6 space-y-8">
              {/* Estimating Equity Category */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Estimating Equity
                </h3>
                <div className="space-y-3">
                  <Link href="/hand-vs-hand" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Hand vs. Hand
                    </div>
                  </Link>
                  <Link href="/hand-vs-range" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Hand vs. Range
                    </div>
                  </Link>
                  <div className="text-gray-500 py-2 text-lg">
                    Range vs. Range
                  </div>
                </div>
              </div>

              {/* Preflop Category */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Preflop
                </h3>
                <div className="space-y-3">
                  <Link href="/range-study" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Range Study
                    </div>
                  </Link>
                  <Link href="/range-practice" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Range Practice
                    </div>
                  </Link>
                  <Link href="/hand-practice" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Hand Practice
                    </div>
                  </Link>
                </div>
              </div>

              {/* Hand Evaluation Category */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Hand Evaluation
                </h3>
                <div className="space-y-3">
                  <Link href="/who-wins" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Who Wins
                    </div>
                  </Link>
                  <div className="text-gray-500 py-2 text-lg">
                    Best Hand
                  </div>
                </div>
              </div>

              {/* Metrics Category */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Metrics
                </h3>
                <div className="space-y-3">
                  <Link href="/breakeven" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Breakeven Facing A Raise
                    </div>
                  </Link>
                  <Link href="/pot-odds" className="block" onClick={() => setIsMenuOpen(false)}>
                    <div className="text-gray-100 hover:text-gray-300 transition-colors py-2 text-lg">
                      Pot Odds
                    </div>
                  </Link>
                  <div className="text-gray-500 py-2 text-lg">
                    Stack to Pot Ratio (SPR)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
