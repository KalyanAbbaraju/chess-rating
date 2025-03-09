'use client';

import { Suspense } from 'react';
import ClientUsChessEstimator from '@/components/uschess-rating-estimator/ClientUsChessEstimator';

export default function ClientWrapper() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center p-12">
        <div className="animate-pulse text-gray-500">Loading calculator...</div>
      </div>
    }>
      <ClientUsChessEstimator />
    </Suspense>
  );
} 