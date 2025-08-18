'use client';

import { useState, useMemo } from 'react';
import PageWrapper from '../../components/PageWrapper';
import RangeGrid from '../../components/RangeGrid';
import { rangeData, getCategoryIds, getRangeIds, getRange } from '../../data/rangeData';

export default function RangeStudyPage() {
  const [selectedCategory, setSelectedCategory] = useState('open_raises');
  const [selectedRange, setSelectedRange] = useState('lj');

  // Get available categories and ranges
  const categories = useMemo(() => getCategoryIds(), []);
  const ranges = useMemo(() => getRangeIds(selectedCategory), [selectedCategory]);

  // Get the selected range data
  const currentRange = useMemo(() => {
    const rangeData = getRange(selectedCategory, selectedRange);
    if (!rangeData) return {};
    
    // Convert the range data to the format expected by RangeGrid
    const rangeMap: Record<string, string> = {};
    
    // Add raise hands
    if (rangeData.range.raise) {
      rangeData.range.raise.forEach((hand: string) => {
        rangeMap[hand] = 'raise';
      });
    }
    
    // Add call hands
    if (rangeData.range.call) {
      rangeData.range.call.forEach((hand: string) => {
        rangeMap[hand] = 'call';
      });
    }
    
    return rangeMap;
  }, [selectedCategory, selectedRange]);

  // Get the display name for the current range
  const currentRangeName = useMemo(() => {
    const category = rangeData[selectedCategory];
    if (!category) return '';
    
    const range = category.ranges[selectedRange];
    return range ? range.name : '';
  }, [selectedCategory, selectedRange]);

  return (
    <PageWrapper title="Range Study">
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
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                // Reset to first available range when category changes
                const newRanges = getRangeIds(e.target.value);
                setSelectedRange(newRanges[0] || '');
              }}
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
              onChange={(e) => setSelectedRange(e.target.value)}
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

      {/* Range Display */}
      <div>
        <div className="flex justify-center">
          <RangeGrid
            mode="study"
            selectedRange={currentRange}
            className="max-w-full"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
