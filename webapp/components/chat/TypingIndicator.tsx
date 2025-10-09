'use client';
import React from 'react';

interface TypingIndicatorProps {
  typingUsers: Array<{
    userId: string;
    isTyping: boolean;
    timestamp: string;
  }>;
  currentUserId?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  currentUserId
}) => {
  // Filter out current user's typing indicator
  const otherTypingUsers = typingUsers.filter(
    user => user.userId !== currentUserId && user.isTyping
  );

  if (otherTypingUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-start mb-3">
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {otherTypingUsers.length === 1 
              ? 'Đang nhập...' 
              : `${otherTypingUsers.length} người đang nhập...`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
