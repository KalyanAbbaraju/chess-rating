import { Metadata } from 'next'
import { FIDECalculatorClientWrapper } from '@/components/calculators/fide/FIDECalculatorClientWrapper'
import CalculatorStructuredData from '@/components/structured-data/CalculatorStructuredData'

export const metadata: Metadata = {
  title: 'FIDE Chess Rating Calculator | Estimate Elo Changes',
  description: 'Free FIDE chess rating calculator to estimate Elo changes after tournaments or games. Accurate calculations based on official FIDE formulas with K-factor options for all player levels.'
}

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com';
  
  return (
    <>
      <CalculatorStructuredData 
        name="FIDE Chess Rating Calculator"
        description="Calculate potential FIDE rating changes based on your results against rated opponents."
        url={`${baseUrl}/calculators/fide`}
        calculatorType="FIDE"
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold mb-1">FIDE Rating Calculator</h1>
          <p className="text-sm text-gray-600">
            Estimate your rating change after rated games
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-sm bg-white">
          <div className="p-4">
            <FIDECalculatorClientWrapper />
          </div>
        </div>
      </div>
    </>
  )
} 