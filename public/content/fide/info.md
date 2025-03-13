# FIDE Rating System Information

## The Formula

The FIDE rating system uses the Elo rating formula to calculate expected scores and rating changes.

### Expected Score Calculation

For player A with rating Ra playing against player B with rating Rb:

$E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}$

This gives the expected probability of player A winning against player B. For example:
- If both players have equal ratings, the expected score is 0.5 (50%)
- If player A is rated 100 points higher than player B, their expected score is approximately 0.64 (64%)
- If player A is rated 200 points higher than player B, their expected score is approximately 0.76 (76%)

### Rating Change Calculation

After a game or tournament:

$R_{new} = R_{old} + K \times (S - E)$

Where:
- $R_{new}$ is the updated rating
- $R_{old}$ is the previous rating
- $K$ is the K-factor (development coefficient)
- $S$ is the actual score (1 for a win, 0.5 for a draw, 0 for a loss)
- $E$ is the expected score calculated using the formula above

The K-factor values are:
- $K = 40$ for new players (first 30 rated games)
- $K = 20$ for players with ratings under 2400
- $K = 10$ for players rated 2400 and above

## The Rules

### Official FIDE Rating Rules

1. **Rating Periods**
   - FIDE calculates and publishes ratings on a monthly basis
   - Players' ratings change based on their performance in rated tournaments
   - Rating lists are published on the 1st day of each month

2. **K-Factor Application**
   - The K-factor determines how much a rating can change after each game
   - Higher K-factors (40) allow newer players' ratings to change more quickly
   - Lower K-factors (10) create more stable ratings for established players
   - A player's K-factor can change over time as they play more games or reach certain rating thresholds

3. **Score Calculation**
   - Win = 1 point
   - Draw = 0.5 points
   - Loss = 0 points
   - Games where a player doesn't play (forfeit, bye) are not counted for rating purposes

4. **Tournament Requirements**
   - For a tournament to be FIDE rated, it must follow specific time control requirements
   - Standard ratings apply to games with more than 60 minutes per player
   - Rapid ratings apply to games with 10-60 minutes per player
   - Blitz ratings apply to games with 3-10 minutes per player
   - All players must have FIDE IDs for the tournament to be rated

5. **Rating Floor**
   - Players cannot drop below certain rating thresholds once achieved
   - This prevents manipulation of the rating system
   - Different federations may have different floor policies

6. **Provisional Ratings**
   - Players with fewer than 30 rated games are considered provisional
   - Provisional ratings change more quickly with the higher K-factor
   - Established ratings (30+ games) are more stable

## Performance Rating

A performance rating represents the rating level at which a player performed in a specific tournament:

$R_p = R_a + \Delta$

Where:
- $R_p$ is the performance rating
- $R_a$ is the average rating of opponents
- $\Delta$ is a value based on the percentage score achieved

For common percentage scores:
- 50% score: $\Delta = 0$ (performance equals average opponent rating)
- 70% score: $\Delta \approx +120$
- 30% score: $\Delta \approx -120$

## Further Reading

For more detailed information about the FIDE rating system:

- [Official FIDE Handbook](https://handbook.fide.com/)
- [FIDE Rating Regulations](https://handbook.fide.com/chapter/B022017)
- [Current FIDE Rating List](https://ratings.fide.com/)

## Disclaimer

This calculator is for estimation purposes only and does not represent official FIDE calculations. The Fédération Internationale des Échecs' official ratings are determined by their own processes and may differ from the estimates provided here. Always refer to FIDE's official resources for definitive information.

## Official FIDE Resources

- **[FIDE Official Website](https://www.fide.com/)**: The official website of the International Chess Federation.
- **[FIDE Rating Regulations](https://www.fide.com/FIDE/handbook/Rating_Regulations_effective_from_July_2017.pdf)**: Official document outlining FIDE rating calculations.

This calculator implements the FIDE rating formulas in effect since July 2017. 