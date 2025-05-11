'use client';

import React from 'react';
import { MitigationEvent, Feeder } from '../data/dummyData';

interface AuditTrailProps {
  mitigationEvents: MitigationEvent[];
  feeders: Feeder[];
}

const AuditTrail: React.FC<AuditTrailProps> = ({ mitigationEvents, feeders }) => {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...mitigationEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Helper function to get feeder name from ID
  const getFeederName = (feederId: string) => {
    const feeder = feeders.find(f => f.id === feederId);
    return feeder ? feeder.name : 'Unknown Feeder';
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 flex-1">
      <h2 className="text-lg font-bold mb-4 text-white border-b border-slate-700 pb-2">
        Audit Trail
      </h2>
      
      <div className="overflow-y-auto scrollbar-thin h-[calc(100%-2.5rem)]">
        {sortedEvents.length > 0 ? (
          <ul className="space-y-3">
            {sortedEvents.map((event) => (
              <li 
                key={event.id} 
                className="bg-slate-700 rounded p-3 text-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold">
                    {getFeederName(event.feederId)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimestamp(event.timestamp)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className={`text-xs ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    {event.fallbackActivated && ' (Fallback Tier)'}
                  </div>
                  
                  <div className="text-xs bg-slate-600 px-2 py-1 rounded">
                    Tier {event.tier}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-300 border-t border-slate-600 pt-2">
                  <div>Load reduction: {event.actionSet.loadReduction}%</div>
                  <div>Duration: {event.actionSet.duration} minutes</div>
                  <div className="font-mono text-gray-400 text-[10px] mt-1 truncate">
                    Hash: {event.hashLog}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-6">
            No mitigation events recorded
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail; 