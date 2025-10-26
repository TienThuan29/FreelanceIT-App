export type TransactionHistory = {
    id: string; 
    userId: string; 
    orderId: string; 
    amount: number; 
    status: 'PENDING' | 'SUCCESS' | 'FAILED'; 
    paymentTransId?: string; 
    payType?: string; 
    message?: string; 
    paidAt?: Date; 
}