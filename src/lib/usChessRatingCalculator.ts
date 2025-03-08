import { RatingCalculationResult, RatingResult, UsChessRatingResult } from './ratingTypes';

/**
* Interface representing a game result
*/
interface GameResult {
  opponentRating: number;
  result: number; // 1 for win, 0 for loss, 0.5 for draw
}

/**
* Options for initializing a rating for a new player
*/
interface InitializeRatingOptions {
  age?: number;
  fideRating?: number;
  cfcRating?: number;
}

/**
 * Performance rating calculation method
 */
export type PerformanceRatingMethod = 'fide' | 'linear' | 'algorithm400';

/**
* Calculate a player's new US Chess rating after multiple games in a tournament.
* 
* @param currentRating - Player's current rating (0 if unrated)
* @param numPreviousGames - Number of games player has played before this tournament
* @param gameResults - Array of game results where result is 1 for win, 0 for loss, 0.5 for draw
* @param applyBonus - Whether to apply bonus points for exceptional performance (default: true)
* @param highestAchievedRating - Player's highest achieved rating
* @param playerAge - Player's age (from UI age ranges: 8=Under 10, 12=10-14, 17=15-19, 40=20-64, 65=Senior)
* @param playerFideRating - Player's FIDE rating
* @param playerCfcRating - Player's CFC rating
* @param isLifeMaster - Whether the player is a Life Master
* @returns Detailed result of the rating calculation
*/
export function calculateUsChessRating(
  currentRating: number,
  numPreviousGames: number,
  gameResults: GameResult[],
  applyBonus: boolean = true,
  highestAchievedRating: number,
  playerAge: number,
  playerFideRating: number,
  playerCfcRating: number,
  isLifeMaster: boolean = false
): RatingResult {
  // Initialize variables
  let rating = currentRating;
  let totalGames = numPreviousGames;
  
  // If player is unrated, assign initial rating of 1300
  if (numPreviousGames === 0 && currentRating === 0) {
    const options: InitializeRatingOptions = {
      age: playerAge, // If available
      fideRating: playerFideRating, // If available
      cfcRating: playerCfcRating // If available
    };
    
    rating = initializeRating(options);
  }
  
  
  // Calculate expected and actual scores
  let expectedScore = 0;
  let actualScore = 0;
  let kFactor: number;
  
  // Calculate effective number of games (N)
  const effectiveGames = Math.min(totalGames, 50); // Cap at 50 for established players
  
  // Determine if player is provisional (N ≤ 8) or established (N > 8)
  const isProvisional = effectiveGames <= 8;
  
  // Calculate K-factor (use the same K-factor for all games in the tournament)
  if (isProvisional) {
    // For provisional players, K = 32 * (4 + (N/2)) / 6
    kFactor = 32 * (4 + (effectiveGames / 2)) / 6;
  } else {
    // For established players, K depends on rating
    if (rating > 2100) {
      kFactor = 16;
    } else if (rating > 1800) {
      kFactor = 24;
    } else {
      kFactor = 32;
    }
  }
  
  // Calculate expected score for each game
  for (const { opponentRating, result } of gameResults) {
    const ratingDifference = opponentRating - rating;
    let winningExpectancy: number;
    
    if (isProvisional) {
      // Provisional winning expectancy formula
      if (ratingDifference <= -400) {
        winningExpectancy = 1.0;
      } else if (ratingDifference >= 400) {
        winningExpectancy = 0.0;
      } else {
        winningExpectancy = 0.5 + ratingDifference / 800;
      }
    } else {
      // Standard winning expectancy formula
      winningExpectancy = 1 / (1 + Math.pow(10, ratingDifference / 400));
    }
    
    expectedScore += winningExpectancy;
    actualScore += result;
  }
  
  // Calculate rating change
  const baseRatingChange = kFactor * (actualScore - expectedScore);
  
  // Calculate bonus (if applicable)
  let bonus = 0;
  if (applyBonus && gameResults.length >= 3) {
    // Check if no opponent was faced more than twice
    const opponentCounts = new Map<number, number>();
    let qualifiesForBonus = true;
    
    for (const { opponentRating } of gameResults) {
      const count = (opponentCounts.get(opponentRating) || 0) + 1;
      opponentCounts.set(opponentRating, count);
      
      if (count > 2) {
        qualifiesForBonus = false;
        break;
      }
    }
    
    if (qualifiesForBonus) {
      // Bonus threshold (lowered from 14 to 12 in October 2023)
      const bonusThreshold = 12;
      
      // m' is max(games played, 4)
      const mPrime = Math.max(gameResults.length, 4);
      
      // Calculate bonus: max(0, K(S-E) - B√m')
      bonus = Math.max(0, baseRatingChange - bonusThreshold * Math.sqrt(mPrime));
    }
  }
  
  // Apply rating change and bonus
  const totalRatingChange = baseRatingChange + bonus;

  // Round according to USCF rules - away from current rating
  // If gaining points, round up; if losing points, round down
  const roundedRatingChange = totalRatingChange >= 0 
    ? Math.ceil(totalRatingChange) 
    : Math.floor(totalRatingChange);

  const newRating = rating + roundedRatingChange;
  
  // Calculate rating floor based on highest achieved rating
  let finalRating = newRating;
  if (highestAchievedRating) {
    // Determine if player is a senior based on age
    const isSenior = playerAge >= 65;
    
    // Pass the actual isLifeMaster value from parameter
    const ratingFloor = calculateRatingFloor(highestAchievedRating, isLifeMaster, isSenior);
    finalRating = applyRatingFloor(newRating, ratingFloor);
  }

  // Calculate performance rating based on selected method
  // let performanceRating = 0;
  let fidePerformanceRating = 0;
  let linearPerformanceRating = 0;
  let algorithm400PerformanceRating = 0;
  
  if (gameResults.length > 0) {
    fidePerformanceRating = calculateFIDEPerformanceRating(gameResults);
    linearPerformanceRating = calculateLinearPerformanceRating(gameResults);
    algorithm400PerformanceRating = calculateAlgorithm400PerformanceRating(gameResults);
  }

  const results: UsChessRatingResult = {
    currentRating: currentRating,
    newRating: Math.round(finalRating),
    ratingChange: roundedRatingChange,
    baseRatingChange: baseRatingChange,
    actualScore: actualScore,
    totalGames: numPreviousGames + gameResults.length,
    bonus: Math.round(bonus * 100) / 100,
    kFactor: Math.round(kFactor * 100) / 100,
    fidePerformanceRating: Math.round(fidePerformanceRating),
    linearPerformanceRating: Math.round(linearPerformanceRating),
    algorithm400PerformanceRating: Math.round(algorithm400PerformanceRating),
    ratingWithoutFloor: newRating,
    expectedScore: Math.round(expectedScore * 100) / 100,
    isProvisional: isProvisional,
    type: 'uschess'
  }
  
  // Return detailed result
  return results;
}

/**
* Calculate rating floor for a player
* 
* @param highestAchievedRating - Player's highest achieved rating
* @param isLifeMaster - Whether the player is a Life Master
* @param isSenior - Whether the player is a Senior (age 65+)
* @returns Rating floor
*/
export function calculateRatingFloor(
  highestAchievedRating: number,
  isLifeMaster: boolean = false,
  isSenior: boolean = false
): number {
  // Base floor calculation
  let floor = 0;
  
  if (highestAchievedRating >= 2200) {
    floor = 2000;
  } else if (highestAchievedRating >= 2000) {
    floor = 1800;
  } else if (highestAchievedRating >= 1800) {
    floor = 1600;
  } else if (highestAchievedRating >= 1600) {
    floor = 1400;
  } else if (highestAchievedRating >= 1400) {
    floor = 1200;
  } else if (highestAchievedRating >= 1200) {
    floor = 1000;
  }
  
  // Life Masters have a minimum floor of 2000
  if (isLifeMaster && floor < 2000) {
    floor = 2000;
  }
  
  // Seniors (65+) get a 100-point reduction in their floor
  if (isSenior && floor > 0) {
    floor = Math.max(100, floor - 100);
  }
  
  return floor;
}

/**
* Apply rating floor to ensure a player's rating doesn't fall below their floor
* 
* @param calculatedRating - The calculated new rating
* @param ratingFloor - The player's rating floor
* @returns Adjusted rating that respects the floor
*/
export function applyRatingFloor(calculatedRating: number, ratingFloor: number): number {
  return Math.max(calculatedRating, ratingFloor);
}

/**
* Calculate performance rating using the FIDE method
* 
* @param gameResults - Array of game results
* @returns Performance rating
*/
export function calculateFIDEPerformanceRating(gameResults: GameResult[]): number {
  if (gameResults.length === 0) return 0;
  
  // Calculate total score and average opponent rating
  let totalScore = 0;
  let totalOpponentRating = 0;
  
  for (const { opponentRating, result } of gameResults) {
    totalScore += result;
    totalOpponentRating += opponentRating;
  }
  
  const averageOpponentRating = totalOpponentRating / gameResults.length;
  const percentageScore = totalScore / gameResults.length;
  
  // FIDE performance rating calculation
  // Use the FIDE rating difference table based on percentage score
  let ratingDifference: number;
  
  if (percentageScore === 1.0) {
    // Perfect score - add 800 points (FIDE recommendation for small tournaments)
    ratingDifference = 800;
  } else if (percentageScore === 0.0) {
    // Zero score - subtract 800 points
    ratingDifference = -800;
  } else {
    // Use the approximation formula: dp = 400 * log10(S/(1-S))
    // where S is the percentage score
    ratingDifference = Math.round(400 * Math.log10(percentageScore / (1 - percentageScore)));
  }
  
  return Math.round(averageOpponentRating + ratingDifference);
}

/**
* Calculate performance rating using the linear approximation method
* 
* @param gameResults - Array of game results
* @returns Performance rating
*/
export function calculateLinearPerformanceRating(gameResults: GameResult[]): number {
  if (gameResults.length === 0) return 0;
  
  // Calculate total score and average opponent rating
  let totalScore = 0;
  let totalOpponentRating = 0;
  
  for (const { opponentRating, result } of gameResults) {
    totalScore += result;
    totalOpponentRating += opponentRating;
  }
  
  const averageOpponentRating = totalOpponentRating / gameResults.length;
  const percentageScore = totalScore / gameResults.length * 100; // Convert to percentage
  
  // Linear approximation: Rp = Rc + 8 * (S - 50)
  // where Rc is average opponent rating and S is percentage score
  return Math.round(averageOpponentRating + 8 * (percentageScore - 50));
}

/**
* Calculate performance rating using the "Algorithm of 400" method
* 
* @param gameResults - Array of game results
* @returns Performance rating
*/
export function calculateAlgorithm400PerformanceRating(gameResults: GameResult[]): number {
  if (gameResults.length === 0) return 0;
  
  let totalOpponentRating = 0;
  let wins = 0;
  let losses = 0;
  
  for (const { opponentRating, result } of gameResults) {
    totalOpponentRating += opponentRating;
    
    if (result === 1) wins++;
    else if (result === 0) losses++;
    // Draws don't affect the wins-losses calculation
  }
  
  // Algorithm of 400: Rp = (Sum of opponents' ratings + 400 * (W - L)) / N
  return Math.round((totalOpponentRating + 400 * (wins - losses)) / gameResults.length);
}

/**
* Calculate the winning expectancy for a player against an opponent
* 
* @param playerRating - Player's rating
* @param opponentRating - Opponent's rating
* @param numGames - Player's number of games
* @returns Winning expectancy (0-1)
*/
export function calculateWinningExpectancy(
  playerRating: number,
  opponentRating: number,
  numGames: number
): number {
  const effectiveGames = Math.min(numGames, 50);
  const isProvisional = effectiveGames <= 8;
  const ratingDifference = opponentRating - playerRating;
  
  if (isProvisional) {
    if (ratingDifference <= -400) return 1.0;
    if (ratingDifference >= 400) return 0.0;
    return 0.5 + ratingDifference / 800;
  } else {
    return 1 / (1 + Math.pow(10, ratingDifference / 400));
  }
}

/**
* Calculate the K-factor for a player
* 
* @param rating - Player's rating
* @param numGames - Player's number of games
* @returns K-factor
*/
export function calculateKFactor(rating: number, numGames: number): number {
  const effectiveGames = Math.min(numGames, 50);
  
  if (effectiveGames <= 8) {
    return 32 * (4 + (effectiveGames / 2)) / 6;
  } else {
    if (rating > 2100) return 16;
    if (rating > 1800) return 24;
    return 32;
  }
}

/**
* Calculate a simplified performance rating based on average opponent rating and score
* 
* @param averageOpponentRating - Average rating of all opponents
* @param score - Total score achieved (e.g., 2.5 for 2 wins and 1 draw)
* @param games - Number of games played
* @returns Performance rating
*/
export function calculateSimplifiedPerformanceRating(
  averageOpponentRating: number,
  score: number,
  games: number
): number {
  if (games === 0) return 0;
  
  const percentageScore = score / games;
  
  // Handle perfect or zero scores
  if (percentageScore === 1.0) {
    return averageOpponentRating + 400;
  } else if (percentageScore === 0.0) {
    return averageOpponentRating - 400;
  }
  
  // Use the approximation formula: dp = 400 * log10(S/(1-S))
  const ratingDifference = Math.round(400 * Math.log10(percentageScore / (1 - percentageScore)));
  return Math.round(averageOpponentRating + ratingDifference);
}

/**
* Initialize a rating for an unrated player
* 
* @param options - Options for initializing rating
* @returns Initial rating
*/
export function initializeRating(options: InitializeRatingOptions): number {
  const { age, fideRating, cfcRating } = options;
  
  if (fideRating) {
    // Convert FIDE rating to US Chess rating
    return Math.round(fideRating * 1.02 + 100);
  }
  
  if (cfcRating) {
    // Convert CFC rating to US Chess rating
    return Math.round(cfcRating + 50);
  }
  
  if (age) {
    // Age-based initial rating (simplified)
    if (age < 10) return 600;
    if (age < 15) return 750;
    if (age < 20) return 900;
    return 1300;
  }
  
  // Default initial rating
  return 1300;
}
