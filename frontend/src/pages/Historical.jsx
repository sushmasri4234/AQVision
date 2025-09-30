import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Download, TrendingUp, BarChart3 } from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import { useMapStore } from '../store/useStore'
import { mapService } from '../services/mapService'

const Historical = () => {
  const { t } = useTranslation()
  const { selectedCity, setSelectedCity } = useMapStore()
  const [historicalData, setHistoricalData] = useState(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })
  const [selectedPollutant, setSelectedPollutant] = useState('aqi')
  const [chartType, setChartType] = useState('line')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadHistoricalData()
  }, [selectedCity, dateRange, selectedPollutant])

  const loadHistoricalData = async () => {
    try {
      setLoading(true)
      const data = await mapService.getHistoricalData({
        cityId: selectedCity,
        from: dateRange.from,
        to: dateRange.to,
        pollutant: selectedPollutant
      })
      setHistoricalData(data)
    } catch (error) {
      console.error('Error loading historical data:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadData = () => {
    if (!historicalData?.zones) return
    
    const headers = ['Date', 'Zone', 'Value', 'AQI', 'PM2.5', 'NO2', 'O3']
    const rows = []
    
    Object.entries(historicalData.zones).forEach(([zoneId, zoneData]) => {
      zoneData.data.forEach(reading => {
        rows.push([
          new Date(reading.timestamp).toLocaleDateString(),
          zoneData.zone.name,
          reading.value,
          reading.aqi,
          reading.pm25,
          reading.no2,
          reading.o3
        ])
      })
    })
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `historical_data_${selectedCity}_${dateRange.from}_${dateRange.to}.csv`
    a.click()
    
    URL.revokeObjectURL(url)
  }

  const getChartData = () => {
    if (!historicalData?.zones) return { labels: [], datasets: [] }
    
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
    ]
    
    const datasets = Object.entries(historicalData.zones).map(([zoneId, zoneData], index) => ({
      label: zoneData.zone.name,
      data: zoneData.data.map(reading => reading.value),
      borderColor: colors[index % colors.length],
      backgroundColor: chartType === 'bar' ? colors[index % colors.length] + '80' : colors[index % colors.length] + '20',
      tension: 0.4,
      fill: chartType === 'line'
    }))
    
    const allTimestamps = new Set()
    Object.values(historicalData.zones).forEach(zoneData => {
      zoneData.data.forEach(reading => {
        allTimestamps.add(new Date(reading.timestamp).toLocaleDateString())
      })
    })
    
    const labels = Array.from(allTimestamps).sort()
    
    return { labels, datasets }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: `${selectedPollutant.toUpperCase()} Trends - ${t(`cities.${selectedCity}`)}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: selectedPollutant === 'aqi' ? 'AQI' : 'Concentration'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
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

  const pollutantOptions = [
    { value: 'aqi', label: 'AQI' },
    { value: 'pm25', label: 'PM2.5' },
    { value: 'no2', label: 'NO₂' },
    { value: 'o3', label: 'O₃' }
  ]

  const chartData = getChartData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('nav.historical')} Data
              </h1>
              <p className="text-gray-600">
                Analyze air quality trends and patterns over time
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <button
                onClick={downloadData}
                disabled={!historicalData?.zones}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                <span>Download Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    Pollutant
                  </label>
                  <select
                    value={selectedPollutant}
                    onChange={(e) => setSelectedPollutant(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {pollutantOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart Type
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChartType('line')}
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium ${
                        chartType === 'line'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <TrendingUp size={14} />
                      <span>Line</span>
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium ${
                        chartType === 'bar'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <BarChart3 size={14} />
                      <span>Bar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {historicalData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date Range:</span>
                    <span className="font-semibold text-sm">
                      {Math.ceil((new Date(dateRange.to) - new Date(dateRange.from)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Zones:</span>
                    <span className="font-semibold text-sm">
                      {Object.keys(historicalData.zones || {}).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Points:</span>
                    <span className="font-semibold text-sm">
                      {Object.values(historicalData.zones || {}).reduce((sum, zone) => sum + zone.data.length, 0)}
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
              ) : chartData.datasets.length > 0 ? (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <Calendar className="text-blue-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Historical Trends
                    </h2>
                  </div>
                  {chartType === 'line' ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No data available for selected filters</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting the date range or city selection</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {historicalData?.zones && Object.keys(historicalData.zones).length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Zone Statistics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Maximum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(historicalData.zones).map(([zoneId, zoneData], index) => {
                    const values = zoneData.data.map(d => d.value)
                    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
                    const min = Math.min(...values)
                    const max = Math.max(...values)
                    
                    return (
                      <tr key={zoneId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {zoneData.zone.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {avg.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {min.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {max.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {values.length}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Historical