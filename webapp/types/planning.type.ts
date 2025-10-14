export type Planning = {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: number; // in days
    durationType: DurationType;
    features: PlanningFeature[];
    isActive: boolean;
    maxProjects?: number;
    maxStorage?: number; // in MB
    prioritySupport: boolean;
    createdBy: string; // ADMIN user ID
    createdDate: Date;
    updatedDate: Date;
}

export type PlanningFeature = {
    id: string;
    name: string;
    description?: string;
    isIncluded: boolean;
}

export enum DurationType {
    DAYS = 'DAYS',
    MONTHS = 'MONTHS',
    YEARS = 'YEARS'
}

export type UserPlanning = {
    id: string;
    userId: string;
    planningId: string;
    planning: Planning;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    paymentStatus: PaymentStatus;
    paymentMethod?: string;
    transactionId?: string;
    createdDate: Date;
    updatedDate: Date;
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export type PlanningPurchaseRequest = {
    planningId: string;
    paymentMethod: string;
    transactionId?: string;
}

export type PlanningPaymentResponse = {
    userPlanningId: string;
    payUrl?: string;
    status: string;
    message: string;
}
