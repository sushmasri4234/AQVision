const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Mock data
const mockCities = [
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 }
];

const mockZones = {
  delhi: [
    { id: 'anand_vihar', name: 'Anand Vihar', latitude: 28.6503, longitude: 77.3159, aqi: 287, pm25: 320, no2: 85, o3: 12 },
    { id: 'rk_puram', name: 'RK Puram', latitude: 28.5535, longitude: 77.1784, aqi: 210, pm25: 220, no2: 60, o3: 10 }
  ]
};

// API Routes
app.get('/api/cities', (req, res) => {
  res.json({ cities: mockCities });
});

app.get('/api/cities/:cityId/zones', (req, res) => {
  const cityId = req.params.cityId;
  const variation = () => Math.random() * 20 - 10;
  
  const cityZones = {
    delhi: [
      { id: 'anand_vihar', name: 'Anand Vihar', latitude: 28.6503, longitude: 77.3159, baseAqi: 287 },
      { id: 'rk_puram', name: 'RK Puram', latitude: 28.5535, longitude: 77.1784, baseAqi: 210 },
      { id: 'dwarka', name: 'Dwarka', latitude: 28.5921, longitude: 77.0460, baseAqi: 195 },
      { id: 'rohini', name: 'Rohini', latitude: 28.7041, longitude: 77.1025, baseAqi: 245 }
    ],
    mumbai: [
      { id: 'bandra', name: 'Bandra', latitude: 19.0596, longitude: 72.8295, baseAqi: 156 },
      { id: 'andheri', name: 'Andheri', latitude: 19.1136, longitude: 72.8697, baseAqi: 142 },
      { id: 'worli', name: 'Worli', latitude: 19.0176, longitude: 72.8118, baseAqi: 168 }
    ],
    kolkata: [
      { id: 'salt_lake', name: 'Salt Lake', latitude: 22.5958, longitude: 88.4497, baseAqi: 98 },
      { id: 'park_street', name: 'Park Street', latitude: 22.5448, longitude: 88.3426, baseAqi: 112 }
    ],
    chennai: [
      { id: 'adyar', name: 'Adyar', latitude: 13.0067, longitude: 80.2206, baseAqi: 67 },
      { id: 't_nagar', name: 'T. Nagar', latitude: 13.0418, longitude: 80.2341, baseAqi: 78 }
    ],
    bengaluru: [
      { id: 'koramangala', name: 'Koramangala', latitude: 12.9279, longitude: 77.6271, baseAqi: 45 },
      { id: 'whitefield', name: 'Whitefield', latitude: 12.9698, longitude: 77.7499, baseAqi: 52 }
    ],
    ahmedabad: [
      { id: 'satellite', name: 'Satellite', latitude: 23.0301, longitude: 72.5120, baseAqi: 134 },
      { id: 'navrangpura', name: 'Navrangpura', latitude: 23.0395, longitude: 72.5610, baseAqi: 128 }
    ]
  };
  
  const zones = (cityZones[cityId] || cityZones.delhi).map(zone => ({
    ...zone,
    latestReading: {
      aqi: Math.max(50, Math.floor(zone.baseAqi + variation())),
      pm25: Math.max(20, Math.floor((zone.baseAqi * 1.2) + variation())),
      no2: Math.max(10, Math.floor((zone.baseAqi * 0.3) + variation())),
      o3: Math.max(5, Math.floor((zone.baseAqi * 0.1) + variation())),
      ts: new Date().toISOString()
    },
    population: Math.floor(Math.random() * 200000) + 50000
  }));
  
  const city = mockCities.find(c => c.id === cityId) || mockCities[0];
  res.json({ city, zones });
});

app.get('/api/zones/:zoneId/readings', (req, res) => {
  const readings = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - i * 5 * 60 * 1000).toISOString(),
    aqi: Math.floor(Math.random() * 200) + 100 + Math.sin(i * 0.5) * 50,
    pm25: Math.floor(Math.random() * 150) + 50 + Math.sin(i * 0.5) * 30,
    no2: Math.floor(Math.random() * 80) + 20,
    o3: Math.floor(Math.random() * 40) + 5,
    temperature: Math.floor(Math.random() * 15) + 25,
    humidity: Math.floor(Math.random() * 30) + 40
  }));
  res.json({ zoneId: req.params.zoneId, readings, count: readings.length });
});

app.get('/api/zones/:zoneId/forecast', (req, res) => {
  const forecast = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
    hour: i,
    aqi: Math.floor(Math.random() * 200) + 50,
    pm25: Math.floor(Math.random() * 100) + 20,
    confidence: 0.85
  }));
  res.json({ zoneId: req.params.zoneId, forecast, generatedAt: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const user = { id: '1', name: 'Demo User', email: req.body.email, role: 'user' };
  res.json({ user, accessToken: 'mock-token', refreshToken: 'mock-refresh' });
});

app.post('/api/auth/signup', (req, res) => {
  const user = { id: '1', ...req.body, role: 'user' };
  res.json({ user, accessToken: 'mock-token', refreshToken: 'mock-refresh' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 AQVision running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend at http://localhost:${PORT}`);
});