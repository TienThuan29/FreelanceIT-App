'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';

interface ChatNotification {
  id: string;
  message: string;
  type: 'new_message' | 'typing' | 'user_online' | 'user_offline';
  timestamp: Date;
  read: boolean;
}

export const useChatNotifications = () => {
  const { messages, typingUsers, onlineUsers, isConnected } = useChat();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Use refs to track previous values to avoid unnecessary re-renders
  const lastMessageIdRef = useRef<string | null>(null);
  const lastTypingStateRef = useRef<string>('');
  const processedMessagesRef = useRef<Set<string>>(new Set());

  // Add notification
  const addNotification = (notification: Omit<ChatNotification, 'id' | 'timestamp'>) => {
    const newNotification: ChatNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random()}`,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Monitor new messages - optimized to avoid unnecessary re-renders
  useEffect(() => {
    if (!user || !isConnected || messages.length === 0) return;

    const lastMessage = messages[0];
    if (!lastMessage || lastMessage.senderId === user.id) return;

    // Only process if this is a new message we haven't seen
    if (lastMessage.id === lastMessageIdRef.current || processedMessagesRef.current.has(lastMessage.id)) {
      return;
    }

    // Check if this is a new message (within last 10 seconds)
    const messageTime = new Date(lastMessage.createdAt);
    const now = new Date();
    const diffInSeconds = (now.getTime() - messageTime.getTime()) / 1000;

    if (diffInSeconds < 10) {
      addNotification({
        message: `Tin nhắn mới từ người dùng ${lastMessage.senderId}`,
        type: 'new_message',
        read: false
      });
      
      // Mark as processed
      lastMessageIdRef.current = lastMessage.id;
      processedMessagesRef.current.add(lastMessage.id);
    }
  }, [messages, user, isConnected]);

  // Monitor typing indicators - optimized to avoid unnecessary re-renders
  useEffect(() => {
    if (!user || !isConnected) return;

    const otherTypingUsers = typingUsers.filter(
      typingUser => typingUser.userId !== user.id && typingUser.isTyping
    );

    // Create a string representation of typing state to compare
    const typingState = otherTypingUsers.map(u => u.userId).sort().join(',');
    
    // Only add notification if typing state actually changed
    if (typingState !== lastTypingStateRef.current && otherTypingUsers.length > 0) {
      const typingUser = otherTypingUsers[0];
      addNotification({
        message: `Người dùng ${typingUser.userId} đang nhập...`,
        type: 'typing',
        read: false
      });
      
      lastTypingStateRef.current = typingState;
    } else if (otherTypingUsers.length === 0) {
      // Reset when no one is typing
      lastTypingStateRef.current = '';
    }
  }, [typingUsers, user, isConnected]);

  // Monitor online status changes
  useEffect(() => {
    if (!user || !isConnected) return;

    // This would need to be implemented with a more sophisticated state tracking
    // to detect when users come online/offline
  }, [onlineUsers, user, isConnected]);

  return {
    notifications,
    unreadCount,
    totalUnread: unreadCount, // Alias for backward compatibility
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};