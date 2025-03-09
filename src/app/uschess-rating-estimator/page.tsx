import { Metadata } from 'next';
import DisclaimerContent from '@/components/server/DisclaimerContent';
import ServerInfoContent from '@/components/server/ServerInfoContent';
import ClientWrapper from './client-wrapper';

export const metadata: Metadata = {
  title: 'US Chess Rating Calculator | Chess Companion',
  description: 'Calculate your US Chess rating changes using the official USCF formula. Accurate chess rating estimator for US tournament players.',
  keywords: 'US Chess rating calculator, USCF rating estimator, chess rating change, post-tournament rating, chess rating formula',
  openGraph: {
    title: 'US Chess Rating Calculator',
    description: 'Calculate your expected US Chess rating changes based on tournament performance.',
    type: 'website',
    images: [
      {
        url: '/images/uschess-calculator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'US Chess Rating Calculator'
      }
    ]
  }
};

export default function UsChessRatingEstimatorPage() {
  return (
    <>
      {/* Server components */}
      <DisclaimerContent organization="USCF" />
      <ServerInfoContent contentPath="/content/uschess/info.md" />
      
      {/* Client wrapper */}
      <ClientWrapper />
    </>
  );
}
