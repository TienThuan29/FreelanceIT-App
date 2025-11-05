import { PayOS } from '@payos/node';
import type { 
    CreatePaymentLinkRequest, 
    CreatePaymentLinkResponse,
    PaymentLink
} from '@payos/node';
import { config } from '../configs/config';
import { 
    PayOSCreatePaymentRequest, 
    PayOSWebhookRequest,
    PayOSWebhookData
} from '../types/req/payos.req';
import { TransactionService } from '../services/transaction.service';
import { TransactionStatus } from '../models/transaction.model';
import logger from '../libs/logger';

export class PayOSService {
    private payOS: PayOS;
    private transactionService: TransactionService;

    constructor() {
        // ✅ Khởi tạo PayOS đúng cách với PayOSOptions
        this.payOS = new PayOS({
            clientId: config.PAYOS_CLIENT_ID,
            apiKey: config.PAYOS_API_KEY,
            checksumKey: config.PAYOS_CHECKSUM_KEY,
        });
        
        this.transactionService = new TransactionService();
    }

    /**
     * Tạo payment link với QR code từ request frontend
     */
    async createPaymentLink(paymentRequest: PayOSCreatePaymentRequest): Promise<CreatePaymentLinkResponse> {
        try {
            // Generate unique order code
            const orderCode = this.generateOrderCode();
            
            // Tạo transaction PENDING trong database
            const transaction = await this.transactionService.createTransaction(
                paymentRequest.userId,
                paymentRequest.planningId,
                orderCode.toString(), // orderId
                paymentRequest.amount,
                TransactionStatus.PENDING
            );

            if (!transaction) {
                throw new Error('Failed to create transaction in database');
            }

            // Prepare PayOS payment data
            // PayOS yêu cầu description tối đa 25 ký tự
            const shortDescription = paymentRequest.description.length > 25 
                ? paymentRequest.description.substring(0, 22) + '...' 
                : paymentRequest.description;

            // Append orderCode to return URL for frontend to verify payment
            const returnUrl = paymentRequest.returnUrl || config.PAYOS_RETURN_URL;
            const returnUrlWithParams = `${returnUrl}/payos-success?orderCode=${orderCode}`;

            const paymentData: CreatePaymentLinkRequest = {
                orderCode: orderCode,
                amount: this.formatAmount(paymentRequest.amount),
                description: shortDescription, // Giới hạn 25 ký tự
                returnUrl: returnUrlWithParams, // Redirect to PayOS success page
                cancelUrl: paymentRequest.cancelUrl || config.PAYOS_CANCEL_URL,
                items: [{
                    name: paymentRequest.description, // Item name có thể dài hơn
                    quantity: 1,
                    price: this.formatAmount(paymentRequest.amount),
                }],
            };

            // Gọi PayOS SDK để tạo payment link
            const paymentLinkRes = await this.payOS.paymentRequests.create(paymentData);

            logger.info('PayOS payment link created:', {
                orderCode: paymentLinkRes.orderCode,
                paymentLinkId: paymentLinkRes.paymentLinkId,
                transactionOrderId: transaction.orderId,
            });

            return paymentLinkRes;
        } catch (error: any) {
            logger.error('PayOS createPaymentLink error:', error);
            throw new Error(`Failed to create payment link: ${error.message}`);
        }
    }

    /**
     * Lấy thông tin payment link theo orderCode
     */
    async getPaymentStatus(orderCode: number): Promise<PaymentLink> {
        try {
            const paymentInfo = await this.payOS.paymentRequests.get(orderCode);
            return paymentInfo;
        } catch (error: any) {
            logger.error('PayOS getPaymentStatus error:', error);
            throw new Error(`Failed to get payment info: ${error.message}`);
        }
    }

    /**
     * Hủy payment link
     */
    async cancelPaymentLink(orderCode: number, cancellationReason?: string): Promise<PaymentLink> {
        try {
            const result = await this.payOS.paymentRequests.cancel(orderCode, cancellationReason);
            
            // Cập nhật transaction status trong database
            await this.transactionService.updateTransactionStatus(
                orderCode.toString(),
                TransactionStatus.CANCELLED
            );
            
            return result;
        } catch (error: any) {
            logger.error('PayOS cancelPaymentLink error:', error);
            throw new Error(`Failed to cancel payment: ${error.message}`);
        }
    }

    /**
     * Verify webhook từ PayOS
     */
    async verifyWebhook(webhook: any): Promise<any> {
        try {
            // Sử dụng PayOS SDK để verify webhook
            const verifiedData = await this.payOS.webhooks.verify(webhook);
            return verifiedData;
        } catch (error) {
            logger.error('PayOS webhook verification error:', error);
            throw error;
        }
    }

    /**
     * Xử lý webhook data từ PayOS
     */
    async handleWebhook(webhookRequest: PayOSWebhookRequest): Promise<{
        success: boolean;
        message: string;
        orderCode?: number;
    }> {
        try {
            const webhookData = webhookRequest.data;
            
            logger.info('Processing PayOS webhook:', {
                orderCode: webhookData.orderCode,
                code: webhookData.code,
                desc: webhookData.desc,
            });

            // Map PayOS status sang internal status
            let transactionStatus: TransactionStatus = TransactionStatus.PENDING;
            
            if (webhookData.code === '00') {
                transactionStatus = TransactionStatus.SUCCESS;
            } else if (webhookData.code === '01') {
                transactionStatus = TransactionStatus.CANCELLED;
            } else {
                transactionStatus = TransactionStatus.FAILED;
            }

            // Cập nhật transaction trong database
            await this.transactionService.updateTransactionStatus(
                webhookData.orderCode.toString(),
                transactionStatus
            );

            return {
                success: true,
                message: 'Webhook processed successfully',
                orderCode: webhookData.orderCode,
            };
        } catch (error: any) {
            logger.error('PayOS handleWebhook error:', error);
            return {
                success: false,
                message: error.message || 'Failed to process webhook',
            };
        }
    }

    /**
     * Generate order code (số nguyên dương, tối đa 9 chữ số)
     */
    generateOrderCode(): number {
        // Tạo số nguyên từ timestamp (bỏ 3 số cuối để đảm bảo < 9 chữ số)
        const timestamp = Math.floor(Date.now() / 1000);
        const random = Math.floor(Math.random() * 1000);
        const orderCode = parseInt(`${timestamp}${random}`.slice(0, 9));
        return orderCode;
    }

    /**
     * Format amount (PayOS yêu cầu số nguyên, đơn vị VND)
     */
    formatAmount(amount: number): number {
        return Math.round(amount);
    }

    /**
     * Verify payment status
     */
    async verifyPaymentStatus(orderCode: number): Promise<boolean> {
        try {
            const paymentInfo = await this.getPaymentStatus(orderCode);
            return paymentInfo.status === 'PAID';
        } catch (error) {
            logger.error('PayOS verify payment status error:', error);
            return false;
        }
    }

    /**
     * Confirm webhook URL với PayOS
     */
    async confirmWebhookUrl(webhookUrl: string): Promise<any> {
        try {
            logger.info('Registering webhook URL with PayOS:', webhookUrl);
            const result = await this.payOS.webhooks.confirm(webhookUrl);
            logger.info('Webhook confirmation result:', result);
            return result;
        } catch (error: any) {
            logger.error('PayOS webhook confirmation error:', error);
            throw new Error(`Failed to confirm webhook: ${error.message}`);
        }
    }

    /**
     * Update transaction status khi frontend detect PAID
     */
    async updateTransactionFromPayment(orderCode: number, paymentInfo: any): Promise<void> {
        try {
            logger.info('Updating transaction from payment info:', {
                orderCode,
                status: paymentInfo.status,
                amountPaid: paymentInfo.amountPaid
            });

            // Map PayOS payment status sang TransactionStatus
            let transactionStatus: TransactionStatus = TransactionStatus.PENDING;
            
            if (paymentInfo.status === 'PAID') {
                transactionStatus = TransactionStatus.SUCCESS;
            } else if (paymentInfo.status === 'CANCELLED') {
                transactionStatus = TransactionStatus.CANCELLED;
            } else if (paymentInfo.status === 'EXPIRED') {
                transactionStatus = TransactionStatus.FAILED;
            }

            // Update transaction trong database
            await this.transactionService.updateTransactionStatus(
                orderCode.toString(),
                transactionStatus
            );

            logger.info(`Transaction ${orderCode} updated to ${transactionStatus}`);
        } catch (error: any) {
            logger.error('Error updating transaction from payment:', error);
            throw error;
        }
    }
}

export const payOSService = new PayOSService();
