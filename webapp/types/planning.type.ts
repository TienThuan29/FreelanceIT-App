export type Planning = {
    id: string; // UUID
    name: string; // varchar(60)
    description: string; // Text
    price: number; // numeric(38,2)
    dailyLimit: number; // integer - số requests per day
    daysLimit: number; // integer - thời hạn gói (days)
    aiModel: AiModelConfig; // object - AI model configuration
    isDeleted: boolean; // boolean - soft delete flag
    createdDate: Date; // timestamp
    updateDate: Date; // timestamp
}

export type AiModelConfig = {
    modelType: 'basic' | 'pro' | 'enterprise' | 'developer';
    features: string[];
    maxTokens: number;
    responseTime: 'standard' | 'fast' | 'ultra-fast';
    integrations?: string[];
    languages?: string[];
    customTraining?: boolean;
    sla?: string;
}

export type UserPlanning = {
    userId: string; // string (FK to User.id)
    planningId: string; // string (FK to Planning.id)
    planning?: Planning;
    orderId: string; // varchar(255) - unique order identifier
    transactionDate: Date; // timestamp - when plan was purchased
    price: number; // numeric(38,2) - actual price paid
    isEnable: boolean; // boolean - if this subscription is active
}

export type PlanningPurchaseRequest = {
    planningId: string;
    orderId: string;
    price: number;
}

export type PlanningPaymentResponse = {
    orderId: string;
    payUrl?: string;
    status: string;
    message: string;
}
