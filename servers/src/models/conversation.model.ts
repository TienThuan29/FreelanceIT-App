export type Conversation = {
    id: string;
    projectId?: string;
    participants: string[]; // user ids
    lastMessageDate?: Date;
    isArchived: boolean;
    isDeleted: boolean;
    createdDate?: Date;
    updatedDate?: Date;
  };
  
  export type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    attachments?: string[];
    isRead: boolean;
    readDate?: Date;
    editedDate?: Date;
    isDeleted: boolean;
    createdDate?: Date;
    updatedDate?: Date;
  };