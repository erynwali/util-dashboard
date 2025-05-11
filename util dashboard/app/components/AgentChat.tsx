'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatLog, Feeder, MitigationEvent } from '../data/dummyData';
import { 
  activateMitigation, 
  activateFallback, 
  addOperatorChatMessage,
  simulateMitigation,
  simulateFeedback
} from '../utils/simulation';

interface AgentChatProps {
  chatLogs: ChatLog[];
  selectedFeeder: Feeder | null;
  mitigationEvents: MitigationEvent[];
  setMitigationEvents: (events: MitigationEvent[]) => void;
  setChatLogs: (logs: ChatLog[]) => void;
  onShowFallback: () => void;
}

const AgentChat: React.FC<AgentChatProps> = ({
  chatLogs,
  selectedFeeder,
  mitigationEvents,
  setMitigationEvents,
  setChatLogs,
  onShowFallback
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  
  // Scroll to bottom whenever chat logs update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add operator message to chat
    const updatedLogs = addOperatorChatMessage(inputMessage);
    setChatLogs(updatedLogs);
    setInputMessage('');
    
    // Simulate agent "thinking"
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
    }, 2000);
  };
  
  // Handle mitigation actions
  const handleMitigationAction = (mitigationId: string, action: 'proceed' | 'simulate' | 'fallback') => {
    if (action === 'proceed') {
      const updatedEvents = activateMitigation(mitigationId);
      setMitigationEvents(updatedEvents);
    } else if (action === 'fallback') {
      const updatedEvents = activateFallback(mitigationId);
      setMitigationEvents(updatedEvents);
      onShowFallback();
    } else if (action === 'simulate') {
      // Simulate the mitigation event
      const simulationResult = simulateMitigation(mitigationId);
      setChatLogs(simulationResult.chatLogs);
      
      // Temporarily update the UI to show simulation results
      setMitigationEvents(simulationResult.mitigationEvents);
    }
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

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white">
          Agent Chat
        </h2>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>
      
      {/* Chat logs */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4">
        {chatLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-12 h-12 mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <p>No messages yet</p>
            <p className="text-xs mt-1">Start the conversation with Grid Agent</p>
          </div>
        ) : (
          chatLogs.map((chat) => (
            <div 
              key={chat.id}
              className={`flex flex-col ${chat.sender === 'agent' ? 'items-start' : 'items-end'} animate-fadeIn`}
            >
              <div className="flex items-center mb-1">
                <span className={`text-xs font-medium ${chat.sender === 'agent' ? 'text-blue-400' : 'text-green-400'}`}>
                  {chat.sender === 'agent' ? 'Grid Agent' : 'Operator'}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatTimestamp(chat.timestamp)}
                </span>
              </div>
              
              <div 
                className={`rounded-lg p-3 max-w-[85%] ${
                  chat.sender === 'agent' 
                    ? 'bg-slate-700 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {chat.message}
              </div>
              
              {/* Render action cards for agent recommendations */}
              {chat.sender === 'agent' && chat.actionMetadata?.type === 'recommendation' && chat.actionMetadata.options && (
                <div className="mt-2 bg-slate-700 bg-opacity-50 rounded-lg p-3 space-y-2 w-full">
                  <div className="text-sm font-medium text-white flex items-center">
                    <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Mitigation Options:
                  </div>
                  
                  {chat.actionMetadata.options.map((option: any, index: number) => (
                    <div key={index} className="bg-slate-700 rounded-md p-3 border border-slate-600">
                      <div className="font-medium text-sm">{option.name}</div>
                      <div className="text-xs text-gray-300 mt-1">{option.description}</div>
                      <div className="mt-2 mb-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Load Reduction</span>
                          <span className="text-green-400">{option.reduction}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${option.reduction}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Find pending mitigation event related to this feederId */}
                      {chat.actionMetadata?.feederId && (
                        <div className="flex gap-2 mt-3">
                          {mitigationEvents
                            .filter(e => 
                              e.feederId === chat.actionMetadata?.feederId && 
                              e.status === 'pending'
                            )
                            .map(event => (
                              <React.Fragment key={event.id}>
                                <button 
                                  onClick={() => handleMitigationAction(event.id, 'proceed')}
                                  className="bg-green-600 text-white text-xs py-1.5 px-3 rounded hover:bg-green-500 transition-colors flex-1 flex items-center justify-center"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Proceed
                                </button>
                                <button 
                                  onClick={() => handleMitigationAction(event.id, 'simulate')}
                                  className="bg-blue-600 text-white text-xs py-1.5 px-3 rounded hover:bg-blue-500 transition-colors flex-1 flex items-center justify-center"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                  Simulate
                                </button>
                                <button 
                                  onClick={() => handleMitigationAction(event.id, 'fallback')}
                                  className="bg-amber-600 text-white text-xs py-1.5 px-3 rounded hover:bg-amber-500 transition-colors flex-1 flex items-center justify-center"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                  </svg>
                                  Fallback
                                </button>
                              </React.Fragment>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        
        {/* Agent thinking indicator */}
        {isThinking && (
          <div className="flex items-start">
            <div className="bg-slate-700 text-white rounded-lg p-3 max-w-[85%]">
              <div className="flex items-center">
                <span className="mr-2">Thinking</span>
                <span className="flex">
                  <span className="animate-bounce mr-1">.</span>
                  <span className="animate-bounce animation-delay-200 mr-1">.</span>
                  <span className="animate-bounce animation-delay-400">.</span>
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Auto-scroll reference */}
        <div ref={chatEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2a1 1 0 00.894-.553l7-14a1 1 0 00-1.169-1.409l-5 1.429A1 1 0 0013 4.429V9h-2a1 1 0 00-.894.553z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentChat; 