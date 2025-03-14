# ECF Rating Calculation Methodology

The **English Chess Federation (ECF)** uses a mathematical system to calculate and update player ratings based on tournament performance. Here's how it works:

---

## Key Concepts

1. **ECF Rating Scale**:
   - Ranges from **0 to 300+**.
   - Higher ratings indicate stronger players.
   - Rough comparison to FIDE ratings:
     - ECF **100** ≈ FIDE **1500**
     - ECF **200** ≈ FIDE **2000**
     - ECF **250** ≈ FIDE **2400**
     - ECF **300** ≈ FIDE **2800**

2. **Grading Difference**:
   - The difference between two players' ratings predicts the expected outcome of a game.
   - A 50-point difference means the stronger player is expected to win approximately 90% of games.
   - A 100-point difference means the stronger player is expected to win approximately 99% of games.

3. **Performance Rating**:
   - A player's strength in a specific tournament, calculated based on results against opponents.
   - Helps identify if a player is improving or underperforming.
   - Useful for tournament organizers to assess player strength.

4. **Rating Categories**:
   - **Provisional**: Players with fewer than 30 rated games
   - **Standard**: Players with 30 or more rated games
   - **Inactive**: Players who haven't played rated games in over 3 years

---

## Rating Calculation Steps

### 1. Expected Score
The expected score for a game is calculated using the formula:

$$\text{Expected Score} = \frac{1}{1 + 10^{(\text{Opponent's Rating} - \text{Your Rating}) / 50}}$$

#### Example:
- Your Rating: **150**
- Opponent's Rating: **100**
- Expected Score:
  $$\frac{1}{1 + 10^{(100 - 150) / 50}} = \frac{1}{1 + 10^{-1}} = \frac{1}{1 + 0.1} = 0.91$$

This means you are expected to score 0.91 points (91% chance of winning) against this opponent.

---

### 2. Actual Score
The actual score depends on the game result:
- **1** for a win,
- **0.5** for a draw,
- **0** for a loss.

For tournament games:
- **Bye**: Counted as a win (1 point) against an opponent rated 100 points below the player
- **Default**: Counted as a loss (0 points) against an opponent rated 100 points above the player
- **Unfinished Games**: Not counted for rating purposes

---

### 3. Rating Change
The rating change for a player is calculated using:

$$\text{Rating Change} = K \times (\text{Actual Score} - \text{Expected Score})$$

- **K** is a constant:
  - **K = 40** for most players (standard rate of change)
  - **K = 20** for established players (slower rate of change)
  - **K = 60** for new players (faster rate of change)

#### Example:
- Expected Score: **0.91**
- Actual Score: **1** (win)
- Rating Change:
  $$40 \times (1 - 0.91) = 40 \times 0.09 = 3.6$$

---

### 4. Performance Rating
A player's performance rating in a tournament is calculated as:

$$\text{Performance Rating} = \text{Average Opponent's Rating} + 50 \times (\text{Total Score} - \text{Expected Total Score})$$

#### Example:
- Average Opponent's Rating: **120**
- Total Score: **4/5**
- Expected Total Score: **2.5**
- Performance Rating:
  $$120 + 50 \times (4 - 2.5) = 120 + 75 = 195$$

---

## Tournament Requirements

1. **Time Controls**:
   - Standard: More than 60 minutes per player
   - Rapid: 10-60 minutes per player
   - Blitz: Less than 10 minutes per player

2. **Rating Floor**:
   - Players cannot drop below certain rating thresholds once achieved
   - Different floors apply to different rating categories
   - Helps prevent rating manipulation

3. **Tournament Organization**:
   - Must be registered with the ECF
   - All games must be played under standard conditions
   - Results must be submitted within specified timeframes

---

## Example Calculation

A player with an ECF rating of **150** plays 5 games in a tournament:

| Opponent Rating | Result | Expected Score | Actual Score | Rating Change         |
|-----------------|--------|-----------------|--------------|-----------------------|
| 120             | Win    | 0.84            | 1            | 40 × (1 - 0.84) = 6.4   |
| 130             | Draw   | 0.76            | 0.5          | 40 × (0.5 - 0.76) = -10.4 |
| 140             | Loss   | 0.67            | 0            | 40 × (0 - 0.67) = -26.8  |
| 110             | Win    | 0.89            | 1            | 40 × (1 - 0.89) = 4.4    |
| 100             | Win    | 0.91            | 1            | 40 × (1 - 0.91) = 3.6    |

- **Total Rating Change**: $6.4 - 10.4 - 26.8 + 4.4 + 3.6 = -22.8$
- **New Rating**: $150 - 22.8 = 127.2$ (rounded to **127**)

---

## Rating Categories and Special Rules

1. **Provisional Ratings**:
   - Applied to players with fewer than 30 rated games
   - Uses higher K-factor (60) for faster rating adjustment
   - Helps new players reach their true strength quickly

2. **Standard Ratings**:
   - Applied to players with 30 or more rated games
   - Uses standard K-factor (40) for normal rating adjustment
   - More stable and reflective of true playing strength

3. **Inactive Ratings**:
   - Applied to players who haven't played rated games in over 3 years
   - May be marked as inactive in the rating list
   - Can be reactivated by playing in rated tournaments

---

## Summary

The ECF rating system updates player ratings based on:
1. **Expected Scores** derived from rating differences.
2. **Actual Scores** from game results.
3. **Rating Changes** calculated using the $K$ factor.
4. **Performance Ratings** for tournament-specific strength.

This ensures ratings remain accurate and reflective of a player's current skill level.

## Official Resources

- **[ECF Official Website](https://www.englishchess.org.uk/)**: The official website of the English Chess Federation
- **[ECF Rating Regulations](https://www.englishchess.org.uk/ratings/)**: Official documentation of the ECF rating system
- **[ECF Rating List](https://www.ecfrating.org.uk/)**: Current ECF ratings and tournament results

## Disclaimer

This calculator is for estimation purposes only and does not represent official ECF calculations. The English Chess Federation's official ratings are determined by their own processes and may differ from the estimates provided here. Always refer to the ECF's official resources for definitive information.
