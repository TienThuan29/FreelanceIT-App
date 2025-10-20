import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { DeveloperProfile } from "@/models/user.model";

export class DeveloperRepository extends DynamoRepository {
    
    constructor() {
        super(config.DEVELOPER_PROFILE_TABLE);
    }

    public async findByUserId(userId: string): Promise<DeveloperProfile | null> {
        const developerProfile = await this.getItem({ userId });
        if (!developerProfile) {
            return null;
        }
        
        // Convert ISO strings back to Date objects
        const convertedProfile = {
            ...developerProfile,
            createdDate: this.convertISOStringToDate(developerProfile.createdDate),
            updatedDate: this.convertISOStringToDate(developerProfile.updatedDate)
        };
        
        return convertedProfile as DeveloperProfile;
    }

    public async create(userId: string, developerProfile: DeveloperProfile): Promise<DeveloperProfile | null> {
        try {
            const profileData = {
                ...developerProfile,
                userId,
                createdDate: this.convertDateToISOString(new Date()),
                updatedDate: this.convertDateToISOString(new Date()),
            };
            
            const success = await this.putItem(profileData);
            if (!success) {
                console.error('Failed to put item in DynamoDB');
                return null;
            }
            
            return await this.findByUserId(userId);
        } catch (error) {
            console.error('Error creating developer profile:', error);
            return null;
        }
    }

    public async update(userId: string, developerProfile: DeveloperProfile): Promise<DeveloperProfile | null> {
        try {
            // Check if profile exists
            const existingProfile = await this.findByUserId(userId);
            
            if (!existingProfile) {
                // Create new profile if it doesn't exist
                return await this.create(userId, developerProfile);
            }
            
            // Update existing profile - exclude userId from update data since it's the primary key
            const { userId: _, ...profileDataWithoutUserId } = developerProfile;
            const updateData = {
                ...profileDataWithoutUserId,
                updatedDate: this.convertDateToISOString(new Date()),
            };
            
            const updateResult = await this.updateItem({ userId }, updateData as Record<string, any>);
            if (!updateResult) {
                return null;
            }
            
            return await this.findByUserId(userId);
        } catch (error) {
            return null;
        }
    }

    // Explicit method declaration to ensure TypeScript recognition
    public async findById(id: string): Promise<DeveloperProfile | null> {
        return this.findByUserId(id);
    }

    public async findByIds(userIds: string[]): Promise<DeveloperProfile[]> {
        try {
            const profiles: DeveloperProfile[] = [];
            
            // Use batchGet for better performance when possible
            for (const userId of userIds) {
                const profile = await this.findByUserId(userId);
                if (profile) {
                    profiles.push(profile);
                }
            }
            
            return profiles;
        } catch (error) {
            console.error('Error finding developer profiles by IDs:', error);
            return [];
        }
    }

}