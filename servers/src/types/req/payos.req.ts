/**
 * PayOS Payment Request Types
 */

export interface PayOSCreatePaymentRequest {
    userId: string;
    planningId: string;
    amount: number;
    description: string;
    returnUrl?: string;
    cancelUrl?: string;
}

export interface PayOSPaymentLinkData {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber?: string;
    accountName?: string;
    items: PayOSItem[];
    cancelUrl: string;
    returnUrl: string;
    signature?: string;
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
    buyerAddress?: string;
    expiredAt?: number;
}

export interface PayOSItem {
    name: string;
    quantity: number;
    price: number;
}

export interface PayOSCreatePaymentResponse {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;
    qrCode: string;
}

export interface PayOSWebhookData {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId?: string;
    counterAccountBankName?: string;
    counterAccountName?: string;
    counterAccountNumber?: string;
    virtualAccountName?: string;
    virtualAccountNumber?: string;
}

export interface PayOSWebhookRequest {
    data: PayOSWebhookData;
    signature: string;
}

export interface PayOSPaymentStatus {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    status: 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED';
}
