'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RatingIdInput } from '@/components/ui/rating-id-input';
import { OpponentsList, Opponent } from '../shared/OpponentsList';
import { EcfRatingResult } from '@/lib/ratingTypes';
import { BiCalculator } from 'react-icons/bi';
import DisclaimerModal from '@/components/client/DisclaimerModal';
import { ECFInfo } from './ECFInfo';
import 'katex/dist/katex.min.css';

interface ECFCalculatorFormProps {
  onCalculate: (result: EcfRatingResult) => void;
}

// Extend the EcfRatingResult interface to include playerId
interface ExtendedEcfRatingResult extends EcfRatingResult {
  playerId?: string;
}

export function ECFCalculatorForm({ onCalculate }: ECFCalculatorFormProps) {
  // Basic inputs
  const [currentRating, setCurrentRating] = useState('');
  const [priorGames, setPriorGames] = useState('0');
  const [playerId, setPlayerId] = useState('');
  
  // Multiple games
  const [opponents, setOpponents] = useState<Opponent[]>([
    {rating: '', result: 'win'},
    {rating: '', result: 'win'},
    {rating: '', result: 'win'},
    {rating: '', result: 'win'}
  ]);
  
  // Advanced options
  const [kFactor, setKFactor] = useState('40'); // Default ECF K-factor is 40
  
  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addOpponent = () => {
    setOpponents([...opponents, {rating: '', result: 'win'}]);
  };
  
  const removeOpponent = (index: number) => {
    const newOpponents = [...opponents];
    newOpponents.splice(index, 1);
    setOpponents(newOpponents);
  };
  
  const updateOpponent = (index: number, field: 'rating' | 'result', value: string) => {
    const newOpponents = [...opponents];
    newOpponents[index] = {...newOpponents[index], [field]: value};
    setOpponents(newOpponents);
  };

  const setResultForOpponent = (index: number, result: 'win' | 'draw' | 'loss') => {
    updateOpponent(index, 'result', result);
  };

  const reset = () => {
    setCurrentRating('');
    setPriorGames('0');
    setPlayerId('');
    setKFactor('40');
    setOpponents([
      {rating: '', result: 'win'},
      {rating: '', result: 'win'},
      {rating: '', result: 'win'},
      {rating: '', result: 'win'}
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Calculate button clicked - starting calculation');
    setError(null);
    setIsCalculating(true);
    
    try {
      // Validate inputs
      if (!currentRating) {
        setError('Please enter your current rating');
        setIsCalculating(false);
        return;
      }

      const currentRatingNum = parseInt(currentRating, 10);
      if (isNaN(currentRatingNum) || currentRatingNum < 0) {
        setError('Your rating must be a valid positive number');
        setIsCalculating(false);
        return;
      }

      // Filter out opponents with empty ratings
      const validOpponents = opponents.filter(opp => opp.rating.trim() !== '');
      if (validOpponents.length === 0) {
        setError('Please enter at least one opponent rating');
        setIsCalculating(false);
        return;
      }

      // Validate all opponent ratings
      for (const opp of validOpponents) {
        const oppRating = parseInt(opp.rating, 10);
        if (isNaN(oppRating) || oppRating < 0) {
          setError('All opponent ratings must be valid positive numbers');
          setIsCalculating(false);
          return;
        }
      }

      // Process each opponent sequentially to calculate cumulative rating change
      let runningRating = currentRatingNum;
      let finalResult: ExtendedEcfRatingResult | null = null;

      import('@/lib/ecfChessRatingCalculator').then(async ({ calculateECFRating }) => {
        for (const opp of validOpponents) {
          const result = calculateECFRating({
            currentRating: runningRating,
            opponentRating: parseInt(opp.rating, 10),
            result: opp.result as 'win' | 'draw' | 'loss',
            kFactor: parseInt(kFactor)
          });
          
          runningRating = result.newRating;
          finalResult = result;
        }
        
        if (finalResult) {
          // Update the final result with the original rating and total games
          finalResult.currentRating = currentRatingNum;
          finalResult.totalGames = validOpponents.length;
          finalResult.ratingChange = runningRating - currentRatingNum;
          finalResult.baseRatingChange = runningRating - currentRatingNum;
          
          // Include the player ID for reference
          (finalResult as ExtendedEcfRatingResult).playerId = playerId;
          
          console.log('Final calculation result to send to parent:', finalResult);
          
          // Pass result to parent component
          onCalculate(finalResult);
        }
        
        setIsCalculating(false);
      }).catch(err => {
        console.error('Error calculating multiple games:', err);
        setError('An error occurred while calculating the rating changes');
        setIsCalculating(false);
      });
    } catch (err) {
      console.error('Error during calculation:', err);
      setError('An error occurred during calculation. Please check your inputs and try again.');
      setIsCalculating(false);
    }
  };

  const getKFactorLabel = () => {
    switch(kFactor) {
      case '40': return '40 (Standard)';
      case '20': return '20 (Established players)';
      default: return kFactor;
    }
  };

  // Input styles for consistent styling - only bottom border with blue highlight
  const inputClasses = "w-full max-w-[120px] py-1 text-xs text-gray-700 bg-transparent border-0 border-b border-gray-300 rounded-none hover:border-gray-400 transition-colors focus:ring-0 focus:outline-none focus:border-b-2 focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-8";
  const selectClasses = "w-full max-w-[120px] py-1 text-xs text-gray-700 bg-transparent border-0 border-b border-gray-300 rounded-none hover:border-gray-400 transition-colors focus:ring-0 focus:outline-none focus:border-b-2 focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-8";

  return (
    <div className="w-full">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="flex w-full mb-4">
          <TabsTrigger value="calculator" className="flex items-center py-1.5 px-3 text-xs">
            <svg 
              className="w-3 h-3 mr-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <line x1="4" y1="10" x2="20" y2="10"></line>
              <line x1="10" y1="4" x2="10" y2="20"></line>
            </svg>
            Calculator
          </TabsTrigger>
          <TabsTrigger value="information" className="flex items-center py-1.5 px-3 text-xs">
            <svg 
              className="w-3 h-3 mr-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="focus:outline-none">
          <h3 className="text-xs font-medium text-gray-800 mb-2">Player Information</h3>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="currentRating" className="block text-xs font-medium text-gray-700 mb-0.5">Current Rating</Label>
              <Input 
                id="currentRating"
                type="text" 
                placeholder="Your current rating" 
                value={currentRating}
                onChange={(e) => setCurrentRating(e.target.value)}
                className={inputClasses}
              />
            </div>
            
            <div>
              <Label htmlFor="priorGames" className="block text-xs font-medium text-gray-700 mb-0.5">Prior Games</Label>
              <Input 
                id="priorGames"
                type="text" 
                value={priorGames}
                onChange={(e) => setPriorGames(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="kFactor" className="block text-xs font-medium text-gray-700 mb-0.5">K-Factor</Label>
              <Select 
                value={kFactor} 
                onValueChange={setKFactor}
              >
                <SelectTrigger id="kFactor" className={selectClasses}>
                  <SelectValue placeholder={getKFactorLabel()} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md min-w-[180px] p-0" position="popper">
                  <SelectItem value="40" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">
                    40 (Standard)
                  </SelectItem>
                  <SelectItem value="20" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">
                    20 (Established players)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <RatingIdInput
              id="playerId"
              label="ECF ID"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="e.g., 123456A"
              profileUrlPattern="https://www.ecfrating.org.uk/v2/new/player.php?ECF_code={id}"
              optional={true}
            />
          </div>
          
          <OpponentsList
            opponents={opponents}
            onAddOpponent={addOpponent}
            onRemoveOpponent={removeOpponent}
            onUpdateOpponent={updateOpponent}
            onSetResult={setResultForOpponent}
            inputStyles={inputClasses}
          />
          
          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              {error}
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <Button 
              onClick={reset}
              type="button"
              variant="outline"
              className="h-8 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 px-3 font-normal"
            >
              Reset
            </Button>
            
            <Button 
              onClick={handleSubmit}
              type="button"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 px-3 font-normal"
              disabled={isCalculating}
            >
              <BiCalculator className="w-3.5 h-3.5" />
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              This calculator provides an estimate based on the ECF rating formula.
              Actual rating changes may vary based on official ECF calculations.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="information" className="focus:outline-none">
          <ECFInfo />
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 border-t border-gray-200 mt-4">
        <DisclaimerModal
          shortText="This is an estimate only; actual ECF calculations may vary slightly."
          title="ECF Rating Calculation Disclaimer"
          organization="ECF"
          className="px-3 py-2 text-xs custom-disclaimer"
        />
      </div>
      
      <style jsx global>{`
        .custom-disclaimer button {
          color: #4b5563;
        }
        /* Improve the visibility of disclaimer content */
        .disclaimer-details-content {
          color: #333 !important;
        }
      `}</style>
    </div>
  );
} 