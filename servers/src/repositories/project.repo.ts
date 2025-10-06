import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { Project, ProjectType } from "@/models/project.model";
import { v4 as uuidv4 } from 'uuid';
import { ProjectCreateRequest, ProjectTypeCreateRequest } from "@/types/req/project.req";
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class ProjectRepository extends DynamoRepository {

    constructor() {
        super(config.PROJECT_TABLE);
    }

    public async findByUserId(userId: string): Promise<Project[]> {
        try {
            // Use scan with filter to find all projects by customerId
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'customerId = :customerId',
                ExpressionAttributeValues: {
                    ':customerId': userId
                }
            });
            const result = await dynamoDB.send(command);
            return (result.Items || []) as Project[];
        } catch (error) {
            console.error('Error finding projects by user ID:', error);
            return [];
        }
    }

    public async createProject(project: ProjectCreateRequest, projectImageUrl?: string): Promise<Project | null> {
        const id = uuidv4();
        const createdDate = new Date();
        const updatedDate = new Date();
        const projectForDynamo = {
            ...project,
            id,
            imageUrl: projectImageUrl,
            createdDate: this.convertDateToISOString(createdDate),
            updatedDate: this.convertDateToISOString(updatedDate)
        };
        const savingResult = await this.putItem(projectForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(id);
    }

    public async updateProject(project: Project): Promise<Project | null> {
        const existingProject = await this.findById(project.id);
        if (!existingProject) {
            return null;
        }
        const updatedProject = {
            ...existingProject,
            ...project,
            updatedDate: new Date() // Always set updatedDate to current date
        };
        const updatedProjectForDynamo = {
            ...updatedProject,
            updatedDate: this.convertDateToISOString(updatedProject.updatedDate)
        };
        const savingResult = await this.putItem(updatedProjectForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(project.id);
    }

    public async findById(id: string): Promise<Project | null> {
        const project = await this.getItem({ id });
        if (!project) {
            return null;
        }
        return project as Project;
    }

    public async deleteProject(id: string): Promise<boolean> {
        try {
            const result = await this.deleteItem({ id });
            return result;
        } catch (error) {
            return false;
        }
    }

    public async addUserToProject(projectId: string, userId: string, agreedRate?: number, contractUrl?: string): Promise<Project | null> {
        const project = await this.findById(projectId);
        if (!project) {
            return null;
        }
        
        // Add user to project team (this would need to be implemented based on your project structure)
        // For now, return the project as-is
        return project;
    }

    public async removeUserFromProject(projectId: string, userId: string): Promise<boolean> {
        const project = await this.findById(projectId);
        if (!project) {
            return false;
        }
        
        // Remove user from project team (this would need to be implemented based on your project structure)
        // For now, return true
        return true;
    }
}


export class ProjectTypeRepository extends DynamoRepository {

    constructor() {
        super(config.PROJECT_TYPE_TABLE);
    }

    public async findAllByUserId(createdBy: string): Promise<ProjectType[]> {
        try {
            // Use scan with filter to find all project types by createdBy
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'createdBy = :createdBy AND isDeleted = :isDeleted',
                ExpressionAttributeValues: {
                    ':createdBy': createdBy,
                    ':isDeleted': false
                }
            });
            const result = await dynamoDB.send(command);
            return (result.Items || []) as ProjectType[];
        } catch (error) {
            console.error('Error finding project types by user ID:', error);
            return [];
        }
    }

    public async createProjectType(projectType: ProjectTypeCreateRequest): Promise<ProjectType | null> {
        const id = uuidv4();
        const createdDate = new Date();
        const updatedDate = new Date();
        const projectTypeForDynamo = {
            id,
            ...projectType,
            isDeleted: false,
            createdDate: this.convertDateToISOString(createdDate),
            updatedDate: this.convertDateToISOString(updatedDate)
        };
        const savingResult = await this.putItem(projectTypeForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(id);
    }

    public async updateProjectType(projectType: ProjectType): Promise<ProjectType | null> {
        const existingProjectType = await this.findById(projectType.id);
        if (!existingProjectType) {
            return null;
        }
        const updatedProjectType = {
            ...existingProjectType,
            ...projectType,
            updatedDate: new Date() // Always set updatedDate to current date
        };
        const updatedProjectTypeForDynamo = {
            ...updatedProjectType,
            updatedDate: this.convertDateToISOString(updatedProjectType.updatedDate)
        };
        const savingResult = await this.putItem(updatedProjectTypeForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(projectType.id);
    }

    public async findById(id: string): Promise<ProjectType | null> {
        const projectType = await this.getItem({ id });
        if (!projectType) {
            return null;
        }
        return projectType as ProjectType;
    }

    public async deleteProjectType(id: string): Promise<boolean> {
        try {
            const result = await this.deleteItem({ id });
            return result;
        } catch (error) {
            return false;
        }
    }
}