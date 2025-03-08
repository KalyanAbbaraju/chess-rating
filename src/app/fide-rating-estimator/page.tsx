'use client';

import React from 'react';
import FideEstimator from '@/components/fide-rating-estimator/FideEstimator';

export default function FideRatingEstimatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">FIDE Rating Estimator</h1>
      <FideEstimator />
    </div>
  );
}
