export type Planning = {
    id: string; // UUID
    name: string; // varchar(60)
    description: string; // Text
    price: number; // numeric(38,2)
    dailyLimit: number; // integer
    daysLimit: number; // integer
    aiModel: any; // object - AI model configuration
    isDeleted: boolean; // boolean - soft delete flag
    createdDate: Date; // timestamp
    updateDate: Date; // timestamp
}

// Removed PlanningFeature and DurationType as they're not in the database schema

export type UserPlanning = {
    userId: string; // string (FK to User.id)
    planningId: string; // string (FK to Planning.id)
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
