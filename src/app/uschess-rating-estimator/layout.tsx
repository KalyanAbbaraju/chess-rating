// This is a server component
export const metadata = {
  title: 'US Chess Rating Estimator | Chess Companion',
  description: 'Calculate your US Chess rating changes and performance rating with this free online calculator.',
};

export default function UsChessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
} 