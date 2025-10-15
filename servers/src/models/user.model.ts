import { Commune, Province } from "./address.model";

export type User = {
    id: string;
    email: string;
    password: string;
    avatarUrl?: string;
    avatar?: string;
    fullname: string;
    phone?: string;
    dateOfBirth?: Date;
    role: Role;
    isEnable: boolean;
    lastLoginDate?: Date;
    commune: Commune;
    province: Province;
    googleId?: string;
    createdDate?: Date;
    updatedDate?: Date;
}

export type DeveloperProfile = {
    userId: string; // this is id of developer profile
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

export enum Role {
    DEVELOPER = 'DEVELOPER',
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    SYSTEM = 'SYSTEM',
}