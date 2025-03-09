'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UsChessEstimator from './UsChessEstimator';
import { calculateUsChessRating } from '@/lib/usChessRatingCalculator';
import { RatingResult } from '@/lib/ratingTypes';

export default function ClientUsChessEstimator() {
  const [results, setResults] = useState<RatingResult | null>(null);
  const searchParams = useSearchParams();
  
  // Process URL parameters on component mount
  useEffect(() => {
    // Only run this on client-side
    if (typeof window === 'undefined') return;
    
    try {
      // Get parameters from URL
      const current = searchParams.get('current');
      const oppParam = searchParams.get('opp');
      const resultsParam = searchParams.get('results');
      // Other params as needed...
      
      // Only proceed if we have the essential parameters
      if (!current || !oppParam || !resultsParam) return;
      
      // Create formatted data for the calculator
      const currentRating = parseInt(current);
      const opponentRatings = oppParam.split(',');
      const gameResults = resultsParam.split(',');
      
      // Create data for calculation
      const calculationData = opponentRatings.map((rating, i) => ({
        opponentRating: parseInt(rating),
        result: gameResults[i] === 'win' ? 1 : gameResults[i] === 'draw' ? 0.5 : 0
      }));
      
      // Calculate rating
      const calculationResult = calculateUsChessRating(
        currentRating,
        parseInt(searchParams.get('prior') || '0'),
        calculationData,
        searchParams.get('bonus') !== 'false',
        parseInt(searchParams.get('highest') || current),
        parseInt(searchParams.get('age') || '0'),
        parseInt(searchParams.get('fide') || '0'),
        parseInt(searchParams.get('cfc') || '0'),
        searchParams.get('lifemaster') === 'true'
      );
      
      // Set results to pass to the estimator
      setResults(calculationResult);
    } catch (error) {
      console.error('Error processing URL parameters:', error);
    }
  }, [searchParams]);
  
  return <UsChessEstimator preloadedResults={results} />;
} 