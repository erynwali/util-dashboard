'use client';

import React from 'react';
import { Feeder } from '../data/dummyData';

interface FeederSummaryProps {
  feeders: Feeder[];
  selectedFeeder: Feeder | null;
  setSelectedFeeder: (feeder: Feeder | null) => void;
}

const FeederSummary: React.FC<FeederSummaryProps> = ({ 
  feeders, 
  selectedFeeder, 
  setSelectedFeeder 
}) => {
  // Sort feeders by criticality and load percentage
  const sortedFeeders = [...feeders].sort((a, b) => {
    // First sort by critical flag
    if (a.critical && !b.critical) return -1;
    if (!a.critical && b.critical) return 1;
    
    // Then by load percentage
    const aLoadPercent = (a.currentLoad / a.capacity) * 100;
    const bLoadPercent = (b.currentLoad / b.capacity) * 100;
    return bLoadPercent - aLoadPercent;
  });
  
  // Helper function to determine status color
  const getStatusColor = (feeder: Feeder) => {
    if (feeder.critical) return 'bg-red-600 text-white';
    
    const loadPercent = (feeder.currentLoad / feeder.capacity) * 100;
    if (loadPercent >= 80) return 'bg-yellow-400 text-black';
    return 'bg-green-600 text-white';
  };
  
  // Helper function to format the load percentage
  const formatLoad = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    return `${Math.round(percentage)}%`;
  };

  // Helper function to generate progress bar styling
  const getProgressBarStyle = (feeder: Feeder) => {
    const loadPercent = (feeder.currentLoad / feeder.capacity) * 100;
    let bgColor = 'bg-green-600';
    
    if (feeder.critical) {
      bgColor = 'bg-red-600';
    } else if (loadPercent >= 80) {
      bgColor = 'bg-yellow-400';
    }
    
    return { 
      width: `${loadPercent}%`, 
      backgroundColor: bgColor 
    };
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">
          Feeder Summary
        </h2>
        <div className="text-xs text-gray-400">{feeders.length} feeders</div>
      </div>
      
      <div className="overflow-y-auto scrollbar-thin flex-1 -mx-2 px-2">
        {sortedFeeders.map((feeder) => (
          <div 
            key={feeder.id}
            onClick={() => {
              try {
                // Verify we have a valid feeder before selection
                if (feeder && feeder.id) {
                  console.log('Selecting feeder:', feeder.id, feeder.name);
                  
                  // If clicking the already selected feeder, deselect it
                  if (selectedFeeder && selectedFeeder.id === feeder.id) {
                    setSelectedFeeder(null);
                  } else {
                    setSelectedFeeder(feeder);
                  }
                }
              } catch (error) {
                console.error("Error selecting feeder:", error);
              }
            }}
            className={`
              mb-3 p-3 rounded-md cursor-pointer transition-colors duration-150
              ${selectedFeeder?.id === feeder.id ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'}
              ${feeder.critical ? 'border-l-4 border-red-600' : ''}
            `}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">{feeder.name}</div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(feeder)}`}>
                {feeder.critical ? 'Critical' : feeder.breachMargin < 10 ? 'Warning' : 'Normal'}
              </span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Region: {feeder.region}</span>
              <span>Margin: {feeder.breachMargin.toFixed(1)}%</span>
            </div>
            
            <div className="mt-2">
              <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                <div 
                  className="h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={getProgressBarStyle(feeder)}
                >
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span>{formatLoad(feeder.currentLoad, feeder.capacity)}</span>
                <span>{feeder.capacity} kW</span>
              </div>
            </div>
          </div>
        ))}
        
        {feeders.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No feeder data available
          </div>
        )}
      </div>
    </div>
  );
};

export default FeederSummary; 