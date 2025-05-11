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
    if (feeder.critical) return 'bg-critical text-white';
    
    const loadPercent = (feeder.currentLoad / feeder.capacity) * 100;
    if (loadPercent >= 80) return 'bg-warning text-black';
    return 'bg-normal text-white';
  };
  
  // Helper function to format the load percentage
  const formatLoad = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    return `${Math.round(percentage)}%`;
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 flex-1">
      <h2 className="text-lg font-bold mb-4 text-white border-b border-slate-700 pb-2">
        Feeder Summary
      </h2>
      
      <div className="overflow-y-auto scrollbar-thin h-[calc(100%-2.5rem)]">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-400">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Load</th>
              <th className="pb-2">Margin</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedFeeders.map((feeder) => (
              <tr 
                key={feeder.id}
                className={`
                  border-b border-slate-700 hover:bg-slate-700 cursor-pointer transition
                  ${selectedFeeder?.id === feeder.id ? 'bg-slate-700' : ''}
                `}
                onClick={() => setSelectedFeeder(feeder)}
              >
                <td className="py-2">{feeder.name}</td>
                <td className="py-2">{formatLoad(feeder.currentLoad, feeder.capacity)}</td>
                <td className={`py-2 ${feeder.breachMargin < 10 ? 'text-red-400' : 'text-gray-300'}`}>
                  {feeder.breachMargin.toFixed(1)}%
                </td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(feeder)}`}>
                    {feeder.critical ? 'Critical' : feeder.breachMargin < 10 ? 'Warning' : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
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