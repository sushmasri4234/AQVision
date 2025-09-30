import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useStore'
import { toast } from 'react-hot-toast'

const AuthGuard = ({ children, requireAuth = true, message = "Please login to access this feature" }) => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (requireAuth && !isAuthenticated) {
      e.preventDefault()
      toast.error(message)
      navigate('/login')
      return false
    }
    return true
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <span onClick={handleClick} className="cursor-pointer">
        {children}
      </span>
    )
  }

  return children
}

export default AuthGuard