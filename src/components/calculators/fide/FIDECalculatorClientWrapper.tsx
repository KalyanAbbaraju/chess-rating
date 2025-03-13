'use client';

import React from 'react';
import { FIDECalculator } from './FIDECalculator';

interface FIDECalculatorClientWrapperProps {
  title: string;
  description: string;
}

export function FIDECalculatorClientWrapper({ title, description }: FIDECalculatorClientWrapperProps) {
  // Simple wrapper that just passes props to the calculator
  return (
    <FIDECalculator
      title={title}
      description={description}
    />
  );
} 