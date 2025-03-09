import { FideRatingResult, RatingResult } from './ratingTypes';

// Interface for game results
export interface GameResult {
  opponentRating: number;
  result: number; // 1 for win, 0.5 for draw, 0 for loss
}

/**
 * Calculate FIDE Rating based on games played
 */
/**
 * Calculate a player's new FIDE rating after multiple games in a tournament.
 * 
 * @param currentRating - Player's current rating (0 if unrated)
 * @param numPreviousGames - Number of games player has played before this tournament
 * @param gameResults - Array of game results where result is 1 for win, 0 for loss, 0.5 for draw
 * @returns Detailed result of the rating calculation
 */
export function calculateFIDERating(
  currentRating: number,
  numPreviousGames: number,
  gameResults: GameResult[]
): RatingResult {
  // Initialize variables
  let rating = currentRating;
  const totalGames = numPreviousGames;
  
  // If player is unrated, do not assign an initial rating yet
  if (currentRating === 0) {
    rating = 0; // Wait until they have enough games
  }
  
  // Calculate expected and actual scores
  let expectedScore = 0;
  let actualScore = 0;
  let kFactor: number;
  
  // Determine if player is provisional (N < 5), new (5 ≤ N < 30), or established (N ≥ 30)
  const isProvisional = totalGames + gameResults.length < 5;
  const isNewPlayer = totalGames + gameResults.length >= 5 && totalGames + gameResults.length < 30;
  
  // Calculate K-factor
  if (isProvisional) {
    // Provisional players do not have a published rating yet
    const provisionalResults: FideRatingResult = {
      currentRating: currentRating,
      newRating: 0,
      ratingChange: 0,
      baseRatingChange: 0,
      actualScore: actualScore,
      expectedScore: Math.round(expectedScore * 100) / 100,
      totalGames: numPreviousGames + gameResults.length,
      kFactor: 40,
      performanceRating: 0,
      isProvisional: isProvisional,
      type: 'fide',
      classification: 'Provisional'
    }
    return provisionalResults;
  } else if (isNewPlayer) {
    kFactor = 40;
  } else {
    // For established players, K depends on rating
    if (rating >= 2400) {
      kFactor = 10;
    } else {
      kFactor = 20;
    }
  }
  
  // Calculate expected score for each game
  for (const { opponentRating, result } of gameResults) {
    const ratingDifference = opponentRating - rating;
    const winningExpectancy = 1 / (1 + Math.pow(10, ratingDifference / 400));
    
    expectedScore += winningExpectancy;
    actualScore += result;
  }
  
  // Calculate rating change
  const ratingChange = kFactor * (actualScore - expectedScore);
  
  // Round rating change to nearest integer
  const newRating = rating + Math.round(ratingChange);

  const performanceRating = calculateFidePerformanceRating(gameResults, actualScore);
  
  const results: FideRatingResult = {
    currentRating: currentRating,
    newRating: Math.round(newRating),
    ratingChange: Math.round(ratingChange),
    baseRatingChange: Math.round(ratingChange),
    actualScore: actualScore,
    expectedScore: Math.round(expectedScore * 100) / 100,
    totalGames: numPreviousGames + gameResults.length,
    kFactor: Math.round(kFactor * 100) / 100,
    performanceRating: Math.round(performanceRating),
    isProvisional: isProvisional,
    type: 'fide',
    classification: getClassification(newRating),
    dynamicKFactor: calculateDynamicKFactor(kFactor, totalGames),
  }
  
  // Return detailed result
  return results;
}



/**
 * Calculate FIDE performance rating
 */
function calculateFidePerformanceRating(games: GameResult[], totalScore: number): number {
  // Basic implementation of FIDE performance rating calculation
  const totalGames = games.length;
  
  if (totalGames === 0) return 0;
  
  // Calculate average opponent rating
  const avgOpponentRating = games.reduce((sum, game) => sum + game.opponentRating, 0) / totalGames;
  
  // Calculate performance
  // FIDE Performance Rating = Average Rating of Opponents + Rating Difference
  // Rating Difference is based on score percentage
  const scorePercentage = (totalScore / totalGames) * 100;
  // FIDE rating difference table approximation
  const ratingDifference = getRatingDifference(scorePercentage);
  
  return Math.round(avgOpponentRating + ratingDifference);
} 

// Helper function for rating difference
function getRatingDifference(scorePercentage: number): number {
  if (scorePercentage >= 100) return 800;
  else if (scorePercentage >= 99) return 677;
  else if (scorePercentage >= 90) return 366 + (scorePercentage - 90) * 28;
  else if (scorePercentage >= 80) return 240 + (scorePercentage - 80) * 12.6;
  else if (scorePercentage >= 70) return 149 + (scorePercentage - 70) * 9.1;
  else if (scorePercentage >= 60) return 72 + (scorePercentage - 60) * 7.7;
  else if (scorePercentage >= 50) return 0 + (scorePercentage - 50) * 7.2;
  else if (scorePercentage >= 40) return -72 + (scorePercentage - 40) * 7.2;
  else if (scorePercentage >= 30) return -149 + (scorePercentage - 30) * 7.7;
  else if (scorePercentage >= 20) return -240 + (scorePercentage - 20) * 9.1;
  else if (scorePercentage >= 10) return -366 + (scorePercentage - 10) * 12.6;
  else if (scorePercentage >= 1) return -677 + (scorePercentage - 1) * 34.6;
  else return -800;
}

// Helper functions
function getClassification(rating: number): string {
  if (rating < 1400) return 'Novice';
  else if (rating < 1600) return 'Beginner to Intermediate';
  else if (rating < 1800) return 'Intermediate';
  else if (rating < 2000) return 'Strong Intermediate';
  else if (rating < 2200) return 'Advanced';
  else return 'Expert to Professional';
}

function calculateDynamicKFactor(kFactor: number, totalGames: number): number {
  if (kFactor * totalGames > 700) {
    return Math.floor(700 / totalGames);
  } else {
    return kFactor;
  }
}
