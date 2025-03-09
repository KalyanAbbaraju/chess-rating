import React from 'react';
import UsChessEstimator from '@/components/uschess-rating-estimator/UsChessEstimator';

export const metadata = {
  title: 'US Chess Rating Estimator | Chess Companion',
  description: 'Calculate your US Chess rating changes and performance rating with this free online calculator.',
};

export default function USChessRatingEstimatorPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      { /*
      <h1 className="text-3xl font-bold mb-2">US Chess Rating Estimator</h1>
      <p className="text-gray-600 mb-6">
        This calculator uses the US Chess rating formulas in effect since June 1, 2017, when the bonus threshold was raised from 12 to 14.
      </p>
      */}
      <UsChessEstimator />
    </div>
  );
}
