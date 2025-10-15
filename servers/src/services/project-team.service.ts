import { ProjectTeam } from "@/models/project.model";
import { ProjectTeamRepository } from "@/repositories/project-team.repo";
import { UserRepository } from "@/repositories/user.repo";
import { DeveloperRepository } from "@/repositories/developer.repo";
import logger from "@/libs/logger";

export interface ProjectTeamMember {
    id: string;
    projectId: string;
    developerId: string;
    developerName: string;
    developerEmail: string;
    developerAvatar?: string;
    agreedRate?: number;
    contractUrl?: string;
    joinedDate?: Date | string;
    leftDate?: Date | string;
    isActive: boolean;
    developerProfile?: {
        skills: Array<{
            id: string;
            name: string;
            proficiency: string;
            yearsOfExperience: number;
        }>;
        experience: number;
        bio?: string;
    };
}

export class ProjectTeamService {

    private readonly projectTeamRepository: ProjectTeamRepository;
    private readonly userRepository: UserRepository;
    private readonly developerRepository: DeveloperRepository;

    constructor() {
        this.projectTeamRepository = new ProjectTeamRepository();
        this.userRepository = new UserRepository();
        this.developerRepository = new DeveloperRepository();
    }

    public async getProjectTeamMembers(projectId: string): Promise<ProjectTeamMember[]> {
        try {
            const teamMembers = await this.projectTeamRepository.findByProjectId(projectId);
            
            // Populate developer information for each team member
            const teamMembersWithDeveloperInfo = await Promise.all(
                teamMembers.map(async (member) => {
                    try {
                        // Get user information
                        const user = await this.userRepository.findById(member.developerId);
                        if (!user) {
                            logger.warn(`User not found for team member ${member.id}`);
                            return null;
                        }

                        // Get developer profile
                        const developerProfile = await this.developerRepository.findByUserId(member.developerId);
                        
                        // Create enhanced team member object with developer info
                        const enhancedMember: ProjectTeamMember = {
                            id: member.id,
                            projectId: member.projectId,
                            developerId: member.developerId,
                            developerName: user.fullname || user.email,
                            developerEmail: user.email,
                            developerAvatar: user.avatar,
                            agreedRate: member.agreedRate,
                            contractUrl: member.contractUrl,
                            joinedDate: member.joinedDate,
                            leftDate: member.leftDate,
                            isActive: member.isActive,
                            developerProfile: developerProfile ? {
                                skills: developerProfile.skills || [],
                                experience: developerProfile.experienceYears || 0,
                                bio: developerProfile.bio
                            } : undefined
                        };

                        return enhancedMember;
                    } catch (error) {
                        logger.error(`Error populating developer info for team member ${member.id}:`, error);
                        return null;
                    }
                })
            );

            // Filter out null values
            return teamMembersWithDeveloperInfo.filter(member => member !== null) as ProjectTeamMember[];
        } catch (error) {
            logger.error('Error fetching project team members:', error);
            return [];
        }
    }

    public async addTeamMember(projectId: string, developerId: string, agreedRate?: number, contractUrl?: string): Promise<ProjectTeamMember | null> {
        try {
            // Check if developer is already in the project
            const existingMember = await this.projectTeamRepository.findByProjectAndDeveloper(projectId, developerId);
            if (existingMember && existingMember.isActive) {
                logger.warn(`Developer ${developerId} is already active in project ${projectId}`);
                return null;
            }
            
            // If developer exists but is inactive, reactivate them
            if (existingMember && !existingMember.isActive) {
                logger.info(`Reactivating developer ${developerId} in project ${projectId}`);
                const updatedMember = {
                    ...existingMember,
                    isActive: true,
                    agreedRate: agreedRate || existingMember.agreedRate,
                    contractUrl: contractUrl || existingMember.contractUrl,
                    joinedDate: new Date(),
                    leftDate: undefined
                };
                const result = await this.projectTeamRepository.updateProjectTeamMember(updatedMember);
                if (!result) {
                    return null;
                }
                
                // Get the enhanced team member with developer info
                const teamMembers = await this.getProjectTeamMembers(projectId);
                return teamMembers.find(member => member.id === result.id) || null;
            }

            // Create new team member
            const teamMember = await this.projectTeamRepository.createProjectTeamMember(projectId, developerId, agreedRate, contractUrl);
            if (!teamMember) {
                return null;
            }

            // Get the enhanced team member with developer info
            const teamMembers = await this.getProjectTeamMembers(projectId);
            return teamMembers.find(member => member.id === teamMember.id) || null;
        } catch (error) {
            logger.error('Error adding team member:', error);
            return null;
        }
    }

    public async removeTeamMember(projectId: string, developerId: string): Promise<boolean> {
        try {
            const result = await this.projectTeamRepository.removeProjectTeamMember(projectId, developerId);
            if (result) {
                logger.info(`Team member ${developerId} removed from project ${projectId}`);
            }
            return result;
        } catch (error) {
            logger.error('Error removing team member:', error);
            return false;
        }
    }

    public async updateTeamMember(teamMemberId: string, updates: Partial<ProjectTeam>): Promise<ProjectTeamMember | null> {
        try {
            const existingMember = await this.projectTeamRepository.findById(teamMemberId);
            if (!existingMember) {
                return null;
            }

            const updatedMember = {
                ...existingMember,
                ...updates
            };

            const result = await this.projectTeamRepository.updateProjectTeamMember(updatedMember);
            if (!result) {
                return null;
            }

            // Get the enhanced team member with developer info
            const teamMembers = await this.getProjectTeamMembers(result.projectId);
            return teamMembers.find(member => member.id === result.id) || null;
        } catch (error) {
            logger.error('Error updating team member:', error);
            return null;
        }
    }

    public async getTeamMemberById(teamMemberId: string): Promise<ProjectTeamMember | null> {
        try {
            const teamMember = await this.projectTeamRepository.findById(teamMemberId);
            if (!teamMember) {
                return null;
            }

            // Get enhanced team member with developer info
            const teamMembers = await this.getProjectTeamMembers(teamMember.projectId);
            return teamMembers.find(member => member.id === teamMemberId) || null;
        } catch (error) {
            logger.error('Error fetching team member by ID:', error);
            return null;
        }
    }

    public async getProjectsByDeveloper(developerId: string): Promise<ProjectTeam[]> {
        try {
            const projects = await this.projectTeamRepository.findByDeveloperId(developerId);
            return projects;
        } catch (error) {
            logger.error('Error fetching projects by developer:', error);
            return [];
        }
    }
}
