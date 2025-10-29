'use client'

import React, { useState } from 'react'
import { generateAvatar, defaultImages } from '../utils/imageUtils'

interface SmartImageProps {
  src?: string
  alt: string
  className?: string
  fallbackName?: string
  width?: number
  height?: number
  type?: 'avatar' | 'product' | 'company' | 'default' | 'logo'
  backgroundColor?: string
  onClick?: () => void
}

/**
 * Component hình ảnh thông minh với fallback
 */
const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackName,
  width,
  height,
  type = 'default',
  backgroundColor
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Tạo fallback image dựa trên type
   */
  const getFallbackImage = (): string => {
    const name = fallbackName || alt || 'Image'
    
    switch (type) {
      case 'avatar':
        return generateAvatar(name, backgroundColor)
      case 'company':
      case 'logo':
        return defaultImages.companyLogo(name)
      case 'product':
        return defaultImages.productImage(name)
      default:
        return defaultImages.placeholder(width || 300, height || 200, name)
    }
  }

  /**
   * Xử lý khi ảnh load thành công
   */
  const handleImageLoad = () => {
    setIsLoading(false)
  }

  /**
   * Xử lý khi ảnh load lỗi
   */
  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  // Nếu không có src hoặc src bị lỗi, dùng fallback
  const finalSrc = !src || imageError ? getFallbackImage() : src

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        width={width}
        height={height}
      />
    </div>
  )
}

export default SmartImage

/**
 * Hook để sử dụng SmartImage dễ dàng hơn
 */
export const useSmartImage = (
  src?: string,
  fallbackName?: string,
  type: 'avatar' | 'product' | 'company' | 'default' = 'default',
  backgroundColor?: string
) => {
  const [imageError, setImageError] = useState(false)

  const getFinalSrc = () => {
    if (!src || imageError) {
      const name = fallbackName || 'Image'
      
      switch (type) {
        case 'avatar':
          return generateAvatar(name, backgroundColor)
        case 'company':
          return defaultImages.companyLogo(name)
        case 'product':
          return defaultImages.productImage(name)
        default:
          return defaultImages.placeholder(300, 200, name)
      }
    }
    return src
  }

  return {
    src: getFinalSrc(),
    onError: () => setImageError(true),
    hasError: imageError
  }
}
