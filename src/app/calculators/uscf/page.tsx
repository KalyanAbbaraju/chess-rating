import { Metadata } from 'next'
import { USChessCalculatorClientWrapper } from '@/components/calculators/uscf/USChessCalculatorClientWrapper'
import CalculatorStructuredData from '@/components/structured-data/CalculatorStructuredData'

export const metadata: Metadata = {
  title: 'US Chess Rating Calculator | USCF Rating Estimator',
  description: 'Free US Chess (USCF) rating calculator with support for regular, quick, and blitz time controls. Estimate rating changes using official USCF formulas for tournaments and individual games.'
}

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com';
  
  return (
    <>
      <CalculatorStructuredData 
        name="US Chess Rating Calculator"
        description="Calculate potential US Chess rating changes based on your results against rated opponents."
        url={`${baseUrl}/calculators/uscf`}
        calculatorType="USCF"
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold mb-1">US Chess Rating Calculator</h1>
          <p className="text-sm text-gray-600">
            Estimate your rating change after rated games
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-sm bg-white">
          <div className="p-4">
            <USChessCalculatorClientWrapper />
          </div>
        </div>
      </div>
    </>
  )
} 