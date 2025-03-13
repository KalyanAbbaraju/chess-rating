import { Metadata } from 'next'
import { FIDECalculatorClientWrapper } from '@/components/calculators/fide/FIDECalculatorClientWrapper'

export const metadata: Metadata = {
  title: 'FIDE Rating Calculator - Calculate Chess Rating Changes',
  description: 'Calculate potential FIDE rating changes based on your results against rated opponents.'
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-xl font-semibold mb-1">FIDE Rating Calculator</h1>
        <p className="text-sm text-gray-600">
          Estimate your rating change after rated games
        </p>
      </div>
      
      <div className="border border-gray-200 rounded-sm bg-white">
        <div className="p-4">
          <FIDECalculatorClientWrapper 
            title="FIDE Rating Calculator"
            description="Calculate your potential FIDE rating change"
          />
        </div>
      </div>
    </div>
  )
} 