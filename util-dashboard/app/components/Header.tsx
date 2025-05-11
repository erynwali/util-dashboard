'use client';

import React, { useState } from 'react';

// Import SVG icons for sidebar menu items
const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const AuditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
  </svg>
);

const OperationsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

type PanelType = 'settings' | 'profile' | 'audit' | 'analytics' | 'operations' | null;

// Dummy panel components
const SettingsPanel = () => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">Interface Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Theme</label>
        <select className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
          <option>Dark</option>
          <option>Light</option>
          <option>System</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Map Style</label>
        <select className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
          <option>Satellite</option>
          <option>Street</option>
          <option>Terrain</option>
        </select>
      </div>
      <div>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" checked />
          <span>Enable animations</span>
        </label>
      </div>
      <div>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" checked />
          <span>Show tooltips</span>
        </label>
      </div>
    </div>
  </div>
);

const ProfilePanel = () => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">User Profile</h2>
    <div className="flex items-center mb-4">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">
        JS
      </div>
      <div>
        <p className="font-bold">John Smith</p>
        <p className="text-sm text-gray-400">Grid Operator</p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" value="john.smith@utility.com" readOnly />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" value="Senior Grid Operator" readOnly />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Login</label>
        <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" value="Today, 09:45 AM" readOnly />
      </div>
    </div>
  </div>
);

const AuditPanel = () => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
    <div className="space-y-3">
      <div className="bg-slate-700 p-3 rounded">
        <div className="flex justify-between">
          <span className="font-medium">Grid Update</span>
          <span className="text-xs text-gray-400">Today, 10:15 AM</span>
        </div>
        <p className="text-sm text-gray-300 mt-1">Added feeder control to Central Hub</p>
      </div>
      <div className="bg-slate-700 p-3 rounded">
        <div className="flex justify-between">
          <span className="font-medium">Config Change</span>
          <span className="text-xs text-gray-400">Today, 09:32 AM</span>
        </div>
        <p className="text-sm text-gray-300 mt-1">Updated fallback thresholds for North Grid</p>
      </div>
      <div className="bg-slate-700 p-3 rounded">
        <div className="flex justify-between">
          <span className="font-medium">Mitigation Action</span>
          <span className="text-xs text-gray-400">Yesterday, 03:45 PM</span>
        </div>
        <p className="text-sm text-gray-300 mt-1">Initiated load shedding for South Grid</p>
      </div>
      <div className="bg-slate-700 p-3 rounded">
        <div className="flex justify-between">
          <span className="font-medium">System Alert</span>
          <span className="text-xs text-gray-400">Yesterday, 02:18 PM</span>
        </div>
        <p className="text-sm text-gray-300 mt-1">Critical load warning threshold reached</p>
      </div>
    </div>
  </div>
);

const AnalyticsPanel = () => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
    <div className="space-y-4">
      <div className="bg-slate-700 p-3 rounded">
        <h3 className="font-medium mb-2">System Load</h3>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Current: 72%</span>
          <span>Peak: 93%</span>
        </div>
      </div>
      <div className="bg-slate-700 p-3 rounded">
        <h3 className="font-medium mb-2">DER Utilization</h3>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Current: 45%</span>
          <span>Available: 89%</span>
        </div>
      </div>
      <div className="bg-slate-700 p-3 rounded">
        <h3 className="font-medium mb-2">Mitigation Events (Last 7 Days)</h3>
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-lg font-bold">12</div>
            <div className="text-xs">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-500">9</div>
            <div className="text-xs">Success</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-500">2</div>
            <div className="text-xs">Fallback</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-500">1</div>
            <div className="text-xs">Failed</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OperationsPanel = () => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">Operation Controls</h2>
    <div className="space-y-4">
      <div className="bg-slate-700 p-3 rounded">
        <h3 className="font-medium mb-2">Manual Override</h3>
        <select className="w-full bg-slate-600 border border-slate-500 rounded-md p-2 mb-2">
          <option>Select Feeder</option>
          <option>North Grid Feeder</option>
          <option>Central Hub Feeder</option>
          <option>South Grid Feeder</option>
        </select>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-3 py-1 rounded">Load Shed</button>
          <button className="bg-yellow-600 text-white px-3 py-1 rounded">Reset</button>
          <button className="bg-red-600 text-white px-3 py-1 rounded">Emergency</button>
        </div>
      </div>
      <div className="bg-slate-700 p-3 rounded">
        <h3 className="font-medium mb-2">DER Control</h3>
        <div className="flex justify-between items-center mb-2">
          <span>Battery Discharge Rate</span>
          <span>65%</span>
        </div>
        <input type="range" className="w-full" value="65" />
      </div>
      <div className="bg-slate-700 p-3 rounded">
        <h3 className="font-medium mb-2">Emergency Contacts</h3>
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span>Control Center</span>
            <span>555-123-4567</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Field Operations</span>
            <span>555-789-0123</span>
          </div>
          <div className="flex justify-between">
            <span>Emergency Services</span>
            <span>911</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [showContentPanel, setShowContentPanel] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const togglePanel = (panel: PanelType) => {
    if (activePanel === panel) {
      setActivePanel(null);
      setShowContentPanel(false);
    } else {
      setActivePanel(panel);
      setShowContentPanel(true);
    }
  };

  // Get the panel content based on active panel
  const getPanelContent = () => {
    switch (activePanel) {
      case 'settings':
        return <SettingsPanel />;
      case 'profile':
        return <ProfilePanel />;
      case 'audit':
        return <AuditPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'operations':
        return <OperationsPanel />;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        {/* Hamburger menu button */}
        <button 
          className="mr-4 p-2 rounded-md hover:bg-slate-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h1 className="text-xl font-bold">Grid Management Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="font-bold">JS</span>
        </div>
      </div>

      {/* Side menu - Overlay with semi-transparent background */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        >
          {/* Actual menu panel that doesn't close when clicked */}
          <div 
            className="absolute left-0 top-16 h-[calc(100vh-64px)] flex bg-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu navigation */}
            <div className="w-64 border-r border-slate-700 overflow-auto">
              <div className="flex justify-between items-center p-4 border-b border-slate-700">
                <h3 className="font-bold">Menu</h3>
                <button 
                  className="p-1 rounded-md hover:bg-slate-700"
                  onClick={toggleMenu}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button 
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${activePanel === 'settings' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                      onClick={() => togglePanel('settings')}
                    >
                      <span className="flex items-center">
                        <SettingsIcon />
                        <span className="ml-3">Settings</span>
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${activePanel === 'settings' ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${activePanel === 'profile' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                      onClick={() => togglePanel('profile')}
                    >
                      <span className="flex items-center">
                        <ProfileIcon />
                        <span className="ml-3">Profile</span>
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${activePanel === 'profile' ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${activePanel === 'audit' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                      onClick={() => togglePanel('audit')}
                    >
                      <span className="flex items-center">
                        <AuditIcon />
                        <span className="ml-3">Audit Logs</span>
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${activePanel === 'audit' ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${activePanel === 'analytics' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                      onClick={() => togglePanel('analytics')}
                    >
                      <span className="flex items-center">
                        <AnalyticsIcon />
                        <span className="ml-3">Analytics</span>
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${activePanel === 'analytics' ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${activePanel === 'operations' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                      onClick={() => togglePanel('operations')}
                    >
                      <span className="flex items-center">
                        <OperationsIcon />
                        <span className="ml-3">Operation Controls</span>
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${activePanel === 'operations' ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Content panel */}
            {showContentPanel && (
              <div className="w-96 p-4 overflow-auto">
                {getPanelContent()}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 