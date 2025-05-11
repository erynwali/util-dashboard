// Data models for the grid dashboard

// Feeder data
export interface Feeder {
  id: string;
  name: string;
  region: string;
  capacity: number;
  currentLoad: number;
  projectedLoad: number;
  breachMargin: number;
  critical: boolean;
  coordinates: [number, number]; // [lat, lng]
  simulationActive?: boolean; // For simulation visualization
}

// DER (Distributed Energy Resource) assets
export interface DerAsset {
  id: string;
  type: 'battery' | 'EV' | 'thermostat';
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  availability: number; // percentage
  trustScore: number; // 0-100
  capacity: number;
  simulationActive?: boolean; // For simulation visualization
}

// Mitigation events
export interface MitigationEvent {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'simulated';
  timestamp: string;
  tier: number;
  feederId: string;
  actionSet: {
    derIds: string[];
    loadReduction: number;
    duration: number;
  };
  fallbackActivated: boolean;
  hashLog: string;
}

// Chat logs
export interface ChatLog {
  id: string;
  timestamp: string;
  sender: 'agent' | 'operator';
  message: string;
  actionMetadata?: {
    type: 'recommendation' | 'action' | 'alert';
    options?: any[];
    feederId?: string;
  };
}

// Fallback tiers
export interface FallbackTier {
  tier: number;
  options: string[];
  readinessStatus: 'ready' | 'partial' | 'unavailable';
  participationRate: number;
  consentCompliance: boolean;
}

// Dummy data
export const dummyFeeders: Feeder[] = [
  {
    id: 'feeder-1',
    name: 'North Grid Feeder',
    region: 'North',
    capacity: 100,
    currentLoad: 75,
    projectedLoad: 85,
    breachMargin: 15,
    critical: false,
    coordinates: [37.7749, -122.4194]
  },
  {
    id: 'feeder-2',
    name: 'Central Hub Feeder',
    region: 'Central',
    capacity: 120,
    currentLoad: 110,
    projectedLoad: 118,
    breachMargin: 2,
    critical: true,
    coordinates: [37.7848, -122.4294]
  },
  {
    id: 'feeder-3',
    name: 'South Grid Feeder',
    region: 'South',
    capacity: 80,
    currentLoad: 60,
    projectedLoad: 78,
    breachMargin: 2.5,
    critical: false,
    coordinates: [37.7648, -122.4094]
  },
  {
    id: 'feeder-4',
    name: 'East Grid Feeder',
    region: 'East',
    capacity: 90,
    currentLoad: 45,
    projectedLoad: 60,
    breachMargin: 33.3,
    critical: false,
    coordinates: [37.7749, -122.4094]
  },
  {
    id: 'feeder-5',
    name: 'Marina District Feeder',
    region: 'North',
    capacity: 85,
    currentLoad: 72,
    projectedLoad: 80,
    breachMargin: 5.9,
    critical: false,
    coordinates: [37.8030, -122.4350]
  },
  {
    id: 'feeder-6',
    name: 'Mission District Feeder',
    region: 'Central',
    capacity: 110,
    currentLoad: 95,
    projectedLoad: 107,
    breachMargin: 2.7,
    critical: true,
    coordinates: [37.7590, -122.4150]
  },
  {
    id: 'feeder-7',
    name: 'Richmond District Feeder',
    region: 'West',
    capacity: 95,
    currentLoad: 60,
    projectedLoad: 72,
    breachMargin: 24.2,
    critical: false,
    coordinates: [37.7800, -122.4850]
  },
  {
    id: 'feeder-8',
    name: 'Sunset District Feeder',
    region: 'West',
    capacity: 80,
    currentLoad: 65,
    projectedLoad: 70,
    breachMargin: 12.5,
    critical: false,
    coordinates: [37.7550, -122.4850]
  },
  {
    id: 'feeder-9',
    name: 'SoMa District Feeder',
    region: 'Central',
    capacity: 130,
    currentLoad: 115,
    projectedLoad: 125,
    breachMargin: 3.8,
    critical: true,
    coordinates: [37.7790, -122.3970]
  },
  {
    id: 'feeder-10',
    name: 'Bayview District Feeder',
    region: 'South',
    capacity: 75,
    currentLoad: 50,
    projectedLoad: 65,
    breachMargin: 13.3,
    critical: false,
    coordinates: [37.7350, -122.3890]
  }
];

export const dummyDerAssets: DerAsset[] = [
  {
    id: 'der-1',
    type: 'battery',
    name: 'Community Battery 1',
    location: 'North District',
    coordinates: [37.7759, -122.4184],
    availability: 90,
    trustScore: 95,
    capacity: 20
  },
  {
    id: 'der-2',
    type: 'EV',
    name: 'Fleet EV Station',
    location: 'Central District',
    coordinates: [37.7838, -122.4284],
    availability: 75,
    trustScore: 85,
    capacity: 15
  },
  {
    id: 'der-3',
    type: 'thermostat',
    name: 'Office Building Thermostats',
    location: 'South District',
    coordinates: [37.7638, -122.4084],
    availability: 100,
    trustScore: 90,
    capacity: 10
  },
  {
    id: 'der-4',
    type: 'battery',
    name: 'Residential Battery Cluster',
    location: 'East District',
    coordinates: [37.7739, -122.4084],
    availability: 85,
    trustScore: 80,
    capacity: 25
  },
  {
    id: 'der-5',
    type: 'EV',
    name: 'Public Charging Hub',
    location: 'North District',
    coordinates: [37.7769, -122.4174],
    availability: 60,
    trustScore: 75,
    capacity: 18
  },
  {
    id: 'der-6',
    type: 'battery',
    name: 'Marina Energy Storage',
    location: 'Marina District',
    coordinates: [37.8020, -122.4340],
    availability: 95,
    trustScore: 92,
    capacity: 22
  },
  {
    id: 'der-7',
    type: 'EV',
    name: 'Mission EV Charging',
    location: 'Mission District',
    coordinates: [37.7580, -122.4140],
    availability: 80,
    trustScore: 88,
    capacity: 16
  },
  {
    id: 'der-8',
    type: 'thermostat',
    name: 'Richmond Smart Thermostats',
    location: 'Richmond District',
    coordinates: [37.7810, -122.4840],
    availability: 90,
    trustScore: 85,
    capacity: 12
  },
  {
    id: 'der-9',
    type: 'battery',
    name: 'Sunset Community Battery',
    location: 'Sunset District',
    coordinates: [37.7560, -122.4840],
    availability: 85,
    trustScore: 90,
    capacity: 18
  },
  {
    id: 'der-10',
    type: 'EV',
    name: 'SoMa Business Fleet',
    location: 'SoMa District',
    coordinates: [37.7780, -122.3960],
    availability: 70,
    trustScore: 82,
    capacity: 20
  },
  {
    id: 'der-11',
    type: 'thermostat',
    name: 'Bayview Smart Buildings',
    location: 'Bayview District',
    coordinates: [37.7340, -122.3880],
    availability: 95,
    trustScore: 78,
    capacity: 14
  },
  {
    id: 'der-12',
    type: 'battery',
    name: 'Potrero Hill Storage',
    location: 'Potrero District',
    coordinates: [37.7610, -122.4000],
    availability: 88,
    trustScore: 86,
    capacity: 15
  }
];

export const dummyMitigationEvents: MitigationEvent[] = [
  {
    id: 'mitigation-1',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    tier: 1,
    feederId: 'feeder-2',
    actionSet: {
      derIds: ['der-1', 'der-2'],
      loadReduction: 10,
      duration: 30
    },
    fallbackActivated: false,
    hashLog: 'a1b2c3d4e5f6g7h8i9j0'
  },
  {
    id: 'mitigation-2',
    status: 'active',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    tier: 2,
    feederId: 'feeder-2',
    actionSet: {
      derIds: ['der-1', 'der-2', 'der-5'],
      loadReduction: 15,
      duration: 60
    },
    fallbackActivated: true,
    hashLog: 'z9y8x7w6v5u4t3s2r1q0'
  }
];

export const dummyChatLogs: ChatLog[] = [
  {
    id: 'chat-1',
    timestamp: new Date(Date.now() - 3900000).toISOString(),
    sender: 'agent',
    message: 'Alert: Central Hub Feeder approaching capacity limit. Current load at 92%, projected to reach 98% in 15 minutes.',
    actionMetadata: {
      type: 'alert',
      feederId: 'feeder-2'
    }
  },
  {
    id: 'chat-2',
    timestamp: new Date(Date.now() - 3800000).toISOString(),
    sender: 'operator',
    message: 'What mitigation options do we have?'
  },
  {
    id: 'chat-3',
    timestamp: new Date(Date.now() - 3700000).toISOString(),
    sender: 'agent',
    message: 'I recommend activating Community Battery 1 and Fleet EV Station to reduce load by 10%. Alternative options are available.',
    actionMetadata: {
      type: 'recommendation',
      options: [
        { name: 'Primary Option', description: 'Activate Community Battery 1 and Fleet EV Station', reduction: 10 },
        { name: 'Alternative 1', description: 'Activate Office Building Thermostats', reduction: 8 },
        { name: 'Alternative 2', description: 'Activate Residential Battery Cluster', reduction: 12 }
      ],
      feederId: 'feeder-2'
    }
  },
  {
    id: 'chat-4',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    sender: 'operator',
    message: 'Proceed with primary option.'
  },
  {
    id: 'chat-5',
    timestamp: new Date(Date.now() - 3550000).toISOString(),
    sender: 'agent',
    message: 'Primary mitigation activated. Monitoring feeder response.',
    actionMetadata: {
      type: 'action',
      feederId: 'feeder-2'
    }
  },
  {
    id: 'chat-6',
    timestamp: new Date(Date.now() - 1900000).toISOString(),
    sender: 'agent',
    message: 'Alert: Central Hub Feeder load increasing again. Now at 95%, projected to reach critical levels.',
    actionMetadata: {
      type: 'alert',
      feederId: 'feeder-2'
    }
  },
  {
    id: 'chat-7',
    timestamp: new Date(Date.now() - 1850000).toISOString(),
    sender: 'agent',
    message: 'Fallback tier activation recommended. This will activate additional DER resources. Consent compliance verification completed.',
    actionMetadata: {
      type: 'recommendation',
      feederId: 'feeder-2'
    }
  }
];

export const dummyFallbackTiers: FallbackTier[] = [
  {
    tier: 1,
    options: ['Community Battery', 'Commercial EV'],
    readinessStatus: 'ready',
    participationRate: 95,
    consentCompliance: true
  },
  {
    tier: 2,
    options: ['Residential Batteries', 'Public EV Stations'],
    readinessStatus: 'ready',
    participationRate: 85,
    consentCompliance: true
  },
  {
    tier: 3,
    options: ['Smart Thermostats', 'Non-critical Industrial'],
    readinessStatus: 'partial',
    participationRate: 75,
    consentCompliance: true
  }
]; 