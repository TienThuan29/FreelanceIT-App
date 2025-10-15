export type CreateMomoPaymentRequest = {
    userId: string;
    planningId: string;
    amount: number;
    orderInfo: string;
}


export type CheckMomo = {
orderId: string;
}