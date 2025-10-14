export type ChatbotSessionResponse = {
    sessionId: string;
    userId: string;
    title?: string;
    description?: string;
    isDeleted?: boolean;
    createdDate?: Date;
    updatedDate?: Date;
}