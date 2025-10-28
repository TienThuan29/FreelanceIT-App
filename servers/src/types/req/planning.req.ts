import { DetailDevPlanning, DetailCustomerPlanning } from '@/models/planning.model';

export type PlanningCreateRequest = {
    name: string;
    description: string;
    price: number;
    forDeveloper: boolean;
    forCustomer: boolean;
    detailDevPlanning?: DetailDevPlanning;
    detailCustomerPlanning?: DetailCustomerPlanning;
}

export type PlanningUpdateRequest = {
    name?: string;
    description?: string;
    price?: number;
    forDeveloper?: boolean;
    forCustomer?: boolean;
    detailDevPlanning?: DetailDevPlanning;
    detailCustomerPlanning?: DetailCustomerPlanning;
    isDeleted?: boolean;
}

export type PlanningPurchaseRequest = {
    planningId: string;
    orderId: string;
    price: number;
}
