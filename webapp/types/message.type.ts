import type { BaseTimestamps } from "./shared.type";

export type Conversation = BaseTimestamps & {
  id: string;
  projectId?: string;
  participants: string[]; // user ids
  lastMessageDate?: Date;
  isArchived: boolean;
  isDeleted: boolean;
};

export type Message = BaseTimestamps & {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  readDate?: Date;
  editedDate?: Date;
  isDeleted: boolean;
};
