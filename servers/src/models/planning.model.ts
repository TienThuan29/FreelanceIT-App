export type Planning = {
    id: string;
    name: string;
    description: string; // is string of many description of planning, split by ";"
    price: number; // VND
    forDeveloper: boolean; // if true, this planning is for developer
    forCustomer: boolean; // if true, this planning is for customer
    detailDevPlanning?: DetailDevPlanning;
    detailCustomerPlanning?: DetailCustomerPlanning;
    isDeleted: boolean;
    createdDate: Date;
    updateDate: Date;
}

export type DetailDevPlanning = {
    numberOfJoinedProjects: number; // number of projects that can be managed by this planning
    numberOfProducts: number; // number of products that can be managed by this planning
    useChatbot: boolean; // if true, this planning can use chatbot
}

export type DetailCustomerPlanning = {
    numberOfProjects: number; // number of projects that can be managed by this planning
    useChatbot: boolean; // if true, this planning can use chatbot
}


export type PlanningCreate = {
    name: string;
    description: string;
    price: number;
    forDeveloper: boolean;
    forCustomer: boolean;
    detailDevPlanning?: DetailDevPlanning;
    detailCustomerPlanning?: DetailCustomerPlanning;
    isDeleted: boolean;
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

export type UserPlanningWithDetails = UserPlanning & {
    planning?: Planning;
};
