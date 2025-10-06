"use client";

import React, { useState } from 'react'
import axios from 'axios'
import { Api } from '@/configs/api'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email
    if (!formData.email.trim()) {
      setError('Email là bắt buộc')
      return
    }
    
    if (!isValidEmail(formData.email)) {
      setError('Email không hợp lệ')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(Api.BASE_API + Api.Auth.FORGOT_PASSWORD, {
        email: formData.email
      })

      if (response.data.success) {
        setSuccess(true)
      } else {
        setError(response.data.message || 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu')
      }
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
            <h1 className="text-2xl font-bold text-green-700 mb-2">Email đã được gửi!</h1>
            <p className="text-gray-600">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
              <span className="font-semibold text-blue-700">{formData.email}</span>
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-700 mb-2">Hướng dẫn tiếp theo:</h3>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Kiểm tra hộp thư email của bạn</li>
              <li>• Nhấp vào liên kết trong email để đặt lại mật khẩu</li>
              <li>• Liên kết sẽ hết hạn sau 24 giờ</li>
              <li>• Nếu không thấy email, hãy kiểm tra thư mục spam</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Gửi lại email
            </button>
            
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
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Quên mật khẩu</h1>
          <p className="text-gray-600">Nhập email để nhận liên kết đặt lại mật khẩu</p>
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

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập địa chỉ email của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">
              Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email này
            </p>
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
                Đang gửi...
              </>
            ) : (
              'Gửi email xác thực'
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

        {/* Help Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Cần hỗ trợ?</h3>
          <p className="text-xs text-blue-600">
            Nếu bạn gặp khó khăn trong việc đặt lại mật khẩu, vui lòng liên hệ với chúng tôi qua email hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
