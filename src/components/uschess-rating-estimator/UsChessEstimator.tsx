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
import DisclaimerModal from '@/components/client/DisclaimerModal';

// Add utility function to generate random ID if it doesn't exist elsewhere
const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

interface UsChessEstimatorProps {
  preloadedResults?: RatingResult | null;
}

const UsChessEstimator: React.FC<UsChessEstimatorProps> = ({ preloadedResults = null }) => {
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
  const [results, setResults] = useState<RatingResult | null>(preloadedResults);
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
    setShowError(false); // Reset any previous errors
    
    // Validate current rating
    if (!currentRating || isNaN(parseInt(currentRating))) {
      showErrorMessage('Please enter a valid current rating');
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
    const highestRatingValue = highestRating ? parseInt(highestRating) : parseInt(currentRating);
    
    // Parse numerical values
    const playerAgeValue = age ? parseInt(age) : 0;
    const playerFideRatingValue = fideRating ? parseInt(fideRating) : 0;
    const playerCfcRatingValue = cfcRating ? parseInt(cfcRating) : 0;
    
    // Call the updated calculation function with all parameters
    const calculationResult = calculateUsChessRating(
      parseInt(currentRating),
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
    setCurrentRating('');
    setPriorGames('');
    setHighestRating('');
    setOpponents([
      { rating: '', result: 'win', id: generateId() },
      { rating: '', result: 'win', id: generateId() },
      { rating: '', result: 'win', id: generateId() },
      { rating: '', result: 'win', id: generateId() }
    ]);
    setResults(null);
    setAge('');
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Reduce header size */}
      <div className="border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-1 text-gray-800">US Chess Rating Calculator</h1>
          <p className="text-xs text-gray-600">
            Estimate your rating change after rated games
          </p>
        </div>
      </div>
      
      {/* Tabs with smaller padding */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "calculator" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("calculator")}
        >
          <Calculator className="inline-block w-3 h-3 mr-1" /> Calculator
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "info" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("info")}
        >
          <Info className="inline-block w-3 h-3 mr-1" /> Information
        </button>
      </div>
      
      {/* Main content area with tighter padding */}
      <div className="p-4">
        {activeTab === "calculator" && (
          <div>
            {/* Make the input fields section more compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Current Rating</label>
                <input 
                  type="text"
                  value={currentRating}
                  onChange={(e) => setCurrentRating(e.target.value)}
                  className="w-full h-9 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your current rating"
                />
              </div>
              
              {/* Prior Games */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                  className="w-full h-9 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* US Chess ID with link - improved with external link icon */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  US Chess ID (optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={uscfId}
                    onChange={(e) => setUscfId(e.target.value)}
                    placeholder="e.g., 12345678"
                    className="w-full h-9 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
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
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-700">Opponents</label>
                <button 
                  onClick={addOpponent}
                  className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                >
                  Add Opponent
                </button>
              </div>
              <div className="bg-white rounded border border-gray-200 overflow-hidden mb-3">
                <OpponentList
                  opponents={opponents}
                  onAddOpponent={addOpponent}
                  onRemoveOpponent={removeOpponent}
                  onRatingChange={handleOpponentRatingChange}
                  onResultChange={handleOpponentResultChange}
                />
              </div>
            </div>
            
            {/* Additional Options - Improved for mobile */}
            <div className="bg-white p-3 rounded border border-gray-200 mb-3">
              <h3 className="text-xs font-semibold mb-2 text-gray-700">Additional Options</h3>
              
              {/* First row - Highest rating and Age Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 mb-4 sm:mb-3">
                {/* Highest Achieved Rating */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    className="w-full h-9 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Age Range */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    className="w-full h-9 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* CFC Rating */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    className="w-full h-9 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <p className="text-sm sm:text-xs text-gray-500 mt-3 sm:mt-2">
                FIDE/CFC ratings are for new players. Age 65+ affects rating floors.
              </p>
            </div>

            {/* More compact action buttons */}
            <div className="flex justify-end gap-2 mt-3">
              <button 
                onClick={resetCalculator}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleCalculate}
                className="bg-blue-600 text-white py-1.5 px-4 text-sm rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <Calculator className="w-3 h-3 mr-1.5" />
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
        
        {activeTab === "info" && (
          <div className="max-h-[450px] overflow-auto">
            <InfoContent contentPath="/content/uschess/info.md" />
          </div>
        )}
      </div>
      
      {/* More compact disclaimer footer */}
      <DisclaimerModal
        shortText="This is an estimate only; actual US Chess calculations may vary slightly."
        title="US Chess Rating Calculation Disclaimer"
        organization="USCF"
        className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs"
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
