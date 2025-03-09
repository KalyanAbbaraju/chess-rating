// This is a Server Component by default in Next.js (no 'use client' directive)
import React from 'react';

export interface DisclaimerContentProps {
  organization: 'FIDE' | 'USCF';
}

const DisclaimerContent: React.FC<DisclaimerContentProps> = ({ organization }) => {
  // This content is now rendered on the server
  const content = organization === 'FIDE' 
    ? {
        shortText: "This is an estimate only; actual FIDE calculations may vary slightly.",
        title: "FIDE Rating Calculation Disclaimer",
        details: (
          <>
            <p className="mb-3">
              The rating calculations provided by this tool are based on the published FIDE Elo 
              rating formulas and are intended to be used for estimation purposes only.
            </p>
            
            <p className="mb-3">
              Actual official FIDE ratings may differ due to several factors:
            </p>
            
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Special rating adjustments applied by FIDE</li>
              <li>Rounding differences in calculation methods</li>
              <li>Tournament-specific rules or exceptions</li>
              <li>Recent changes to the rating formula not yet reflected in this tool</li>
              <li>Rating floor considerations for age groups</li>
              <li>K-factor differences for different player categories</li>
            </ul>
            
            <p className="mb-3">
              <strong>Important note:</strong> FIDE ratings are calculated monthly, and all games within a rating 
              period are considered together. This estimator calculates based on individual games which may differ 
              from FIDE&apos;s batch processing approach.
            </p>
            
            <p className="mb-3">
              For official ratings, always refer to FIDE&apos;s official website and publications. 
              This tool does not replace official ratings issued by FIDE.
            </p>
            
            <p>
              The developers of this tool make no guarantees about the accuracy of these estimates 
              and are not affiliated with or endorsed by FIDE.
            </p>
          </>
        )
      }
    : {
        shortText: "This is an estimate only; actual US Chess calculations may vary slightly.",
        title: "US Chess Rating Calculation Disclaimer",
        details: (
          <>
            <p className="mb-3">
              The rating calculations provided by this tool are based on the published US Chess Federation 
              rating formulas and are intended to be used for estimation purposes only.
            </p>
            
            <p className="mb-3">
              Actual official US Chess ratings may differ due to several factors:
            </p>
            
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Special rating adjustments applied by US Chess</li>
              <li>Rounding differences in calculation methods</li>
              <li>Tournament-specific rules or exceptions</li>
              <li>Recent changes to the rating formula not yet reflected in this tool</li>
              <li>Rating floor considerations</li>
              <li>Provisional rating calculations for new players</li>
            </ul>
            
            <p className="mb-3">
              <strong>Important note:</strong> We strongly discourage players from using this estimator to decide 
              whether to withdraw from an event based on their estimated post-event rating. The estimator may 
              be off by a point or two!
            </p>
            
            <p className="mb-3">
              For official ratings, always refer to US Chess&apos;s official website and publications. 
              This tool does not replace official ratings issued by US Chess.
            </p>
            
            <p>
              The developers of this tool make no guarantees about the accuracy of these estimates 
              and are not affiliated with or endorsed by the US Chess Federation.
            </p>
          </>
        )
      };

  return (
    <div data-disclaimer-content={organization} className="hidden">
      <div data-disclaimer-short>{content.shortText}</div>
      <div data-disclaimer-title>{content.title}</div>
      <div data-disclaimer-details className="disclaimer-details-content">
        {content.details}
      </div>
    </div>
  );
};

export default DisclaimerContent; 