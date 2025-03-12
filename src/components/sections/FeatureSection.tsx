import React from 'react';
import { Calculator, Award, Users } from 'lucide-react';

// Styles for text colors
const styles = {
  darkGrayText: {
    color: '#374151 !important', // text-gray-700
  },
};

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={styles.darkGrayText}>
          Why Use Our Calculators
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
            <div className="text-indigo-600 mb-4">
              <Calculator size={26} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>Accurate Formulas</h3>
            <p className="text-gray-700">
              All calculators use the official, up-to-date formulas from their respective chess federations.
            </p>
          </div>
          
          <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
            <div className="text-indigo-600 mb-4">
              <Award size={26} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>Special Rules</h3>
            <p className="text-gray-700">
              Accounts for special cases like rating floors, bonus points, and category adjustments.
            </p>
          </div>
          
          <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
            <div className="text-indigo-600 mb-4">
              <Users size={26} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>Made for Players</h3>
            <p className="text-gray-700">
              Designed by chess players for chess players, with intuitive interfaces and helpful explanations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 