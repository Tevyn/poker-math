import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-100">
              Poker Equity Estimation
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-100 sm:text-5xl">
            Master Poker Equity
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Practice estimating hand vs. hand equity with interactive problems. 
            Test your skills and improve your poker intuition.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/hand-vs-hand" className="block">
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Hand vs. Hand</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Estimate equity between two specific poker hands.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/breakeven" className="block">
              <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-100">Breakeven Percentage</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Calculate breakeven percentages for calling bets.
                  </p>
                </div>
              </div>
            </Link>
            <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-100">Range vs. Range</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Compare equity between two hand ranges.
                </p>
              </div>
            </div>
            <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-800 opacity-50">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-100">Range Construction</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Build and evaluate hand ranges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
