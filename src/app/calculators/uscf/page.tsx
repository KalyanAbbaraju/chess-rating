'use client';

import React, { useState } from 'react';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function USCFCalculatorPage() {
  const [result, setResult] = useState<{
    oldRating: number;
    newRating: number;
    change: number;
    expectedScore: number;
    actualScore: number;
    kFactor: number;
  } | null>(null);

  const [tabView, setTabView] = useState('calculator');

  const calculateUSCFRating = (data: {
    currentRating: number;
    opponentRating: number;
    result: string;
  }) => {
    // Get the actual score based on the result
    let actualScore = 0;
    if (data.result === 'win') actualScore = 1;
    else if (data.result === 'draw') actualScore = 0.5;
    else if (data.result === 'loss') actualScore = 0;

    // USCF uses a different formula than FIDE
    // Calculate the expected outcome using USCF's formula
    const ratingDifference = data.opponentRating - data.currentRating;
    const expectedScore = 1 / (1 + Math.pow(10, ratingDifference / 400));
    
    // Determine the K-factor based on USCF rules
    let kFactor = 32;
    
    // USCF K-factor varies based on rating and number of games played
    // This is a simplified version
    if (data.currentRating < 2100) {
      kFactor = 32;
    } else if (data.currentRating >= 2100 && data.currentRating < 2400) {
      kFactor = 24;
    } else {
      kFactor = 16;
    }
    
    // Calculate the rating change
    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    
    // Calculate the new rating
    const newRating = data.currentRating + ratingChange;
    
    // Set the result
    setResult({
      oldRating: data.currentRating,
      newRating,
      change: ratingChange,
      expectedScore,
      actualScore,
      kFactor
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">US Chess Rating Calculator</h1>
        <p className="text-muted-foreground">
          Calculate how your US Chess rating will change after a game
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
              title="US Chess Rating Calculator" 
              description="Enter your details to calculate your new US Chess rating"
              onCalculate={calculateUSCFRating}
              calculatorType="uscf"
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
              <CardTitle>US Chess Rating Formula</CardTitle>
              <CardDescription>How US Chess calculates rating changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Expected Score (We)</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-mono">We = 1 / (1 + 10^((Ro - Rp) / 400))</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where Ro is the opponent's rating and Rp is the player's rating.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Rating Change</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-mono">Rn = Ro + K × (W - We)</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where K is the K-factor, W is the actual score (1, 0.5, or 0), and We is the expected score.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">K-Factor</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>K = 32 for players rated below 2100</li>
                  <li>K = 24 for players rated 2100-2399</li>
                  <li>K = 16 for players rated 2400 and above</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Note: US Chess has more complex K-factor rules that consider number of games played and age, but this is a simplified version.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm">
                  <Link href="http://www.glicko.net/ratings/rating.system.pdf" className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                    <span>US Chess Rating System</span>
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
              <CardTitle>US Chess Rating Rules</CardTitle>
              <CardDescription>Important rules for US Chess ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Rating Period</h3>
                <p>US Chess typically calculates ratings after each tournament, rather than on a fixed schedule.</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Most tournament results are processed within 1-2 weeks</li>
                  <li>Ratings are updated as soon as the tournament is processed</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Provisional Ratings</h3>
                <p>
                  Players with fewer than 26 games are considered to have provisional ratings, which are calculated differently:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Initial rating is based on first 3-5 games</li>
                  <li>Ratings change more dramatically until 26 games are completed</li>
                  <li>Different K-factors apply for provisional players</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  This calculator uses the formula for established ratings (26+ games).
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Rating Floors</h3>
                <p>
                  US Chess implements "rating floors" that prevent ratings from dropping below certain thresholds:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Every player has a minimum rating floor of 100</li>
                  <li>Floors increase based on highest achieved rating</li>
                  <li>Earning certain titles can raise your floor (e.g., National Master)</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Time Controls</h3>
                <p>
                  US Chess has different rating systems based on time control:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Regular: Games with 30+ minutes per player</li>
                  <li>Quick: Games between 10-29 minutes per player</li>
                  <li>Blitz: Games between 5-9 minutes per player</li>
                  <li>Online: Separate ratings for online play</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  This calculator applies to Regular (Standard) ratings.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm">
                  <Link href="https://new.uschess.org/sites/default/files/media/documents/us-chess-rule-book-online-only-edition-chapters-1-2-10-11-9-1-20.pdf" className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                    <span>Official US Chess Rulebook</span>
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
          <Link href="/calculators/ecf" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
            ECF Calculator
          </Link>
        </div>
      </div>
    </div>
  );
} 