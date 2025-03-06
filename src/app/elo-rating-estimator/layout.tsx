import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chess Rating Calculator',
  description: 'Calculate your USCF chess rating using our online calculator',
};

export default function RatingEstimatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 