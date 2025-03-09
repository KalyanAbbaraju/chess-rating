'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Link as LinkIcon, Twitter } from 'lucide-react';
import { calculateFIDERating } from '@/lib/fideRatingCalculator';
import { RatingResult } from '@/lib/ratingTypes';
import RatingChangeVisual from '../shared/RatingChangeVisual';
import RatingResultsTable from '../shared/RatingResultsTable';
import InfoContent from '../shared/InfoContent';
import OpponentList, { OpponentData } from '../shared/OpponentList';
import DisclaimerComponent from '@/components/common/DisclaimerComponent';

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
  
  // Error toast notification state
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  
  // Add this function to show errors
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    
    // Auto-hide the error after 5 seconds
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };
  
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
        const ratingsArray = oppParam.split(',').map(r => r.trim());
        let resultsArray: ('win' | 'loss' | 'draw')[] = Array(ratingsArray.length).fill('win');
        
        // Parse results if available
        if (resultsParam) {
          resultsArray = resultsParam.split(',').map(r => {
            const trimmed = r.trim().toLowerCase();
            if (trimmed === 'loss' || trimmed === 'l') return 'loss';
            if (trimmed === 'draw' || trimmed === 'd') return 'draw';
            return 'win'; // Default to win
          });
        }
        
        // Create formatted opponents array
        const formattedOpponents = ratingsArray.map((rating: string, index: number) => ({
          rating,
          result: resultsArray[index] || 'win',
          id: generateId()
        }));
        
        setOpponents(formattedOpponents);

        // Get previous games parameter
        const previousGamesParam = searchParams.get('previousGames');
        if (previousGamesParam) {
          setPreviousGames(previousGamesParam);
        }
        
        // Get FIDE ID parameter
        const fideIdParam = searchParams.get('fideId');
        if (fideIdParam) {
          setFideId(fideIdParam);
        }
        
        // Auto-calculate if we have current rating and opponents
        if (currentParam && ratingsArray.length > 0) {
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
                // Call calculation function for FIDE ratings
                const previousGamesNum = parseInt(previousGames) || 0;
                
                const calculationResult = calculateFIDERating(
                  currentRatingValue,
                  previousGamesNum,
                  gameResults
                );
                
                setResults(calculationResult);
              }
            }
          }, 100); // Slightly longer timeout to ensure state updates
        }
      }
      
    }
  }, [previousGames]);
  
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
      showErrorMessage("Please enter a valid current rating");
      return;
    }
    
    // Validate opponents
    const validOpponents = opponents.filter(opponent => 
      opponent.rating !== '' && !isNaN(parseInt(opponent.rating))
    );
    
    if (validOpponents.length === 0) {
      showErrorMessage("Please enter at least one valid opponent rating");
      return;
    }
    
    // Transform data to match the calculator function's expected format
    const gameResults = validOpponents.map(opp => ({
      opponentRating: parseInt(opp.rating),
      result: opp.result === 'win' ? 1 : opp.result === 'draw' ? 0.5 : 0
    }));
    
    // Parse number of previous games
    const previousGamesNum = parseInt(previousGames) || 0;
    
    // Call the updated calculation function with all parameters
    const calculationResult = calculateFIDERating(
      playerRating,
      previousGamesNum,
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
    setPreviousGames('0');
    setKFactor('20');
    setResults(null);
    setCopySuccess('');
  };
  
  // Sharing functionality
  const buildShareURL = (): string => {
    const baseURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    const params = new URLSearchParams();
    
    // Add current rating
    if (currentRating) params.append('current', currentRating);
    
    // Add previous games
    if (previousGames) params.append('previousGames', previousGames);
    
    // Add FIDE ID
    if (fideId) params.append('fideId', fideId);
    
    // Add K-factor
    if (kFactor) params.append('kfactor', kFactor);
    
    // Add opponents
    const validOpponents = opponents.filter(o => o.rating !== '');
    if (validOpponents.length > 0) {
      const ratings = validOpponents.map(o => o.rating).join(',');
      const results = validOpponents.map(o => o.result).join(',');
      params.append('opp', ratings);
      params.append('results', results);
    }
    
    return `${baseURL}?${params.toString()}`;
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
              <h3 className="text-base sm:text-sm font-semibold mb-3 text-gray-700">Player Information</h3>
              
              {/* Current rating and previous games in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                    Current Rating
                  </label>
                  <input
                    type="text"
                    value={currentRating}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                        setCurrentRating(val);
                      }
                    }}
                    placeholder="Your current rating"
                    className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
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
                    className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                  />
                </div>
              </div>
              
              {/* K-Factor and FIDE ID in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                    K-Factor
                  </label>
                  <select
                    value={kFactor}
                    onChange={(e) => setKFactor(e.target.value)}
                    className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0 bg-white"
                  >
                    <option value="40">40 (New player)</option>
                    <option value="20">20 (Standard)</option>
                    <option value="10">10 (2400+ rating)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                    FIDE ID (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fideId}
                      onChange={(e) => setFideId(e.target.value)}
                      placeholder="e.g., 12345678"
                      className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none pr-16 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                    />
                    {fideId && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <a 
                          href={`https://ratings.fide.com/profile/${fideId}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-gray-700 p-1"
                          title="View FIDE profile"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
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
            <div className="flex justify-between mt-6 sm:mt-4">
              <button
                onClick={resetCalculator}
                className="px-4 py-2 sm:px-3 sm:py-1.5 text-sm sm:text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={handleCalculate}
                className="px-5 py-2 sm:px-4 sm:py-1.5 text-sm sm:text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
              >
                <Calculator size={18} className="mr-2 sm:mr-1.5 sm:w-4 sm:h-4" />
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" 
                            fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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
      
      <DisclaimerComponent
        shortText="This is an estimate only; actual FIDE calculations may vary slightly."
        title="FIDE Rating Calculation Disclaimer"
        detailedContent={
          <>
            <p className="mb-3">
              The rating calculations provided by this tool are based on the published FIDE Elo 
              rating formulas and are intended to be used for estimation purposes only.
            </p>
            
            <p className="mb-3">
              Actual official FIDE ratings may differ due to several factors:
            </p>
            
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Special rating adjustments applied by FIDE</li>
              <li>Rounding differences in calculation methods</li>
              <li>Tournament-specific rules or exceptions</li>
              <li>Recent changes to the rating formula not yet reflected in this tool</li>
              <li>Rating floor considerations for age groups</li>
              <li>K-factor differences for different player categories</li>
            </ul>
            
            <p className="mb-3">
              <strong>Important note:</strong> FIDE ratings are calculated monthly, and all games within a rating 
              period are considered together. This estimator calculates based on individual games which may differ 
              from FIDE&apos;s batch processing approach.
            </p>
            
            <p className="mb-3">
              For official ratings, always refer to FIDE&apos;s official website and publications. 
              This tool does not replace official ratings issued by FIDE.
            </p>
            
            <p>
              The developers of this tool make no guarantees about the accuracy of these estimates 
              and are not affiliated with or endorsed by FIDE.
            </p>
          </>
        }
        className="px-6 py-3 bg-gray-50 border-t border-gray-200"
      />

      {/* Toast notification for errors */}
      {showError && (
        <div className="fixed bottom-4 right-4 sm:max-w-md w-[calc(100%-2rem)] bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md animate-fade-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base sm:text-sm">{errorMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowError(false)}
                  className="inline-flex rounded-md p-2 sm:p-1.5 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FideEstimator; 