'use client';
import React, { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface ChatNotificationProps {
  className?: string;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({ className = '' }) => {
  const { conversations, isConnected } = useChat();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Calculate unread messages count
  useEffect(() => {
    if (!user) return;

    let totalUnread = 0;
    conversations.forEach(conversation => {
      // This is a simplified calculation - in real app, you'd get this from API
      // For now, we'll just show if there are any conversations with recent activity
      if (conversation.lastMessageDate) {
        const lastMessageTime = new Date(conversation.lastMessageDate);
        const now = new Date();
        const diffInMinutes = (now.getTime() - lastMessageTime.getTime()) / (1000 * 60);
        
        // Consider messages from last 5 minutes as "unread" for demo
        if (diffInMinutes < 5) {
          totalUnread++;
        }
      }
    });

    setUnreadCount(totalUnread);
  }, [conversations, user]);

  // Show notification when new messages arrive
  useEffect(() => {
    if (unreadCount > 0 && isConnected) {
      setShowNotification(true);
      setLastNotification(`Bạn có ${unreadCount} tin nhắn mới`);
      
      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [unreadCount, isConnected]);

  const handleDismiss = () => {
    setShowNotification(false);
  };

  const handleGoToChat = () => {
    setShowNotification(false);
    window.location.href = '/roomchat';
  };

  if (!showNotification || !user) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <BellIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Tin nhắn mới
            </p>
            <p className="text-sm text-gray-500">
              {lastNotification}
            </p>
            <div className="mt-3 flex space-x-2">
              <Button
                onClick={handleGoToChat}
                className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
              >
                Xem ngay
              </Button>
              <Button
                onClick={handleDismiss}
                className="bg-gray-100 text-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-200"
              >
                Bỏ qua
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatNotification;
