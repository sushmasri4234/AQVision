import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Users, 
  Upload, 
  BarChart3, 
  Bell, 
  Settings, 
  Database,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import UploadData from './UploadData'

const AdminDashboard = () => {
  const location = useLocation()
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeAlerts: 23,
    dataPoints: 156789,
    modelAccuracy: 87.5
  })

  const navigation = [
    { name: 'Overview', href: '/admin', icon: BarChart3, current: location.pathname === '/admin' },
    { name: 'Users', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
    { name: 'Upload Data', href: '/admin/upload', icon: Upload, current: location.pathname === '/admin/upload' },
    { name: 'Alerts', href: '/admin/alerts', icon: Bell, current: location.pathname === '/admin/alerts' },
    { name: 'Model Metrics', href: '/admin/metrics', icon: TrendingUp, current: location.pathname === '/admin/metrics' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: location.pathname === '/admin/settings' }
  ]

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalUsers.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Alerts</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.activeAlerts}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Database className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Data Points</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.dataPoints.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Model Accuracy</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.modelAccuracy}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New user registered: john@example.com</span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">High AQI alert triggered in Delhi</span>
                <span className="text-xs text-gray-400">15 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Data upload completed: 1,250 readings</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Model retrained successfully</span>
                <span className="text-xs text-gray-400">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="text-sm font-medium text-green-600">125ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Connection</span>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ML Service Status</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cache Hit Rate</span>
                <span className="text-sm font-medium text-blue-600">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, data, and system settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          <nav className="w-64 space-y-1 mr-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/upload" element={<UploadData />} />
              <Route path="/users" element={<div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-semibold">User Management</h2><p className="text-gray-600 mt-2">User management interface would be implemented here.</p></div>} />
              <Route path="/alerts" element={<div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-semibold">Alert Management</h2><p className="text-gray-600 mt-2">Alert management interface would be implemented here.</p></div>} />
              <Route path="/metrics" element={<div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-semibold">Model Metrics</h2><p className="text-gray-600 mt-2">Model performance metrics would be displayed here.</p></div>} />
              <Route path="/settings" element={<div className="bg-white rounded-lg shadow p-6"><h2 className="text-xl font-semibold">System Settings</h2><p className="text-gray-600 mt-2">System configuration options would be available here.</p></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard