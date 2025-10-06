import { ResponseUtil } from "@/libs/response";
import { UserRepository } from "@/repositories/user.repo";
import { DeveloperRepository } from "@/repositories/developer.repo";
import { Request, Response } from "express";
import { generateMultipleDevelopers } from "../test-api/create_dev";
import { User, DeveloperProfile } from "@/models/user.model";

export class TestDataApi {

    private readonly userRepository: UserRepository;
    private readonly developerRepository: DeveloperRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.developerRepository = new DeveloperRepository();
        this.createDevelopers = this.createDevelopers.bind(this);
    }

    /**
     * @swagger
     * /test-data/create-developers:
     *   post:
     *     summary: Create multiple developer accounts with profiles
     *     description: Generates and saves 20 developers with both user profiles and developer profiles
     *     tags: [Test Data]
     *     parameters:
     *       - in: query
     *         name: count
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 20
     *         description: Number of developers to create
     *     responses:
     *       200:
     *         description: Developers created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     created:
     *                       type: integer
     *                     failed:
     *                       type: integer
     *                     developers:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           userId:
     *                             type: string
     *                           email:
     *                             type: string
     *                           fullname:
     *                             type: string
     *                           developerProfile:
     *                             type: object
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
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

                    // Create developer profile
                    developerProfile.userId = createdUser.id;
                    const createdDeveloperProfile = await this.developerRepository.create(createdUser.id, developerProfile);
                    
                    if (!createdDeveloperProfile) {
                        console.error(`Failed to create developer profile for user: ${createdUser.id}`);
                        results.failed++;
                        continue;
                    }

                    console.log(`Developer profile created for user: ${createdUser.id}`);

                    results.created++;
                    results.developers.push({
                        userId: createdUser.id,
                        email: createdUser.email,
                        fullname: createdUser.fullname,
                        phone: createdUser.phone,
                        role: createdUser.role,
                        developerProfile: {
                            title: createdDeveloperProfile.title,
                            bio: createdDeveloperProfile.bio,
                            hourlyRate: createdDeveloperProfile.hourlyRate,
                            experienceYears: createdDeveloperProfile.experienceYears,
                            developerLevel: createdDeveloperProfile.developerLevel,
                            skills: createdDeveloperProfile.skills?.map(skill => ({
                                name: skill.name,
                                proficiency: skill.proficiency,
                                yearsOfExperience: skill.yearsOfExperience
                            })),
                            rating: createdDeveloperProfile.rating,
                            totalProjects: createdDeveloperProfile.totalProjects,
                            isAvailable: createdDeveloperProfile.isAvailable
                        }
                    });

                } catch (error) {
                    console.error(`Error creating developer ${user.email}:`, error);
                    results.failed++;
                }
            }

            const message = `Successfully created ${results.created} developers. ${results.failed} failed.`;
            console.log(message);

            ResponseUtil.success(response, results, message, 200);

        } catch (error) {
            console.error('Error in createDevelopers:', error);
            ResponseUtil.error(response, 'Internal server error while creating developers', 500);
        }
    }

    /**
     * @swagger
     * /test-data/clear-developers:
     *   delete:
     *     summary: Clear all test developers
     *     description: Removes all developer accounts and profiles from the database
     *     tags: [Test Data]
     *     responses:
     *       200:
     *         description: Developers cleared successfully
     *       500:
     *         description: Internal server error
     */
    public async clearDevelopers(request: Request, response: Response): Promise<void> {
        try {
            console.log('Clearing all developers...');
            
            // Get all users with DEVELOPER role
            const allUsers = await this.userRepository.findAll();
            const developerUsers = allUsers.filter(user => user.role === 'DEVELOPER');
            
            let cleared = 0;
            let failed = 0;

            for (const user of developerUsers) {
                try {
                    // Delete developer profile first
                    const developerProfile = await this.developerRepository.findByUserId(user.id);
                    if (developerProfile) {
                        // Note: We need to implement delete method in developer repository
                        console.log(`Developer profile found for user ${user.id}, but delete not implemented`);
                    }

                    // Delete user
                    const deleteResult = await this.userRepository.delete(user.id);
                    if (deleteResult) {
                        cleared++;
                        console.log(`Cleared user: ${user.email}`);
                    } else {
                        failed++;
                        console.error(`Failed to delete user: ${user.email}`);
                    }
                } catch (error) {
                    console.error(`Error clearing user ${user.email}:`, error);
                    failed++;
                }
            }

            const message = `Cleared ${cleared} developers. ${failed} failed.`;
            console.log(message);

            ResponseUtil.success(response, { cleared, failed }, message, 200);

        } catch (error) {
            console.error('Error in clearDevelopers:', error);
            ResponseUtil.error(response, 'Internal server error while clearing developers', 500);
        }
    }
}
