'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Feeder, DerAsset, MitigationEvent } from '../data/dummyData';

interface GridMapProps {
  feeders: Feeder[];
  derAssets: DerAsset[];
  mitigationEvents: MitigationEvent[];
  onSelectFeeder: (feeder: Feeder) => void;
  onSelectDer: (der: DerAsset) => void;
}

const GridMap: React.FC<GridMapProps> = ({
  feeders,
  derAssets,
  mitigationEvents,
  onSelectFeeder,
  onSelectDer
}) => {
  // Fix for the Leaflet icon issue in Next.js
  useEffect(() => {
    // Only run this on the client side
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Create custom markers for feeders based on status
  const createFeederIcon = (feeder: Feeder) => {
    const hasFallback = mitigationEvents.some(
      event => event.feederId === feeder.id && 
               event.fallbackActivated && 
               event.status === 'active'
    );
    
    // If there's an active fallback, override with fallback color
    if (hasFallback) {
      return L.divIcon({
        className: 'marker-fallback',
        html: `<div class="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs">F</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    }
    
    // Otherwise, determine color based on load status
    let colorClass = 'marker-normal';
    const loadPercent = (feeder.currentLoad / feeder.capacity) * 100;
    
    if (feeder.critical) {
      colorClass = 'marker-critical';
    } else if (loadPercent >= 80) {
      colorClass = 'marker-warning';
    }
    
    return L.divIcon({
      className: colorClass,
      html: `<div class="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs">${Math.round(loadPercent)}%</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };
  
  // Create custom markers for DER assets based on type
  const createDerIcon = (der: DerAsset) => {
    let iconSymbol = '';
    
    switch (der.type) {
      case 'battery':
        iconSymbol = '🔋';
        break;
      case 'EV':
        iconSymbol = '🚗';
        break;
      case 'thermostat':
        iconSymbol = '🌡️';
        break;
      default:
        iconSymbol = '⚡';
    }
    
    return L.divIcon({
      html: `<div class="bg-blue-800 bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center">${iconSymbol}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <MapContainer 
      center={[37.7749, -122.4194]} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles-dark" // This class would apply a filter for dark mode
      />
      
      {/* Render feeder markers */}
      {feeders.map(feeder => (
        <Marker 
          key={feeder.id}
          position={feeder.coordinates}
          icon={createFeederIcon(feeder)}
          eventHandlers={{
            click: () => onSelectFeeder(feeder)
          }}
        >
          <Popup>
            <div className="text-slate-800">
              <div className="font-bold">{feeder.name}</div>
              <div>Region: {feeder.region}</div>
              <div>Current Load: {Math.round((feeder.currentLoad / feeder.capacity) * 100)}%</div>
              <div>Projected Load: {Math.round((feeder.projectedLoad / feeder.capacity) * 100)}%</div>
              <div>Breach Margin: {feeder.breachMargin.toFixed(1)}%</div>
              
              {feeder.critical && (
                <div className="text-red-600 font-bold mt-1">CRITICAL</div>
              )}
              
              {mitigationEvents.some(e => e.feederId === feeder.id && e.status === 'active') && (
                <div className="text-blue-600 font-bold mt-1">
                  Mitigation Active
                  {mitigationEvents.some(e => e.feederId === feeder.id && e.fallbackActivated) && (
                    ' (Fallback)'
                  )}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Render DER asset markers */}
      {derAssets.map(der => (
        <Marker 
          key={der.id}
          position={der.coordinates}
          icon={createDerIcon(der)}
          eventHandlers={{
            click: () => onSelectDer(der)
          }}
        >
          <Popup>
            <div className="text-slate-800">
              <div className="font-bold">{der.name}</div>
              <div>Type: {der.type}</div>
              <div>Availability: {der.availability}%</div>
              <div>Trust Score: {der.trustScore}</div>
              <div>Capacity: {der.capacity} units</div>
              
              {/* Show if this DER is being used in an active mitigation */}
              {mitigationEvents
                .filter(e => e.status === 'active' && e.actionSet.derIds.includes(der.id))
                .map(e => (
                  <div key={e.id} className="text-blue-600 font-bold mt-1">
                    Active in mitigation
                  </div>
                ))
              }
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Render active mitigation zones as circles */}
      {mitigationEvents
        .filter(event => event.status === 'active')
        .map(event => {
          const feeder = feeders.find(f => f.id === event.feederId);
          if (!feeder) return null;
          
          return (
            <Circle
              key={event.id}
              center={feeder.coordinates}
              radius={500}
              pathOptions={{
                color: event.fallbackActivated ? '#3b82f6' : '#22c55e',
                fillColor: event.fallbackActivated ? '#3b82f6' : '#22c55e',
                fillOpacity: 0.2
              }}
            />
          );
        })
      }
    </MapContainer>
  );
};

export default GridMap; 