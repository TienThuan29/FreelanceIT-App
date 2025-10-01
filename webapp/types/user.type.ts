
export type UserProfile = {
    id: string;
    email: string;
    password: string;
    avatarUrl?: string;
    fullname: string;
    phone?: string;
    dateOfBirth?: Date;
    role: Role; // role is plain text
    isEnable: boolean;
    lastLoginDate?: Date;
    createdDate?: Date;
    updatedDate?: Date;
}

export enum Role {
    DEVELOPER = 'DEVELOPER',
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    SYSTEM = 'SYSTEM'
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    registerSessionId: string;
    email: string;
    password: string;
    fullname: string;
    role: Role;
  }

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};


export interface LoginCredentials {
    email: string;
    password: string;
}


export interface RegisterResponse {
    registerSessionId: string;
    message: string;
}

export interface VerifyCodeRequest {
    registerSessionId: string;
    sixDigitsCode: string;
}

export interface VerifyCodeResponse {
    message: string;
    userProfile?: UserProfile;
    accessToken?: string;
    refreshToken?: string;
}

export interface AuthResponse {
    userProfile: UserProfile;
    accessToken: string;
    refreshToken: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    dataResponse: T;
}
