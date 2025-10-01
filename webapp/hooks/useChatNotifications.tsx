import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface ChatNotification {
  conversationId: string
  unreadCount: number
  lastMessage: string
  timestamp: Date
}

/**
 * Hook quản lý thông báo chat
 * @returns Object chứa totalUnread và notifications
 */
export const useChatNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<ChatNotification[]>([])
  const [totalUnread, setTotalUnread] = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setTotalUnread(0)
      return
    }

    // Mock data cho các conversation với tin nhắn chưa đọc
    const mockNotifications: ChatNotification[] = [
      {
        conversationId: '1',
        unreadCount: 2,
        lastMessage: 'Chúng tôi cần phát triển một web app với React...',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        conversationId: '3', 
        unreadCount: 1,
        lastMessage: 'Khi nào bạn có thể bắt đầu dự án này?',
        timestamp: new Date(Date.now() - 3600000)
      }
    ]

    setNotifications(mockNotifications)
    
    // Tính tổng số tin nhắn chưa đọc
    const total = mockNotifications.reduce((sum, notif) => sum + notif.unreadCount, 0)
    setTotalUnread(total)

  }, [user])

  /**
   * Đánh dấu conversation đã đọc
   */
  const markAsRead = (conversationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.conversationId === conversationId 
          ? { ...notif, unreadCount: 0 }
          : notif
      )
    )
    
    // Cập nhật lại total
    setTotalUnread(prev => {
      const currentNotif = notifications.find(n => n.conversationId === conversationId)
      return prev - (currentNotif?.unreadCount || 0)
    })
  }

  /**
   * Thêm tin nhắn mới
   */
  const addNewMessage = (conversationId: string, message: string) => {
    setNotifications(prev => {
      const existingIndex = prev.findIndex(n => n.conversationId === conversationId)
      
      if (existingIndex >= 0) {
        // Cập nhật conversation hiện có
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          unreadCount: updated[existingIndex].unreadCount + 1,
          lastMessage: message,
          timestamp: new Date()
        }
        return updated
      } else {
        // Thêm conversation mới
        return [...prev, {
          conversationId,
          unreadCount: 1,
          lastMessage: message,
          timestamp: new Date()
        }]
      }
    })
    
    setTotalUnread(prev => prev + 1)
  }

  return {
    notifications,
    totalUnread,
    markAsRead,
    addNewMessage
  }
}
