/**
 * Calculates the expected score based on the ELO formula
 * @param playerRating The player's rating
 * @param opponentRating The opponent's rating
 */
export function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Calculates K factor based on rating and number of games played
 * @param rating The player's current rating
 * @param gamesPlayed Number of previous games played
 */
export function calculateKFactor(rating: number, gamesPlayed: number = 30): number {
  // Simplified K-factor calculation based on USCF rules
  if (gamesPlayed < 8) {
    return 32; // New players
  } else if (gamesPlayed < 20) {
    return 24;
  } else if (rating < 2100) {
    return 16; // Regular players
  } else if (rating < 2400) {
    return 12; // Higher rated players
  } else {
    return 8; // Masters
  }
}

/**
 * Calculates rating change after a game or series of games
 * @param playerRating Current rating of the player
 * @param opponentRating Rating of the opponent
 * @param actualScore The actual score achieved (1 for win, 0.5 for draw, 0 for loss)
 * @param numberOfGames Number of games played against this opponent
 * @param kFactor Optional K-factor override (if not provided, it's calculated automatically)
 */
export function calculateRatingChange(
  playerRating: number,
  opponentRating: number,
  actualScore: number,
  numberOfGames: number = 1,
  kFactor?: number
): number {
  const expectedScore = calculateExpectedScore(playerRating, opponentRating) * numberOfGames;
  const k = kFactor || calculateKFactor(playerRating);
  
  return Math.round(k * (actualScore - expectedScore));
} 