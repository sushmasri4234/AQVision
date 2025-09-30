import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Map, TrendingUp, Bell, History, Wind, Thermometer, Droplets } from 'lucide-react'
import { useAuthStore, useMapStore } from '../store/useStore'
import { mapService } from '../services/mapService'
import { getAQIColor, getAQILabel } from '../utils/aqiUtils'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { selectedCity } = useMapStore()
  const [currentAQI, setCurrentAQI] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [selectedCity])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const zonesData = await mapService.getCityZones(selectedCity)
      
      if (zonesData.zones && zonesData.zones.length > 0) {
        const avgAQI = Math.round(
          zonesData.zones.reduce((sum, zone) => sum + (zone.latestReading?.aqi || 0), 0) / zonesData.zones.length
        )
        setCurrentAQI(avgAQI)
      }
      
      setWeatherData({
        temperature: 28,
        humidity: 65,
        windSpeed: 12
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  const quickActions = [
    {
      title: t('dashboard.viewMap'),
      description: 'Real-time air quality monitoring',
      icon: Map,
      link: '/real-time',
      color: 'bg-blue-500'
    },
    {
      title: t('dashboard.checkForecast'),
      description: '24-48 hour predictions',
      icon: TrendingUp,
      link: '/forecast',
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.manageAlerts'),
      description: 'Health notifications',
      icon: Bell,
      link: '/alerts',
      color: 'bg-yellow-500'
    },
    {
      title: t('dashboard.viewHistory'),
      description: 'Historical trends',
      icon: History,
      link: '/historical',
      color: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.greeting', { 
              timeOfDay: getTimeOfDay(), 
              name: user?.name || 'User' 
            })}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.lastUpdated', { time: new Date().toLocaleString() })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-xl p-6 mb-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('dashboard.currentAQI')} - {t(`cities.${selectedCity}`)}
              </h2>
              
              {currentAQI !== null ? (
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2"
                      style={{ backgroundColor: getAQIColor(currentAQI) }}
                    >
                      {currentAQI}
                    </div>
                    <p className="text-sm text-gray-600">{getAQILabel(currentAQI)}</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <Wind className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm text-blue-700">Wind</p>
                        <p className="font-semibold text-blue-800">{weatherData?.windSpeed || 0} km/h</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <Thermometer className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                        <p className="text-sm text-orange-700">Temp</p>
                        <p className="font-semibold text-orange-800">{weatherData?.temperature || 0}°C</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                        <Droplets className="w-6 h-6 text-cyan-600 mx-auto mb-1" />
                        <p className="text-sm text-cyan-700">Humidity</p>
                        <p className="font-semibold text-cyan-800">{weatherData?.humidity || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('dashboard.quickActions')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="block p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Today's Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Air Quality</span>
                  <span className="font-semibold" style={{ color: getAQIColor(currentAQI || 0) }}>
                    {getAQILabel(currentAQI || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Health Risk</span>
                  <span className="font-semibold text-orange-600">
                    {currentAQI > 100 ? 'Moderate' : 'Low'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Outdoor Activities</span>
                  <span className="font-semibold text-green-600">
                    {currentAQI > 150 ? 'Not Recommended' : 'Safe'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Health Tips</h3>
              
              <div className="space-y-3">
                {currentAQI > 100 ? (
                  <>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">
                        • Limit outdoor activities
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">
                        • Consider wearing a mask
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">
                        • Keep windows closed
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        • Great day for outdoor activities
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        • Open windows for fresh air
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        • Perfect for exercise outdoors
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Alerts Today</span>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Saved Locations</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Points</span>
                  <span className="font-semibold">24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard