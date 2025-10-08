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
            console.log('Creating developer profile for userId:', userId);
            console.log('Profile data:', developerProfile);
            console.log('Table name:', this.getTableName());
            
            const profileData = {
                ...developerProfile,
                userId,
                createdDate: this.convertDateToISOString(new Date()),
                updatedDate: this.convertDateToISOString(new Date()),
            };
            
            console.log('Final profile data to save:', profileData);
            
            const success = await this.putItem(profileData);
            if (!success) {
                console.error('Failed to put item in DynamoDB');
                return null;
            }
            
            console.log('Successfully created developer profile');
            return await this.findByUserId(userId);
        } catch (error) {
            console.error('Error creating developer profile:', error);
            return null;
        }
    }

    public async update(userId: string, developerProfile: DeveloperProfile): Promise<DeveloperProfile | null> {
        try {
            console.log('Updating developer profile for userId:', userId);
            console.log('Profile data:', developerProfile);
            
            // Check if profile exists
            const existingProfile = await this.findByUserId(userId);
            console.log('Existing profile:', existingProfile);
            
            if (!existingProfile) {
                console.log('Profile does not exist, creating new one');
                // Create new profile if it doesn't exist
                return await this.create(userId, developerProfile);
            }
            
            console.log('Profile exists, updating existing one');
            // Update existing profile
            const updateData = {
                ...developerProfile,
                updatedDate: this.convertDateToISOString(new Date()),
            };
            
            console.log('Update data:', updateData);
            
            const updateResult = await this.updateItem({ userId }, updateData as Record<string, any>);
            if (!updateResult) {
                console.error('Failed to update item in DynamoDB');
                return null;
            }
            
            console.log('Successfully updated developer profile');
            return await this.findByUserId(userId);
        } catch (error) {
            console.error('Error updating developer profile:', error);
            return null;
        }
    }

    // Explicit method declaration to ensure TypeScript recognition
    public async findById(id: string): Promise<DeveloperProfile | null> {
        return this.findByUserId(id);
    }

}