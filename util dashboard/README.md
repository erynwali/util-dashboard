# Grid Command Center Dashboard 

A dashboard for grid operators to monitor and mitigate feeder overloads using DER assets and AI agent recommendations.

## Features

- Interactive map displaying feeders and DER assets
- Real-time agent chat with mitigation recommendations
- Feeder summary showing load status
- Audit trail of mitigation events
- Fallback tier activation system
- Simulated grid events and load fluctuations

## Setup Instructions

### Prerequisites

- Node.js (v14+) and npm/yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Implementation Details

### Data Simulation

The dashboard uses dummy data to simulate:
- Feeder load updates (every minute)
- AI agent recommendations
- DER asset availability
- Mitigation events
- Fallback tier activations

### Dashboard Zones

1. **Map (Center)** - Displays feeders and DER assets with status indicators
2. **Feeder Summary (Top Left)** - Shows load status for all feeders
3. **Audit Trail (Bottom Left)** - Logs of mitigation events
4. **Agent Chat (Right)** - Interaction with AI agent, including mitigation options
5. **Fallback Drawer (Modal)** - DER heatmap and fallback tier information

### Color Codes

- Green: Normal operation
- Yellow: Warning (high load)
- Red: Critical (overload risk)
- Blue: Fallback active

## Technologies Used

- Next.js 14
- React
- TypeScript
- TailwindCSS
- Leaflet (for interactive map)

## License

This project is for demonstration purposes only. 