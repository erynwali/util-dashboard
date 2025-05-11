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
                {activePanel === 'settings' && (
                  <div className="mt-2 ml-6 pl-3 border-l border-slate-700 space-y-2">
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Interface Settings</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Notification Settings</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Map Settings</button>
                  </div>
                )}
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
                {activePanel === 'profile' && (
                  <div className="mt-2 ml-6 pl-3 border-l border-slate-700 space-y-2">
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Account Settings</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Preferences</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Security</button>
                  </div>
                )}
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
                {activePanel === 'audit' && (
                  <div className="mt-2 ml-6 pl-3 border-l border-slate-700 space-y-2">
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">System Events</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">User Actions</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Alerts</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Export Logs</button>
                  </div>
                )}
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
                {activePanel === 'analytics' && (
                  <div className="mt-2 ml-6 pl-3 border-l border-slate-700 space-y-2">
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Load Reports</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Efficiency Metrics</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">DER Performance</button>
                  </div>
                )}
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
                {activePanel === 'operations' && (
                  <div className="mt-2 ml-6 pl-3 border-l border-slate-700 space-y-2">
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Manual Controls</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Schedules</button>
                    <button className="w-full text-left py-1 px-2 text-sm rounded hover:bg-slate-700">Emergency Actions</button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 