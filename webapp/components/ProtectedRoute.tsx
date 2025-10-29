'use client'

import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Role } from '@/types/user.type'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: Role
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
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Redirect nếu chưa đăng nhập
      if (!user) {
        console.log('ProtectedRoute: User not authenticated, redirecting to', fallbackPath)
        router.push(fallbackPath)
        return
      }

      // Redirect nếu role không khớp
      if (requiredRole && user.role !== requiredRole) {
        console.log(`ProtectedRoute: User role ${user.role} doesn't match required ${requiredRole}`)
        router.push('/')
        return
      }
    }
  }, [user, isLoading, requiredRole, fallbackPath, router])

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

  // Không render gì nếu chưa đăng nhập hoặc không đủ quyền
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null
  }

  console.log('ProtectedRoute: Access granted for user', user.email, 'role', user.role)
  return <>{children}</>
}

export default ProtectedRoute
