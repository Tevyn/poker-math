import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">

        <div className="mt-8 space-y-12">
          {/* Estimating Equity Category */}
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              Estimating Equity
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/hand-vs-hand" className="block">
                <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-100">Hand vs. Hand</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Compare equity between two hands.
                    </p>
                  </div>
                </div>
              </Link>
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Hand vs. Range</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Compare equity between a hand and a range.
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Range vs. Range</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Compare equity between two ranges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preflop Category */}
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              Preflop
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Range Practice</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Recreate a range on a grid.
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Hand Practice</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Select the right action for a hand in a preflop situation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hand Evaluation Category */}
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              Hand Evaluation
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/who-wins" className="block">
                <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-100">Who Wins</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Choose which player has the winning hand.
                    </p>
                  </div>
                </div>
              </Link>
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Best Hand</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Select the best possible hand on the board.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Category */}
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              Metrics
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/breakeven" className="block">
                <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-100">Breakeven: Facing A Raise</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Calculate breakeven percentages for calling bets.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/pot-odds" className="block">
                <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-100">Pot Odds</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Calculate pot odds ratios for calling decisions.
                    </p>
                  </div>
                </div>
              </Link>
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Stack to Pot Ratio (SPR)</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Calculate SPR and determine how committed you are.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
