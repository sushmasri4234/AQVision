import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, RefreshCw } from 'lucide-react'
import AirMap from '../components/map/AirMap'
import { useMapStore } from '../store/useStore'
import { mapService } from '../services/mapService'

const RealTime = () => {
  const { t } = useTranslation()
  const { selectedCity, setSelectedCity } = useMapStore()
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    try {
      const data = await mapService.getCities()
      setCities(data.cities || [])
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    setLastUpdated(new Date())
    setTimeout(() => setLoading(false), 1000)
  }

  const cityOptions = [
    { id: 'delhi', name: t('cities.delhi') },
    { id: 'mumbai', name: t('cities.mumbai') },
    { id: 'kolkata', name: t('cities.kolkata') },
    { id: 'chennai', name: t('cities.chennai') },
    { id: 'bengaluru', name: t('cities.bengaluru') },
    { id: 'ahmedabad', name: t('cities.ahmedabad') }
  ]

  return (
    <div className="min-h-screen page-realtime">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('nav.realTime')} Air Quality
              </h1>
              <p className="text-gray-600">
                Live air quality data from monitoring stations across India
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin size={20} className="text-gray-500" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select city"
                >
                  {cityOptions.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh data"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            {t('dashboard.lastUpdated', { time: lastUpdated.toLocaleString() })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-2xl overflow-hidden border border-blue-200">
          <AirMap height="600px" />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-xl p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Air Quality Index</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Good (0-50)</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#00E400' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Moderate (51-100)</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFFF00' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unhealthy for Sensitive (101-150)</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF7E00' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unhealthy (151-200)</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF0000' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Very Unhealthy (201-300)</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8F3F97' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hazardous (301+)</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#7E0023' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Pollutant Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">PM2.5:</span>
                <p className="text-gray-600">Fine particulate matter (≤2.5 micrometers)</p>
              </div>
              <div>
                <span className="font-medium">NO₂:</span>
                <p className="text-gray-600">Nitrogen dioxide from vehicle emissions</p>
              </div>
              <div>
                <span className="font-medium">O₃:</span>
                <p className="text-gray-600">Ground-level ozone</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-xl p-6 border border-orange-100">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">Health Recommendations</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">Good Air Quality:</span>
                <p className="text-green-700">Perfect for outdoor activities</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-800">Poor Air Quality:</span>
                <p className="text-red-700">Limit outdoor exposure, use masks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealTime