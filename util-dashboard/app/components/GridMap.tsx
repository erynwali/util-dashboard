'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Feeder, DerAsset, MitigationEvent } from '../data/dummyData';

interface GridMapProps {
  feeders: Feeder[];
  derAssets: DerAsset[];
  mitigationEvents: MitigationEvent[];
  onSelectFeeder: (feeder: Feeder) => void;
  onSelectDer: (der: DerAsset) => void;
  selectedFeeder: Feeder | null;
}

// Map filter options
export type MapFilterType = 'all' | 'feeders' | 'ders' | 'households';

// Custom tooltip component that follows map coordinates
const MapTooltip = ({ content, position, map }: { content: React.ReactNode, position: [number, number], map: any }) => {
  const [pixelPosition, setPixelPosition] = useState<{ x: number, y: number } | null>(null);
  
  useEffect(() => {
    if (map && position) {
      // Convert the geographic coordinates to pixel coordinates
      const updatePosition = () => {
        const point = map.latLngToContainerPoint(L.latLng(position[0], position[1]));
        setPixelPosition({ x: point.x, y: point.y });
      };
      
      // Initial position
      updatePosition();
      
      // Update position when map moves
      map.on('move', updatePosition);
      map.on('zoom', updatePosition);
      
      return () => {
        map.off('move', updatePosition);
        map.off('zoom', updatePosition);
      };
    }
  }, [map, position]);
  
  if (!pixelPosition) return null;
  
  return (
    <div 
      className="absolute z-[1000] bg-slate-800 p-2 rounded-md shadow-lg pointer-events-none" 
      style={{
        left: pixelPosition.x + 'px',
        top: (pixelPosition.y - 10) + 'px',
        transform: 'translate(-50%, -100%)'
      }}
    >
      {content}
    </div>
  );
};

// MapController to access map instance
const MapController = ({ onMapReady }: { onMapReady: (map: any) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
    
    const updateOnMapChange = () => {
      // Force a re-render of tooltip positions
      map.fire('move');
    };
    
    // Add event listeners for map movements
    map.on('zoom', updateOnMapChange);
    map.on('move', updateOnMapChange);
    
    return () => {
      // Clean up event listeners
      map.off('zoom', updateOnMapChange);
      map.off('move', updateOnMapChange);
    };
  }, [map, onMapReady]);
  
  return null;
};

// Simple fallback component when map fails to load
const GridMapFallback = () => (
  <div className="h-full w-full flex items-center justify-center bg-slate-800">
    <div className="text-center p-6">
      <div className="text-red-500 text-xl mb-2">Map loading error</div>
      <p className="text-gray-300 mb-4">There was a problem loading the map interface.</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Reload page
      </button>
    </div>
  </div>
);

// Simple error boundary class component
class MapErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }> {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Map error boundary caught error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

const GridMap: React.FC<GridMapProps> = ({
  feeders,
  derAssets,
  mitigationEvents,
  onSelectFeeder,
  onSelectDer,
  selectedFeeder
}) => {
  const [mapFilter, setMapFilter] = useState<MapFilterType>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPos, setTooltipPos] = useState<[number, number]>([0, 0]);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  
  // New state to track the active feeder filter
  const [activeFeederFilter, setActiveFeederFilter] = useState<string | null>(null);

  // Effect to update selectedItem when selectedFeeder changes from outside
  useEffect(() => {
    if (selectedFeeder && selectedFeeder.id) {
      try {
        // Always update selectedItem and activeFeederFilter when selectedFeeder changes
        setSelectedItem(selectedFeeder);
        setActiveFeederFilter(selectedFeeder.id);
        
        // Ensure coordinates are valid before trying to fly to them
        if (selectedFeeder.coordinates && 
            Array.isArray(selectedFeeder.coordinates) && 
            selectedFeeder.coordinates.length === 2) {
          safelyFlyToLocation(selectedFeeder.coordinates);
        }
      } catch (error) {
        console.error("Error handling selectedFeeder change:", error);
      }
    }
  }, [selectedFeeder, mapInstance]);

  // Function to clear all filters
  const clearFilters = () => {
    setActiveFeederFilter(null);
    setSelectedItem(null);
  };

  // Function to determine if an item should be displayed based on current filters
  const shouldShowItem = (item: any, type: 'feeder' | 'der' | 'household') => {
    // If no feeder filter is active, show all items based on map filter
    if (!activeFeederFilter) {
      return mapFilter === 'all' || 
        (type === 'feeder' && mapFilter === 'feeders') ||
        (type === 'der' && mapFilter === 'ders') ||
        (type === 'household' && mapFilter === 'households');
    }
    
    // If a feeder filter is active
    if (type === 'feeder') {
      // Only show the active feeder
      return item.id === activeFeederFilter;
    } else if (type === 'der') {
      // Always show DERs when they're part of the filtered feeder's mitigation events
      const feederEvents = mitigationEvents.filter(e => e.feederId === activeFeederFilter);
      const eventDerIds = feederEvents.flatMap(e => e.actionSet.derIds);
      
      // When filter is 'all' or 'ders', show DERs connected to the active feeder
      return (mapFilter === 'all' || mapFilter === 'ders') && eventDerIds.includes(item.id);
    } else if (type === 'household') {
      // Always show households connected to the active feeder
      // When filter is 'all' or 'households', show households connected to the active feeder
      return (mapFilter === 'all' || mapFilter === 'households') && item.feederId === activeFeederFilter;
    }
    
    return false;
  };

  // Dark mode style URL
  const darkModeUrl = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
  const attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

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

  // Handle hover events for map items
  const handleItemHover = (item: any, coordinates: [number, number], content: React.ReactNode) => {
    setTooltipContent(content);
    setTooltipPos(coordinates);
    setShowTooltip(true);
  };

  // Handle item leave (mouse out)
  const handleItemLeave = (e: any) => {
    setShowTooltip(false);
  };

  // Create custom markers for feeders based on status
  const createFeederIcon = (feeder: Feeder) => {
    if (!feeder) return L.divIcon({ className: 'bg-gray-500 rounded-full shadow-lg' });
    
    const hasFallback = mitigationEvents?.some(
      event => event?.feederId === feeder.id && 
               event?.fallbackActivated && 
               event?.status === 'active'
    ) || false;
    
    const hasSimulation = feeder.simulationActive || false;
    
    // Check if this feeder is selected
    const isSelected = selectedFeeder && selectedFeeder.id === feeder.id;
    
    // If there's an active fallback, override with fallback color
    if (hasFallback) {
      return L.divIcon({
        className: `bg-blue-500 rounded-full shadow-lg ${isSelected ? 'ring-4 ring-white' : ''}`,
        html: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0110 2v5.8h5a1 1 0 01.5 1.8l-9 7A1 1 0 015 15.8V10H2a1 1 0 01-.5-1.8l9-7z" clip-rule="evenodd" />
                </svg>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    }
    
    // If it's part of a simulation, show with a different visual
    if (hasSimulation) {
      return L.divIcon({
        className: `bg-purple-600 rounded-full shadow-lg simulation-pulse ${isSelected ? 'ring-4 ring-white' : ''}`,
        html: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    }
    
    // Otherwise, determine color based on load status
    let bgColorClass = 'bg-green-600';
    let pulseClass = '';
    const loadPercent = (feeder.currentLoad / feeder.capacity) * 100;
    
    if (feeder.critical) {
      bgColorClass = 'bg-red-600';
      pulseClass = 'pulse-critical';
    } else if (loadPercent >= 80) {
      bgColorClass = 'bg-yellow-400';
    }
    
    return L.divIcon({
      className: `${bgColorClass} rounded-full shadow-lg ${pulseClass} ${isSelected ? 'ring-4 ring-white' : ''}`,
      html: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };
  
  // Create custom markers for DER assets based on type
  const createDerIcon = (der: DerAsset) => {
    let iconSvg = '';
    let backgroundClass = 'bg-indigo-600';
    
    // Check if DER is part of a simulation
    if (der.simulationActive) {
      backgroundClass = 'bg-purple-600 simulation-pulse';
    }
    
    switch (der.type) {
      case 'battery':
        iconSvg = '<path d="M17 7H3a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1V8a1 1 0 00-1-1zm-1 8H4V9h12v6z"></path><path d="M7 11H5v2h2v-2z"></path>';
        break;
      case 'EV':
        iconSvg = '<path d="M8 3.5h4v2H8v-2zM6 8V7h8v1h-8zM16 5h-2.276C13.398 3.826 12.298 3 11 3H9c-1.298 0-2.398.826-2.724 2H4a1 1 0 00-1 1v9a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1zm-1 9H5V7h10v7z"></path><circle cx="6.5" cy="12.5" r="1.5"></circle><circle cx="13.5" cy="12.5" r="1.5"></circle>';
        break;
      case 'thermostat':
        iconSvg = '<path d="M10 2a6 6 0 00-6 6c0 1.886.874 3.58 2.24 4.684a3.99 3.99 0 001.76.822V8a1 1 0 012 0v5.506a3.989 3.989 0 001.76-.822A6.003 6.003 0 0010 2z"></path><path d="M8 15h4v1a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1z"></path>';
        break;
      default:
        iconSvg = '<path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path>';
    }
    
    return L.divIcon({
      className: `${backgroundClass} bg-opacity-90 rounded-full shadow-lg`,
      html: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                ${iconSvg}
              </svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  // Create household markers
  const createHouseholdIcon = () => {
    return L.divIcon({
      className: 'bg-gray-600 bg-opacity-80 rounded-full shadow-lg',
      html: `<div class="w-6 h-6 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Generate households for each feeder
  const generateHouseholds = () => {
    const households: { id: string; feederId: string; coordinates: [number, number]; derCount: number }[] = [];
    
    feeders.forEach(feeder => {
      // Generate 3-5 households per feeder (reduced from 10-20)
      const householdCount = Math.floor(Math.random() * 3) + 3; // 3-5
      
      for (let i = 0; i < householdCount; i++) {
        // Generate random coordinates close to the feeder
        const lat = feeder.coordinates[0] + (Math.random() - 0.5) * 0.02;
        const lng = feeder.coordinates[1] + (Math.random() - 0.5) * 0.02;
        
        // Randomize DER count per household (2-3 instead of 3-5)
        const derCount = Math.floor(Math.random() * 2) + 2; // 2-3
        
        households.push({
          id: `household-${feeder.id}-${i}`,
          feederId: feeder.id,
          coordinates: [lat, lng],
          derCount
        });
      }
    });
    
    return households;
  };

  // Memoize the generated households to prevent regeneration on every render
  const [households] = useState(() => generateHouseholds());

  // Handle feeder selection
  const handleFeederSelect = (feeder: Feeder) => {
    if (!feeder || !feeder.id) return;
    
    try {
      setSelectedItem(feeder);
      setActiveFeederFilter(feeder.id);
      onSelectFeeder(feeder);
      
      // Ensure coordinates are valid before trying to fly to them
      if (feeder.coordinates && 
          Array.isArray(feeder.coordinates) && 
          feeder.coordinates.length === 2) {
        safelyFlyToLocation(feeder.coordinates);
      }
    } catch (error) {
      console.error("Error handling feeder selection:", error);
    }
  };

  // Wrap map operations in try-catch
  const safelyFlyToLocation = (coordinates: [number, number]) => {
    if (!mapInstance) return;
    
    try {
      // Make sure coordinates are valid numbers
      const lat = parseFloat(String(coordinates[0]));
      const lng = parseFloat(String(coordinates[1]));
      
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstance.flyTo([lat, lng], 14, {
          animate: true,
          duration: 1
        });
      }
    } catch (error) {
      console.error("Error flying to location:", error);
    }
  };

  return (
    <div className="relative h-full w-full">
      <MapErrorBoundary fallback={<GridMapFallback />}>
        <MapContainer 
          center={[37.7749, -122.4194]} 
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 10 }}
          zoomControl={false}
          whenCreated={(map) => {
            setMapInstance(map);
          }}
        >
          <MapController onMapReady={(map) => {
            setMapInstance(map);
            try {
              // Initialize map event handlers
              map.on('error', (e) => {
                console.error("Leaflet map error:", e);
                setMapError(true);
              });
            } catch (e) {
              console.error("Error setting up map controller:", e);
              setMapError(true);
            }
          }} />
          <TileLayer
            attribution={attribution}
            url={darkModeUrl}
          />
          
          {/* Render feeder markers if filter allows */}
          {feeders.filter(feeder => shouldShowItem(feeder, 'feeder')).map(feeder => {
            // Skip rendering if coordinates are invalid
            if (!feeder.coordinates || 
                !Array.isArray(feeder.coordinates) || 
                feeder.coordinates.length !== 2 ||
                isNaN(parseFloat(String(feeder.coordinates[0]))) ||
                isNaN(parseFloat(String(feeder.coordinates[1])))) {
              return null;
            }
            
            return (
              <Marker 
                key={feeder.id}
                position={feeder.coordinates}
                icon={createFeederIcon(feeder)}
                eventHandlers={{
                  click: () => handleFeederSelect(feeder),
                  mouseover: (e) => handleItemHover(
                    feeder, 
                    feeder.coordinates, 
                    <div className="text-sm">
                      <div className="font-bold">{feeder.name}</div>
                      <div>Load: {Math.round((feeder.currentLoad / feeder.capacity) * 100)}%</div>
                      <div>Status: {feeder.critical ? 'Critical' : feeder.breachMargin < 10 ? 'Warning' : 'Normal'}</div>
                    </div>
                  ),
                  mouseout: handleItemLeave
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
            );
          })}
          
          {/* Render DER asset markers if filter allows */}
          {derAssets.filter(der => shouldShowItem(der, 'der')).map(der => {
            // Skip rendering if coordinates are invalid
            if (!der.coordinates || 
                !Array.isArray(der.coordinates) || 
                der.coordinates.length !== 2 ||
                isNaN(parseFloat(String(der.coordinates[0]))) ||
                isNaN(parseFloat(String(der.coordinates[1])))) {
              return null;
            }
            
            return (
              <Marker 
                key={der.id}
                position={der.coordinates}
                icon={createDerIcon(der)}
                eventHandlers={{
                  click: () => onSelectDer(der),
                  mouseover: (e: any) => handleItemHover(der, [e.target._latlng.lat, e.target._latlng.lng], (
                    <div className="bg-slate-800 p-2 rounded-md shadow-lg">
                      <div className="font-bold text-white">{der.name}</div>
                      <div className="text-gray-300">Type: {der.type}</div>
                    </div>
                  )),
                  mouseout: handleItemLeave
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
            );
          })}
          
          {/* Render household markers if filter allows */}
          {households.filter(household => shouldShowItem(household, 'household')).map(household => {
            // Skip rendering if coordinates are invalid
            if (!household.coordinates || 
                !Array.isArray(household.coordinates) || 
                household.coordinates.length !== 2 ||
                isNaN(parseFloat(String(household.coordinates[0]))) ||
                isNaN(parseFloat(String(household.coordinates[1])))) {
              return null;
            }
            
            return (
              <Marker
                key={household.id}
                position={household.coordinates}
                icon={createHouseholdIcon()}
                eventHandlers={{
                  mouseover: (e: any) => handleItemHover(household, [e.target._latlng.lat, e.target._latlng.lng], (
                    <div className="bg-slate-800 p-2 rounded-md shadow-lg">
                      <div className="font-bold text-white">Household</div>
                      <div className="text-gray-300">DER Count: {household.derCount}</div>
                    </div>
                  )),
                  mouseout: handleItemLeave
                }}
              >
                <Popup>
                  <div className="text-slate-800">
                    <div className="font-bold">Household</div>
                    <div>Connected to: {feeders.find((f: Feeder) => f.id === household.feederId)?.name}</div>
                    <div>DER Count: {household.derCount}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* Render active mitigation zones as circles */}
          {mitigationEvents
            .filter(event => event.status === 'active')
            .map(event => {
              const feeder = feeders.find((f: Feeder) => f.id === event.feederId);
              
              // Skip rendering if feeder or its coordinates are invalid
              if (!feeder || 
                  !feeder.coordinates || 
                  !Array.isArray(feeder.coordinates) || 
                  feeder.coordinates.length !== 2 ||
                  isNaN(parseFloat(String(feeder.coordinates[0]))) ||
                  isNaN(parseFloat(String(feeder.coordinates[1])))) {
                return null;
              }
              
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
      </MapErrorBoundary>

      {/* Map filter controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-800 bg-opacity-80 p-2 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-2">
          <button 
            className={`px-3 py-1 rounded-md text-sm font-medium ${mapFilter === 'all' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => {
              setMapFilter('all');
              clearFilters();
            }}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm font-medium ${mapFilter === 'feeders' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => {
              setMapFilter('feeders');
              clearFilters();
            }}
          >
            Feeders
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm font-medium ${mapFilter === 'households' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => {
              setMapFilter('households');
              clearFilters();
            }}
          >
            Households
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm font-medium ${mapFilter === 'ders' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={() => {
              setMapFilter('ders');
              clearFilters();
            }}
          >
            DERs
          </button>
          
          {activeFeederFilter && (
            <button 
              className="px-3 py-1 mt-4 rounded-md text-sm font-medium bg-red-600 hover:bg-red-500"
              onClick={clearFilters}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Map tooltip */}
      {showTooltip && tooltipContent && mapInstance && (
        <MapTooltip 
          content={tooltipContent}
          position={tooltipPos}
          map={mapInstance}
        />
      )}
    </div>
  );
};

export default GridMap; 