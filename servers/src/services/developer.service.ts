import { DeveloperProfile, User } from "@/models/user.model";
import { DeveloperRepository } from "@/repositories/developer.repo";
import { UserRepository } from "@/repositories/user.repo";
import { DeveloperProfileResponse } from "@/types/res/user.res";
import type { UserProfileResponse } from "@/types/res/user.res";
import { mapUserToUserProfileResponse } from "@/libs/mappers/user.mapper";
import { S3Repository } from "@/repositories/s3.repo";

export class DeveloperService {

    private readonly developerRepository: DeveloperRepository;  
    private readonly userRepository: UserRepository;
    private readonly s3Repository: S3Repository;
    
    constructor() {
        this.developerRepository = new DeveloperRepository();
        this.userRepository = new UserRepository();
        this.s3Repository = new S3Repository();
    }

    public async getDeveloperProfile(userId: string): Promise<DeveloperProfileResponse | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }
        const developerProfile = await this.developerRepository.findByUserId(userId);
        const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(user);
        
        // Generate signed URL for avatar if it exists
        if ((userProfile as any).avatarUrl) {
            try {
                const signedUrl = await this.s3Repository.generateSignedUrl((userProfile as any).avatarUrl);
                (userProfile as any).avatarUrl = signedUrl;
            } 
            catch (error) {
                console.error(`Error generating signed URL for avatar ${(userProfile as any).avatarUrl}:`, error);
            }
        }
        
        // Return user profile even if developer profile doesn't exist yet
        return {
            userProfile: userProfile,
            developerProfile: developerProfile || null,
        } as DeveloperProfileResponse;
    }

    public async updateUserAvatar(userId: string, avatarBuffer: Buffer, contentType: string): Promise<DeveloperProfileResponse | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }

        try {
            // Upload avatar to S3
            const avatarPath = await this.s3Repository.uploadFile(avatarBuffer, 'avatars', contentType);
            
            // Update user with new avatar path
            const updatedUser = await this.userRepository.update(userId, { avatarUrl: avatarPath });
            if (!updatedUser) {
                return null;
            }

            const developerProfile = await this.developerRepository.findByUserId(userId);
            const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(updatedUser);
            
            // Generate signed URL for the new avatar
            if ((userProfile as any).avatarUrl) {
                try {
                    const signedUrl = await this.s3Repository.generateSignedUrl((userProfile as any).avatarUrl);
                    (userProfile as any).avatarUrl = signedUrl;
                } catch (error) {
                    console.error(`Error generating signed URL for avatar ${(userProfile as any).avatarUrl}:`, error);
                }
            }
            
            return {
                userProfile: userProfile,
                developerProfile: developerProfile || null,
            } as DeveloperProfileResponse;
        } catch (error) {
            console.error('Error updating user avatar:', error);
            return null;
        }
    }

    public async updateUserProfile(userId: string, userData: Partial<User>): Promise<DeveloperProfileResponse | null> {
        const updatedUser = await this.userRepository.update(userId, userData);
        if (!updatedUser) {
            return null;
        }
        const developerProfile = await this.developerRepository.findByUserId(userId);
        const userProfile: UserProfileResponse = await mapUserToUserProfileResponse(updatedUser);
        
        // Generate signed URL for avatar if it exists
        if ((userProfile as any).avatarUrl) {
            try {
                const signedUrl = await this.s3Repository.generateSignedUrl((userProfile as any).avatarUrl);
                (userProfile as any).avatarUrl = signedUrl;
            } catch (error) {
                console.error(`Error generating signed URL for avatar ${(userProfile as any).avatarUrl}:`, error);
            }
        }
        
        return {
            userProfile: userProfile,
            developerProfile: developerProfile || null,
        } as DeveloperProfileResponse;
    }

    public async updateDeveloperProfile(userId: string, developerProfile: DeveloperProfile): Promise<DeveloperProfileResponse | null> {
        console.log('DeveloperService.updateDeveloperProfile called with userId:', userId);
        console.log('Developer profile data:', developerProfile);
        
        const user = await this.userRepository.findById(userId);
        if (!user) {
            console.error('User not found for userId:', userId);
            return null;
        }
        
        console.log('User found:', user);
        
        try {
            const updatedDeveloperProfile = await this.developerRepository.update(userId, developerProfile);
            if (!updatedDeveloperProfile) {
                console.error('Failed to update developer profile');
                return null;
            }
            
            console.log('Successfully updated developer profile:', updatedDeveloperProfile);
            
            const userProfile = await mapUserToUserProfileResponse(user);
            return {
                userProfile: userProfile,
                developerProfile: updatedDeveloperProfile,
            } as DeveloperProfileResponse;
        } catch (error) {
            console.error('Error in updateDeveloperProfile:', error);
            return null;
        }
    }

}