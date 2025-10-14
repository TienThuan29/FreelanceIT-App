import { ProjectApplication, ApplicationStatus } from "@/models/application.model";
import { ApplicationRepository } from "@/repositories/application.repo";
import { DeveloperRepository } from "@/repositories/developer.repo";
import { ProjectRepository } from "@/repositories/project.repo";
import { UserRepository } from "@/repositories/user.repo";
import logger from "@/libs/logger";

export class ApplicationService {

    private readonly applicationRepository: ApplicationRepository;
    private readonly developerRepository: DeveloperRepository;
    private readonly projectRepository: ProjectRepository;
    private readonly userRepository: UserRepository;

    constructor() {
        this.applicationRepository = new ApplicationRepository();
        this.developerRepository = new DeveloperRepository();
        this.projectRepository = new ProjectRepository();
        this.userRepository = new UserRepository();
    }

    public async createApplication(application: Partial<ProjectApplication>, userId: string): Promise<ProjectApplication | null> {
        try {
            // Check if user has developer profile
            const developerProfile = await this.developerRepository.findByUserId(userId);
            if (!developerProfile) {
                logger.error(`User ${userId} does not have a developer profile`);
                return null;
            }

            // Check if project exists and is accepting applications
            if (!application.projectId) {
                logger.error('Project ID is required');
                return null;
            }
            
            const project = await this.projectRepository.findById(application.projectId);
            if (!project) {
                logger.error(`Project ${application.projectId} not found`);
                return null;
            }

            if (project.status !== 'OPEN_APPLYING') {
                logger.error(`Project ${application.projectId} is not accepting applications`);
                return null;
            }

            // Check if user has already applied to this project
            const existingApplication = await this.applicationRepository.findByProjectAndDeveloper(
                application.projectId, 
                userId
            );
            if (existingApplication) {
                logger.error(`User ${userId} has already applied to project ${application.projectId}`);
                return null;
            }

            // Set developer ID and default values
            const applicationToCreate: ProjectApplication = {
                id: '', // Will be set by repository
                ...application,
                developerId: userId,
                status: ApplicationStatus.PENDING,
                appliedDate: application.appliedDate || new Date(),
                createdDate: new Date(),
                updatedDate: new Date()
            } as ProjectApplication;

            const createdApplication = await this.applicationRepository.createApplication(applicationToCreate);
            logger.info(`Application created successfully for user ${userId} to project ${application.projectId}`);
            
            return createdApplication;
        } catch (error) {
            logger.error('Error creating application:', error);
            return null;
        }
    }

    public async getApplicationsByProject(projectId: string): Promise<ProjectApplication[]> {
        try {
            const applications = await this.applicationRepository.findByProjectId(projectId);
            
            // Populate developer information for each application
            const applicationsWithDeveloperInfo = await Promise.all(
                applications.map(async (application) => {
                    try {
                        // Get user information
                        const user = await this.userRepository.findById(application.developerId);
                        if (!user) {
                            logger.warn(`User not found for application ${application.id}`);
                            return application;
                        }

                        // Get developer profile
                        const developerProfile = await this.developerRepository.findByUserId(application.developerId);
                        
                        // Create enhanced application object with developer info
                        const enhancedApplication = {
                            ...application,
                            developer: {
                                id: user.id,
                                name: user.fullname || user.email,
                                email: user.email,
                                avatar: user.avatar,
                                developerProfile: developerProfile ? {
                                    skills: developerProfile.skills || [],
                                    experience: developerProfile.experienceYears || 0,
                                    bio: developerProfile.bio
                                } : undefined
                            }
                        };

                        return enhancedApplication;
                    } catch (error) {
                        logger.error(`Error populating developer info for application ${application.id}:`, error);
                        return application;
                    }
                })
            );

            return applicationsWithDeveloperInfo;
        } catch (error) {
            logger.error('Error fetching applications by project:', error);
            return [];
        }
    }

    public async getApplicationsByDeveloper(developerId: string): Promise<ProjectApplication[]> {
        try {
            const applications = await this.applicationRepository.findByDeveloperId(developerId);
            return applications;
        } catch (error) {
            logger.error('Error fetching applications by developer:', error);
            return [];
        }
    }

    public async getApplicationById(id: string): Promise<ProjectApplication | null> {
        try {
            const application = await this.applicationRepository.findById(id);
            return application;
        } catch (error) {
            logger.error('Error fetching application by ID:', error);
            return null;
        }
    }

    public async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string): Promise<ProjectApplication | null> {
        try {
            const existingApplication = await this.applicationRepository.findById(id);
            if (!existingApplication) {
                logger.error(`Application ${id} not found`);
                return null;
            }

            const reviewedDate = new Date();
            const updatedDate = new Date();
            const updatedApplication = {
                ...existingApplication,
                status,
                notes: notes || existingApplication.notes,
                reviewedDate,
                updatedDate
            };

            const result = await this.applicationRepository.updateApplication(updatedApplication);
            logger.info(`Application ${id} status updated to ${status}`);
            
            return result;
        } catch (error) {
            logger.error('Error updating application status:', error);
            return null;
        }
    }

    public async deleteApplication(id: string): Promise<boolean> {
        try {
            const result = await this.applicationRepository.deleteApplication(id);
            if (result) {
                logger.info(`Application ${id} deleted successfully`);
            }
            return result;
        } catch (error) {
            logger.error('Error deleting application:', error);
            return false;
        }
    }

    public async hasUserAppliedToProject(projectId: string, userId: string): Promise<boolean> {
        try {
            const application = await this.applicationRepository.findByProjectAndDeveloper(projectId, userId);
            return application !== null;
        } catch (error) {
            logger.error('Error checking if user has applied to project:', error);
            return false;
        }
    }
}
