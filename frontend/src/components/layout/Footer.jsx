import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AQ</span>
              </div>
              <span className="text-xl font-bold">AQVision</span>
            </div>
            <p className="text-gray-300 mb-4">
              Real-time air quality monitoring with health alerts and forecasting for major Indian cities.
            </p>
            <p className="text-sm text-gray-400">
              © 2024 AQVision. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/real-time" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.realTime')}
                </Link>
              </li>
              <li>
                <Link to="/forecast" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.forecast')}
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.education')}
                </Link>
              </li>
              <li>
                <Link to="/historical" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.historical')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Data sources: Central Pollution Control Board (CPCB), State Pollution Control Boards
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer