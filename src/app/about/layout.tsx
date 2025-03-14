import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'About | Elo Estimate',
  description: 'Learn about the Elo Estimate app and team',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'light',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 