import { DynamoRepository } from './dynamo.repo';
import { Conversation, Message } from '../types/chat.type';
import logger from '@/libs/logger';

export class ChatRepository {
  private readonly conversationRepo: DynamoRepository;
  private readonly messageRepo: DynamoRepository;

  constructor() {
    this.conversationRepo = new DynamoRepository('conversations');
    this.messageRepo = new DynamoRepository('messages');
  }

  // ===== CONVERSATION METHODS =====

  async createConversation(conversation: Conversation): Promise<Conversation> {
    try {
      await this.conversationRepo.putItem(conversation);
      logger.info(`ChatRepository: Đã tạo cuộc trò chuyện với ID: ${conversation.id}`);
      return conversation;
    } catch (error) {
      logger.error('ChatRepository: Lỗi khi tạo cuộc trò chuyện:', error);
      throw error;
    }
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const result = await this.conversationRepo.getItem({ id: conversationId });
      return result as Conversation || null;
    } catch (error) {
      logger.error('ChatRepository: Lỗi khi lấy cuộc trò chuyện:', error);
      return null;
    }
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const results = await this.conversationRepo.scanItemsWithFilter(
        'contains(participants, :userId)',
        { ':userId': userId }
      );
      
      // Sort by lastMessageDate descending
      return (results as Conversation[]).sort((a, b) => {
        if (!a.lastMessageDate && !b.lastMessageDate) return 0;
        if (!a.lastMessageDate) return 1;
        if (!b.lastMessageDate) return -1;
        return new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime();
      });
    } catch (error) {
      logger.error('ChatRepository: Error getting user conversations:', error);
      return [];
    }
  }

  async findConversationByParticipants(
    participants: string[], 
    projectId?: string
  ): Promise<Conversation | null> {
    try {
      const results = await this.conversationRepo.scanItemsWithFilter(
        'contains(participants, :participant1) AND contains(participants, :participant2)',
        {
          ':participant1': participants[0],
          ':participant2': participants[1]
        }
      );
      
      // Filter by projectId if provided
      const filteredResults = projectId 
        ? results.filter((conv: any) => conv.projectId === projectId)
        : results;
      
      return filteredResults.length > 0 ? filteredResults[0] as Conversation : null;
    } catch (error) {
      logger.error('ChatRepository: Error finding conversation by participants:', error);
      return null;
    }
  }

  async findConversationByProjectId(projectId: string): Promise<Conversation | null> {
    try {
      const results = await this.conversationRepo.scanItemsWithFilter(
        'projectId = :projectId',
        {
          ':projectId': projectId
        }
      );
      
      return results.length > 0 ? results[0] as Conversation : null;
    } catch (error) {
      logger.error('ChatRepository: Error finding conversation by project ID:', error);
      return null;
    }
  }

  async updateConversation(
    conversationId: string, 
    updates: Partial<Conversation>
  ): Promise<Conversation | null> {
    try {
      const result = await this.conversationRepo.updateItem(
        { id: conversationId },
        updates
      );
      return result as unknown as Conversation;
    } catch (error) {
      logger.error('ChatRepository: Error updating conversation:', error);
      return null;
    }
  }

  // ===== MESSAGE METHODS =====

  async createMessage(message: Message): Promise<Message> {
    try {
      await this.messageRepo.putItem(message);
      logger.info(`ChatRepository: Đã tạo tin nhắn với ID: ${message.id}`);
      return message;
    } catch (error) {
      logger.error('ChatRepository: Lỗi khi tạo tin nhắn:', error);
      throw error;
    }
  }

  async getConversationMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Message[]> {
    try {
      const results = await this.messageRepo.scanItemsWithFilter(
        'conversationId = :conversationId AND isDeleted = :isDeleted',
        {
          ':conversationId': conversationId,
          ':isDeleted': false
        }
      );
      
      // Sort by createdAt ascending (oldest first)
      const messages = (results as Message[]).sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return messages.slice(startIndex, endIndex);
    } catch (error) {
      logger.error('ChatRepository: Error getting conversation messages:', error);
      return [];
    }
  }

  async getMessage(messageId: string): Promise<Message | null> {
    try {
      const result = await this.messageRepo.getItem({ id: messageId });
      return result as Message || null;
    } catch (error) {
      logger.error('ChatRepository: Error getting message:', error);
      return null;
    }
  }

  async updateMessage(
    messageId: string, 
    updates: Partial<Message>
  ): Promise<Message | null> {
    try {
      const result = await this.messageRepo.updateItem(
        { id: messageId },
        updates
      );
      return result as unknown as Message;
    } catch (error) {
      logger.error('ChatRepository: Error updating message:', error);
      return null;
    }
  }

  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    try {
      for (const messageId of messageIds) {
        await this.updateMessage(messageId, {
          isRead: true,
          readDate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
             logger.info(`ChatRepository: Đã đánh dấu ${messageIds.length} tin nhắn là đã đọc cho user ${userId}`);
    } catch (error) {
      logger.error('ChatRepository: Lỗi khi đánh dấu tin nhắn là đã đọc:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      await this.updateMessage(messageId, { isDeleted: true });
      logger.info(`ChatRepository: Message ${messageId} marked as deleted`);
      return true;
    } catch (error) {
      logger.error('ChatRepository: Error deleting message:', error);
      return false;
    }
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      let totalUnread = 0;
      
      // Get user conversations
      const conversations = await this.getUserConversations(userId);
      
      for (const conversation of conversations) {
        const results = await this.messageRepo.scanItemsWithFilter(
          'conversationId = :conversationId AND isDeleted = :isDeleted AND isRead = :isRead AND senderId <> :userId',
          {
            ':conversationId': conversation.id,
            ':isDeleted': false,
            ':isRead': false,
            ':userId': userId
          }
        );
        totalUnread += results.length;
      }
      
      return totalUnread;
    } catch (error) {
      logger.error('ChatRepository: Error getting unread message count:', error);
      return 0;
    }
  }

  // Delete conversation messages
  async deleteConversationMessages(conversationId: string): Promise<void> {
    try {
      // Get all messages in the conversation
      const messages = await this.getConversationMessages(conversationId, 1, 1000);
      
      // Delete each message
      for (const message of messages) {
        await this.messageRepo.deleteItem({ id: message.id });
      }
      
      logger.info(`Đã xóa ${messages.length} tin nhắn trong cuộc trò chuyện ${conversationId}`);
    } catch (error) {
      logger.error('Lỗi khi xóa tin nhắn trong cuộc trò chuyện:', error);
      throw error;
    }
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await this.conversationRepo.deleteItem({ id: conversationId });
      logger.info(`Đã xóa cuộc trò chuyện ${conversationId}`);
    } catch (error) {
      logger.error('Lỗi khi xóa cuộc trò chuyện:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  getConversationTableName(): string {
    return this.conversationRepo.getTableName();
  }

  getMessageTableName(): string {
    return this.messageRepo.getTableName();
  }
}
