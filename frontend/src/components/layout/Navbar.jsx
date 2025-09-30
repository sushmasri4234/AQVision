import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, User, LogOut, Settings, Bell } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../../store/useStore'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { t, i18n } = useTranslation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AQ</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AQVision</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link 
              to={isAuthenticated ? "/dashboard" : "/login"} 
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access dashboard')
                  navigate('/login')
                }
              }}
            >
              {t('nav.dashboard')}
            </Link>
            <Link 
              to={isAuthenticated ? "/real-time" : "/login"} 
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access real-time data')
                  navigate('/login')
                }
              }}
            >
              {t('nav.realTime')}
            </Link>
            <Link 
              to={isAuthenticated ? "/forecast" : "/login"} 
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access forecast data')
                  navigate('/login')
                }
              }}
            >
              {t('nav.forecast')}
            </Link>
            <Link 
              to={isAuthenticated ? "/education" : "/login"} 
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access education content')
                  navigate('/login')
                }
              }}
            >
              {t('nav.education')}
            </Link>

            <div className="flex items-center space-x-2">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="hi">हिं</option>
                <option value="ta">த</option>
                <option value="te">తె</option>
                <option value="bn">বা</option>
              </select>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  aria-label="User menu"
                >
                  <User size={20} />
                  <span>{user?.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      {t('nav.settings')}
                    </Link>
                    <Link
                      to="/alerts"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Bell size={16} className="mr-2" />
                      {t('nav.alerts')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        {t('nav.admin')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={(e) => {
                setIsOpen(false)
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access dashboard')
                  navigate('/login')
                }
              }}
            >
              {t('nav.dashboard')}
            </Link>
            <Link
              to={isAuthenticated ? "/real-time" : "/login"}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={(e) => {
                setIsOpen(false)
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access real-time data')
                  navigate('/login')
                }
              }}
            >
              {t('nav.realTime')}
            </Link>
            <Link
              to={isAuthenticated ? "/forecast" : "/login"}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={(e) => {
                setIsOpen(false)
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access forecast data')
                  navigate('/login')
                }
              }}
            >
              {t('nav.forecast')}
            </Link>
            <Link
              to={isAuthenticated ? "/education" : "/login"}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={(e) => {
                setIsOpen(false)
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error('Please login to access education content')
                  navigate('/login')
                }
              }}
            >
              {t('nav.education')}
            </Link>
            
            {!isAuthenticated && (
              <div className="border-t pt-2 mt-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md mx-3 mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar