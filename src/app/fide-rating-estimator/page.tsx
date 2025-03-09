import { Metadata } from 'next';
import FideEstimator from '@/components/fide-rating-estimator/FideEstimator';
import DisclaimerContent from '@/components/server/DisclaimerContent';
import ServerInfoContent from '@/components/server/ServerInfoContent';

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
      {/* Server-rendered disclaimer content */}
      <DisclaimerContent organization="FIDE" />
      
      {/* Pre-render the informational content */}
      <ServerInfoContent contentPath="/content/fide/info.md" />
      
      {/* Client-side interactive calculator */}
      <FideEstimator />
    </>
  );
}
