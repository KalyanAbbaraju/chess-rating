import { Metadata } from 'next'
import { USChessCalculatorClientWrapper } from '@/components/calculators/uscf/USChessCalculatorClientWrapper'

export const metadata: Metadata = {
  title: 'US Chess Rating Calculator - Calculate Chess Rating Changes',
  description: 'Calculate potential US Chess rating changes based on your results against rated opponents.'
}

export default function Page() {
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold mb-1">US Chess Rating Calculator</h1>
          <p className="text-sm text-gray-600">
            Estimate your rating change after rated games
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-sm bg-white">
          <div className="p-4">
            <USChessCalculatorClientWrapper 
              title="US Chess Rating Calculator"
              description="Calculate your potential US Chess rating change"
            />
          </div>
        </div>
      </div>
    </>
  )
} 