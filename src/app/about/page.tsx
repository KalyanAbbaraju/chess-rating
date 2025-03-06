'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">About Chess Companion</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          Chess Companion is a comprehensive toolkit designed to help chess players of all levels improve their game and track their progress.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to provide accurate, useful tools that help chess players analyze their performance, estimate their ratings, and access valuable resources to enhance their understanding of the game.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Rating Calculators</h2>
        <p>
          We offer both USCF and FIDE rating calculators that implement the official formulas used by these organizations. Our calculators are regularly updated to reflect any changes in the rating systems.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">The Team</h2>
        <p>
          Chess Companion was created by a team of chess enthusiasts and developers who wanted to combine their passion for chess with their technical skills. We are constantly working to improve our tools and add new features based on user feedback.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
        <p>
          While we strive for accuracy in our calculators, they provide estimates only. Official ratings are determined by the respective chess organizations. We strongly discourage players from using these estimators to make decisions about tournament participation based solely on potential rating changes.
        </p>
      </div>
    </div>
  );
} 