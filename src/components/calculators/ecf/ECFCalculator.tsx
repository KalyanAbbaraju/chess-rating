'use client';

import React, { useState, useEffect } from 'react';
import { ECFCalculatorForm } from './ECFCalculatorForm';
import { EcfRatingResult } from '@/lib/ratingTypes';
import RatingChangeVisual from '@/components/shared/RatingChangeVisual';
import RatingResultsTable from '@/components/shared/RatingResultsTable';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ECFCalculatorProps {
  initialResults?: EcfRatingResult;
}

export function ECFCalculator({ initialResults }: ECFCalculatorProps) {
  const [results, setResults] = useState<EcfRatingResult | null>(initialResults || null);
  const [visualizationType, setVisualizationType] = useState<'visual' | 'table'>('visual');
  const [error, setError] = useState<string | null>(null);

  // Log when component mounts
  useEffect(() => {
    console.log('ECFCalculator component mounted');
    return () => console.log('ECFCalculator component unmounted');
  }, []);

  // Handle initial results if provided
  useEffect(() => {
    if (initialResults) {
      console.log('Initial results provided to ECFCalculator:', initialResults);
      setResults(initialResults);
    }
  }, [initialResults]);

  const handleCalculationResults = (result: EcfRatingResult) => {
    console.log('Calculation results received in ECFCalculator:', result);
    
    // Validate the result
    if (!result || typeof result.newRating !== 'number') {
      setError('Invalid calculation result received');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Update the results state
    setResults(result);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <ECFCalculatorForm onCalculate={handleCalculationResults} />
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}
      
      {results && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Results</h3>
            <div className="flex space-x-2">
              <Tabs 
                value={visualizationType} 
                onValueChange={(value) => setVisualizationType(value as 'visual' | 'table')}
                className="w-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger 
                    value="visual" 
                    className="text-xs px-2 py-1 h-6 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
                  >
                    Visual
                  </TabsTrigger>
                  <TabsTrigger 
                    value="table" 
                    className="text-xs px-2 py-1 h-6 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
                  >
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {visualizationType === 'visual' ? (
            <RatingChangeVisual results={results} />
          ) : (
            <RatingResultsTable results={results} />
          )}
        </div>
      )}
    </div>
  );
} 