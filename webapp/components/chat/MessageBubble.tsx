'use client';
import React, { useState, useEffect } from 'react';
import { CheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    isRead: boolean;
    isDeleted: boolean;
  };
  currentUserId: string;
  showAvatar?: boolean;
  showTime?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
  showAvatar = false,
  showTime = true
}) => {
  const [isClient, setIsClient] = useState(false);
  const isOwnMessage = message.senderId === currentUserId;

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatMessageTime = (timestamp: string) => {
    if (!isClient) return '...'; // Prevent hydration mismatch
    return format(new Date(timestamp), 'HH:mm', { locale: vi });
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-500 italic">
          <p className="text-sm">Tin nhắn đã bị xóa</p>
          {showTime && (
            <span className="text-xs text-gray-400 mt-1 block">
              {formatMessageTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
          isOwnMessage
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}
      >
        <p className="text-sm break-words leading-relaxed">{message.content}</p>
        {showTime && (
          <div className={`flex items-center justify-between mt-2 ${
            isOwnMessage ? 'text-white/70' : 'text-gray-500'
          }`}>
            <span className="text-xs">
              {formatMessageTime(message.createdAt)}
            </span>
            {isOwnMessage && (
              <div className="flex items-center space-x-1">
                {message.isRead ? (
                  <CheckCircleIcon className="h-4 w-4 text-blue-200" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
