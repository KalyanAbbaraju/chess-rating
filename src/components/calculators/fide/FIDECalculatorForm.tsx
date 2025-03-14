'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RatingIdInput } from '@/components/ui/rating-id-input';
import { OpponentsList, Opponent } from '../shared/OpponentsList';
import { FIDEInfo } from './FIDEInfo';
import { calculateFIDERating, GameResult } from '@/lib/fideRatingCalculator';
import { FideRatingResult } from '@/lib/ratingTypes';
import 'katex/dist/katex.min.css';
import DisclaimerModal from '@/components/client/DisclaimerModal';

interface FIDECalculatorFormProps {
  onCalculate: (data: FideRatingResult) => void;
}

// Define the Opponent type and extend FideRatingResult
interface ExtendedFideRatingResult extends FideRatingResult {
  playerId?: string;
}

export function FIDECalculatorForm({ onCalculate }: FIDECalculatorFormProps) {
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
  const [kFactor, setKFactor] = useState('20');
  
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
    setKFactor('20');
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
      // Convert opponents data to required format for calculation
      const gameResults: GameResult[] = opponents
        .filter(opp => opp.rating.trim() !== '') // Only include opponents with ratings
        .map(opp => ({
          opponentRating: parseInt(opp.rating) || 0,
          result: opp.result === 'win' ? 1 : opp.result === 'draw' ? 0.5 : 0 // Convert string result to numeric
        }));
      
      console.log('Processed game results:', gameResults);
      
      // Check if we have any opponents
      if (gameResults.length === 0) {
        setError('Please add at least one opponent with a rating');
        setIsCalculating(false);
        return;
      }
      
      // Get current rating, prior games, and k-factor
      const playerRating = parseInt(currentRating) || 0;
      const playerPriorGames = parseInt(priorGames) || 0;
      const userKFactor = parseInt(kFactor) || 20;
      
      console.log('Calculation inputs:', { playerRating, playerPriorGames, userKFactor });
      
      // Calculate rating
      const calculationResult = calculateFIDERating(
        playerRating,
        playerPriorGames,
        gameResults
      );
      
      console.log('Raw calculation result:', calculationResult);
      
      // Ensure we have a FIDE-type result
      if (calculationResult.type !== 'fide') {
        console.error('Expected FIDE result type but got:', calculationResult.type);
        setError('Unexpected calculation result type');
        setIsCalculating(false);
        return;
      }
      
      // Now we can safely treat this as a FideRatingResult
      const fideResult = calculationResult as ExtendedFideRatingResult;
      
      // Override the k-factor with user selection if provided
      if (!fideResult.isProvisional) {
        fideResult.kFactor = userKFactor;
        
        // Recalculate rating change with user-selected k-factor
        let expectedScore = 0;
        let actualScore = 0;
        
        // Calculate expected score for each game
        for (const { opponentRating, result } of gameResults) {
          const ratingDifference = opponentRating - playerRating;
          const winningExpectancy = 1 / (1 + Math.pow(10, ratingDifference / 400));
          
          expectedScore += winningExpectancy;
          actualScore += result;
        }
        
        // Recalculate rating change with user-selected k-factor
        const ratingChange = userKFactor * (actualScore - expectedScore);
        const newRating = playerRating + Math.round(ratingChange);
        
        fideResult.newRating = Math.round(newRating);
        fideResult.ratingChange = Math.round(ratingChange);
        fideResult.baseRatingChange = Math.round(ratingChange);
      }
      
      // Include the player ID for reference
      (fideResult as ExtendedFideRatingResult).playerId = playerId;
      
      console.log('Final calculation result to send to parent:', fideResult);
      
      // Pass result to parent component
      onCalculate(fideResult);
      
    } catch (err) {
      console.error('Error during calculation:', err);
      setError('An error occurred during calculation. Please check your inputs and try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const getKFactorLabel = () => {
    switch(kFactor) {
      case '10': return '10 (2400+)';
      case '20': return '20 (Standard)';
      case '40': return '40 (New player)';
      default: return kFactor;
    }
  };

  // Input styles for consistent styling - only bottom border with blue highlight
  const inputClasses = "w-full max-w-[120px] py-1 text-xs text-gray-700 bg-transparent border-0 border-b border-gray-300 rounded-none hover:border-gray-400 transition-colors focus:ring-0 focus:outline-none focus:border-b-2 focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-8";
  const selectClasses = "w-full max-w-[120px] py-1 text-xs text-gray-700 bg-transparent border-0 border-b border-gray-300 rounded-none hover:border-gray-400 transition-colors focus:ring-0 focus:outline-none focus:border-b-2 focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-8";

  // Add effect to inject disclaimer content directly into DOM without visible elements
  useEffect(() => {
    // Create the content container if it doesn't exist
    if (!document.querySelector('[data-disclaimer-content="FIDE"]')) {
      const container = document.createElement('div');
      container.setAttribute('data-disclaimer-content', 'FIDE');
      container.style.display = 'none';
      
      const content = document.createElement('div');
      content.className = 'disclaimer-details-content';
      
      content.innerHTML = `
        <p class="mb-3">
          The FIDE rating calculator provided on this site is an <strong>estimation tool</strong> 
          that implements the official FIDE rating formulas to the best of our ability. However, users should note:
        </p>
        
        <ul class="list-disc pl-5 mb-3 space-y-2">
          <li>
            This calculator may not account for every special case or exception in the official FIDE rating system.
          </li>
          <li>
            Official FIDE ratings are calculated by the International Chess Federation using their proprietary systems and may include additional factors not covered in this calculator.
          </li>
          <li>
            Rating floors, provisional rating rules, and special tournament conditions may affect official calculations in ways not fully reflected here.
          </li>
          <li>
            The calculator does not have access to FIDE's database of official ratings and relies on user-provided information.
          </li>
        </ul>
        
        <p class="mb-3">
          For official ratings, tournament results, and rating changes, please refer to the 
          <a href="https://ratings.fide.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 mx-1">
            FIDE website
          </a>
          or contact them directly.
        </p>
        
        <p>
          This tool is provided for educational and informational purposes only.
        </p>
      `;
      
      container.appendChild(content);
      document.body.appendChild(container);
    }
  }, []);

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
                  <SelectItem value="20" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">
                    20 (Standard)
                  </SelectItem>
                  <SelectItem value="40" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">
                    40 (New player)
                  </SelectItem>
                  <SelectItem value="10" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">
                    10 (2400+)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <RatingIdInput
              id="playerId"
              label="FIDE ID"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="e.g., 12345678"
              profileUrlPattern="https://ratings.fide.com/profile/{id}"
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
          
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button 
                onClick={reset}
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs px-4 border-gray-300 hover:bg-gray-50 hover:text-gray-700 rounded-md"
                disabled={isCalculating}
              >
                Reset
              </Button>
            </div>
            
            <Button
              onClick={handleSubmit}
              type="button"
              variant="default"
              size="sm"
              className="h-8 text-xs px-4 bg-blue-600 hover:bg-blue-700 rounded-md"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <line x1="4" y1="10" x2="20" y2="10"></line>
                    <line x1="10" y1="4" x2="10" y2="20"></line>
                  </svg>
                  Calculate
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="information" className="focus:outline-none">
          <FIDEInfo />
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 border-t border-gray-200 mt-3">
        <DisclaimerModal
          shortText="This is an estimate only; actual FIDE calculations may vary slightly."
          title="FIDE Rating Calculation Disclaimer"
          organization="FIDE"
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