import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useChatNotifications } from '../hooks/useChatNotifications'
import Avatar from './Avatar'
import SmartImage from './SmartImage'
import { useRoleValidator } from '@/hooks/useRoleValidator'
import { PageUrl } from '@/configs/page.url'

const NavbarAuthenticated: React.FC = () => {

  const { user, logout } = useAuth()
  const { isDeveloper, isCustomer, isAdmin } = useRoleValidator(user)
  const { totalUnread } = useChatNotifications()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  // Lấy tên hiển thị
  const displayName = user?.fullname || user?.email?.split('@')[0] || 'User'
  const avatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3B82F6&color=fff`

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <SmartImage 
                src={'/assets/icon.png'} 
                alt="FreeLanceIT Icon" 
                className="w-10 h-auto"
                type="logo"
                fallbackName="FreeLanceIT"
              />
              <span className="text-xl font-bold text-gray-800">FreeLanceIT</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <a href="/products-dev" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Sản phẩm
            </a>
            <a href="/post" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Tuyển dụng
            </a>
            <a href="/chatbot" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Chatbot AI
            </a>
            
            {/* Role-specific links */}
            {isDeveloper && (
              <>
                <a href="/profile-dev" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Hồ sơ
                </a>
                {/* <a href="/manage-developer-projects" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Quản lý dự án
                </a> */}
                {/* <a href="/nda-contracts" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Hợp đồng NDA
                </a>
                <a href="/purchase-history" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Lịch sử mua hàng
                </a> */}
              </>
            )}
            
            {isCustomer && (
              <>
                <a href="/profile-employer" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Hồ sơ
                </a>
                {/* <a href="/nda-contracts" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Hợp đồng NDA
                </a>
                <a href="/purchase-history" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Lịch sử mua hàng
                </a> */}
                <a href={PageUrl.Customer.PROJECTS_PAGE}className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Dự án
                </a>
              </>
            )}
            
            {isAdmin && (
              <a href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Quản trị
              </a>
            )}

            {/* Chat Notification */}
            <div className="relative">
              <a 
                href="/chatbox" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative"
                title="Tin nhắn"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {/* Dynamic notification badge */}
                {totalUnread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                )}
              </a>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <Avatar
                  src={user?.avatarUrl}
                  name={displayName}
                  size="sm"
                  showOnlineStatus={true}
                  isOnline={true}
                />
                <span className="font-medium">{displayName}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    <div className="font-medium text-gray-900">{displayName}</div>
                    <div className="text-xs">{user?.email}</div>
                    <div className="text-xs text-blue-600 capitalize">{user?.role}</div>
                  </div>
                  
                  {isDeveloper && (
                    <a
                      href="/profile-dev"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Hồ sơ của tôi
                    </a>
                  )}
                  
                  {isCustomer && (
                    <a
                      href="/profile-employer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Hồ sơ công ty
                    </a>
                  )}
                  
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cài đặt
                  </a>
                  
                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-md">
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{displayName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                  <div className="text-xs text-blue-600 capitalize">{user?.role}</div>
                </div>
              </div>

              {/* Navigation Links */}
              <a
                href="/products-dev"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
              >
                Sản phẩm
              </a>
              <a
                href="/post"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
              >
                Tuyển dụng
              </a>
              
              {/* Chat Link */}
              <a
                href="/chatbox"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300 relative"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Tin nhắn</span>
                  {totalUnread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                  )}
                </div>
              </a>
              
              {/* Role-specific links */}
              {isDeveloper && (
                <>
                  <a
                    href="/profile-dev"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                  >
                    Hồ sơ của tôi
                  </a>
                  <a
                    href="/manage-developer-projects"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                  >
                    Quản lý dự án
                  </a>
                </>
              )}
              
              {isCustomer && (
                <>
                  <a
                    href="/profile-employer"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                  >
                    Hồ sơ công ty
                  </a>
                  <a
                    href="/post-project"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                  >
                    Đăng dự án
                  </a>
                </>
              )}
              
              {isAdmin && (
                <a
                  href="/admin"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                >
                  Quản trị
                </a>
              )}
              
              <a
                href="/settings"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
              >
                Cài đặt
              </a>

              {/* Logout */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-300"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavbarAuthenticated
