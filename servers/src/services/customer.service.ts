import { ChatbotSession } from "@/models/chatbot.model";
import { N8NChatbotRequest, N8NChatbotService } from "@/thirdparties/n8n.service";
import { ChatbotSendMessageRequest } from "@/types/req/chatbot.req";
import { ChatbotSessionRepository } from "@/repositories/chatbot.repo";
import { v4 as uuidv4 } from 'uuid';
import { ChatbotSessionResponse } from "@/types/res/chatbot.res";

export class CustomerService {

    private readonly n8nChatbotService: N8NChatbotService;
    private readonly chatbotSessionRepository: ChatbotSessionRepository;

    constructor() {
        this.n8nChatbotService = new N8NChatbotService();
        this.chatbotSessionRepository = new ChatbotSessionRepository();
    }

    public async getChatbotSessionsByUserId(userId: string) : Promise<ChatbotSessionResponse[]> {
        console.log('Getting chatbot sessions for userId:', userId);
        const chatbotSessions = await this.chatbotSessionRepository.findAllByUserId(userId);
        console.log('Found chatbot sessions:', chatbotSessions);
        return chatbotSessions;
    }

    public async getChatbotSessionById(sessionId: string): Promise<ChatbotSession | null> {
        return await this.chatbotSessionRepository.findSessionById(sessionId);
    }

    public async sendMessage(chatbotRequest: ChatbotSendMessageRequest): Promise<ChatbotSession> {
        // If chatSession if null -> it is new chat session
        if (!chatbotRequest.sessionId) {
            chatbotRequest.sessionId = uuidv4();
            
            // Get bot response
            const { output } = await this.n8nChatbotService.sendMessage({
                sessionId: chatbotRequest.sessionId,
                chatInput: chatbotRequest.chatInput,
                action: 'sendMessage'
            });
            
            // Create session with both user message and bot response
            const chatbotSession = await this.chatbotSessionRepository.createSession({
                sessionId: chatbotRequest.sessionId,
                userId: chatbotRequest.userId,
                chatItems: [
                    {
                        content: chatbotRequest.chatInput,
                        isBot: false,
                        createdDate: new Date().toISOString()
                    },
                    {
                        content: output,
                        isBot: true,
                        createdDate: new Date().toISOString()
                    }
                ]
            });
            if (!chatbotSession) {
                throw new Error('Failed to create chatbot session');
            }
            return chatbotSession;
        }
        // If having sessionId -> continue chat session
        else if (chatbotRequest.sessionId) {
            const chatbotSession = await this.chatbotSessionRepository.findSessionById(chatbotRequest.sessionId);
            if (!chatbotSession) {
                throw new Error('Chatbot session not found');
            }
            
            // Add user message first
            chatbotSession.chatItems?.push({
                content: chatbotRequest.chatInput,
                isBot: false,
                createdDate: new Date().toISOString()
            });
            
            // Get bot response
            const { output } = await this.n8nChatbotService.sendMessage({
                sessionId: chatbotRequest.sessionId,
                chatInput: chatbotRequest.chatInput,
                action: 'sendMessage'
            });
            
            // Add bot response
            chatbotSession.chatItems?.push({
                content: output,
                isBot: true,
                createdDate: new Date().toISOString()
            });
            
            await this.chatbotSessionRepository.updateSession(chatbotSession);
            return chatbotSession;
        }
        
        throw new Error('Invalid chatbot request');
    }
}