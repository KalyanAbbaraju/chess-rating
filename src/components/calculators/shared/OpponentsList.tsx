"use client"

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Opponent type definition
export interface Opponent {
  rating: string;
  result: 'win' | 'draw' | 'loss';
}

// OpponentsList component for reuse across different calculator forms
export function OpponentsList({
  opponents,
  onAddOpponent,
  onRemoveOpponent,
  onUpdateOpponent,
  onSetResult,
  inputStyles
}: {
  opponents: Opponent[];
  onAddOpponent: () => void;
  onRemoveOpponent: (index: number) => void;
  onUpdateOpponent: (index: number, field: 'rating' | 'result', value: string) => void;
  onSetResult: (index: number, result: 'win' | 'draw' | 'loss') => void;
  inputStyles: string;
}) {
  return (
    <div className="mt-3 mb-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-medium text-gray-800">Opponents</h3>
        <Button 
          type="button" 
          onClick={onAddOpponent} 
          className="flex items-center text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md px-2 py-0 hover:bg-gray-50 h-7"
        >
          + Add Opponent
        </Button>
      </div>
      
      <div className="border border-gray-200 rounded-md p-2">
        {opponents.map((opponent, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2 last:mb-0">
            <div className="text-gray-600 w-4 text-right text-xs">{index + 1}.</div>
            
            <Input 
              type="text"
              placeholder="Rating"
              value={opponent.rating}
              onChange={(e) => onUpdateOpponent(index, 'rating', e.target.value)}
              className={`${inputStyles} flex-grow max-w-[120px] h-8`}
            />
            
            <div className="flex rounded overflow-hidden border border-gray-200 h-8">
              <button
                type="button"
                onClick={() => onSetResult(index, 'win')}
                className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${opponent.result === 'win' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-700 hover:bg-green-50'}`}
              >
                W
              </button>
              <button
                type="button"
                onClick={() => onSetResult(index, 'draw')}
                className={`w-8 h-8 flex items-center justify-center text-xs font-medium border-l border-r border-gray-200 ${opponent.result === 'draw' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-700 hover:bg-yellow-50'}`}
              >
                D
              </button>
              <button
                type="button"
                onClick={() => onSetResult(index, 'loss')}
                className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${opponent.result === 'loss' ? 'bg-red-100 text-red-800' : 'bg-white text-gray-700 hover:bg-red-50'}`}
              >
                L
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => onRemoveOpponent(index)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 w-8 h-8 flex items-center justify-center"
              disabled={opponents.length === 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 