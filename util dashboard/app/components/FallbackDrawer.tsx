'use client';

import React from 'react';
import { Feeder, MitigationEvent, dummyFallbackTiers } from '../data/dummyData';

interface FallbackDrawerProps {
  onClose: () => void;
  feeders: Feeder[];
  mitigationEvents: MitigationEvent[];
}

const FallbackDrawer: React.FC<FallbackDrawerProps> = ({
  onClose,
  feeders,
  mitigationEvents
}) => {
  // Calculate readiness stats
  const readinessStats = {
    ready: dummyFallbackTiers.filter(t => t.readinessStatus === 'ready').length,
    partial: dummyFallbackTiers.filter(t => t.readinessStatus === 'partial').length,
    unavailable: dummyFallbackTiers.filter(t => t.readinessStatus === 'unavailable').length,
    total: dummyFallbackTiers.length,
    consentCompliance: dummyFallbackTiers.every(t => t.consentCompliance)
  };
  
  // Calculate average participation rate
  const avgParticipation = dummyFallbackTiers.reduce((acc, t) => acc + t.participationRate, 0) / dummyFallbackTiers.length;
  
  // Helper function to get status color
  const getTierStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-600';
      case 'partial': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-slate-800 w-11/12 max-w-4xl rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Fallback Tiers
            <span className="ml-2 bg-blue-600 text-xs px-2 py-1 rounded">Active</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Tier info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Fallback Readiness
              </h3>
              
              {/* Readiness stats */}
              <div className="bg-slate-700 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {readinessStats.ready}
                    </div>
                    <div className="text-xs text-gray-400">Ready</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {readinessStats.partial}
                    </div>
                    <div className="text-xs text-gray-400">Partial</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {readinessStats.unavailable}
                    </div>
                    <div className="text-xs text-gray-400">Unavailable</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Participation Rate:</span>
                  <span className="text-sm font-semibold">
                    {Math.round(avgParticipation)}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-800 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${avgParticipation}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <div className={`w-3 h-3 rounded-full ${readinessStats.consentCompliance ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-sm text-gray-300">
                    Consent Compliance: {readinessStats.consentCompliance ? 'Verified' : 'Failed'}
                  </span>
                </div>
              </div>
              
              {/* Tiers List */}
              <h3 className="text-lg font-semibold mb-3 text-white">
                Tier Details
              </h3>
              
              <div className="space-y-3">
                {dummyFallbackTiers.map((tier) => (
                  <div key={tier.tier} className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">
                        Tier {tier.tier}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${getTierStatusColor(tier.readinessStatus)}`}>
                        {tier.readinessStatus.charAt(0).toUpperCase() + tier.readinessStatus.slice(1)}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      {tier.options.join(', ')}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Participation: {tier.participationRate}%</span>
                      <span>
                        {tier.consentCompliance ? '✓ Consent Verified' : '✗ Consent Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side: DER heatmap and active events */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                DER Heatmap
              </h3>
              
              {/* Mock heatmap - in a real implementation this would be a real visualization */}
              <div className="bg-slate-700 p-4 rounded-lg mb-6 h-64 relative">
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="mb-2">DER Resource Map</div>
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => {
                        // Generate random activation status for illustration
                        const activated = Math.random() > 0.6;
                        const activation = activated ? (Math.random() > 0.5 ? 'high' : 'medium') : 'none';
                        
                        let bgColor = 'bg-slate-600';
                        if (activation === 'high') bgColor = 'bg-blue-600';
                        if (activation === 'medium') bgColor = 'bg-blue-500/60';
                        
                        return (
                          <div 
                            key={i}
                            className={`h-6 w-6 rounded ${bgColor} flex items-center justify-center text-xs`}
                          >
                            {activation !== 'none' && (
                              <span className="text-white opacity-70">
                                {Math.round(Math.random() * 20)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-xs">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-600 rounded mr-1"></div>
                        <span>High</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-500/60 rounded mr-1"></div>
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-slate-600 rounded mr-1"></div>
                        <span>None</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Active fallback events */}
              <h3 className="text-lg font-semibold mb-3 text-white">
                Active Fallback Events ({mitigationEvents.length})
              </h3>
              
              <div className="space-y-3">
                {mitigationEvents.length > 0 ? (
                  mitigationEvents.map((event) => {
                    const feeder = feeders.find(f => f.id === event.feederId);
                    
                    return (
                      <div key={event.id} className="bg-slate-700 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-semibold">
                            {feeder?.name || 'Unknown Feeder'}
                          </div>
                          <div className="text-xs bg-blue-600 px-2 py-1 rounded">
                            Tier {event.tier}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-300 mb-2">
                          Load Reduction: {event.actionSet.loadReduction}%
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Duration: {event.actionSet.duration} minutes</span>
                          <span>DERs: {event.actionSet.derIds.length}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 py-4 bg-slate-700 rounded-lg">
                    No active fallback events
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-700">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackDrawer; 