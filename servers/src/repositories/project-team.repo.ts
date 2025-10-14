import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { ProjectTeam } from "@/models/project.model";
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class ProjectTeamRepository extends DynamoRepository {

    constructor() {
        super(config.PROJECT_TEAM_TABLE);
    }

    public async findByProjectId(projectId: string): Promise<ProjectTeam[]> {
        try {
            // Use scan with filter to find all team members by projectId
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'projectId = :projectId',
                ExpressionAttributeValues: {
                    ':projectId': projectId
                }
            });
            const result = await dynamoDB.send(command);
            return (result.Items || []) as ProjectTeam[];
        } catch (error) {
            console.error('Error finding project team by project ID:', error);
            return [];
        }
    }

    public async findByDeveloperId(developerId: string): Promise<ProjectTeam[]> {
        try {
            // Use scan with filter to find all projects by developerId
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'developerId = :developerId',
                ExpressionAttributeValues: {
                    ':developerId': developerId
                }
            });
            const result = await dynamoDB.send(command);
            return (result.Items || []) as ProjectTeam[];
        } catch (error) {
            console.error('Error finding project team by developer ID:', error);
            return [];
        }
    }

    public async findByProjectAndDeveloper(projectId: string, developerId: string): Promise<ProjectTeam | null> {
        try {
            // Use scan with filter to find specific team member
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'projectId = :projectId AND developerId = :developerId',
                ExpressionAttributeValues: {
                    ':projectId': projectId,
                    ':developerId': developerId
                }
            });
            const result = await dynamoDB.send(command);
            const teamMembers = (result.Items || []) as ProjectTeam[];
            return teamMembers.length > 0 ? teamMembers[0] : null;
        } catch (error) {
            console.error('Error finding project team member:', error);
            return null;
        }
    }

    public async createProjectTeamMember(projectId: string, developerId: string, agreedRate?: number, contractUrl?: string): Promise<ProjectTeam | null> {
        const id = uuidv4();
        const joinedDate = new Date();
        const createdDate = new Date();
        const updatedDate = new Date();
        
        const teamMemberForDynamo = {
            id,
            projectId,
            developerId,
            isActive: true,
            agreedRate: agreedRate || null,
            contractUrl: contractUrl || null,
            joinedDate: this.convertDateToISOString(joinedDate),
            leftDate: null,
            createdDate: this.convertDateToISOString(createdDate),
            updatedDate: this.convertDateToISOString(updatedDate)
        };
        
        const savingResult = await this.putItem(teamMemberForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(id);
    }

    public async updateProjectTeamMember(teamMember: ProjectTeam): Promise<ProjectTeam | null> {
        const existingMember = await this.findById(teamMember.id);
        if (!existingMember) {
            return null;
        }
        
        const updatedDate = new Date();
        const updatedMember = {
            ...existingMember,
            ...teamMember,
            updatedDate
        };
        
        const updatedMemberForDynamo = {
            ...updatedMember,
            joinedDate: updatedMember.joinedDate ? this.convertDateToISOString(updatedMember.joinedDate) : null,
            leftDate: updatedMember.leftDate ? this.convertDateToISOString(updatedMember.leftDate) : null,
            updatedDate: this.convertDateToISOString(updatedDate)
        };
        
        const savingResult = await this.putItem(updatedMemberForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(teamMember.id);
    }

    public async removeProjectTeamMember(projectId: string, developerId: string): Promise<boolean> {
        try {
            const teamMember = await this.findByProjectAndDeveloper(projectId, developerId);
            if (!teamMember) {
                return false;
            }
            
            // Soft delete by setting isActive to false and leftDate
            const updatedMember = {
                ...teamMember,
                isActive: false,
                leftDate: new Date()
            };
            
            const result = await this.updateProjectTeamMember(updatedMember);
            return result !== null;
        } catch (error) {
            console.error('Error removing project team member:', error);
            return false;
        }
    }

    public async findById(id: string): Promise<ProjectTeam | null> {
        const teamMember = await this.getItem({ id });
        if (!teamMember) {
            return null;
        }
        return teamMember as ProjectTeam;
    }

    public async deleteProjectTeamMember(id: string): Promise<boolean> {
        try {
            const result = await this.deleteItem({ id });
            return result;
        } catch (error) {
            return false;
        }
    }
}
