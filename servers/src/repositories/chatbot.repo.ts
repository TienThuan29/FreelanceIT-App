import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { ChatbotSession } from "@/models/chatbot.model";
import { ChatbotSessionResponse } from "@/types/res/chatbot.res";

export class ChatbotSessionRepository extends DynamoRepository {

    constructor() {
        super(config.CHATBOT_SESSION_TABLE);
    }

    public async findAllByUserId(userId: string): Promise<ChatbotSessionResponse[]> {
        console.log('Repository: Finding sessions for userId:', userId);
        const allSessions = await this.scanItems();
        console.log('Repository: All sessions from scan:', allSessions);
        const sessions = allSessions.filter(session => 
            session.userId === userId && session.isDeleted !== true
        );
        console.log('Repository: Filtered sessions:', sessions);
        const result = sessions.map(session => ({
            sessionId: session.sessionId,
            userId: session.userId,
            title: session.title,
            description: session.description,
            isDeleted: session.isDeleted,
            createdDate: session.createdDate,
            updatedDate: session.updatedDate
        })) as ChatbotSessionResponse[];
        console.log('Repository: Final result:', result);
        return result;
    }

    public async createSession(session: ChatbotSession): Promise<ChatbotSession | null> {
        const createdDate = this.convertDateToISOString(new Date());
        const updatedDate = this.convertDateToISOString(new Date());
        await this.putItem({
            ...session,
            isDeleted: false,
            createdDate,
            updatedDate
        });
        return await this.findSessionById(session.sessionId);
    }

    public async updateSession(session: ChatbotSession): Promise<void> {
        await this.putItem(session);
    }

    public async deleteSession(sessionId: string): Promise<void> {
        await this.updateItem({ sessionId }, { isDeleted: true });
    }

    public async findSessionById(sessionId: string): Promise<ChatbotSession | null> {
        const session = await this.getItem({ sessionId });
        if (!session) {
            return null;
        }
        return session as ChatbotSession;
    }
}