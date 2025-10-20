

export type ChatbotSession = {
    sessionId: string;
    userId: string;
    title?: string;
    description?: string;
    chatItems?: ChatItem[]
    isDeleted?: boolean;
    createdDate?: Date;
    updatedDate?: Date;
}

export type ChatItem = {
    content: string;
    isBot: boolean;
    createdDate: string;
    // Optional fields for structured bot responses
    fullAnswer?: string;
    devIds?: string[];
    developerProfiles?: any[];
}