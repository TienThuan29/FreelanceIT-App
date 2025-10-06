"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import type { Product, Developer } from '@/types'
import SmartImage from '../../components/SmartImage'
import { 
  mockProducts,
  getProductsStats
} from '../../data/mockProducts'
import { useRouter } from 'next/navigation'

/**
 * Interface cho filter sản phẩm
 */
interface ProductFilter {
  search: string
  category: string
  techStack: string
  priceRange: string
  sortBy: string
}

/**
 * Component hiển thị danh sách sản phẩm từ developers
 * @returns JSX.Element
 */
const Page: React.FC = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<ProductFilter>({
    search: '',
    category: 'all',
    techStack: '',
    priceRange: 'all',
    sortBy: 'newest'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  /**
   * Load dữ liệu sản phẩm khi component mount
   */
  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        setLoading(true)
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProducts(mockProducts)
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  /**
   * Filter và sort sản phẩm
   */
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(filter.search.toLowerCase()) ||
                         product.description.toLowerCase().includes(filter.search.toLowerCase()) ||
                         product.developer.name.toLowerCase().includes(filter.search.toLowerCase())
    const matchesCategory = filter.category === 'all' || product.category === filter.category
    const matchesTechStack = filter.techStack === '' || 
                            product.techStack.some(tech => tech.toLowerCase().includes(filter.techStack.toLowerCase()))
    const matchesPriceRange = (() => {
      switch (filter.priceRange) {
        case 'under-10m': return product.price < 10000000
        case '10m-30m': return product.price >= 10000000 && product.price <= 30000000
        case 'over-30m': return product.price > 30000000
        default: return true
      }
    })()
    
    return matchesSearch && matchesCategory && matchesTechStack && matchesPriceRange
  }).sort((a, b) => {
    switch (filter.sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'price_low':
        return a.price - b.price
      case 'price_high':
        return b.price - a.price
      case 'rating':
        return b.developer.rating - a.developer.rating
      default:
        return 0
    }
  })

  /**
   * Format số tiền theo định dạng VND
   * @param amount - Số tiền cần format
   * @returns Chuỗi đã format
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  /**
   * Format ngày tháng
   * @param date - Date object cần format
   * @returns Chuỗi ngày đã format
   */
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  /**
   * Lấy label cho category
   * @param category - Category string
   * @returns Label đã translate
   */
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'website': return 'Website'
      case 'mobile': return 'Mobile App'
      case 'software': return 'Software'
      case 'template': return 'Template'
      default: return category
    }
  }

  /**
   * Xử lý điều hướng đến trang chi tiết sản phẩm
   * @param productId - ID của sản phẩm cần xem chi tiết
   */
  const handleViewProductDetail = (productId: string): void => {
    router.push(`/products-detail/${productId}`)
  }

  /**
   * Xử lý xem demo sản phẩm
   * @param url - URL demo của sản phẩm
   */
  const handleViewDemo = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  /**
   * Xử lý reset filter
   */
  const handleResetFilter = (): void => {
    setFilter({
      search: '',
      category: 'all',
      techStack: '',
      priceRange: 'all',
      sortBy: 'newest'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  const stats = getProductsStats()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sản phẩm từ Developers
          </h1>
          <p className="text-gray-600">
            Khám phá các sản phẩm chất lượng cao được phát triển bởi freelancers tài năng
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Tổng sản phẩm</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.byCategory.website}</div>
            <div className="text-sm text-gray-500">Websites</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.byCategory.mobile}</div>
            <div className="text-sm text-gray-500">Mobile Apps</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.byCategory.software}</div>
            <div className="text-sm text-gray-500">Software</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm sản phẩm, developer..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="website">Website</option>
                <option value="mobile">Mobile App</option>
                <option value="software">Software</option>
                <option value="template">Template</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Công nghệ
              </label>
              <input
                type="text"
                placeholder="React, Flutter..."
                value={filter.techStack}
                onChange={(e) => setFilter(prev => ({ ...prev, techStack: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá
              </label>
              <select
                value={filter.priceRange}
                onChange={(e) => setFilter(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="under-10m">Dưới 10 triệu</option>
                <option value="10m-30m">10-30 triệu</option>
                <option value="over-30m">Trên 30 triệu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price_low">Giá thấp đến cao</option>
                <option value="price_high">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                type="button"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                type="button"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
            </p>
            <button
              onClick={handleResetFilter}
              className="text-gray-600 hover:text-gray-800 text-sm"
              type="button"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-500">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                {/* Product Image */}
                <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full'}`}>
                  <SmartImage
                    src={product.images[0]}
                    alt={product.title}
                    className={`w-full object-cover cursor-pointer ${viewMode === 'list' ? 'h-48 rounded-l-lg' : 'h-48 rounded-t-lg'}`}
                    onClick={() => handleViewProductDetail(product.id)}
                    type="product"
                    fallbackName={product.title}
                  />
                </div>

                {/* Product Content */}
                <div className={`p-6 ${viewMode === 'list' ? 'w-2/3 flex flex-col' : ''}`}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {getCategoryLabel(product.category)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(product.createdAt)}
                        </span>
                      </div>
                      <h3 
                        className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleViewProductDetail(product.id)}
                      >
                        {product.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.techStack.slice(0, 4).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {product.techStack.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{product.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Developer Info */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={product.developer.avatar}
                      alt={product.developer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {product.developer.name}
                        </h4>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className="text-xs text-gray-600 ml-1">
                            {product.developer.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {product.developer.experience} năm kinh nghiệm • {product.developer.completedProjects} dự án
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${product.developer.isAvailable ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  </div>

                  {/* Price and Actions */}
                  <div className={`flex justify-between items-center ${viewMode === 'list' ? 'mt-auto' : ''}`}>
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {product.liveUrl && (
                        <button
                          onClick={() => handleViewDemo(product.liveUrl!)}
                          className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                          type="button"
                        >
                          Demo
                        </button>
                      )}
                      <button 
                        onClick={() => handleViewProductDetail(product.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        type="button"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-8">
            <button 
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              type="button"
            >
              Xem thêm sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page