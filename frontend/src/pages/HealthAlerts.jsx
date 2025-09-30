import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, Plus, Settings, History, Trash2, Edit } from 'lucide-react'
import { useAuthStore, useSettingsStore } from '../store/useStore'
import toast from 'react-hot-toast'

const HealthAlerts = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { 
    notifications, 
    thresholds, 
    quietHours,
    updateNotifications,
    updateThresholds,
    updateQuietHours 
  } = useSettingsStore()
  
  const [alerts, setAlerts] = useState([])
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const mockAlerts = [
        {
          id: '1',
          type: 'aqi',
          threshold: 100,
          currentValue: 156,
          severity: 'medium',
          message: 'AQI exceeded threshold in Anand Vihar',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'sent'
        },
        {
          id: '2',
          type: 'pm25',
          threshold: 35,
          currentValue: 85,
          severity: 'high',
          message: 'PM2.5 levels are unhealthy in your area',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: 'acknowledged'
        }
      ]
      setAlerts(mockAlerts)
    } catch (error) {
      console.error('Error loading alerts:', error)
      toast.error('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationChange = (channel, enabled) => {
    updateNotifications({ [channel]: enabled })
    toast.success(`${channel} notifications ${enabled ? 'enabled' : 'disabled'}`)
  }

  const handleThresholdChange = (pollutant, value) => {
    updateThresholds({ [pollutant]: parseFloat(value) })
  }

  const handleQuietHoursChange = (field, value) => {
    updateQuietHours({ [field]: value })
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'sent': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'acknowledged': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('alerts.title')}
              </h1>
              <p className="text-gray-600">
                Manage your air quality health alerts and notification preferences
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setShowCreateAlert(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                <span>{t('alerts.createAlert')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <History size={20} className="text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('alerts.alertHistory')}
                  </h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">{t('common.loading')}</p>
                  </div>
                ) : alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                              {alert.status.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {alert.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-900 font-medium mb-1">{alert.message}</p>
                          <p className="text-sm text-gray-600">
                            {alert.type.toUpperCase()}: {alert.currentValue} (threshold: {alert.threshold})
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <Bell size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No alerts yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Configure your thresholds to start receiving alerts
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings size={20} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('alerts.thresholds')}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AQI Threshold
                  </label>
                  <input
                    type="number"
                    value={thresholds.aqi}
                    onChange={(e) => handleThresholdChange('aqi', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PM2.5 Threshold (μg/m³)
                  </label>
                  <input
                    type="number"
                    value={thresholds.pm25}
                    onChange={(e) => handleThresholdChange('pm25', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NO₂ Threshold (ppb)
                  </label>
                  <input
                    type="number"
                    value={thresholds.no2}
                    onChange={(e) => handleThresholdChange('no2', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    O₃ Threshold (ppb)
                  </label>
                  <input
                    type="number"
                    value={thresholds.o3}
                    onChange={(e) => handleThresholdChange('o3', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('alerts.channels')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{t('alerts.push')}</p>
                    <p className="text-sm text-gray-600">Browser notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{t('alerts.email')}</p>
                    <p className="text-sm text-gray-600">Email notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{t('alerts.sms')}</p>
                    <p className="text-sm text-gray-600">SMS alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{t('alerts.whatsapp')}</p>
                    <p className="text-sm text-gray-600">WhatsApp messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.whatsapp}
                      onChange={(e) => handleNotificationChange('whatsapp', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('alerts.quietHours')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Enable Quiet Hours</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quietHours.enabled}
                      onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {quietHours.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={quietHours.start}
                        onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={quietHours.end}
                        onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthAlerts