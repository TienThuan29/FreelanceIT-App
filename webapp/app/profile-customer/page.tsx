"use client";

// import React from "react";
// import ProfileEmployer from '@/components/profile-employer';
// import { ProtectedRoute } from '@/contexts/AuthContext';

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { mockProjects } from '@/data/mockProjects'
import type { EmployerProfile } from '@/data/mockEmployerProfiles'
import { getEmployerProfileByEmail } from '@/data/mockEmployerProfiles'


export default function ProfileEmployerPage() {
  const { user } = useAuth()
  const router = useRouter()

  // State management
  const [profile, setProfile] = useState<EmployerProfile | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'company' | 'settings'>('overview')
  const [formData, setFormData] = useState<Partial<EmployerProfile>>({})

  // Lấy dự án của user hiện tại
  const userProjects = mockProjects.filter(project => project.clientId === (user?.id || 'client1'))

  /**
   * Load profile từ authentication system hoặc fallback data
   */
  const createMockProfile = (): EmployerProfile => {
    const completedProjectsCount = userProjects.filter(p => p.status === 'completed').length
    const averageBudgetValue = userProjects.length > 0
      ? userProjects.reduce((sum, p) => sum + p.budget, 0) / userProjects.length
      : 0

    // Ưu tiên lấy từ employerProfile trong authentication system
    if (user?.employerProfile) {
      return {
        ...user.employerProfile,
        totalProjects: userProjects.length,
        completedProjects: completedProjectsCount,
        averageBudget: averageBudgetValue,
        updatedAt: new Date()
      }
    }

    // Fallback: tìm theo email
    if (user?.email) {
      const profileByEmail = getEmployerProfileByEmail(user.email)
      if (profileByEmail) {
        return {
          ...profileByEmail,
          totalProjects: userProjects.length,
          completedProjects: completedProjectsCount,
          averageBudget: averageBudgetValue,
          updatedAt: new Date()
        }
      }
    }

    // Default fallback profile
    return {
      id: 'employer_default',
      companyName: 'My Company',
      companyLogo: 'https://via.placeholder.com/150x150/6B7280/ffffff?text=MC',
      email: user?.email || 'contact@company.com',
      phone: '0123456789',
      website: 'https://mycompany.com',
      address: '123 Business Street',
      city: 'Hồ Chí Minh',
      industry: 'Technology',
      companySize: '11-50 employees',
      founded: '2023',
      description: 'Công ty công nghệ chuyên nghiệp, tập trung vào việc phát triển các giải pháp phần mềm chất lượng cao.',
      benefits: [
        'Lương thưởng cạnh tranh',
        'Bảo hiểm y tế',
        'Môi trường làm việc tốt',
        'Cơ hội phát triển'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/company/mycompany'
      },
      verificationStatus: 'pending',
      rating: 0,
      totalProjects: userProjects.length,
      completedProjects: completedProjectsCount,
      averageBudget: averageBudgetValue,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Load profile data khi component mount
   */
  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        // Simulate API call với delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        const mockProfile = createMockProfile()
        setProfile(mockProfile)
        setFormData(mockProfile)
      } catch (error) {
        console.error('Lỗi khi tải thông tin profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userProjects])

  /**
   * Xử lý lưu thông tin profile
   */
  const handleSave = async (): Promise<void> => {
    if (!profile) return

    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const updatedProfile: EmployerProfile = {
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
   * Lấy text hiển thị cho trạng thái verification
   * @param status - Trạng thái verification
   * @returns Text tiếng Việt
   */
  const getVerificationText = (status: string): string => {
    const verificationTexts: Record<string, string> = {
      verified: 'Đã xác minh',
      pending: 'Chờ xác minh',
      rejected: 'Bị từ chối'
    }
    return verificationTexts[status] || 'Chưa xác minh'
  }

  /**
   * Điều hướng đến trang quản lý dự án
   */
  const handleManageProjects = (): void => {
    router.push('/manage-post')
  }

  /**
   * Điều hướng đến trang tạo dự án mới
   */
  const handleCreateProject = (): void => {
    router.push('/manage-post?action=create')
  }

  /**
   * Xử lý thay đổi input trong form
   * @param field - Tên field cần update
   * @param value - Giá trị mới
   */
  const handleInputChange = (field: keyof EmployerProfile, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /**
   * Xử lý thay đổi social links
   * @param platform - Platform social media
   * @param value - URL mới
   */
  const handleSocialLinkChange = (platform: keyof EmployerProfile['socialLinks'], value: string): void => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  /**
   * Xử lý thay đổi benefits
   * @param index - Index của benefit
   * @param value - Giá trị mới
   */
  const handleBenefitChange = (index: number, value: string): void => {
    const newBenefits = [...(formData.benefits || [])]
    newBenefits[index] = value
    setFormData(prev => ({ ...prev, benefits: newBenefits }))
  }

  /**
   * Thêm benefit mới
   */
  const addBenefit = (): void => {
    setFormData(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), '']
    }))
  }

  /**
   * Xóa benefit
   * @param index - Index của benefit cần xóa
   */
  const removeBenefit = (index: number): void => {
    const newBenefits = (formData.benefits || []).filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, benefits: newBenefits }))
  }

  // Tab navigation configuration
  const tabConfig = [
    { id: 'overview', label: 'Tổng quan', icon: '📊' },
    { id: 'company', label: 'Thông tin công ty', icon: '🏢' },
    { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
  ] as const

  // Social media configuration
  const socialMediaConfig = [
    { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/company/...' },
    { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/...' },
    { key: 'twitter', label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/...' },
    { key: 'github', label: 'GitHub', icon: '🐙', placeholder: 'https://github.com/...' }
  ] as const

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
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={profile.companyLogo || 'https://via.placeholder.com/100'}
                    alt={`Logo của ${profile.companyName}`}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <div className="absolute -top-2 -right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(profile.verificationStatus)}`}>
                      {getVerificationText(profile.verificationStatus)}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.companyName}</h1>
                  <p className="text-gray-600 mb-2">{profile.industry} • {profile.city}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {profile.rating}/5 ({profile.totalProjects} dự án)
                    </span>
                    <span>Thành lập {profile.founded}</span>
                    <span>{profile.companySize}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleManageProjects}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Quản lý dự án</span>
                </button>

                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Đăng dự án mới</span>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{profile.completedProjects}</p>
                      <p className="text-gray-500 text-sm">Hoàn thành</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(profile.averageBudget)}</p>
                      <p className="text-gray-500 text-sm">Ngân sách TB</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {profile.totalProjects > 0 ? Math.round((profile.completedProjects / profile.totalProjects) * 100) : 0}%
                      </p>
                      <p className="text-gray-500 text-sm">Tỷ lệ thành công</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleCreateProject}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
                    type="button"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                      <p className="text-gray-600 group-hover:text-green-600">Đăng dự án mới</p>
                    </div>
                  </button>

                  <button
                    onClick={handleManageProjects}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                    type="button"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                      <p className="text-gray-600 group-hover:text-blue-600">Quản lý dự án</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('company')}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                    type="button"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏢</div>
                      <p className="text-gray-600 group-hover:text-gray-600">Cập nhật thông tin</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Company Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Về công ty</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{profile.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">🏭 Ngành nghề:</span>
                      <span className="ml-2 text-gray-900">{profile.industry}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">👥 Quy mô:</span>
                      <span className="ml-2 text-gray-900">{profile.companySize}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">📅 Thành lập:</span>
                      <span className="ml-2 text-gray-900">{profile.founded}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">📍 Địa điểm:</span>
                      <span className="ml-2 text-gray-900">{profile.city}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quyền lợi</h3>
                  <div className="space-y-3">
                    {profile.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Liên kết</h4>
                    <div className="space-y-2">
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
                      {profile.socialLinks.facebook && (
                        <a
                          href={profile.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <span className="mr-2">📘</span> Facebook
                        </a>
                      )}
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <span className="mr-2">🌐</span> Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Thông tin công ty</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên công ty *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{profile.companyName}</p>
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
                      required
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
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profile.website}
                        </a>
                      ) : (
                        'Chưa có'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{profile.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thành phố *
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn thành phố</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngành nghề *
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.industry || ''}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn ngành nghề</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="AI/Machine Learning">AI/Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Game Development">Game Development</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="IoT">IoT</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.industry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quy mô công ty *
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.companySize || ''}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn quy mô</option>
                      <option value="1-10 employees">1-10 nhân viên</option>
                      <option value="11-50 employees">11-50 nhân viên</option>
                      <option value="51-200 employees">51-200 nhân viên</option>
                      <option value="201-500 employees">201-500 nhân viên</option>
                      <option value="500+ employees">500+ nhân viên</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.companySize}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả công ty
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả về công ty, văn hóa làm việc, sứ mệnh..."
                  />
                ) : (
                  <p className="text-gray-900">{profile.description}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quyền lợi
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {(formData.benefits || []).map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập quyền lợi..."
                        />
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1 mt-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Thêm quyền lợi</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.benefits.map((benefit, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Social Links */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Liên kết xã hội</h3>

                <div className="space-y-4">
                  {socialMediaConfig.map(social => (
                    <div key={social.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {social.icon} {social.label}
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.socialLinks?.[social.key] || ''}
                          onChange={(e) => handleSocialLinkChange(social.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={social.placeholder}
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profile.socialLinks[social.key] ? (
                            <a
                              href={profile.socialLinks[social.key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {profile.socialLinks[social.key]}
                            </a>
                          ) : (
                            'Chưa có'
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Cài đặt tài khoản</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Thông báo email</h4>
                      <p className="text-sm text-gray-500">Nhận thông báo khi có freelancer apply</p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      type="button"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Hiển thị công khai</h4>
                      <p className="text-sm text-gray-500">Cho phép freelancer xem profile công ty</p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      type="button"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
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
  //   <ProtectedRoute requiredRole="employer">
  //     <ProfileEmployer />
  //   </ProtectedRoute>
  // );
}
