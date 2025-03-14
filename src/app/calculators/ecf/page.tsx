import { Metadata } from 'next'
import { ECFCalculatorClientWrapper } from '@/components/calculators/ecf/ECFCalculatorClientWrapper'
import CalculatorStructuredData from '@/components/structured-data/CalculatorStructuredData'
import DisclaimerContent from '@/components/server/DisclaimerContent'

export const metadata: Metadata = {
  title: 'ECF Chess Rating Calculator | English Chess Federation',
  description: 'Free English Chess Federation (ECF) rating calculator to estimate rating changes after tournaments or individual games. Uses official ECF formulas with support for different K-factors.'
}

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com';
  
  return (
    <>
      <CalculatorStructuredData 
        name="ECF Chess Rating Calculator"
        description="Calculate potential ECF rating changes based on your results against rated opponents."
        url={`${baseUrl}/calculators/ecf`}
        calculatorType="ECF"
      />
      <DisclaimerContent organization="ECF" />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold mb-1">ECF Rating Calculator</h1>
          <p className="text-sm text-gray-600">
            Estimate your rating change after rated games
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-sm bg-white">
          <div className="p-4">
            <ECFCalculatorClientWrapper />
          </div>
        </div>
      </div>
    </>
  )
} 