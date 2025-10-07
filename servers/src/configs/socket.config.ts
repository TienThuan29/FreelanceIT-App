// Socket configuration constants
export const SOCKET_CONFIG = {
  // Rate limiting
  TYPING_RATE_LIMIT_MS: 3000, // 3 seconds between typing events
  MESSAGE_DUPLICATE_CHECK_MS: 5000, // 5 seconds duplicate check
  USER_ONLINE_OFFLINE_THROTTLE_MS: 10000, // 10 seconds between online/offline events
  CONVERSATION_JOIN_LEAVE_THROTTLE_MS: 2000, // 2 seconds between join/leave events
  
  // Connection limits
  MAX_CONNECTIONS_PER_USER: 3,
  
  // Cleanup intervals
  CLEANUP_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
  TIMESTAMP_MAX_AGE_MS: 30 * 1000, // 30 seconds
  
  // Message limits
  MAX_MESSAGE_LENGTH: 1000,
  MAX_ATTACHMENTS: 5,
  
  // Room names
  USER_ROOM_PREFIX: 'user_',
  CONVERSATION_ROOM_PREFIX: 'conversation_',
  
  // Event names
  EVENTS: {
    // Connection events
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CONNECTION_ERROR: 'connection_error',
    
    // User events
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    USER_READY: 'user_ready',
    USER_JOINED_CONVERSATION: 'user_joined_conversation',
    
    // Room events
    JOIN_USER_ROOM: 'join_user_room',
    JOIN_CONVERSATION: 'join_conversation',
    LEAVE_CONVERSATION: 'leave_conversation',
    
    // Message events
    SEND_MESSAGE: 'send_message',
    NEW_MESSAGE: 'new_message',
    MESSAGE_SENT: 'message_sent',
    MESSAGE_ERROR: 'message_error',
    MESSAGE_READ: 'message_read',
    MARK_MESSAGE_READ: 'mark_message_read',
    
    // Typing events
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    USER_TYPING: 'user_typing',
    
    // Conversation events
    CONVERSATION_CREATED: 'conversation_created'
  },
  
  // Error messages
  ERRORS: {
    DUPLICATE_MESSAGE: 'Tin nhắn trùng lặp',
    CONNECTION_LIMIT_EXCEEDED: 'Vượt quá giới hạn kết nối',
    MESSAGE_SEND_FAILED: 'Gửi tin nhắn thất bại',
    INVALID_TOKEN: 'Token không hợp lệ',
    NO_TOKEN: 'Không có token xác thực'
  }
} as const;

export type SocketEventName = typeof SOCKET_CONFIG.EVENTS[keyof typeof SOCKET_CONFIG.EVENTS];
export type SocketErrorType = typeof SOCKET_CONFIG.ERRORS[keyof typeof SOCKET_CONFIG.ERRORS];
