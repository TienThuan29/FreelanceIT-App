import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { Planning, PlanningCreate, UserPlanning } from "@/models/planning.model";
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class PlanningRepository extends DynamoRepository {
    constructor() {
        super(config.PLANNING_TABLE);
    }

    public async create(planning: PlanningCreate): Promise<Planning | null> {
        const id = uuidv4();
        const createdDate = new Date();
        const updateDate = new Date();
        
        const planningForDynamo = {
            ...planning,
            id,
            createdDate: this.convertDateToISOString(createdDate),
            updateDate: this.convertDateToISOString(updateDate)
        };

        const savingResult = await this.putItem(planningForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(id);
    }

    public async findById(id: string): Promise<Planning | null> {
        const planning = await this.getItem({ id });
        if (!planning) {
            return null;
        }
        return this.convertPlanningFromDynamo(planning);
    }

    public async findAll(): Promise<Planning[]> {
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
            
            return result.Items.map(item => this.convertPlanningFromDynamo(item));
        } catch (error) {
            console.error('Error finding all plannings:', error);
            return [];
        }
    }

    public async update(planning: Planning): Promise<Planning | null> {
        const existingPlanning = await this.findById(planning.id);
        if (!existingPlanning) {
            return null;
        }

        const updatedPlanning = {
            ...existingPlanning,
            ...planning,
            updateDate: new Date()
        };

        const planningForDynamo = {
            ...updatedPlanning,
            createdDate: this.convertDateToISOString(updatedPlanning.createdDate),
            updateDate: this.convertDateToISOString(updatedPlanning.updateDate)
        };

        const savingResult = await this.putItem(planningForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(planning.id);
    }

    public async delete(id: string): Promise<boolean> {
        try {
            // Soft delete - set isDeleted to true
            const planning = await this.findById(id);
            if (!planning) {
                return false;
            }

            const updatedPlanning = {
                ...planning,
                isDeleted: true,
                updateDate: new Date()
            };

            const planningForDynamo = {
                ...updatedPlanning,
                createdDate: this.convertDateToISOString(updatedPlanning.createdDate),
                updateDate: this.convertDateToISOString(updatedPlanning.updateDate)
            };

            const savingResult = await this.putItem(planningForDynamo);
            return savingResult;
        } catch (error) {
            console.error('Error deleting planning:', error);
            return false;
        }
    }

    private convertPlanningFromDynamo(item: any): Planning {
        return {
            ...item,
            createdDate: this.convertISOStringToDate(item.createdDate),
            updateDate: this.convertISOStringToDate(item.updateDate)
        };
    }
}

export class UserPlanningRepository extends DynamoRepository {
    constructor() {
        super(config.USER_PLANNING_TABLE);
    }

    public async create(userPlanning: Omit<UserPlanning, 'id' | 'transactionDate' | 'expireDate'> & { transactionDate?: Date; expireDate?: Date }): Promise<UserPlanning | null> {
        // Check if UserPlanning with this orderId already exists
        const existing = await this.findByOrderId(userPlanning.orderId);
        if (existing) {
            console.log(`UserPlanning with orderId ${userPlanning.orderId} already exists. Updating with new values.`);
            // Update the existing record with new values (especially isEnable)
            const updatedUserPlanning = {
                ...existing,
                ...userPlanning,
                id: existing.id, // Keep the existing ID
                transactionDate: userPlanning.transactionDate || existing.transactionDate,
                expireDate: userPlanning.expireDate || existing.expireDate
            };
            return await this.update(updatedUserPlanning);
        }

        const id = uuidv4();
        const transactionDate = userPlanning.transactionDate || new Date();
        
        // Calculate expire date (30 days from transaction date by default)
        const expireDate = userPlanning.expireDate || new Date(transactionDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        const userPlanningForDynamo = {
            ...userPlanning,
            id,
            transactionDate: this.convertDateToISOString(transactionDate),
            expireDate: this.convertDateToISOString(expireDate)
        };

        const savingResult = await this.putItem(userPlanningForDynamo);
        if (!savingResult) {
            return null;
        }
        
        console.log(`New UserPlanning created: ${id} for orderId: ${userPlanning.orderId}`);
        return await this.findById(id);
    }

    public async findById(id: string): Promise<UserPlanning | null> {
        const userPlanning = await this.getItem({ id });
        if (!userPlanning) {
            return null;
        }
        return this.convertUserPlanningFromDynamo(userPlanning);
    }

    public async findByUserAndPlanning(userId: string, planningId: string): Promise<UserPlanning | null> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'userId = :userId AND planningId = :planningId',
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':planningId': planningId
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items || result.Items.length === 0) {
                return null;
            }
            
            return this.convertUserPlanningFromDynamo(result.Items[0]);
        } catch (error) {
            console.error('Error finding user planning by userId and planningId:', error);
            return null;
        }
    }

    public async findByOrderId(orderId: string): Promise<UserPlanning | null> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'orderId = :orderId',
                ExpressionAttributeValues: {
                    ':orderId': orderId
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items || result.Items.length === 0) {
                return null;
            }
            
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
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }
            
            return result.Items.map(item => this.convertUserPlanningFromDynamo(item));
        } catch (error) {
            console.error('Error finding user plannings:', error);
            return [];
        }
    }

    public async findActiveByUserId(userId: string): Promise<UserPlanning | null> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'userId = :userId AND isEnable = :isEnable',
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':isEnable': true
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items || result.Items.length === 0) {
                return null;
            }
            
            // Return the most recent active planning
            const sortedItems = result.Items.sort((a, b) => 
                new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
            );
            
            return this.convertUserPlanningFromDynamo(sortedItems[0]);
        } catch (error) {
            console.error('Error finding active user planning:', error);
            return null;
        }
    }

    public async findActiveAndNonExpiredByUserId(userId: string): Promise<UserPlanning | null> {
        try {
            const now = new Date();
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'userId = :userId AND isEnable = :isEnable',
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':isEnable': true
                }
            });

            const result = await dynamoDB.send(command);
            if (!result.Items || result.Items.length === 0) {
                return null;
            }

            // Filter by expiration and get the most recent one
            const activeAndNonExpired = result.Items
                .map(item => this.convertUserPlanningFromDynamo(item))
                .filter(item => item.expireDate && new Date(item.expireDate) > now)
                .sort((a, b) =>
                    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
                );

            return activeAndNonExpired.length > 0 ? activeAndNonExpired[0] : null;
        } catch (error) {
            console.error('Error finding active and non-expired user planning:', error);
            return null;
        }
    }

    public async update(userPlanning: UserPlanning): Promise<UserPlanning | null> {
        const existingUserPlanning = await this.findById(userPlanning.id);
        if (!existingUserPlanning) {
            return null;
        }

        const userPlanningForDynamo = {
            ...userPlanning,
            transactionDate: this.convertDateToISOString(userPlanning.transactionDate),
            expireDate: this.convertDateToISOString(userPlanning.expireDate)
        };

        const savingResult = await this.putItem(userPlanningForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(userPlanning.id);
    }

    private convertUserPlanningFromDynamo(item: any): UserPlanning {
        return {
            ...item,
            transactionDate: this.convertISOStringToDate(item.transactionDate),
            expireDate: this.convertISOStringToDate(item.expireDate)
        };
    }
}