export type Project = {
    id: string;
    customerId: string;
    title: string;
    imageUrl?: string;
    description?: string;
    category?: string;
    requiredSkills?: string[];
    projectType: ProjectType;
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
    createdDate?: Date;
    updatedDate?: Date;
};

export type ProjectType = {
    id: string;
    name: string;
    createdBy: string; // user id
    isDeleted: boolean;
    createdDate?: Date;
    updatedDate?: Date;
}

export enum ProjectStatus {
    DRAFT = "DRAFT",
    OPEN_APPLYING = "OPEN_APPLYING",
    CLOSED_APPLYING = "CLOSED_APPLYING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export type ProjectTeam = {
    id: string;
    projectId: string;
    developerId: string;
    isActive: boolean;
    agreedRate?: number;
    contractUrl?: string;
    joinedDate?: Date;
    leftDate?: Date;
};


export type ProjectTimeline = {
    id: string;
    projectId: string;
    title: string;
    meetingUrl: string;
    description?: string;
    meetingDate: Date;
    isDeleted: boolean;
    createdDate: Date;
    updatedDate: Date;
}