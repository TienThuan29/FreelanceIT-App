
export type UserProfileResponse = {
    id?: string;
    email: string;
    fullname: string;
    phone?: string;
    dateOfBirth?: Date;
    role: string; // plain text role
    isEnable: boolean;
    lastLoginDate?: Date;
    createdDate?: Date;
    updatedDate?: Date;
}
