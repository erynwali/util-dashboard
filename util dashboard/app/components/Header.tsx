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

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel);
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

      {/* Side menu */}
      {isMenuOpen && (
        <div className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-slate-800 border-r border-slate-700 z-40 transition-all duration-300 ease-in-out">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button 
                  className={`w-full flex items-center px-4 py-2 rounded-md ${activePanel === 'settings' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                  onClick={() => togglePanel('settings')}
                >
                  <SettingsIcon />
                  <span className="ml-3">Settings</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full flex items-center px-4 py-2 rounded-md ${activePanel === 'profile' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                  onClick={() => togglePanel('profile')}
                >
                  <ProfileIcon />
                  <span className="ml-3">Profile</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full flex items-center px-4 py-2 rounded-md ${activePanel === 'audit' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                  onClick={() => togglePanel('audit')}
                >
                  <AuditIcon />
                  <span className="ml-3">Audit Logs</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full flex items-center px-4 py-2 rounded-md ${activePanel === 'analytics' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                  onClick={() => togglePanel('analytics')}
                >
                  <AnalyticsIcon />
                  <span className="ml-3">Analytics</span>
                </button>
              </li>
              <li>
                <button 
                  className={`w-full flex items-center px-4 py-2 rounded-md ${activePanel === 'operations' ? 'bg-blue-700' : 'hover:bg-slate-700'}`}
                  onClick={() => togglePanel('operations')}
                >
                  <OperationsIcon />
                  <span className="ml-3">Operation Controls</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Settings Panel */}
      {activePanel === 'settings' && (
        <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-slate-900 border-l border-slate-700 z-30 overflow-y-auto scrollbar-thin p-4">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Theme</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-slate-800 rounded-md">Dark</button>
                <button className="px-3 py-2 bg-slate-700 rounded-md">Light</button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center">
                <input type="checkbox" id="pushNotifications" className="mr-2" />
                <label htmlFor="pushNotifications">Push Notifications</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="emailAlerts" className="mr-2" />
                <label htmlFor="emailAlerts">Email Alerts</label>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Map Settings</h3>
              <div className="flex items-center">
                <input type="checkbox" id="showLabels" className="mr-2" />
                <label htmlFor="showLabels">Show Labels</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="animateIcons" className="mr-2" />
                <label htmlFor="animateIcons">Animate Icons</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Panel */}
      {activePanel === 'profile' && (
        <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-slate-900 border-l border-slate-700 z-30 overflow-y-auto scrollbar-thin p-4">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">JS</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">John Smith</h3>
              <p className="text-slate-400">Grid Operator</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-slate-400">Email</h4>
              <p>john.smith@utility.com</p>
            </div>
            <div>
              <h4 className="text-sm text-slate-400">Phone</h4>
              <p>(555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-sm text-slate-400">Location</h4>
              <p>Central Control Facility</p>
            </div>
            <div>
              <h4 className="text-sm text-slate-400">Access Level</h4>
              <p>Level 3 (Administrator)</p>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Panel */}
      {activePanel === 'audit' && (
        <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-slate-900 border-l border-slate-700 z-30 overflow-y-auto scrollbar-thin p-4">
          <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-3 bg-slate-800 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">{new Date(Date.now() - i * 3600000).toLocaleTimeString()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${i % 3 === 0 ? 'bg-blue-600' : i % 3 === 1 ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {i % 3 === 0 ? 'System' : i % 3 === 1 ? 'User' : 'Alert'}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {i % 3 === 0 ? 'System performed automated load balancing.' : 
                   i % 3 === 1 ? 'User approved mitigation action for Feeder #2.' : 
                   'Alert triggered for critical load threshold on East Grid.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Panel */}
      {activePanel === 'analytics' && (
        <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-slate-900 border-l border-slate-700 z-30 overflow-y-auto scrollbar-thin p-4">
          <h2 className="text-xl font-bold mb-4">Analytics</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Load Patterns</h3>
              <div className="h-40 bg-slate-800 rounded-md flex items-end p-2 space-x-1">
                {[40, 35, 60, 75, 65, 80, 90, 85, 70, 60, 55, 65].map((height, i) => (
                  <div 
                    key={i} 
                    className="bg-blue-600 w-full rounded-t-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="text-sm text-center mt-1">Last 12 hours</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">DER Reliability</h3>
              <div className="flex items-center justify-between bg-slate-800 rounded-md p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">95%</div>
                  <div className="text-xs">Batteries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">78%</div>
                  <div className="text-xs">EVs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">88%</div>
                  <div className="text-xs">Thermostats</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Mitigation Statistics</h3>
              <div className="bg-slate-800 rounded-md p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total Events:</span>
                  <span>24</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful:</span>
                  <span className="text-green-500">21</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed:</span>
                  <span className="text-red-500">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Response:</span>
                  <span>1.2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operation Controls Panel */}
      {activePanel === 'operations' && (
        <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-slate-900 border-l border-slate-700 z-30 overflow-y-auto scrollbar-thin p-4">
          <h2 className="text-xl font-bold mb-4">Operation Controls</h2>
          <div className="space-y-4">
            <div className="bg-slate-800 p-3 rounded-md">
              <h3 className="font-semibold">Emergency Load Shed</h3>
              <p className="text-sm text-slate-400 mb-2">Activate emergency protocols for immediate load reduction</p>
              <div className="flex items-center space-x-2">
                <select className="bg-slate-700 rounded-md px-2 py-1 text-sm">
                  <option>Tier 1 (5%)</option>
                  <option>Tier 2 (10%)</option>
                  <option>Tier 3 (20%)</option>
                </select>
                <button className="bg-red-600 px-3 py-1 rounded-md text-sm">Activate</button>
              </div>
            </div>
            
            <div className="bg-slate-800 p-3 rounded-md">
              <h3 className="font-semibold">DER Control</h3>
              <p className="text-sm text-slate-400 mb-2">Manage distributed energy resources</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Battery Discharge</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <span>EV Charging Pause</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <span>Thermostat Adjust</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 p-3 rounded-md">
              <h3 className="font-semibold">Grid Configuration</h3>
              <p className="text-sm text-slate-400 mb-2">Adjust grid topology and settings</p>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 px-3 py-1 rounded-md text-sm">Reconfigure Mesh Network</button>
                <button className="w-full bg-slate-700 px-3 py-1 rounded-md text-sm">Run Diagnostics</button>
                <button className="w-full bg-slate-700 px-3 py-1 rounded-md text-sm">Grid Health Check</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 