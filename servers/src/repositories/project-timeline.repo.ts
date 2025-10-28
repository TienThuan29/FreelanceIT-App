import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { ProjectTimeline } from "@/models/project.model";
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class ProjectTimelineRepository extends DynamoRepository {
    constructor() {
        super(config.PROJECT_TIMELINE_TABLE);
    }

    public async create(timeline: Omit<ProjectTimeline, 'id' | 'createdDate' | 'updatedDate'>): Promise<ProjectTimeline | null> {
        const id = uuidv4();
        const createdDate = new Date();
        const updatedDate = new Date();
        
        const timelineForDynamo = {
            ...timeline,
            id,
            createdDate: this.convertDateToISOString(createdDate),
            updatedDate: this.convertDateToISOString(updatedDate),
            meetingDate: this.convertDateToISOString(timeline.meetingDate)
        };

        const savingResult = await this.putItem(timelineForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(id);
    }

    public async findById(id: string): Promise<ProjectTimeline | null> {
        const timeline = await this.getItem({ id });
        if (!timeline) {
            return null;
        }
        return this.convertTimelineFromDynamo(timeline);
    }

    public async findByProjectId(projectId: string): Promise<ProjectTimeline[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'projectId = :projectId AND isDeleted = :isDeleted',
                ExpressionAttributeValues: {
                    ':projectId': projectId,
                    ':isDeleted': false
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }
            
            return result.Items.map(item => this.convertTimelineFromDynamo(item));
        } catch (error) {
            console.error('Error finding timelines by projectId:', error);
            return [];
        }
    }

    public async findAll(): Promise<ProjectTimeline[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'isDeleted = :isDeleted',
                ExpressionAttributeValues: {
                    ':isDeleted': false
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }
            
            return result.Items.map(item => this.convertTimelineFromDynamo(item));
        } catch (error) {
            console.error('Error finding all timelines:', error);
            return [];
        }
    }

    public async update(timeline: ProjectTimeline): Promise<ProjectTimeline | null> {
        const existingTimeline = await this.findById(timeline.id);
        if (!existingTimeline) {
            return null;
        }

        const updatedTimeline = {
            ...existingTimeline,
            ...timeline,
            updatedDate: new Date()
        };

        const timelineForDynamo = {
            ...updatedTimeline,
            createdDate: this.convertDateToISOString(updatedTimeline.createdDate),
            updatedDate: this.convertDateToISOString(updatedTimeline.updatedDate),
            meetingDate: this.convertDateToISOString(updatedTimeline.meetingDate)
        };

        const savingResult = await this.putItem(timelineForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(timeline.id);
    }

    public async delete(id: string): Promise<boolean> {
        try {
            // Soft delete - set isDeleted to true
            const timeline = await this.findById(id);
            if (!timeline) {
                return false;
            }

            const updatedTimeline = {
                ...timeline,
                isDeleted: true,
                updatedDate: new Date()
            };

            const timelineForDynamo = {
                ...updatedTimeline,
                createdDate: this.convertDateToISOString(updatedTimeline.createdDate),
                updatedDate: this.convertDateToISOString(updatedTimeline.updatedDate),
                meetingDate: this.convertDateToISOString(updatedTimeline.meetingDate)
            };

            const savingResult = await this.putItem(timelineForDynamo);
            return savingResult;
        } catch (error) {
            console.error('Error deleting timeline:', error);
            return false;
        }
    }

    private convertTimelineFromDynamo(item: any): ProjectTimeline {
        return {
            ...item,
            createdDate: this.convertISOStringToDate(item.createdDate),
            updatedDate: this.convertISOStringToDate(item.updatedDate),
            meetingDate: this.convertISOStringToDate(item.meetingDate)
        };
    }
}
