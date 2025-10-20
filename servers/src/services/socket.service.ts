import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import logger from '@/libs/logger';
import jwt from 'jsonwebtoken';
import { config } from '@/configs/config';
import {
  SocketMessageData,
  SocketTypingData,
  SocketMessageReadData,
  CreateMessageInput
} from '@/types/chat.type';
import { SOCKET_CONFIG } from '@/configs/socket.config';
import { ChatService } from '@/services/chat.service';
import { UserRepository } from '@/repositories/user.repo';
import { ProjectTeamRepository } from '@/repositories/project-team.repo';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  broadcast: {
    emit: (event: string, data: any) => void;
  };
}

interface Socket {
  id: string;
  userId?: string;
  userRole?: string;
  join: (room: string) => void;
  leave: (room: string) => void;
  to: (room: string) => any;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  broadcast: {
    emit: (event: string, data: any) => void;
  };
  handshake: {
    auth: {
      token?: string;
    };
  };
}

export class SocketService {
  private readonly io: SocketIOServer;
  private readonly connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private readonly messageTimestamps: Map<string, number> = new Map(); // messageId -> timestamp
  private readonly typingUsers: Map<string, number> = new Map(); // userId -> last typing timestamp
  private readonly userConnectionCount: Map<string, number> = new Map(); // userId -> connection count
  private readonly userOnlineOfflineTimestamps: Map<string, number> = new Map(); // userId -> last online/offline timestamp
  private readonly conversationJoinLeaveTimestamps: Map<string, number> = new Map(); // userId_conversationId -> timestamp
  private readonly chatService: ChatService;
  private readonly userRepository: UserRepository;
  private readonly projectTeamRepository: ProjectTeamRepository;

  constructor(server: HTTPServer, chatService: ChatService) {
    this.chatService = chatService;
    this.userRepository = new UserRepository();
    this.projectTeamRepository = new ProjectTeamRepository();
    this.io = new SocketIOServer(server, {
      cors: {
        origin: config.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupCleanupTimer();
  }

  // Public getter for Socket.IO instance
  public getSocketIO(): SocketIOServer {
    return this.io;
  }

  private setupMiddleware(): void {
    // Authentication middleware
    this.io.use((socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, config.JWT_SECRET!) as any;
        socket.userId = decoded.id || decoded.userId;
        socket.userRole = decoded.role;


        next();
      } catch (error) {
        logger.error('Lỗi xác thực socket:', error);
        next(new Error('Lỗi xác thực: Token không hợp lệ'));
      }
    });
  }

  private setupCleanupTimer(): void {
    // Clean up old timestamps periodically
    setInterval(() => {
      this.cleanupOldTimestamps();
    }, SOCKET_CONFIG.CLEANUP_INTERVAL_MS);
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      logger.info(`User ${socket.userId} đã kết nối với socket ${socket.id}`);

      // Store user connection with limit check
      if (socket.userId) {
        // Check connection limit
        if (!this.checkConnectionLimit(socket.userId)) {
          socket.emit(SOCKET_CONFIG.EVENTS.CONNECTION_ERROR, {
            error: SOCKET_CONFIG.ERRORS.CONNECTION_LIMIT_EXCEEDED,
            message: `Một user chỉ có thể có tối đa ${SOCKET_CONFIG.MAX_CONNECTIONS_PER_USER} kết nối cùng lúc`
          });
          (socket as any).disconnect();
          return;
        }

        this.connectedUsers.set(socket.userId, socket.id);

        // Join user to their personal room for receiving events
        const personalRoom = `user_${socket.userId}`;
        socket.join(personalRoom);
        logger.info(`User ${socket.userId} đã tham gia phòng cá nhân: ${personalRoom}`);

        // Notify user is online (with throttling)
        if (!this.isUserOnlineOfflineThrottled(socket.userId)) {
          // Send to all users including the user themselves
          this.io.emit('user_online', {
            userId: socket.userId,
            timestamp: new Date().toISOString()
          });
        }

        // Emit confirmation that user is ready to receive events
        socket.emit('user_ready', {
          userId: socket.userId,
          timestamp: new Date().toISOString()
        });
      }

      // Join user's personal room
      socket.on('join_user_room', (userId: string) => {
        socket.join(`user_${userId}`);
        logger.info(`User ${socket.userId} đã tham gia phòng cá nhân: user_${userId}`);
      });

      // Join conversation room
      socket.on('join_conversation', async (conversationId: string) => {
        if (!conversationId) {
          return;
        }

        const userId = socket.userId;
        if (!userId) {
          return;
        }

        // Throttle join/leave events to prevent spam
        if (this.isConversationJoinLeaveThrottled(userId, conversationId)) {
          // Don't return, still allow join but with warning
        }

        // Verify user is participant in conversation
        try {
          const conversation = await this.chatService.getConversation(conversationId);
          if (!conversation) {
            socket.emit('join_conversation_error', {
              conversationId,
              error: 'Conversation not found'
            });
            return;
          }
          
          // For project conversations, allow joining if user is part of the project team
          if (conversation.projectId) {
            // Check if user is a team member of the project
            const isTeamMember = await this.checkUserIsProjectTeamMember(userId, conversation.projectId);
            if (!conversation.participants.includes(userId) && !isTeamMember) {
              socket.emit('join_conversation_error', {
                conversationId,
                error: 'User is not a participant in this conversation'
              });
              return;
            }
          } else {
            // For non-project conversations, strict participant check
            if (!conversation.participants.includes(userId)) {
              socket.emit('join_conversation_error', {
                conversationId,
                error: 'User is not a participant in this conversation'
              });
              return;
            }
          }
        } catch (error) {
          logger.error('Error verifying conversation access:', error);
          return;
        }

        const roomName = `conversation_${conversationId}`;
        socket.join(roomName);
        logger.info(`User ${userId} đã tham gia cuộc trò chuyện ${conversationId}`);

        // Notify other participants that this user joined the conversation
        socket.to(roomName).emit('user_joined_conversation', {
          userId,
          conversationId,
          timestamp: new Date().toISOString()
        });
      });

      // Leave conversation room
      socket.on('leave_conversation', (conversationId: string) => {
        if (!conversationId) {
          return;
        }

        const userId = socket.userId;
        if (!userId) {
          return;
        }

        // Throttle join/leave events to prevent spam
        if (this.isConversationJoinLeaveThrottled(userId, conversationId)) {
          return;
        }

        socket.leave(`conversation_${conversationId}`);
        logger.info(`User ${userId} đã rời khỏi cuộc trò chuyện ${conversationId}`);
      });

      // Send message
      socket.on('send_message', async (data: SocketMessageData & {
        messageId: string;
        timestamp: string;
      }) => {
        try {
          // Check for duplicate messages
          if (this.isMessageDuplicate(data.messageId)) {
            socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE_ERROR, {
              messageId: data.messageId,
              error: SOCKET_CONFIG.ERRORS.DUPLICATE_MESSAGE
            });
            return;
          }

          // Save message to database first
          const messageInput: CreateMessageInput = {
            conversationId: data.conversationId,
            senderId: socket.userId!,
            content: data.content,
            attachments: data.attachments
          };
          const savedMessage = await this.chatService.createMessage(messageInput);

          // Get sender information
          const sender = await this.userRepository.findById(socket.userId!);
          const messageWithSender = {
            ...savedMessage,
            sender: sender ? {
              id: sender.id,
              name: sender.fullname || sender.email,
              email: sender.email,
              avatar: sender.avatar
            } : undefined
          };

          // Broadcast to conversation room with saved message data including sender info
          const roomName = `conversation_${data.conversationId}`;
          this.io.to(roomName).emit('new_message', messageWithSender);

          // Confirm message sent with real message ID
          socket.emit('message_sent', {
            messageId: data.messageId,
            realMessageId: savedMessage.id,
            timestamp: savedMessage.createdAt
          });

          logger.info(`Tin nhắn đã lưu và gửi trong cuộc trò chuyện ${data.conversationId} bởi user ${socket.userId}`);
        } catch (error) {
          logger.error('Lỗi khi gửi tin nhắn:', error);

          // Notify sender of error
          socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE_ERROR, {
            messageId: data.messageId,
            error: SOCKET_CONFIG.ERRORS.MESSAGE_SEND_FAILED
          });
        }
      });

      // Typing indicator with rate limiting
      socket.on('typing_start', (data: SocketTypingData) => {
        const userId = socket.userId;
        if (!userId) {
          return;
        }

        if (!data.conversationId) {
          return;
        }

        if (this.isTypingRateLimited(userId)) {
          return;
        }
        socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
          userId,
          conversationId: data.conversationId,
          isTyping: true,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('typing_stop', (data: SocketTypingData) => {
        const userId = socket.userId;
        if (!userId) {
          return;
        }

        if (!data.conversationId) {
          return;
        }

        // Always allow typing_stop events
        socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
          userId,
          conversationId: data.conversationId,
          isTyping: false,
          timestamp: new Date().toISOString()
        });
      });

      // Message read status
      socket.on('mark_message_read', (data: SocketMessageReadData) => {
        const userId = socket.userId;
        if (!userId) {
          return;
        }

        if (!data.messageId || !data.conversationId) {
          return;
        }

        socket.to(`conversation_${data.conversationId}`).emit('message_read', {
          messageId: data.messageId,
          readBy: userId,
          timestamp: new Date().toISOString()
        });
      });

      // Update conversation (rename)
      socket.on('update_conversation', async (data: { conversationId: string; name: string }) => {
        if (!socket.userId) {
          return;
        }

        if (!data.conversationId || !data.name) {
          return;
        }

        try {

          // Update conversation in database
          const updatedConversation = await this.chatService.updateConversation(data.conversationId, { name: data.name });

          if (updatedConversation) {
            // Broadcast to all participants in the conversation
            const roomName = `conversation_${data.conversationId}`;
            this.io.to(roomName).emit('conversation_updated', {
              conversationId: data.conversationId,
              name: data.name,
              updatedBy: socket.userId,
              updatedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          // Handle error silently or log to logger if needed
        }
      });

      // Delete conversation
      socket.on('delete_conversation', async (data: { conversationId: string }) => {
        if (!socket.userId) {
          return;
        }

        if (!data.conversationId) {
          return;
        }

        try {

          // Get conversation participants before deleting
          const conversation = await this.chatService.getConversation(data.conversationId);

          // Delete conversation from database
          await this.chatService.deleteConversation(data.conversationId);

          if (conversation) {
            // Broadcast to all participants that conversation was deleted
            const roomName = `conversation_${data.conversationId}`;

            // Emit to conversation room
            this.io.to(roomName).emit('conversation_deleted', {
              conversationId: data.conversationId,
              deletedBy: socket.userId,
              deletedAt: new Date().toISOString()
            });

            // Also emit to each participant's personal room to ensure they receive the event
            conversation.participants.forEach(participantId => {
              this.io.to(`user_${participantId}`).emit('conversation_deleted', {
                conversationId: data.conversationId,
                deletedBy: socket.userId,
                deletedAt: new Date().toISOString()
              });
            });

            // Leave the room for all participants
            this.io.socketsLeave(roomName);
          }
        } catch (error) {
          // Handle error silently or log to logger if needed
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        logger.info(`User ${socket.userId} đã ngắt kết nối`);

        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          this.removeUserConnection(socket.userId);

          // Notify user is offline only if no more connections (with throttling)
          if (!this.userConnectionCount.has(socket.userId) && !this.isUserOnlineOfflineThrottled(socket.userId)) {
            // Send to all users including the user themselves
            this.io.emit('user_offline', {
              userId: socket.userId,
              timestamp: new Date().toISOString()
            });
          }
        }
      });
    });
  }

  // Get online users
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get socket instance
  getIO(): SocketIOServer {
    return this.io;
  }

  // Helper methods for rate limiting and duplicate prevention
  private isMessageDuplicate(messageId: string, maxAge: number = SOCKET_CONFIG.MESSAGE_DUPLICATE_CHECK_MS): boolean {
    const now = Date.now();
    const lastTimestamp = this.messageTimestamps.get(messageId);

    if (lastTimestamp && (now - lastTimestamp) < maxAge) {
      return true;
    }

    this.messageTimestamps.set(messageId, now);
    return false;
  }

  private isTypingRateLimited(userId: string, maxInterval: number = SOCKET_CONFIG.TYPING_RATE_LIMIT_MS): boolean {
    const now = Date.now();
    const lastTimestamp = this.typingUsers.get(userId);

    if (lastTimestamp && (now - lastTimestamp) < maxInterval) {
      return true;
    }

    this.typingUsers.set(userId, now);
    return false;
  }

  private checkConnectionLimit(userId: string, maxConnections: number = SOCKET_CONFIG.MAX_CONNECTIONS_PER_USER): boolean {
    const currentCount = this.userConnectionCount.get(userId) || 0;

    if (currentCount >= maxConnections) {
      return false;
    }

    this.userConnectionCount.set(userId, currentCount + 1);
    return true;
  }

  private removeUserConnection(userId: string): void {
    const currentCount = this.userConnectionCount.get(userId) || 0;
    if (currentCount > 1) {
      this.userConnectionCount.set(userId, currentCount - 1);
    } else {
      this.userConnectionCount.delete(userId);
    }
  }

  private isUserOnlineOfflineThrottled(userId: string): boolean {
    const now = Date.now();
    const lastTimestamp = this.userOnlineOfflineTimestamps.get(userId);

    if (lastTimestamp && (now - lastTimestamp) < SOCKET_CONFIG.USER_ONLINE_OFFLINE_THROTTLE_MS) {
      return true;
    }

    this.userOnlineOfflineTimestamps.set(userId, now);
    return false;
  }

  private isConversationJoinLeaveThrottled(userId: string, conversationId: string): boolean {
    const now = Date.now();
    const key = `${userId}_${conversationId}`;
    const lastTimestamp = this.conversationJoinLeaveTimestamps.get(key);

    if (lastTimestamp && (now - lastTimestamp) < SOCKET_CONFIG.CONVERSATION_JOIN_LEAVE_THROTTLE_MS) {
      return true;
    }

    this.conversationJoinLeaveTimestamps.set(key, now);
    return false;
  }


  private cleanupOldTimestamps(): void {
    const now = Date.now();
    const maxAge = SOCKET_CONFIG.TIMESTAMP_MAX_AGE_MS;

    // Clean up old message timestamps
    for (const [messageId, timestamp] of this.messageTimestamps.entries()) {
      if (now - timestamp > maxAge) {
        this.messageTimestamps.delete(messageId);
      }
    }

    // Clean up old typing timestamps
    for (const [userId, timestamp] of this.typingUsers.entries()) {
      if (now - timestamp > maxAge) {
        this.typingUsers.delete(userId);
      }
    }

    // Clean up disconnected users from connection count
    for (const [userId, count] of this.userConnectionCount.entries()) {
      if (!this.connectedUsers.has(userId) && count > 0) {
        this.userConnectionCount.delete(userId);
      }
    }

    // Clean up old online/offline timestamps
    for (const [userId, timestamp] of this.userOnlineOfflineTimestamps.entries()) {
      if (now - timestamp > maxAge) {
        this.userOnlineOfflineTimestamps.delete(userId);
      }
    }

    // Clean up old conversation join/leave timestamps
    for (const [key, timestamp] of this.conversationJoinLeaveTimestamps.entries()) {
      if (now - timestamp > maxAge) {
        this.conversationJoinLeaveTimestamps.delete(key);
      }
    }
  }

  private async checkUserIsProjectTeamMember(userId: string, projectId: string): Promise<boolean> {
    try {
      const teamMember = await this.projectTeamRepository.findByProjectAndDeveloper(projectId, userId);
      return teamMember !== null && teamMember.isActive;
    } catch (error) {
      logger.error('Error checking project team membership:', error);
      return false;
    }
  }
}
