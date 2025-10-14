
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
    commune: Commune;
    province: Province;
    createdDate?: Date;
    updatedDate?: Date;
}

export type UserProfile = User;

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

// Address types
export type Commune = {
    code: string;
    name: string;
    englishName: string;
    administrativeLevel: string;
    provinceCode: string;
    provinceName: string;
    decree: string;
}

export type Province = {
    code: string;
    name: string;
    englishName: string;
    administrativeLevel: string;
    decree: string;
}

// Developer and Customer Profile types
export type DeveloperProfile = {
    userId: string;
    title?: string;
    bio?: string;
    hourlyRate?: number;
    experienceYears?: number;
    developerLevel?: DeveloperLevel;
    githubUrl?: string;
    linkedinUrl?: string;
    isAvailable?: boolean;
    rating?: number;
    skills?: Skill[];
    totalProjects?: number;
    languages?: string[];   
    timezone?: string;
    cvUrl?: string;
    createdDate?: Date;
    updatedDate?: Date;
};

export type CustomerProfile = {
    userId: string;
    companyName?: string;
    companyWebsite?: string;
    industry?: string;
    companySize?: string;
    taxId?: string;
    houseNumberAndStreet?: string;
    commune: Commune;
    province: Province;
    rating?: number;
    totalProjectsPosted?: number;
};

// Skill types
export type Skill = {
    id: string;
    name: string;
    proficiency: SkillProficiency;
    yearsOfExperience: number;
    createdDate?: Date;
    updatedDate?: Date;
};

export enum SkillProficiency {
    BEGINNER = "Beginner",
    INTERMEDIATE = "Intermediate",
    ADVANCED = "Advanced",
    EXPERT = "Expert"
}

export enum DeveloperLevel {
    JUNIOR = 'JUNIOR',
    MID = 'MID',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
}
