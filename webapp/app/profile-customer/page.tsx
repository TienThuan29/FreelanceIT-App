"use client";

import React, { useState, useEffect } from 'react'
import type { CustomerProfile, Commune, Province } from '@/types/user.type'
import Avatar from '@/components/Avatar'
import { useRouter } from 'next/navigation'
import { useCustomerProfile, type UserProfileResponse } from '@/hooks/useCustomerProfile'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/utils'
import { Api } from '@/configs/api'
import {
  HiChartBar,
  HiCog,
  HiShoppingBag,
  HiBuildingOffice,
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
  HiGlobeAlt,
} from 'react-icons/hi2'
import { toast } from 'sonner';

export default function ProfileCustomerPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    userProfile,
    customerProfile,
    isLoading,
    isUpdating,
    isCreating,
    error,
    getCustomerProfile,
    createCustomerProfile,
    updateCustomerProfile,
    updateUserProfile,
    refreshProfile,
    clearErrors,
    resetUpdateState,
    resetCreateState,
    hasProfile
  } = useCustomerProfile()

  // Local state for UI
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'company' | 'settings'>('overview')
  const [formData, setFormData] = useState<Partial<CustomerProfile>>({})
  const [userFormData, setUserFormData] = useState<Partial<UserProfileResponse>>({})
  
  // Address API state
  const [provinces, setProvinces] = useState<Province[]>([])
  const [communes, setCommunes] = useState<Commune[]>([])
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null)
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false)
  const [loadingCommunes, setLoadingCommunes] = useState<boolean>(false)

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      if (user?.id) {
        console.log('Loading customer profile for user:', user.id, 'Role:', user.role)
        try {
          console.log('About to call getCustomerProfile...')
          await getCustomerProfile(user.id)
          console.log('getCustomerProfile completed successfully')
          console.log('Final hook state after call:', { isLoading, error, hasProfile, customerProfile })
        } catch (error) {
          console.error('=== ERROR CAUGHT IN PAGE COMPONENT ===')
          console.error('Error in loadProfile:', error)
          console.log('Error type:', typeof error)
          console.log('Error constructor:', error?.constructor?.name)
          console.log('=== END PAGE ERROR HANDLING ===')
        }
      } else {
        console.log('No user ID available')
      }
    }

    loadProfile()
  }, [user?.id, getCustomerProfile])

  useEffect(() => {
    if (customerProfile) {
      setFormData(customerProfile)
      setSelectedProvince(customerProfile.province)
      setSelectedCommune(customerProfile.commune)
    }
    if (userProfile) {
      console.log('User profile updated:', userProfile)
      setUserFormData(userProfile)
    }
  }, [customerProfile, userProfile])

  useEffect(() => {
    if (isEditing) {
      resetUpdateState()
      resetCreateState()
    }
  }, [isEditing, resetUpdateState, resetCreateState])

  // Load provinces from Vietnam Address API
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true)
      try {
        const response = await fetch(Api.ThirdParty.VietnamAddress.GET_PROVINCES)
        if (response.ok) {
          const data = await response.json()
          console.log('Provinces API response:', data)
          
          // Ensure data is an array
          if (Array.isArray(data)) {
            setProvinces(data)
          } else if (data && Array.isArray(data.data)) {
            setProvinces(data.data)
          } else if (data && Array.isArray(data.provinces)) {
            setProvinces(data.provinces)
          } else {
            console.error('Unexpected provinces data format:', data)
            setProvinces([]) // Fallback to empty array
            toast.error('Định dạng dữ liệu tỉnh/thành phố không hợp lệ')
          }
        } else {
          console.error('Provinces API error:', response.status, response.statusText)
          toast.error('Không thể tải danh sách tỉnh/thành phố')
          setProvinces([]) // Ensure it's always an array
        }
      } catch (error) {
        console.error('Error loading provinces:', error)
        toast.error('Lỗi khi tải danh sách tỉnh/thành phố')
        setProvinces([]) // Ensure it's always an array
      } finally {
        setLoadingProvinces(false)
      }
    }

    loadProvinces()
  }, [])

  // Load communes when province is selected
  useEffect(() => {
    const loadCommunes = async (provinceCode: string) => {
      setLoadingCommunes(true)
      try {
        const url = Api.ThirdParty.VietnamAddress.GET_COMMUNES_FROM_PROVINCE.replace('{province_id}', provinceCode)
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          console.log('Communes API response:', data)
          
          // Ensure data is an array
          if (Array.isArray(data)) {
            setCommunes(data)
          } else if (data && Array.isArray(data.data)) {
            setCommunes(data.data)
          } else if (data && Array.isArray(data.communes)) {
            setCommunes(data.communes)
          } else {
            console.error('Unexpected communes data format:', data)
            setCommunes([]) // Fallback to empty array
            toast.error('Định dạng dữ liệu phường/xã không hợp lệ')
          }
        } else {
          console.error('Communes API error:', response.status, response.statusText)
          toast.error('Không thể tải danh sách phường/xã')
          setCommunes([]) // Ensure it's always an array
        }
      } catch (error) {
        console.error('Error loading communes:', error)
        toast.error('Lỗi khi tải danh sách phường/xã')
        setCommunes([]) // Ensure it's always an array
      } finally {
        setLoadingCommunes(false)
      }
    }

    if (selectedProvince?.code) {
      loadCommunes(selectedProvince.code)
    }
  }, [selectedProvince])

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
      // Note: Avatar upload would need to be implemented in the customer API
      toast.success('Tính năng upload avatar sẽ được triển khai sớm!')
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
   * Check if customer form data has changes
   */
  const hasCustomerFormChanges = (): boolean => {
    if (!formData) return false
    // If no customer profile exists yet, check if any fields have values (creating new profile)
    if (!customerProfile) {
      const fieldsToCheck: (keyof CustomerProfile)[] = [
        'companyName', 'companyWebsite', 'industry', 'companySize', 'taxId', 'houseNumberAndStreet'
      ]
      const hasChanges = fieldsToCheck.some(field => {
        const newValue = formData[field]
        // Check if field has a meaningful value (not empty string, null, undefined)
        if (typeof newValue === 'string') {
          return newValue.trim() !== ''
        }
        return false
      })
      // Also check if province and commune are selected
      return hasChanges || (selectedProvince !== null && selectedCommune !== null)
    }
    // If customer profile exists, check for changes
    const fieldsToCheck: (keyof CustomerProfile)[] = [
      'companyName', 'companyWebsite', 'industry', 'companySize', 'taxId', 'houseNumberAndStreet'
    ]
    const hasChanges = fieldsToCheck.some(field => {
      const originalValue = customerProfile[field]
      const newValue = formData[field]
      return originalValue !== newValue
    })
    
    // Check province and commune changes
    const provinceChanged = customerProfile.province.code !== selectedProvince?.code
    const communeChanged = customerProfile.commune.code !== selectedCommune?.code
    
    return hasChanges || provinceChanged || communeChanged
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

      console.log('Updating user profile with changes:', userFormData)
      const success = await updateUserProfile(user.id, userFormData)

      if (success) {
        console.log('User profile update successful, refreshing profile...')
        toast.success('Cập nhật thông tin cá nhân thành công!')
        // Refresh profile data to ensure we have the latest information
        await refreshProfile(user.id)
        setIsEditing(false)
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin cá nhân!')
      }
    } catch (error) {
      console.error('Error saving user profile:', error)
      toast.error('Có lỗi xảy ra khi cập nhật thông tin cá nhân!')
    }
  }

  /**
   * Handle saving customer profile data only
   */
  const handleSaveCustomerProfile = async (): Promise<void> => {
    if (!user?.id) return

    try {
      if (!hasCustomerFormChanges()) {
        toast.info('Không có thay đổi nào trong thông tin công ty')
        return
      }

      const profileData = {
        ...formData,
        commune: selectedCommune!,
        province: selectedProvince!
      }

      let success = false
      if (hasProfile) {
        success = await updateCustomerProfile(user.id, profileData)
      } else {
        success = await createCustomerProfile({
          userId: user.id,
          ...profileData
        })
      }

      if (success) {
        toast.success(hasProfile ? 'Cập nhật thông tin công ty thành công!' : 'Tạo profile công ty thành công!')
        // Refresh profile data to ensure we have the latest information
        await refreshProfile(user.id)
        setIsEditing(false)
      } else {
        toast.error('Có lỗi xảy ra khi lưu thông tin công ty!')
      }
    } catch (error) {
      console.error('Error saving customer profile:', error)
      toast.error('Có lỗi xảy ra khi lưu thông tin công ty!')
    }
  }

  const handleSave = async (): Promise<void> => {
    if (!user?.id) return

    try {
      let userSuccess = true
      let customerSuccess = true
      
      if (hasUserFormChanges()) {
        userSuccess = await updateUserProfile(user.id, userFormData)
      }
      
      if (hasCustomerFormChanges()) {
        const profileData = {
          ...formData,
          commune: selectedCommune!,
          province: selectedProvince!
        }

        if (hasProfile) {
          customerSuccess = await updateCustomerProfile(user.id, profileData)
        } else {
          customerSuccess = await createCustomerProfile({
            userId: user.id,
            ...profileData
          })
        }
      }
      
      // If no changes were made, show a message
      if (!hasUserFormChanges() && !hasCustomerFormChanges()) {
        toast.info('Không có thay đổi nào để lưu')
        setIsEditing(false)
        return
      }
      
      if (userSuccess && customerSuccess) {
        // Refresh profile data to ensure we have the latest information
        await refreshProfile(user.id)
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
    setFormData(customerProfile || {})
    setUserFormData(userProfile || {})
    setSelectedProvince(customerProfile?.province || null)
    setSelectedCommune(customerProfile?.commune || null)
    setIsEditing(false)
    clearErrors()
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof CustomerProfile, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUserInputChange = (field: string, value: any): void => {
    setUserFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleProvinceChange = (provinceCode: string): void => {
    const province = provinces.find(p => p.code === provinceCode)
    setSelectedProvince(province || null)
    setSelectedCommune(null) // Reset commune when province changes
    setCommunes([]) // Clear communes list
  }

  const handleCommuneChange = (communeCode: string): void => {
    const commune = communes.find(c => c.code === communeCode)
    setSelectedCommune(commune || null)
  }

  // Debug info
  console.log('Profile Customer Page - User:', user, 'Role:', user?.role, 'Has Profile:', hasProfile, 'Customer Profile:', customerProfile)
  console.log('Profile Customer Page - Loading:', isLoading, 'Error:', error, 'Is Creating:', isCreating, 'Is Updating:', isUpdating)
  
  // Test function to manually test the API call
  const testApiCall = async () => {
    if (user?.id) {
      console.log('Testing API call manually...')
      try {
        const response = await fetch(`http://localhost:5000/api/v1/customers/profile/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('Manual API test response:', response.status, response.statusText)
        const data = await response.text()
        console.log('Manual API test data:', data)
      } catch (error) {
        console.error('Manual API test error:', error)
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            {/* <p className="text-gray-600">Đang tải thông tin...</p> */}
            {/* <p className="text-sm text-gray-500 mt-2">User ID: {user?.id} | Role: {user?.role}</p> */}
          </div>
        </div>
      </div>
    )
  }

  // Tab navigation configuration
  const tabConfig = [
    { id: 'overview', label: 'Tổng quan', icon: HiChartBar },
    { id: 'company', label: 'Công ty', icon: HiBuildingOffice },
    { id: 'settings', label: 'Cài đặt', icon: HiCog }
  ] as const

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <div className="absolute inset-0  bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userProfile?.fullname}</h1>
                  <p className="text-gray-600 mb-2">
                    {hasProfile ? `${customerProfile?.companyName}` : 'Customer • Chưa có profile'}
                  </p>
                  <div className="flex items-center text-sm">
                    {hasProfile ? (
                      <>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {customerProfile?.industry || 'Chưa cập nhật'}
                        </span>
                        <span className="ml-2 flex items-center text-gray-500">
                          <HiStar className="w-4 h-4 mr-1" />
                          {customerProfile?.rating || 0}/5 ({customerProfile?.totalProjectsPosted || 0} dự án)
                        </span>
                        <span className="text-gray-500 ml-2">{customerProfile?.companySize || 'Chưa cập nhật'}</span>
                      </>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Chưa có profile công ty
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
                    <span>Tạo Profile Công Ty</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/posts-cus')}
                      className="px-2 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
                      type="button"
                    >
                      <HiCube className="w-4 h-4" />
                      <span>Quản lý dự án</span>
                    </button>

                    <button
                      onClick={() => router.push('/posts-cus')}
                      className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      type="button"
                    >
                      <HiPlus className="w-4 h-4" />
                      <span>Đăng dự án mới</span>
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
                          disabled={isUpdating || isCreating}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                          type="button"
                        >
                          {(isUpdating || isCreating) ? (
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
                      <p className="text-2xl font-bold text-gray-900">{hasProfile ? (customerProfile?.totalProjectsPosted || 0) : 0}</p>
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
                      <p className="text-2xl font-bold text-gray-900">{hasProfile ? (customerProfile?.rating || 0) : 0}</p>
                      <p className="text-gray-500 text-sm">Đánh giá</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <HiStar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{hasProfile ? (customerProfile?.companySize || 'N/A') : 'N/A'}</p>
                      <p className="text-gray-500 text-sm">Quy mô công ty</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <HiBuildingOffice className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">{hasProfile ? (customerProfile?.industry || 'N/A') : 'N/A'}</p>
                      <p className="text-gray-500 text-sm">Ngành nghề</p>
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
                      onClick={() => router.push('/posts-cus')}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
                      type="button"
                    >
                      <div className="text-center">
                        <HiShoppingBag className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-green-600" />
                        <p className="text-gray-600 group-hover:text-green-600">Đăng dự án mới</p>
                      </div>
                    </button>

                    <button
                      onClick={() => router.push('/posts-cus')}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                      type="button"
                    >
                      <div className="text-center">
                        <HiCube className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-blue-600" />
                        <p className="text-gray-600 group-hover:text-blue-600">Quản lý dự án</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('company')}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                      type="button"
                    >
                      <div className="text-center">
                        <HiBuildingOffice className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-gray-600" />
                        <p className="text-gray-600 group-hover:text-gray-600">Thông tin công ty</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tạo Profile Công Ty
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Tạo profile công ty để bắt đầu sử dụng các tính năng của nền tảng
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

              {/* Company Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin công ty</h3>
                  {hasProfile ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
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
                            Địa chỉ:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {customerProfile?.houseNumberAndStreet && customerProfile?.commune && customerProfile?.province
                              ? `${customerProfile.houseNumberAndStreet}, ${customerProfile.commune.name}, ${customerProfile.province.name}`
                              : 'Chưa cập nhật'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 flex items-center">
                            <HiGlobeAlt className="w-4 h-4 mr-1" />
                            Website:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {customerProfile?.companyWebsite ? (
                              <a href={customerProfile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {customerProfile.companyWebsite}
                              </a>
                            ) : 'Chưa cập nhật'}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có thông tin công ty
                      </h4>
                      <p className="text-gray-500 mb-4">
                        Tạo profile công ty để thêm thông tin về doanh nghiệp của bạn
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
                          <span className="text-gray-500 text-sm">Mã số thuế:</span>
                          <span className="ml-2 text-gray-900">{customerProfile?.taxId || 'Chưa cập nhật'}</span>
                        </div>

                        <div>
                          <span className="text-gray-500 text-sm">Ngành nghề:</span>
                          <span className="ml-2 text-gray-900">{customerProfile?.industry || 'Chưa cập nhật'}</span>
                        </div>

                        <div>
                          <span className="text-gray-500 text-sm">Quy mô:</span>
                          <span className="ml-2 text-gray-900">{customerProfile?.companySize || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">
                        Tạo profile công ty để hiển thị thông tin bổ sung
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Thông tin công ty</h3>
                {hasProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {hasProfile ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</label>
                      <p className="text-gray-900">{customerProfile?.companyName || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <p className="text-gray-900">
                        {customerProfile?.companyWebsite ? (
                          <a href={customerProfile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {customerProfile.companyWebsite}
                          </a>
                        ) : 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngành nghề</label>
                      <p className="text-gray-900">{customerProfile?.industry || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quy mô công ty</label>
                      <p className="text-gray-900">{customerProfile?.companySize || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mã số thuế</label>
                      <p className="text-gray-900">{customerProfile?.taxId || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      <p className="text-gray-900">
                        {customerProfile?.houseNumberAndStreet && customerProfile?.commune && customerProfile?.province
                          ? `${customerProfile.houseNumberAndStreet}, ${customerProfile.commune.name}, ${customerProfile.province.name}`
                          : 'Chưa cập nhật'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có profile công ty
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Tạo profile công ty để quản lý thông tin doanh nghiệp của bạn
                  </p>
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setActiveTab('settings')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    Tạo Profile Công Ty
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

              {/* Company Profile Settings */}
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
                        placeholder="VD: Công ty TNHH ABC"
                      />
                    ) : (
                      <p className="text-gray-900">{customerProfile?.companyName || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website công ty
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.companyWebsite || ''}
                        onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://company.com"
                      />
                    ) : (
                      <p className="text-gray-900">{customerProfile?.companyWebsite || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngành nghề
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.industry || ''}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: Công nghệ thông tin"
                      />
                    ) : (
                      <p className="text-gray-900">{customerProfile?.industry || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quy mô công ty
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.companySize || ''}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn quy mô</option>
                        <option value="1-10">1-10 nhân viên</option>
                        <option value="11-50">11-50 nhân viên</option>
                        <option value="51-200">51-200 nhân viên</option>
                        <option value="201-500">201-500 nhân viên</option>
                        <option value="500+">500+ nhân viên</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{customerProfile?.companySize || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã số thuế
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.taxId || ''}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: 0123456789"
                      />
                    ) : (
                      <p className="text-gray-900">{customerProfile?.taxId || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số nhà và đường
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.houseNumberAndStreet || ''}
                        onChange={(e) => handleInputChange('houseNumberAndStreet', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: 123 Đường ABC"
                      />
                    ) : (
                      <p className="text-gray-900">{customerProfile?.houseNumberAndStreet || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố *
                    </label>
                    {isEditing ? (
                      <select
                        value={selectedProvince?.code || ''}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        disabled={loadingProvinces}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="">{loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}</option>
                        {Array.isArray(provinces) && provinces.map(province => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">{customerProfile?.province?.name || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã *
                    </label>
                    {isEditing ? (
                      <select
                        value={selectedCommune?.code || ''}
                        onChange={(e) => handleCommuneChange(e.target.value)}
                        disabled={!selectedProvince || loadingCommunes}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="">
                          {!selectedProvince 
                            ? 'Chọn tỉnh/thành phố trước' 
                            : loadingCommunes 
                              ? 'Đang tải...' 
                              : 'Chọn phường/xã'
                          }
                        </option>
                        {Array.isArray(communes) && communes.map(commune => (
                          <option key={commune.code} value={commune.code}>
                            {commune.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">{customerProfile?.commune?.name || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                </div>

                {/* Company Profile Save Button */}
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
                        onClick={handleSaveCustomerProfile}
                        disabled={isUpdating || isCreating || !hasCustomerFormChanges()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        type="button"
                      >
                        {(isUpdating || isCreating) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Đang lưu...</span>
                          </>
                        ) : (
                          <>
                            <HiCheck className="w-4 h-4" />
                            <span>{hasProfile ? 'Cập nhật' : 'Tạo'} Profile</span>
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
                      <p className="text-sm text-gray-500">Cho phép developers thấy khi bạn online</p>
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
}