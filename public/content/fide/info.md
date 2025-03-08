# FIDE Rating System Calculator
## Introduction

The FIDE (Fédération Internationale des Échecs) rating system is used to calculate chess ratings for international competitions. This calculator implements the official FIDE rating formulas to estimate your new rating after playing rated games.

## The Elo Rating System

FIDE uses a variation of the Elo rating system, developed by Arpad Elo. The system measures the relative skill levels of players in zero-sum games like chess.

## Expected Score

For any game, your expected score is calculated using this formula:

$$E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}$$

Where:
- $E_A$ is your expected score
- $R_A$ is your rating
- $R_B$ is your opponent's rating

This formula produces a number between 0 and 1, representing your probability of winning. For example, if your expected score is 0.75, it means you're expected to score 0.75 points per game against this opponent (1 point for a win, 0.5 for a draw, 0 for a loss).

## K-Factor

The K-factor determines how much your rating can change after a tournament:

- **K=40**: For new players until they complete their first 30 rated games
- **K=20**: For players with a rating under 2400
- **K=10**: For players with a rating of 2400 and above

For players who have never been rated before, FIDE assigns a temporary rating based on performance in their first tournament.

## Rating Change Formula

The basic formula for calculating rating changes is:

$$\text{New Rating} = \text{Old Rating} + K \times (\text{Actual Score} - \text{Expected Score})$$

Where:
- K is the K-factor
- Actual Score is the sum of your results (1 for win, 0.5 for draw, 0 for loss)
- Expected Score is calculated using the formula above

## Performance Rating

Your performance rating reflects how well you played in a specific event, based on your results and your opponents' ratings. The FIDE performance rating formula is:

$$\text{Performance Rating} = \text{Average Opponent Rating} + \text{Rating Difference}$$

The Rating Difference comes from a table based on your percentage score. As an approximation:

$$\text{Rating Difference} \approx 400 \times \log_{10}\left(\frac{S}{N-S}\right)$$

Where:
- $S$ is your score
- $N$ is the number of games

## Rating Floors and Accelerated Ratings

Unlike some national rating systems, FIDE does not use bonus points or accelerated ratings for improving players. However, FIDE does implement rating floors to prevent excessive rating loss.

## FIDE Rating Periods

FIDE publishes official ratings on a monthly basis. All games played during a rating period are processed together when calculating rating changes.

## Disclaimer

This calculator is for estimation purposes only and does not represent official FIDE calculations. The Fédération Internationale des Échecs' official ratings are determined by their own processes and may differ from the estimates provided here. Always refer to FIDE's official resources for definitive information.

## Official FIDE Resources

- **[FIDE Official Website](https://www.fide.com/)**: The official website of the International Chess Federation.
- **[FIDE Rating Regulations](https://www.fide.com/FIDE/handbook/Rating_Regulations_effective_from_July_2017.pdf)**: Official document outlining FIDE rating calculations.

This calculator implements the FIDE rating formulas in effect since July 2017. 