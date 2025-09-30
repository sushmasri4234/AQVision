import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useStore'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import RealTime from './pages/RealTime'
import Forecast from './pages/Forecast'
import HealthAlerts from './pages/HealthAlerts'
import Historical from './pages/Historical'
import Education from './pages/Education'
import Settings from './pages/Settings'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/real-time" element={<RealTime />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/alerts" element={
            <ProtectedRoute>
              <HealthAlerts />
            </ProtectedRoute>
          } />
          <Route path="/historical" element={<Historical />} />
          <Route path="/education" element={<Education />} />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  )
}

export default App