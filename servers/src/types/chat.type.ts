// Chat types including message types and input types

export interface BaseTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface Conversation extends BaseTimestamps {
  id: string;
  name?: string;
  projectId?: string;
  participants: string[];
  lastMessageDate?: string;
  isArchived: boolean;
}

export interface Message extends BaseTimestamps {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  readDate?: string;
  editedDate?: string;
  isDeleted: boolean;
}

// Input types for ChatService methods
export interface CreateConversationInput {
  name?: string;
  participants: string[];
  projectId?: string;
}

export interface CreateMessageInput {
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
}

export interface GetConversationMessagesInput {
  conversationId: string;
  page?: number;
  limit?: number;
}

export interface MarkMessagesReadInput {
  messageIds: string[];
  userId: string;
}

export interface UpdateConversationInput {
  conversationId: string;
  updates: {
    lastMessageDate?: string;
    participants?: string[];
    projectId?: string;
    isArchived?: boolean;
  };
}

export interface DeleteMessageInput {
  messageId: string;
}

export interface GetUnreadCountInput {
  userId: string;
}

// Socket event types
export interface SocketMessageData {
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
}

export interface SocketJoinConversationData {
  conversationId: string;
}

export interface SocketTypingData {
  conversationId: string;
}

export interface SocketMessageReadData {
  messageId: string;
  conversationId: string;
}