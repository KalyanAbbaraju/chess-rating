import React from 'react';
import { RatingResult } from '@/lib/ratingTypes';

interface RatingResultsTableProps {
  results: RatingResult;
}

const RatingResultsTable: React.FC<RatingResultsTableProps> = ({ results }) => {
  return (
    <div className="mt-4 border border-blue-200 rounded-md bg-white p-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <tbody className="divide-y divide-blue-100">
            {/* Current Rating - now part of table but highlighted */}
            <tr className="bg-blue-50">
              <td className="py-2 pr-3 text-xs text-gray-700 font-medium">Current Rating</td>
              <td className="py-2 font-bold text-blue-700 text-base">{results.currentRating}</td>
            </tr>
            {/* New Rating - now part of table but highlighted */}
            <tr className="bg-blue-50">
              <td className="py-2 pr-3 text-xs text-gray-700 font-medium">New Rating</td>
              <td className="py-2 font-bold text-blue-700 text-base">{results.newRating}</td>
            </tr>
            
            {/* Rating Change */}
            <tr className="bg-blue-50">
              <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Rating Change</td>
              <td className={`py-1.5 font-medium ${results.ratingChange > 0 ? 'text-green-600' : results.ratingChange < 0 ? 'text-red-600' : ''}`}>
                {results.ratingChange > 0 ? '+' : ''}{results.ratingChange}
              </td>
            </tr>
            
            {/* K-Factor */}
            <tr className="bg-blue-50">
              <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">K-Factor</td>
              <td className="py-1.5 font-medium">{results.kFactor}</td>
            </tr>
            
            {/* Other fields conditionally rendered based on type */}
            {results.type === 'uschess' && (
              <>
                {/* Performance Rating */}
                <tr className="bg-white">
                  <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Performance Rating</td>
                  <td className="py-1.5 font-medium">{results.fidePerformanceRating}</td>
                </tr>
                
                {/* Bonus */}
                <tr className="bg-white">
                  <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Bonus Points</td>
                  <td className={`py-1.5 font-medium ${results.bonus > 0 ? 'text-green-600' : ''}`}>
                    {results.bonus > 0 ? '+' + results.bonus : '0'}
                  </td>
                </tr>
                
                {/* Expected Score */}
                <tr className="bg-white">
                  <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Expected Score</td>
                  <td className="py-1.5 font-medium">{results.expectedScore}</td>
                </tr>
              </>
            )}
            
            {results.type === 'fide' && (
              <>
                {/* Performance Rating */}
                <tr className="bg-white">
                  <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Performance Rating</td>
                  <td className="py-1.5 font-medium">{results.performanceRating}</td>
                </tr>
                
                {/* Expected Score */}
                <tr className="bg-white">
                  <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Expected Score</td>
                  <td className="py-1.5 font-medium">{results.expectedScore}</td>
                </tr>
              </>
            )}
            
            {/* Score - only if actualScore exists */}
            {results.actualScore !== undefined && (
              <tr className="bg-white">
                <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Score</td>
                <td className="py-1.5 font-medium">{results.actualScore}</td>
              </tr>
            )}
            
            {/* Total Games - only if totalGames exists */}
            {results.totalGames !== undefined && (
              <tr className="bg-white">
                <td className="py-1.5 pr-3 text-xs text-gray-600 font-medium">Total Games</td>
                <td className="py-1.5 font-medium">{results.totalGames}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatingResultsTable; 