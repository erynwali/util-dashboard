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
  
  // Format date for grouping
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    // Check if date is yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Return formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status color and icon
  const getStatusInfo = (status: string, fallbackActivated: boolean) => {
    let color, bgColor, icon;
    
    switch (status) {
      case 'active':
        color = 'text-blue-400';
        bgColor = 'bg-blue-900 bg-opacity-50';
        icon = (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
        break;
      case 'completed':
        color = 'text-green-400';
        bgColor = 'bg-green-900 bg-opacity-50';
        icon = (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
        break;
      case 'failed':
        color = 'text-red-400';
        bgColor = 'bg-red-900 bg-opacity-50';
        icon = (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
        break;
      default:
        color = 'text-yellow-400';
        bgColor = 'bg-yellow-900 bg-opacity-50';
        icon = (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
    
    return { color, bgColor, icon };
  };
  
  // Group events by date
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = formatDate(event.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, MitigationEvent[]>);

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">
          Audit Trail
        </h2>
        <div className="text-xs text-gray-400">{mitigationEvents.length} events</div>
      </div>
      
      {mitigationEvents.length > 0 ? (
        <div className="overflow-y-auto scrollbar-thin flex-1 -mx-2 px-2">
          {Object.entries(groupedEvents).map(([date, events]) => (
            <div key={date} className="mb-4">
              <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">{date}</div>
              
              <div className="space-y-3">
                {events.map((event) => {
                  const { color, bgColor, icon } = getStatusInfo(event.status, event.fallbackActivated);
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`rounded-md p-3 ${bgColor}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm">
                          {getFeederName(event.feederId)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className={`text-xs flex items-center ${color}`}>
                          {icon}
                          <span className="ml-1">
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            {event.fallbackActivated && ' (Fallback)'}
                          </span>
                        </div>
                        
                        <div className="text-xs bg-slate-800 bg-opacity-50 px-2 py-0.5 rounded">
                          Tier {event.tier}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-300 border-t border-slate-600 border-opacity-50 pt-2">
                        <div className="flex justify-between">
                          <span>Load reduction:</span>
                          <span>{event.actionSet.loadReduction}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{event.actionSet.duration} min</span>
                        </div>
                        <div className="font-mono text-gray-400 text-[10px] mt-1 truncate">
                          {event.hashLog.substring(0, 15)}...
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          No mitigation events recorded
        </div>
      )}
    </div>
  );
};

export default AuditTrail; 