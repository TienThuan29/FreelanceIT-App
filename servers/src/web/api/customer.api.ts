import { ResponseUtil } from "@/libs/response";
import { CustomerService } from "@/services/customer.service";
import { ChatbotSendMessageRequest } from "@/types/req/chatbot.req";
import { Request, Response } from "express";

export class CustomerApi {

    private readonly customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
        this.sendMessage = this.sendMessage.bind(this);
        this.getChatbotSessionsByUserId = this.getChatbotSessionsByUserId.bind(this);
        this.getChatbotSessionById = this.getChatbotSessionById.bind(this);
    }

    public async sendMessage(request: Request, response: Response): Promise<void> {
        try {
            const chatbotRequest: ChatbotSendMessageRequest = request.body;
            const chatbotResponse = await this.customerService.sendMessage(chatbotRequest);
            ResponseUtil.success(response, chatbotResponse, 'Chatbot response', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    public async getChatbotSessionsByUserId(request: Request, response: Response): Promise<void> {
        try {
            const { userId } = request.body;
            console.log('API: Getting sessions for userId:', userId);
            const chatbotSessions = await this.customerService.getChatbotSessionsByUserId(userId);
            console.log('API: Returning sessions:', chatbotSessions);
            ResponseUtil.success(response, chatbotSessions, 'Chatbot sessions', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('API: Error getting sessions:', message);
            ResponseUtil.error(response, message, 500);
        }
    }

    public async getChatbotSessionById(request: Request, response: Response): Promise<void> {
        try {
            const { sessionId } = request.params;
            const chatbotSession = await this.customerService.getChatbotSessionById(sessionId);
            if (!chatbotSession) {
                ResponseUtil.error(response, 'Chatbot session not found', 404);
                return;
            }
            ResponseUtil.success(response, chatbotSession, 'Chatbot session', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }
}