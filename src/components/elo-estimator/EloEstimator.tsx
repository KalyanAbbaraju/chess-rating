'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Facebook, Twitter, Share2, Calculator, User, Hash, Award, Clock, Calendar, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

interface ResultsState {
  show: boolean;
  performanceRating: number | null;
  newRating: number | null;
  kFactor: number | null;
  bonus: number | null;
}

const EloEstimator: React.FC = () => {
  const [opponentRatings, setOpponentRatings] = useState<string[]>(['', '', '', '']);
  const [totalScore, setTotalScore] = useState<string>('');
  const [currentRating, setCurrentRating] = useState<string>('');
  const [priorGames, setPriorGames] = useState<string>('');
  const [uscfId, setUscfId] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [kFactorOption, setKFactorOption] = useState<string>("standard");
  const [results, setResults] = useState<ResultsState>({
    show: false,
    performanceRating: null,
    newRating: null,
    kFactor: null,
    bonus: null
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
      if (params.get('prior')) setPriorGames(params.get('prior') || '');
      if (params.get('age')) setAge(params.get('age') || '');
      if (params.get('kfactor')) setKFactorOption(params.get('kfactor') || 'standard');
    }
  }, []);
  
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
  
  // Rating calculation functions
  const getValidOpponentRatings = (): number[] => {
    return opponentRatings
      .slice(0, opponentRatings.length)
      .map(r => parseInt(r.trim()))
      .filter(r => !isNaN(r));
  };
  
  const calculatePerformanceRating = (opponentRatings: number[], score: number): number => {
    if (opponentRatings.length === 0) return 0;
    
    const totalGames = opponentRatings.length;
    
    // Handle perfect or zero scores specially
    if (score === totalGames) {
      return Math.max(...opponentRatings) + 400;
    } else if (score === 0) {
      return Math.min(...opponentRatings) - 400;
    }
    
    const averageRating = opponentRatings.reduce((sum, r) => sum + r, 0) / totalGames;
    const percentScore = score / totalGames;
    const ratingDiff = Math.round(400 * Math.log10(percentScore / (1 - percentScore)));
    
    return Math.round(averageRating + ratingDiff);
  };
  
  const calculateKFactor = (rating: number, priorGames: number): number => {
    if (priorGames < 8) return 32;
    if (priorGames < 20) return 24;
    
    if (kFactorOption === "highrated") {
      if (rating >= 2400) return 8;
      if (rating >= 2100) return 12;
    }
    
    return 16;
  };
  
  const calculateBonus = (performanceRating: number, currentRating: number, priorGames: number): number => {
    if (priorGames >= 26) return 0;
    
    const difference = performanceRating - currentRating;
    if (difference <= 14) return 0;
    
    const baseFactor = difference - 14;
    const gamesExponent = (priorGames === 0 ? 1 : 1.3) * (26 - priorGames) / 25;
    
    return Math.round(baseFactor * gamesExponent);
  };
  
  const handleCalculate = (): void => {
    const validRatings = getValidOpponentRatings();
    const scoreValue = parseFloat(totalScore);
    const currRating = parseInt(currentRating);
    const priorGamesValue = parseInt(priorGames);
    
    if (validRatings.length === 0) {
      alert("Please enter at least one opponent rating");
      return;
    }
    
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > validRatings.length) {
      alert(`Score must be between 0 and ${validRatings.length}`);
      return;
    }
    
    if (isNaN(currRating) && priorGamesValue > 0) {
      alert("Please enter your current rating");
      return;
    }
    
    if (isNaN(priorGamesValue)) {
      alert("Please enter number of prior rated games");
      return;
    }
    
    // Calculate performance rating
    const performanceRating = calculatePerformanceRating(validRatings, scoreValue);
    
    // For unrated players (0 prior games), the performance rating becomes their initial rating
    let newRating = performanceRating;
    let kFactor = null;
    let bonus = null;
    
    // For rated players, calculate rating change
    if (priorGamesValue > 0 && !isNaN(currRating)) {
      kFactor = calculateKFactor(currRating, priorGamesValue);
      const ratingChange = Math.round((kFactor * (performanceRating - currRating)) / validRatings.length);
      
      // Calculate bonus points if applicable
      bonus = calculateBonus(performanceRating, currRating, priorGamesValue);
      
      newRating = currRating + ratingChange + (bonus || 0);
    }
    
    setResults({
      show: true,
      performanceRating,
      newRating,
      kFactor,
      bonus: bonus && bonus > 0 ? bonus : null
    });
  };
  
  // Share functions
  const buildShareUrl = (): string => {
    const validRatings = getValidOpponentRatings();
    if (validRatings.length === 0) return window.location.href;
    
    const params = new URLSearchParams();
    params.append('opp', validRatings.join(','));
    params.append('score', totalScore);
    params.append('current', currentRating);
    params.append('prior', priorGames);
    params.append('kfactor', kFactorOption);
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };
  
  const copyLinkToClipboard = () => {
    const url = buildShareUrl();
    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      },
      () => {
        setCopySuccess('Failed to copy');
      }
    );
  };
  
  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(buildShareUrl())}`, '_blank');
  };
  
  const shareViaTwitter = () => {
    const text = `My USCF chess rating calculation. New rating: ${results.newRating}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(buildShareUrl())}`, '_blank');
  };
  
  const handleLookupUSCFID = () => {
    if (uscfId.trim()) {
      window.open(`https://www.uschess.org/msa/MbrDtlMain.php?${uscfId.trim()}`, '_blank');
    } else {
      alert("Please enter a USCF ID to lookup");
    }
  };
  
  const shareViaWhatsApp = () => {
    const text = `Check out my USCF chess rating calculation! New rating: ${results.newRating}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + buildShareUrl())}`, '_blank');
  };
  
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
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">USCF Chess Rating Estimator</h2>
        
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
                    onChange={(e) => setTotalScore(e.target.value)}
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
                    placeholder="e.g., 1200"
                    className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    placeholder="e.g., 15"
                    className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 0)) {
                        setAge(val);
                      }
                    }}
                    placeholder="For new players"
                    className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  USCF ID (optional)
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    value={uscfId}
                    onChange={(e) => setUscfId(e.target.value)}
                    placeholder="e.g., 12345678"
                    className="block w-full px-2 py-1 border-0 border-b-2 border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none focus:ring-0 text-sm"
                  />
                  <button 
                    onClick={handleLookupUSCFID}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Lookup USCF Profile"
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

              {/* High-rated Player Option */}
              <div className="flex items-center mt-2">
                <input
                  id="highrated"
                  type="checkbox" 
                  checked={kFactorOption === "highrated"}
                  onChange={(e) => setKFactorOption(e.target.checked ? "highrated" : "standard")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="highrated" className="ml-2 block text-sm text-gray-700">
                  High-rated Player Option (K=12 for 2100-2399, K=8 for 2400+)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Rating
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setOpponentRatings(['', '', '', '']);
                    setTotalScore('');
                    setCurrentRating('');
                    setPriorGames('');
                    setUscfId('');
                    setAge('');
                    setKFactorOption('standard');
                    setResults({
                      show: false,
                      performanceRating: null,
                      newRating: null,
                      kFactor: null,
                      bonus: null
                    });
                  }}
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
                    <div className="text-gray-500 text-xs">K-Factor</div>
                    <div className="font-medium">{results.kFactor}</div>
                  </div>
                  
                  {results.bonus !== null && (
                    <div>
                      <div className="text-gray-500 text-xs">Bonus Points</div>
                      <div className="font-medium">{results.bonus}</div>
                    </div>
                  )}
                  
                  {results.newRating !== null && (
                    <div>
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
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
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
              <h3 className="font-semibold text-base mb-1">USCF Rating System</h3>
              <p className="mb-2">
                The USCF rating system uses a mathematical formula to calculate ratings based on game results. There are several components:
              </p>
              
              <div className="pl-4 space-y-3">
                <div>
                  <h4 className="font-medium">Performance Rating</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    Your performance rating represents how well you played in a specific event, based on your results and your opponents' ratings.
                  </p>
                  <div className="bg-base-200 p-2 rounded border text-xs">
                    <p><strong>Formula:</strong> Performance Rating = Average Opponent Rating + Rating Difference</p>
                    <p><strong>Rating Difference</strong> = 400 × log<sub>10</sub>(S ÷ (N-S))</p>
                    <p>Where S = your score, N = number of games</p>
                    <p className="mt-1 text-gray-500 italic">Example: If you scored 2.5/4 against opponents with an average rating of 1500, your performance rating would be approximately 1500 + 98 = 1598.</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">K-Factor</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    The K-factor determines how much your rating can change after an event. It's higher for newer players and lower for established players.
                  </p>
                  <ul className="list-disc pl-5 text-xs space-y-0.5">
                    <li><strong>K=32:</strong> For players with fewer than 8 rated games</li>
                    <li><strong>K=24:</strong> For players with 8-19 rated games</li>
                    <li><strong>K=16:</strong> For established players rated below 2100</li>
                    <li><strong>K=12:</strong> For players rated 2100-2399 (high-rated option)</li>
                    <li><strong>K=8:</strong> For players rated 2400+ (high-rated option)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Rating Change</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    The change in your rating is calculated based on the performance rating and K-factor.
                  </p>
                  <div className="bg-base-200 p-2 rounded border text-xs">
                    <p><strong>Formula:</strong> Rating Change = K × (Performance Rating - Current Rating) ÷ N</p>
                    <p>Where N = number of games, K = K-factor</p>
                    <p className="mt-1 text-gray-500 italic">Example: If your current rating is 1400, performance rating is 1598, K=16, and you played 4 games, your rating change would be 16 × (1598-1400) ÷ 4 = 16 × 198 ÷ 4 = 79.2, rounded to 79 points.</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Bonus Points</h4>
                  <p className="text-xs text-gray-700 mb-1">
                    Players with fewer than 26 games may receive bonus points when they significantly outperform their current rating.
                  </p>
                  <div className="bg-base-200 p-2 rounded border text-xs">
                    <p><strong>Formula:</strong> Bonus = (Performance Rating - Current Rating - 14) × [(26 - Prior Games) ÷ 25]<sup>f</sup></p>
                    <p>Where f = 1 for new players, 1.3 for established players</p>
                    <p className="mt-1 text-gray-500 italic">Only applied when performance exceeds current rating by more than 14 points.</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Special Cases</h4>
                  <ul className="list-disc pl-5 text-xs space-y-0.5">
                    <li><strong>Perfect Score:</strong> Performance rating = Highest opponent rating + 400</li>
                    <li><strong>Zero Score:</strong> Performance rating = Lowest opponent rating - 400</li>
                    <li><strong>New Players:</strong> Initial rating usually starts around 750-1200 based on age, then rapidly adjusts</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="divider"></div>
            
            <div className="text-xs text-gray-500">
              <p>
                This calculator implements the USCF rating formulas in effect since June 1, 2017. For official ratings, please refer to the <a href="https://www.uschess.org/index.php/Players-Ratings/Do-NOT-edit-CLOSE-immediately.html" target="_blank" rel="noopener noreferrer" className="link link-primary">Official USCF Rating Estimator</a>.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <span>This is an estimate only; actual USCF calculations may vary slightly.</span>
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

export default EloEstimator; 
