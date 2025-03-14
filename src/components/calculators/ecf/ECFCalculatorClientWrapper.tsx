'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to prevent chunk loading errors
const ECFCalculator = dynamic(
  () => import('./ECFCalculator').then(mod => ({ default: mod.ECFCalculator })),
  { ssr: false }
);

export function ECFCalculatorClientWrapper() {
  return (
    <div className="w-full">
      <ECFCalculator />
    </div>
  );
} 