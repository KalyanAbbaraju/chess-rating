export interface RatingCalculationResult {
  currentRating: number;
  performanceRating: number;
  newRating: number;
  ratingChange: number;
  expectedScore: number;
  totalScore: number;
  totalGames: number;
  kFactor: number;
  bonus: number;
  actualScore: number;

}


// Base interface for properties common to all rating systems
export interface BaseRatingResult {
  currentRating: number;
  newRating: number;
  ratingChange: number;
  baseRatingChange: number;
  actualScore?: number;
  totalGames?: number;
  kFactor: number; 
  isProvisional?: boolean; // based on number of games played
  // totalScore: number;
  type: 'uschess' | 'fide'; // Discriminator field
}

// US Chess specific extensions
export interface UsChessRatingResult extends BaseRatingResult {
  type: 'uschess';
  bonus: number;
  fidePerformanceRating?: number;
  linearPerformanceRating?: number;
  algorithm400PerformanceRating?: number;
  ratingWithoutFloor?: number;
  currentFloor: number;
  expectedScore: number;
  ratingCategory: string;
}

// FIDE specific extensions
export interface FideRatingResult extends BaseRatingResult {
  type: 'fide';
  expectedScore: number;
  performanceRating: number;
  classification?: string;
  dynamicKFactor?: number;
}

// Union type for all possible results
export type RatingResult = UsChessRatingResult | FideRatingResult;
