export type ProjectApplication = {
    id: string;
    projectId: string;
    developerId: string;
    coverLetter?: string;
    expectedRate?: number;
    deliveryTime?: number;
    rating?: number;
    status: ApplicationStatus;
    appliedDate?: Date;
    reviewedDate?: Date;
    notes?: string;
    createdDate?: Date;
    updatedDate?: Date;
};

export enum ApplicationStatus {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED"
}