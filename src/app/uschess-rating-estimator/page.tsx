import { redirect } from 'next/navigation';

export default function UsChessRatingEstimatorPage() {
  redirect('/calculators/uscf');
  return null;
}
