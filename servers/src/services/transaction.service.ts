import { TransactionHistory, TransactionStatus } from '@/models/transaction.model';
import { TransactionRepository } from '@/repositories/transaction.repo';
import logger from '@/libs/logger';

export class TransactionService {
    private readonly transactionRepository: TransactionRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
    }

    public async createTransaction(
        userId: string,
        planningId: string,
        orderId: string,
        amount: number,
        status: TransactionStatus
    ): Promise<TransactionHistory | null> {
        try {
            return await this.transactionRepository.create({
                userId,
                planningId,
                orderId,
                amount,
                status
            });
        } catch (error) {
            logger.error('Error creating transaction:', error);
            throw error;
        }
    }

    public async getTransactionById(id: string): Promise<TransactionHistory | null> {
        return await this.transactionRepository.findById(id);
    }

    public async getUserTransactions(userId: string): Promise<TransactionHistory[]> {
        return await this.transactionRepository.findByUserId(userId);
    }

    public async getTransactionByOrderId(orderId: string): Promise<TransactionHistory | null> {
        return await this.transactionRepository.findByOrderId(orderId);
    }

    public async updateTransactionStatus(
        orderId: string,
        status: TransactionStatus
    ): Promise<TransactionHistory | null> {
        try {
            const transaction = await this.transactionRepository.findByOrderId(orderId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            transaction.status = status;
            return await this.transactionRepository.update(transaction);
        } catch (error) {
            logger.error('Error updating transaction status:', error);
            throw error;
        }
    }

    public async getAllTransactions(): Promise<TransactionHistory[]> {
        return await this.transactionRepository.findAll();
    }
}


