'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Link as LinkIcon, Twitter, Info } from 'lucide-react';
import { calculateUsChessRating } from '@/lib/usChessRatingCalculator';
import { RatingResult } from '@/lib/ratingTypes';
import InfoContent from '../shared/InfoContent';
import RatingChangeVisual from '../shared/RatingChangeVisual';
import RatingResultsTable from '../shared/RatingResultsTable';
import OpponentList, { OpponentData as SharedOpponentData } from '../shared/OpponentList';
import Tooltip from '../shared/Tooltip';
import DisclaimerComponent from '@/components/common/DisclaimerComponent';

// Add utility function to generate random ID if it doesn't exist elsewhere
const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const UsChessEstimator: React.FC = () => {
  const [opponents, setOpponents] = useState<SharedOpponentData[]>([
    { rating: '', result: 'win', id: generateId() },
    { rating: '', result: 'win', id: generateId() },
    { rating: '', result: 'win', id: generateId() },
    { rating: '', result: 'win', id: generateId() }
  ]);
  const [currentRating, setCurrentRating] = useState<string>('');
  const [priorGames, setPriorGames] = useState<string>('');
  const [uscfId, setUscfId] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [results, setResults] = useState<RatingResult | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [visualizationType, setVisualizationType] = useState<'visual' | 'table'>('visual');
  
  // Add state for highest achieved rating and performance method
  const [highestRating, setHighestRating] = useState<string>('');
  const [applyBonus, setApplyBonus] = useState<boolean>(true);
  
  // Add state for FIDE rating and CFC rating
  const [fideRating, setFideRating] = useState<string>('');
  const [cfcRating, setCfcRating] = useState<string>('');
  
  // Add isLifeMaster to the state
  const [isLifeMaster, setIsLifeMaster] = useState(false);
  
  // First, add this state to manage the custom dropdown
  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const ageDropdownRef = useRef<HTMLDivElement>(null);
  
  // Add this useEffect to handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ageDropdownRef.current && !ageDropdownRef.current.contains(event.target as Node)) {
        setIsAgeDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ageDropdownRef]);
  
  // Auto-calculate from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      
      // Extract all URL parameters at the beginning
      const currentParam = searchParams.get('current');
      const priorParam = searchParams.get('prior');
      const ageParam = searchParams.get('age');
      const oppParam = searchParams.get('opp');
      const resultsParam = searchParams.get('results');
      const highestParam = searchParams.get('highest');
      const fideRatingParam = searchParams.get('fide');
      const cfcRatingParam = searchParams.get('cfc');
      const bonusParam = searchParams.get('bonus');
      
      // Set state values from parameters
      if (currentParam) setCurrentRating(currentParam);
      if (priorParam) setPriorGames(priorParam);
      if (ageParam) setAge(ageParam);
      
      // Process opponent ratings if available
      if (oppParam) {
        const ratingsArray = oppParam.split(',').map(r => r.trim());
        let resultsArray: ('win' | 'loss' | 'draw')[] = Array(ratingsArray.length).fill('win');
        
        // Parse results if available
        if (resultsParam) {
          resultsArray = resultsParam.split(',').map(r => {
            const trimmed = r.trim().toLowerCase();
            if (trimmed === 'loss' || trimmed === 'l') return 'loss' as const;
            if (trimmed === 'draw' || trimmed === 'd') return 'draw' as const;
            return 'win' as const; // Default to win
          });
        }
        
        // Create formatted opponents array
        const formattedOpponents = ratingsArray.map((rating: string, index: number) => ({
          rating,
          result: (resultsArray[index] || 'win') as 'win' | 'loss' | 'draw',
          id: generateId()
        }));
        
        setOpponents(formattedOpponents);
      }
      
      // Auto-calculate if all needed data is available
      if (currentParam && priorParam && ageParam && oppParam && resultsParam && 
          highestParam && fideRatingParam && cfcRatingParam && bonusParam) {
        setTimeout(() => {
          const currentRatingValue = parseInt(currentParam);
          const playerPriorGamesNum = parseInt(priorParam);
          const ageValue = parseInt(ageParam);
          
          // Define ratingsArray again in this scope
          const ratingsArray = oppParam.split(',').map(r => r.trim());
          
          const resultsArray = resultsParam.split(',').map(r => {
            const trimmed = r.trim().toLowerCase();
            if (trimmed === 'loss' || trimmed === 'l') return 'loss' as const;
            if (trimmed === 'draw' || trimmed === 'd') return 'draw' as const;
            return 'win' as const; // Default to win
          });
          
          const formattedOpponents = ratingsArray.map((rating: string, index: number) => ({
            rating,
            result: (resultsArray[index] || 'win') as 'win' | 'loss' | 'draw',
            id: generateId()
          }));
          
          setOpponents(formattedOpponents);
          
          if (!isNaN(currentRatingValue) && !isNaN(playerPriorGamesNum) && !isNaN(ageValue) && formattedOpponents.length > 0) {
            const transformedData = formattedOpponents.map((opp: SharedOpponentData) => ({
              opponentRating: parseInt(opp.rating),
              result: opp.result === 'win' ? 1 : opp.result === 'draw' ? 0.5 : 0
            }));
            
            const calculationResult = calculateUsChessRating(
              currentRatingValue,
              playerPriorGamesNum,
              transformedData,
              applyBonus,
              highestRating ? parseInt(highestRating) : currentRatingValue,
              ageValue,
              fideRating ? parseInt(fideRating) : 0,
              cfcRating ? parseInt(cfcRating) : 0,
              isLifeMaster  // Pass the isLifeMaster value from state
            );
            
            setResults(calculationResult);
          }
        }, 100); // Slightly longer timeout to ensure state updates
      }
    }
  }, [
    currentRating,
    priorGames,
    applyBonus,
    cfcRating,
    fideRating,
    highestRating,
    isLifeMaster
  ]);
  
  // Add these state variables at the top of the component
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
  
  // Handlers
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
    
    // Parse prior games (default to 0 if not provided)
    const playerPriorGamesNum = priorGames ? parseInt(priorGames) : 0;
    
    // Parse highest rating (default to current rating if not provided)
    const highestRatingValue = highestRating ? parseInt(highestRating) : playerRating;
    
    // Parse numerical values
    const playerAgeValue = age ? parseInt(age) : 0;
    const playerFideRatingValue = fideRating ? parseInt(fideRating) : 0;
    const playerCfcRatingValue = cfcRating ? parseInt(cfcRating) : 0;
    
    // Call the updated calculation function with all parameters
    const calculationResult = calculateUsChessRating(
      playerRating,
      playerPriorGamesNum,
      gameResults,
      applyBonus,
      highestRatingValue,
      playerAgeValue,
      playerFideRatingValue,
      playerCfcRatingValue,
      isLifeMaster  // Pass the isLifeMaster value from state
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
    setPriorGames('');
    setUscfId('');
    setAge('');
    setResults(null);
    setCopySuccess('');
    
    // Reset additional fields
    setHighestRating('');
    setFideRating('');
    setCfcRating('');
    setIsLifeMaster(false);
    setIsAgeDropdownOpen(false);
    setApplyBonus(true);
  };
  
  // Create a shareable link
  const generateShareableLink = (): string => {
    const baseUrl = window.location.origin + window.location.pathname;
    const validOpponents = opponents.filter(opp => opp.rating.trim() !== '');
    
    const params = new URLSearchParams();
    
    if (validOpponents.length > 0) {
      params.set('opp', validOpponents.map(opp => opp.rating).join(','));
      params.set('results', validOpponents.map(opp => opp.result).join(','));
    }
    
    // Basic parameters
    if (currentRating) params.set('current', currentRating);
    if (priorGames) params.set('prior', priorGames);
    if (age) params.set('age', age);
    
    // Additional parameters
    if (highestRating) params.set('highest', highestRating);
    if (fideRating) params.set('fide', fideRating);
    if (cfcRating) params.set('cfc', cfcRating);
    params.set('bonus', applyBonus.toString());
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };
  
  // Copy link to clipboard
  const copyLinkToClipboard = (): void => {
    const link = generateShareableLink();
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 3000);
      })
      .catch(() => {
        setCopySuccess('Failed to copy');
      });
  };
  
  // Share on social media
  const shareViaFacebook = (): void => {
    const link = generateShareableLink();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    window.open(shareUrl, '_blank');
  };
  
  const shareViaTwitter = (): void => {
    const link = generateShareableLink();
    const text = `Check out my US Chess rating calculation!`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
    window.open(shareUrl, '_blank');
  };
  
  // Add a new opponent
  const addOpponent = () => {
    setOpponents([...opponents, { rating: '', result: 'win', id: generateId() }]);
  };

  // Remove an opponent
  const removeOpponent = (index: number) => {
    if (opponents.length > 1) {
      const newOpponents = [...opponents];
      newOpponents.splice(index, 1);
      setOpponents(newOpponents);
    }
  };
  
  // Existing calculation function
  // const calculateRating = (currentRatingValue: number, opponentsData: Opponent[]) => {
  //   // Pass isLifeMaster to calculateRatingFloor
  //   const ratingFloor = calculateRatingFloor(currentRatingValue, playerPriorGamesNum, isLifeMaster);
    
  //   // ... rest of calculation logic ...
  // };
  
  return (
    <div className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      {/* Title header - with reduced size and padding */}
      
      <div className="text-center pt-6 pb-4 px-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">US Chess Rating Calculator</h1>
        <p className="mt-1 text-sm text-gray-600">Estimate your rating change after rated games</p>
      </div>
      
      {/* Tab navigation - keep existing tab navigation code */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-6 py-3 text-sm flex items-center ${
              activeTab === "calculator"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calculator size={18} className="mr-2" />
            Calculator
          </button>
          <button
            onClick={() => setActiveTab("information")}
            className={`px-6 py-3 text-sm flex items-center ${
              activeTab === "information"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Info size={18} className="mr-2" />
            Information
          </button>
        </nav>
      </div>
      
      {/* Content area - more compact padding */}
      <div className="px-4 py-3">
        {activeTab === "calculator" && (
          <div>
            {/* Main player info on one line */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-4">
              {/* Current Rating - with larger touch targets and text */}
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
                  placeholder="Enter current rating"
                  className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                />
              </div>
              
              {/* Prior Games */}
              <div>
                <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                  Prior Games
                </label>
                <input
                  type="text"
                  value={priorGames}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                      setPriorGames(val);
                    }
                  }}
                  placeholder="# of rated games"
                  className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                />
              </div>
              
              {/* US Chess ID with link - improved with external link icon */}
              <div>
                <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                  US Chess ID (optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={uscfId}
                    onChange={(e) => setUscfId(e.target.value)}
                    placeholder="e.g., 12345678"
                    className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none pr-16 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                  />
                  {uscfId && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                      <a 
                        href={`https://www.uschess.org/msa/MbrDtlMain.php?${uscfId}`}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-gray-700 p-1"
                        title="View US Chess profile"
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
            
            {/* Opponent List Component */}
            <OpponentList
              opponents={opponents}
              onAddOpponent={addOpponent}
              onRemoveOpponent={removeOpponent}
              onRatingChange={handleOpponentRatingChange}
              onResultChange={handleOpponentResultChange}
            />
            
            {/* Additional Options - Improved for mobile */}
            <div className="mb-6 sm:mb-4">
              <h3 className="text-base sm:text-sm font-semibold mb-4 sm:mb-3 text-gray-700">Additional Options</h3>
              
              {/* First row - Highest rating and Age Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mb-4 sm:mb-3">
                {/* Highest Achieved Rating */}
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                    Highest Achieved Rating
                  </label>
                  <input
                    type="text"
                    value={highestRating}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                        setHighestRating(val);
                      }
                    }}
                    placeholder="For floor calculation"
                    className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                  />
                </div>
                
                {/* Age Range */}
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                    Age Range
                  </label>
                  <div className="relative" ref={ageDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
                      className="relative w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none bg-white text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <span className="block truncate">
                        {age === "" ? "Select age range" : 
                         age === "8" ? "Under 10 years" :
                         age === "12" ? "10-14 years" :
                         age === "17" ? "15-19 years" :
                         age === "40" ? "20-64 years" :
                         age === "65" ? "65+ years (Senior)" : "Select age range"}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                          <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    
                    {isAgeDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        <div 
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${age === "" ? "text-blue-600 bg-blue-50" : "text-gray-900"}`}
                          onClick={() => {
                            setAge("");
                            setIsAgeDropdownOpen(false);
                          }}
                        >
                          <span className={`block truncate ${age === "" ? "font-medium" : "font-normal"}`}>
                            Select age range
                          </span>
                          {age === "" && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        
                        <div 
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${age === "8" ? "text-blue-600 bg-blue-50" : "text-gray-900"}`}
                          onClick={() => {
                            setAge("8");
                            setIsAgeDropdownOpen(false);
                          }}
                        >
                          <span className={`block truncate ${age === "8" ? "font-medium" : "font-normal"}`}>
                            Under 10 years
                          </span>
                          {age === "8" && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        
                        <div 
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${age === "12" ? "text-blue-600 bg-blue-50" : "text-gray-900"}`}
                          onClick={() => {
                            setAge("12");
                            setIsAgeDropdownOpen(false);
                          }}
                        >
                          <span className={`block truncate ${age === "12" ? "font-medium" : "font-normal"}`}>
                            10-14 years
                          </span>
                          {age === "12" && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        
                        <div 
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${age === "17" ? "text-blue-600 bg-blue-50" : "text-gray-900"}`}
                          onClick={() => {
                            setAge("17");
                            setIsAgeDropdownOpen(false);
                          }}
                        >
                          <span className={`block truncate ${age === "17" ? "font-medium" : "font-normal"}`}>
                            15-19 years
                          </span>
                          {age === "17" && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        
                        <div 
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${age === "40" ? "text-blue-600 bg-blue-50" : "text-gray-900"}`}
                          onClick={() => {
                            setAge("40");
                            setIsAgeDropdownOpen(false);
                          }}
                        >
                          <span className={`block truncate ${age === "40" ? "font-medium" : "font-normal"}`}>
                            20-64 years
                          </span>
                          {age === "40" && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        
                        <div 
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${age === "65" ? "text-blue-600 bg-blue-50" : "text-gray-900"}`}
                          onClick={() => {
                            setAge("65");
                            setIsAgeDropdownOpen(false);
                          }}
                        >
                          <span className={`block truncate ${age === "65" ? "font-medium" : "font-normal"}`}>
                            65+ years (Senior)
                          </span>
                          {age === "65" && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Checkboxes - better spaced for mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mb-4 sm:mb-3">
                {/* Apply Bonus Points - larger touch area */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={applyBonus}
                      onChange={() => setApplyBonus(!applyBonus)}
                      className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 sm:ml-2 text-base sm:text-sm text-gray-700">Apply bonus points</span>
                  </label>
                  <div className="ml-2 text-gray-400 hover:text-gray-600 cursor-help p-1" title="Bonus points may be awarded for exceptional performance">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Life Master Status - larger touch area */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      id="isLifeMaster"
                      checked={isLifeMaster}
                      onChange={(e) => setIsLifeMaster(e.target.checked)}
                      className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-3 sm:ml-2 text-base sm:text-sm text-gray-700">Life Master Status</span>
                  </label>
                  <div className="ml-2 text-gray-500 p-1 sm:p-0">
                    <Tooltip content="Life Masters have special rating floor protections" side="right">
                      <Info size={20} className="sm:w-4 sm:h-4" />
                    </Tooltip>
                  </div>
                </div>
              </div>
              
              {/* FIDE and CFC ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                {/* FIDE Rating */}
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                    FIDE Rating (if new player)
                  </label>
                  <input
                    type="text"
                    value={fideRating}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                        setFideRating(val);
                      }
                    }}
                    placeholder="Optional"
                    className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                  />
                </div>
                
                {/* CFC Rating */}
                <div>
                  <label className="block text-sm sm:text-xs font-medium text-gray-700 mb-2 sm:mb-1">
                    CFC Rating (if new player)
                  </label>
                  <input
                    type="text"
                    value={cfcRating}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                        setCfcRating(val);
                      }
                    }}
                    placeholder="Optional"
                    className="block w-full px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm border border-gray-300 sm:border-0 sm:border-b rounded-md sm:rounded-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:focus:ring-0"
                  />
                </div>
              </div>
              
              <p className="text-sm sm:text-xs text-gray-500 mt-3 sm:mt-2">
                FIDE/CFC ratings are for new players. Age 65+ affects rating floors.
              </p>
            </div>

            {/* Action Buttons - better spaced for mobile */}
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

            {/* Visual Results Display */}
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
                      {/* You can add more visualization options here in the future */}
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

                {/* Share options - now available for both visualizations */}
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
            <InfoContent contentPath="/content/uschess/info.md" />
          </div>
        )}
      </div>
      
      <DisclaimerComponent
        shortText="This is an estimate only; actual US Chess calculations may vary slightly."
        title="US Chess Rating Calculation Disclaimer"
        detailedContent={
          <>
            <p className="mb-3">
              The rating calculations provided by this tool are based on the published US Chess Federation 
              rating formulas and are intended to be used for estimation purposes only.
            </p>
            
            <p className="mb-3">
              Actual official US Chess ratings may differ due to several factors:
            </p>
            
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Special rating adjustments applied by US Chess</li>
              <li>Rounding differences in calculation methods</li>
              <li>Tournament-specific rules or exceptions</li>
              <li>Recent changes to the rating formula not yet reflected in this tool</li>
              <li>Rating floor considerations</li>
              <li>Provisional rating calculations for new players</li>
            </ul>
            
            <p className="mb-3">
              <strong>Important note:</strong> We strongly discourage players from using this estimator to decide 
              whether to withdraw from an event based on their estimated post-event rating. The estimator may 
              be off by a point or two!
            </p>
            
            <p className="mb-3">
              For official ratings, always refer to US Chess&apos;s official website and publications. 
              This tool does not replace official ratings issued by US Chess.
            </p>
            
            <p>
              The developers of this tool make no guarantees about the accuracy of these estimates 
              and are not affiliated with or endorsed by the US Chess Federation.
            </p>
          </>
        }
        className="px-6 py-3 bg-gray-50 border-t border-gray-200"
      />

      {/* Toast notification for errors */}
      {showError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md max-w-md animate-fade-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{errorMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowError(false)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

export default UsChessEstimator; 
