import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Role } from '@/types/user.type'

/**
 * Component hiển thị thông tin user hiện tại và các demo functions
 * Dành cho testing và development
 */
const UserInfo: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  
  const isDeveloper = user?.role === Role.DEVELOPER
  const isEmployer = user?.role === Role.CUSTOMER
  const isAdmin = user?.role === Role.ADMIN
  const role = user?.role

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 m-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Trạng thái đăng nhập
        </h3>
        <p className="text-gray-600">Chưa đăng nhập</p>
        <a
          href="/login"
          className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Đăng nhập
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 m-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Thông tin người dùng
        </h3>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Avatar và tên */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user?.fullname?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {user?.fullname || user?.email?.split('@')[0] || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Role và privileges */}
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Role:</span> 
            <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
              role === Role.ADMIN ? 'bg-purple-100 text-purple-800' :
              role === Role.DEVELOPER ? 'bg-green-100 text-green-800' :
              role === Role.CUSTOMER ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {role}
            </span>
          </p>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>✓ isDeveloper: {isDeveloper ? 'true' : 'false'}</p>
            <p>✓ isEmployer: {isEmployer ? 'true' : 'false'}</p>
            <p>✓ isAdmin: {isAdmin ? 'true' : 'false'}</p>
          </div>
        </div>

        {/* Developer specific info - commented out as profile is not available in User type */}
        {/* {isDeveloper && (
          <div className="bg-green-50 rounded p-3">
            <p className="text-sm font-medium text-green-800 mb-2">Developer Profile</p>
            <div className="text-xs text-green-700 space-y-1">
              <p>Profile information needs to be fetched separately</p>
            </div>
          </div>
        )} */}

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {isDeveloper && (
            <>
              <a
                href="/profile-dev"
                className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
              >
                Hồ sơ
              </a>
              <a
                href="/manage-post"
                className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
              >
                Quản lý dự án
              </a>
            </>
          )}
          
          {isEmployer && (
            <>
              <a
                href="/profile-employer"
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
              >
                Hồ sơ công ty
              </a>
              <a
                href="/post-project"
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
              >
                Đăng dự án
              </a>
            </>
          )}
          
          {isAdmin && (
            <a
              href="/admin"
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors"
            >
              Quản trị
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserInfo
