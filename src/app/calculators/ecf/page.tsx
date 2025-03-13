'use client';

import React, { useState } from 'react';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function ECFCalculatorPage() {
  const [result, setResult] = useState<{
    oldRating: number;
    newRating: number;
    change: number;
    expectedScore: number;
    actualScore: number;
    kFactor: number;
  } | null>(null);

  const [tabView, setTabView] = useState('calculator');

  const calculateECFRating = (data: {
    currentRating: number;
    opponentRating: number;
    result: string;
  }) => {
    // Get the actual score based on the result
    let actualScore = 0;
    if (data.result === 'win') actualScore = 1;
    else if (data.result === 'draw') actualScore = 0.5;
    else if (data.result === 'loss') actualScore = 0;

    // ECF uses a 4-digit rating system that can be approximated from Elo
    // ECF ≈ (Elo × 8) + 600

    // For this calculator, we'll work with the Elo-like equivalent and convert back
    const eloEquivalent = (data.currentRating - 600) / 8;
    const opponentEloEquivalent = (data.opponentRating - 600) / 8;
    
    // Calculate expected score using standard Elo formula
    const ratingDifference = opponentEloEquivalent - eloEquivalent;
    const expectedScore = 1 / (1 + Math.pow(10, ratingDifference / 400));
    
    // ECF uses an effective K-factor of 40 in Elo terms (translates to ~5 ECF points)
    const kFactor = 40;
    
    // Calculate the Elo rating change
    const eloRatingChange = Math.round(kFactor * (actualScore - expectedScore));
    
    // Convert back to ECF rating change
    const ratingChange = Math.round(eloRatingChange * 8);
    
    // Calculate the new rating
    const newRating = data.currentRating + ratingChange;
    
    // Set the result
    setResult({
      oldRating: data.currentRating,
      newRating,
      change: ratingChange,
      expectedScore,
      actualScore,
      kFactor: 5 // Display the ECF K-factor equivalent
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">ECF Rating Calculator</h1>
        <p className="text-muted-foreground">
          Calculate how your English Chess Federation (ECF) rating will change after a game
        </p>
      </div>
      
      <Tabs defaultValue="calculator" value={tabView} onValueChange={setTabView} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="formula">Formula</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="mt-6">
          <div className="grid gap-8 md:grid-cols-1">
            <CalculatorForm 
              title="ECF Rating Calculator" 
              description="Enter your details to calculate your new ECF rating"
              onCalculate={calculateECFRating}
              calculatorType="ecf"
            />
            
            {result && (
              <ResultDisplay 
                oldRating={result.oldRating}
                newRating={result.newRating}
                change={result.change}
                expectedScore={result.expectedScore}
                actualScore={result.actualScore}
                kFactor={result.kFactor}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="formula" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ECF Rating Formula</CardTitle>
              <CardDescription>How ECF calculates rating changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">ECF Rating System</h3>
                <p>
                  The ECF uses a 4-digit rating system that differs from the Elo system used by FIDE. The conversion between ECF and Elo is approximately:
                </p>
                <div className="bg-gray-50 p-4 rounded-md mt-2">
                  <p className="font-mono">ECF ≈ (Elo × 8) + 600</p>
                  <p className="font-mono">Elo ≈ (ECF - 600) ÷ 8</p>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Expected Score (E)</h3>
                <p>
                  Although ECF points are different, the expected score calculation is similar to Elo:
                </p>
                <div className="bg-gray-50 p-4 rounded-md mt-2">
                  <p className="font-mono">E = 1 / (1 + 10^((Ro - Rp) / 400))</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where Ro and Rp are Elo-equivalent ratings.
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Rating Change</h3>
                <p>
                  For ECF ratings, each performance difference of approximately 5 ECF points represents the same performance difference as 40 Elo points.
                </p>
                <div className="bg-gray-50 p-4 rounded-md mt-2">
                  <p className="font-mono">Rating Change = 5 × (S - E) × N</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where S is the actual score (1, 0.5, or 0), E is the expected score, and N is the number of games.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm">
                  <Link href="https://www.englishchess.org.uk/ratings/about-ratings/" className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                    <span>ECF Rating System Documentation</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rules" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ECF Rating Rules</CardTitle>
              <CardDescription>Important rules for ECF ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Rating Scale</h3>
                <p>
                  The ECF rating scale is different from the Elo system used by FIDE:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>ECF ratings typically range from 0 to 300</li>
                  <li>Strong club players are typically rated 120-160</li>
                  <li>National masters are typically rated 180-220</li>
                  <li>International masters and grandmasters are typically rated 220+</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Rating Categories</h3>
                <p>
                  ECF maintains separate ratings for different time controls:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Standard play (60+ minutes per player)</li>
                  <li>Rapid play (15-59 minutes per player)</li>
                  <li>Blitz play (less than 15 minutes per player)</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  This calculator is designed for Standard play ratings.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Rating Periods</h3>
                <p>
                  The ECF updates ratings on a rolling monthly basis:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Results are processed as they are received</li>
                  <li>Official rating lists are published monthly</li>
                  <li>The rating year runs from July to June</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Provisional Ratings</h3>
                <p>
                  New players receive provisional ratings until they have played 30 games:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Your initial rating is based on your performance in your first games</li>
                  <li>Ratings change more quickly during the provisional period</li>
                  <li>After 30 games, your rating becomes established</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  This calculator is designed for established ratings.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm">
                  <Link href="https://www.englishchess.org.uk/wp-content/uploads/2019/06/rating_system_regulations_2019-20.pdf" className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                    <span>Official ECF Rating Regulations</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-12">
        <h2 className="text-xl font-semibold mb-4">Try Our Other Calculators</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/calculators/fide" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
            FIDE Calculator
          </Link>
          <Link href="/calculators/uscf" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
            USCF Calculator
          </Link>
        </div>
      </div>
    </div>
  );
} 