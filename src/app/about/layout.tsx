import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Chess Companion',
  description: 'Learn about the Chess Companion app and team',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 