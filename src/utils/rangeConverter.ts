import { descriptorToHands } from "./lib/descriptor";
import { handsToCombos } from "./lib/range_utils";
import type { Combo } from "./lib/models";
import type { PokerRange } from "../types/rangeTypes";

/**
 * Convert rangeData format (hand arrays) to lib format (Array<Combo>)
 * This bridges the gap between rangeData format and lib format
 */
export const convertRangeSelectionToCombos = (range: PokerRange): Combo[] => {
  console.log('🔄 Converting range selection to combos...');
  const allHands = new Set<string>();
  
  // Collect all hands from the range
  if (range.raise) {
    console.log('Raise hands:', range.raise.length);
    range.raise.forEach(hand => allHands.add(hand));
  }
  if (range.call) {
    console.log('Call hands:', range.call.length);
    range.call.forEach(hand => allHands.add(hand));
  }
  if (range.fold) {
    console.log('Fold hands:', range.fold.length);
    range.fold.forEach(hand => allHands.add(hand));
  }
  
  console.log('Total unique hands:', allHands.size);
  
  if (allHands.size === 0) {
    return [];
  }
  
  // Convert to descriptor format
  const descriptor = Array.from(allHands).join(', ');
  console.log('Descriptor length:', descriptor.length);
  
  // Convert descriptor to hands to combos
  console.log('Converting descriptor to hands...');
  const hands = descriptorToHands(descriptor);
  console.log('Hands generated:', hands.size);
  
  console.log('Converting hands to combos...');
  const combos = handsToCombos(hands, new Map());
  console.log('Combos generated:', combos.size);
  
  return Array.from(combos);
};

/**
 * Convert rangeData format to lib format with action filtering
 * Only includes hands with the specified action type
 */
export const convertRangeSelectionToCombosByAction = (
  range: PokerRange, 
  action: 'raise' | 'call' | 'fold'
): Combo[] => {
  const actionHands = range[action] || [];
  
  if (actionHands.length === 0) {
    return [];
  }
  
  // Convert to descriptor format
  const descriptor = actionHands.join(', ');
  
  // Convert descriptor to hands to combos
  const hands = descriptorToHands(descriptor);
  const combos = handsToCombos(hands, new Map());
  
  return Array.from(combos);
};

/**
 * Filter range by multiple action types
 * Returns combos for all specified actions
 */
export const convertRangeSelectionToCombosByActions = (
  range: PokerRange,
  actions: Array<'raise' | 'call' | 'fold'>
): Combo[] => {
  const allCombos = new Set<Combo>();
  
  actions.forEach(action => {
    const actionCombos = convertRangeSelectionToCombosByAction(range, action);
    actionCombos.forEach(combo => allCombos.add(combo));
  });
  
  return Array.from(allCombos);
};

/**
 * Filter range to include only aggressive actions (raise/call)
 * Excludes fold actions
 */
export const convertRangeSelectionToCombosAggressive = (range: PokerRange): Combo[] => {
  return convertRangeSelectionToCombosByActions(range, ['raise', 'call']);
};

/**
 * Filter range to include only passive actions (call/fold)
 * Excludes raise actions
 */
export const convertRangeSelectionToCombosPassive = (range: PokerRange): Combo[] => {
  return convertRangeSelectionToCombosByActions(range, ['call', 'fold']);
};

/**
 * Filter range to include only value actions (raise)
 * Excludes call and fold actions
 */
export const convertRangeSelectionToCombosValue = (range: PokerRange): Combo[] => {
  return convertRangeSelectionToCombosByAction(range, 'raise');
};

/**
 * Get range breakdown by action type with filtering options
 */
export const getRangeBreakdownByAction = (
  range: PokerRange,
  includeActions: Array<'raise' | 'call' | 'fold'> = ['raise', 'call', 'fold']
): {
  totalCombos: number;
  actionBreakdown: Record<string, { combos: Combo[]; count: number }>;
  includedActions: string[];
  excludedActions: string[];
} => {
  const actionBreakdown: Record<string, { combos: Combo[]; count: number }> = {};
  const allActions: Array<'raise' | 'call' | 'fold'> = ['raise', 'call', 'fold'];
  
  // Process included actions
  includeActions.forEach(action => {
    const combos = convertRangeSelectionToCombosByAction(range, action);
    actionBreakdown[action] = {
      combos,
      count: combos.length,
    };
  });
  
  // Calculate totals
  const totalCombos = Object.values(actionBreakdown).reduce((sum, data) => sum + data.count, 0);
  const excludedActions = allActions.filter(action => !includeActions.includes(action));
  
  return {
    totalCombos,
    actionBreakdown,
    includedActions: includeActions,
    excludedActions,
  };
};

/**
 * Get range statistics for display
 */
export const getRangeStats = (range: PokerRange): {
  totalCombos: number;
  raiseCombos: number;
  callCombos: number;
  foldCombos: number;
  totalHands: number;
  raiseHands: number;
  callHands: number;
  foldHands: number;
} => {
  const totalCombos = convertRangeSelectionToCombos(range).length;
  const raiseCombos = convertRangeSelectionToCombosByAction(range, 'raise').length;
  const callCombos = convertRangeSelectionToCombosByAction(range, 'call').length;
  const foldCombos = convertRangeSelectionToCombosByAction(range, 'fold').length;
  
  const totalHands = (range.raise?.length || 0) + (range.call?.length || 0) + (range.fold?.length || 0);
  const raiseHands = range.raise?.length || 0;
  const callHands = range.call?.length || 0;
  const foldHands = range.fold?.length || 0;
  
  return {
    totalCombos,
    raiseCombos,
    callCombos,
    foldCombos,
    totalHands,
    raiseHands,
    callHands,
    foldHands,
  };
};

/**
 * Convert rangeData format to RangeGrid format for UI display
 * Creates a mapping of hand -> action for the RangeGrid component
 */
export const convertRangeToRangeGridFormat = (range: PokerRange): Record<string, string> => {
  const rangeGridFormat: Record<string, string> = {};
  
  // Add raise hands
  if (range.raise) {
    range.raise.forEach(hand => {
      rangeGridFormat[hand] = 'raise';
    });
  }
  
  // Add call hands
  if (range.call) {
    range.call.forEach(hand => {
      rangeGridFormat[hand] = 'call';
    });
  }
  
  // Add fold hands
  if (range.fold) {
    range.fold.forEach(hand => {
      rangeGridFormat[hand] = 'fold';
    });
  }
  
  return rangeGridFormat;
};

/**
 * Convert rangeData format to descriptor string
 * Useful for debugging and logging
 */
export const convertRangeToDescriptor = (range: PokerRange): string => {
  const allHands = new Set<string>();
  
  if (range.raise) {
    range.raise.forEach(hand => allHands.add(hand));
  }
  if (range.call) {
    range.call.forEach(hand => allHands.add(hand));
  }
  if (range.fold) {
    range.fold.forEach(hand => allHands.add(hand));
  }
  
  return Array.from(allHands).join(', ');
};

/**
 * Validate rangeData format and provide error details
 */
export const validateRangeData = (range: PokerRange): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if range has any actions
  const hasActions = !!(range.raise?.length || range.call?.length || range.fold?.length);
  if (!hasActions) {
    errors.push("Range has no actions defined");
  }
  
  // Check for duplicate hands across actions
  const allHands = new Set<string>();
  const duplicates = new Set<string>();
  
  ['raise', 'call', 'fold'].forEach(action => {
    const actionHands = range[action as keyof PokerRange] || [];
    actionHands.forEach(hand => {
      if (allHands.has(hand)) {
        duplicates.add(hand);
      } else {
        allHands.add(hand);
      }
    });
  });
  
  if (duplicates.size > 0) {
    errors.push(`Duplicate hands found: ${Array.from(duplicates).join(', ')}`);
  }
  
  // Check for invalid hand formats
  const invalidHands: string[] = [];
  allHands.forEach(hand => {
    if (!isValidHandFormat(hand)) {
      invalidHands.push(hand);
    }
  });
  
  if (invalidHands.length > 0) {
    errors.push(`Invalid hand formats: ${invalidHands.join(', ')}`);
  }
  
  // Warnings for potential issues
  if (range.raise && range.raise.length > 50) {
    warnings.push("Large raise range detected (>50 hands)");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Check if a hand string is in valid format
 */
const isValidHandFormat = (hand: string): boolean => {
  // Valid formats: AA, KK, AKs, AKo, etc.
  const validPattern = /^[2-9TJQKA]{2}[so]?$/;
  return validPattern.test(hand);
};

/**
 * Enhanced integration with descriptorToHands and handsToCombos
 * Provides detailed error handling and validation
 */
export const convertRangeWithLibIntegration = (range: PokerRange): {
  combos: Combo[];
  descriptor: string;
  hands: Set<string>;
  conversionSteps: {
    step1: { descriptor: string; success: boolean; error?: string };
    step2: { handsCount: number; success: boolean; error?: string };
    step3: { combosCount: number; success: boolean; error?: string };
  };
} => {
  const conversionSteps = {
    step1: { descriptor: '', success: false, error: undefined as string | undefined },
    step2: { handsCount: 0, success: false, error: undefined as string | undefined },
    step3: { combosCount: 0, success: false, error: undefined as string | undefined },
  };
  
  // Step 1: Convert range to descriptor
  try {
    const descriptor = convertRangeToDescriptor(range);
    conversionSteps.step1 = { descriptor, success: true, error: undefined };
    
    // Step 2: Convert descriptor to hands using descriptorToHands
    try {
      const hands = descriptorToHands(descriptor);
      conversionSteps.step2 = { handsCount: hands.size, success: true, error: undefined };
      
      // Step 3: Convert hands to combos using handsToCombos
      try {
        const combos = handsToCombos(hands, new Map());
        conversionSteps.step3 = { combosCount: combos.size, success: true, error: undefined };
        
        return {
          combos: Array.from(combos),
          descriptor,
          hands,
          conversionSteps,
        };
      } catch (error) {
        conversionSteps.step3 = { 
          combosCount: 0, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error in handsToCombos'
        };
        throw new Error(`Failed to convert hands to combos: ${conversionSteps.step3.error}`);
      }
    } catch (error) {
      conversionSteps.step2 = { 
        handsCount: 0, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error in descriptorToHands'
      };
      throw new Error(`Failed to convert descriptor to hands: ${conversionSteps.step2.error}`);
    }
  } catch (error) {
    conversionSteps.step1 = { 
      descriptor: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error in descriptor creation'
    };
    throw new Error(`Failed to create descriptor: ${conversionSteps.step1.error}`);
  }
};

/**
 * Test integration with lib functions using sample ranges
 * Useful for debugging and validation
 */
export const testLibIntegration = (): {
  success: boolean;
  tests: Array<{
    testName: string;
    range: PokerRange;
    result: {
      success: boolean;
      combosCount: number;
      error?: string;
    };
  }>;
} => {
  const testRanges: Array<{ testName: string; range: PokerRange }> = [
    {
      testName: 'Simple raise range',
      range: { raise: ['AA', 'KK', 'AKs'] }
    },
    {
      testName: 'Mixed actions range',
      range: { 
        raise: ['AA', 'KK'], 
        call: ['QQ', 'JJ'], 
        fold: ['22', '33'] 
      }
    },
    {
      testName: 'Empty range',
      range: {}
    },
    {
      testName: 'Large range',
      range: { 
        raise: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AJs', 'AKo', 'AQo'] 
      }
    }
  ];
  
  const tests = testRanges.map(({ testName, range }) => {
    try {
      const { combos } = convertRangeWithLibIntegration(range);
      return {
        testName,
        range,
        result: {
          success: true,
          combosCount: combos.length,
        },
      };
    } catch (error) {
      return {
        testName,
        range,
        result: {
          success: false,
          combosCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  });
  
  const success = tests.every(test => test.result.success);
  
  return { success, tests };
};

/**
 * Convert rangeData format to lib format with error handling
 * Enhanced version with comprehensive error handling
 */
export const convertRangeSelectionToCombosWithValidation = (range: PokerRange): {
  combos: Combo[];
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
} => {
  const validation = validateRangeData(range);
  
  if (!validation.isValid) {
    return {
      combos: [],
      validation,
    };
  }
  
  try {
    const combos = convertRangeSelectionToCombos(range);
    return {
      combos,
      validation,
    };
  } catch (error) {
    validation.errors.push(`Conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      combos: [],
      validation: {
        ...validation,
        isValid: false,
      },
    };
  }
};

/**
 * Convert individual hand array to combos
 * Useful for converting specific action arrays
 */
export const convertHandArrayToCombos = (hands: string[]): Combo[] => {
  if (hands.length === 0) {
    return [];
  }
  
  const descriptor = hands.join(', ');
  const handSet = descriptorToHands(descriptor);
  const combos = handsToCombos(handSet, new Map());
  
  return Array.from(combos);
};

/**
 * Convert rangeData format to lib format with detailed breakdown
 * Returns conversion details for debugging and analysis
 */
export const convertRangeToCombosWithBreakdown = (range: PokerRange): {
  combos: Combo[];
  breakdown: {
    raiseCombos: Combo[];
    callCombos: Combo[];
    foldCombos: Combo[];
    totalCombos: number;
    conversionStats: {
      raiseHands: number;
      callHands: number;
      foldHands: number;
      raiseCombos: number;
      callCombos: number;
      foldCombos: number;
    };
  };
} => {
  const raiseCombos = convertHandArrayToCombos(range.raise || []);
  const callCombos = convertHandArrayToCombos(range.call || []);
  const foldCombos = convertHandArrayToCombos(range.fold || []);
  
  // Combine all combos (remove duplicates)
  const allCombos = new Set<Combo>();
  raiseCombos.forEach(combo => allCombos.add(combo));
  callCombos.forEach(combo => allCombos.add(combo));
  foldCombos.forEach(combo => allCombos.add(combo));
  
  const conversionStats = {
    raiseHands: range.raise?.length || 0,
    callHands: range.call?.length || 0,
    foldHands: range.fold?.length || 0,
    raiseCombos: raiseCombos.length,
    callCombos: callCombos.length,
    foldCombos: foldCombos.length,
  };
  
  return {
    combos: Array.from(allCombos),
    breakdown: {
      raiseCombos,
      callCombos,
      foldCombos,
      totalCombos: allCombos.size,
      conversionStats,
    },
  };
};

/**
 * Batch convert multiple ranges to combos
 * Useful for processing multiple ranges at once
 */
export const batchConvertRangesToCombos = (ranges: PokerRange[]): {
  results: Array<{
    range: PokerRange;
    combos: Combo[];
    validation: {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    };
  }>;
  summary: {
    totalRanges: number;
    validRanges: number;
    totalCombos: number;
    totalErrors: number;
  };
} => {
  const results = ranges.map(range => {
    const { combos, validation } = convertRangeSelectionToCombosWithValidation(range);
    return { range, combos, validation };
  });
  
  const summary = {
    totalRanges: ranges.length,
    validRanges: results.filter(r => r.validation.isValid).length,
    totalCombos: results.reduce((sum, r) => sum + r.combos.length, 0),
    totalErrors: results.reduce((sum, r) => sum + r.validation.errors.length, 0),
  };
  
  return { results, summary };
};
