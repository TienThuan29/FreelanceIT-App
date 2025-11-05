/**
 * Casso Webhook Request Types
 * Định nghĩa các kiểu dữ liệu cho webhook từ Casso
 */

export interface CassoWebhookData {
    id: number; // ID giao dịch từ Casso (Mã GD)
    tid: string; // Transaction ID
    description: string; // Mô tả giao dịch (Mô tả)
    amount: number; // Số tiền giao dịch (Giá trị)
    when: string; // Thời gian giao dịch (Ngày diễn ra)
    bank_sub_acc_id: string; // ID tài khoản ngân hàng con
    subAccId?: string; // Sub account ID (optional)
}

export interface CassoWebhookRequest {
    data: CassoWebhookData[];
    error: number; // 0 = success, other = error
    messages: string[];
}

export interface CassoTransactionLookup {
    referenceCode: string; // Mã tham chiếu để tìm kiếm trong DB (từ description)
    amount: number; // Số tiền để xác thực
}
