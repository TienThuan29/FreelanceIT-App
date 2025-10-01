"use client";

import React, { useState } from 'react'
import EmailVerification from './EmailVerification'
import { PageUrl } from '@/configs/page.url';
import { Role } from '@/types/user.type';
import { useAuth } from '@/contexts/AuthContext';
import { Constant } from '@/configs/constant';

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  userType: Role
  agreeToTerms: boolean
}

/**
 * Interface cho validation errors
 */
interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

const Page: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: Role.DEVELOPER,
    agreeToTerms: false
  })

  const { register, verifyCode } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showVerification, setShowVerification] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [verificationError, setVerificationError] = useState<string>('')

  /**
   * Xử lý thay đổi input form
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Xóa error khi user nhập lại
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate form data với error handling chi tiết
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 4) {
      newErrors.password = 'Mật khẩu phải có ít nhất 4 ký tự'
    }
    // else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    //   newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    // }

    // Validate confirmPassword
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!validateForm()) return;
    setIsLoading(true)
    try {
      console.log('Register data:', formData)
      const registerResponse = await register({
        registerSessionId: '',
        email: formData.email,
        password: formData.password,
        fullname: formData.fullName,
        role: formData.userType
      })
      if (registerResponse) {
        setShowVerification(true)
      }
      else {
        setErrors({ email: 'Đăng ký thất bại. Vui lòng thử lại.' })
      }
    }
    catch (error: any) {
      console.error('Registration failed:', error)
      setErrors({ email: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' })
    }
    finally {
      setIsLoading(false)
    }
  }

  // Show verification component if registration was successful
  if (showVerification) {
    return (
      <EmailVerification
        email={formData.email}
        error={verificationError}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-600">Tham gia FreeLanceIT ngay hôm nay</p>
          <p className="text-sm text-gray-500 mt-2">
            Thông tin chi tiết sẽ được bổ sung sau khi đăng ký  
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* User Type Selection */}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              Loại tài khoản *
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value={Role.DEVELOPER.toString()}>Freelancer</option>
              <option value={Role.CUSTOMER.toString()}>Doanh nghiệp</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {formData.userType === Role.DEVELOPER.toString()
                ? 'Dành cho người làm việc tự do trong lĩnh vực IT'
                : 'Dành cho các công ty cần tuyển dụng freelancer IT'
              }
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên đầy đủ"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Email sẽ được sử dụng để đăng nhập và nhận thông báo
            </p>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tạo mật khẩu mạnh"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
              <p id="password-help" className="mt-1 text-xs text-gray-500">
                Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
              />
              <span className="text-sm text-gray-700">
                Tôi đồng ý với{' '}
                <a
                  href="/terms"
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chính sách bảo mật
                </a>{' '}
                của FreeLanceIT *
              </span>
            </label>
            {errors.agreeToTerms && (
              <p id="terms-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Đang đăng ký...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Sau khi đăng ký thành công:</h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• {formData.userType === Role.DEVELOPER.toString()
              ? 'Có thể hoàn thiện profile để tăng cơ hội tìm việc'
              : 'Có thể đăng tin tuyển dụng ngay lập tức'}</li>
            <li>• Trải nghiệm đầy đủ tính năng của FreeLanceIT</li>
          </ul>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Đã có tài khoản?{' '}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
