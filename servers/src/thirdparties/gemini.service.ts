
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { config } from '../configs/config';
import logger from '../libs/logger';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface EmbeddingResponse {
    embedding: number[];
    usage?: {
        promptTokens: number;
        totalTokens: number;
    };
}

export class GeminiEmbeddingService {
    private genAI: GoogleGenerativeAI;
    private embeddingModel: GenerativeModel;

    constructor() {
        this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        this.embeddingModel = this.genAI.getGenerativeModel({ 
            model: config.GEMINI_EMBEDDING_MODEL 
        });
    }

    /**
     * Generate embedding for a single text
     */
    public async generateEmbedding(text: string): Promise<number[]> {
        try {
            if (!text || text.trim().length === 0) {
                throw new Error('Text cannot be empty');
            }

            const result = await this.embeddingModel.embedContent(text);
            const embedding = result.embedding.values;
            
            logger.info(`Generated embedding for text (${text.length} chars)`);
            return embedding;
        } catch (error) {
            logger.error('Failed to generate embedding:', error);
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple texts
     */
    public async generateEmbeddings(texts: string[]): Promise<number[][]> {
        try {
            if (!texts || texts.length === 0) {
                throw new Error('Texts array cannot be empty');
            }

            const embeddings: number[][] = [];
            
            // Process texts in batches to avoid rate limits
            const batchSize = 10;
            for (let i = 0; i < texts.length; i += batchSize) {
                const batch = texts.slice(i, i + batchSize);
                const batchPromises = batch.map(text => this.generateEmbedding(text));
                const batchEmbeddings = await Promise.all(batchPromises);
                embeddings.push(...batchEmbeddings);
                
                // Add small delay between batches to respect rate limits
                if (i + batchSize < texts.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            logger.info(`Generated ${embeddings.length} embeddings`);
            return embeddings;
        } catch (error) {
            logger.error('Failed to generate embeddings:', error);
            throw error;
        }
    }

    /**
     * Generate embedding with usage information
     */
    public async generateEmbeddingWithUsage(text: string): Promise<EmbeddingResponse> {
        try {
            const embedding = await this.generateEmbedding(text);
            
            return {
                embedding,
                usage: {
                    promptTokens: Math.ceil(text.length / 4), // Rough estimation
                    totalTokens: Math.ceil(text.length / 4)
                }
            };
        } catch (error) {
            logger.error('Failed to generate embedding with usage:', error);
            throw error;
        }
    }
}

export const geminiEmbeddingService = new GeminiEmbeddingService();

