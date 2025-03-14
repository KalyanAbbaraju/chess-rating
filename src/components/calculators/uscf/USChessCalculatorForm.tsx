'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { USChessInfo } from './USChessInfo';
import { calculateUsChessRating } from '@/lib/usChessRatingCalculator';
import { UsChessRatingResult } from '@/lib/ratingTypes';
import { Switch } from '@/components/ui/switch';
import { FiInfo } from 'react-icons/fi';
import { BiCalculator } from 'react-icons/bi';
import { RatingIdInput } from '@/components/ui/rating-id-input';
import { OpponentsList, Opponent } from '../shared/OpponentsList';
import 'katex/dist/katex.min.css';
import DisclaimerModal from '@/components/client/DisclaimerModal';

interface USChessCalculatorFormProps {
  onCalculate: (data: UsChessRatingResult) => void;
}

export function USChessCalculatorForm({ onCalculate }: USChessCalculatorFormProps) {
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
  
  // Additional options
  const [highestRating, setHighestRating] = useState('');
  const [ageRange, setAgeRange] = useState('none');
  const [applyBonus, setApplyBonus] = useState(true);
  const [isLifeMaster, setIsLifeMaster] = useState(false);
  const [fideRating, setFideRating] = useState('');
  const [cfcRating, setCfcRating] = useState('');
  
  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Input styles for consistent styling - only bottom border with blue highlight
  const inputClasses = "w-full max-w-[120px] py-1 text-xs text-gray-700 bg-transparent border-0 border-b border-gray-300 rounded-none hover:border-gray-400 transition-colors focus:ring-0 focus:outline-none focus:border-b-2 focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-8";
  const selectClasses = "w-full max-w-[120px] py-1 text-xs text-gray-700 bg-transparent border-0 border-b border-gray-300 rounded-none hover:border-gray-400 transition-colors focus:ring-0 focus:outline-none focus:border-b-2 focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-8";
  
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
    newOpponents[index] = {...newOpponents[index], [field]: value as 'win' | 'draw' | 'loss'};
    setOpponents(newOpponents);
  };

  const setResultForOpponent = (index: number, result: 'win' | 'draw' | 'loss') => {
    updateOpponent(index, 'result', result);
  };

  const reset = () => {
    setCurrentRating('');
    setPriorGames('0');
    setPlayerId('');
    setHighestRating('');
    setAgeRange('none');
    setApplyBonus(true);
    setIsLifeMaster(false);
    setFideRating('');
    setCfcRating('');
    setOpponents([
      {rating: '', result: 'win'},
      {rating: '', result: 'win'},
      {rating: '', result: 'win'},
      {rating: '', result: 'win'}
    ]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCalculating(true);

    // Validate inputs
    if (!currentRating || isNaN(Number(currentRating))) {
      setError('Please enter a valid current rating');
      setIsCalculating(false);
      return;
    }

    if (!priorGames || isNaN(Number(priorGames))) {
      setError('Please enter a valid number of prior games');
      setIsCalculating(false);
      return;
    }

    // Check if at least one opponent has been entered with a valid rating
    const validOpponents = opponents.filter(
      (opp) => opp.rating && !isNaN(Number(opp.rating))
    );

    if (validOpponents.length === 0) {
      setError('Please enter at least one opponent with a valid rating');
      setIsCalculating(false);
      return;
    }

    try {
      // Convert age range to numeric value
      let playerAge = 40; // Default to adult
      switch (ageRange) {
        case 'none': playerAge = 40; break; // Default for "Not specified"
        case 'under12': playerAge = 10; break;
        case '12to18': playerAge = 15; break;
        case '19to64': playerAge = 40; break;
        case '65plus': playerAge = 65; break;
      }

      // Convert opponents to game results
      const gameResults = validOpponents.map(opp => ({
        opponentRating: Number(opp.rating),
        result: opp.result === 'win' ? 1 : opp.result === 'draw' ? 0.5 : 0
      }));

      // Calculate the rating
      const result = calculateUsChessRating(
        Number(currentRating),
        Number(priorGames),
        gameResults,
        applyBonus,
        Number(highestRating) || Number(currentRating),
        playerAge,
        Number(fideRating) || 0,
        Number(cfcRating) || 0,
        isLifeMaster
      );
      
      // Check if the result is of type UsChessRatingResult
      if (result.type === 'uschess') {
        // Pass the result to the parent component
        onCalculate(result);
        
        // If needed, you can store the player ID in state or elsewhere
      } else {
        throw new Error('Unexpected result type from calculation');
      }
      
      setIsCalculating(false);
    } catch (error) {
      setError(`Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsCalculating(false);
    }
  };

  // Add effect to inject disclaimer content directly into DOM without visible elements
  useEffect(() => {
    // Create the content container if it doesn't exist
    if (!document.querySelector('[data-disclaimer-content="USCF"]')) {
      const container = document.createElement('div');
      container.setAttribute('data-disclaimer-content', 'USCF');
      container.style.display = 'none';
      
      const content = document.createElement('div');
      content.className = 'disclaimer-details-content';
      
      content.innerHTML = `
        <p class="mb-3">
          The US Chess rating calculator provided on this site is an <strong class="text-green-600">estimation tool</strong> 
          that implements the official US Chess rating formulas to the best of our ability. However, users should note:
        </p>
        
        <ul class="list-disc pl-5 mb-3 space-y-2">
          <li>
            This calculator may not account for every special case or exception in the official US Chess rating system.
          </li>
          <li>
            Official US Chess ratings are calculated by the US Chess Federation using their proprietary systems and may include additional factors not covered in this calculator.
          </li>
          <li>
            Rating floors, provisional rating rules, and special tournament conditions may affect official calculations in ways not fully reflected here.
          </li>
          <li>
            The calculator does not have access to the US Chess Federation's database of official ratings and relies on user-provided information.
          </li>
        </ul>
        
        <p class="mb-3">
          For official ratings, tournament results, and rating changes, please refer to the 
          <a href="https://www.uschess.org/" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-800 mx-1">
            US Chess Federation website
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
    <form onSubmit={handleSubmit} className="w-full">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="flex w-full mb-4">
          <TabsTrigger value="calculator" className="flex items-center py-1.5 px-3 text-xs">
            <BiCalculator className="w-3 h-3 mr-1" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center py-1.5 px-3 text-xs">
            <FiInfo className="w-3 h-3 mr-1" />
            Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="focus:outline-none">
          <h3 className="text-xs font-medium text-gray-800 mb-2">Player Information</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
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
            
            <RatingIdInput
              id="playerId"
              label="US Chess ID"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="e.g., 12345678"
              profileUrlPattern="https://www.uschess.org/msa/MbrDtlMain.php?{id}"
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
          
          <div className="mt-4">
            <h3 className="text-xs font-medium text-gray-800 mb-2">Additional Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="highestRating" className="block text-xs font-medium text-gray-700 mb-0.5">Highest Rating (optional)</Label>
                <Input
                  id="highestRating"
                  type="text"
                  value={highestRating}
                  onChange={(e) => setHighestRating(e.target.value)}
                  placeholder="e.g. 1800"
                  className={inputClasses}
                />
              </div>
              
              <div>
                <Label htmlFor="ageRange" className="block text-xs font-medium text-gray-700 mb-0.5">Age Range</Label>
                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger id="ageRange" className={selectClasses}>
                    <SelectValue placeholder="Not specified" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md min-w-[180px] p-0" position="popper">
                    <SelectItem value="none" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">Not specified</SelectItem>
                    <SelectItem value="under12" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">Under 12</SelectItem>
                    <SelectItem value="12to18" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">12-18 years</SelectItem>
                    <SelectItem value="19to64" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">19-64 years</SelectItem>
                    <SelectItem value="65plus" className="text-xs py-1.5 pr-2 pl-8 hover:bg-gray-50 focus:bg-gray-100">65 and older</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="fideRating" className="block text-xs font-medium text-gray-700 mb-0.5">FIDE Rating (optional)</Label>
                <Input
                  id="fideRating"
                  type="text"
                  value={fideRating}
                  onChange={(e) => setFideRating(e.target.value)}
                  placeholder="e.g. 1600"
                  className={inputClasses}
                />
              </div>
              
              <div>
                <Label htmlFor="cfcRating" className="block text-xs font-medium text-gray-700 mb-0.5">CFC Rating (optional)</Label>
                <Input
                  id="cfcRating"
                  type="text"
                  value={cfcRating}
                  onChange={(e) => setCfcRating(e.target.value)}
                  placeholder="e.g. 1700"
                  className={inputClasses}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="applyBonus"
                  checked={applyBonus}
                  onCheckedChange={setApplyBonus}
                  className="h-5 w-10 shrink-0 cursor-pointer rounded-full border-0 transition-colors data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                />
                <Label 
                  htmlFor="applyBonus" 
                  className="text-xs text-gray-700"
                >
                  Apply bonus points
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="lifeMaster"
                  checked={isLifeMaster}
                  onCheckedChange={setIsLifeMaster}
                  className="h-5 w-10 shrink-0 cursor-pointer rounded-full border-0 transition-colors data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                />
                <Label 
                  htmlFor="lifeMaster" 
                  className="text-xs text-gray-700"
                >
                  Life Master
                </Label>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              {error}
            </div>
          )}
          
          <div className="mt-5 flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              className="h-8 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 px-3 font-normal"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 px-3 font-normal"
              disabled={isCalculating}
            >
              <BiCalculator className="w-3.5 h-3.5" />
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="info" className="focus:outline-none">
          <USChessInfo />
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 border-t border-gray-200 mt-4">
        <DisclaimerModal
          shortText="This is an estimate only; actual US Chess calculations may vary slightly."
          title="US Chess Rating Calculation Disclaimer"
          organization="USCF"
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
    </form>
  );
} 