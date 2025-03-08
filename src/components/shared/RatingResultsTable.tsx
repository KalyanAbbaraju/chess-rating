import React from 'react';
import { RatingResult } from '@/lib/ratingTypes';

interface RatingResultsTableProps {
  results: RatingResult | null;
}

const RatingResultsTable: React.FC<RatingResultsTableProps> = ({ results }) => {
  if (!results) return null;
  
  // Common data
  const commonData = [
    { label: 'Current Rating', value: results.currentRating },
    { label: 'New Rating', value: results.newRating },
    { label: 'Rating Change', value: results.ratingChange > 0 ? `+${results.ratingChange}` : results.ratingChange },
    { label: 'K-Factor', value: results.kFactor },
    { label: 'Expected Score', value: results.expectedScore?.toFixed(2) },
    { label: 'Actual Score', value: results.actualScore?.toFixed(1) },
    { label: 'Total Games', value: results.totalGames || 'N/A' }
  ];
  
  // System-specific data
  const systemSpecificData = results.type === 'uschess' 
    ? [
        { label: 'Bonus Points', value: results.bonus },
        { label: 'FIDE Performance', value: results.fidePerformanceRating },
        { label: 'Linear Performance', value: results.linearPerformanceRating },
        { label: 'Algorithm 400 Performance', value: results.algorithm400PerformanceRating },
        { label: 'Provisional', value: results.isProvisional ? 'Yes' : 'No' },
        ...(results.ratingWithoutFloor && results.ratingWithoutFloor !== results.newRating ? 
            [{ label: 'Rating Before Floor', value: results.ratingWithoutFloor }] : [])
      ]
    : [ // FIDE specific data
        { label: 'Performance Rating', value: results.performanceRating },
        { label: 'Classification', value: results.classification },
        { label: 'Dynamic K-Factor', value: results.dynamicKFactor },
        { label: 'Provisional', value: results.isProvisional ? 'Yes' : 'No' }
      ];
  
  const allData = [...commonData, ...systemSpecificData.filter(item => item.value !== undefined)];

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Detailed Results</h3>
          <div className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {results.type === 'uschess' ? 'US Chess' : 'FIDE'}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-2 text-sm font-medium text-gray-700">
                  {item.label}
                </td>
                <td className="px-6 py-2 text-sm text-gray-700 text-right">
                  {item.value !== undefined && item.value !== null ? item.value : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatingResultsTable; 