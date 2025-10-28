import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { TransactionHistory, TransactionStatus } from "@/models/transaction.model";
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';

export class TransactionRepository extends DynamoRepository {
    constructor() {
        super(config.TRANSACTION_HISTORY_TABLE);
    }

    public async create(transaction: Omit<TransactionHistory, 'id' | 'createdDate'>): Promise<TransactionHistory | null> {
        // First check if transaction with this orderId already exists
        const existing = await this.findByOrderId(transaction.orderId);
        if (existing) {
            console.log(`Transaction with orderId ${transaction.orderId} already exists. Returning existing.`);
            return existing;
        }

        const id = uuidv4();
        const createdDate = new Date();
        
        const transactionForDynamo = {
            ...transaction,
            id,
            createdDate: this.convertDateToISOString(createdDate)
        };

        const savingResult = await this.putItem(transactionForDynamo);
        if (!savingResult) {
            return null;
        }
        
        console.log(`New transaction created: ${id} for orderId: ${transaction.orderId}`);
        return await this.findById(id);
    }

    public async findById(id: string): Promise<TransactionHistory | null> {
        const transaction = await this.getItem({ id });
        if (!transaction) {
            return null;
        }
        return this.convertTransactionFromDynamo(transaction);
    }

    public async findByUserId(userId: string): Promise<TransactionHistory[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }
            
            return result.Items
                .map(item => this.convertTransactionFromDynamo(item))
                .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        } catch (error) {
            console.error('Error finding transactions by userId:', error);
            return [];
        }
    }

    public async findByOrderId(orderId: string): Promise<TransactionHistory | null> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'orderId = :orderId',
                ExpressionAttributeValues: {
                    ':orderId': orderId
                }
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items || result.Items.length === 0) {
                return null;
            }
            
            return this.convertTransactionFromDynamo(result.Items[0]);
        } catch (error) {
            console.error('Error finding transaction by orderId:', error);
            return null;
        }
    }

    public async update(transaction: TransactionHistory): Promise<TransactionHistory | null> {
        const existingTransaction = await this.findById(transaction.id);
        if (!existingTransaction) {
            return null;
        }

        const transactionForDynamo = {
            ...transaction,
            createdDate: this.convertDateToISOString(transaction.createdDate)
        };

        const savingResult = await this.putItem(transactionForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(transaction.id);
    }

    public async findAll(): Promise<TransactionHistory[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName()
            });
            
            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }
            
            return result.Items
                .map(item => this.convertTransactionFromDynamo(item))
                .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        } catch (error) {
            console.error('Error finding all transactions:', error);
            return [];
        }
    }

    private convertTransactionFromDynamo(item: any): TransactionHistory {
        return {
            ...item,
            createdDate: this.convertISOStringToDate(item.createdDate)
        };
    }
}


