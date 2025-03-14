import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Elo Estimate',
  description: 'Contact the Elo Estimate team with questions or feedback',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'light',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 