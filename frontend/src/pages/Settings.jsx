import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Globe, Bell, MapPin, Save } from 'lucide-react'
import { useAuthStore, useSettingsStore } from '../store/useStore'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const Settings = () => {
  const { t, i18n } = useTranslation()
  const { user, updateUser } = useAuthStore()
  const { 
    language, 
    notifications, 
    savedLocations,
    setLanguage,
    updateNotifications,
    addSavedLocation,
    removeSavedLocation
  } = useSettingsStore()
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    ageGroup: user?.ageGroup || '',
    healthConditions: user?.healthConditions || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '' })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        mobile: user.mobile || '',
        ageGroup: user.ageGroup || '',
        healthConditions: user.healthConditions || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const updatedUser = await authService.updateProfile(profile)
      updateUser(updatedUser.user)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    i18n.changeLanguage(newLanguage)
    toast.success('Language updated')
  }

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.lat || !newLocation.lng) {
      toast.error('Please fill all location fields')
      return
    }
    
    const location = {
      id: Date.now().toString(),
      name: newLocation.name,
      lat: parseFloat(newLocation.lat),
      lng: parseFloat(newLocation.lng)
    }
    
    addSavedLocation(location)
    setNewLocation({ name: '', lat: '', lng: '' })
    setShowAddLocation(false)
    toast.success('Location added successfully')
  }

  const handleRemoveLocation = (locationId) => {
    removeSavedLocation(locationId)
    toast.success('Location removed')
  }

  return (
    <div className="min-h-screen page-settings">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('nav.settings')}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and notification settings
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              </div>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.mobile')}
                  </label>
                  <input
                    type="tel"
                    value={profile.mobile}
                    onChange={(e) => setProfile({...profile, mobile: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.ageGroup')}
                  </label>
                  <select
                    value={profile.ageGroup}
                    onChange={(e) => setProfile({...profile, ageGroup: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Age Group</option>
                    <option value="child">0-12 years</option>
                    <option value="teen">13-17 years</option>
                    <option value="adult">18-64 years</option>
                    <option value="senior">65+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.healthConditions')}
                </label>
                <textarea
                  value={profile.healthConditions}
                  onChange={(e) => setProfile({...profile, healthConditions: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Asthma, heart disease, respiratory conditions, etc."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>{loading ? 'Saving...' : t('common.save')}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Globe size={20} className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Language & Region</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('auth.language')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { code: 'en', name: 'English', native: 'English' },
                    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
                    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
                    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
                    { code: 'bn', name: 'Bengali', native: 'বাংলা' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        language === lang.code
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{lang.native}</div>
                      <div className="text-sm text-gray-500">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bell size={20} className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { key: 'push', label: 'Push Notifications', description: 'Browser notifications for alerts' },
                { key: 'email', label: 'Email Notifications', description: 'Email alerts for air quality changes' },
                { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts' },
                { key: 'whatsapp', label: 'WhatsApp Notifications', description: 'WhatsApp message alerts' }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{notification.label}</p>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[notification.key]}
                      onChange={(e) => updateNotifications({ [notification.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin size={20} className="text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Saved Locations</h2>
                </div>
                <button
                  onClick={() => setShowAddLocation(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Add Location
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {savedLocations.length > 0 ? (
                <div className="space-y-3">
                  {savedLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{location.name}</p>
                        <p className="text-sm text-gray-600">
                          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveLocation(location.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No saved locations. Add locations to get personalized alerts.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Location</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Home, Office"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.lat}
                    onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="28.6139"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.lng}
                    onChange={(e) => setNewLocation({...newLocation, lng: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="77.2090"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddLocation(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleAddLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings