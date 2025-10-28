import { ResponseUtil } from "@/libs/response";
import { CustomerService } from "@/services/customer.service";
import { ChatbotSendMessageRequest } from "@/types/req/chatbot.req";
import { CreateCustomerProfileRequest, UpdateCustomerProfileRequest } from "@/types/req/user.req";
import { Request, Response } from "express";

export class CustomerApi {

    private readonly customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
        this.sendMessage = this.sendMessage.bind(this);
        this.getChatbotSessionsByUserId = this.getChatbotSessionsByUserId.bind(this);
        this.getChatbotSessionById = this.getChatbotSessionById.bind(this);
        this.renameChatbotSession = this.renameChatbotSession.bind(this);
        this.deleteChatbotSession = this.deleteChatbotSession.bind(this);
        this.createCustomerProfile = this.createCustomerProfile.bind(this);
        this.getCustomerProfile = this.getCustomerProfile.bind(this);
        this.updateCustomerProfile = this.updateCustomerProfile.bind(this);
        this.deleteCustomerProfile = this.deleteCustomerProfile.bind(this);
        this.getAllCustomerProfiles = this.getAllCustomerProfiles.bind(this);
    }

    // CustomerProfile CRUD endpoints
    public async createCustomerProfile(request: Request, response: Response): Promise<void> {
        try {
            const customerProfileRequest: CreateCustomerProfileRequest = request.body;
            const customerProfileResponse = await this.customerService.createCustomerProfile(customerProfileRequest);
            if (!customerProfileResponse) {
                ResponseUtil.error(response, 'Failed to create customer profile', 400);
                return;
            }
            ResponseUtil.success(response, customerProfileResponse, 'Customer profile created successfully', 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    public async getCustomerProfile(request: Request, response: Response): Promise<void> {
        try {
            const { userId } = request.params;
            const customerProfileResponse = await this.customerService.getCustomerProfileByUserId(userId);
            if (!customerProfileResponse) {
                ResponseUtil.error(response, 'Customer profile not found', 404);
                return;
            }
            ResponseUtil.success(response, customerProfileResponse, 'Customer profile retrieved successfully', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    public async updateCustomerProfile(request: Request, response: Response): Promise<void> {
        try {
            const { userId } = request.params;
            const updateRequest: UpdateCustomerProfileRequest = request.body;
            const customerProfileResponse = await this.customerService.updateCustomerProfile(userId, updateRequest);
            if (!customerProfileResponse) {
                ResponseUtil.error(response, 'Customer profile not found or update failed', 404);
                return;
            }
            ResponseUtil.success(response, customerProfileResponse, 'Customer profile updated successfully', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    public async deleteCustomerProfile(request: Request, response: Response): Promise<void> {
        try {
            const { userId } = request.params;
            const deleted = await this.customerService.deleteCustomerProfile(userId);
            if (!deleted) {
                ResponseUtil.error(response, 'Customer profile not found or delete failed', 404);
                return;
            }
            ResponseUtil.success(response, null, 'Customer profile deleted successfully', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    public async getAllCustomerProfiles(request: Request, response: Response): Promise<void> {
        try {
            const customersWithProfiles = await this.customerService.getAllCustomerProfiles();
            ResponseUtil.success(response, customersWithProfiles, 'Customers retrieved successfully', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Error in getAllCustomerProfiles API:', error);
            ResponseUtil.error(response, message, 500);
        }
    }

    // Existing chatbot endpoints
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
            const chatbotSessions = await this.customerService.getChatbotSessionsByUserId(userId);
            ResponseUtil.success(response, chatbotSessions, 'Chatbot sessions', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
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

    public async renameChatbotSession(request: Request, response: Response): Promise<void> {
        try {
            const { sessionId } = request.params;
            const { title } = request.body;
            
            if (!title || title.trim() === '') {
                ResponseUtil.error(response, 'Title is required', 400);
                return;
            }

            const chatbotSession = await this.customerService.renameChatbotSession(sessionId, title.trim());
            ResponseUtil.success(response, chatbotSession, 'Chatbot session renamed successfully', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    public async deleteChatbotSession(request: Request, response: Response): Promise<void> {
        try {
            const { sessionId } = request.params;
            await this.customerService.deleteChatbotSession(sessionId);
            ResponseUtil.success(response, null, 'Chatbot session deleted successfully', 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }
}