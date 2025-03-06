'use client';

import React from 'react';
import FideRatingEstimator from '@/components/fide-rating-estimator/FideRatingEstimator';

export default function FideRatingEstimatorPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">FIDE Chess Rating Estimator</h1>
      <p className="mb-6 text-gray-700">
        This calculator uses the FIDE rating formulas to estimate performance ratings and potential rating changes based on your tournament results.
      </p>
      
      <FideRatingEstimator />
    </div>
  );
}
