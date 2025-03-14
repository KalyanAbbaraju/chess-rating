import { EcfRatingResult } from './ratingTypes';

interface ECFCalculationInput {
  currentRating: number;
  opponentRating: number;
  result: 'win' | 'draw' | 'loss';
  kFactor?: number; // Add optional K-factor parameter
}

/**
 * Calculates an ECF rating change based on the input parameters
 * ECF uses a rating system that differs from the international Elo system
 * ECF ratings typically range from 0 to 300
 */
export function calculateECFRating(input: ECFCalculationInput): EcfRatingResult {
  // Get the actual score based on the result
  let actualScore = 0;
  if (input.result === 'win') actualScore = 1;
  else if (input.result === 'draw') actualScore = 0.5;
  else if (input.result === 'loss') actualScore = 0;

  // Calculate expected score using ECF formula (divisor of 50 instead of 400)
  const ratingDifference = input.opponentRating - input.currentRating;
  const expectedScore = 1 / (1 + Math.pow(10, ratingDifference / 50));
  
  // Use provided K-factor or default to 40 (standard for most players)
  const kFactor = input.kFactor || 40;
  
  // Calculate the rating change
  const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
  
  // Calculate the new rating
  const newRating = input.currentRating + ratingChange;
  
  // Return the result in the format expected by the components
  return {
    type: 'ecf',
    currentRating: input.currentRating,
    newRating,
    ratingChange,
    baseRatingChange: ratingChange, // Same as ratingChange for ECF
    expectedScore,
    actualScore,
    totalGames: 1,
    kFactor,
    isProvisional: false // Assuming non-provisional for simplicity
  };
} 