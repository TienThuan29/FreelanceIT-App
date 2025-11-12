import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { Rating } from "@/models/rating.model";
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "@/configs/database";

export class RatingRepository extends DynamoRepository {

    constructor() {
        super(config.RATING_TABLE);
    }

    public async create(rating: Omit<Rating, 'id' | 'createdDate' | 'updatedDate'>): Promise<Rating | null> {
        const id = uuidv4();
        const now = new Date();

        const ratingForDynamo = {
            ...rating,
            id,
            createdDate: this.convertDateToISOString(now),
            updatedDate: this.convertDateToISOString(now),
        };

        const saved = await this.putItem(ratingForDynamo);
        if (!saved) {
            return null;
        }
        return await this.findById(id);
    }

    public async findById(id: string): Promise<Rating | null> {
        const item = await this.getItem({ id });
        if (!item) return null;
        return this.fromDynamo(item);
    }

    public async findAll(): Promise<Rating[]> {
        const command = new ScanCommand({
            TableName: this.getTableName()
        });
        const result = await dynamoDB.send(command);
        const items = result.Items || [];
        return items.map(i => this.fromDynamo(i));
    }

    public async findByUserId(userId: string): Promise<Rating[]> {
        const command = new ScanCommand({
            TableName: this.getTableName(),
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        });
        const result = await dynamoDB.send(command);
        const items = result.Items || [];
        return items.map(i => this.fromDynamo(i));
    }

    public async update(id: string, updateData: Partial<Rating>): Promise<Rating | null> {
        const existing = await this.findById(id);
        if (!existing) return null;

        const updated: Rating = {
            ...existing,
            ...updateData,
            id: existing.id,
            userId: existing.userId,
            updatedDate: new Date()
        };

        const itemForDynamo = {
            ...updated,
            createdDate: this.convertDateToISOString(updated.createdDate),
            updatedDate: this.convertDateToISOString(updated.updatedDate),
        };

        const ok = await this.putItem(itemForDynamo);
        if (!ok) return null;
        return await this.findById(id);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.deleteItem({ id });
    }

    private fromDynamo(item: any): Rating {
        return {
            ...item,
            createdDate: this.convertISOStringToDate(item.createdDate)!,
            updatedDate: this.convertISOStringToDate(item.updatedDate)!,
        } as Rating;
    }
}

export const ratingRepositoryInstance = new RatingRepository();

