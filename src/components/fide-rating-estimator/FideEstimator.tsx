'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Facebook, Twitter, Calculator, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { calculateFIDERating } from '@/lib/fideRatingCalculator';
import { RatingResult } from '@/lib/ratingTypes';
import RatingChangeVisual from '../shared/RatingChangeVisual';
import RatingResultsTable from '../shared/RatingResultsTable';
import InfoContent from '../shared/InfoContent';
import OpponentList, { OpponentData } from '../shared/OpponentList';

// Add utility function to generate random ID if it doesn't exist elsewhere
const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const FideEstimator: React.FC = () => {
  const [opponents, setOpponents] = useState<OpponentData[]>([
    { rating: '', result: 'win', id: generateId() },
    { rating: '', result: 'win', id: generateId() },
    { rating: '', result: 'win', id: generateId() },
    { rating: '', result: 'win', id: generateId() }
  ]);
  const [currentRating, setCurrentRating] = useState<string>('');
  const [fideId, setFideId] = useState<string>('');
  const [results, setResults] = useState<RatingResult | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [visualizationType, setVisualizationType] = useState<'visual' | 'table'>('visual');
  const [kFactor, setKFactor] = useState<string>('20');
  const [previousGames, setPreviousGames] = useState<string>('0');
  
  // Refs for keyboard navigation
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // URL parameter handling on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      
      // Get current rating
      const currentParam = searchParams.get('current');
      if (currentParam) {
        setCurrentRating(currentParam);
      }
      
      // Get prior games
      const kFactorParam = searchParams.get('kfactor');
      if (kFactorParam) {
        setKFactor(kFactorParam);
      }
      
      // Get opponent ratings and results
      const oppParam = searchParams.get('opp');
      const resultsParam = searchParams.get('results');
      
      if (oppParam) {
        const ratings = oppParam.split(',').map(r => r.trim());
        let results: ('win' | 'loss' | 'draw')[] = Array(ratings.length).fill('win');
        
        // Parse results if available
        if (resultsParam) {
          results = resultsParam.split(',').map(r => {
            const trimmed = r.trim().toLowerCase();
            if (trimmed === 'loss' || trimmed === 'l') return 'loss';
            if (trimmed === 'draw' || trimmed === 'd') return 'draw';
            return 'win'; // Default to win
          });
        }
        
        // Create formatted opponents array
        const formattedOpponents = ratings.map((rating, index) => ({
          rating,
          result: results[index] || 'win',
          id: generateId()
        }));
        
        setOpponents(formattedOpponents);
        
        // Auto-calculate if we have current rating and opponents
        if (currentParam && ratings.length > 0) {
          setTimeout(() => {
            const currentRatingValue = parseInt(currentParam);
            if (!isNaN(currentRatingValue)) {
              // Transform data for calculator
              const gameResults = formattedOpponents
                .filter(opp => opp.rating !== '' && !isNaN(parseInt(opp.rating)))
                .map(opp => ({
                  opponentRating: parseInt(opp.rating),
                  result: opp.result === 'win' ? 1 : opp.result === 'draw' ? 0.5 : 0
                }));
              
              if (gameResults.length > 0) {
                // Get K-factor (default to 20 if not provided)
                const kFactorValue = kFactorParam ? parseInt(kFactorParam) : 20;
                
                // Call calculation function for FIDE ratings
                const calculationResult = calculateFIDERating(
                  currentRatingValue,
                  0, // numPreviousGames - You might want to add this as a field in your form
                  gameResults
                );
                
                setResults(calculationResult);
              }
            }
          }, 100); // Slightly longer timeout to ensure state updates
        }
      }
    }
  }, []);
  
  // Handlers for OpponentList component
  const handleOpponentRatingChange = (index: number, value: string): void => {
    const newOpponents = [...opponents];
    newOpponents[index] = { ...newOpponents[index], rating: value };
    setOpponents(newOpponents);
  };
  
  const handleOpponentResultChange = (index: number, result: 'win' | 'loss' | 'draw'): void => {
    const newOpponents = [...opponents];
    newOpponents[index] = { ...newOpponents[index], result };
    setOpponents(newOpponents);
  };
  
  // Add opponent
  const addOpponent = (): void => {
    setOpponents([...opponents, { rating: '', result: 'win', id: generateId() }]);
  };
  
  // Remove opponent
  const removeOpponent = (index: number): void => {
    if (opponents.length > 1) {
      const newOpponents = [...opponents];
      newOpponents.splice(index, 1);
      setOpponents(newOpponents);
    }
  };
  
  // Calculate results
  const handleCalculate = (): void => {
    const playerRating = parseInt(currentRating);
    if (isNaN(playerRating)) {
      alert("Please enter a valid current rating");
      return;
    }
    
    // Validate opponents
    const validOpponents = opponents.filter(opponent => 
      opponent.rating !== '' && !isNaN(parseInt(opponent.rating))
    );
    
    if (validOpponents.length === 0) {
      alert("Please enter at least one valid opponent rating");
      return;
    }
    
    // Transform data to match the calculator function's expected format
    const gameResults = validOpponents.map(opp => ({
      opponentRating: parseInt(opp.rating),
      result: opp.result === 'win' ? 1 : opp.result === 'draw' ? 0.5 : 0
    }));
    
    // Parse number of previous games
    const priorGamesNum = previousGames ? parseInt(previousGames) : 0;
    
    // Call the updated calculation function with all parameters
    const calculationResult = calculateFIDERating(
      playerRating,
      priorGamesNum,
      gameResults
    );
    
    setResults(calculationResult);
  };
  
  // Reset calculator
  const resetCalculator = (): void => {
    setOpponents([
      { rating: '', result: 'win', id: generateId() },
      { rating: '', result: 'win', id: generateId() },
      { rating: '', result: 'win', id: generateId() },
      { rating: '', result: 'win', id: generateId() }
    ]);
    setCurrentRating('');
    setFideId('');
    setResults(null);
  };
  
  // Sharing functionality
  const buildShareURL = (): string => {
    const url = new URL(window.location.href);
    url.search = '';
    
    const params = new URLSearchParams();
    
    if (currentRating) params.append('current', currentRating);
    
    const validOpponents = opponents.filter(o => o.rating !== '');
    if (validOpponents.length > 0) {
      params.append('opp', validOpponents.map(o => o.rating).join(','));
    }
    
    url.search = params.toString();
    return url.toString();
  };
  
  const copyLinkToClipboard = (): void => {
    const url = buildShareURL();
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess('Link copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        setCopySuccess('Failed to copy link');
      });
  };
  
  const shareViaFacebook = (): void => {
    const url = buildShareURL();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };
  
  const shareViaTwitter = (): void => {
    const url = buildShareURL();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check%20out%20my%20FIDE%20rating%20calculation!`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-3xl mx-auto">
      {/* Title at the top, centered */}
      <div className="text-center p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">FIDE Rating Calculator</h1>
        <p className="text-xs text-gray-500 mt-1">Estimate your rating change after rated games</p>
      </div>
      
      {/* Tabs - make tabs more compact */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "calculator"
              ? "text-blue-600 border-b-2 border-blue-500 bg-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calculator size={16} className="inline mr-1.5" />
          Calculator
        </button>
        <button
          onClick={() => setActiveTab("information")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "information"
              ? "text-blue-600 border-b-2 border-blue-500 bg-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Information
        </button>
      </div>
      
      <div className="bg-gray-50">
        {activeTab === "calculator" && (
          <div className="p-4">
            {/* Single column layout - similar to US Chess calculator */}
            
            {/* Player Information Section */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Player Information</h3>
              
              {/* Current rating and previous games in a row */}
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Current Rating
                  </label>
                  <input
                    type="text"
                    value={currentRating}
                    onChange={(e) => setCurrentRating(e.target.value)}
                    placeholder="Your current rating"
                    className="block w-full px-2 py-1 text-sm border-0 border-b border-gray-300 focus:border-b focus:border-blue-500 focus:outline-none focus:ring-0"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Prior Games
                  </label>
                  <input
                    type="text"
                    value={previousGames}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                        setPreviousGames(val);
                      }
                    }}
                    placeholder="Previous rated games"
                    className="block w-full px-2 py-1 text-sm border-0 border-b border-gray-300 focus:border-b focus:border-blue-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              
              {/* K-Factor and FIDE ID in a row */}
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    K-Factor
                  </label>
                  <select
                    value={kFactor}
                    onChange={(e) => setKFactor(e.target.value)}
                    className="block w-full px-2 py-1 text-sm border-0 border-b border-gray-300 focus:border-b focus:border-blue-500 focus:outline-none focus:ring-0 bg-white"
                  >
                    <option value="40">40 (New player)</option>
                    <option value="20">20 (Standard)</option>
                    <option value="10">10 (2400+ rating)</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    FIDE ID (optional)
                  </label>
                  <input
                    type="text"
                    value={fideId}
                    onChange={(e) => setFideId(e.target.value)}
                    placeholder="e.g., 12345678"
                    className="block w-full px-2 py-1 text-sm border-0 border-b border-gray-300 focus:border-b focus:border-blue-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Opponent List Component */}
            <OpponentList
              opponents={opponents}
              onAddOpponent={addOpponent}
              onRemoveOpponent={removeOpponent}
              onRatingChange={handleOpponentRatingChange}
              onResultChange={handleOpponentResultChange}
            />

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={resetCalculator}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={handleCalculate}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
              >
                <Calculator size={14} className="mr-1.5" />
                Calculate
              </button>
            </div>

            {/* Results Display */}
            {results && (
              <>
                {/* Visualization Type Selector */}
                <div className="flex justify-end items-center mt-4 mb-2">
                  <label className="text-xs text-gray-600 mr-2">View as:</label>
                  <div className="relative">
                    <select
                      value={visualizationType}
                      onChange={(e) => setVisualizationType(e.target.value as 'visual' | 'table')}
                      className="appearance-none bg-white border border-gray-200 text-xs rounded-md py-1 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="visual">Visual Chart</option>
                      <option value="table">Data Table</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Conditionally render the selected visualization type */}
                {visualizationType === 'visual' ? (
                  <RatingChangeVisual results={results} />
                ) : (
                  <RatingResultsTable results={results} />
                )}

                {/* Share options */}
                <div className="mt-4 border border-blue-200 rounded-md bg-white p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Share Results:</span>
                    <div className="flex gap-1">
                      <button onClick={copyLinkToClipboard} 
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Copy link"
                      >
                        <LinkIcon size={14} />
                      </button>
                      <button onClick={shareViaFacebook} 
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Share on Facebook"
                      >
                        <Facebook size={14} />
                      </button>
                      <button onClick={shareViaTwitter} 
                        className="p-1 text-sky-500 hover:text-sky-600"
                        title="Share on Twitter"
                      >
                        <Twitter size={14} />
                      </button>
                    </div>
                  </div>
                  {copySuccess && <span className="text-xs text-green-600 mt-1 block">{copySuccess}</span>}
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === "information" && (
          <div className="p-4 h-[500px] overflow-auto">
            <InfoContent contentPath="/content/fide/info.md" />
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <span>This is an estimate only; official FIDE calculations may vary.</span>
        <button 
          className="text-xs text-gray-600 hover:text-gray-900"
          onClick={() => alert("This is an unofficial FIDE rating calculator and should be used for estimation purposes only.")}
        >
          Disclaimer
        </button>
      </div>
    </div>
  );
};

export default FideEstimator; 