import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/useStore'

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen ambient-bg">
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Breathe Safer with <span className="text-yellow-300">AQVision</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Real-time air quality monitoring, health alerts, and forecasting for major Indian cities. 
              Stay informed, stay healthy.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Real-Time Monitoring</h3>
                <p className="text-sm text-gray-100">Live AQI data from 6 major cities</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Health Alerts</h3>
                <p className="text-sm text-gray-100">Personalized notifications for your safety</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">48-Hour Forecast</h3>
                <p className="text-sm text-gray-100">AI-powered air quality predictions</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Multi-Language</h3>
                <p className="text-sm text-gray-100">Available in 5 Indian languages</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/real-time')
                  } else {
                    toast.error('Please login to access real-time data')
                    navigate('/login')
                  }
                }}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-center"
              >
                View Live Map
              </button>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/forecast')
                  } else {
                    toast.error('Please login to access forecast data')
                    navigate('/login')
                  }
                }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-center"
              >
                Check Forecast
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center text-white mb-6">
                <h3 className="text-2xl font-bold mb-2">Current AQI Status</h3>
                <p className="text-gray-200">Live data from major cities</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { city: 'Delhi NCR', aqi: 287, status: 'Very Unhealthy', color: '#8F3F97' },
                  { city: 'Mumbai', aqi: 156, status: 'Unhealthy', color: '#FF0000' },
                  { city: 'Kolkata', aqi: 98, status: 'Moderate', color: '#FFFF00' },
                  { city: 'Chennai', aqi: 67, status: 'Moderate', color: '#FFFF00' },
                  { city: 'Bengaluru', aqi: 45, status: 'Good', color: '#00E400' },
                  { city: 'Ahmedabad', aqi: 134, status: 'Unhealthy for Sensitive', color: '#FF7E00' }
                ].map((city) => (
                  <div key={city.city} className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-3">
                    <span className="font-medium">{city.city}</span>
                    <div className="flex items-center space-x-2">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: city.color }}
                      >
                        {city.aqi}
                      </span>
                      <span className="text-sm text-gray-200">{city.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Home