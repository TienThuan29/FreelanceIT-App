import { DeveloperProfile } from "@/models/user.model";

export type UserProfileResponse = {
    id?: string;
    email: string;
    fullname: string;
    phone?: string;
    dateOfBirth?: Date;
    avatarUrl?: string;
    role: string; // plain text role
    isEnable: boolean;
    lastLoginDate?: Date;
    createdDate?: Date;
    updatedDate?: Date;
}

export type DeveloperProfileResponse = {
    userProfile: UserProfileResponse;
    developerProfile: DeveloperProfile | null;
}
