import axios, { AxiosResponse } from 'axios';
import { config } from '../configs/config';
import logger from '../libs/logger';

export interface N8NChatbotRequest {
    sessionId: string;
    action: 'sendMessage';
    chatInput: string;
}

export interface N8NChatbotResponse {
    output: string;
}

export interface N8NErrorResponse {
    error: string;
    message?: string;
    statusCode?: number;
}

export class N8NChatbotService {
    private readonly webhookUrl: string;

    constructor() {
        this.webhookUrl = config.N8N_WEBHOOK_URL;

        // Validate configuration
        if (!this.webhookUrl) {
            logger.warn('N8N_WEBHOOK_URL not configured. Chatbot service will not work properly.');
        }
    }

    /**
     * Send a message to the N8N chatbot workflow
     */
    public async sendMessage(request: N8NChatbotRequest): Promise<N8NChatbotResponse> {
        try {
            if (!this.webhookUrl) {
                throw new Error('N8N webhook URL is not configured');
            }

            // Validate request
            if (!request.sessionId || !request.chatInput) {
                throw new Error('sessionId and chatInput are required');
            }

            if (request.action !== 'sendMessage') {
                throw new Error('Only sendMessage action is supported');
            }

            logger.info(`Sending message to N8N chatbot for session: ${request.sessionId}`);

            // Make HTTP request to N8N webhook using axios
            const response: AxiosResponse<N8NChatbotResponse | N8NErrorResponse> = await axios.post(
                this.webhookUrl,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 60000, 
                }
            );

            const responseData = response.data;
            
            // Validate response format
            if (!responseData || typeof (responseData as N8NChatbotResponse).output !== 'string') {
                logger.error('Invalid response format from N8N webhook:', responseData);
                throw new Error('Invalid response format from N8N webhook');
            }

            logger.info(`Successfully received response from N8N chatbot for session: ${request.sessionId}`);
            
            return {
                output: (responseData as N8NChatbotResponse).output
            };

        } catch (error: unknown) {
            logger.error('Error sending message to N8N chatbot:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with error status
                    logger.error(`N8N webhook request failed: ${error.response.status} - ${error.response.data}`);
                    throw new Error(`N8N webhook request failed: ${error.response.status}`);
                } else if (error.request) {
                    // Request was made but no response received
                    logger.error('No response received from N8N webhook');
                    throw new Error('No response received from N8N webhook');
                } else {
                    // Something else happened
                    logger.error('Error setting up N8N webhook request:', error.message);
                    throw new Error(`Error setting up N8N webhook request: ${error.message}`);
                }
            }
            
            if (error instanceof Error) {
                throw error;
            }
            
            throw new Error('Failed to send message to N8N chatbot');
        }
    }

    /**
     * Test the connection to N8N webhook
     */
    public async testConnection(): Promise<boolean> {
        try {
            if (!this.webhookUrl) {
                logger.error('N8N webhook URL is not configured');
                return false;
            }

            const testRequest: N8NChatbotRequest = {
                sessionId: 'test-session',
                action: 'sendMessage',
                chatInput: 'test connection'
            };

            const response = await axios.post(
                this.webhookUrl,
                testRequest,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000, // 10 seconds timeout for test
                }
            );

            const isConnected = response.status >= 200 && response.status < 300;
            
            if (isConnected) {
                logger.info('N8N webhook connection test successful');
            } else {
                logger.error(`N8N webhook connection test failed: ${response.status}`);
            }

            return isConnected;

        } catch (error: unknown) {
            logger.error('Error testing N8N webhook connection:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    logger.error(`N8N webhook test failed: ${error.response.status} - ${error.response.data}`);
                } else if (error.request) {
                    logger.error('No response received from N8N webhook during test');
                } else {
                    logger.error('Error setting up N8N webhook test:', error.message);
                }
            }
            
            return false;
        }
    }

    /**
     * Get service configuration status
     */
    public getServiceStatus(): {
        configured: boolean;
        webhookUrl: string;
    } {
        return {
            configured: !!this.webhookUrl,
            webhookUrl: this.webhookUrl
        };
    }
}

export const n8nChatbotService = new N8NChatbotService();