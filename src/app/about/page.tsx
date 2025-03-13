'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto pt-12 pb-16 px-4 sm:px-6 md:max-w-4xl">
      {/* Header with decorative top border */}
      <div className="relative mb-10 pb-5">
        <div className="absolute top-0 left-0 w-20 h-1 bg-blue-600"></div>
        <h1 className="text-3xl font-bold mt-6 text-gray-800 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
          About Chess Companion
        </h1>
        <p className="text-gray-500 mt-2 text-lg">A toolkit for chess players of all levels</p>
      </div>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg leading-relaxed mb-8">
          Chess Companion is a comprehensive toolkit designed to help chess players of all levels improve their game and track their progress. Our platform provides accurate calculation tools, educational resources, and a supportive community environment.
        </p>
        
        {/* Mission section with subtle background */}
        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 mb-10 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to provide accurate, useful tools that help chess players analyze their performance, estimate their ratings, and access valuable resources to enhance their understanding of the game.
          </p>
        </div>
        
        {/* Rating calculators section */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 border-b pb-2">Rating Calculators</h2>
        <p className="text-gray-700 mb-6">
          We offer both USCF and FIDE rating calculators that implement the official formulas used by these organizations. Our calculators are regularly updated to reflect any changes in the rating systems.
        </p>
        
        {/* Team section */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 border-b pb-2">The Team</h2>
        <p className="text-gray-700 mb-6">
          Chess Companion was created by a team of chess enthusiasts and developers who wanted to combine their passion for chess with their technical skills. We are constantly working to improve our tools and add new features based on user feedback.
        </p>
        
        {/* Disclaimer section with attention-grabbing style */}
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Disclaimer</h2>
          <p className="text-gray-700">
            While we strive for accuracy in our calculators, they provide estimates only. Official ratings are determined by the respective chess organizations. We strongly discourage players from using these estimators to make decisions about tournament participation based solely on potential rating changes.
          </p>
        </div>
      </div>
    </div>
  );
} 