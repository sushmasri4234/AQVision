import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Info, TrendingUp, MapPin } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useMapStore } from '../store/useStore'
import { mapService } from '../services/mapService'
import { getAQIColor } from '../utils/aqiUtils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Forecast = () => {
  const { t } = useTranslation()
  const { selectedCity, setSelectedCity } = useMapStore()
  const [forecastData, setForecastData] = useState(null)
  const [selectedHorizon, setSelectedHorizon] = useState(24)
  const [selectedZone, setSelectedZone] = useState(null)
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    loadZones()
  }, [selectedCity])

  useEffect(() => {
    if (selectedZone) {
      loadForecast()
    }
  }, [selectedZone, selectedHorizon])

  const loadZones = async () => {
    try {
      const data = await mapService.getCityZones(selectedCity)
      setZones(data.zones || [])
      if (data.zones && data.zones.length > 0) {
        setSelectedZone(data.zones[0].id)
      }
    } catch (error) {
      console.error('Error loading zones:', error)
    }
  }

  const loadForecast = async () => {
    if (!selectedZone) return
    
    try {
      setLoading(true)
      const data = await mapService.getZoneForecast(selectedZone, selectedHorizon)
      setForecastData(data)
    } catch (error) {
      console.error('Error loading forecast:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    if (!forecastData?.forecast) return
    
    const headers = ['Timestamp', 'Hour', 'AQI', 'PM2.5', 'NO2', 'O3', 'Confidence']
    const rows = forecastData.forecast.map(item => [
      item.timestamp,
      item.hour,
      item.aqi,
      item.pm25,
      item.no2,
      item.o3,
      item.confidence
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `forecast_${selectedZone}_${selectedHorizon}h.csv`
    a.click()
    
    URL.revokeObjectURL(url)
  }

  const chartData = {
    labels: forecastData?.forecast?.map(item => 
      new Date(item.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ) || [],
    datasets: [
      {
        label: 'AQI',
        data: forecastData?.forecast?.map(item => item.aqi) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'PM2.5',
        data: forecastData?.forecast?.map(item => item.pm25) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'NO₂',
        data: forecastData?.forecast?.map(item => item.no2) || [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4
      },
      {
        label: 'O₃',
        data: forecastData?.forecast?.map(item => item.o3) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: `${selectedHorizon}-Hour Air Quality Forecast`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Concentration'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
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
    <div className="min-h-screen page-forecast">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('forecast.title')}
              </h1>
              <p className="text-gray-600">
                AI-powered air quality predictions for the next 24-48 hours
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setShowExplanation(true)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Info size={16} />
                <span>{t('forecast.howItWorks')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cityOptions.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone
                  </label>
                  <select
                    value={selectedZone || ''}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forecast Horizon
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedHorizon(24)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                        selectedHorizon === 24
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('forecast.next24Hours')}
                    </button>
                    <button
                      onClick={() => setSelectedHorizon(48)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                        selectedHorizon === 48
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('forecast.next48Hours')}
                    </button>
                  </div>
                </div>

                <button
                  onClick={downloadCSV}
                  disabled={!forecastData?.forecast}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  <span>{t('forecast.downloadCSV')}</span>
                </button>
              </div>
            </div>

            {forecastData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average AQI:</span>
                    <span className="font-semibold">
                      {Math.round(
                        forecastData.forecast.reduce((sum, item) => sum + item.aqi, 0) / 
                        forecastData.forecast.length
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Peak AQI:</span>
                    <span className="font-semibold">
                      {Math.max(...forecastData.forecast.map(item => item.aqi))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className="font-semibold">
                      {Math.round(
                        forecastData.forecast.reduce((sum, item) => sum + item.confidence, 0) / 
                        forecastData.forecast.length * 100
                      )}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('common.loading')}</p>
                  </div>
                </div>
              ) : forecastData?.forecast ? (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="text-blue-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedHorizon}-Hour Forecast
                    </h2>
                  </div>
                  <Line data={chartData} options={chartOptions} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a zone to view forecast</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {forecastData?.forecast && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Hourly Forecast Data</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AQI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PM2.5
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NO₂
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      O₃
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forecastData.forecast.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: getAQIColor(item.aqi) }}
                        >
                          {item.aqi}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.pm25?.toFixed(1)} μg/m³
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.no2?.toFixed(1)} ppb
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.o3?.toFixed(1)} ppb
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item.confidence * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('forecast.howItWorks')}</h2>
              <button
                onClick={() => setShowExplanation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>{t('forecast.forecastExplanation')}</p>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Key Features:</h3>
                <ul className="space-y-1 text-blue-800">
                  <li>• Machine Learning models trained on historical data</li>
                  <li>• Weather pattern analysis and correlation</li>
                  <li>• Real-time model updates and validation</li>
                  <li>• Confidence intervals for prediction accuracy</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Important Notes:</h3>
                <ul className="space-y-1 text-yellow-800">
                  <li>• Forecasts are predictions and may vary from actual conditions</li>
                  <li>• Accuracy decreases with longer forecast horizons</li>
                  <li>• Use forecasts as guidance, not absolute values</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowExplanation(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Forecast