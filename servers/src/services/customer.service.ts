import { ChatbotSession } from "@/models/chatbot.model";
import { N8NChatbotRequest, N8NChatbotService } from "@/thirdparties/n8n.service";
import { ChatbotSendMessageRequest } from "@/types/req/chatbot.req";
import { ChatbotSessionRepository } from "@/repositories/chatbot.repo";
import { CustomerProfileRepository } from "@/repositories/customer.repo";
import { CustomerProfile } from "@/models/user.model";
import { CreateCustomerProfileRequest, UpdateCustomerProfileRequest } from "@/types/req/user.req";
import { v4 as uuidv4 } from 'uuid';
import { ChatbotSessionResponse } from "@/types/res/chatbot.res";

export class CustomerService {

    private readonly n8nChatbotService: N8NChatbotService;
    private readonly chatbotSessionRepository: ChatbotSessionRepository;
    private readonly customerProfileRepository: CustomerProfileRepository;

    constructor() {
        this.n8nChatbotService = new N8NChatbotService();
        this.chatbotSessionRepository = new ChatbotSessionRepository();
        this.customerProfileRepository = new CustomerProfileRepository();
    }

    // CustomerProfile CRUD operations
    public async createCustomerProfile(request: CreateCustomerProfileRequest): Promise<CustomerProfile | null> {
        const customerProfile: CustomerProfile = {
            userId: request.userId,
            companyName: request.companyName,
            companyWebsite: request.companyWebsite,
            industry: request.industry,
            companySize: request.companySize,
            taxId: request.taxId,
            houseNumberAndStreet: request.houseNumberAndStreet,
            commune: request.commune,
            province: request.province,
            rating: 0,
            totalProjectsPosted: 0
        };

        return await this.customerProfileRepository.create(customerProfile);
    }

    public async getCustomerProfileByUserId(userId: string): Promise<CustomerProfile | null> {
        return await this.customerProfileRepository.findByUserId(userId);
    }

    public async updateCustomerProfile(userId: string, request: UpdateCustomerProfileRequest): Promise<CustomerProfile | null> {
        return await this.customerProfileRepository.update(userId, request);
    }

    public async deleteCustomerProfile(userId: string): Promise<boolean> {
        return await this.customerProfileRepository.delete(userId);
    }

    public async getAllCustomerProfiles(): Promise<CustomerProfile[]> {
        return await this.customerProfileRepository.findAll();
    }

    // Existing chatbot methods
    public async getChatbotSessionsByUserId(userId: string) : Promise<ChatbotSessionResponse[]> {
        const chatbotSessions = await this.chatbotSessionRepository.findAllByUserId(userId);
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