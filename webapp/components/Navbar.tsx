import * as React from 'react'
import SmartImage from './SmartImage'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
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
            <a href="/products-dev" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Sản phẩm
            </a>
            <a href="/post" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Tuyển dụng
            </a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Về chúng tôi
            </a>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
              >
                Đăng nhập
              </a>
              <a
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
              >
                Đăng ký
              </a>
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
              <a
                href="/about"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
              >
                Về chúng tôi
              </a>
              <div className="border-t border-gray-200 pt-4">
                <a
                  href="/login"
                  className="block px-3 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                >
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium mt-2"
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