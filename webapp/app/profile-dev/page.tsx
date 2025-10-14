"use client";

import React, { useState, useEffect } from 'react'
import type { DeveloperProfile} from '@/types/user.type'
import { DeveloperLevel, SkillProficiency } from '@/types/user.type'
import type { Product } from '@/types/product.type'
import Avatar from '@/components/Avatar'
// import NavbarAuthenticated from '@/components/NavbarAuthenticated'
import { useRouter } from 'next/navigation'
import { useDeveloperProfile, type UserProfileResponse } from '@/hooks/useDeveloperProfile'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, formatDate } from '@/utils'
import {
  HiChartBar,
  HiCog,
  HiShoppingBag,
  HiWrenchScrewdriver,
  HiPlus,
  HiPencil,
  HiCheck,
  HiChartPie,
  HiCheckCircle,
  HiStar,
  HiCube,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiClock,
  HiCodeBracket,
  HiBriefcase,
  HiDocument,
  HiEye,
  HiArrowDown,
  HiHeart
} from 'react-icons/hi2'
import { toast } from 'sonner';

export default function ProfileDevPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    userProfile,
    developerProfile,
    isLoading,
    isUpdating,
    getDeveloperProfile,
    updateDeveloperProfile,
    updateUserProfile,
    updateUserAvatar,
    clearErrors,
    resetUpdateState,
    hasProfile
  } = useDeveloperProfile()

  // Local state for UI
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'products' | 'settings'>('overview')
  const [formData, setFormData] = useState<Partial<DeveloperProfile>>({})
  const [userFormData, setUserFormData] = useState<Partial<UserProfileResponse>>({})
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      if (user?.id) {
        await getDeveloperProfile(user.id)
      }
    }

    loadProfile()
  }, [user?.id, getDeveloperProfile])


  useEffect(() => {
    if (developerProfile) {
      setFormData(developerProfile)
    }
    if (userProfile) {
      setUserFormData(userProfile)
    }
  }, [developerProfile, userProfile])


  useEffect(() => {
    if (isEditing) {
      resetUpdateState()
    }
  }, [isEditing, resetUpdateState])


  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file || !user?.id) return
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh')
      return
    }
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB')
      return
    }

    try {
      const success = await updateUserAvatar(user.id, file)
      if (success) {
        toast.success('Cập nhật avatar thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật avatar!')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Có lỗi xảy ra khi cập nhật avatar!')
    }
  }

  /**
   * Check if user form data has changes
   */
  const hasUserFormChanges = (): boolean => {
    if (!userProfile || !userFormData) return false

    // Check each field for changes
    const fieldsToCheck: (keyof UserProfileResponse)[] = ['fullname', 'email', 'phone', 'dateOfBirth']

    return fieldsToCheck.some(field => {
      const originalValue = userProfile[field]
      const newValue = userFormData[field]

      // Handle date comparison
      if (field === 'dateOfBirth') {
        const originalDate = originalValue && typeof originalValue !== 'boolean' ? new Date(originalValue).getTime() : null
        const newDate = newValue && typeof newValue !== 'boolean' ? new Date(newValue).getTime() : null
        return originalDate !== newDate
      }

      return originalValue !== newValue
    })
  }

  /**
   * Check if developer form data has changes
   */
  const hasDeveloperFormChanges = (): boolean => {
    if (!formData) return false
    // If no developer profile exists yet, check if any fields have values (creating new profile)
    if (!developerProfile) {
      const fieldsToCheck: (keyof DeveloperProfile)[] = [
        'title', 'bio', 'hourlyRate', 'experienceYears', 'developerLevel',
        'githubUrl', 'linkedinUrl', 'cvUrl', 'timezone', 'isAvailable'
      ]
      const hasChanges = fieldsToCheck.some(field => {
        const newValue = formData[field]
        // Check if field has a meaningful value (not empty string, null, undefined, or 0 for numbers)
        if (typeof newValue === 'string') {
          return newValue.trim() !== ''
        }
        if (typeof newValue === 'number') {
          return newValue > 0
        }
        if (typeof newValue === 'boolean') {
          return true
        }
        // Skip array fields (skills, languages) and other complex types
        return false
      })
      // console.log('Creating new profile - hasChanges:', hasChanges, 'formData:', formData)
      return hasChanges
    }
    // If developer profile exists, check for changes
    const fieldsToCheck: (keyof DeveloperProfile)[] = [
      'title', 'bio', 'hourlyRate', 'experienceYears', 'developerLevel',
      'githubUrl', 'linkedinUrl', 'cvUrl', 'timezone', 'isAvailable'
    ]
    const hasChanges = fieldsToCheck.some(field => {
      const originalValue = developerProfile[field]
      const newValue = formData[field]
      // Handle number comparison
      if (typeof originalValue === 'number' && typeof newValue === 'number') {
        return originalValue !== newValue
      }
      // Handle boolean comparison
      if (typeof originalValue === 'boolean' && typeof newValue === 'boolean') {
        return originalValue !== newValue
      }
      return originalValue !== newValue
    })
    return hasChanges
  }

  /**
   * Handle saving user profile data only
   */
  const handleSaveUserProfile = async (): Promise<void> => {
    if (!user?.id) return

    try {
      if (!hasUserFormChanges()) {
        toast.info('Không có thay đổi nào trong thông tin cá nhân')
        return
      }

      // console.log('Updating user profile with changes:', userFormData)
      const success = await updateUserProfile(user.id, userFormData)

      if (success) {
        toast.success('Cập nhật thông tin cá nhân thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin cá nhân!')
      }
    } catch (error) {
      console.error('Error saving user profile:', error)
      toast.error('Có lỗi xảy ra khi cập nhật thông tin cá nhân!')
    }
  }

  /**
   * Handle saving developer profile data only
   */
  const handleSaveDeveloperProfile = async (): Promise<void> => {
    if (!user?.id) return

    try {
      if (!hasDeveloperFormChanges()) {
        toast.info('Không có thay đổi nào trong cài đặt developer profile')
        return
      }
      const success = await updateDeveloperProfile(user.id, formData)

      if (success) {
        toast.success('Cập nhật developer profile thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật developer profile!')
      }
    } catch (error) {
      console.error('Error saving developer profile:', error)
      toast.error('Có lỗi xảy ra khi cập nhật developer profile!')
    }
  }


  const handleSave = async (): Promise<void> => {
    if (!user?.id) return

    try {
      let userSuccess = true
      let developerSuccess = true
      if (hasUserFormChanges()) {
        userSuccess = await updateUserProfile(user.id, userFormData)
      }
      // Update developer profile if there are changes and profile exists
      if (hasProfile && hasDeveloperFormChanges()) {
        // console.log('Updating developer profile with changes:', formData)
        developerSuccess = await updateDeveloperProfile(user.id, formData)
      }
      // If no changes were made, show a message
      if (!hasUserFormChanges() && (!hasProfile || !hasDeveloperFormChanges())) {
        toast.info('Không có thay đổi nào để lưu')
        setIsEditing(false)
        return
      }
      if (userSuccess && developerSuccess) {
        setIsEditing(false)
        toast.success('Cập nhật thông tin thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin!')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!')
    }
  }

  const handleCancel = (): void => {
    setFormData(developerProfile || {})
    setUserFormData(userProfile || {})
    setIsEditing(false)
    clearErrors()
  }


  const getAvailabilityColor = (isAvailable: boolean): string => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getAvailabilityText = (isAvailable: boolean): string => {
    return isAvailable ? 'Sẵn sàng nhận việc' : 'Chưa sẵn sàng'
  }

  const getProficiencyColor = (proficiency: SkillProficiency): string => {
    const proficiencyColors: Record<SkillProficiency, string> = {
      [SkillProficiency.BEGINNER]: 'bg-gray-100 text-gray-800',
      [SkillProficiency.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800',
      [SkillProficiency.ADVANCED]: 'bg-blue-100 text-blue-800',
      [SkillProficiency.EXPERT]: 'bg-green-100 text-green-800'
    }
    return proficiencyColors[proficiency] || 'bg-gray-100 text-gray-800'
  }

  const getProficiencyText = (proficiency: SkillProficiency): string => {
    const proficiencyTexts: Record<SkillProficiency, string> = {
      [SkillProficiency.BEGINNER]: 'Cơ bản',
      [SkillProficiency.INTERMEDIATE]: 'Trung bình',
      [SkillProficiency.ADVANCED]: 'Nâng cao',
      [SkillProficiency.EXPERT]: 'Chuyên gia'
    }
    return proficiencyTexts[proficiency] || 'Chưa xác định'
  }

  const handleManageProducts = (): void => {
    
  }

  const handleCreateProduct = (): void => {
    
  }


  const handleInputChange = (field: keyof DeveloperProfile, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }


  const handleUserInputChange = (field: string, value: any): void => {
    setUserFormData(prev => ({ ...prev, [field]: value }))
  }



  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    )
  }

  // Tab navigation configuration
  const tabConfig = [
    { id: 'overview', label: 'Tổng quan', icon: HiChartBar },
    { id: 'skills', label: 'Kỹ năng', icon: HiWrenchScrewdriver },
    { id: 'products', label: 'Sản phẩm', icon: HiShoppingBag },
    { id: 'settings', label: 'Cài đặt', icon: HiCog }
  ] as const

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <NavbarAuthenticated /> */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <Avatar
                    src={user?.avatarUrl || ''}
                    name={userProfile?.fullname || 'User'}
                    size="xl"
                    className="border-2 border-gray-200"
                  />
                  <div className="absolute -top-2 -right-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
                      <HiCheck className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Avatar Upload Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUpdating}
                      />
                      <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200">
                        <HiPencil className="w-4 h-4 text-gray-700" />
                      </div>
                    </label>
                  </div>

                  {/* Loading Overlay */}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userProfile?.fullname}</h1>
                  <p className="text-gray-600 mb-2">
                    {hasProfile ? `${developerProfile?.title}` : 'Developer • Chưa có profile'}
                  </p>
                  <div className="flex items-center text-sm">
                    {hasProfile ? (
                      <>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(developerProfile?.isAvailable || false)}`}>
                          {getAvailabilityText(developerProfile?.isAvailable || false)}
                        </span>
                        <span className="ml-2 flex items-center text-gray-500">
                          <HiStar className="w-4 h-4 mr-1" />
                          {developerProfile?.rating}/5 ({developerProfile?.totalProjects} dự án)
                        </span>
                        <span className="text-gray-500 ml-2">{developerProfile?.experienceYears} Năm kinh nghiệm</span>
                        <span className="text-gray-500 ml-2">{developerProfile?.hourlyRate ? formatCurrency(developerProfile.hourlyRate) : 'Chưa cập nhật'}/giờ</span>
                      </>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Chưa có profile developer
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {!hasProfile ? (
                  // Show create profile button when no profile exists
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setActiveTab('settings')
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-lg font-medium"
                    type="button"
                  >
                    <HiPlus className="w-5 h-5" />
                    <span>Tạo Profile Developer</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleManageProducts}
                      className="px-2 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
                      type="button"
                    >
                      <HiCube className="w-4 h-4" />
                      <span>Quản lý sản phẩm</span>
                    </button>

                    <button
                      onClick={handleCreateProduct}
                      className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      type="button"
                    >
                      <HiPlus className="w-4 h-4" />
                      <span>Đăng sản phẩm mới</span>
                    </button>

                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        type="button"
                      >
                        <HiPencil className="w-4 h-4" />
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
                          disabled={isUpdating}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                          type="button"
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Đang lưu...</span>
                            </>
                          ) : (
                            <>
                              <HiCheck className="w-4 h-4" />
                              <span>Lưu</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" role="tablist">
              {tabConfig.map(tab => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`py-4 text-sm font-medium border-b-2 flex items-center ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
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
                      <HiChartPie className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{hasProfile ? (developerProfile?.totalProjects || 0) : 0}</p>
                      <p className="text-gray-500 text-sm">Tổng dự án</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <HiCheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{hasProfile ? (developerProfile?.experienceYears || 0) : 0}</p>
                      <p className="text-gray-500 text-sm">Năm kinh nghiệm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <HiStar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{hasProfile ? (developerProfile?.rating || 0) : 0}</p>
                      <p className="text-gray-500 text-sm">Đánh giá</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <HiShoppingBag className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                      <p className="text-gray-500 text-sm">Sản phẩm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                {hasProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={handleCreateProduct}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
                      type="button"
                    >
                      <div className="text-center">
                        <HiShoppingBag className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-green-600" />
                        <p className="text-gray-600 group-hover:text-green-600">Đăng sản phẩm mới</p>
                      </div>
                    </button>

                    <button
                      onClick={handleManageProducts}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                      type="button"
                    >
                      <div className="text-center">
                        <HiCube className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-blue-600" />
                        <p className="text-gray-600 group-hover:text-blue-600">Quản lý sản phẩm</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('skills')}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                      type="button"
                    >
                      <div className="text-center">
                        <HiWrenchScrewdriver className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-gray-600" />
                        <p className="text-gray-600 group-hover:text-gray-600">Quản lý kỹ năng</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {/* <HiUser className="text-gray-400 text-6xl mb-4" /> */}
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tạo Profile Developer
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Tạo profile developer để bắt đầu sử dụng các tính năng của nền tảng
                    </p>
                    <button
                      onClick={() => {
                        setIsEditing(true)
                        setActiveTab('settings')
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      type="button"
                    >
                      Tạo Profile Ngay
                    </button>
                  </div>
                )}
              </div>

              {/* Developer Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Giới thiệu</h3>
                  {hasProfile ? (
                    <>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{developerProfile?.bio || 'Chưa cập nhật giới thiệu'}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <HiEnvelope className="w-4 h-4 mr-1" />
                            Email:
                          </span>
                          <span className="ml-2 text-gray-900">{userProfile?.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <HiPhone className="w-4 h-4 mr-1" />
                            Điện thoại:
                          </span>
                          <span className="ml-2 text-gray-900">{userProfile?.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <HiMapPin className="w-4 h-4 mr-1" />
                            Địa điểm:
                          </span>
                          <span className="ml-2 text-gray-900">{userProfile?.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <HiClock className="w-4 h-4 mr-1" />
                            Múi giờ:
                          </span>
                          <span className="ml-2 text-gray-900">{developerProfile?.timezone || 'Chưa cập nhật'}</span>
                        </div>
                      </div>

                      {/* Skills Preview */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Kỹ năng chính</h4>
                        <div className="flex flex-wrap gap-2">
                          {developerProfile?.skills?.slice(0, 6).map(skill => (
                            <span key={skill.id} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill.name}
                            </span>
                          )) || <span className="text-gray-500">Chưa cập nhật kỹ năng</span>}
                        </div>
                        {developerProfile?.skills && developerProfile.skills.length > 6 && (
                          <button
                            onClick={() => setActiveTab('skills')}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                            type="button"
                          >
                            Xem tất cả kỹ năng →
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      {/* <HiDocumentText className="text-gray-400 text-4xl mb-4" /> */}
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có thông tin giới thiệu
                      </h4>
                      <p className="text-gray-500 mb-4">
                        Tạo profile developer để thêm thông tin giới thiệu và kỹ năng của bạn
                      </p>
                      <button
                        onClick={() => {
                          setIsEditing(true)
                          setActiveTab('settings')
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        type="button"
                      >
                        Tạo Profile
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin bổ sung</h3>

                  {hasProfile ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-500 text-sm">Cấp độ:</span>
                          <span className="ml-2 text-gray-900 capitalize">{developerProfile?.developerLevel?.toLowerCase() || 'Chưa cập nhật'}</span>
                        </div>

                        <div>
                          <span className="text-gray-500 text-sm">Ngôn ngữ:</span>
                          <div className="mt-1">
                            {developerProfile?.languages?.map((lang, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mr-1 mb-1">
                                {lang}
                              </span>
                            )) || <span className="text-gray-500 text-sm">Chưa cập nhật</span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Liên kết</h4>
                        <div className="space-y-2">
                          {developerProfile?.githubUrl && (
                            <a
                              href={developerProfile.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                              <HiCodeBracket className="w-4 h-4 mr-2" /> GitHub
                            </a>
                          )}
                          {developerProfile?.linkedinUrl && (
                            <a
                              href={developerProfile.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                              <HiBriefcase className="w-4 h-4 mr-2" /> LinkedIn
                            </a>
                          )}
                          {developerProfile?.cvUrl && (
                            <a
                              href={developerProfile.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                              <HiDocument className="w-4 h-4 mr-2" /> CV/Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      {/* <HiInformationCircle className="text-gray-400 text-3xl mb-3" /> */}
                      <p className="text-gray-500 text-sm">
                        Tạo profile developer để hiển thị thông tin bổ sung
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Kỹ năng & Chuyên môn</h3>
                {hasProfile && (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    Thêm kỹ năng
                  </button>
                )}
              </div>

              {hasProfile ? (
                <div className="space-y-6">
                  {developerProfile?.skills?.map(skill => (
                    <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 text-lg">{skill.name}</h4>
                          <p className="text-gray-600 text-sm">{skill.yearsOfExperience} năm kinh nghiệm</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getProficiencyColor(skill.proficiency)}`}>
                          {getProficiencyText(skill.proficiency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <span>ID: {skill.id}</span>
                          <span>Tạo: {skill.createdDate ? formatDate(skill.createdDate) : 'Chưa xác định'}</span>
                          {skill.updatedDate && (
                            <span>Cập nhật: {formatDate(skill.updatedDate)}</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                            type="button"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 text-sm"
                            type="button"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  )) || (
                      <div className="text-center py-12">
                        {/* <HiWrenchScrewdriver className="text-gray-400 text-6xl mb-4" /> */}
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Chưa có kỹ năng nào
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Hãy thêm kỹ năng của bạn để khách hàng có thể tìm thấy bạn dễ dàng hơn
                        </p>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          type="button"
                        >
                          Thêm kỹ năng đầu tiên
                        </button>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12">
                  {/* <HiWrenchScrewdriver className="text-gray-400 text-6xl mb-4" /> */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có profile developer
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Tạo profile developer để quản lý kỹ năng và chuyên môn của bạn
                  </p>
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setActiveTab('settings')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    Tạo Profile Developer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Sản phẩm đang bán</h3>
                {hasProfile && (
                  <button
                    onClick={handleCreateProduct}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    type="button"
                  >
                    Đăng sản phẩm mới
                  </button>
                )}
              </div>

              {hasProfile ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map(product => (
                      <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{product.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {product.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.techStack.slice(0, 3).map(tech => (
                              <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                            {product.techStack.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{product.techStack.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                            <div className="flex space-x-2 text-sm text-gray-500">
                              <HiEye className="w-4 h-4 mr-1" />
                              <HiArrowDown className="w-4 h-4 mr-1" />
                              <HiHeart className="w-4 h-4 mr-1" />
                            </div>
                          </div>
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
                                Xem demo
                              </a>
                            )}
                            {product.githubUrl && (
                              <a
                                href={product.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                              >
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {products.length === 0 && (
                    <div className="text-center py-12">
                      {/* <HiShoppingBag className="text-gray-400 text-6xl mb-4" /> */}
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có sản phẩm nào
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Hãy đăng sản phẩm đầu tiên của bạn để bắt đầu kiếm tiền
                      </p>
                      <button
                        onClick={handleCreateProduct}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        type="button"
                      >
                        Đăng sản phẩm đầu tiên
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  {/* <HiShoppingBag className="text-gray-400 text-6xl mb-4" /> */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có profile developer
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Tạo profile developer để bắt đầu đăng sản phẩm và kiếm tiền
                  </p>
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setActiveTab('settings')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    Tạo Profile Developer
                  </button>
                </div>
              )}
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
                        value={userFormData?.fullname || ''}
                        onChange={(e) => handleUserInputChange('fullname', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile?.fullname}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userFormData?.email || ''}
                        onChange={(e) => handleUserInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userFormData?.phone || ''}
                        onChange={(e) => handleUserInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile?.phone || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={userFormData?.dateOfBirth ? new Date(userFormData.dateOfBirth).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleUserInputChange('dateOfBirth', new Date(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile?.dateOfBirth ? formatDate(new Date(userProfile.dateOfBirth)) : 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò
                    </label>
                    <p className="text-gray-900 capitalize">{userProfile?.role || 'Chưa xác định'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái tài khoản
                    </label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${userProfile?.isEnable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {userProfile?.isEnable ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lần đăng nhập cuối
                    </label>
                    <p className="text-gray-900">{userProfile?.lastLoginDate ? formatDate(new Date(userProfile.lastLoginDate)) : 'Chưa có'}</p>
                  </div>
                </div>

                {/* Personal Information Save Button */}
                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        type="button"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveUserProfile}
                        disabled={isUpdating || !hasUserFormChanges()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        type="button"
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Đang lưu...</span>
                          </>
                        ) : (
                          <>
                            <HiCheck className="w-4 h-4" />
                            <span>Lưu</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Developer Profile Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Cài đặt Developer Profile</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        placeholder="VD: Full Stack Developer, Frontend Developer..."
                      />
                    ) : (
                      <p className="text-gray-900">{developerProfile?.title || 'Chưa cập nhật'}</p>
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
                        placeholder="VD: 500000"
                      />
                    ) : (
                      <p className="text-gray-900">{developerProfile?.hourlyRate ? formatCurrency(developerProfile.hourlyRate) : 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ Developer
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.developerLevel || ''}
                        onChange={(e) => handleInputChange('developerLevel', e.target.value as DeveloperLevel)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn cấp độ</option>
                        <option value={DeveloperLevel.JUNIOR}>Junior</option>
                        <option value={DeveloperLevel.MID}>Mid</option>
                        <option value={DeveloperLevel.SENIOR}>Senior</option>
                        <option value={DeveloperLevel.LEAD}>Lead</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{developerProfile?.developerLevel?.toLowerCase() || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Năm kinh nghiệm
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.experienceYears || ''}
                        onChange={(e) => handleInputChange('experienceYears', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{developerProfile?.experienceYears || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.githubUrl || ''}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/username"
                      />
                    ) : (
                      <p className="text-gray-900">{developerProfile?.githubUrl || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.linkedinUrl || ''}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    ) : (
                      <p className="text-gray-900">{developerProfile?.linkedinUrl || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CV/Resume URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.cvUrl || ''}
                        onChange={(e) => handleInputChange('cvUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/cv.pdf"
                      />
                    ) : (
                      <p className="text-gray-900">{developerProfile?.cvUrl || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Múi giờ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"

                        value={formData.timezone || 'Asia/Ho_Chi_Minh_City'}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Asia/Ho_Chi_Minh"
                      />
                    ) : (
                      <p className="text-gray-900">{developerProfile?.timezone || 'Chưa cập nhật'}</p>
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
                    <p className="text-gray-900">{developerProfile?.bio || 'Chưa cập nhật giới thiệu'}</p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable || false}
                      onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sẵn sàng nhận việc</span>
                  </label>
                </div>

                {/* Developer Profile Save Button */}
                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        type="button"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveDeveloperProfile}
                        disabled={isUpdating || !hasDeveloperFormChanges()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        type="button"
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Đang lưu...</span>
                          </>
                        ) : (
                          <>
                            <HiCheck className="w-4 h-4" />
                            <span>Lưu</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
