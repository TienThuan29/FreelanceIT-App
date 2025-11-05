import { CassoWebhookRequest, CassoWebhookData } from '@/types/req/casso.req';
import { TransactionService } from '@/services/transaction.service';
import { TransactionStatus } from '@/models/transaction.model';
import logger from '@/libs/logger';
import { config } from '@/configs/config';

export class CassoService {
    private readonly transactionService: TransactionService;
    private readonly cassoSecretKey: string;

    constructor() {
        this.transactionService = new TransactionService();
        this.cassoSecretKey = config.CASSO_SECRET_KEY || '';
    }

    /**
     * Xử lý webhook từ Casso
     * Flow: Casso nhận giao dịch -> Gửi webhook -> Backend xử lý -> Cập nhật DB
     */
    public async handleWebhook(webhookData: CassoWebhookRequest): Promise<{
        success: boolean;
        message: string;
        processedCount: number;
        errors: string[];
    }> {
        try {
            logger.info('Received Casso webhook:', JSON.stringify(webhookData, null, 2));

            if (webhookData.error !== 0) {
                logger.error('Casso webhook error:', webhookData.messages);
                return {
                    success: false,
                    message: 'Casso webhook returned error',
                    processedCount: 0,
                    errors: webhookData.messages
                };
            }

            const transactions = webhookData.data || [];
            let processedCount = 0;
            const errors: string[] = [];

            // Xử lý từng giao dịch
            for (const transaction of transactions) {
                try {
                    await this.processTransaction(transaction);
                    processedCount++;
                } catch (error: any) {
                    logger.error(`Error processing transaction ${transaction.id}:`, error);
                    errors.push(`Transaction ${transaction.id}: ${error.message}`);
                }
            }

            return {
                success: true,
                message: `Processed ${processedCount}/${transactions.length} transactions`,
                processedCount,
                errors
            };
        } catch (error: any) {
            logger.error('Error handling Casso webhook:', error);
            throw error;
        }
    }

    /**
     * Xử lý từng giao dịch từ Casso
     */
    private async processTransaction(cassoTransaction: CassoWebhookData): Promise<void> {
        try {
            // Trích xuất mã tham chiếu từ description
            // Ví dụ description: "MBVCB.11585353907.774783.PLANNING e73cf296e91f4a4e877f..."
            // Hoặc: "FT25309477712860395515592231402849TBS41476 - Ma giao dich/ Trace 656400"
            const referenceCode = this.extractReferenceCode(cassoTransaction.description);
            
            if (!referenceCode) {
                logger.warn(`Could not extract reference code from description: ${cassoTransaction.description}`);
                return;
            }

            logger.info(`Processing Casso transaction: ${cassoTransaction.id}, Reference: ${referenceCode}`);

            // Tìm transaction trong DB theo orderId (reference code)
            const existingTransaction = await this.transactionService.getTransactionByOrderId(referenceCode);

            if (!existingTransaction) {
                logger.warn(`Transaction not found for reference code: ${referenceCode}`);
                return;
            }

            // Kiểm tra số tiền có khớp không
            if (Math.abs(cassoTransaction.amount) !== existingTransaction.amount) {
                logger.warn(`Amount mismatch for transaction ${referenceCode}. Expected: ${existingTransaction.amount}, Got: ${Math.abs(cassoTransaction.amount)}`);
                // Có thể quyết định có cập nhật hay không tùy business logic
            }

            // Chỉ cập nhật nếu transaction đang ở trạng thái PENDING
            if (existingTransaction.status === TransactionStatus.PENDING) {
                // Cập nhật transaction với thông tin từ Casso
                await this.transactionService.updateTransactionFromCasso(
                    referenceCode,
                    TransactionStatus.SUCCESS,
                    {
                        cassoTransactionId: cassoTransaction.id.toString(),
                        cassoReferenceCode: referenceCode,
                        cassoDescription: cassoTransaction.description,
                        cassoUpdatedDate: new Date(cassoTransaction.when)
                    }
                );

                logger.info(`Transaction ${referenceCode} updated to SUCCESS from Casso webhook`);
            } else {
                logger.info(`Transaction ${referenceCode} already processed with status: ${existingTransaction.status}`);
            }
        } catch (error: any) {
            logger.error('Error processing Casso transaction:', error);
            throw error;
        }
    }

    /**
     * Trích xuất mã tham chiếu từ description của Casso
     * Patterns có thể có:
     * - "MBVCB.11585353907.774783.PLANNING e73cf296e91f4a4e877f..."
     * - "FT25309477712860395515592231402849TBS41476 - Ma giao dich/ Trace 656400"
     * - "MOMO-CASHIN-0395515592-OQClzlVuEYBQ-10..."
     */
    private extractReferenceCode(description: string): string | null {
        try {
            // Pattern 1: Tìm orderId từ PayOS (có thể là UUID hoặc format khác)
            // Ví dụ: "PLANNING e73cf296e91f4a4e877f" -> extract UUID
            const planningMatch = description.match(/PLANNING\s+([a-f0-9-]+)/i);
            if (planningMatch) {
                return planningMatch[1];
            }

            // Pattern 2: Mã tham chiếu có định dạng FT + số
            const ftMatch = description.match(/FT(\d+)/);
            if (ftMatch) {
                return ftMatch[0]; // Return full FT25309...
            }

            // Pattern 3: MOMO-CASHIN format
            const momoMatch = description.match(/MOMO-CASHIN-[^-]+-([^-]+)/);
            if (momoMatch) {
                return momoMatch[1];
            }

            // Pattern 4: Tìm bất kỳ chuỗi UUID nào
            const uuidMatch = description.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
            if (uuidMatch) {
                return uuidMatch[0];
            }

            // Pattern 5: Tìm số order ID dài (10-20 chữ số)
            const orderIdMatch = description.match(/\b(\d{10,20})\b/);
            if (orderIdMatch) {
                return orderIdMatch[1];
            }

            return null;
        } catch (error) {
            logger.error('Error extracting reference code:', error);
            return null;
        }
    }

    /**
     * Verify webhook signature từ Casso (nếu có)
     */
    public verifyWebhookSignature(signature: string, payload: string): boolean {
        try {
            if (!this.cassoSecretKey) {
                logger.warn('Casso secret key not configured. Skipping signature verification.');
                return true; // Skip verification if no key configured
            }

            // Implement signature verification logic here
            // Casso thường dùng HMAC SHA256
            const crypto = require('crypto');
            const expectedSignature = crypto
                .createHmac('sha256', this.cassoSecretKey)
                .update(payload)
                .digest('hex');

            return signature === expectedSignature;
        } catch (error) {
            logger.error('Error verifying webhook signature:', error);
            return false;
        }
    }
}
