import { pineconeService } from '../services/pinecone.service';
import { VectorRecord, QueryResult, VectorMetadata } from '../models/vectordb.model';
import logger from '../libs/logger';

export interface ProjectVectorData {
    projectId: string;
    title: string;
    description: string;
    skills: string[];
    category: string;
    userId: string;
    createdAt: string;
}

export interface DeveloperVectorData {
    developerId: string;
    name: string;
    bio: string;
    skills: string[];
    experience: string;
    portfolio: string;
}

export class VectorDBRepository {
    
    /**
     * Initialize the vector database connection
     */
    public async initialize(): Promise<void> {
        try {
            await pineconeService.ensureIndexExists(768); // Gemini embedding dimension
            logger.info('Vector database initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize vector database:', error);
            throw error;
        }
    }

    /**
     * Store project vectors for semantic search
     */
    public async storeProjectVectors(projectData: ProjectVectorData[], embeddings: number[][]): Promise<void> {
        try {
            const vectors: VectorRecord[] = projectData.map((project, index) => ({
                id: `project_${project.projectId}`,
                values: embeddings[index],
                metadata: {
                    type: 'project',
                    projectId: project.projectId,
                    title: project.title,
                    description: project.description.substring(0, 1000), // Limit metadata size
                    skills: project.skills.join(','),
                    category: project.category,
                    userId: project.userId,
                    createdAt: project.createdAt
                }
            }));

            await pineconeService.upsertVectors(vectors);
            logger.info(`Stored ${vectors.length} project vectors`);
        } catch (error) {
            logger.error('Failed to store project vectors:', error);
            throw error;
        }
    }

    /**
     * Store developer profile vectors for matching
     */
    public async storeDeveloperVectors(developerData: DeveloperVectorData[], embeddings: number[][]): Promise<void> {
        try {
            const vectors: VectorRecord[] = developerData.map((developer, index) => ({
                id: `${developer.developerId}`,
                values: embeddings[index],
                metadata: {
                    type: 'developer',
                    developerId: developer.developerId,
                    bio: developer.bio.substring(0, 1000), // Limit metadata size
                    skills: developer.skills.join(','),
                    experience: developer.experience,
                    portfolio: developer.portfolio
                }
            }));

            await pineconeService.upsertVectors(vectors);
            logger.info(`Stored ${vectors.length} developer vectors`);
        } catch (error) {
            logger.error('Failed to store developer vectors:', error);
            throw error;
        }
    }

    /**
     * Search for similar projects based on query
     */
    public async searchSimilarProjects(
        queryEmbedding: number[],
        topK: number = 10,
        filters?: {
            category?: string;
            skills?: string[];
            excludeUserId?: string;
        }
    ): Promise<QueryResult[]> {
        try {
            let filter: VectorMetadata | undefined;
            
            if (filters) {
                filter = { type: 'project' };
                if (filters.category) {
                    filter.category = filters.category;
                }
                if (filters.excludeUserId) {
                    // Note: Pinecone doesn't support $ne operator in metadata filters
                    // This would need to be handled at the application level
                    filter.excludeUserId = filters.excludeUserId;
                }
            } else {
                filter = { type: 'project' };
            }

            const results = await pineconeService.queryVectors(
                queryEmbedding,
                topK,
                filter,
                true
            );

            // Additional filtering for skills if provided
            if (filters?.skills && filters.skills.length > 0) {
                return results.filter(result => {
                    const skillsStr = result.metadata?.skills;
                    if (typeof skillsStr !== 'string') return false;
                    const resultSkills = skillsStr.split(',');
                    return filters.skills!.some(skill => 
                        resultSkills.some((resultSkill: string) => 
                            resultSkill.toLowerCase().includes(skill.toLowerCase())
                        )
                    );
                });
            }

            return results;
        } catch (error) {
            logger.error('Failed to search similar projects:', error);
            throw error;
        }
    }

    /**
     * Find developers matching project requirements
     */
    public async findMatchingDevelopers(
        projectEmbedding: number[],
        topK: number = 10,
        filters?: {
            skills?: string[];
            minExperience?: string;
        }
    ): Promise<QueryResult[]> {
        try {
            let filter: VectorMetadata | undefined;
            
            if (filters) {
                filter = { type: 'developer' };
                if (filters.minExperience) {
                    // Note: Pinecone doesn't support $gte operator in metadata filters
                    // This would need to be handled at the application level
                    filter.minExperience = filters.minExperience;
                }
            } else {
                filter = { type: 'developer' };
            }

            const results = await pineconeService.queryVectors(
                projectEmbedding,
                topK,
                filter,
                true
            );

            // Additional filtering for skills if provided
            if (filters?.skills && filters.skills.length > 0) {
                return results.filter(result => {
                    const skillsStr = result.metadata?.skills;
                    if (typeof skillsStr !== 'string') return false;
                    const resultSkills = skillsStr.split(',');
                    return filters.skills!.some(skill => 
                        resultSkills.some((resultSkill: string) => 
                            resultSkill.toLowerCase().includes(skill.toLowerCase())
                        )
                    );
                });
            }

            return results;
        } catch (error) {
            logger.error('Failed to find matching developers:', error);
            throw error;
        }
    }

    /**
     * Delete project vectors
     */
    public async deleteProjectVectors(projectIds: string[]): Promise<void> {
        try {
            const vectorIds = projectIds.map(id => `${id}`);
            await pineconeService.deleteVectors(vectorIds);
            logger.info(`Deleted ${projectIds.length} project vectors`);
        } catch (error) {
            logger.error('Failed to delete project vectors:', error);
            throw error;
        }
    }

    /**
     * Delete developer vectors
     */
    public async deleteDeveloperVectors(developerIds: string[]): Promise<void> {
        try {
            const vectorIds = developerIds.map(id => `${id}`);
            await pineconeService.deleteVectors(vectorIds);
            logger.info(`Deleted ${developerIds.length} developer vectors`);
        } catch (error) {
            logger.error('Failed to delete developer vectors:', error);
            throw error;
        }
    }

    /**
     * Update project vectors
     */
    public async updateProjectVectors(projectData: ProjectVectorData[], embeddings: number[][]): Promise<void> {
        try {
            // Delete existing vectors first
            const projectIds = projectData.map(project => project.projectId);
            await this.deleteProjectVectors(projectIds);
            
            // Store updated vectors
            await this.storeProjectVectors(projectData, embeddings);
            logger.info(`Updated ${projectData.length} project vectors`);
        } catch (error) {
            logger.error('Failed to update project vectors:', error);
            throw error;
        }
    }

    /**
     * Update developer vectors
     */
    public async updateDeveloperVectors(developerData: DeveloperVectorData[], embeddings: number[][]): Promise<void> {
        try {
            // Delete existing vectors first
            const developerIds = developerData.map(developer => developer.developerId);
            await this.deleteDeveloperVectors(developerIds);
            
            // Store updated vectors
            await this.storeDeveloperVectors(developerData, embeddings);
            logger.info(`Updated ${developerData.length} developer vectors`);
        } catch (error) {
            logger.error('Failed to update developer vectors:', error);
            throw error;
        }
    }

    /**
     * Get vector database statistics
     */
    public async getStats(): Promise<any> {
        try {
            return await pineconeService.getIndexStats();
        } catch (error) {
            logger.error('Failed to get vector database stats:', error);
            throw error;
        }
    }
}

export const vectorDBRepository = new VectorDBRepository();
