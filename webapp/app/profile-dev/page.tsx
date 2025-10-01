"use client";

// import ProfileDev from '@/components/profile-dev';
// import { ProtectedRoute } from '@/contexts/AuthContext';
import React, { useState, useEffect } from 'react'
import type { DeveloperProfile, Certificate, Product } from '@/types'
import { getCurrentDeveloperProfile } from '@/data/mockDeveloperProfiles'
import Avatar from '@/components/Avatar'
import SmartImage from '@/components/SmartImage'
import { useRouter } from 'next/navigation'

export default function ProfileDevPage() {
  const router = useRouter()

  // State management cho profile data
  const [profile, setProfile] = useState<DeveloperProfile | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'products' | 'certificates' | 'settings'>('overview')
  const [formData, setFormData] = useState<Partial<DeveloperProfile>>({})

  /**
   * Load profile data khi component mount
   */
  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        // Simulate API call với delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        const currentProfile = getCurrentDeveloperProfile()
        setProfile(currentProfile)
        setFormData(currentProfile)
      } catch (error) {
        console.error('Lỗi khi tải thông tin profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  /**
   * Xử lý lưu thông tin profile
   */
  const handleSave = async (): Promise<void> => {
    if (!profile) return

    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const updatedProfile: DeveloperProfile = {
        ...profile,
        ...formData,
        updatedAt: new Date()
      }

      setProfile(updatedProfile)
      setIsEditing(false)
      alert('Cập nhật thông tin thành công!')
    } catch (error) {
      console.error('Lỗi khi lưu thông tin:', error)
      alert('Có lỗi xảy ra khi cập nhật thông tin!')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Hủy chỉnh sửa và reset form data
   */
  const handleCancel = (): void => {
    setFormData(profile || {})
    setIsEditing(false)
  }

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
   * Lấy màu sắc cho trạng thái availability
   * @param status - Trạng thái availability
   * @returns CSS class cho màu sắc
   */
  const getAvailabilityColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      unavailable: 'bg-red-100 text-red-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Lấy text hiển thị cho trạng thái availability
   * @param status - Trạng thái availability
   * @returns Text tiếng Việt
   */
  const getAvailabilityText = (status: string): string => {
    const statusTexts: Record<string, string> = {
      available: 'Sẵn sàng nhận việc',
      busy: 'Đang bận',
      unavailable: 'Không khả dụng'
    }
    return statusTexts[status] || 'Chưa cập nhật'
  }

  /**
   * Lấy màu sắc cho trạng thái verification
   * @param status - Trạng thái verification
   * @returns CSS class cho màu sắc
   */
  const getVerificationColor = (status: string): string => {
    const verificationColors: Record<string, string> = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return verificationColors[status] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Điều hướng đến trang quản lý sản phẩm
   */
  const handleManageProducts = (): void => {
    router.push('/manage-products')
  }

  /**
   * Điều hướng đến trang tạo sản phẩm mới
   */
  const handleCreateProduct = (): void => {
    router.push('/create-product')
  }

  /**
   * Xử lý thay đổi input trong form
   * @param field - Tên field cần update
   * @param value - Giá trị mới
   */
  const handleInputChange = (field: keyof DeveloperProfile, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /**
   * Format ngày tháng theo định dạng Việt Nam
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  // Error state - no profile found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👨‍💻</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy thông tin
          </h3>
          <p className="text-gray-500">
            Vui lòng thử lại sau
          </p>
        </div>
      </div>
    )
  }

  // Tab navigation configuration
  const tabConfig = [
    { id: 'overview', label: 'Tổng quan', icon: '📊' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'products', label: 'Sản phẩm', icon: '🛍️' },
    { id: 'certificates', label: 'Chứng chỉ', icon: '🏆' },
    { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
  ] as const

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar
                    src={profile.avatar}
                    name={profile.fullName}
                    size="xl"
                    className="border-2 border-gray-200"
                  />
                  <div className="absolute -top-2 -right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(profile.verificationStatus)}`}>
                      ✓
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                  <p className="text-gray-600 mb-2">{profile.title} • {profile.location}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(profile.availability)}`}>
                      {getAvailabilityText(profile.availability)}
                    </span>
                    <span className="flex items-center text-gray-500">
                      ⭐ {profile.rating}/5 ({profile.completedProjects} dự án)
                    </span>
                    <span className="text-gray-500">{profile.experience} năm kinh nghiệm</span>
                    <span className="text-gray-500">{formatCurrency(profile.hourlyRate)}/giờ</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleManageProducts}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Quản lý sản phẩm</span>
                </button>

                <button
                  onClick={handleCreateProduct}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Đăng sản phẩm mới</span>
                </button>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Chỉnh sửa</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      type="button"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      type="button"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Lưu</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" role="tablist">
              {tabConfig.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-4 text-sm font-medium border-b-2 ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{profile.totalProjects}</p>
                      <p className="text-gray-500 text-sm">Tổng dự án</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{profile.completedProjects}</p>
                      <p className="text-gray-500 text-sm">Đã hoàn thành</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{profile.rating}</p>
                      <p className="text-gray-500 text-sm">Đánh giá</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{profile.products.length}</p>
                      <p className="text-gray-500 text-sm">Sản phẩm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleCreateProduct}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
                    type="button"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🛍️</div>
                      <p className="text-gray-600 group-hover:text-green-600">Đăng sản phẩm mới</p>
                    </div>
                  </button>

                  <button
                    onClick={handleManageProducts}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                    type="button"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📦</div>
                      <p className="text-gray-600 group-hover:text-blue-600">Quản lý sản phẩm</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                    type="button"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💼</div>
                      <p className="text-gray-600 group-hover:text-gray-600">Cập nhật Portfolio</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Developer Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Giới thiệu</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{profile.bio}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">📧 Email:</span>
                      <span className="ml-2 text-gray-900">{profile.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">📱 Điện thoại:</span>
                      <span className="ml-2 text-gray-900">{profile.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">📍 Địa điểm:</span>
                      <span className="ml-2 text-gray-900">{profile.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">⏱️ Thời gian phản hồi:</span>
                      <span className="ml-2 text-gray-900">{profile.responseTime}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Kỹ năng</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ngôn ngữ</h3>
                  <div className="space-y-3">
                    {profile.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-900">{lang.name}</span>
                        <span className="text-sm text-gray-500 capitalize">{lang.level}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Liên kết</h4>
                    <div className="space-y-2">
                      {profile.socialLinks.github && (
                        <a
                          href={profile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <span className="mr-2">🐙</span> GitHub
                        </a>
                      )}
                      {profile.socialLinks.linkedin && (
                        <a
                          href={profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <span className="mr-2">💼</span> LinkedIn
                        </a>
                      )}
                      {profile.socialLinks.portfolio && (
                        <a
                          href={profile.socialLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <span className="mr-2">🌐</span> Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Portfolio</h3>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  type="button"
                >
                  Thêm dự án
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.portfolio.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{item.technologies.length - 3}
                          </span>
                        )}
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Xem demo →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Sản phẩm đang bán</h3>
                <button
                  onClick={handleCreateProduct}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  type="button"
                >
                  Đăng sản phẩm mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.products.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{product.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.techStack.slice(0, 3).map(tech => (
                          <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                            type="button"
                          >
                            Chỉnh sửa
                          </button>
                          {product.liveUrl && (
                            <a
                              href={product.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              Xem
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Chứng chỉ & Bằng cấp</h3>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  type="button"
                >
                  Thêm chứng chỉ
                </button>
              </div>

              <div className="space-y-8">
                {/* Education Section */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Học vấn</h4>
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{edu.degree} - {edu.field}</h5>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">Năm tốt nghiệp: {edu.graduationYear}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates Section */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Chứng chỉ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.certificates.map(cert => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{cert.name}</h5>
                            <p className="text-gray-600 text-sm">{cert.issuer}</p>
                          </div>
                          {cert.verified && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              ✓ Xác minh
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Cấp ngày: {formatDate(cert.issuedDate)}</p>
                          {cert.expiryDate && (
                            <p>Hết hạn: {formatDate(cert.expiryDate)}</p>
                          )}
                          {cert.credentialId && (
                            <p>ID: {cert.credentialId}</p>
                          )}
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                          >
                            Xác minh chứng chỉ →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Thông tin cá nhân</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ tên *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chức danh
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa điểm
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá theo giờ (VND)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.hourlyRate || ''}
                        onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formatCurrency(profile.hourlyRate)}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu bản thân
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả về kinh nghiệm, kỹ năng và mục tiêu nghề nghiệp của bạn..."
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio}</p>
                  )}
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Cài đặt tài khoản</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Thông báo email</h4>
                      <p className="text-sm text-gray-500">Nhận thông báo về dự án mới và tin nhắn</p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                      type="button"
                    >
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Hiển thị trạng thái hoạt động</h4>
                      <p className="text-sm text-gray-500">Cho phép clients thấy khi bạn online</p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
                      type="button"
                    >
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
                <h3 className="text-lg font-medium text-red-900 mb-4">Vùng nguy hiểm</h3>
                <p className="text-sm text-red-600 mb-4">
                  Các hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.
                </p>
                <div className="space-y-3">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    type="button"
                  >
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
  // return (
  //   <ProtectedRoute requiredRole="developer">
  //     <ProfileDev />
  //   </ProtectedRoute>
  // );
}
