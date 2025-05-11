'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatLog, Feeder, MitigationEvent } from '../data/dummyData';
import { activateMitigation, activateFallback, addOperatorChatMessage } from '../utils/simulation';

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
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white">
          Agent Chat
        </h2>
      </div>
      
      {/* Chat logs */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4">
        {chatLogs.map((chat) => (
          <div 
            key={chat.id}
            className={`flex flex-col ${chat.sender === 'agent' ? 'items-start' : 'items-end'}`}
          >
            <div className="flex items-center mb-1">
              <span className={`text-xs ${chat.sender === 'agent' ? 'text-blue-400' : 'text-green-400'}`}>
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
              <div className="mt-2 bg-slate-700 rounded-lg p-3 space-y-2 w-full">
                <div className="text-sm font-semibold text-white">Mitigation Options:</div>
                
                {chat.actionMetadata.options.map((option: any, index: number) => (
                  <div key={index} className="bg-slate-600 rounded p-2">
                    <div className="font-semibold text-sm">{option.name}</div>
                    <div className="text-xs text-gray-300">{option.description}</div>
                    <div className="text-xs text-gray-300">Load Reduction: {option.reduction}%</div>
                    
                    {/* Find pending mitigation event related to this feederId */}
                    {chat.actionMetadata?.feederId && (
                      <div className="flex gap-2 mt-2">
                        {mitigationEvents
                          .filter(e => 
                            e.feederId === chat.actionMetadata?.feederId && 
                            e.status === 'pending'
                          )
                          .map(event => (
                            <React.Fragment key={event.id}>
                              <button 
                                onClick={() => handleMitigationAction(event.id, 'proceed')}
                                className="bg-green-700 text-white text-xs py-1 px-2 rounded hover:bg-green-600"
                              >
                                Proceed
                              </button>
                              <button 
                                onClick={() => handleMitigationAction(event.id, 'simulate')}
                                className="bg-blue-700 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                              >
                                Simulate
                              </button>
                              <button 
                                onClick={() => handleMitigationAction(event.id, 'fallback')}
                                className="bg-yellow-700 text-white text-xs py-1 px-2 rounded hover:bg-yellow-600"
                              >
                                Activate Fallback
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
        ))}
        
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
            className="flex-1 bg-slate-700 border border-slate-600 rounded py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentChat; 