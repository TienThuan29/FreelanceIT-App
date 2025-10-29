"use client";

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Api } from '@/configs/api'

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

const ResetPasswordForm: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn')
    }
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const validateForm = (): boolean => {
    if (!formData.newPassword.trim()) {
      setError('Mật khẩu mới là bắt buộc')
      return false
    }
    
    if (formData.newPassword.length < 4) {
      setError('Mật khẩu phải có ít nhất 4 ký tự')
      return false
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!token) {
      setError('Token không hợp lệ')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(Api.BASE_API + Api.Auth.RESET_PASSWORD, {
        token: token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })

      if (response.data.success) {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(response.data.message || 'Có lỗi xảy ra khi đặt lại mật khẩu')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">Đặt lại mật khẩu thành công!</h1>
            <p className="text-gray-600">
              Mật khẩu của bạn đã được cập nhật thành công.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-700 mb-2">Tiếp theo:</h3>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Bạn sẽ được chuyển hướng đến trang đăng nhập</li>
              <li>• Sử dụng mật khẩu mới để đăng nhập</li>
              <li>• Giữ mật khẩu an toàn và không chia sẻ với ai</li>
            </ul>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Chuyển hướng đến trang đăng nhập trong <span className="font-semibold text-blue-600">3</span> giây...
            </p>
            <div className="mt-4">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Đăng nhập ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state for invalid token
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Error Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">Token không hợp lệ</h1>
            <p className="text-gray-600">
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-red-700 mb-2">Bạn có thể:</h3>
            <ul className="text-xs text-red-600 space-y-1">
              <li>• Yêu cầu gửi lại email đặt lại mật khẩu</li>
              <li>• Liên hệ với hỗ trợ nếu vấn đề tiếp tục</li>
              <li>• Đảm bảo bạn đã sử dụng liên kết từ email gần nhất</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href="/forgot-password"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center block"
            >
              Yêu cầu đặt lại mật khẩu mới
            </a>
            
            <div className="text-center">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Quay lại đăng nhập
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Đặt lại mật khẩu</h1>
          <p className="text-gray-600">Tạo mật khẩu mới cho tài khoản của bạn</p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500"></span>
          </div>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Input */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              placeholder="Nhập mật khẩu mới"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">
              Mật khẩu phải có ít nhất 4 ký tự
            </p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Đang cập nhật...
              </>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </button>
        </form>

        {/* Additional Actions */}
        <div className="mt-6 space-y-4">
          {/* Back to Login */}
          <div className="text-center">
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Quay lại đăng nhập
            </a>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Chưa có tài khoản?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Lưu ý bảo mật:</h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Chọn mật khẩu mạnh và duy nhất</li>
            <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
            <li>• Thay đổi mật khẩu định kỳ</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
