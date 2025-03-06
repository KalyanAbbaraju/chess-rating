'use client';

import React from 'react';
import EloEstimator from '@/components/elo-estimator/EloEstimator';

export default function RatingEstimatorPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">USCF Chess Rating Estimator</h1>
      <p className="mb-6 text-gray-700">
        This calculator uses the USCF rating formulas in effect since June 1, 2017, when the bonus threshold was raised from 12 to 14.
      </p>
      
      <EloEstimator />
    </div>
  );
}
