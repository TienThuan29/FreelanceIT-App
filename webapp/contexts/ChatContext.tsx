'use client';
import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Api } from '@/configs/api';
import axios from 'axios';
import { toast } from 'sonner';

// Types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  readDate?: string;
  editedDate?: string;
  isDeleted: boolean;
}

export interface Conversation {
  id: string;
  name?: string;
  participants: string[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageDate?: string;
  isArchived: boolean;
}

export interface TypingUser {
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface OnlineUser {
  userId: string;
  timestamp: string;
}

// Context types
interface ChatContextType {
  // Connection state
  socket: Socket | null;
  isConnected: boolean;
  
  // Data state
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: ChatMessage[];
  onlineUsers: string[];
  typingUsers: TypingUser[];
  lastMessages: { [conversationId: string]: string };
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (content: string, attachments?: string[]) => void;
  startTyping: () => void;
  stopTyping: () => void;
  markMessagesAsRead: (messageIds: string[]) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string, page?: number, loadOlder?: boolean) => Promise<void>;
  loadOlderMessages: (conversationId: string) => Promise<void>;
  createConversation: (participantIds: string[], projectId?: string) => Promise<Conversation | null>;
  updateConversation: (conversationId: string, name: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setEnableSocket: (enable: boolean) => void;
  
  // Loading states
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isLoadingOlderMessages: boolean;
  isSendingMessage: boolean;
  
  // Pagination states
  hasMoreMessages: { [conversationId: string]: boolean };
  
  // Conversation states
  conversationHasMessages: { [conversationId: string]: boolean };
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user, accessToken, refreshToken } = useAuth();
  
  // Connection state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [enableSocket, setEnableSocket] = useState(false);
  
  // Data state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [lastMessages, setLastMessages] = useState<{ [conversationId: string]: string }>({});
  
  // Pagination state
  const [messagePages, setMessagePages] = useState<{ [conversationId: string]: number }>({});
  const [hasMoreMessages, setHasMoreMessages] = useState<{ [conversationId: string]: boolean }>({});
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  
  // Conversation state
  const [conversationHasMessages, setConversationHasMessages] = useState<{ [conversationId: string]: boolean }>({});
  
  // Loading states
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Refs
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const sentMessagesRef = useRef(new Set<string>());
  const offlineQueueRef = useRef<ChatMessage[]>([]);
  const messageRetryMapRef = useRef(new Map<string, number>());
  const notificationTimestampsRef = useRef(new Map<string, number>());
  const previousConversationRef = useRef<Conversation | null>(null);

  // Helper function to throttle notifications
  const showThrottledNotification = (key: string, message: string, type: 'info' | 'error' | 'warning' = 'info', throttleMs: number = 5000) => {
    const now = Date.now();
    const lastTimestamp = notificationTimestampsRef.current.get(key);
    
    if (lastTimestamp && (now - lastTimestamp) < throttleMs) {
      return false; // Throttled
    }
    
    notificationTimestampsRef.current.set(key, now);
    
    switch (type) {
      case 'info':
        toast.info(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
    }
    return true;
  };

  // Helper function to update message timestamp
  const updateMessageTimestamp = (messageId: string, timestamp: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, createdAt: timestamp, updatedAt: timestamp }
          : msg
      )
    );
  };

  // Helper function to update message read status
  const updateMessageReadStatus = (messageId: string, timestamp: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isRead: true, readDate: timestamp }
          : msg
      )
    );
  };

  // Helper function to update typing users
  const updateTypingUsers = (data: TypingUser) => {
    setTypingUsers(prev => {
      const filtered = prev.filter(t => t.userId !== data.userId);
      return data.isTyping ? [...filtered, data] : filtered;
    });
  };

  // Helper function to remove typing user
  const removeTypingUser = (userId: string) => {
    setTypingUsers(prev => prev.filter(t => t.userId !== userId));
  };

  // Helper function to update message read status in local state
  const updateLocalMessageReadStatus = (messageIds: string[]) => {
    setMessages(prev => 
      prev.map(msg => 
        messageIds.includes(msg.id) 
          ? { ...msg, isRead: true, readDate: new Date().toISOString() }
          : msg
      )
    );
  };

  // Helper function to add online user
  const addOnlineUser = useCallback((userId: string) => {
    setOnlineUsers(prev => {
      if (prev.includes(userId)) {
        return prev; // Already online, no need to update
      }
      return [...prev, userId];
    });
  }, []);

  // Helper function to remove online user
  const removeOnlineUser = useCallback((userId: string) => {
    setOnlineUsers(prev => {
      if (!prev.includes(userId)) {
        return prev; // Already offline, no need to update
      }
      return prev.filter(id => id !== userId);
    });
  }, []);

  // Initialize socket connection - CONTROLLED BY FLAG
  const connect = () => {
    // Socket connection is controlled by enableSocket flag
    if (!enableSocket) return;
    if (!user || !accessToken || socket) return;

    console.log('Connecting to socket with token:', {
      tokenLength: accessToken?.length,
      userId: user?.id,
      socketUrl: Api.SOCKET_URL
    });

    const newSocket = io(Api.SOCKET_URL, {
      auth: {
        token: accessToken
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('=== SOCKET CONNECTED ===');
      console.log('Connected to chat server');
      console.log('Socket connected with auth:', newSocket.auth);
      console.log('Socket ID:', newSocket.id);
      console.log('Socket connected:', newSocket.connected);
      setIsConnected(true);
      reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
      
      // Process offline queue
      processOfflineQueue();
      
      // Join user's personal room for receiving events
      if (user?.id) {
        newSocket.emit('join_user_room', user.id);
        
        // Add current user to online users list
        addOnlineUser(user.id);
        
        // Note: Auto-join conversations removed to prevent continuous requests
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from chat server:', reason);
      setIsConnected(false);
      
      // Auto-reconnect on unexpected disconnect
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        return;
      }
      
      // Attempt to reconnect
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      } else {
        toast.error('Không thể kết nối đến chat server. Vui lòng refresh trang.');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      console.error('Connection error details:', {
        message: error.message,
        description: (error as any).description,
        context: (error as any).context,
        type: (error as any).type
      });
      setIsConnected(false);
      
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`Connection error, retrying in ${delay}ms`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      } else {
        toast.error('Không thể kết nối đến chat server');
      }
    });

    // Message events
    newSocket.on('new_message', (message: ChatMessage) => {
      console.log('Received new_message event:', message);
      
      // Update conversation state - mark as having messages
      setConversationHasMessages(prev => ({ ...prev, [message.conversationId]: true }));
      
      // Check if message already exists to prevent duplicates
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === message.id);
        if (exists) {
          return prev;
        }
        
        // For messages from current user, replace temp message with real message
        if (user?.id === message.senderId) {
          const tempMessageIndex = prev.findIndex(msg => 
            msg.senderId === user.id && 
            msg.conversationId === message.conversationId && 
            msg.content === message.content &&
            msg.id.startsWith('temp_')
          );
          
          if (tempMessageIndex >= 0) {
            const newMessages = [...prev];
            newMessages[tempMessageIndex] = message;
            return newMessages;
          } else {
            // If no temp message found, just add the real message
            return [...prev, message];
          }
        }
        
        // Always add new message from other users
        return [...prev, message];
      });

      // Update last message for the conversation
      setLastMessages(prev => ({
        ...prev,
        [message.conversationId]: message.content
      }));
      
      // Conversation update is handled below
      
      // Update conversation with new message and move to top
      setConversations(prev => {
        const conversationIndex = prev.findIndex(conv => conv.id === message.conversationId);
        if (conversationIndex >= 0) {
          const conversation = prev[conversationIndex];
          const updatedConversation = {
            ...conversation,
            lastMessageDate: message.createdAt,
            updatedAt: message.createdAt
          };
          
          // Remove conversation from current position and add to top
          const newConversations = [...prev];
          newConversations.splice(conversationIndex, 1);
          return [updatedConversation, ...newConversations];
        } else {
          // If conversation not found in list, don't add it immediately
          // Instead, reload conversations to get the complete data with participants
          console.log('Conversation not found in list, will reload conversations');
          return prev;
        }
      });
      
      // Show notification if not in current conversation AND not from current user
      if (currentConversation?.id !== message.conversationId && user?.id !== message.senderId) {
        showThrottledNotification(`new_message_${message.conversationId}`, 'Bạn có tin nhắn mới', 'info', 10000);
        
        // Only update conversation order, don't reload all conversations
        
        // Note: Auto-join removed to prevent continuous requests
      }
    });

    newSocket.on('message_sent', (data: { messageId: string; realMessageId?: string; timestamp: string }) => {
      updateMessageTimestamp(data.messageId, data.timestamp);
      setIsSendingMessage(false);
      
      // Update message ID if we got the real one from server
      if (data.realMessageId) {
        setMessages(prev => {
          const updatedMessages = prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, id: data.realMessageId!, createdAt: data.timestamp, updatedAt: data.timestamp }
              : msg
          );
          return updatedMessages;
        });
      }
    });

    newSocket.on('message_error', (data: { messageId: string; error: string }) => {
      console.error('Message send error:', data.error);
      setIsSendingMessage(false);
      
      // Remove failed message from UI
      setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
      
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
    });

    // Handle join conversation errors
    newSocket.on('join_conversation_error', (data: { conversationId: string; error: string }) => {
      console.error('=== JOIN CONVERSATION ERROR ===');
      console.error('Failed to join conversation:', data.conversationId);
      console.error('Error:', data.error);
      toast.error(`Không thể tham gia cuộc trò chuyện: ${data.error}`);
    });

    newSocket.on('message_read', (data: { messageId: string; readBy: string; timestamp: string }) => {
      updateMessageReadStatus(data.messageId, data.timestamp);
    });

    // Handle conversation updated events
    newSocket.on('conversation_updated', (data: { conversationId: string; name: string; updatedBy: string; updatedAt: string }) => {
      console.log('Received conversation_updated event:', data);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === data.conversationId ? { ...conv, name: data.name } : conv
        )
      );
      
      // Update current conversation if it's the one being updated
      if (currentConversation?.id === data.conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, name: data.name } : null);
      }
    });

    // Handle conversation deleted events
    newSocket.on('conversation_deleted', (data: { conversationId: string; deletedBy: string; deletedAt: string }) => {
      console.log('Received conversation_deleted event:', data);
      
      // Remove from conversations list
      setConversations(prev => prev.filter(conv => conv.id !== data.conversationId));
      
      // Clear current conversation if it's the one being deleted
      if (currentConversation?.id === data.conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      // Clear messages for this conversation
      setMessages(prev => prev.filter(msg => msg.conversationId !== data.conversationId));
      
      // Clear last message for this conversation
      setLastMessages(prev => {
        const updated = { ...prev };
        delete updated[data.conversationId];
        return updated;
      });
      
      // Clear pagination state for this conversation
      setMessagePages(prev => {
        const updated = { ...prev };
        delete updated[data.conversationId];
        return updated;
      });
      
      setHasMoreMessages(prev => {
        const updated = { ...prev };
        delete updated[data.conversationId];
        return updated;
      });
      
      // Clear conversation state
      setConversationHasMessages(prev => {
        const updated = { ...prev };
        delete updated[data.conversationId];
        return updated;
      });
      
      // Show notification
      showThrottledNotification(
        `conversation_deleted_${data.conversationId}`, 
        'Cuộc trò chuyện đã bị xóa', 
        'info', 
        5000
      );
    });

    // Typing events
    newSocket.on('user_typing', (data: TypingUser) => {
      console.log('=== USER TYPING RECEIVED ===');
      console.log('User typing data:', data);
      console.log('Current user ID:', user?.id);
      console.log('Is from current user?', data.userId === user?.id);
      
      if (data.userId === user?.id) return; // Don't show own typing

      updateTypingUsers(data);

      // Auto remove typing indicator after 3 seconds
      if (data.isTyping) {
        setTimeout(() => removeTypingUser(data.userId), 3000);
      }
    });

    // Online/offline events
    newSocket.on('user_online', (data: OnlineUser) => {
      addOnlineUser(data.userId);
    });

    newSocket.on('user_offline', (data: OnlineUser) => {
      removeOnlineUser(data.userId);
    });

    // User ready event
    newSocket.on('user_ready', (data: { userId: string; timestamp: string }) => {
      console.log('User ready to receive events:', data.userId);
    });

    // Conversation events
    newSocket.on('conversation_created', (conversation: Conversation) => {
      console.log('New conversation created:', conversation);
      console.log('Current user ID:', user?.id);
      console.log('Conversation participants:', conversation.participants);
      
      // Check if current user is a participant
      if (user?.id && conversation.participants.includes(user.id)) {
        console.log('User is participant, adding conversation to list');
        
        setConversations(prev => {
          // Check if conversation already exists to avoid duplicates
          const exists = prev.some(conv => conv.id === conversation.id);
          if (!exists) {
            console.log('Adding new conversation to list');
            // Add new conversation at the beginning (top) - it has no messages yet
            return [conversation, ...prev];
          }
          console.log('Conversation already exists, not adding');
          return prev;
        });
        
        // Auto-join the conversation room for real-time messaging
        console.log('Auto-joining conversation room:', conversation.id);
        newSocket.emit('join_conversation', conversation.id);
        
        // Show notification for the receiver (not the creator)
        if (currentConversation?.id !== conversation.id) {
          showThrottledNotification(`new_conversation_${conversation.id}`, 'Bạn có cuộc trò chuyện mới', 'info', 10000);
        }
      } else {
        console.log('User is not a participant in this conversation');
      }
    });

    // User joined conversation event
    newSocket.on('user_joined_conversation', (data: { userId: string; conversationId: string; timestamp: string }) => {
      console.log('User joined conversation:', data);
      // No notification shown for user joining conversation
    });

    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
      setTypingUsers([]);
    }
    
    // Clear timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Reset reconnect attempts
    reconnectAttemptsRef.current = 0;
  };

    // Join conversation room
  const joinConversation = useCallback((conversationId: string) => {
    if (socket) {
      console.log('Joining conversation room:', conversationId);
      socket.emit('join_conversation', conversationId);
    } else {
      console.log('Cannot join conversation: socket not available');
    }
  }, [socket]);

  // Leave conversation room
  const leaveConversation = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId);
    }
  }, [socket]);

  // Generate unique message ID
  const generateMessageId = () => {
    return `temp_${Date.now()}_${crypto.randomUUID()}`;
  };

  // Retry failed message
  const retryMessage = async (message: ChatMessage, maxRetries = 3) => {
    const retryCount = messageRetryMapRef.current.get(message.id) || 0;
    
    if (retryCount >= maxRetries) {
      console.error('Max retries reached for message:', message.id);
      messageRetryMapRef.current.delete(message.id);
      return;
    }

    messageRetryMapRef.current.set(message.id, retryCount + 1);
    
    if (socket && isConnected) {
      try {
        socket.emit('send_message', {
          conversationId: message.conversationId,
          content: message.content,
          messageId: message.id,
          timestamp: message.createdAt
        });
      } catch (error) {
        console.error('Error retrying message:', error);
        // Schedule another retry
        setTimeout(() => retryMessage(message, maxRetries), 2000 * (retryCount + 1));
      }
    } else {
      // Add to offline queue if not connected
      offlineQueueRef.current.push(message);
    }
  };

  // Process offline queue
  const processOfflineQueue = () => {
    if (offlineQueueRef.current.length > 0 && socket && isConnected) {
      const messages = [...offlineQueueRef.current];
      offlineQueueRef.current = [];
      
      messages.forEach(message => {
        retryMessage(message);
      });
    }
  };

  // Send message
  const sendMessage = (content: string, attachments?: string[]) => {
    if (!currentConversation || !user) return;

    const messageId = generateMessageId();
    
    // Check if message was already sent
    if (sentMessagesRef.current.has(messageId)) {
      console.log('Message already sent, ignoring:', messageId);
      return;
    }
    
    sentMessagesRef.current.add(messageId);
    
    const tempMessage: ChatMessage = {
      id: messageId,
      conversationId: currentConversation.id,
      senderId: user.id,
      content,
      attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRead: false,
      isDeleted: false
    };
    

    // Add message to UI immediately
    setMessages(prev => [...prev, tempMessage]);
    setIsSendingMessage(true);
    
    // Update conversation state - mark as having messages
    setConversationHasMessages(prev => ({ ...prev, [currentConversation.id]: true }));

    // Update last message for the conversation
    setLastMessages(prev => ({
      ...prev,
      [currentConversation.id]: content
    }));

    // Send via socket if connected, otherwise add to offline queue
    if (socket && isConnected) {
      try {
        // Ensure sender is in conversation room before sending
        socket.emit('join_conversation', currentConversation.id);
        
        // Small delay to ensure room joining is processed
        setTimeout(() => {
          socket.emit('send_message', {
            conversationId: currentConversation.id,
            content,
            messageId,
            timestamp: new Date().toISOString()
          });
        }, 100);
        
        // Fallback: If no response in 3 seconds, keep temp message
        setTimeout(() => {
          if (isSendingMessage) {
            setIsSendingMessage(false);
          }
        }, 3000);
      } catch (error) {
        console.error('Error sending message:', error);
        retryMessage(tempMessage);
      }
    } else {
      console.log('Socket not connected, adding to offline queue');
      offlineQueueRef.current.push(tempMessage);
      setIsSendingMessage(false);
      toast.warning('Tin nhắn sẽ được gửi khi kết nối lại');
    }

    // Stop typing indicator
    stopTyping();
  };

  // Typing indicators
  const startTyping = () => {
    if (!socket || !currentConversation) return;

    socket.emit('typing_start', { conversationId: currentConversation.id });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const stopTyping = () => {
    if (!socket || !currentConversation) return;

    socket.emit('typing_stop', { conversationId: currentConversation.id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (messageIds: string[]) => {
    if (!socket || !currentConversation || !user) return;

    try {
      await axios.put(
        `${Api.BASE_API}${Api.Chat.MARK_READ}`,
        { messageIds },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      // Update local state
      updateLocalMessageReadStatus(messageIds);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [socket, currentConversation, user, accessToken]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!accessToken) {
      console.log('No access token available for loading conversations');
      return;
    }

    console.log('Loading conversations from API...');
    setIsLoadingConversations(true);
    try {
      const response = await axios.get(`${Api.BASE_API}${Api.Chat.CONVERSATIONS}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const loadedConversations = response.data.dataResponse;
      console.log('Loaded conversations:', loadedConversations.length);
      
      // Filter conversations to only include those where current user is a participant
      const userConversations = loadedConversations.filter((conversation: Conversation) => {
        const isParticipant = user?.id && conversation.participants.includes(user.id);
        console.log(`Conversation ${conversation.id}: isParticipant=${isParticipant}, participants=${conversation.participants}, userId=${user?.id}`);
        return isParticipant;
      });
      console.log('Filtered conversations for user:', userConversations.length);
      
      // Sort conversations: conversations with messages first, then by lastMessageDate/createdAt
      const sortedConversations = userConversations.sort((a: Conversation, b: Conversation) => {
        const aHasMessages = !!a.lastMessageDate;
        const bHasMessages = !!b.lastMessageDate;
        
        // If both have messages or both don't have messages, sort by lastMessageDate/createdAt
        if (aHasMessages === bHasMessages) {
          const aTime = a.lastMessageDate || a.createdAt;
          const bTime = b.lastMessageDate || b.createdAt;
          
          // Newest first (top)
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        }
        
        // Conversations with messages go to top, conversations without messages go to bottom
        return aHasMessages ? -1 : 1;
      });
      
      setConversations(sortedConversations);
      
      // Note: Auto-join conversations removed to prevent continuous requests
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Không thể tải danh sách cuộc trò chuyện');
    } finally {
      setIsLoadingConversations(false);
    }
  }, [accessToken, user?.id, socket, isConnected]);

  // Helper function to update tokens in localStorage
  const updateTokensInStorage = (newAccessToken: string, newRefreshToken: string) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth_token') || '{}');
      const updatedAuthData = {
        ...authData,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
      localStorage.setItem('auth_token', JSON.stringify(updatedAuthData));
      console.log('Tokens updated in localStorage');
    } catch (error) {
      console.error('Failed to update tokens in localStorage:', error);
    }
  };

  // Helper function to handle token refresh and retry
  const handleTokenRefreshAndRetry = async (conversationId: string, page: number) => {
    console.log('Starting token refresh process...');
    console.log('Refresh token available:', !!refreshToken);
    
    if (!refreshToken) {
      console.error('No refresh token available');
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return false;
    }
    
    try {
      const refreshResponse = await axios.post(`${Api.BASE_API}${Api.Auth.REFRESH_TOKEN}`, {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
      
      console.log('Refresh token response:', refreshResponse.data);
      
      if (refreshResponse.data.success) {
        const newAccessToken = refreshResponse.data.dataResponse.accessToken;
        const newRefreshToken = refreshResponse.data.dataResponse.refreshToken;
        console.log('New access token received:', !!newAccessToken);
        console.log('New refresh token received:', !!newRefreshToken);
        
        // Update tokens in localStorage
        updateTokensInStorage(newAccessToken, newRefreshToken);
        
        // Update context tokens (this will trigger a re-render with new tokens)
        // Note: This assumes the AuthContext will pick up the new tokens
        window.location.reload(); // Simple approach to refresh the context
        
        const retryResponse = await axios.get(
          `${Api.BASE_API}${Api.Chat.MESSAGES}/${conversationId}/messages?page=${page}&limit=50`,
          {
            headers: { Authorization: `Bearer ${newAccessToken}` }
          }
        );
        
        console.log('Retry successful:', retryResponse.data);
        
        if (page === 1) {
          setMessages(retryResponse.data.dataResponse);
        } else {
          setMessages(prev => [...prev, ...retryResponse.data.dataResponse]);
        }
        return true;
      } else {
        console.error('Refresh token failed:', refreshResponse.data.message);
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    } catch (refreshError: any) {
      console.error('Failed to refresh token:', refreshError);
      console.error('Refresh error response:', refreshError.response?.data);
      console.error('Refresh error status:', refreshError.response?.status);
      
      if (refreshError.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        // Clear invalid tokens
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      } else {
        toast.error('Lỗi kết nối. Vui lòng thử lại.');
      }
    }
    return false;
  };

  // Load messages
  const loadMessages = useCallback(async (conversationId: string, page: number = 1, loadOlder: boolean = false) => {
    if (!accessToken) {
      console.error('No access token available for loading messages');
      return;
    }

    // Prevent multiple simultaneous requests for the same conversation
    if (isLoadingMessages && !loadOlder) {
      console.log('Already loading messages for conversation:', conversationId);
      return;
    }

    console.log('Loading messages for conversation:', conversationId, 'page:', page, 'loadOlder:', loadOlder);
    console.log('Access token available:', !!accessToken);
    
    if (loadOlder) {
      setIsLoadingOlderMessages(true);
    } else {
      setIsLoadingMessages(true);
    }

    try {
      const response = await axios.get(
        `${Api.BASE_API}${Api.Chat.MESSAGES}/${conversationId}/messages?page=${page}&limit=50`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      
      const newMessages = response.data.dataResponse || [];
      const isLastPage = newMessages.length < 50;
      
      if (page === 1) {
        // First load - replace all messages
        console.log('Loading messages from server:', newMessages);
        console.log('Current user ID:', user?.id);
        setMessages(newMessages);
        
        // Update pagination state
        setMessagePages(prev => ({ ...prev, [conversationId]: 1 }));
        setHasMoreMessages(prev => ({ ...prev, [conversationId]: !isLastPage }));
        
        // Update conversation state - track if it has messages
        setConversationHasMessages(prev => ({ ...prev, [conversationId]: newMessages.length > 0 }));
        
        // Update last message for this conversation
        if (newMessages.length > 0) {
          const lastMessage = newMessages[newMessages.length - 1];
          setLastMessages(prev => ({
            ...prev,
            [conversationId]: lastMessage.content
          }));
        }
      } else {
        // Load older messages - prepend to existing messages
        setMessages(prev => {
          const filteredPrev = prev.filter(msg => msg.conversationId === conversationId);
          const filteredNew = newMessages.filter((msg: ChatMessage) => 
            !filteredPrev.some(existing => existing.id === msg.id)
          );
          return [...filteredNew, ...filteredPrev];
        });
        
        // Update pagination state
        setMessagePages(prev => ({ ...prev, [conversationId]: page }));
        setHasMoreMessages(prev => ({ ...prev, [conversationId]: !isLastPage }));
      }
    } catch (error: any) {
      console.error('Error loading messages:', error);
      if (error.response?.status === 401) {
        console.log('Token expired, refreshing...');
        await handleTokenRefreshAndRetry(conversationId, page);
      } else {
        toast.error('Không thể tải tin nhắn');
      }
    } finally {
      setIsLoadingMessages(false);
      setIsLoadingOlderMessages(false);
    }
  }, [accessToken, user?.id, refreshToken]);

  // Load older messages for infinite scroll
  const loadOlderMessages = useCallback(async (conversationId: string) => {
    if (isLoadingOlderMessages || !hasMoreMessages[conversationId]) {
      return;
    }
    
    const currentPage = messagePages[conversationId] || 1;
    const nextPage = currentPage + 1;
    
    await loadMessages(conversationId, nextPage, true);
  }, [loadMessages, isLoadingOlderMessages, hasMoreMessages, messagePages]);

  // Create conversation
  const createConversation = async (participantIds: string[], projectId?: string): Promise<Conversation | null> => {
    if (!accessToken) {
      console.error('No access token available for creating conversation');
      return null;
    }

    console.log('Creating conversation with participants:', participantIds);
    console.log('Access token available:', !!accessToken);

    try {
      // Call backend API to create conversation
      const response = await axios.post(
        `${Api.BASE_API}${Api.Chat.CONVERSATIONS}`,
        {
          participantIds,
          projectId
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (response.data.success) {
        const newConversation = response.data.dataResponse;
        console.log('Created conversation via API:', newConversation);
        
        // Only add conversation if current user is a participant
        if (user?.id && newConversation.participants.includes(user.id)) {
          setConversations(prev => [...prev, newConversation]);
        }
        
        // Auto-join the conversation room
        if (socket && user?.id && newConversation.participants.includes(user.id)) {
          socket.emit('join_conversation', newConversation.id);
          console.log('Auto-joined new conversation room:', newConversation.id);
          console.log('New conversation participants:', newConversation.participants);
        }
        
        return newConversation;
      } else {
        throw new Error(response.data.message || 'Failed to create conversation');
      }
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      if (error.response?.status === 401) {
        console.log('Token expired while creating conversation, refreshing...');
        try {
          // Try to refresh token and retry
          const refreshResponse = await axios.post(`${Api.BASE_API}${Api.Auth.REFRESH_TOKEN}`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          if (refreshResponse.data.success) {
            const newAccessToken = refreshResponse.data.dataResponse.accessToken;
            
            // Retry creating conversation with new token
            const retryResponse = await axios.post(
              `${Api.BASE_API}${Api.Chat.CONVERSATIONS}`,
              {
                participantIds,
                projectId
              },
              {
                headers: { Authorization: `Bearer ${newAccessToken}` }
              }
            );

            if (retryResponse.data.success) {
              const newConversation = retryResponse.data.dataResponse;
              console.log('Created conversation after token refresh:', newConversation);
              
              // Only add conversation if current user is a participant
              if (user?.id && newConversation.participants.includes(user.id)) {
                setConversations(prev => [...prev, newConversation]);
              }
              
              // Auto-join the conversation room
              if (socket && user?.id && newConversation.participants.includes(user.id)) {
                socket.emit('join_conversation', newConversation.id);
                console.log('Auto-joined new conversation room after retry:', newConversation.id);
                console.log('Retry conversation participants:', newConversation.participants);
              }
              
              return newConversation;
            }
          }
        } catch (refreshError) {
          console.error('Failed to refresh token during conversation creation:', refreshError);
        }
      }
      toast.error('Không thể tạo cuộc trò chuyện');
      return null;
    }
  };

  // Update conversation (rename)
  const updateConversation = async (conversationId: string, name: string): Promise<void> => {
    if (!accessToken) {
      console.error('No access token available for updating conversation');
      return;
    }

    try {
      const response = await axios.put(
        `${Api.BASE_API}${Api.Chat.CONVERSATIONS}/${conversationId}`,
        { name },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const updatedConversation = response.data.dataResponse;
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, name: updatedConversation.name } : conv
        )
      );

      // Update current conversation if it's the one being updated
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, name: updatedConversation.name } : null);
      }

      // Emit socket event to notify other participants
      if (socket && isConnected) {
        socket.emit('update_conversation', {
          conversationId,
          name: name.trim()
        });
      }

      toast.success('Cập nhật tên cuộc trò chuyện thành công');
    } catch (error: any) {
      console.error('Error updating conversation:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
      } else {
        toast.error('Không thể cập nhật cuộc trò chuyện');
      }
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string): Promise<void> => {
    if (!accessToken) {
      console.error('No access token available for deleting conversation');
      return;
    }

    try {
      await axios.delete(
        `${Api.BASE_API}${Api.Chat.CONVERSATIONS}/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      // Remove from conversations list
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));

      // Clear current conversation if it's the one being deleted
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      // Clear messages for this conversation
      setMessages(prev => prev.filter(msg => msg.conversationId !== conversationId));

      // Clear last message for this conversation
      setLastMessages(prev => {
        const updated = { ...prev };
        delete updated[conversationId];
        return updated;
      });

      // Emit socket event to notify other participants
      if (socket && isConnected) {
        socket.emit('delete_conversation', {
          conversationId
        });
      }

      toast.success('Xóa cuộc trò chuyện thành công');
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
      } else {
        toast.error('Không thể xóa cuộc trò chuyện');
      }
    }
  };

  // Auto connect when user logs in
  // Socket connection controlled by enableSocket flag
  useEffect(() => {
    if (user && accessToken && enableSocket && !socket) {
      connect();
    } else if ((!user || !enableSocket) && socket) {
      disconnect();
    }
  }, [user?.id, accessToken, enableSocket]);

  // Load conversations when user and accessToken are available (only once)
  useEffect(() => {
    if (user && accessToken && conversations.length === 0) {
      loadConversations();
    }
  }, [user?.id, accessToken]); // Remove conversations.length and loadConversations from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Clear sent messages set to prevent memory leaks
      sentMessagesRef.current.clear();
      messageRetryMapRef.current.clear();
      
      disconnect();
    };
  }, []);

  // Wrapper function for setCurrentConversation with auto-join
  const setCurrentConversationWithJoin = useCallback((conversation: Conversation | null) => {
    // Leave previous conversation room if exists
    if (previousConversationRef.current && socket) {
      socket.emit('leave_conversation', previousConversationRef.current.id);
      console.log('Left conversation room:', previousConversationRef.current.id);
    }
    
    // Set new conversation
    setCurrentConversation(conversation);
    
    // Update ref
    previousConversationRef.current = conversation;
    
    // Join new conversation room if exists
    if (conversation && socket && user?.id && conversation.participants.includes(user.id)) {
      socket.emit('join_conversation', conversation.id);
      console.log('Joined conversation room:', conversation.id);
      console.log('Conversation participants:', conversation.participants);
    }
  }, [socket, user?.id]);

  const value: ChatContextType = useMemo(() => ({
    // Connection state
    socket,
    isConnected,
    
    // Data state
    conversations,
    currentConversation,
    messages,
    onlineUsers,
    typingUsers,
    lastMessages,
    
    // Actions
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markMessagesAsRead,
    loadConversations,
    loadMessages,
    loadOlderMessages,
    createConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversation: setCurrentConversationWithJoin,
    setEnableSocket,
    
    // Loading states
    isLoadingConversations,
    isLoadingMessages,
    isLoadingOlderMessages,
    isSendingMessage,
    
    // Pagination states
    hasMoreMessages,
    
    // Conversation states
    conversationHasMessages
  }), [
    socket,
    isConnected,
    conversations,
    currentConversation,
    messages,
    onlineUsers,
    typingUsers,
    lastMessages,
    isLoadingConversations,
    isLoadingMessages,
    isLoadingOlderMessages,
    isSendingMessage,
    hasMoreMessages,
    conversationHasMessages,
    setEnableSocket
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
