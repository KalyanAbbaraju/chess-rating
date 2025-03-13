import React from 'react';

interface MultipleGameResult {
  gameNumber: number;
  opponentRating: number;
  result: string;
  expectedScore: number;
  ratingChange: number;
}

interface ResultDisplayProps {
  oldRating: number;
  newRating: number;
  change: number;
  expectedScore: number;
  actualScore: number;
  kFactor: number;
  multipleGameResults?: MultipleGameResult[];
}

export function ResultDisplay({ 
  oldRating, 
  newRating, 
  change,
  expectedScore,
  actualScore,
  kFactor,
  multipleGameResults
}: ResultDisplayProps) {
  const isPositive = change > 0;
  const isMultipleGames = multipleGameResults && multipleGameResults.length > 0;
  
  const formatResult = (result: string) => {
    switch(result) {
      case 'win': return 'Win (1.0)';
      case 'draw': return 'Draw (0.5)';
      case 'loss': return 'Loss (0.0)';
      default: return result;
    }
  };
  
  return (
    <div className="mt-4 w-full max-w-3xl mx-auto rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Rating Results</h2>
        <p className="text-gray-600 text-xs">
          {isMultipleGames 
            ? `Your new rating after ${multipleGameResults?.length} games`
            : 'Your new rating after this game'
          }
        </p>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 p-2 rounded">
            <h3 className="text-xs font-medium text-gray-600">Old Rating</h3>
            <p className="text-lg font-bold text-gray-800">{oldRating}</p>
          </div>
          
          <div className="bg-gray-50 p-2 rounded">
            <h3 className="text-xs font-medium text-gray-600">New Rating</h3>
            <p className="text-lg font-bold text-gray-800">{newRating}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-xs font-medium text-gray-600">Rating Change</h3>
          <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}
          </p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-xs font-medium text-gray-600">Expected vs Actual Score</h3>
          <div className="grid grid-cols-2 gap-3 mt-0.5">
            <div>
              <p className="text-xs text-gray-500">Expected</p>
              <p className="text-sm font-medium text-gray-800">{expectedScore.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Actual</p>
              <p className="text-sm font-medium text-gray-800">{actualScore}</p>
            </div>
          </div>
        </div>
        
        {kFactor !== undefined && (
          <div className="bg-gray-50 p-2 rounded">
            <h3 className="text-xs font-medium text-gray-600">K-Factor</h3>
            <p className="text-sm font-medium text-gray-800">{kFactor}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              K-Factor determines how much your rating can change after a single game
            </p>
          </div>
        )}
        
        {isMultipleGames && (
          <div>
            <h3 className="text-xs font-medium text-gray-600 mb-1">Individual Game Results</h3>
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 grid grid-cols-5 text-center">
                <div className="py-1 px-1 text-xs font-medium text-gray-600">Game</div>
                <div className="py-1 px-1 text-xs font-medium text-gray-600">Opponent</div>
                <div className="py-1 px-1 text-xs font-medium text-gray-600">Result</div>
                <div className="py-1 px-1 text-xs font-medium text-gray-600">Expected</div>
                <div className="py-1 px-1 text-xs font-medium text-gray-600">Change</div>
              </div>
              
              {multipleGameResults?.map((game) => (
                <div key={game.gameNumber} className="grid grid-cols-5 text-center border-b border-gray-200 last:border-b-0">
                  <div className="py-1 px-1 text-xs text-gray-800">{game.gameNumber}</div>
                  <div className="py-1 px-1 text-xs text-gray-800">{game.opponentRating}</div>
                  <div className="py-1 px-1 text-xs text-gray-800">{formatResult(game.result)}</div>
                  <div className="py-1 px-1 text-xs text-gray-800">{game.expectedScore.toFixed(2)}</div>
                  <div className={`py-1 px-1 text-xs font-medium ${game.ratingChange > 0 ? 'text-green-600' : game.ratingChange < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                    {game.ratingChange > 0 ? '+' : ''}{game.ratingChange}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 