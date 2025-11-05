export type TransactionHistory = {
    id: string;
    userId: string;
    planningId: string;
    orderId: string;
    amount: number;
    status: TransactionStatus;
    createdDate: Date;
    // Casso fields
    cassoTransactionId?: string; // ID giao dịch từ Casso (Mã GD từ hình)
    cassoReferenceCode?: string; // Mã tham chiếu từ Casso
    cassoDescription?: string; // Mô tả giao dịch từ Casso
    cassoUpdatedDate?: Date; // Ngày cập nhật từ Casso webhook
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}