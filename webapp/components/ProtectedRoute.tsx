import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'developer' | 'employer' | 'admin'
  fallbackPath?: string
}

/**
 * Component bảo vệ route yêu cầu authentication
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/login' 
}) => {
  const { user, isLoading } = useAuth()

  // Hiển thị loading khi đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Redirect nếu chưa đăng nhập
  if (!user) {
    console.log('ProtectedRoute: User not authenticated, redirecting to', fallbackPath)
    return <Navigate to={fallbackPath} replace />
  }

  // Redirect nếu role không khớp
  if (requiredRole && user.role !== requiredRole) {
    console.log(`ProtectedRoute: User role ${user.role} doesn't match required ${requiredRole}`)
    return <Navigate to="/" replace />
  }

  console.log('ProtectedRoute: Access granted for user', user.email, 'role', user.role)
  return <>{children}</>
}

export default ProtectedRoute
