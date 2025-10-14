import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { CustomerProfile } from "@/models/user.model";
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class CustomerProfileRepository extends DynamoRepository {

    constructor() {
        super(config.CUSTOMER_PROFILE_TABLE);
    }

    public async create(customerProfile: CustomerProfile): Promise<CustomerProfile | null> {
        const customerProfileForDynamo = {
            ...customerProfile
        };
        
        const savingResult = await this.putItem(customerProfileForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findByUserId(customerProfile.userId);
    }

    public async findByUserId(userId: string): Promise<CustomerProfile | null> {
        const customerProfile = await this.getItem({ userId: userId });
        if (!customerProfile) {
            return null;
        }
        
        return customerProfile as CustomerProfile;
    }

    public async findAll(): Promise<CustomerProfile[]> {
        const command = new ScanCommand({
            TableName: this.getTableName()
        });
        
        const result = await dynamoDB.send(command);
        const customerProfiles = result.Items || [];
        
        return customerProfiles as CustomerProfile[];
    }

    public async update(userId: string, updateData: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
        const existingProfile = await this.findByUserId(userId);
        if (!existingProfile) {
            return null;
        }

        const updatedProfile = {
            ...existingProfile,
            ...updateData
        };

        const updateResult = await this.putItem(updatedProfile);
        if (!updateResult) {
            return null;
        }

        return await this.findByUserId(userId);
    }

    public async delete(userId: string): Promise<boolean> {
        const existingProfile = await this.findByUserId(userId);
        if (!existingProfile) {
            return false;
        }

        return await this.deleteItem({ userId: userId });
    }
}
