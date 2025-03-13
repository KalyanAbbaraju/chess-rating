'use client';

import React from 'react';
import { USChessCalculator } from './USChessCalculator';

interface USChessCalculatorClientWrapperProps {
  title?: string;
  description?: string;
}

export function USChessCalculatorClientWrapper({ 
  title, 
  description 
}: USChessCalculatorClientWrapperProps) {
  return (
    <USChessCalculator 
      title={title}
      description={description}
    />
  );
} 