import { mockCities, mockZones, mockForecast } from './mockData'

// Real-time data simulation
const generateRealTimeData = () => {
  const baseValues = { delhi: { aqi: 287, pm25: 320, no2: 85, o3: 12 } }
  const variation = () => Math.random() * 20 - 10 // ±10 variation
  
  return {
    delhi: {
      city: { id: 'delhi', name: 'Delhi NCR' },
      zones: [
        {
          id: 'anand_vihar',
          name: 'Anand Vihar',
          latitude: 28.6503,
          longitude: 77.3159,
          population: 120000,
          latestReading: {
            aqi: Math.max(50, Math.floor(baseValues.delhi.aqi + variation())),
            pm25: Math.max(20, Math.floor(baseValues.delhi.pm25 + variation())),
            no2: Math.max(10, Math.floor(baseValues.delhi.no2 + variation())),
            o3: Math.max(5, Math.floor(baseValues.delhi.o3 + variation())),
            ts: new Date().toISOString()
          }
        },
        {
          id: 'rk_puram',
          name: 'RK Puram',
          latitude: 28.5535,
          longitude: 77.1784,
          population: 90000,
          latestReading: {
            aqi: Math.max(50, Math.floor(210 + variation())),
            pm25: Math.max(20, Math.floor(220 + variation())),
            no2: Math.max(10, Math.floor(60 + variation())),
            o3: Math.max(5, Math.floor(10 + variation())),
            ts: new Date().toISOString()
          }
        }
      ]
    }
  }
}

export const mapService = {
  async getCities() {
    return mockCities
  },

  async getCityZones(cityId) {
    const realTimeData = generateRealTimeData()
    return realTimeData[cityId] || realTimeData.delhi
  },

  async getZoneReadings(zoneId, params = {}) {
    const readings = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(Date.now() - i * 5 * 60 * 1000).toISOString(),
      aqi: Math.floor(Math.random() * 200) + 100,
      pm25: Math.floor(Math.random() * 150) + 50,
      no2: Math.floor(Math.random() * 80) + 20,
      o3: Math.floor(Math.random() * 40) + 5
    }))
    return { zoneId, readings, count: readings.length }
  },

  async getZoneForecast(zoneId, horizon = 24) {
    const forecast = Array.from({ length: horizon }, (_, i) => ({
      timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
      hour: i,
      aqi: Math.floor(Math.random() * 200) + 50 + Math.sin(i * 0.3) * 30,
      pm25: Math.floor(Math.random() * 100) + 20 + Math.sin(i * 0.3) * 20,
      no2: Math.floor(Math.random() * 50) + 10,
      o3: Math.floor(Math.random() * 30) + 5,
      confidence: 0.85 - (i * 0.01)
    }))
    return { zoneId, horizon, forecast, generatedAt: new Date().toISOString() }
  },

  async getHistoricalData(params) {
    return { zones: {} }
  }
}