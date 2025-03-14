# FIDE Rating System Information

## Introduction

The FIDE (Fédération Internationale des Échecs) rating system is the international standard for chess ratings. It uses the Elo rating system, named after its creator Arpad Elo, to calculate player ratings based on their performance against other rated players.

## The Formula

The FIDE rating system uses the Elo rating formula to calculate expected scores and rating changes.

### Expected Score Calculation

For player A with rating Ra playing against player B with rating Rb:

$E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}$

This gives the expected probability of player A winning against player B. For example:
- If both players have equal ratings, the expected score is 0.5 (50%)
- If player A is rated 100 points higher than player B, their expected score is approximately 0.64 (64%)
- If player A is rated 200 points higher than player B, their expected score is approximately 0.76 (76%)
- If player A is rated 400 points higher than player B, their expected score is approximately 0.91 (91%)
- If player A is rated 800 points higher than player B, their expected score is approximately 0.99 (99%)

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
   - Changes take effect from the 1st day of the following month

2. **K-Factor Application**
   - The K-factor determines how much a rating can change after each game
   - Higher K-factors (40) allow newer players' ratings to change more quickly
   - Lower K-factors (10) create more stable ratings for established players
   - A player's K-factor can change over time as they play more games or reach certain rating thresholds
   - K-factor changes are applied immediately when conditions are met

3. **Score Calculation**
   - Win = 1 point
   - Draw = 0.5 points
   - Loss = 0 points
   - Games where a player doesn't play (forfeit, bye) are not counted for rating purposes
   - Byes are counted as wins against an opponent rated 400 points below the player
   - Defaults are counted as losses against an opponent rated 400 points above the player

4. **Tournament Requirements**
   - For a tournament to be FIDE rated, it must follow specific time control requirements
   - Standard ratings apply to games with more than 60 minutes per player
   - Rapid ratings apply to games with 10-60 minutes per player
   - Blitz ratings apply to games with 3-10 minutes per player
   - All players must have FIDE IDs for the tournament to be rated
   - Tournaments must be registered with FIDE before they can be rated
   - Results must be submitted within specified timeframes

5. **Rating Floor**
   - Players cannot drop below certain rating thresholds once achieved
   - This prevents manipulation of the rating system
   - Different federations may have different floor policies
   - Rating floors are typically set at:
     - 1000 for standard ratings
     - 1000 for rapid ratings
     - 1000 for blitz ratings

6. **Provisional Ratings**
   - Players with fewer than 30 rated games are considered provisional
   - Provisional ratings change more quickly with the higher K-factor
   - Established ratings (30+ games) are more stable
   - Provisional ratings are marked with an asterisk (*) in the rating list
   - Players can have different numbers of games for standard, rapid, and blitz ratings

7. **Rating Categories**
   - **Grandmaster (GM)**: 2500+ rating
   - **International Master (IM)**: 2400-2499 rating
   - **FIDE Master (FM)**: 2300-2399 rating
   - **Candidate Master (CM)**: 2200-2299 rating
   - **Expert**: 2000-2199 rating
   - **Class A**: 1800-1999 rating
   - **Class B**: 1600-1799 rating
   - **Class C**: 1400-1599 rating
   - **Class D**: 1200-1399 rating
   - **Class E**: 1000-1199 rating
   - **Class F**: Below 1000 rating

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
- 90% score: $\Delta \approx +400$
- 10% score: $\Delta \approx -400$

## Example Calculations

### Single Game Example
Player A (2400) vs Player B (2200):
- Expected score for A: $\frac{1}{1 + 10^{(2200-2400)/400}} = 0.76$
- If A wins: Rating change = $10 \times (1 - 0.76) = 2.4$ points
- If A draws: Rating change = $10 \times (0.5 - 0.76) = -2.6$ points
- If A loses: Rating change = $10 \times (0 - 0.76) = -7.6$ points

### Tournament Example
Player C (2000) plays 5 games:
1. vs 2100: Win (Expected: 0.36, Actual: 1.0)
2. vs 2050: Draw (Expected: 0.40, Actual: 0.5)
3. vs 1950: Win (Expected: 0.53, Actual: 1.0)
4. vs 1900: Loss (Expected: 0.57, Actual: 0.0)
5. vs 1850: Win (Expected: 0.61, Actual: 1.0)

Total rating change = $20 \times [(1.0-0.36) + (0.5-0.40) + (1.0-0.53) + (0.0-0.57) + (1.0-0.61)]$
= $20 \times [0.64 + 0.10 + 0.47 - 0.57 + 0.39]$
= $20 \times 1.03 = 20.6$ points

## Further Reading

For more detailed information about the FIDE rating system:

- [Official FIDE Handbook](https://handbook.fide.com/)
- [FIDE Rating Regulations](https://handbook.fide.com/chapter/B022017)
- [Current FIDE Rating List](https://ratings.fide.com/)
- [FIDE Tournament Regulations](https://handbook.fide.com/chapter/B022018)

## Disclaimer

This calculator is for estimation purposes only and does not represent official FIDE calculations. The Fédération Internationale des Échecs' official ratings are determined by their own processes and may differ from the estimates provided here. Always refer to FIDE's official resources for definitive information.

## Official FIDE Resources

- **[FIDE Official Website](https://www.fide.com/)**: The official website of the International Chess Federation.
- **[FIDE Rating Regulations](https://www.fide.com/FIDE/handbook/Rating_Regulations_effective_from_July_2017.pdf)**: Official document outlining FIDE rating calculations.
- **[FIDE Rating List](https://ratings.fide.com/)**: Current FIDE ratings and tournament results.

This calculator implements the FIDE rating formulas in effect since July 2017. 