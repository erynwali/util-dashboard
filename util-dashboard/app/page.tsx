'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import FeederSummary from './components/FeederSummary';
import AgentChat from './components/AgentChat';
import AuditTrail from './components/AuditTrail';
import FallbackDrawer from './components/FallbackDrawer';
import Header from './components/Header';
import { updateFeederLoads, getCurrentData } from './utils/simulation';
import { Feeder, DerAsset, MitigationEvent, ChatLog } from './data/dummyData';

// Import the map component dynamically to avoid SSR issues with Leaflet
const GridMap = dynamic(
  () => import('./components/GridMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex-1 bg-slate-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    )
  }
);

// Error boundary for map component
function MapErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex-1 bg-slate-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
        <div className="text-white text-center p-4">
          <p className="text-red-500 mb-2">Map could not be loaded</p>
          <button 
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Home() {
  // State for all dashboard data
  const [feeders, setFeeders] = useState<Feeder[]>([]);
  const [derAssets, setDerAssets] = useState<DerAsset[]>([]);
  const [mitigationEvents, setMitigationEvents] = useState<MitigationEvent[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  
  // Fallback drawer state
  const [showFallback, setShowFallback] = useState<boolean>(false);
  
  // Selected items for details
  const [selectedFeeder, setSelectedFeeder] = useState<Feeder | null>(null);
  const [selectedDer, setSelectedDer] = useState<DerAsset | null>(null);
  
  // State for panel visibility
  const [activeLeftPanel, setActiveLeftPanel] = useState<'feeder' | 'audit'>('feeder');

  // Initialize data and setup interval for simulation
  useEffect(() => {
    // Initial data load
    const data = getCurrentData();
    setFeeders(data.feeders);
    setDerAssets(data.derAssets);
    setMitigationEvents(data.mitigationEvents);
    setChatLogs(data.chatLogs);
    
    // Update feeder loads every minute
    const intervalId = setInterval(() => {
      const updatedFeeders = updateFeederLoads();
      setFeeders(updatedFeeders);
      
      // Check if any critical feeders have fallback events
      const criticalFallback = mitigationEvents.some(
        event => event.fallbackActivated && 
        event.status === 'active' && 
        updatedFeeders.some(
          f => f.id === event.feederId && f.critical
        )
      );
      
      // Show fallback drawer if needed
      if (criticalFallback && !showFallback) {
        setShowFallback(true);
      }
      
      // Get all updated data
      const latestData = getCurrentData();
      setMitigationEvents(latestData.mitigationEvents);
      setChatLogs(latestData.chatLogs);
    }, 60000); // 1 minute interval
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Check for updates to chat and events more frequently
  useEffect(() => {
    const chatUpdateInterval = setInterval(() => {
      const data = getCurrentData();
      setChatLogs(data.chatLogs);
      setMitigationEvents(data.mitigationEvents);
    }, 5000); // 5 second interval
    
    return () => clearInterval(chatUpdateInterval);
  }, []);

  // Enhancing the feeder selection with error handling
  const safelySelectFeeder = (feeder: Feeder | null) => {
    try {
      if (feeder === null) {
        setSelectedFeeder(null);
        return;
      }
      
      // Validate feeder data before setting
      if (feeder && typeof feeder === 'object' && 'id' in feeder) {
        console.log('Setting selected feeder at page level:', feeder.name);
        setSelectedFeeder(feeder);
      } else {
        console.error('Invalid feeder data:', feeder);
      }
    } catch (error) {
      console.error('Error selecting feeder:', error);
      // Reset selection if there's an error
      setSelectedFeeder(null);
    }
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-slate-900 text-white">
      <Header />
      
      <div className="flex flex-1 gap-4 p-4 h-[calc(100vh-64px)]">
        {/* Left panel: Feeder summary and audit trail */}
        <div className="flex flex-col w-1/4 gap-4 h-full">
          {/* Panel tabs */}
          <div className="flex bg-slate-800 rounded-lg overflow-hidden">
            <button 
              className={`flex-1 py-2 text-sm font-medium transition-colors ${activeLeftPanel === 'feeder' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
              onClick={() => setActiveLeftPanel('feeder')}
            >
              Feeder Summary
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium transition-colors ${activeLeftPanel === 'audit' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
              onClick={() => setActiveLeftPanel('audit')}
            >
              Audit Trail
            </button>
          </div>
          
          {/* Conditional panel content */}
          <div className="flex-1 overflow-hidden">
            {activeLeftPanel === 'feeder' ? (
              <FeederSummary 
                feeders={feeders} 
                selectedFeeder={selectedFeeder}
                setSelectedFeeder={safelySelectFeeder}
              />
            ) : (
              <AuditTrail 
                mitigationEvents={mitigationEvents}
                feeders={feeders}
              />
            )}
          </div>
        </div>
        
        {/* Center panel: Interactive map */}
        <div className="flex-1 bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <MapErrorBoundary>
            <GridMap 
              feeders={feeders}
              derAssets={derAssets}
              mitigationEvents={mitigationEvents}
              onSelectFeeder={safelySelectFeeder}
              onSelectDer={setSelectedDer}
              selectedFeeder={selectedFeeder}
            />
          </MapErrorBoundary>
        </div>
        
        {/* Right panel: Agent chat */}
        <div className="w-1/4 h-full">
          <AgentChat 
            chatLogs={chatLogs} 
            selectedFeeder={selectedFeeder}
            mitigationEvents={mitigationEvents}
            setMitigationEvents={setMitigationEvents}
            setChatLogs={setChatLogs}
            onShowFallback={() => setShowFallback(true)}
          />
        </div>
      </div>
      
      {/* Fallback drawer (modal) */}
      {showFallback && (
        <FallbackDrawer 
          onClose={() => setShowFallback(false)}
          feeders={feeders.filter(f => f.critical)}
          mitigationEvents={mitigationEvents.filter(e => e.fallbackActivated)}
        />
      )}
    </main>
  );
} 