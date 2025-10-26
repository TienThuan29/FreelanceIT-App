import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { TransactionHistory } from "@/models/transaction-history";
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export class TransactionHistoryRepository extends DynamoRepository {
    constructor() {
        super(config.TRANSACTION_HISTORY_TABLE);
    }

    /** Tạo transaction mới (status PENDING) */
    public async create(transactionHistory: TransactionHistory): Promise<TransactionHistory | null> {
        const now = new Date();
        const itemForDynamo = {
            ...transactionHistory,
            status: transactionHistory.status || 'PENDING',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        const saved = await this.putItem(itemForDynamo);
        if (!saved) return null;

        return await this.findByOrderId(transactionHistory.orderId);
    }

    /** Tìm transaction theo orderId (dùng để idempotent) */
    public async findByOrderId(orderId: string): Promise<TransactionHistory | null> {
    const item: Record<string, any> | null = await this.getItem({ orderId });
    if (!item) return null;

    // map fields sang TransactionHistory
    const transaction: TransactionHistory = {
        id: item.id,
        userId: item.userId,
        orderId: item.orderId,
        amount: Number(item.amount),
        status: item.status,
        paymentTransId: item.paymentTransId,
        payType: item.payType,
        message: item.message,
        paidAt: item.paidAt ? new Date(item.paidAt) : undefined,
    };

    return transaction;
}
    /** Cập nhật trạng thái transaction (SUCCESS / FAILED) */
    public async updateStatus(
        orderId: string,
        status: 'SUCCESS' | 'FAILED',
        paymentTransId?: string,
        message?: string,
        paidAt?: Date
    ): Promise<boolean> {
        const existing = await this.findByOrderId(orderId);
        if (!existing) return false;

        existing.status = status;
        existing.paymentTransId = paymentTransId || existing.paymentTransId;
        existing.message = message || existing.message;
        existing.paidAt = paidAt || (status === 'SUCCESS' ? new Date() : existing.paidAt);

        return await this.putItem(existing);
    }
}
