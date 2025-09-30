# AQVision - Air Quality Monitoring System

A complete full-stack air quality monitoring application with real-time data, forecasting, and health alerts.

## Quick Start (Combined App)

```bash
# Clone and setup
git clone <repo-url>
cd air-quality-monitoring

# Install dependencies and build
npm install
npm run build

# Start combined application
npm start

# Or use the batch file (Windows)
start.bat

# Access AQVision
Application: http://localhost:9000
API: http://localhost:9000/api
Demo HTML: Open demo.html in browser
```

## Demo Credentials
- User: demo@airwatch.test / Demo@1234
- Admin: admin@airwatch.test / Admin@1234

## Architecture

- **Combined App**: Single Express server serving both frontend and API
- **Frontend**: React + Vite + Tailwind CSS + Leaflet maps
- **Backend**: Node.js + Express with mock data
- **Offline Mode**: Works without external dependencies
- **Real-time Simulation**: Dynamic data generation

## Features

- Real-time air quality monitoring with interactive maps
- Dynamic data simulation with realistic variations
- 24-hour forecasting with confidence intervals
- Multi-city support (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Ahmedabad)
- Educational content with images and videos
- Health recommendations and tips
- Responsive design with modern UI
- Offline functionality with mock data

## Development Options

### Option 1: Combined App (Recommended)
```bash
npm install
npm run build
npm start
# Access: http://localhost:8080
```

### Option 2: Standalone HTML Demo
```bash
# Just open demo.html in browser
# No server required
```

### Option 3: Individual Services (Advanced)
```bash
cd frontend && npm install && npm run dev
cd backend && npm install && npm run dev
```

## API Endpoints

- **Cities**: GET /api/cities
- **Zones**: GET /api/cities/:cityId/zones  
- **Readings**: GET /api/zones/:zoneId/readings
- **Forecast**: GET /api/zones/:zoneId/forecast
- **Auth**: POST /api/auth/login, /api/auth/signup
- **Health**: GET /api/health

## File Structure

- `combined-app.js` - Main server file
- `demo.html` - Standalone demo
- `start.bat` - Windows startup script
- `frontend/` - React application
- `package.json` - Combined app dependencies

## Architecture

See `docs/architecture.md` for detailed system design.