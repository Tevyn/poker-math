'use client';

import { useState, useMemo } from 'react';
import PageWrapper from '../../components/PageWrapper';
import RangeGrid from '../../components/RangeGrid';
import { rangeData, getCategoryIds, getRangeIds, getRange } from '../../data/rangeData';

export default function RangePracticePage() {
  const [selectedCategory, setSelectedCategory] = useState('open_raises');
  const [selectedRange, setSelectedRange] = useState('lj');
  const [selectedAction, setSelectedAction] = useState<'raise' | 'call'>('raise');
  const [userRange, setUserRange] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctActions, setCorrectActions] = useState<Record<string, string>>({});

  // Get available categories and ranges
  const categories = useMemo(() => getCategoryIds(), []);
  const ranges = useMemo(() => getRangeIds(selectedCategory), [selectedCategory]);

  // Get the selected range data
  const selectedRangeData = useMemo(() => {
    return getRange(selectedCategory, selectedRange);
  }, [selectedCategory, selectedRange]);

  const handleHandClick = (hand: string, action: string) => {
    if (isSubmitted) return; // Prevent changes after submission
    
    setUserRange(prev => ({
      ...prev,
      [hand]: action
    }));
  };

  const handleSubmit = () => {
    if (!selectedRangeData) return;
    
    // Convert range data to hand->action mapping for results
    const actions: Record<string, string> = {};
    
    // Add raise hands if they exist
    if (selectedRangeData.range.raise) {
      selectedRangeData.range.raise.forEach(hand => {
        actions[hand] = 'raise';
      });
    }
    
    // Add call hands if they exist
    if (selectedRangeData.range.call) {
      selectedRangeData.range.call.forEach(hand => {
        actions[hand] = 'call';
      });
    }
    
    setCorrectActions(actions);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setUserRange({});
    setIsSubmitted(false);
    setCorrectActions({});
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Reset to first available range when category changes
    const newRanges = getRangeIds(categoryId);
    setSelectedRange(newRanges[0] || '');
    setUserRange({});
    setIsSubmitted(false);
    setCorrectActions({});
  };

  const handleRangeChange = (rangeId: string) => {
    setSelectedRange(rangeId);
    setUserRange({});
    setIsSubmitted(false);
    setCorrectActions({});
  };

  return (
    <PageWrapper title="Range Practice">
      {/* Range Selection Controls */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((categoryId) => {
                const category = rangeData[categoryId];
                return (
                  <option key={categoryId} value={categoryId}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Range Selection */}
          <div>
            <label htmlFor="range" className="block text-sm font-medium text-gray-300 mb-2">
              Position
            </label>
            <select
              id="range"
              value={selectedRange}
              onChange={(e) => handleRangeChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ranges.map((rangeId) => {
                const range = rangeData[selectedCategory]?.ranges[rangeId];
                return (
                  <option key={rangeId} value={rangeId}>
                    {range?.name || rangeId}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {selectedRangeData && (
        <>
          {/* Action Buttons Above Grid */}
          <div className="mb-6 max-w-md mx-auto">
            <div className="flex justify-between items-center">
              {/* Left side - Raise and Call buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedAction('raise')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    selectedAction === 'raise'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  Raise
                </button>
                <button
                  onClick={() => setSelectedAction('call')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    selectedAction === 'call'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  Call
                </button>
              </div>

              {/* Right side - Clear and Submit buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Range Grid */}
          <div>
            <div className="flex justify-center">
              <RangeGrid
                mode="test"
                selectedRange={userRange}
                onHandClick={handleHandClick}
                selectedAction={selectedAction}
                className="max-w-full"
                showResults={isSubmitted}
                correctActions={correctActions}
              />
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
