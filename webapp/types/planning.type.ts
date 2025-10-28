export type Planning = {
    id: string;
    name: string;
    description: string;
    price: number;
    forDeveloper: boolean;
    forCustomer: boolean;
    detailDevPlanning?: DetailDevPlanning;
    detailCustomerPlanning?: DetailCustomerPlanning;
    isDeleted: boolean;
    createdDate: Date;
    updateDate: Date;
}

export type DetailDevPlanning = {
    numberOfJoinedProjects: number;
    numberOfProducts: number;
    useChatbot: boolean;
}

export type DetailCustomerPlanning = {
    numberOfProjects: number;
    useChatbot: boolean;
}

export type PlanningCreate = {
    name: string;
    description: string;
    price: number;
    forDeveloper: boolean;
    forCustomer: boolean;
    detailDevPlanning?: DetailDevPlanning;
    detailCustomerPlanning?: DetailCustomerPlanning;
}

export type PlanningUpdate = {
    name?: string;
    description?: string;
    price?: number;
    forDeveloper?: boolean;
    forCustomer?: boolean;
    detailDevPlanning?: DetailDevPlanning;
    detailCustomerPlanning?: DetailCustomerPlanning;
    isDeleted?: boolean;
}

export type UserPlanning = {
    id: string;
    userId: string;
    planningId: string;
    planning?: Planning;
    orderId: string;
    expireDate: Date;
    transactionDate: Date;
    price: number;
    isEnable: boolean;
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
