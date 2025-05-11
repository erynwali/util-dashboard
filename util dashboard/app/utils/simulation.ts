import { v4 as uuidv4 } from 'uuid';
import { 
  Feeder, 
  DerAsset, 
  MitigationEvent, 
  ChatLog,
  dummyFeeders, 
  dummyDerAssets,
  dummyMitigationEvents,
  dummyChatLogs
} from '../data/dummyData';

let feeders = [...dummyFeeders];
let derAssets = [...dummyDerAssets];
let mitigationEvents = [...dummyMitigationEvents];
let chatLogs = [...dummyChatLogs];

/**
 * Simulates random load changes for all feeders
 */
export const updateFeederLoads = () => {
  feeders = feeders.map(feeder => {
    // Random fluctuation between -5% and +8%
    const fluctuation = (Math.random() * 13 - 5) / 100;
    let newCurrentLoad = Math.max(0, feeder.currentLoad * (1 + fluctuation));
    
    // Cap at 120% of capacity for simulation purposes
    newCurrentLoad = Math.min(newCurrentLoad, feeder.capacity * 1.2);
    
    // Project load trend for next 15 minutes
    const trendFactor = newCurrentLoad > feeder.currentLoad ? 1.05 : 0.97;
    const projectedLoad = Math.min(newCurrentLoad * trendFactor, feeder.capacity * 1.3);
    
    // Calculate breach margin (percentage below/above capacity)
    const breachMargin = ((feeder.capacity - projectedLoad) / feeder.capacity) * 100;
    
    // Mark as critical if projected to exceed 95% of capacity
    const critical = projectedLoad > feeder.capacity * 0.95;
    
    return {
      ...feeder,
      currentLoad: Number(newCurrentLoad.toFixed(1)),
      projectedLoad: Number(projectedLoad.toFixed(1)),
      breachMargin: Number(breachMargin.toFixed(1)),
      critical
    };
  });

  // Check for critical feeders that need mitigation
  const criticalFeeders = feeders.filter(f => 
    f.critical && 
    f.projectedLoad > f.capacity * 0.95 && 
    !mitigationEvents.some(e => e.feederId === f.id && e.status === 'active')
  );
  
  // Trigger mitigation logic for each critical feeder
  criticalFeeders.forEach(feeder => {
    triggerAgentMitigation(feeder);
  });

  return feeders;
};

/**
 * Simulates agent mitigation logic
 */
const triggerAgentMitigation = (criticalFeeder: Feeder) => {
  // Add an alert message to chat logs
  const alertMessage: ChatLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    sender: 'agent',
    message: `Alert: ${criticalFeeder.name} approaching capacity limit. Current load at ${Math.round((criticalFeeder.currentLoad / criticalFeeder.capacity) * 100)}%, projected to reach ${Math.round((criticalFeeder.projectedLoad / criticalFeeder.capacity) * 100)}% in 15 minutes.`,
    actionMetadata: {
      type: 'alert',
      feederId: criticalFeeder.id
    }
  };
  
  chatLogs = [...chatLogs, alertMessage];
  
  // Calculate potential mitigation options
  const availableDERs = derAssets.filter(der => der.availability > 60);
  
  // Sort by trust score and availability
  availableDERs.sort((a, b) => 
    (b.trustScore * b.availability) - (a.trustScore * a.availability)
  );
  
  // Generate three mitigation options
  const primaryOption = {
    name: 'Primary Option',
    description: `Activate ${availableDERs[0]?.name} and ${availableDERs[1]?.name}`,
    reduction: 10,
    derIds: [availableDERs[0]?.id, availableDERs[1]?.id].filter(Boolean)
  };
  
  const alternativeOption1 = {
    name: 'Alternative 1',
    description: `Activate ${availableDERs[2]?.name}`,
    reduction: 8,
    derIds: [availableDERs[2]?.id].filter(Boolean)
  };
  
  const alternativeOption2 = {
    name: 'Alternative 2',
    description: `Activate ${availableDERs[0]?.name} and ${availableDERs[3]?.name}`,
    reduction: 12,
    derIds: [availableDERs[0]?.id, availableDERs[3]?.id].filter(Boolean)
  };
  
  // Wait 3 seconds to simulate agent thinking
  setTimeout(() => {
    // Add recommendation message to chat logs
    const recommendationMessage: ChatLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      sender: 'agent',
      message: `I recommend ${primaryOption.description} to reduce load by ${primaryOption.reduction}%. Alternative options are available.`,
      actionMetadata: {
        type: 'recommendation',
        options: [primaryOption, alternativeOption1, alternativeOption2],
        feederId: criticalFeeder.id
      }
    };
    
    chatLogs = [...chatLogs, recommendationMessage];
    
    // Create a mitigation event 
    if (primaryOption.derIds.length > 0) {
      const newMitigationEvent: MitigationEvent = {
        id: uuidv4(),
        status: 'pending',
        timestamp: new Date().toISOString(),
        tier: 1,
        feederId: criticalFeeder.id,
        actionSet: {
          derIds: primaryOption.derIds,
          loadReduction: primaryOption.reduction,
          duration: 30
        },
        fallbackActivated: false,
        hashLog: generateHashLog()
      };
      
      mitigationEvents = [...mitigationEvents, newMitigationEvent];
    }
    
  }, 3000);
};

/**
 * Simulates the activation of a mitigation event
 */
export const activateMitigation = (mitigationId: string) => {
  mitigationEvents = mitigationEvents.map(event => {
    if (event.id === mitigationId) {
      return { ...event, status: 'active' };
    }
    return event;
  });
  
  // Add a message to chat logs
  const activationMessage: ChatLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    sender: 'agent',
    message: 'Mitigation activated. Monitoring feeder response.',
    actionMetadata: {
      type: 'action',
      feederId: mitigationEvents.find(e => e.id === mitigationId)?.feederId
    }
  };
  
  chatLogs = [...chatLogs, activationMessage];
  
  // Update feeder loads to reflect mitigation effect
  const event = mitigationEvents.find(e => e.id === mitigationId);
  if (event) {
    feeders = feeders.map(feeder => {
      if (feeder.id === event.feederId) {
        // Apply load reduction
        const loadReduction = feeder.currentLoad * (event.actionSet.loadReduction / 100);
        const newLoad = Math.max(0, feeder.currentLoad - loadReduction);
        const newProjectedLoad = Math.max(0, feeder.projectedLoad - loadReduction);
        
        // Recalculate breach margin
        const breachMargin = ((feeder.capacity - newProjectedLoad) / feeder.capacity) * 100;
        
        // Update critical status
        const critical = newProjectedLoad > feeder.capacity * 0.95;
        
        return {
          ...feeder,
          currentLoad: Number(newLoad.toFixed(1)),
          projectedLoad: Number(newProjectedLoad.toFixed(1)),
          breachMargin: Number(breachMargin.toFixed(1)),
          critical
        };
      }
      return feeder;
    });
  }
  
  return mitigationEvents;
};

/**
 * Simulates a mitigation event without actually activating it
 * Returns both the simulated feeders and mitigation events
 */
export const simulateMitigation = (mitigationId: string) => {
  const event = mitigationEvents.find(e => e.id === mitigationId);
  let simulatedFeeders = [...feeders];
  let simulatedDerAssets = [...derAssets];
  let simulatedEvents = [...mitigationEvents];
  
  if (event) {
    // Get the feeder that would be affected
    const affectedFeeder = feeders.find(f => f.id === event.feederId);
    
    if (affectedFeeder) {
      // Calculate potential load reduction
      const loadReduction = affectedFeeder.currentLoad * (event.actionSet.loadReduction / 100);
      const simulatedLoad = Math.max(0, affectedFeeder.currentLoad - loadReduction);
      const simulatedProjectedLoad = Math.max(0, affectedFeeder.projectedLoad - loadReduction);
      
      // Calculate new breach margin
      const breachMargin = ((affectedFeeder.capacity - simulatedProjectedLoad) / affectedFeeder.capacity) * 100;
      
      // Update the simulated event status temporarily for UI feedback
      simulatedEvents = simulatedEvents.map(e => {
        if (e.id === mitigationId) {
          return {
            ...e,
            status: 'simulated' // Custom status for simulation
          };
        }
        return e;
      });
      
      // Update the simulated DER assets to show them as active
      simulatedDerAssets = simulatedDerAssets.map(der => {
        if (event.actionSet.derIds.includes(der.id)) {
          return {
            ...der,
            availability: Math.max(0, der.availability - 15), // Simulate reduced availability
            simulationActive: true // Add a flag for visual indication
          };
        }
        return der;
      });
      
      // Create a temporary simulation message
      const simulationMessage: ChatLog = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        sender: 'agent',
        message: `Simulation results: Load would be reduced from ${affectedFeeder.currentLoad.toFixed(1)}kW (${Math.round((affectedFeeder.currentLoad/affectedFeeder.capacity)*100)}%) to ${simulatedLoad.toFixed(1)}kW (${Math.round((simulatedLoad/affectedFeeder.capacity)*100)}%). Breach margin would improve from ${affectedFeeder.breachMargin.toFixed(1)}% to ${breachMargin.toFixed(1)}%.`,
        actionMetadata: {
          type: 'action',
          feederId: event.feederId
        }
      };
      
      chatLogs = [...chatLogs, simulationMessage];
      
      // Apply temporary visual updates to show simulation results
      simulatedFeeders = feeders.map(feeder => {
        if (feeder.id === event.feederId) {
          // Determine if the simulation would resolve the critical state
          const wouldBeCritical = simulatedProjectedLoad > feeder.capacity * 0.95;
          
          return {
            ...feeder,
            currentLoad: Number(simulatedLoad.toFixed(1)),
            projectedLoad: Number(simulatedProjectedLoad.toFixed(1)),
            breachMargin: Number(breachMargin.toFixed(1)),
            critical: wouldBeCritical,
            simulationActive: true // Add a flag for visual indication
          };
        }
        return feeder;
      });
      
      // Create a follow-up recommendation message based on simulation results
      const recommendationMessage: ChatLog = {
        id: uuidv4(),
        timestamp: new Date(Date.now() + 1000).toISOString(),
        sender: 'agent',
        message: simulatedLoad < affectedFeeder.capacity * 0.8
          ? "Simulation indicates the proposed mitigation would effectively reduce load to a safe level. Recommend proceeding with mitigation."
          : "Simulation indicates the proposed mitigation would help but may not fully resolve the issue. Consider additional measures or the fallback option.",
        actionMetadata: {
          type: 'recommendation',
          feederId: event.feederId
        }
      };
      
      chatLogs = [...chatLogs, recommendationMessage];
    }
  }
  
  // Return temporary simulation results - original data won't be changed
  return {
    feeders: simulatedFeeders,
    mitigationEvents: simulatedEvents,
    derAssets: simulatedDerAssets,
    chatLogs 
  };
};

/**
 * Simulate feedback option
 */
export const simulateFeedback = (feedbackMessage: string) => {
  // Add user feedback to chat
  const userFeedback: ChatLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    sender: 'operator',
    message: feedbackMessage
  };
  
  // Add agent response to the feedback
  const agentResponse: ChatLog = {
    id: uuidv4(),
    timestamp: new Date(Date.now() + 2000).toISOString(),
    sender: 'agent',
    message: 'Thank you for your feedback. I will adjust future recommendations based on your input.'
  };
  
  chatLogs = [...chatLogs, userFeedback, agentResponse];
  return chatLogs;
};

/**
 * Simulates the activation of fallback tiers
 */
export const activateFallback = (mitigationId: string) => {
  mitigationEvents = mitigationEvents.map(event => {
    if (event.id === mitigationId) {
      return { 
        ...event, 
        status: 'active',
        fallbackActivated: true,
        tier: event.tier + 1
      };
    }
    return event;
  });
  
  // Add a message to chat logs
  const fallbackMessage: ChatLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    sender: 'agent',
    message: 'Fallback tier activated. Additional DER resources engaged. Monitoring grid stability.',
    actionMetadata: {
      type: 'action',
      feederId: mitigationEvents.find(e => e.id === mitigationId)?.feederId
    }
  };
  
  chatLogs = [...chatLogs, fallbackMessage];
  
  return mitigationEvents;
};

/**
 * Utility to generate a random hash log
 */
const generateHashLog = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Gets current data 
 */
export const getCurrentData = () => {
  return {
    feeders,
    derAssets,
    mitigationEvents,
    chatLogs
  };
};

/**
 * Add a chat message from the operator
 */
export const addOperatorChatMessage = (message: string) => {
  const newMessage: ChatLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    sender: 'operator',
    message
  };
  
  chatLogs = [...chatLogs, newMessage];
  return chatLogs;
}; 