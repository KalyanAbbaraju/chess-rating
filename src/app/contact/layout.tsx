import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Chess Companion',
  description: 'Contact the Chess Companion team with questions or feedback',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 