"use client";

import React, { useState, useEffect } from 'react'
import type { DeveloperProfile } from '@/types/user.type'
import { DeveloperLevel } from '@/types/user.type'
import type { Product } from '@/types/product.type'
import Avatar from '@/components/Avatar'
import { useRouter } from 'next/navigation'
import { useDeveloperProfile, type UserProfileResponse } from '@/hooks/useDeveloperProfile'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/utils'
import { usePlanningManagement } from '@/hooks/usePlanningManagement'
import { useTransaction } from '@/hooks/useTransaction'
import { useProductManagement } from '@/hooks/useProductManagement'
import {
  HiChartBar,
  HiCog,
  HiShoppingBag,
  HiWrenchScrewdriver,
  HiPlus,
  HiPencil,
  HiCheck,
  HiStar,
  HiCube,
  HiCreditCard,
  HiReceiptPercent
} from 'react-icons/hi2'
import { toast } from 'sonner';

// Import Tab Components
import OverviewTab from './OverviewTab';
import SkillsTab from './SkillsTab';
import ProductsTab from './ProductsTab';
import PlanningTab from './PlanningTab';
import TransactionsTab from './TransactionsTab';
import SettingsTab from './SettingsTab';
import ProductModal from './ProductModal';

export default function ProfileDevPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    userProfile,
    developerProfile,
    isLoading,
    isUpdating,
    isSkillLoading,
    getDeveloperProfile,
    updateDeveloperProfile,
    updateUserProfile,
    updateUserAvatar,
    addSkill,
    clearErrors,
    resetUpdateState,
    hasProfile
  } = useDeveloperProfile()

  const {
    activeUserPlanning,
    isLoading: isPlanningLoading,
    getActiveUserPlanning
  } = usePlanningManagement()

  const {
    transactions,
    isLoading: isTransactionLoading,
    getUserTransactions
  } = useTransaction()

  const {
    myProducts,
    limitInfo,
    isLoading: isProductLoading,
    getMyProducts,
    getProductLimitInfo,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductManagement()

  // Local state for UI
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'products' | 'planning' | 'transactions' | 'settings'>('overview')
  const [formData, setFormData] = useState<Partial<DeveloperProfile>>({})
  const [userFormData, setUserFormData] = useState<Partial<UserProfileResponse>>({})
  
  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false)
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      if (user?.id) {
        await getDeveloperProfile(user.id)
        await getActiveUserPlanning()
        await getUserTransactions()
        await getMyProducts()
        await getProductLimitInfo()
      }
    }

    loadProfile()
  }, [user?.id, getDeveloperProfile, getActiveUserPlanning, getUserTransactions, getMyProducts, getProductLimitInfo])

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
    
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh')
      return
    }
    
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

  const hasUserFormChanges = (): boolean => {
    if (!userProfile || !userFormData) return false

    const fieldsToCheck: (keyof UserProfileResponse)[] = ['fullname', 'email', 'phone', 'dateOfBirth']

    return fieldsToCheck.some(field => {
      const originalValue = userProfile[field]
      const newValue = userFormData[field]

      if (field === 'dateOfBirth') {
        const originalDate = originalValue && typeof originalValue !== 'boolean' ? new Date(originalValue).getTime() : null
        const newDate = newValue && typeof newValue !== 'boolean' ? new Date(newValue).getTime() : null
        return originalDate !== newDate
      }

      return originalValue !== newValue
    })
  }

  const hasDeveloperFormChanges = (): boolean => {
    if (!formData) return false
    
    if (!developerProfile) {
      const fieldsToCheck: (keyof DeveloperProfile)[] = [
        'title', 'bio', 'hourlyRate', 'experienceYears', 'developerLevel',
        'githubUrl', 'linkedinUrl', 'cvUrl', 'timezone', 'isAvailable'
      ]
      return fieldsToCheck.some(field => {
        const newValue = formData[field]
        if (typeof newValue === 'string') {
          return newValue.trim() !== ''
        }
        if (typeof newValue === 'number') {
          return newValue > 0
        }
        if (typeof newValue === 'boolean') {
          return true
        }
        return false
      })
    }
    
    const fieldsToCheck: (keyof DeveloperProfile)[] = [
      'title', 'bio', 'hourlyRate', 'experienceYears', 'developerLevel',
      'githubUrl', 'linkedinUrl', 'cvUrl', 'timezone', 'isAvailable'
    ]
    return fieldsToCheck.some(field => {
      const originalValue = developerProfile[field]
      const newValue = formData[field]
      
      if (typeof originalValue === 'number' && typeof newValue === 'number') {
        return originalValue !== newValue
      }
      if (typeof originalValue === 'boolean' && typeof newValue === 'boolean') {
        return originalValue !== newValue
      }
      return originalValue !== newValue
    })
  }

  const handleSaveUserProfile = async (): Promise<void> => {
    if (!user?.id) return

    try {
      if (!hasUserFormChanges()) {
        toast.info('Không có thay đổi nào trong thông tin cá nhân')
        return
      }

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
      
      if (hasProfile && hasDeveloperFormChanges()) {
        developerSuccess = await updateDeveloperProfile(user.id, formData)
      }
      
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

  const handleManageProducts = (): void => {
    setActiveTab('products')
  }

  const handleCreateProduct = (): void => {
    setProductModalMode('create')
    setSelectedProduct(null)
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: Product): void => {
    setProductModalMode('edit')
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = async (id: string): Promise<void> => {
    const success = await deleteProduct(id)
    if (success) {
      // Refresh limit info after deletion
      await getProductLimitInfo()
    }
  }

  const handleProductModalClose = (): void => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  const handleProductSubmit = async (productData: Partial<Product>): Promise<boolean> => {
    try {
      let success = false;
      
      if (productModalMode === 'create') {
        const newProduct = await createProduct(productData)
        success = !!newProduct
      } else if (productModalMode === 'edit' && selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.id, productData)
        success = !!updatedProduct
      }

      if (success) {
        // Refresh limit info after create/update
        await getProductLimitInfo()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error submitting product:', error)
      return false
    }
  }

  const handleInputChange = (field: keyof DeveloperProfile, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUserInputChange = (field: string, value: any): void => {
    setUserFormData(prev => ({ ...prev, [field]: value }))
  }

  const getAvailabilityColor = (isAvailable: boolean): string => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getAvailabilityText = (isAvailable: boolean): string => {
    return isAvailable ? 'Sẵn sàng nhận việc' : 'Chưa sẵn sàng'
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
    { id: 'planning', label: 'Gói dịch vụ', icon: HiCreditCard },
    { id: 'transactions', label: 'Lịch sử giao dịch', icon: HiReceiptPercent },
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
                    className={`py-4 text-sm font-medium border-b-2 flex items-center ${
                      activeTab === tab.id
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
          {activeTab === 'overview' && (
            <OverviewTab
              hasProfile={hasProfile}
              developerProfile={developerProfile || undefined}
              userProfile={userProfile || undefined}
              products={myProducts as any}
              onCreateProduct={handleCreateProduct}
              onManageProducts={handleManageProducts}
              onNavigateToSkills={() => setActiveTab('skills')}
              onNavigateToSettings={() => setActiveTab('settings')}
              onStartEditing={() => setIsEditing(true)}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsTab
              hasProfile={hasProfile}
              developerProfile={developerProfile || undefined}
              onAddSkill={async (skill) => {
                if (!user?.id) return false;
                return await addSkill(user.id, skill);
              }}
              onNavigateToSettings={() => setActiveTab('settings')}
              onStartEditing={() => setIsEditing(true)}
              isSkillLoading={isSkillLoading}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              hasProfile={hasProfile}
              products={myProducts as any}
              limitInfo={limitInfo}
              isLoading={isProductLoading}
              onCreateProduct={handleCreateProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onNavigateToSettings={() => setActiveTab('settings')}
              onStartEditing={() => setIsEditing(true)}
            />
          )}

          {activeTab === 'planning' && (
            <PlanningTab
              activeUserPlanning={activeUserPlanning}
              isLoading={isPlanningLoading}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab
              transactions={transactions}
              isLoading={isTransactionLoading}
              onRefresh={getUserTransactions}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              isEditing={isEditing}
              hasProfile={hasProfile}
              userProfile={userProfile || undefined}
              developerProfile={developerProfile || undefined}
              userFormData={userFormData}
              formData={formData as any}
              isUpdating={isUpdating}
              onUserInputChange={handleUserInputChange}
              onInputChange={handleInputChange as any}
              onSaveUserProfile={handleSaveUserProfile}
              onSaveDeveloperProfile={handleSaveDeveloperProfile}
              onCancel={handleCancel}
              hasUserFormChanges={hasUserFormChanges}
              hasDeveloperFormChanges={hasDeveloperFormChanges}
            />
          )}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        mode={productModalMode}
        product={selectedProduct}
        onClose={handleProductModalClose}
        onSubmit={handleProductSubmit}
        isLoading={isProductLoading}
      />
    </div>
  )
}
