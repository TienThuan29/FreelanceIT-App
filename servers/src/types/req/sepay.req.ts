export type CreateSeePayPaymentRequest = {
    userId: string;
    planningId: string;
    amount: number;
    description?: string;
}

export type CheckSeePay = {
    orderId: string;
}

