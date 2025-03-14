'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export function ECFInfo() {
  const [infoContent, setInfoContent] = useState<string>('');
  
  // Default content as fallback
  const fallbackContent = `
# ECF Rating Calculation Methodology

The **English Chess Federation (ECF)** uses a mathematical system to calculate and update player ratings based on tournament performance. Here's how it works:

## Key Concepts

1. **ECF Rating Scale**:
   - Ranges from **0 to 300+**.
   - Higher ratings indicate stronger players.
   - Rough comparison to FIDE ratings:
     - ECF **100** ≈ FIDE **1500**
     - ECF **200** ≈ FIDE **2000**

2. **Expected Score**
The expected score for a game is calculated using the formula:

$$
\\text{Expected Score} = \\frac{1}{1 + 10^{(\\text{Opponent's Rating} - \\text{Your Rating}) / 50}}
$$

3. **Rating Change**
The rating change for a player is calculated using:

$$
\\text{Rating Change} = K \\times (\\text{Actual Score} - \\text{Expected Score})
$$

- **K** is a constant:
  - **K = 40** for most players.
  - **K = 20** for established players.

## Example Calculation

A player with an ECF rating of **150** plays against an opponent rated **100**:

- Expected Score: 1 / (1 + 10^((100 - 150) / 50)) = 0.91
- If the player wins (Actual Score = 1), Rating Change: 40 × (1 - 0.91) = 3.6
- New Rating: 150 + 3.6 = 153.6 (rounded to 154)
`;

  useEffect(() => {
    // First set the fallback content as default
    setInfoContent(fallbackContent);
    
    // Fetch from the correct path
    fetch('/content/ecf/info.md')
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
} 