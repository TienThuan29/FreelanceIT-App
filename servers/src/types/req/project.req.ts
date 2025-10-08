import { ProjectStatus, ProjectType } from "@/models/project.model";

export type ProjectCreateRequest = {
    customerId: string;
    title: string;
    projectImage?: Buffer;
    description?: string;
    category?: string;
    requiredSkills?: string[];
    projectTypeId: string;
    budget?: number;
    minBudget?: number;
    maxBudget?: number;
    estimateDuration?: number;
    startDate?: Date;
    endDate?: Date;
    status: ProjectStatus;
    isRemote?: boolean;
    location?: string;
    attachments?: string[];
    views?: number;
}

export type ProjectTypeCreateRequest = {
    name: string;
    createdBy: string; // user id
}

export type AddingUserToProjectRequest = {
    projectId: string;
    userId: string;
}

