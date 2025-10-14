export type PlanningCreateRequest = {
    name: string;
    description: string;
    price: number;
    dailyLimit?: number;
    daysLimit?: number;
    aiModel?: any;
}

export type PlanningUpdateRequest = {
    name?: string;
    description?: string;
    price?: number;
    dailyLimit?: number;
    daysLimit?: number;
    aiModel?: any;
    isDeleted?: boolean;
}

export type PlanningPurchaseRequest = {
    planningId: string;
    orderId: string;
    price: number;
}
