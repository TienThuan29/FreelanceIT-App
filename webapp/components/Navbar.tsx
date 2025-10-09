import * as React from 'react'
import SmartImage from './SmartImage'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <SmartImage
                src={'/assets/fulllogo_lightArtboard_1.png'}
                alt="FreeLanceIT Logo"
                className="h-12 w-auto"
                type="logo"
                fallbackName="FreeLanceIT"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <a href="/products-dev" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium">
              Sản phẩm
            </a>
            <a href="/post" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium">
              Tuyển dụng
<<<<<<< HEAD
            </a> */}
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium">
              Giới thiệu
=======
            </a>
            <a href="/chatbox" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Chat
            </a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Về chúng tôi
>>>>>>> e7dce7fb6bab6133a0ecdc66b49e064a2a0c5851
            </a>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
              >
                Đăng nhập
              </a>
              <a
                href="/register"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Đăng ký
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-100 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/products-dev"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-300 font-medium"
              >
                Sản phẩm
              </a>
              <a
                href="/post"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-300 font-medium"
              >
                Tuyển dụng
              </a>
              <a
                href="/chatbox"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
              >
                Chat
              </a>
              <a
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-300 font-medium"
              >
                Giới thiệu
              </a>
              <div className="border-t border-gray-200 pt-4">
                <a
                  href="/login"
                  className="block px-3 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                >
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="block px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium mt-2 text-center shadow-lg"
                >
                  Đăng ký
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar