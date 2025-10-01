
export type User = {
    id: string;
    email: string;
    password: string;
    avatarUrl?: string;
    fullname: string;
    phone?: string;
    dateOfBirth?: Date;
    role: Role;
    isEnable: boolean;
    lastLoginDate?: Date;
    createdDate?: Date;
    updatedDate?: Date;
}

export enum Role {
    DEVELOPER = 'DEVELOPER',
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    SYSTEM = 'SYSTEM',
}