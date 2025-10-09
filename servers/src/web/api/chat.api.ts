import { Request, Response } from 'express';
import { ChatService } from '@/services/chat.service';
import logger from '@/libs/logger';
import { ResponseUtil } from '@/libs/response';
import { 
  CreateConversationInput,
  GetConversationMessagesInput,
  MarkMessagesReadInput
} from '@/types/chat.type';

export class ChatApi {
  private readonly chatService: ChatService = new ChatService();

  constructor() {
    this.getConversations = this.getConversations.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.createConversation = this.createConversation.bind(this);
    this.markMessagesRead = this.markMessagesRead.bind(this);
    this.getConversation = this.getConversation.bind(this);
    this.updateConversation = this.updateConversation.bind(this);
    this.deleteConversation = this.deleteConversation.bind(this);
  }

  // Get user conversations
  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        ResponseUtil.error(res, 'Không có quyền truy cập', 401);
        return;
      }

      const conversations = await this.chatService.getUserConversations(userId);
      ResponseUtil.success(res, conversations, 'Lấy danh sách cuộc trò chuyện thành công');
    } catch (error) {
      logger.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
      ResponseUtil.error(res, 'Lỗi máy chủ nội bộ', 500);
    }
  }

  // Get messages in a conversation
  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user?.id;
      const { page = 1, limit = 50 } = req.query;

      console.log('getMessages được gọi với:', { conversationId, userId, page, limit });

      if (!userId) {
        console.log('Không tìm thấy userId trong request');
        ResponseUtil.error(res, 'Không có quyền truy cập', 401);
        return;
      }

      // Verify user is participant in conversation
      const conversation = await this.chatService.getConversation(conversationId);
      console.log('Tìm thấy cuộc trò chuyện:', conversation);
      
      if (!conversation) {
        console.log('Không tìm thấy cuộc trò chuyện:', conversationId);
        ResponseUtil.error(res, 'Không tìm thấy cuộc trò chuyện', 404);
        return;
      }

      if (!conversation.participants.includes(userId)) {
        console.log('Người dùng không tham gia cuộc trò chuyện:', { userId, participants: conversation.participants });
        ResponseUtil.error(res, 'Truy cập bị từ chối', 403);
        return;
      }

      const input: GetConversationMessagesInput = {
        conversationId,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      const messages = await this.chatService.getConversationMessages(input);

      console.log('Đã lấy được tin nhắn:', messages.length);

      ResponseUtil.success(res, messages, 'Lấy tin nhắn thành công');
    } catch (error) {
      logger.error('Lỗi khi lấy tin nhắn:', error);
      console.error('Lỗi trong getMessages:', error);
      ResponseUtil.error(res, 'Lỗi máy chủ nội bộ', 500);
    }
  }

  // Create new conversation
  async createConversation(req: Request, res: Response): Promise<void> {
    try {
      console.log('API tạo cuộc trò chuyện được gọi');
      console.log('Request body:', req.body);
      console.log('Request headers:', req.headers);
      
      const userId = (req as any).user?.id;
      const { participantId, participantIds, projectId, name } = req.body;

      console.log('Dữ liệu đã trích xuất:', { userId, participantId, participantIds, projectId });

      if (!userId) {
        console.log('Không tìm thấy userId trong request');
        ResponseUtil.error(res, 'Không có quyền truy cập', 401);
        return;
      }

      // Support both single participantId and array of participantIds
      let participants: string[];
      if (participantIds && Array.isArray(participantIds)) {
        participants = participantIds;
      } else if (participantId) {
        participants = [userId, participantId];
      } else {
        ResponseUtil.error(res, 'Cần có ID người tham gia hoặc danh sách ID người tham gia', 400);
        return;
      }

      // Ensure current user is included in participants
      if (!participants.includes(userId)) {
        participants.push(userId);
      }

      console.log('Mảng người tham gia cuối cùng:', participants);

      // Check if conversation already exists
      console.log('Đang kiểm tra cuộc trò chuyện đã tồn tại...');
      const existingConversation = await this.chatService.findConversationByParticipants(
        participants,
        projectId
      );

      if (existingConversation) {
        console.log('Tìm thấy cuộc trò chuyện đã tồn tại:', existingConversation.id);
        ResponseUtil.success(res, existingConversation, 'Tìm thấy cuộc trò chuyện đã tồn tại');
        return;
      }

      console.log('Đang tạo cuộc trò chuyện mới...');
      const input: CreateConversationInput = {
        name,
        participants,
        projectId
      };
      const conversation = await this.chatService.createConversation(input);

      console.log('Tạo cuộc trò chuyện thành công:', conversation.id);
      
      // Emit conversation_created event to all participants
      const io = (global as any).io;
      if (io) {
        // Add a small delay to ensure all users are properly connected
        setTimeout(() => {
          participants.forEach(participantId => {
            console.log(`Đang gửi sự kiện conversation_created đến user_${participantId}`);
            io.to(`user_${participantId}`).emit('conversation_created', conversation);
          });
          console.log('Đã gửi sự kiện conversation_created đến các người tham gia:', participants);
          
          // Also emit to conversation room so all participants can join
          const roomName = `conversation_${conversation.id}`;
          console.log(`Đang gửi sự kiện conversation_created đến room: ${roomName}`);
          io.to(roomName).emit('conversation_created', conversation);
        }, 100);
      }
      
      ResponseUtil.success(res, conversation, 'Tạo cuộc trò chuyện thành công', 201);
    } catch (error) {
      logger.error('Lỗi khi tạo cuộc trò chuyện:', error);
      ResponseUtil.error(res, 'Lỗi máy chủ nội bộ', 500);
    }
  }

  // Mark messages as read
  async markMessagesRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { messageIds } = req.body;

      if (!userId) {
        ResponseUtil.error(res, 'Không có quyền truy cập', 401);
        return;
      }

      const input: MarkMessagesReadInput = {
        messageIds,
        userId
      };
      await this.chatService.markMessagesAsRead(input);

      ResponseUtil.success(res, null, 'Đã đánh dấu tin nhắn là đã đọc');
    } catch (error) {
      logger.error('Lỗi khi đánh dấu tin nhắn là đã đọc:', error);
      ResponseUtil.error(res, 'Lỗi máy chủ nội bộ', 500);
    }
  }

  // Get conversation info
  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        ResponseUtil.error(res, 'Không có quyền truy cập', 401);
        return;
      }

      const conversation = await this.chatService.getConversation(conversationId);
      
      if (!conversation?.participants.includes(userId)) {
        ResponseUtil.error(res, 'Truy cập bị từ chối', 403);
        return;
      }

      ResponseUtil.success(res, conversation, 'Lấy thông tin cuộc trò chuyện thành công');
    } catch (error) {
      logger.error('Lỗi khi lấy thông tin cuộc trò chuyện:', error);
      ResponseUtil.error(res, 'Lỗi máy chủ nội bộ', 500);
    }
  }

  // Update conversation (rename)
  async updateConversation(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      const { name } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        ResponseUtil.error(res, 'Không có quyền truy cập', 401);
        return;
      }

      if (!name || name.trim().length === 0) {
        ResponseUtil.error(res, 'Tên cuộc trò chuyện không được để trống', 400);
        return;
      }

      const conversation = await this.chatService.getConversation(conversationId);
      
      if (!conversation?.participants.includes(userId)) {
        ResponseUtil.error(res, 'Truy cập bị từ chối', 403);
        return;
      }

      const updatedConversation = await this.chatService.updateConversation(conversationId, { name: name.trim() });
      ResponseUtil.success(res, updatedConversation, 'Cập nhật cuộc trò chuyện thành công');
    } catch (error) {
      logger.error('Lỗi khi cập nhật cuộc trò chuyện:', error);
      ResponseUtil.error(res, 'Lỗi máy chủ nội bộ', 500);
    }
  }

  // Delete conversation
  async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        ResponseUtil.error(res, 'Không có quyền truy cập', 401);
        return;
      }

      const conversation = await this.chatService.getConversation(conversationId);
      
      if (!conversation?.participants.includes(userId)) {
        ResponseUtil.error(res, 'Truy cập bị từ chối', 403);
        return;
      }

      await this.chatService.deleteConversation(conversationId);
      ResponseUtil.success(res, null, 'Xóa cuộc trò chuyện thành công');
    } catch (error) {
      logger.error('Lỗi khi xóa cuộc trò chuyện:', error);
      ResponseUtil.error(res, 'Lỗi máy chủ nội bộ', 500);
    }
  }
}

// Export API instance
export const chatApi = new ChatApi();
