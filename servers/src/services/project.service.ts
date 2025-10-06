import { Project, ProjectType } from "@/models/project.model";
import { ProjectRepository, ProjectTypeRepository } from "@/repositories/project.repo";
import { S3Repository } from "@/repositories/s3.repo";
import { ProjectCreateRequest, ProjectTypeCreateRequest } from "@/types/req/project.req";
import logger from "@/libs/logger";

export class ProjectService {


    private readonly projectRepository: ProjectRepository;
    private readonly projectTypeRepository: ProjectTypeRepository;
    private readonly s3Service: S3Repository;

    constructor() {
        this.projectRepository = new ProjectRepository();
        this.projectTypeRepository = new ProjectTypeRepository();
        this.s3Service = new S3Repository();
    }

    // Project Type Service

    public async createProjectType(projectType: ProjectTypeCreateRequest, userId: string): Promise<ProjectType | null> {
        projectType.createdBy = userId;
        return await this.projectTypeRepository.createProjectType(projectType);
    }

    public async getProjectTypesByUserId(createdBy: string): Promise<ProjectType[]> {
        const projectTypes = await this.projectTypeRepository.findAllByUserId(createdBy);
        return projectTypes;
    }

    public async updateProjectType(projectType: ProjectType): Promise<ProjectType | null> {
        return await this.projectTypeRepository.updateProjectType(projectType);
    }

    public async getProjectTypeById(id: string): Promise<ProjectType | null> {
        return await this.projectTypeRepository.findById(id);
    }

    // Project Service

    public async getProjectsByUserId(userId: string): Promise<Project[]> {
        const projects = await this.projectRepository.findByUserId(userId);
        
        // Generate signed URLs for project images and populate projectType
        const projectsWithSignedUrls = await Promise.all(
            projects.map(async (project) => {
                let updatedProject = { ...project };
                
                // Generate signed URL for image if it exists
                if (project.imageUrl) {
                    try {
                        const signedUrl = await this.s3Service.generateSignedUrl(project.imageUrl);
                        updatedProject.imageUrl = signedUrl;
                    } catch (error) {
                        logger.error(`Error generating signed URL for project ${project.id}:`, error);
                    }
                }
                
                // Populate projectType if it's just an ID string
                if (typeof project.projectType === 'string') {
                    try {
                        const projectType = await this.projectTypeRepository.findById(project.projectType);
                        if (projectType) {
                            updatedProject.projectType = projectType;
                        }
                    } catch (error) {
                        logger.error(`Error fetching project type for project ${project.id}:`, error);
                    }
                }
                
                return updatedProject;
            })
        );
        
        return projectsWithSignedUrls;
    }

    public async createProject(project: ProjectCreateRequest, userId: string): Promise<Project | null> {
        project.customerId = userId;
        let projectImageUrl = '';
        // upload image to S3
        if (project.projectImage) {
            projectImageUrl = await this.s3Service.uploadFile(
                project.projectImage, 
                'project-images', 
                'image/jpeg'
            );
        }
        return await this.projectRepository.createProject(project, projectImageUrl);
    }

    public async getProjectById(id: string): Promise<Project | null> {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            return null;
        }
        
        let updatedProject = { ...project };
        
        // Generate signed URL for project image if it exists
        if (project.imageUrl) {
            try {
                const signedUrl = await this.s3Service.generateSignedUrl(project.imageUrl);
                updatedProject.imageUrl = signedUrl;
            } catch (error) {
                logger.error(`Error generating signed URL for project ${project.id}:`, error);
            }
        }
        
        // Populate projectType if it's just an ID string
        if (typeof project.projectType === 'string') {
            try {
                const projectType = await this.projectTypeRepository.findById(project.projectType);
                if (projectType) {
                    updatedProject.projectType = projectType;
                }
            } catch (error) {
                logger.error(`Error fetching project type for project ${project.id}:`, error);
            }
        }
        
        return updatedProject;
    }

    public async updateProject(project: Project, projectImage?: Buffer): Promise<Project | null> {
        const existingProject = await this.projectRepository.findById(project.id);
        if (!existingProject) {
            return null;
        }

        let projectImageUrl = existingProject.imageUrl; // Keep existing image URL by default

        // Only update image if a new image is provided
        if (projectImage) {
            try {
                projectImageUrl = await this.s3Service.uploadFile(
                    projectImage, 
                    'project-images', 
                    'image/jpeg'
                );
            } catch (error) {
                logger.error(`Error uploading project image for project ${project.id}:`, error);
                // Keep existing image URL if upload fails
            }
        }

        // Update project with new image URL (or keep existing one)
        const updatedProject = {
            ...project,
            imageUrl: projectImageUrl
        };

        return await this.projectRepository.updateProject(updatedProject);
    }

    public async deleteProject(id: string): Promise<boolean> {
        return await this.projectRepository.deleteProject(id);
    }

    public async deleteProjectType(id: string): Promise<boolean> {
        const projectType = await this.projectTypeRepository.findById(id);
        if (!projectType) {
            return false;
        }
        projectType.isDeleted = true;
        projectType.updatedDate = new Date();
        return await this.projectTypeRepository.updateProjectType(projectType) !== null;
    }

    public async addUserToProject(projectId: string, userId: string, agreedRate?: number, contractUrl?: string): Promise<Project | null> {
        return await this.projectRepository.addUserToProject(projectId, userId, agreedRate, contractUrl);
    }

    public async removeUserFromProject(projectId: string, userId: string): Promise<boolean> {
        return await this.projectRepository.removeUserFromProject(projectId, userId);
    }

    public async generateImageSignedUrl(imageKey: string): Promise<string> {
        return await this.s3Service.generateSignedUrl(imageKey);
    }
}