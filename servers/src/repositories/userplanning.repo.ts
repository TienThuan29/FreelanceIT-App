import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { UserPlanning } from "@/models/planning.model";
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class UserPlanningRepository extends DynamoRepository {
    constructor() {
        super(config.USER_PLANNING_TABLE);
    }

    public async create(userPlanning: UserPlanning): Promise<UserPlanning | null> {
        const itemForDynamo = {
            ...userPlanning,
            transactionDate: this.convertDateToISOString(userPlanning.transactionDate)
        };

        const saved = await this.putItem(itemForDynamo);
        if (!saved) return null;

        return await this.findByUserAndPlanning(userPlanning.userId, userPlanning.planningId);
    }

    public async findByUserAndPlanning(userId: string, planningId: string): Promise<UserPlanning | null> {
        const item = await this.getItem({ userId, planningId }); // composite PK
        if (!item) return null;
        return this.convertUserPlanningFromDynamo(item);
    }

    public async findByOrderId(orderId: string): Promise<UserPlanning | null> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'orderId = :orderId',
                ExpressionAttributeValues: { ':orderId': orderId }
            });

            const result = await dynamoDB.send(command);
            if (!result.Items || result.Items.length === 0) return null;

            return this.convertUserPlanningFromDynamo(result.Items[0]);
        } catch (error) {
            console.error('Error finding user planning by orderId:', error);
            return null;
        }
    }

    public async findByUserId(userId: string): Promise<UserPlanning[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'userId = :userId',
                ExpressionAttributeValues: { ':userId': userId }
            });

            const result = await dynamoDB.send(command);
            if (!result.Items) return [];
            return result.Items.map(item => this.convertUserPlanningFromDynamo(item));
        } catch (error) {
            console.error('Error finding user plannings by userId:', error);
            return [];
        }
    }

    public async findActiveByUserId(userId: string): Promise<UserPlanning | null> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'userId = :userId AND isEnable = :isEnable',
                ExpressionAttributeValues: { ':userId': userId, ':isEnable': true }
            });

            const result = await dynamoDB.send(command);
            if (!result.Items || result.Items.length === 0) return null;

            // Lấy transaction gần nhất
            const sorted = result.Items.sort((a, b) =>
                new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
            );

            return this.convertUserPlanningFromDynamo(sorted[0]);
        } catch (error) {
            console.error('Error finding active user planning:', error);
            return null;
        }
    }

    public async update(userPlanning: UserPlanning): Promise<UserPlanning | null> {
        const existing = await this.findByUserAndPlanning(userPlanning.userId, userPlanning.planningId);
        if (!existing) return null;

        const itemForDynamo = {
            ...userPlanning,
            transactionDate: this.convertDateToISOString(userPlanning.transactionDate)
        };

        const saved = await this.putItem(itemForDynamo);
        if (!saved) return null;

        return await this.findByUserAndPlanning(userPlanning.userId, userPlanning.planningId);
    }

    private convertUserPlanningFromDynamo(item: any): UserPlanning {
        return {
            ...item,
            transactionDate: this.convertISOStringToDate(item.transactionDate)
        };
    }
}
