import { DeveloperProfile, User, Role, Skill } from "@/models/user.model";
import { DeveloperRepository } from "@/repositories/developer.repo";
import { UserRepository } from "@/repositories/user.repo";
import { DeveloperProfileResponse } from "@/types/res/user.res";
import type { UserProfileResponse } from "@/types/res/user.res";
import { mapUserToUserProfileResponse } from "@/libs/mappers/user.mapper";
import { S3Repository } from "@/repositories/s3.repo";
import { geminiEmbeddingService } from "@/thirdparties/gemini.service";
import { vectorDBRepository, DeveloperVectorData } from "@/repositories/vectordb.repo";
import logger from "@/libs/logger";

export class DeveloperService {

    private readonly developerRepository: DeveloperRepository;  
    private readonly userRepository: UserRepository;
    private readonly s3Repository: S3Repository;
    
    constructor() {
        this.developerRepository = new DeveloperRepository();
        this.userRepository = new UserRepository();
        this.s3Repository = new S3Repository();
    }
    /**
     * Check if user data changes should trigger vector embedding update
     */
    private shouldUpdateVectorEmbedding(userData: Partial<User>): boolean {
        // Update vector embedding if name or other searchable fields change
        const searchableFields: (keyof User)[] = ['fullname', 'email'];
        return Object.keys(userData).some(key => searchableFields.includes(key as keyof User));
    }

    public async getDevelopersByPage(page: number, pageSize: number): Promise<{ developers: DeveloperProfileResponse[], totalAvailable: number }> {
        try {
            console.log(`Getting developers - page: ${page}, pageSize: ${pageSize}`);
            
            // Get all users first
            const allUsers = await this.userRepository.findAll();
            
            // Filter users with DEVELOPER role
            const developerUsers = allUsers.filter(user => user.role === Role.DEVELOPER);
            console.log(`Found ${developerUsers.length} developers total`);
            
            // First, get all available developer profiles
            const allAvailableDevelopers: DeveloperProfileResponse[] = [];
            
            for (const user of developerUsers) {
                try {
                    const developerProfile = await this.developerRepository.findByUserId(user.id);
                    
                    // Only include developers who are available
                    if (!developerProfile || developerProfile.isAvailable !== true) {
                        continue;
                    }
                    
                    const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(user);
                    
                    // Generate signed URL for avatar if it exists
                    if ((userProfile as any).avatarUrl) {
                        try {
                            const signedUrl = await this.s3Repository.generateSignedUrl((userProfile as any).avatarUrl);
                            (userProfile as any).avatarUrl = signedUrl;
                        } catch (error) {
                            console.error(`Error generating signed URL for avatar ${(userProfile as any).avatarUrl}:`, error);
                        }
                    }
                    
                    allAvailableDevelopers.push({
                        userProfile: userProfile,
                        developerProfile: developerProfile,
                    } as DeveloperProfileResponse);
                } catch (error) {
                    console.error(`Error processing developer ${user.id}:`, error);
                    // Continue with other developers even if one fails
                }
            }
            
            console.log(`Found ${allAvailableDevelopers.length} available developers total`);
            
            // Now apply pagination to the filtered available developers
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedDevelopers = allAvailableDevelopers.slice(startIndex, endIndex);
            
            console.log(`Returning ${paginatedDevelopers.length} developers for page ${page} (showing ${startIndex + 1}-${Math.min(endIndex, allAvailableDevelopers.length)} of ${allAvailableDevelopers.length})`);
            
            return {
                developers: paginatedDevelopers,
                totalAvailable: allAvailableDevelopers.length
            };
            
        } catch (error) {
            console.error('Error in getDevelopersByPage:', error);
            return {
                developers: [],
                totalAvailable: 0
            };
        }
    }

    public async getDeveloperProfile(userId: string): Promise<DeveloperProfileResponse | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }
        const developerProfile = await this.developerRepository.findByUserId(userId);
        const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(user);
        
        // Generate signed URL for avatar if it exists
        if ((userProfile as any).avatarUrl) {
            try {
                const signedUrl = await this.s3Repository.generateSignedUrl((userProfile as any).avatarUrl);
                (userProfile as any).avatarUrl = signedUrl;
            } 
            catch (error) {
                console.error(`Error generating signed URL for avatar ${(userProfile as any).avatarUrl}:`, error);
            }
        }
        
        // Return user profile even if developer profile doesn't exist yet
        return {
            userProfile: userProfile,
            developerProfile: developerProfile || null,
        } as DeveloperProfileResponse;
    }

    public async updateUserAvatar(userId: string, avatarBuffer: Buffer, contentType: string): Promise<DeveloperProfileResponse | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }

        try {
            // Upload avatar to S3
            const avatarPath = await this.s3Repository.uploadFile(avatarBuffer, 'avatars', contentType);
            
            // Update user with new avatar path
            const updatedUser = await this.userRepository.update(userId, { avatarUrl: avatarPath });
            if (!updatedUser) {
                return null;
            }

            const developerProfile = await this.developerRepository.findByUserId(userId);
            const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(updatedUser);
            
            // Generate signed URL for the new avatar
            if ((userProfile as any).avatarUrl) {
                try {
                    const signedUrl = await this.s3Repository.generateSignedUrl((userProfile as any).avatarUrl);
                    (userProfile as any).avatarUrl = signedUrl;
                } catch (error) {
                    console.error(`Error generating signed URL for avatar ${(userProfile as any).avatarUrl}:`, error);
                }
            }
            
            // Update vector embedding if developer profile exists
            if (developerProfile) {
                try {
                    await this.createAndStoreDeveloperEmbedding(userId, updatedUser, developerProfile);
                    logger.info(`Successfully updated vector embedding for developer ${userId} after avatar update`);
                } catch (embeddingError) {
                    logger.error(`Failed to update vector embedding for developer ${userId} after avatar update:`, embeddingError);
                    // Don't fail the entire operation if embedding update fails
                }
            }
            
            return {
                userProfile: userProfile,
                developerProfile: developerProfile || null,
            } as DeveloperProfileResponse;
        } catch (error) {
            console.error('Error updating user avatar:', error);
            return null;
        }
    }

    public async updateUserProfile(userId: string, userData: Partial<User>): Promise<DeveloperProfileResponse | null> {
        const updatedUser = await this.userRepository.update(userId, userData);
        if (!updatedUser) {
            return null;
        }
        const developerProfile = await this.developerRepository.findByUserId(userId);
        const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(updatedUser);
        
        // Generate signed URL for avatar if it exists
        if ((userProfile as any).avatarUrl) {
            try {
                const signedUrl = await this.s3Repository.generateSignedUrl((userProfile as any).avatarUrl);
                (userProfile as any).avatarUrl = signedUrl;
            } catch (error) {
                console.error(`Error generating signed URL for avatar ${(userProfile as any).avatarUrl}:`, error);
            }
        }
        
        return {
            userProfile: userProfile,
            developerProfile: developerProfile || null,
        } as DeveloperProfileResponse;
    }

    public async updateDeveloperProfile(userId: string, developerProfile: DeveloperProfile): Promise<DeveloperProfileResponse | null> {        
        const user = await this.userRepository.findById(userId);
        if (!user) {
            console.error('User not found for userId:', userId);
            return null;
        }

        try {
            const updatedDeveloperProfile = await this.developerRepository.update(userId, developerProfile);
            if (!updatedDeveloperProfile) {
                logger.error('Failed to update developer profile');
                return null;
            }
            
            // After update developer profile, create a vector embedding for the developer profile
            try {
                await this.createAndStoreDeveloperEmbedding(userId, user, updatedDeveloperProfile);
                logger.info(`Successfully created and stored vector embedding for developer ${userId}`);
            } catch (embeddingError) {
                logger.error(`Failed to create vector embedding for developer ${userId}:`, embeddingError);
                // Don't fail the entire operation if embedding creation fails
            }
            
            const userProfile = await mapUserToUserProfileResponse(user);
            return {
                userProfile: userProfile,
                developerProfile: updatedDeveloperProfile,
            } as DeveloperProfileResponse;
        } catch (error) {
            logger.error('Error in updateDeveloperProfile:', error);
            return null;
        }
    }

    /**
     * Create and store vector embedding for developer profile
     */
    private async createAndStoreDeveloperEmbedding(
        userId: string, 
        user: User, 
        developerProfile: DeveloperProfile
    ): Promise<void> {
        try {
            // Prepare text for embedding generation
            const embeddingText = this.prepareDeveloperEmbeddingText(user, developerProfile);
            console.log(`Prepared embedding text for developer ${userId}: ${embeddingText.substring(0, 100)}...`);
            
            // Generate embedding using Gemini
            const embedding = await geminiEmbeddingService.generateEmbedding(embeddingText);
            console.log(`Generated embedding for developer ${userId}, dimension: ${embedding.length}`);
            
            // Prepare developer vector data
            const developerVectorData: DeveloperVectorData = {
                developerId: userId,
                name: user.fullname || '',
                bio: developerProfile.bio || '',
                skills: developerProfile.skills?.map(skill => skill.name) || [],
                experience: developerProfile.experienceYears?.toString() || '',
                portfolio: developerProfile.githubUrl || ''
            };
            
            console.log(`Prepared vector data for developer ${userId}:`, JSON.stringify(developerVectorData));
            
            // Store in vector database
            await vectorDBRepository.storeDeveloperVectors([developerVectorData], [embedding]);
            
            console.log(`Vector embedding created and stored for developer ${userId}`);
        } catch (error) {
            console.error(`Error creating vector embedding for developer ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Prepare text for embedding generation from developer profile
     */
    private prepareDeveloperEmbeddingText(user: User, developerProfile: DeveloperProfile): string {
        const parts: string[] = [];
        
        // Add name
        if (user.fullname) {
            parts.push(`Name: ${user.fullname}`);
        }
        
        // Add bio
        if (developerProfile.bio) {
            parts.push(`Bio: ${developerProfile.bio}`);
        }
        
        // Add skills
        if (developerProfile.skills && developerProfile.skills.length > 0) {
            const skillNames = developerProfile.skills.map(skill => skill.name).join(', ');
            parts.push(`Skills: ${skillNames}`);
        }
        
        // Add experience
        if (developerProfile.experienceYears) {
            parts.push(`Experience: ${developerProfile.experienceYears} years`);
        }
        
        // Add developer level
        if (developerProfile.developerLevel) {
            parts.push(`Level: ${developerProfile.developerLevel}`);
        }
        
        // Add GitHub URL
        if (developerProfile.githubUrl) {
            parts.push(`GitHub: ${developerProfile.githubUrl}`);
        }
        
        // Add LinkedIn URL
        if (developerProfile.linkedinUrl) {
            parts.push(`LinkedIn: ${developerProfile.linkedinUrl}`);
        }
        
        // Add availability status
        if (developerProfile.isAvailable !== undefined) {
            parts.push(`Available: ${developerProfile.isAvailable ? 'Yes' : 'No'}`);
        }
        
        // Add hourly rate if available
        if (developerProfile.hourlyRate) {
            parts.push(`Hourly Rate: $${developerProfile.hourlyRate}`);
        }
        
        // Add rating if available
        if (developerProfile.rating) {
            parts.push(`Rating: ${developerProfile.rating}/5`);
        }
        
        // Add languages if available
        if (developerProfile.languages && developerProfile.languages.length > 0) {
            parts.push(`Languages: ${developerProfile.languages.join(', ')}`);
        }
        
        // Add timezone if available
        if (developerProfile.timezone) {
            parts.push(`Timezone: ${developerProfile.timezone}`);
        }
        
        return parts.join('. ');
    }

    /**
     * Update vector embedding when developer profile changes
     * This method should be called when specific fields are updated
     */
    public async updateDeveloperEmbedding(userId: string): Promise<boolean> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                console.error('User not found for userId:', userId);
                return false;
            }

            const developerProfile = await this.developerRepository.findByUserId(userId);
            if (!developerProfile) {
                console.error('Developer profile not found for userId:', userId);
                return false;
            }

            // Delete existing embedding
            await vectorDBRepository.deleteDeveloperVectors([userId]);
            
            // Create new embedding
            await this.createAndStoreDeveloperEmbedding(userId, user, developerProfile);
            
            console.log(`Successfully updated vector embedding for developer ${userId}`);
            return true;
        } catch (error) {
            console.error(`Failed to update vector embedding for developer ${userId}:`, error);
            return false;
        }
    }

    /**
     * Add a skill to developer profile
     */
    public async addSkill(userId: string, skill: Skill): Promise<DeveloperProfileResponse | null> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                console.error('User not found for userId:', userId);
                return null;
            }

            const developerProfile = await this.developerRepository.findByUserId(userId);
            if (!developerProfile) {
                console.error('Developer profile not found for userId:', userId);
                return null;
            }

            // Add skill to existing skills array
            const updatedSkills = [...(developerProfile.skills || []), skill];
            const updatedProfile = await this.developerRepository.update(userId, {
                ...developerProfile,
                skills: updatedSkills
            });

            if (!updatedProfile) {
                console.error('Failed to add skill to developer profile');
                return null;
            }

            // Update vector embedding
            try {
                await this.updateDeveloperEmbedding(userId);
            } catch (embeddingError) {
                console.error(`Failed to update vector embedding after adding skill:`, embeddingError);
                // Don't fail the entire operation if embedding update fails
            }

            const userProfile = await mapUserToUserProfileResponse(user);
            return {
                userProfile: userProfile,
                developerProfile: updatedProfile,
            } as DeveloperProfileResponse;
        } catch (error) {
            console.error('Error adding skill to developer profile:', error);
            return null;
        }
    }

    /**
     * Update a skill in developer profile
     */
    public async updateSkill(userId: string, skillId: string, updatedSkill: Partial<Skill>): Promise<DeveloperProfileResponse | null> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                console.error('User not found for userId:', userId);
                return null;
            }

            const developerProfile = await this.developerRepository.findByUserId(userId);
            if (!developerProfile) {
                console.error('Developer profile not found for userId:', userId);
                return null;
            }

            // Update the specific skill in the skills array
            const updatedSkills = (developerProfile.skills || []).map(skill => 
                skill.id === skillId ? { ...skill, ...updatedSkill } : skill
            );

            const updatedProfile = await this.developerRepository.update(userId, {
                ...developerProfile,
                skills: updatedSkills
            });

            if (!updatedProfile) {
                console.error('Failed to update skill in developer profile');
                return null;
            }

            // Update vector embedding
            try {
                await this.updateDeveloperEmbedding(userId);
            } catch (embeddingError) {
                console.error(`Failed to update vector embedding after updating skill:`, embeddingError);
                // Don't fail the entire operation if embedding update fails
            }

            const userProfile = await mapUserToUserProfileResponse(user);
            return {
                userProfile: userProfile,
                developerProfile: updatedProfile,
            } as DeveloperProfileResponse;
        } catch (error) {
            console.error('Error updating skill in developer profile:', error);
            return null;
        }
    }

    /**
     * Remove a skill from developer profile
     */
    public async removeSkill(userId: string, skillId: string): Promise<DeveloperProfileResponse | null> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                console.error('User not found for userId:', userId);
                return null;
            }

            const developerProfile = await this.developerRepository.findByUserId(userId);
            if (!developerProfile) {
                console.error('Developer profile not found for userId:', userId);
                return null;
            }

            // Remove the skill from the skills array
            const updatedSkills = (developerProfile.skills || []).filter(skill => skill.id !== skillId);

            const updatedProfile = await this.developerRepository.update(userId, {
                ...developerProfile,
                skills: updatedSkills
            });

            if (!updatedProfile) {
                console.error('Failed to remove skill from developer profile');
                return null;
            }

            // Update vector embedding
            try {
                await this.updateDeveloperEmbedding(userId);
            } catch (embeddingError) {
                console.error(`Failed to update vector embedding after removing skill:`, embeddingError);
                // Don't fail the entire operation if embedding update fails
            }

            const userProfile = await mapUserToUserProfileResponse(user);
            return {
                userProfile: userProfile,
                developerProfile: updatedProfile,
            } as DeveloperProfileResponse;
        } catch (error) {
            console.error('Error removing skill from developer profile:', error);
            return null;
        }
    }

    /**
     * Get all skills for a developer
     */
    public async getSkills(userId: string): Promise<Skill[]> {
        try {
            const developerProfile = await this.developerRepository.findByUserId(userId);
            return developerProfile?.skills || [];
        } catch (error) {
            console.error('Error getting skills for developer:', error);
            return [];
        }
    }

}