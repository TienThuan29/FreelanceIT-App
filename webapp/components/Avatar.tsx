import React from 'react'
import SmartImage from './SmartImage'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  backgroundColor?: string
  showOnlineStatus?: boolean
  isOnline?: boolean
}

/**
 * Component Avatar thông minh với fallback
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  backgroundColor,
  showOnlineStatus = false,
  isOnline = false
}) => {
  
  // Size mapping
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const baseClasses = `${sizeClasses[size]} rounded-full object-cover`

  return (
    <div className={`relative inline-block ${className}`}>
      <SmartImage
        src={src}
        alt={name}
        className={baseClasses}
        type="avatar"
        fallbackName={name}
        backgroundColor={backgroundColor}
      />
      
      {showOnlineStatus && (
        <div className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${
          isOnline ? 'bg-green-400' : 'bg-gray-400'
        } ${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
      )}
    </div>
  )
}

export default Avatar

/**
 * Component AvatarGroup để hiển thị nhiều avatar
 */
interface AvatarGroupProps {
  users: Array<{
    src?: string
    name: string
    isOnline?: boolean
  }>
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showOnlineStatus?: boolean
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = 'md',
  className = '',
  showOnlineStatus = false
}) => {
  const displayUsers = users.slice(0, max)
  const remainingCount = users.length - max

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.src}
          name={user.name}
          size={size}
          className="ring-2 ring-white"
          showOnlineStatus={showOnlineStatus}
          isOnline={user.isOnline}
        />
      ))}
      
      {remainingCount > 0 && (
        <div className={`${
          size === 'sm' ? 'w-8 h-8 text-xs' : 
          size === 'md' ? 'w-10 h-10 text-sm' : 
          size === 'lg' ? 'w-16 h-16 text-base' : 'w-24 h-24 text-lg'
        } rounded-full bg-gray-500 text-white flex items-center justify-center ring-2 ring-white font-medium`}>
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
