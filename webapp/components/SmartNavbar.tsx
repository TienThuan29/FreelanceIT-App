import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import NavbarAuthenticated from './NavbarAuthenticated'
import Image from 'next/image'

/**
 * Smart Navbar component tự động chọn navbar phù hợp
 * - Hiển thị Navbar thường nếu chưa đăng nhập
 * - Hiển thị NavbarAuthenticated nếu đã đăng nhập
 */
const SmartNavbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // Hiển thị loading spinner trong khi check auth
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <Image src={'/assets/icon.png'} alt="Icon" className="w-10 h-auto" width={40} height={40} />
                <span className="text-xl font-bold text-gray-800">FreeLanceIT</span>
              </a>
            </div>
            
            {/* Loading indicator */}
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return isAuthenticated ? <NavbarAuthenticated /> : <Navbar />
}

export default SmartNavbar
