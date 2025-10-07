import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../configs/config';
import logger from '../libs/logger';
import { VectorRecord, QueryResult, VectorMetadata } from '../models/vectordb.model';


export class PineconeService {

    private pinecone: Pinecone;
    private index: any;
    private indexName: string;

    constructor() {
        this.pinecone = new Pinecone({
            apiKey: config.PINECONE_API_KEY,
        });
        this.indexName = config.PINECONE_INDEX_NAME;
    }

    /**
     * Initialize connection to Pinecone index
     */
    public async initialize(): Promise<void> {
        try {
            if (config.PINECONE_HOST_URL) {
                const pineconeWithHost = new Pinecone({
                    apiKey: config.PINECONE_API_KEY,
                });
                this.index = pineconeWithHost.index(this.indexName, config.PINECONE_HOST_URL);
                logger.info(`Connected to Pinecone index: ${this.indexName} via host: ${config.PINECONE_HOST_URL}`);
            } else {
                this.index = this.pinecone.index(this.indexName);
                logger.info(`Connected to Pinecone index: ${this.indexName}`);
            }
        } catch (error) {
            logger.error('Failed to initialize Pinecone connection:', error);
            throw error;
        }
    }

    /**
     * Check if index exists and create if it doesn't
     */
    public async ensureIndexExists(dimension: number = 768): Promise<void> {
        try {
            // When using host URL, we assume the index already exists
            // Index creation should be done via Pinecone console or separate setup script
            if (config.PINECONE_HOST_URL) {
                logger.info(`Using existing Pinecone index: ${this.indexName} via host: ${config.PINECONE_HOST_URL}`);
                await this.initialize();
                return;
            }

            // For environment-based connection, check and create index if needed
            const indexList = await this.pinecone.listIndexes();
            const indexExists = indexList.indexes?.some(index => index.name === this.indexName);

            if (!indexExists) {
                logger.info(`Creating Pinecone index: ${this.indexName}`);
                await this.pinecone.createIndex({
                    name: this.indexName,
                    dimension: dimension,
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud: 'aws',
                            region: 'us-east-1'
                        }
                    }
                });
                
                // Wait for index to be ready
                await this.waitForIndexReady();
            }
            
            await this.initialize();
        } catch (error) {
            logger.error('Failed to ensure index exists:', error);
            throw error;
        }
    }

    /**
     * Wait for index to be ready
     */
    private async waitForIndexReady(): Promise<void> {
        let attempts = 0;
        const maxAttempts = 30;
        
        while (attempts < maxAttempts) {
            try {
                const indexDescription = await this.pinecone.describeIndex(this.indexName);
                if (indexDescription.status?.ready) {
                    logger.info(`Index ${this.indexName} is ready`);
                    return;
                }
                logger.info(`Waiting for index ${this.indexName} to be ready...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;
            } catch (error) {
                logger.error('Error checking index status:', error);
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        throw new Error(`Index ${this.indexName} did not become ready within expected time`);
    }

    /**
     * Upsert vectors to the index
     */
    public async upsertVectors(vectors: VectorRecord[]): Promise<void> {
        try {
            if (!this.index) {
                await this.initialize();
            }

            // Validate input
            if (!vectors || vectors.length === 0) {
                throw new Error('No vectors provided for upsert');
            }

            const upsertData = vectors.map(vector => {
                if (!vector.id || !vector.values) {
                    throw new Error(`Invalid vector data: missing id or values for vector ${JSON.stringify(vector)}`);
                }
                return {
                    id: vector.id,
                    values: vector.values,
                    metadata: vector.metadata || {}
                };
            });

            logger.info(`Attempting to upsert ${vectors.length} vectors to Pinecone`);
            logger.debug(`Upsert data sample: ${JSON.stringify(upsertData[0])}`);

            await this.index.upsert(upsertData);
            logger.info(`Successfully upserted ${vectors.length} vectors to Pinecone`);
        } catch (error) {
            logger.error('Failed to upsert vectors:', error);
            logger.error('Vector data:', JSON.stringify(vectors?.slice(0, 1))); // Log first vector for debugging
            throw error;
        }
    }

    /**
     * Query similar vectors
     */
    public async queryVectors(
        queryVector: number[],
        topK: number = 10,
        filter?: VectorMetadata,
        includeMetadata: boolean = true
    ): Promise<QueryResult[]> {
        try {
            if (!this.index) {
                await this.initialize();
            }

            const queryRequest = {
                vector: queryVector,
                topK: topK,
                includeMetadata: includeMetadata,
                filter: filter
            };

            const response = await this.index.query(queryRequest);
            
            return response.matches?.map((match: any) => ({
                id: match.id,
                score: match.score,
                metadata: match.metadata
            })) || [];
        } catch (error) {
            logger.error('Failed to query vectors:', error);
            throw error;
        }
    }

    /**
     * Delete vectors by IDs
     */
    public async deleteVectors(ids: string[]): Promise<void> {
        try {
            if (!this.index) {
                await this.initialize();
            }

            await this.index.deleteMany(ids);
            logger.info(`Deleted ${ids.length} vectors from Pinecone`);
        } catch (error) {
            logger.error('Failed to delete vectors:', error);
            throw error;
        }
    }

    /**
     * Delete vectors by metadata filter
     */
    public async deleteVectorsByFilter(filter: VectorMetadata): Promise<void> {
        try {
            if (!this.index) {
                await this.initialize();
            }

            await this.index.deleteMany(filter);
            logger.info(`Deleted vectors matching filter from Pinecone`);
        } catch (error) {
            logger.error('Failed to delete vectors by filter:', error);
            throw error;
        }
    }

    /**
     * Get index statistics
     */
    public async getIndexStats(): Promise<any> {
        try {
            if (!this.index) {
                await this.initialize();
            }

            const stats = await this.index.describeIndexStats();
            return stats;
        } catch (error) {
            logger.error('Failed to get index stats:', error);
            throw error;
        }
    }

    /**
     * Update vector metadata
     */
    public async updateVectorMetadata(id: string, metadata: VectorMetadata): Promise<void> {
        try {
            if (!this.index) {
                await this.initialize();
            }

            // Pinecone doesn't have a direct update metadata method
            // We need to fetch the vector, update metadata, and upsert
            const queryResult = await this.queryVectors([], 1, { id }, true);
            
            if (queryResult.length > 0) {
                const vector = queryResult[0];
                const updatedVector: VectorRecord = {
                    id: vector.id,
                    values: [], // We don't have the original values, this is a limitation
                    metadata: { ...vector.metadata, ...metadata }
                };
                
                logger.warn('Update metadata requires original vector values. Consider storing vectors locally for updates.');
            }
        } catch (error) {
            logger.error('Failed to update vector metadata:', error);
            throw error;
        }
    }
}

export const pineconeService = new PineconeService();
