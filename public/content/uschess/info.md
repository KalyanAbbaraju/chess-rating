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

## K-Factor

The K-factor determines how much your rating can change after an event. It varies based on your experience:

- **K=32**: For players with fewer than 8 rated games.
- **K=24**: For players with 8-19 rated games.
- **K=16**: For established players rated below 2100.
- **K=16**: For players rated 2100-2399 (standard option).
- **K=16**: For players rated 2400+ (standard option).

## Rating Change Formula

The basic formula for calculating rating changes is:

$$\text{New Rating} = \text{Old Rating} + K \times (\text{Actual Score} - \text{Expected Score})$$

The expected score for each game is calculated using:

$$E = \frac{1}{1 + 10^{-\Delta/400}}$$

Where $\Delta$ is the rating difference (your rating minus opponent's rating).

## Bonus Points

The US Chess system includes a bonus point system for new and improving players. If your performance exceeds your current rating by a sufficient margin, you may receive bonus points. The bonus formula considers factors like performance, current rating, and number of prior games. Bonus points typically phase out after 26 rated games.

$$\text{Bonus} = \frac{4 \times (\text{Performance Rating} - \text{Current Rating} - \text{Threshold})}{N+3}$$

Where $N$ is the number of prior games and Threshold is currently 12.

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

These assessments provide a quick visual insight into how your performance compares to statistical expectations.

The badge will appear prominently in the performance summary section after calculating your rating change.

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


## Disclaimer

This calculator is for estimation purposes only and does not represent official US Chess calculations. The US Chess Federation's official ratings are determined by their own processes and may differ from the estimates provided here. Always refer to the US Chess Federation's official resources for definitive information.

## Official US Chess Resources

- **[US Chess Federation](https://www.uschess.org/)**: The official website of the US Chess Federation.
- **[US Chess Rating System Overview](https://www.uschess.org/content/view/11469/329/)**: Official overview of the US Chess rating system.

This calculator implements the US Chess rating formulas in effect since June 1, 2017, with updates reflecting changes to the bonus threshold (lowered from 14 to 12 in October 2023).


