'use client';

import React, { useState, useEffect } from 'react';
import { USChessCalculatorForm } from './USChessCalculatorForm';
import { USChessInfo } from './USChessInfo';
import RatingChangeVisual from '@/components/shared/RatingChangeVisual';
import RatingResultsTable from '@/components/shared/RatingResultsTable';
import { UsChessRatingResult, RatingResult } from '@/lib/ratingTypes';

interface USChessCalculatorProps {
  title?: string;
  description?: string;
  initialResults?: UsChessRatingResult | null;
  onReset?: () => void;
}

export function USChessCalculator({ title, description, initialResults, onReset }: USChessCalculatorProps) {
  const [results, setResults] = useState<RatingResult | null>(initialResults || null);
  const [visualizationType, setVisualizationType] = useState<'visual' | 'table'>('visual');
  const [error, setError] = useState<string | null>(null);

  // Effect to handle initialResults updates
  useEffect(() => {
    if (initialResults) {
      console.log('USChessCalculator received initialResults:', initialResults);
      setResults(initialResults);
    }
  }, [initialResults]);

  // Add effect to detect component mounting
  useEffect(() => {
    console.log('USChessCalculator component mounted');
  }, []);

  const handleCalculate = (calculationResult: UsChessRatingResult) => {
    console.log('Parent component received calculation result:', calculationResult);
    
    try {
      // Ensure we're getting a valid result object
      if (!calculationResult || typeof calculationResult !== 'object') {
        console.error('Invalid calculation result received:', calculationResult);
        setError('Invalid calculation result received');
        return;
      }
      
      // Validate that key properties exist
      if (calculationResult.type !== 'uschess' || 
          typeof calculationResult.currentRating !== 'number' || 
          typeof calculationResult.newRating !== 'number') {
        console.error('Malformed calculation result:', calculationResult);
        setError('Calculation result is missing required properties');
        return;
      }
      
      console.log('Setting results state with:', calculationResult);
      
      // Store the results for display and clear any errors
      setError(null);
      setResults(calculationResult);
      
      console.log('Results state set successfully, should render results view now');
    } catch (err) {
      console.error('Error processing calculation result:', err);
      setError('Error processing calculation result');
    }
  };

  // Reset function to clear results and errors
  const resetCalculator = () => {
    console.log('Resetting calculator');
    setResults(null);
    setError(null);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-800 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Always show the form */}
      <USChessCalculatorForm onCalculate={handleCalculate} />
      
      {/* Show results below the form when available */}
      {results && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Results</h3>
            <div className="flex items-center">
              <button 
                onClick={resetCalculator}
                className="mr-4 text-xs text-blue-600 hover:text-blue-800"
              >
                Clear Results
              </button>
              
              <label className="text-xs text-gray-600 mr-2">View as:</label>
              <div className="relative">
                <select
                  value={visualizationType}
                  onChange={(e) => setVisualizationType(e.target.value as 'visual' | 'table')}
                  className="appearance-none bg-white border border-gray-200 text-xs rounded-md py-1 pl-3 pr-8 text-gray-700 focus:outline-none"
                >
                  <option value="visual">Visual Chart</option>
                  <option value="table">Data Table</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg 
                    className="h-4 w-4" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {visualizationType === 'visual' ? (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <RatingChangeVisual results={results} />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <RatingResultsTable results={results} />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 