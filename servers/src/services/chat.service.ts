import { v4 as uuidv4 } from 'uuid';
import { 
  Conversation, 
  Message,
  CreateConversationInput,
  CreateMessageInput,
  GetConversationMessagesInput,
  MarkMessagesReadInput,
  GetUnreadCountInput
} from '../types/chat.type';
import { ChatRepository } from '@/repositories/chat.repo';
import { UserRepository } from '@/repositories/user.repo';
import logger from '@/libs/logger';

export class ChatService {
  private readonly chatRepository: ChatRepository;
  private readonly userRepository: UserRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.userRepository = new UserRepository();
  }

  // Create new conversation
  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    const conversation: Conversation = {
      id: uuidv4(),
      name: input.name,
      participants: input.participants,
      projectId: input.projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageDate: undefined,
      isArchived: false
    };

    try {
      const result = await this.chatRepository.createConversation(conversation);
      logger.info(`Đã tạo cuộc trò chuyện ${conversation.id}`);
      return result;
    } catch (error) {
      logger.error('Lỗi khi lưu cuộc trò chuyện:', error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      return await this.chatRepository.getConversation(conversationId);
    } catch (error) {
      logger.error('Error getting conversation:', error);
      return null;
    }
  }

  // Find conversation by participants
  async findConversationByParticipants(
    participants: string[],
    projectId?: string
  ): Promise<Conversation | null> {
    try {
      return await this.chatRepository.findConversationByParticipants(participants, projectId);
    } catch (error) {
      logger.error('Error finding conversation by participants:', error);
      return null;
    }
  }

  // Get user conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      return await this.chatRepository.getUserConversations(userId);
    } catch (error) {
      logger.error('Error getting user conversations:', error);
      return [];
    }
  }

  // Create message
  async createMessage(input: CreateMessageInput): Promise<Message> {
    const message: Message = {
      id: uuidv4(),
      conversationId: input.conversationId,
      senderId: input.senderId,
      content: input.content,
      attachments: input.attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRead: false,
      readDate: undefined,
      editedDate: undefined,
      isDeleted: false
    };

    const result = await this.chatRepository.createMessage(message);
    
    // Update conversation lastMessageDate
    await this.updateConversationLastMessage(input.conversationId, new Date().toISOString());
    
    logger.info(`Created message ${message.id} in conversation ${input.conversationId}`);
    
    return result;
  }

  // Get conversation messages
  async getConversationMessages(input: GetConversationMessagesInput): Promise<Message[]> {
    try {
      const { conversationId, page = 1, limit = 50 } = input;
      const messages = await this.chatRepository.getConversationMessages(conversationId, page, limit);
      
      // Populate sender information for each message
      const messagesWithSenders = await Promise.all(
        messages.map(async (message) => {
          try {
            const sender = await this.userRepository.findById(message.senderId);
            return {
              ...message,
              sender: sender ? {
                id: sender.id,
                name: sender.fullname || sender.email,
                email: sender.email,
                avatar: sender.avatar
              } : undefined
            };
          } catch (error) {
            logger.error(`Error populating sender info for message ${message.id}:`, error);
            return message;
          }
        })
      );
      
      return messagesWithSenders;
    } catch (error) {
      logger.error('Lỗi khi lấy tin nhắn cuộc trò chuyện:', error);
      return [];
    }
  }

  // Mark messages as read
  async markMessagesAsRead(input: MarkMessagesReadInput): Promise<void> {
    try {
      const { messageIds, userId } = input;
      await this.chatRepository.markMessagesAsRead(messageIds, userId);
      logger.info(`Đã đánh dấu ${messageIds.length} tin nhắn là đã đọc bởi user ${userId}`);
    } catch (error) {
      logger.error('Lỗi khi đánh dấu tin nhắn là đã đọc:', error);
      throw error;
    }
  }

  // Update conversation last message date
  private async updateConversationLastMessage(
    conversationId: string,
    lastMessageDate: string
  ): Promise<void> {
    try {
      await this.chatRepository.updateConversation(conversationId, {
        lastMessageDate: lastMessageDate,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Lỗi khi cập nhật ngày tin nhắn cuối cuộc trò chuyện:', error);
    }
  }

  // Get unread message count for user
  async getUnreadMessageCount(input: GetUnreadCountInput): Promise<number> {
    try {
      const { userId } = input;
      return await this.chatRepository.getUnreadMessageCount(userId);
    } catch (error) {
      logger.error('Lỗi khi lấy số lượng tin nhắn chưa đọc:', error);
      return 0;
    }
  }

  // Update conversation
  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<Conversation | null> {
    try {
      logger.info(`Đang cập nhật cuộc trò chuyện ${conversationId}:`, updates);
      return await this.chatRepository.updateConversation(conversationId, updates);
    } catch (error) {
      logger.error('Lỗi khi cập nhật cuộc trò chuyện:', error);
      throw error;
    }
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      logger.info(`Đang xóa cuộc trò chuyện ${conversationId}`);
      
      // First delete all messages in the conversation
      await this.chatRepository.deleteConversationMessages(conversationId);
      
      // Then delete the conversation
      await this.chatRepository.deleteConversation(conversationId);
      
      logger.info(`Đã xóa cuộc trò chuyện ${conversationId} thành công`);
    } catch (error) {
      logger.error('Lỗi khi xóa cuộc trò chuyện:', error);
      throw error;
    }
  }
}

// Export service instance
export const chatService = new ChatService();
