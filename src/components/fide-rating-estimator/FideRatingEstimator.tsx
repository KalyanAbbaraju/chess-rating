'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Facebook, Twitter, Share2, Calculator, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

interface ResultsState {
  show: boolean;
  performanceRating: number | null;
  ratingChange: number | null;
  newRating: number | null;
  expectedScore: number | null;
  kFactor: number | null;
}

const FideRatingEstimator: React.FC = () => {
  const [opponentRatings, setOpponentRatings] = useState<string[]>(['', '', '', '']);
  const [totalScore, setTotalScore] = useState<string>('');
  const [currentRating, setCurrentRating] = useState<string>('');
  const [fideId, setFideId] = useState<string>('');
  const [results, setResults] = useState<ResultsState>({
    show: false,
    performanceRating: null,
    ratingChange: null,
    newRating: null,
    expectedScore: null,
    kFactor: null
  });
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>("calculator");
  
  // Refs for keyboard navigation
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // URL parameter handling on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      const oppRatings = params.get('opp');
      if (oppRatings) {
        const ratings = oppRatings.split(',').map(r => r.trim());
        setOpponentRatings(ratings);
      }
      
      if (params.get('score')) setTotalScore(params.get('score') || '');
      if (params.get('current')) setCurrentRating(params.get('current') || '');
    }
  }, []);
  
  // Add a new opponent rating field
  const addOpponentRating = () => {
    setOpponentRatings([...opponentRatings, '']);
  };

  // Remove an opponent rating field
  const removeOpponentRating = (index: number) => {
    if (opponentRatings.length > 1) {
      const newRatings = [...opponentRatings];
      newRatings.splice(index, 1);
      setOpponentRatings(newRatings);
    }
  };
  
  // Handlers
  const handleOpponentRatingChange = (index: number, value: string): void => {
    const newRatings = [...opponentRatings];
    newRatings[index] = value;
    setOpponentRatings(newRatings);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index - 1;
      if (prevIndex >= 0 && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };
  
  // FIDE-specific Rating calculation functions
  const getValidOpponentRatings = (): number[] => {
    return opponentRatings
      .map(r => parseInt(r.trim()))
      .filter(r => !isNaN(r));
  };
  
  // Performance Rating calculation based on FIDE tables
  const calculatePerformanceRating = (opponentRatings: number[], score: number): number => {
    if (opponentRatings.length === 0) return 0;
    
    const totalGames = opponentRatings.length;
    
    // Handle perfect or zero scores specially
    if (score === totalGames) {
      return Math.max(...opponentRatings) + 800;
    } else if (score === 0) {
      return Math.min(...opponentRatings) - 800;
    }
    
    // Calculate performance rating using FIDE method
    const averageRating = opponentRatings.reduce((a, b) => a + b, 0) / opponentRatings.length;
    const percentage = (score / totalGames) * 100;
    
    // FIDE dp table based on percentage
    let ratingDifference = 0;
    
    // This is a simplified version of the FIDE performance rating table
    if (percentage <= 1) ratingDifference = -800;
    else if (percentage <= 4) ratingDifference = -500;
    else if (percentage <= 9) ratingDifference = -400;
    else if (percentage <= 14) ratingDifference = -300;
    else if (percentage <= 19) ratingDifference = -250;
    else if (percentage <= 24) ratingDifference = -200;
    else if (percentage <= 29) ratingDifference = -150;
    else if (percentage <= 34) ratingDifference = -100;
    else if (percentage <= 39) ratingDifference = -50;
    else if (percentage <= 44) ratingDifference = -25;
    else if (percentage <= 49) ratingDifference = 0;
    else if (percentage <= 54) ratingDifference = 25;
    else if (percentage <= 59) ratingDifference = 50;
    else if (percentage <= 64) ratingDifference = 100;
    else if (percentage <= 69) ratingDifference = 150;
    else if (percentage <= 74) ratingDifference = 200;
    else if (percentage <= 79) ratingDifference = 250;
    else if (percentage <= 84) ratingDifference = 300;
    else if (percentage <= 89) ratingDifference = 400;
    else if (percentage <= 94) ratingDifference = 500;
    else ratingDifference = 800;
    
    return Math.round(averageRating + ratingDifference);
  };
  
  // FIDE Expected Score calculation (logistic formula)
  const calculateExpectedScore = (playerRating: number, opponentRatings: number[]): number => {
    const totalExpected = opponentRatings.reduce((total, oppRating) => {
      const ratingDiff = oppRating - playerRating;
      const expectedScore = 1 / (1 + Math.pow(10, ratingDiff / 400));
      return total + expectedScore;
    }, 0);
    
    return Number(totalExpected.toFixed(2));
  };
  
  // FIDE K-factor determination
  const determineKFactor = (currentRating: number): number => {
    if (currentRating < 2400) {
      return 20; // Standard K-factor for players below 2400
    } else {
      return 10; // For players rated 2400 and above
    }
  };
  
  const calculateResults = (): void => {
    // Get valid opponent ratings
    const validOpponentRatings = getValidOpponentRatings();
    
    if (validOpponentRatings.length === 0) {
      alert("Please enter at least one valid opponent rating.");
      return;
    }
    
    // Get player's score
    const score = parseFloat(totalScore);
    if (isNaN(score) || score < 0 || score > validOpponentRatings.length) {
      alert(`Please enter a valid score between 0 and ${validOpponentRatings.length}.`);
      return;
    }
    
    // Check if current rating is provided (optional)
    let playerRating: number | null = null;
    if (currentRating) {
      playerRating = parseInt(currentRating);
      if (isNaN(playerRating)) {
        alert("Please enter a valid current rating or leave it blank.");
        return;
      }
    }
    
    // Calculate performance rating
    const performanceRating = calculatePerformanceRating(validOpponentRatings, score);
    
    // Update results object
    const newResults: ResultsState = {
      show: true,
      performanceRating,
      ratingChange: null,
      newRating: null,
      expectedScore: null,
      kFactor: null
    };
    
    // Calculate additional metrics if current rating is provided
    if (playerRating !== null) {
      // Determine K-factor
      const kFactor = determineKFactor(playerRating);
      newResults.kFactor = kFactor;
      
      // Calculate expected score
      const expectedScore = calculateExpectedScore(playerRating, validOpponentRatings);
      newResults.expectedScore = expectedScore;
      
      // Calculate rating change
      const actualScore = score;
      const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
      newResults.ratingChange = ratingChange;
      
      // Calculate new rating
      newResults.newRating = playerRating + ratingChange;
    }
    
    setResults(newResults);
  };
  
  // Reset calculations
  const resetCalculator = (): void => {
    setOpponentRatings(['', '', '', '']);
    setTotalScore('');
    setCurrentRating('');
    setFideId('');
    setResults({
      show: false,
      performanceRating: null,
      ratingChange: null,
      newRating: null,
      expectedScore: null,
      kFactor: null
    });
    setCopySuccess('');
  };
  
  // Sharing functions
  const generateShareableLink = (): string => {
    const baseUrl = window.location.origin + window.location.pathname;
    const validRatings = opponentRatings.slice(0, opponentRatings.length).filter(r => r.trim() !== '');
    
    const params = new URLSearchParams();
    if (validRatings.length > 0) params.set('opp', validRatings.join(','));
    if (totalScore) params.set('score', totalScore);
    if (currentRating) params.set('current', currentRating);
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  const copyLinkToClipboard = (): void => {
    const link = generateShareableLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };
  
  const shareViaFacebook = (): void => {
    const link = encodeURIComponent(generateShareableLink());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`, '_blank');
  };
  
  const shareViaTwitter = (): void => {
    const link = encodeURIComponent(generateShareableLink());
    const text = encodeURIComponent("Check out my FIDE rating calculation!");
    window.open(`https://twitter.com/intent/tweet?url=${link}&text=${text}`, '_blank');
  };
  
  const handleLookupFIDEID = () => {
    if (fideId.trim()) {
      window.open(`https://ratings.fide.com/profile/${fideId.trim()}`, '_blank');
    } else {
      alert("Please enter a FIDE ID to lookup");
    }
  };
  
  const shareViaWhatsApp = () => {
    const text = `Check out my FIDE chess rating calculation! New rating: ${results.newRating}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + generateShareableLink())}`, '_blank');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">FIDE Chess Rating Estimator</h2>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "calculator" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("calculator")}
          >
            Calculator
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "information" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("information")}
          >
            Information
          </button>
        </div>
        
        {activeTab === "calculator" && (
          <div className="max-w-lg mx-auto">
            {/* Simplified, single-column layout */}
            <div className="space-y-6">
              {/* Player Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Score
                  </label>
                  <input
                    type="text"
                    value={totalScore}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Allow decimal scores like 2.5
                      if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                        setTotalScore(val);
                      }
                    }}
                    placeholder="e.g., 2.5"
                    className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    placeholder="e.g., 1600"
                    className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  FIDE ID (optional)
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    value={fideId}
                    onChange={(e) => setFideId(e.target.value)}
                    placeholder="e.g., 12345678"
                    className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                  />
                  <button 
                    onClick={handleLookupFIDEID}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Lookup FIDE Profile"
                  >
                    <LinkIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Opponent Ratings - Spreadsheet Style */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Opponent Ratings</label>
                  <button 
                    onClick={addOpponentRating}
                    className="inline-flex items-center text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded"
                  >
                    <Plus size={12} className="mr-1" /> Add Opponent
                  </button>
                </div>
                
                <div className="space-y-2">
                  {opponentRatings.map((rating, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={rating}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                            handleOpponentRatingChange(index, val);
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => {if (el) inputRefs.current[index] = el}}
                        placeholder={`Opponent ${index + 1}`}
                        className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                      />
                      <button 
                        onClick={() => removeOpponentRating(index)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remove opponent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={calculateResults}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Rating
                </button>
                
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset
                </button>
              </div>
            </div>
            
            {/* Results Section */}
            {results.show && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Results</h3>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Performance Rating</div>
                    <div className="font-medium">{results.performanceRating}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-xs">Expected Score</div>
                    <div className="font-medium">{results.expectedScore}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-xs">K-Factor</div>
                    <div className="font-medium">{results.kFactor}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-xs">Rating Change</div>
                    <div className={`font-medium ${
                      results.ratingChange && results.ratingChange > 0 
                        ? 'text-green-600' 
                        : results.ratingChange && results.ratingChange < 0 
                          ? 'text-red-600' 
                          : ''
                    }`}>
                      {results.ratingChange && results.ratingChange > 0 ? '+' : ''}{results.ratingChange}
                    </div>
                  </div>
                  
                  {results.newRating !== null && (
                    <div className="col-span-2">
                      <div className="text-gray-500 text-xs font-medium">New Rating</div>
                      <div className="font-bold text-blue-700">{results.newRating}</div>
                    </div>
                  )}
                </div>
                
                {/* Share options */}
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm text-gray-700">Share your results:</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={copyLinkToClipboard} 
                        className="flex items-center px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-800"
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Copy Link
                      </button>
                      <button 
                        onClick={shareViaFacebook} 
                        className="flex items-center px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
                      >
                        <Facebook className="w-3 h-3 mr-1" />
                        Facebook
                      </button>
                      <button 
                        onClick={shareViaTwitter} 
                        className="flex items-center px-2 py-1 text-sm bg-sky-500 hover:bg-sky-600 rounded text-white"
                      >
                        <Twitter className="w-3 h-3 mr-1" />
                        Twitter
                      </button>
                      <button 
                        onClick={shareViaWhatsApp} 
                        className="flex items-center px-2 py-1 text-sm bg-green-600 hover:bg-green-700 rounded text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                  {copySuccess && <span className="text-xs text-green-600 mt-1 block">{copySuccess}</span>}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "information" && (
          <div className="text-sm space-y-4 h-[350px] overflow-auto pr-4">
            <div>
              <h3 className="font-semibold text-base mb-1">FIDE Rating System</h3>
              <p className="mb-2">
                The FIDE (International Chess Federation) rating system is a mathematical method for evaluating a player's strength based on their performance against other rated players.
              </p>
              
              <div className="pl-4 space-y-3">
                <div>
                  <h4 className="font-medium">Performance Rating</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    The performance rating represents how well you played in a specific event, based on your results and your opponents' ratings.
                  </p>
                  <div className="bg-base-200 p-2 rounded border text-xs">
                    <p>FIDE uses a table-based approach for mapping percentage scores to rating differences.</p>
                    <p className="mt-1">For example:</p>
                    <ul className="list-disc pl-4 mt-1">
                      <li>50% score = same rating as average of opponents</li>
                      <li>70% score = approximately 150 points higher than opponents' average</li>
                      <li>90% score = approximately 366 points higher than opponents' average</li>
                      <li>100% score = 800 points higher than average of opponents</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Expected Score</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    FIDE calculates the expected score using a logistic formula.
                  </p>
                  <div className="bg-base-200 p-2 rounded border text-xs">
                    <p><strong>Formula:</strong> E = 1 / (1 + 10<sup>(R<sub>o</sub>-R<sub>p</sub>)/400</sup>)</p>
                    <p>Where E = expected score, R<sub>o</sub> = opponent's rating, R<sub>p</sub> = player's rating</p>
                    <p className="mt-1 text-gray-500 italic">This calculates the expected score for a single game. For multiple games, sum the expected scores for each game.</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">K-Factor</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    The K-factor determines how much a rating can change after an event.
                  </p>
                  <ul className="list-disc pl-5 text-xs space-y-0.5">
                    <li><strong>K=20:</strong> Standard K-factor for players rated below 2400</li>
                    <li><strong>K=10:</strong> For players rated 2400 and above</li>
                    <li><strong>K=40:</strong> For new players until they complete events with a total of 30 games</li>
                    <li><strong>K=40:</strong> For all players until their 18th birthday, as long as their rating remains under 2300</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Rating Change</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    The change in rating is calculated based on the actual vs. expected score.
                  </p>
                  <div className="bg-base-200 p-2 rounded border text-xs">
                    <p><strong>Formula:</strong> Rating Change = K × (Actual Score - Expected Score)</p>
                    <p className="mt-1 text-gray-500 italic">Example: If your K-factor is 20, you scored 3 points in a tournament when your expected score was 2.5, your rating change would be 20 × (3 - 2.5) = 20 × 0.5 = 10 points.</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Special Cases</h4>
                  <ul className="list-disc pl-5 text-xs space-y-0.5">
                    <li><strong>Perfect Score:</strong> Performance rating = 800 points above the strongest opponent</li>
                    <li><strong>Zero Score:</strong> Performance rating = 800 points below the weakest opponent</li>
                    <li><strong>Rating Floor:</strong> FIDE ratings cannot drop below 1000</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="divider"></div>
            
            <div className="text-xs text-gray-500">
              <p>
                This calculator implements the FIDE rating formulas as described in the FIDE Handbook. For official ratings, please refer to the <a href="https://ratings.fide.com/" target="_blank" rel="noopener noreferrer" className="link link-primary">Official FIDE Ratings website</a>.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <span>This is an estimate only; actual FIDE calculations may vary slightly.</span>
        <button 
          className="text-xs text-gray-600 hover:text-gray-900"
          onClick={() => alert("We STRONGLY discourage players from using this estimator to decide whether to withdraw from an event based on their estimated post-event rating. The estimator may be off by a point or two!")}
        >
          Disclaimer
        </button>
      </div>
    </div>
  );
};

export default FideRatingEstimator; 
