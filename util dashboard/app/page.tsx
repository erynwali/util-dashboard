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
  { ssr: false }
);

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

  return (
    <main className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Header />
      
      <div className="flex flex-1 p-4 gap-4 h-[calc(100vh-64px)]">
        {/* Left panel: Feeder summary and audit trail */}
        <div className="flex flex-col w-1/4 gap-4">
          <FeederSummary 
            feeders={feeders} 
            selectedFeeder={selectedFeeder}
            setSelectedFeeder={setSelectedFeeder}
          />
          <AuditTrail 
            mitigationEvents={mitigationEvents}
            feeders={feeders}
          />
        </div>
        
        {/* Center panel: Interactive map */}
        <div className="flex-1 bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <GridMap 
            feeders={feeders}
            derAssets={derAssets}
            mitigationEvents={mitigationEvents}
            onSelectFeeder={setSelectedFeeder}
            onSelectDer={setSelectedDer}
          />
        </div>
        
        {/* Right panel: Agent chat */}
        <div className="w-1/4">
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