'use client';
import React from 'react';

interface OnlineStatusProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const borderSizeClasses = {
    sm: 'border',
    md: 'border-2',
    lg: 'border-2'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${borderSizeClasses[size]} border-white rounded-full absolute ${
        isOnline ? 'bg-green-500' : 'bg-gray-300'
      } ${className}`}
    />
  );
};

export default OnlineStatus;
