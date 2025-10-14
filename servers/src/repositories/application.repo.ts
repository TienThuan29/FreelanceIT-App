import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { ProjectApplication } from "@/models/application.model";
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class ApplicationRepository extends DynamoRepository {

    constructor() {
        super(config.APPLICATION_TABLE);
    }

    public async createApplication(application: ProjectApplication): Promise<ProjectApplication | null> {
        const id = uuidv4();
        const createdDate = new Date();
        const updatedDate = new Date();
        const applicationForDynamo = {
            ...application,
            id,
            createdDate: this.convertDateToISOString(createdDate),
            updatedDate: this.convertDateToISOString(updatedDate),
            appliedDate: application.appliedDate ? this.convertDateToISOString(application.appliedDate) : this.convertDateToISOString(new Date()),
            reviewedDate: application.reviewedDate ? this.convertDateToISOString(application.reviewedDate) : undefined
        };
        const savingResult = await this.putItem(applicationForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(id);
    }

    public async findById(id: string): Promise<ProjectApplication | null> {
        const application = await this.getItem({ id });
        if (!application) {
            return null;
        }
        return application as ProjectApplication;
    }

    public async findByProjectId(projectId: string): Promise<ProjectApplication[]> {
        try {
            // Use scan with filter to find all applications by projectId
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'projectId = :projectId',
                ExpressionAttributeValues: {
                    ':projectId': projectId
                }
            });
            const result = await dynamoDB.send(command);
            return (result.Items || []) as ProjectApplication[];
        } catch (error) {
            console.error('Error finding applications by project ID:', error);
            return [];
        }
    }

    public async findByDeveloperId(developerId: string): Promise<ProjectApplication[]> {
        try {
            // Use scan with filter to find all applications by developerId
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'developerId = :developerId',
                ExpressionAttributeValues: {
                    ':developerId': developerId
                }
            });
            const result = await dynamoDB.send(command);
            return (result.Items || []) as ProjectApplication[];
        } catch (error) {
            console.error('Error finding applications by developer ID:', error);
            return [];
        }
    }

    public async findByProjectAndDeveloper(projectId: string, developerId: string): Promise<ProjectApplication | null> {
        try {
            // Use scan with filter to find application by both projectId and developerId
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'projectId = :projectId AND developerId = :developerId',
                ExpressionAttributeValues: {
                    ':projectId': projectId,
                    ':developerId': developerId
                }
            });
            const result = await dynamoDB.send(command);
            const applications = (result.Items || []) as ProjectApplication[];
            return applications.length > 0 ? applications[0] : null;
        } catch (error) {
            console.error('Error finding application by project and developer:', error);
            return null;
        }
    }

    public async updateApplication(application: ProjectApplication): Promise<ProjectApplication | null> {
        const existingApplication = await this.findById(application.id);
        if (!existingApplication) {
            return null;
        }
        const updatedDate = new Date();
        const updatedApplication = {
            ...existingApplication,
            ...application,
            updatedDate
        };
        const updatedApplicationForDynamo = {
            ...updatedApplication,
            createdDate: updatedApplication.createdDate ? this.convertDateToISOString(updatedApplication.createdDate) : undefined,
            updatedDate: this.convertDateToISOString(updatedDate),
            appliedDate: updatedApplication.appliedDate ? this.convertDateToISOString(updatedApplication.appliedDate) : undefined,
            reviewedDate: updatedApplication.reviewedDate ? this.convertDateToISOString(updatedApplication.reviewedDate) : undefined
        };
        const savingResult = await this.putItem(updatedApplicationForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(application.id);
    }

    public async deleteApplication(id: string): Promise<boolean> {
        try {
            const result = await this.deleteItem({ id });
            return result;
        } catch (error) {
            return false;
        }
    }
}
