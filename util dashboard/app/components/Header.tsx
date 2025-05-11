'use client';

import React from 'react';

const Header = () => {
  return (
    <header className="bg-slate-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-white mr-2">
            Grid Command Center
          </div>
          <span className="bg-green-600 text-xs px-2 py-1 rounded text-white">
            Operator Dashboard
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-sm text-gray-300">
            <span className="font-bold">Status:</span> Online
          </div>
          <div className="mr-4 text-sm text-gray-300">
            <span className="font-bold">Operator:</span> Sarah Chen
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            SC
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 