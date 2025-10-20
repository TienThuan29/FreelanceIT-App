import { ChatbotSession } from "@/models/chatbot.model";
import { N8NChatbotRequest, N8NChatbotService } from "@/thirdparties/n8n.service";
import { ChatbotSendMessageRequest } from "@/types/req/chatbot.req";
import { ChatbotSessionRepository } from "@/repositories/chatbot.repo";
import { CustomerProfileRepository } from "@/repositories/customer.repo";
import { CustomerProfile } from "@/models/user.model";
import { CreateCustomerProfileRequest, UpdateCustomerProfileRequest } from "@/types/req/user.req";
import { v4 as uuidv4 } from 'uuid';
import { ChatbotSessionResponse, ChatbotMessageResponse, DeveloperProfileResponse } from "@/types/res/chatbot.res";
import { CustomerProfileResponse, UserProfileResponse } from "@/types/res/user.res";
import { UserRepository } from "@/repositories/user.repo";
import { DeveloperRepository } from "@/repositories/developer.repo";
import { mapUserToUserProfileResponse } from "@/libs/mappers/user.mapper";

export class CustomerService {

    private readonly n8nChatbotService: N8NChatbotService;
    private readonly chatbotSessionRepository: ChatbotSessionRepository;
    private readonly customerProfileRepository: CustomerProfileRepository;
    private readonly userRepository: UserRepository;
    private readonly developerRepository: DeveloperRepository;

    constructor() {
        this.n8nChatbotService = new N8NChatbotService();
        this.chatbotSessionRepository = new ChatbotSessionRepository();
        this.customerProfileRepository = new CustomerProfileRepository();
        this.userRepository = new UserRepository();
        this.developerRepository = new DeveloperRepository();
    }

    // CustomerProfile CRUD operations
    public async createCustomerProfile(request: CreateCustomerProfileRequest): Promise<CustomerProfileResponse | null> {
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

        const createdProfile = await this.customerProfileRepository.create(customerProfile);
        if (!createdProfile) {
            return null;
        }
        
        const user = await this.userRepository.findById(request.userId);
        if (!user) {
            return null;
        }
        
        const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(user);
        
        return {
            userProfile: userProfile,
            customerProfile: createdProfile,
        } as CustomerProfileResponse;
    }

    public async getCustomerProfileByUserId(userId: string): Promise<CustomerProfileResponse | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }
        const customerProfile = await this.customerProfileRepository.findByUserId(userId);
        const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(user);
        
        // Return user profile even if customer profile doesn't exist yet
        return {
            userProfile: userProfile,
            customerProfile: customerProfile || null,
        } as CustomerProfileResponse;
    }

    public async updateCustomerProfile(userId: string, request: UpdateCustomerProfileRequest): Promise<CustomerProfileResponse | null> {
        const updatedCustomerProfile = await this.customerProfileRepository.update(userId, request);
        if (!updatedCustomerProfile) {
            return null;
        }
        
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }
        
        const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(user);
        
        return {
            userProfile: userProfile,
            customerProfile: updatedCustomerProfile,
        } as CustomerProfileResponse;
    }

    public async deleteCustomerProfile(userId: string): Promise<boolean> {
        return await this.customerProfileRepository.delete(userId);
    }

    public async getAllCustomerProfiles(): Promise<CustomerProfile[]> {
        return await this.customerProfileRepository.findAll();
    }

    // Helper method to parse chatbot response and fetch developer profiles
    private async parseChatbotResponseAndFetchProfiles(output: string): Promise<ChatbotMessageResponse> {
        try {
            console.log('Raw N8N output:', output);
            
            // Clean the output - remove markdown code blocks if present
            let cleanOutput = output.trim();
            if (cleanOutput.startsWith('```json') && cleanOutput.endsWith('```')) {
                cleanOutput = cleanOutput.slice(7, -3).trim(); // Remove ```json and ```
                console.log('Cleaned output (removed markdown):', cleanOutput);
            }
            
            // Parse the JSON response from N8N
            const parsedResponse = JSON.parse(cleanOutput);
            console.log('Parsed response:', parsedResponse);
            
            if (!parsedResponse.full_answer || !parsedResponse.dev_ids) {
                console.error('Invalid chatbot response format. Missing full_answer or dev_ids');
                console.error('Available keys:', Object.keys(parsedResponse));
                throw new Error('Invalid chatbot response format');
            }

            const devIds: string[] = parsedResponse.dev_ids;
            const fullAnswer: string = parsedResponse.full_answer;

            console.log('Extracted fullAnswer:', fullAnswer);
            console.log('Extracted devIds:', devIds);

            // Fetch developer profiles
            const developerProfiles: DeveloperProfileResponse[] = [];
            if (devIds.length > 0) {
                console.log('Fetching developer profiles for IDs:', devIds);
                const profiles = await this.developerRepository.findByIds(devIds);
                console.log('Found profiles:', profiles.length);
                
                // Map developer profiles to response format
                for (const profile of profiles) {
                    const user = await this.userRepository.findById(profile.userId);
                    if (user) {
                        developerProfiles.push({
                            userId: profile.userId,
                            title: profile.title,
                            bio: profile.bio,
                            hourlyRate: profile.hourlyRate,
                            experienceYears: profile.experienceYears,
                            developerLevel: profile.developerLevel?.toString(),
                            githubUrl: profile.githubUrl,
                            linkedinUrl: profile.linkedinUrl,
                            isAvailable: profile.isAvailable,
                            rating: profile.rating,
                            skills: profile.skills?.map(skill => ({
                                id: skill.id,
                                name: skill.name,
                                proficiency: skill.proficiency.toString(),
                                yearsOfExperience: skill.yearsOfExperience
                            })),
                            totalProjects: profile.totalProjects,
                            languages: profile.languages,
                            timezone: profile.timezone,
                            cvUrl: profile.cvUrl,
                            createdDate: profile.createdDate ? profile.createdDate.toISOString() : undefined,
                            updatedDate: profile.updatedDate ? profile.updatedDate.toISOString() : undefined
                        });
                    }
                }
            }

            const result = {
                fullAnswer,
                devIds,
                developerProfiles
            };
            
            console.log('Final parsed result:', result);
            return result;
            
        } catch (error) {
            console.error('Error parsing chatbot response:', error);
            console.error('Raw output that failed to parse:', output);
            
            // Try to extract just the text from the JSON if possible
            try {
                // Clean the output - remove markdown code blocks if present
                let cleanOutput = output.trim();
                if (cleanOutput.startsWith('```json') && cleanOutput.endsWith('```')) {
                    cleanOutput = cleanOutput.slice(7, -3).trim(); // Remove ```json and ```
                }
                
                const parsed = JSON.parse(cleanOutput);
                if (parsed.full_answer) {
                    console.log('Extracted text from JSON fallback:', parsed.full_answer);
                    return {
                        fullAnswer: parsed.full_answer,
                        devIds: parsed.dev_ids || [],
                        developerProfiles: []
                    };
                }
            } catch (parseError) {
                console.error('Failed to parse even in fallback:', parseError);
            }
            
            // Last resort - return the raw output
            return {
                fullAnswer: output,
                devIds: [],
                developerProfiles: []
            };
        }
    }

    // Existing chatbot methods
    public async getChatbotSessionsByUserId(userId: string) : Promise<ChatbotSessionResponse[]> {
        const chatbotSessions = await this.chatbotSessionRepository.findAllByUserId(userId);
        return chatbotSessions;
    }

    public async getChatbotSessionById(sessionId: string): Promise<ChatbotSession | null> {
        return await this.chatbotSessionRepository.findSessionById(sessionId);
    }

    public async renameChatbotSession(sessionId: string, newTitle: string): Promise<ChatbotSession | null> {
        const session = await this.chatbotSessionRepository.findSessionById(sessionId);
        if (!session) {
            throw new Error('Chatbot session not found');
        }

        session.title = newTitle;
        await this.chatbotSessionRepository.updateSession(session);
        return session;
    }

    public async deleteChatbotSession(sessionId: string): Promise<boolean> {
        const session = await this.chatbotSessionRepository.findSessionById(sessionId);
        if (!session) {
            throw new Error('Chatbot session not found');
        }

        await this.chatbotSessionRepository.deleteSession(sessionId);
        return true;
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
            
            // Parse response and fetch developer profiles
            const parsedResponse = await this.parseChatbotResponseAndFetchProfiles(output);
            console.log('Parsed response for new session:', parsedResponse);
            
            // Create session with both user message and bot response
            const chatItem = {
                content: parsedResponse.fullAnswer,
                isBot: true,
                createdDate: new Date().toISOString(),
                fullAnswer: parsedResponse.fullAnswer,
                devIds: parsedResponse.devIds,
                developerProfiles: parsedResponse.developerProfiles
            };
            console.log('Chat item to store:', chatItem);
            
            const chatbotSession = await this.chatbotSessionRepository.createSession({
                sessionId: chatbotRequest.sessionId,
                userId: chatbotRequest.userId,
                chatItems: [
                    {
                        content: chatbotRequest.chatInput,
                        isBot: false,
                        createdDate: new Date().toISOString()
                    },
                    chatItem
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
            
            // Parse response and fetch developer profiles
            const parsedResponse = await this.parseChatbotResponseAndFetchProfiles(output);
            console.log('Parsed response for continuing session:', parsedResponse);
            
            // Add bot response with parsed data
            const chatItem = {
                content: parsedResponse.fullAnswer,
                isBot: true,
                createdDate: new Date().toISOString(),
                fullAnswer: parsedResponse.fullAnswer,
                devIds: parsedResponse.devIds,
                developerProfiles: parsedResponse.developerProfiles
            };
            console.log('Chat item to add:', chatItem);
            
            chatbotSession.chatItems?.push(chatItem);
            
            await this.chatbotSessionRepository.updateSession(chatbotSession);
            return chatbotSession;
        }
        
        throw new Error('Invalid chatbot request');
    }
}