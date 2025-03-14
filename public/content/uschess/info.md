# US Chess Rating System Calculator

## Introduction

The US Chess Federation (USCF) rating system is a mathematical method for evaluating a player's strength based on their performance in tournaments. This calculator implements the USCF rating formulas to estimate your new rating after a tournament.

## About This Calculator

This calculator implements the official US Chess rating formula, including progressive ratings for new players and bonus points for rapidly improving players. It provides an estimate of rating changes that would occur after playing games against rated opponents.

The estimate is based on the US Chess rating formula as described in the US Chess Federation's Rating System documentation. While this calculator strives for accuracy, your official rating change might differ slightly due to additional factors that may be applied in official calculations.

For the official USCF rating regulations, please see the [US Chess Federation's Rules](https://new.uschess.org/sites/default/files/media/documents/us-chess-rule-book-online-only-edition-chapters-1-2-10-11-9-1-20.pdf).

# How US Chess Ratings Work

The US Chess rating system uses a statistical method to measure a chess player's strength based on their performance against rated opponents. This calculator follows the official US Chess Federation formula for calculating rating changes.

### Key Components

- **Current Rating**: Your starting US Chess rating
- **K-Factor**: A value that determines how much your rating can change; varies based on your rating and number of games played
- **Expected Score**: What the system predicts you should score against a given opponent
- **Actual Score**: Your actual result: 1 point for a win, 0.5 for a draw, 0 for a loss

### The Formula

The US Chess rating system calculates the expected score for each game using:

$E = \frac{1}{1 + 10^{-\Delta/400}}$

Where $\Delta$ is the rating difference (your rating minus opponent's rating).

## K-Factor

The K-factor determines how much your rating can change after an event. It varies based on your experience:

- **K=32**: For players with fewer than 8 rated games.
- **K=24**: For players with 8-19 rated games.
- **K=16**: For established players rated below 2100.
- **K=16**: For players rated 2100-2399 (standard option).
- **K=16**: For players rated 2400+ (standard option).

### K-Factor Examples

1. **New Player (K=32)**:
   - Rating: 1200
   - Games played: 5
   - Rating changes will be larger to help establish true strength

2. **Developing Player (K=24)**:
   - Rating: 1500
   - Games played: 15
   - Moderate rating changes to reflect improvement

3. **Established Player (K=16)**:
   - Rating: 2000
   - Games played: 50+
   - Smaller rating changes for stability

## Rating Change Formula

The basic formula for calculating rating changes is:

$$\text{New Rating} = \text{Old Rating} + K \times (\text{Actual Score} - \text{Expected Score})$$

The expected score for each game is calculated using:

$$E = \frac{1}{1 + 10^{-\Delta/400}}$$

Where $\Delta$ is the rating difference (your rating minus opponent's rating).

### Example Calculations

#### Single Game Example
Player A (2000) vs Player B (1800):
- Rating difference: 2000 - 1800 = 200
- Expected score for A: $\frac{1}{1 + 10^{-200/400}} = 0.76$
- If A wins: Rating change = $16 \times (1 - 0.76) = 3.84$ points
- If A draws: Rating change = $16 \times (0.5 - 0.76) = -4.16$ points
- If A loses: Rating change = $16 \times (0 - 0.76) = -12.16$ points

#### Tournament Example
Player C (1500) plays 4 games:
1. vs 1600: Win (Expected: 0.36, Actual: 1.0)
2. vs 1550: Draw (Expected: 0.40, Actual: 0.5)
3. vs 1450: Win (Expected: 0.53, Actual: 1.0)
4. vs 1400: Loss (Expected: 0.57, Actual: 0.0)

Total rating change = $24 \times [(1.0-0.36) + (0.5-0.40) + (1.0-0.53) + (0.0-0.57)]$
= $24 \times [0.64 + 0.10 + 0.47 - 0.57]$
= $24 \times 0.64 = 15.36$ points

## Bonus Points

The US Chess system includes a bonus point system for new and improving players. If your performance exceeds your current rating by a sufficient margin, you may receive bonus points. The bonus formula considers factors like performance, current rating, and number of prior games. Bonus points typically phase out after 26 rated games.

$$\text{Bonus} = \frac{4 \times (\text{Performance Rating} - \text{Current Rating} - \text{Threshold})}{N+3}$$

Where $N$ is the number of prior games and Threshold is currently 12.

### Bonus Point Examples

1. **New Player Bonus**:
   - Current Rating: 1200
   - Performance Rating: 1400
   - Games played: 5
   - Bonus = $\frac{4 \times (1400 - 1200 - 12)}{5+3} = 94$ points

2. **Established Player**:
   - Current Rating: 2000
   - Performance Rating: 2200
   - Games played: 30
   - No bonus (phased out after 26 games)

## Performance Assessment

This calculator provides an assessment of your performance through visual badges. These badges are based on the difference between your actual score and expected score.

### Performance Badge Formula

The badge is determined by calculating:

$$\text{Score Difference} = \text{Actual Score} - \text{Expected Score}$$

Thresholds are adjusted based on number of games:
- For few games (3 or fewer): High Threshold = 1.0, Low Threshold = 0.3
- For more games: High Threshold = 1.5, Low Threshold = 0.5

### Performance Badges

Based on the Score Difference and thresholds:

- **🏆 Outstanding Performance** (green badge): Score Difference ≥ High Threshold
  - You significantly exceeded expectations by scoring much higher than predicted

- **📈 Strong Showing** (blue badge): High Threshold > Score Difference > Low Threshold
  - You performed better than statistical expectations

- **⚖️ Consistent Player** (gray badge): |Score Difference| ≤ Low Threshold
  - Your performance was close to what the system predicted

- **📉 Room for Improvement** (orange badge): -Low Threshold > Score Difference > -High Threshold
  - You scored somewhat below statistical expectations

- **⚠️ Needs Work** (red badge): Score Difference ≤ -High Threshold
  - You scored significantly lower than what was expected

## Performance Rating

Your performance rating reflects how well you played in a specific event, based on your results and your opponents' ratings. We offer three methods to calculate performance ratings:

1. **FIDE Method**: Performance Rating = Average Opponent Rating + Rating Difference

   $$\text{Performance Rating} = \text{Average Opponent Rating} + 400 \times \log_{10}\left(\frac{S}{N-S}\right)$$

   Where:
   - $S$ is your score
   - $N$ is the number of games
   
   Example: If you scored 2.5/4 against opponents with an average rating of 1500, your performance rating would be:
   
   $$1500 + 400 \times \log_{10}\left(\frac{2.5}{4-2.5}\right) = 1500 + 98 = 1598$$

2. **Linear Approximation Method**: 

   $$\text{Performance Rating} = \text{Average Opponent Rating} + 8 \times (S\% - 50)$$
   
   Where $S\%$ is your percentage score.

3. **Algorithm of 400 Method**: 

   $$\text{Performance Rating} = \frac{\sum \text{Opponents' Ratings} + 400 \times (\text{Wins} - \text{Losses})}{\text{Number of Games}}$$

### Performance Rating Examples

1. **FIDE Method**:
   - Average opponent rating: 1500
   - Score: 3/4
   - Performance Rating = $1500 + 400 \times \log_{10}\left(\frac{3}{4-3}\right) = 1500 + 190 = 1690$

2. **Linear Approximation**:
   - Average opponent rating: 1500
   - Score: 75%
   - Performance Rating = $1500 + 8 \times (75 - 50) = 1500 + 200 = 1700$

3. **Algorithm of 400**:
   - Opponents: 1500, 1600, 1400, 1700
   - Score: 3 wins, 1 loss
   - Performance Rating = $\frac{1500 + 1600 + 1400 + 1700 + 400 \times (3-1)}{4} = 1700$

## Rating Categories

US Chess ratings are divided into categories:

- **Senior Master**: 2400+
- **National Master**: 2200-2399
- **Expert**: 2000-2199
- **Class A**: 1800-1999
- **Class B**: 1600-1799
- **Class C**: 1400-1599
- **Class D**: 1200-1399
- **Class E**: 1000-1199
- **Class F**: Below 1000

## Tournament Requirements

1. **Time Controls**:
   - Regular: More than 60 minutes per player
   - Quick: 10-60 minutes per player
   - Blitz: Less than 10 minutes per player

2. **Rating Floor**:
   - Players cannot drop below certain rating thresholds
   - Different floors apply to different rating categories
   - Helps prevent rating manipulation

3. **Tournament Organization**:
   - Must be registered with US Chess
   - All games must be played under standard conditions
   - Results must be submitted within specified timeframes

## Disclaimer

This calculator is for estimation purposes only and does not represent official US Chess calculations. The US Chess Federation's official ratings are determined by their own processes and may differ from the estimates provided here. Always refer to the US Chess Federation's official resources for definitive information.

## Official US Chess Resources

- **[US Chess Federation](https://www.uschess.org/)**: The official website of the US Chess Federation.
- **[US Chess Rating System Overview](https://www.uschess.org/content/view/11469/329/)**: Official overview of the US Chess rating system.
- **[US Chess Rating List](https://www.uschess.org/msa/MbrDtlMain.php)**: Current US Chess ratings and tournament results.

This calculator implements the US Chess rating formulas in effect since June 1, 2017, with updates reflecting changes to the bonus threshold (lowered from 14 to 12 in October 2023).


