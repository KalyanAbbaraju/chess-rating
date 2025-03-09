import { Metadata } from 'next';
import FideEstimator from '@/components/fide-rating-estimator/FideEstimator';
import DisclaimerContent from '@/components/server/DisclaimerContent';

export const metadata: Metadata = {
  title: 'FIDE Rating Calculator | Chess Companion',
  description: 'Calculate your FIDE chess rating changes using the official FIDE Elo formula. Accurate chess rating estimator for international tournaments.',
  keywords: 'FIDE rating calculator, chess Elo calculator, FIDE Elo formula, chess rating estimator, international chess rating',
  openGraph: {
    title: 'FIDE Chess Rating Calculator',
    description: 'Calculate your FIDE chess rating changes using the official FIDE Elo formula.',
    type: 'website',
    images: [
      {
        url: '/images/fide-calculator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'FIDE Chess Rating Calculator'
      }
    ]
  }
};

export default function FideRatingEstimatorPage() {
  return (
    <>
      {/* Server-rendered content for SEO */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">FIDE Rating Calculator</h1>
        <p className="text-gray-600">
          Calculate your expected FIDE rating changes based on your game results using the official FIDE Elo formula.
          This estimator helps chess players predict their new rating after tournaments or rated games.
        </p>
      </div>
      
      {/* Server-rendered disclaimer content */}
      <DisclaimerContent organization="FIDE" />
      
      {/* Client-side interactive calculator */}
      <FideEstimator />
    </>
  );
}
