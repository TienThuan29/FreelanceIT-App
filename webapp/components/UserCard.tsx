import React from 'react'
import type { Developer } from '../types'
import Avatar from './Avatar'

interface UserCardProps {
  developer: Developer
  onDeveloperClick?: (developerId: string) => void
  showFullInfo?: boolean
  className?: string
}

/**
 * Component hiển thị thông tin developer dạng card
 */
const UserCard: React.FC<UserCardProps> = ({
  developer,
  onDeveloperClick,
  showFullInfo = false,
  className = ''
}) => {
  
  // Format giá tiền
  const formatRate = (rate: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(rate)
  }

  // Rating stars
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    // Fill remaining with empty stars
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <svg key={i} className="w-3 h-3 fill-gray-300" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return stars
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer ${className}`}
      onClick={() => onDeveloperClick?.(developer.id)}
    >
      {/* Header */}
      <div className="flex items-start space-x-3 mb-3">
        <Avatar
          src={developer.avatar}
          name={developer.name}
          size="md"
          showOnlineStatus={true}
          isOnline={developer.isAvailable}
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{developer.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{developer.location}</p>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(developer.rating)}
            </div>
            <span className="text-xs text-gray-500">
              {developer.rating.toFixed(1)}
            </span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              developer.isAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {developer.isAvailable ? 'Có sẵn' : 'Bận'}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {showFullInfo && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {developer.bio}
        </p>
      )}

      {/* Skills */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {developer.skills.slice(0, showFullInfo ? 8 : 4).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {skill}
            </span>
          ))}
          {developer.skills.length > (showFullInfo ? 8 : 4) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{developer.skills.length - (showFullInfo ? 8 : 4)}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-600">
          <span>{developer.experience} năm kinh nghiệm</span>
          <span>{developer.completedProjects} dự án</span>
        </div>
        <div className="font-semibold text-blue-600">
          {formatRate(developer.hourlyRate)}/giờ
        </div>
      </div>

      {/* Action button for full info mode */}
      {showFullInfo && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation()
              onDeveloperClick?.(developer.id)
            }}
          >
            Xem hồ sơ
          </button>
        </div>
      )}
    </div>
  )
}

export default UserCard

/**
 * Component UserList để hiển thị danh sách developers
 */
interface UserListProps {
  developers: Developer[]
  onDeveloperClick?: (developerId: string) => void
  viewMode?: 'grid' | 'list'
  className?: string
}

export const UserList: React.FC<UserListProps> = ({
  developers,
  onDeveloperClick,
  viewMode = 'grid',
  className = ''
}) => {
  if (developers.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy developer</h3>
        <p className="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc để xem kết quả khác</p>
      </div>
    )
  }

  return (
    <div className={`${
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
    } ${className}`}>
      {developers.map(developer => (
        <UserCard
          key={developer.id}
          developer={developer}
          onDeveloperClick={onDeveloperClick}
          showFullInfo={viewMode === 'list'}
          className={viewMode === 'list' ? 'flex items-center space-x-4' : ''}
        />
      ))}
    </div>
  )
}
