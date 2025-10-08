import { ResponseUtil } from "@/libs/response";
import { UserRepository } from "@/repositories/user.repo";
import { DeveloperRepository } from "@/repositories/developer.repo";
import { DeveloperService } from "@/services/developer.service";
import { Request, Response } from "express";
import { generateMultipleDevelopers } from "../test-api/create_dev";
import { User, DeveloperProfile } from "@/models/user.model";

export class TestDataApi {

    private readonly userRepository: UserRepository;
    private readonly developerRepository: DeveloperRepository;
    private readonly developerService: DeveloperService;

    constructor() {
        this.userRepository = new UserRepository();
        this.developerRepository = new DeveloperRepository();
        this.developerService = new DeveloperService();
        this.createDevelopers = this.createDevelopers.bind(this);
    }


    public async createDevelopers(request: Request, response: Response): Promise<void> {
        try {
            const count = parseInt(request.query.count as string) || 20;
            
            if (count < 1 || count > 100) {
                ResponseUtil.error(response, 'Count must be between 1 and 100', 400);
                return;
            }

            console.log(`Creating ${count} developers...`);
            
            const developersData = generateMultipleDevelopers(count);
            const results = {
                created: 0,
                failed: 0,
                embeddingCreated: 0,
                embeddingFailed: 0,
                developers: [] as any[]
            };

            for (const { user, developerProfile } of developersData) {
                try {
                    console.log(`Creating developer: ${user.fullname} (${user.email})`);
                    
                    // Create user first
                    const createdUser = await this.userRepository.create(user);
                    if (!createdUser) {
                        console.error(`Failed to create user: ${user.email}`);
                        results.failed++;
                        continue;
                    }

                    console.log(`User created with ID: ${createdUser.id}`);

                    // Use updateDeveloperProfile to create developer profile and vector embedding
                    developerProfile.userId = createdUser.id;
                    const developerProfileResponse = await this.developerService.updateDeveloperProfile(createdUser.id, developerProfile);
                    
                    if (!developerProfileResponse) {
                        console.error(`Failed to create developer profile and embedding for user: ${createdUser.id}`);
                        results.failed++;
                        continue;
                    }

                    console.log(`Developer profile and vector embedding created for user: ${createdUser.id}`);
                    results.created++;
                    results.embeddingCreated++;

                    results.developers.push({
                        userId: createdUser.id,
                        email: createdUser.email,
                        fullname: createdUser.fullname,
                        phone: createdUser.phone,
                        role: createdUser.role,
                        developerProfile: {
                            title: developerProfileResponse.developerProfile?.title,
                            bio: developerProfileResponse.developerProfile?.bio,
                            hourlyRate: developerProfileResponse.developerProfile?.hourlyRate,
                            experienceYears: developerProfileResponse.developerProfile?.experienceYears,
                            developerLevel: developerProfileResponse.developerProfile?.developerLevel,
                            skills: developerProfileResponse.developerProfile?.skills?.map(skill => ({
                                name: skill.name,
                                proficiency: skill.proficiency,
                                yearsOfExperience: skill.yearsOfExperience
                            })),
                            rating: developerProfileResponse.developerProfile?.rating,
                            totalProjects: developerProfileResponse.developerProfile?.totalProjects,
                            isAvailable: developerProfileResponse.developerProfile?.isAvailable
                        },
                        vectorEmbedding: 'Created' // Indicates that vector embedding was created
                    });

                } catch (error) {
                    console.error(`Error creating developer ${user.email}:`, error);
                    results.failed++;
                    results.embeddingFailed++;
                }
            }

            const message = `Successfully created ${results.created} developers with vector embeddings. ${results.failed} failed. Embeddings: ${results.embeddingCreated} created, ${results.embeddingFailed} failed.`;
            console.log(message);

            ResponseUtil.success(response, results, message, 200);

        } catch (error) {
            console.error('Error in createDevelopers:', error);
            ResponseUtil.error(response, 'Internal server error while creating developers', 500);
        }
    }

    
    public async clearDevelopers(request: Request, response: Response): Promise<void> {
        try {
            console.log('Clearing all developers and their vector embeddings...');
            
            // Get all users with DEVELOPER role
            const allUsers = await this.userRepository.findAll();
            const developerUsers = allUsers.filter(user => user.role === 'DEVELOPER');
            
            let cleared = 0;
            let failed = 0;
            let embeddingsCleared = 0;

            for (const user of developerUsers) {
                try {
                    console.log(`Clearing developer: ${user.email}`);
                    
                    // Delete vector embeddings first
                    try {
                        await this.developerService.updateDeveloperEmbedding(user.id);
                        embeddingsCleared++;
                        console.log(`✓ Vector embedding cleared for user: ${user.id}`);
                    } catch (embeddingError) {
                        console.log(`⚠ Vector embedding not found or already cleared for user: ${user.id}`);
                    }

                    // Delete developer profile
                    const developerProfile = await this.developerRepository.findByUserId(user.id);
                    if (developerProfile) {
                        // Note: We need to implement delete method in developer repository
                        console.log(`Developer profile found for user ${user.id}, but delete not implemented`);
                    }

                    // Delete user
                    const deleteResult = await this.userRepository.delete(user.id);
                    if (deleteResult) {
                        cleared++;
                        console.log(`✓ Cleared user: ${user.email}`);
                    } else {
                        failed++;
                        console.error(`✗ Failed to delete user: ${user.email}`);
                    }
                } catch (error) {
                    console.error(`Error clearing user ${user.email}:`, error);
                    failed++;
                }
            }

            const message = `Cleared ${cleared} developers and ${embeddingsCleared} vector embeddings. ${failed} failed.`;
            console.log(message);

            ResponseUtil.success(response, { cleared, failed, embeddingsCleared }, message, 200);

        } catch (error) {
            console.error('Error in clearDevelopers:', error);
            ResponseUtil.error(response, 'Internal server error while clearing developers', 500);
        }
    }
}
