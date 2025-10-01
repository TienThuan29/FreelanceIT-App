'use client'

import React, { useState, useEffect } from 'react'
import type { ProductDetail, ProductReview, Product } from '@/types'
import SmartImage from '@/components/SmartImage'
import { 
  getProductDetailById, 
  getRelatedProducts
} from '@/data/mockProductDetails'
import { mockProducts, getProductsStats } from '@/data/mockProducts'
import { useRouter, useSearchParams } from 'next/navigation'

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
 * Component hiển thị chi tiết sản phẩm và danh sách sản phẩm
 * @returns JSX.Element
 */
const ProductsDetail: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [filter, setFilter] = useState<ProductFilter>({
    search: '',
    category: 'all',
    techStack: '',
    priceRange: 'all',
    sortBy: 'newest'
  })

  /**
   * Load dữ liệu sản phẩm khi component mount
   */
  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (productId) {
          const product = getProductDetailById(productId)
          setSelectedProduct(product || null)
        } else {
          setProducts(mockProducts)
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [productId])

  /**
   * Filter và sort sản phẩm
   */
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(filter.search.toLowerCase()) ||
                         product.description.toLowerCase().includes(filter.search.toLowerCase())
    const matchesCategory = filter.category === 'all' || product.category === filter.category
    const matchesTechStack = !filter.techStack || 
                            product.techStack.some(tech => 
                              tech.toLowerCase().includes(filter.techStack.toLowerCase())
                            )
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
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'popular': return (b.views || 0) - (a.views || 0)
      case 'rating': return b.developer.rating - a.developer.rating
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  /**
   * Tính rating trung bình của sản phẩm
   * @param reviews - Danh sách đánh giá
   * @returns Rating trung bình
   */
  const calculateAverageRating = (reviews?: ProductReview[]): number => {
    if (!reviews || reviews.length === 0) return 0
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }

  /**
   * Render stars cho rating
   * @param rating - Số rating
   * @returns JSX element
   */
  const renderStars = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  /**
   * Xử lý mua sản phẩm - chuyển đến trang thanh toán
   * @param product - Sản phẩm cần mua
   */
  const handlePurchase = (product: Product | ProductDetail): void => {
    // Không cần kiểm tra đăng nhập, chuyển thẳng đến trang thanh toán
    router.push(`/checkout?productId=${product.id}`)
  }

  /**
   * Check if this product has been purchased (based on localStorage only)
   */
  const hasPurchased = (productId: string): boolean => {
    const purchases = JSON.parse(localStorage.getItem('all_purchases') || '[]')
    return purchases.some((purchase: any) => 
      purchase.productId === productId && 
      purchase.status === 'completed'
    )
  }

  const handleViewDemo = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer')
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

  // Product Detail View
  if (selectedProduct) {
    const relatedProducts = getRelatedProducts(selectedProduct.id)
    const averageRating = calculateAverageRating(selectedProduct.reviews)

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <button 
              onClick={() => router.push('/products-detail')}
              className="hover:text-blue-600"
            >
              Sản phẩm
            </button>
            <span>/</span>
            <span className="text-gray-900">{selectedProduct.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Images */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Main Image */}
                <div className="aspect-video relative group">
                  <SmartImage
                    src={selectedProduct.images[activeImageIndex]}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                    type="product"
                    fallbackName={selectedProduct.title}
                  />
                  
                  {/* Navigation Arrows */}
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex((prev) => 
                          prev === 0 ? selectedProduct.images.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setActiveImageIndex((prev) => 
                          prev === selectedProduct.images.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {activeImageIndex + 1} / {selectedProduct.images.length}
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:border-blue-300 ${
                          activeImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                        }`}
                      >
                        <SmartImage
                          src={image}
                          alt={`${selectedProduct.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          type="product"
                          fallbackName={`${selectedProduct.title} ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  {/* Fullscreen Button */}
                  <div className="mt-3 text-center">
                    <button
                      onClick={() => {
                        // Toggle fullscreen view - có thể implement modal sau
                        console.log('Open fullscreen gallery')
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span>Xem toàn màn hình</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả sản phẩm</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{selectedProduct.description}</p>

                {/* Features */}
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tính năng nổi bật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {selectedProduct.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <h3 className="text-lg font-medium text-gray-900 mb-3">Công nghệ sử dụng</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProduct.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Documentation */}
                {selectedProduct.documentation && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Tài liệu hướng dẫn</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {selectedProduct.documentation.substring(0, 500)}...
                      </pre>
                      <button className="text-blue-600 hover:text-blue-800 text-sm mt-2">
                        Xem tài liệu đầy đủ →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Đánh giá ({selectedProduct.reviews.length})
                  </h2>
                  <div className="flex items-center space-x-4">
                    {renderStars(averageRating)}
                    <button
                      onClick={() => alert('Tính năng viết đánh giá sẽ được phát triển trong phiên bản tiếp theo')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Viết đánh giá
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedProduct.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <SmartImage
                          src={review.userAvatar || ''}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full"
                          type="avatar"
                          fallbackName={review.userName}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                            {review.verified && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Đã mua
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <button className="text-sm text-gray-500 hover:text-gray-700">
                            👍 Hữu ích ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(selectedProduct.price)}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>👁️ {selectedProduct.views} lượt xem</span>
                  <span>⬇️ {selectedProduct.downloads} lượt tải</span>
                  <span>❤️ {selectedProduct.likes} lượt thích</span>
                </div>

                <div className="space-y-3 mb-6">
                  {hasPurchased(selectedProduct.id) ? (
                    <div className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-lg text-center font-medium">
                      ✅ Đã mua sản phẩm này
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(selectedProduct)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Mua ngay
                    </button>
                  )}
                  
                  {/* <button
                    onClick={() => navigate(`/nda-contract?productId=${selectedProduct.id}&type=product&partnerId=${selectedProduct.developer.id}`)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    📋 Tạo hợp đồng NDA
                  </button> */}
                  
                  {selectedProduct.liveUrl && (
                    <button
                      onClick={() => handleViewDemo(selectedProduct.liveUrl!)}
                      className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Xem Demo
                    </button>
                  )}

                  {selectedProduct.githubUrl && (
                    <button
                      onClick={() => handleViewDemo(selectedProduct.githubUrl!)}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      🐙 GitHub
                    </button>
                  )}
                </div>

                {/* Demo Credentials */}
                {selectedProduct.demoCredentials && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Tài khoản demo:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Username: <code className="bg-white px-2 py-1 rounded">{selectedProduct.demoCredentials.username}</code></div>
                      <div>Password: <code className="bg-white px-2 py-1 rounded">{selectedProduct.demoCredentials.password}</code></div>
                    </div>
                  </div>
                )}

                {/* Product Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Loại sản phẩm:</span>
                    <span className="text-gray-900 capitalize">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày tạo:</span>
                    <span className="text-gray-900">{formatDate(selectedProduct.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cập nhật:</span>
                    <span className="text-gray-900">{formatDate(selectedProduct.updatedAt || selectedProduct.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">License:</span>
                    <span className="text-gray-900 capitalize">{selectedProduct.license.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Support:</span>
                    <span className="text-gray-900">
                      {selectedProduct.support.included ? selectedProduct.support.duration : 'Không có'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Developer Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-4">Về nhà phát triển</h3>
                <div className="flex items-start space-x-3 mb-4">
                  <SmartImage
                    src={selectedProduct.developer.avatar}
                    alt={selectedProduct.developer.name}
                    className="w-12 h-12 rounded-full"
                    type="avatar"
                    fallbackName={selectedProduct.developer.name}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{selectedProduct.developer.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{selectedProduct.developer.location}</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedProduct.developer.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {selectedProduct.developer.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kinh nghiệm:</span>
                    <span className="text-gray-900">{selectedProduct.developer.experience} năm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dự án hoàn thành:</span>
                    <span className="text-gray-900">{selectedProduct.developer.completedProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className={`${
                      selectedProduct.developer.isAvailable ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {selectedProduct.developer.isAvailable ? 'Có sẵn' : 'Bận'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/profile-dev?id=${selectedProduct.developer.id}`)}
                  className="w-full mt-4 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  Xem hồ sơ developer
                </button>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-3">Yêu cầu hệ thống</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedProduct.requirements.map((req, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-3">Tương thích</h3>
                <div className="space-y-2">
                  {selectedProduct.compatibility.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <SmartImage
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                      type="product"
                      fallbackName={product.title}
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                        <button
                          onClick={() => router.push(`/products-detail/${product.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Xem chi tiết →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Products List View
  const stats = getProductsStats()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cửa hàng sản phẩm IT
          </h1>
          <p className="text-gray-600">
            Khám phá các sản phẩm chất lượng cao từ cộng đồng developers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Tổng sản phẩm</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalDownloads}</div>
            <div className="text-sm text-gray-500">Lượt tải</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
            <div className="text-sm text-gray-500">Lượt xem</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Đánh giá TB</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Nhập từ khóa..."
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
                <option value="template">Template</option>
                <option value="software">Software</option>
                <option value="mobile">Mobile App</option>
                <option value="website">Website</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Công nghệ
              </label>
              <input
                type="text"
                placeholder="React, Node.js..."
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
                <option value="popular">Phổ biến</option>
                <option value="price-low">Giá thấp</option>
                <option value="price-high">Giá cao</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setFilter({ search: '', category: 'all', techStack: '', priceRange: 'all', sortBy: 'newest' })}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProducts.map(product => {
              const averageRating = calculateAverageRating(product.reviews)
              
              if (viewMode === 'list') {
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-48 h-32 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          {renderStars(averageRating)}
                          <span>👁️ {product.views || 0}</span>
                          <span>⬇️ {product.downloads || 0}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.techStack.slice(0, 4).map(tech => (
                            <span key={tech} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(product.price)}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/products-detail/${product.id}`)}
                              className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => handlePurchase(product)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      {renderStars(averageRating)}
                      <div className="flex space-x-2">
                        <span>👁️ {product.views || 0}</span>
                        <span>⬇️ {product.downloads || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                      {product.techStack.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
                          +{product.techStack.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(product.price)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/products-detail/${product.id}`)}
                          className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => handlePurchase(product)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsDetail