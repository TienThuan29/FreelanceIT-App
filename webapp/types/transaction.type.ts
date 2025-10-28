export type TransactionHistory = {
    id: string;
    userId: string;
    planningId: string;
    orderId: string;
    amount: number;
    status: TransactionStatus;
    createdDate: Date;
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export type TransactionWithPlanning = TransactionHistory & {
    planning?: {
        id: string;
        name: string;
        description: string;
        price: number;
        forDeveloper: boolean;
        forCustomer: boolean;
    };
}


