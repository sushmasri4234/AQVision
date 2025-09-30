export const mockCities = {
  cities: [
    { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
    { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
    { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
    { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
    { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 }
  ]
}

export const mockZones = {
  delhi: {
    city: { id: 'delhi', name: 'Delhi NCR' },
    zones: [
      {
        id: 'anand_vihar',
        name: 'Anand Vihar',
        latitude: 28.6503,
        longitude: 77.3159,
        population: 120000,
        latestReading: { aqi: 287, pm25: 320, no2: 85, o3: 12, ts: new Date().toISOString() }
      },
      {
        id: 'rk_puram',
        name: 'RK Puram',
        latitude: 28.5535,
        longitude: 77.1784,
        population: 90000,
        latestReading: { aqi: 210, pm25: 220, no2: 60, o3: 10, ts: new Date().toISOString() }
      }
    ]
  }
}

export const mockForecast = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
  hour: i,
  aqi: Math.floor(Math.random() * 200) + 50,
  pm25: Math.floor(Math.random() * 100) + 20,
  no2: Math.floor(Math.random() * 50) + 10,
  o3: Math.floor(Math.random() * 30) + 5,
  confidence: 0.85
}))