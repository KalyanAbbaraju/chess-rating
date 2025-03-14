'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export const USChessInfo = () => {
  const [infoContent, setInfoContent] = useState<string>('');
  
  // Default content as fallback
  const fallbackContent = `
# US Chess Rating Calculations

The US Chess Federation uses a modified Elo rating system to calculate ratings for chess players in the United States.
The system is designed to provide an accurate measure of a player's strength relative to other players.

## Key Features of US Chess Ratings

- **K-Factor:** Determines how much a rating can change after each game. The K-factor varies based on a player's rating and number of games played.
- **Bonus Points:** Additional points awarded to rapidly improving players.
- **Rating Floors:** Prevents ratings from dropping below certain thresholds based on past achievements.
- **Initial Rating:** New players receive a provisional rating that adjusts more rapidly until they've played enough games.

## Basic Formula

The basic formula for calculating new ratings is:

\`\`\`
New Rating = Old Rating + K × (Actual Score - Expected Score)
\`\`\`

The expected score is calculated using a formula that predicts the probability of winning based on the rating difference between players.

## Special Rules

- **Age-Based Floors:** Young players have special rating floors based on their age.
- **Quick vs. Regular:** Different ratings for different time controls (Regular, Quick, Blitz).
- **Provisional vs. Established:** Players with fewer than 26 games have provisional ratings that change more rapidly.

For official ratings and more information, visit the [US Chess Federation website](https://new.uschess.org/ratings).
`;

  useEffect(() => {
    // First set the fallback content as default
    setInfoContent(fallbackContent);
    
    // Fetch from the correct path
    fetch('/content/uschess/info.md')
      .then(response => {
        if (!response.ok) {
          console.error(`Failed to load markdown: ${response.status} ${response.statusText}`);
          return null;
        }
        return response.text();
      })
      .then(text => {
        // Only update content if we got a response
        if (text) {
          setInfoContent(text);
        }
      })
      .catch(error => {
        console.error('Error loading markdown:', error);
        // Fallback content already set, no need to change
      });
  }, [fallbackContent]);

  return (
    <div className="prose prose-sm max-w-none text-xs">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({...props}) => <h1 className="text-base font-bold mb-2 mt-0" {...props} />,
          h2: ({...props}) => <h2 className="text-sm font-bold mb-1 mt-3" {...props} />,
          h3: ({...props}) => <h3 className="text-xs font-bold mb-1 mt-2" {...props} />,
          p: ({...props}) => <p className="mb-1 text-xs" {...props} />,
          ul: ({...props}) => <ul className="mb-2 ml-4" {...props} />,
          ol: ({...props}) => <ol className="mb-2 ml-4" {...props} />,
          li: ({...props}) => <li className="mb-0.5 text-xs" {...props} />,
          a: ({...props}) => <a className="text-blue-600 hover:underline" {...props} />
        }}
      >
        {infoContent}
      </ReactMarkdown>
    </div>
  );
}; 