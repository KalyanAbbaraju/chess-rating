'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export function FIDEInfo() {
  const [infoContent, setInfoContent] = useState<string>('');
  
  // Default content as fallback
  const fallbackContent = `
# FIDE Rating System Information

## The Formula

The FIDE rating system uses the Elo rating formula to calculate expected scores and rating changes.

### Expected Score Calculation
For player A with rating Ra playing against player B with rating Rb:
- Expected Score (EA) = 1 / (1 + 10^((Rb - Ra) / 400))

### Rating Change Calculation
After a game or tournament:
- New Rating = Old Rating + K × (Actual Score - Expected Score)

Where:
- K is the K-factor (development coefficient)
- K = 40 for new players (first 30 rated games)
- K = 20 for players with ratings under 2400
- K = 10 for players rated 2400 and above

## The Rules

### Official FIDE Rating Rules

1. **Rating Periods**
   - FIDE calculates and publishes ratings on a monthly basis
   - Players' ratings change based on their performance in rated tournaments

2. **K-Factor Application**
   - The K-factor determines how much a rating can change after each game
   - Higher K-factors (40) allow newer players' ratings to change more quickly
   - Lower K-factors (10) create more stable ratings for established players

3. **Score Calculation**
   - Win = 1 point
   - Draw = 0.5 points
   - Loss = 0 points

4. **Tournament Requirements**
   - For a tournament to be FIDE rated, it must follow specific time control requirements
   - Standard ratings apply to games with more than 60 minutes per player
   - Rapid and Blitz ratings have separate calculations

5. **Rating Floor**
   - Players cannot drop below certain rating thresholds once achieved
   - This prevents manipulation of the rating system

For more detailed information, consult the official FIDE Handbook.
`;

  useEffect(() => {
    // First set the fallback content as default
    setInfoContent(fallbackContent);
    
    // Fetch from the correct path
    fetch('/content/fide/info.md')
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
  }, []);

  return (
    <div className="prose prose-sm max-w-none text-xs">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-base font-bold mb-2 mt-0" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-sm font-bold mb-1 mt-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xs font-bold mb-1 mt-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-1 text-xs" {...props} />,
          ul: ({node, ...props}) => <ul className="mb-2 ml-4" {...props} />,
          ol: ({node, ...props}) => <ol className="mb-2 ml-4" {...props} />,
          li: ({node, ...props}) => <li className="mb-0.5 text-xs" {...props} />,
          a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />
        }}
      >
        {infoContent}
      </ReactMarkdown>
    </div>
  );
} 