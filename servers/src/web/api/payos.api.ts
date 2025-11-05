import { Request, Response, NextFunction } from 'express';
import { PayOSService } from '@/thirdparties/payos.service';
import { ResponseUtil } from '@/libs/response';
import logger from '@/libs/logger';
import { PayOSCreatePaymentRequest, PayOSWebhookData } from '@/types/req/payos.req';

export class PayOSApi {
    private readonly payOSService: PayOSService;

    constructor() {
        this.payOSService = new PayOSService();
    }

    /**
     * Tạo payment link với QR code
     * POST /api/v1/payos/create-payment
     */
    public async createPaymentLink(req: Request, res: Response, next: NextFunction) {
        try {
            const paymentRequest: PayOSCreatePaymentRequest = req.body;

            // Validate request
            if (!paymentRequest.userId || !paymentRequest.planningId || !paymentRequest.amount) {
                ResponseUtil.error(res, 'Missing required fields: userId, planningId, amount', 400);
                return;
            }

            if (paymentRequest.amount <= 0) {
                ResponseUtil.error(res, 'Amount must be greater than 0', 400);
                return;
            }

            const paymentResponse = await this.payOSService.createPaymentLink(paymentRequest);

            ResponseUtil.success(res, paymentResponse, 'Payment link created successfully');
        } catch (error: any) {
            logger.error('Error creating PayOS payment link:', error);
            ResponseUtil.error(res, error.message || 'Failed to create payment link', 500);
        }
    }

    /**
     * Webhook endpoint để nhận thông báo từ PayOS
     * POST /api/v1/payos/webhook
     */
    public async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('=== Received PayOS webhook request ===');
            logger.info('Webhook body:', JSON.stringify(req.body, null, 2));
            logger.info('Webhook headers:', JSON.stringify(req.headers, null, 2));

            const webhook = req.body; // Toàn bộ webhook data (code, desc, success, data, signature)

            // Verify webhook signature bằng PayOS SDK
            try {
                const verifiedData = await this.payOSService.verifyWebhook(webhook);
                
                logger.info('Webhook verified successfully:', verifiedData);
                
                // Process webhook với verified data
                const result = await this.payOSService.handleWebhook({
                    data: verifiedData,
                    signature: webhook.signature
                });

                if (result.success) {
                    logger.info('Webhook processed successfully:', result);
                    ResponseUtil.success(res, result, 'Webhook processed successfully');
                } else {
                    logger.error('Webhook processing failed:', result);
                    ResponseUtil.error(res, result.message, 400);
                }
            } catch (verifyError: any) {
                logger.error('Invalid PayOS webhook signature:', verifyError);
                ResponseUtil.error(res, 'Invalid webhook signature', 401);
            }
        } catch (error: any) {
            logger.error('Error handling PayOS webhook:', error);
            ResponseUtil.error(res, error.message || 'Internal server error', 500);
        }
    }

    /**
     * Lấy thông tin payment status
     * GET /api/v1/payos/payment-status/:orderCode
     */
    public async getPaymentStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderCode } = req.params;

            if (!orderCode) {
                ResponseUtil.error(res, 'Order code is required', 400);
                return;
            }

            const paymentInfo = await this.payOSService.getPaymentStatus(Number(orderCode));

            // Tự động update transaction status nếu PAID
            if (paymentInfo.status === 'PAID') {
                logger.info(`Payment ${orderCode} is PAID, updating transaction status...`);
                
                try {
                    await this.payOSService.updateTransactionFromPayment(Number(orderCode), paymentInfo);
                    logger.info(`Transaction ${orderCode} updated to SUCCESS`);
                } catch (updateError: any) {
                    logger.error(`Failed to update transaction ${orderCode}:`, updateError);
                    // Không throw error, vẫn trả về payment info
                }
            }

            ResponseUtil.success(res, paymentInfo, 'Payment status retrieved successfully');
        } catch (error: any) {
            logger.error('Error getting PayOS payment status:', error);
            ResponseUtil.error(res, error.message || 'Failed to get payment status', 500);
        }
    }

    /**
     * Hủy payment link
     * POST /api/v1/payos/cancel-payment/:orderCode
     */
    public async cancelPaymentLink(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderCode } = req.params;
            const { reason } = req.body;

            if (!orderCode) {
                ResponseUtil.error(res, 'Order code is required', 400);
                return;
            }

            const result = await this.payOSService.cancelPaymentLink(Number(orderCode), reason);

            ResponseUtil.success(res, result, 'Payment link cancelled successfully');
        } catch (error: any) {
            logger.error('Error cancelling PayOS payment link:', error);
            ResponseUtil.error(res, error.message || 'Failed to cancel payment link', 500);
        }
    }

    /**
     * Test endpoint để kiểm tra PayOS integration
     * GET /api/v1/payos/test
     */
    public async testPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const testPaymentRequest: PayOSCreatePaymentRequest = {
                userId: 'test-user-123',
                planningId: 'test-plan-123',
                amount: 10000,
                description: 'Test payment',
            };

            const paymentResponse = await this.payOSService.createPaymentLink(testPaymentRequest);

            ResponseUtil.success(res, paymentResponse, 'Test payment created successfully');
        } catch (error: any) {
            logger.error('Error testing PayOS payment:', error);
            ResponseUtil.error(res, error.message || 'Test failed', 500);
        }
    }

    /**
     * Confirm webhook URL với PayOS
     * POST /api/v1/payos/confirm-webhook
     */
    public async confirmWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            const { webhookUrl } = req.body;

            if (!webhookUrl) {
                ResponseUtil.error(res, 'Webhook URL is required', 400);
                return;
            }

            logger.info('Confirming webhook URL with PayOS:', webhookUrl);

            const result = await this.payOSService.confirmWebhookUrl(webhookUrl);

            ResponseUtil.success(res, result, 'Webhook confirmed successfully');
        } catch (error: any) {
            logger.error('Error confirming webhook:', error);
            ResponseUtil.error(res, error.message || 'Failed to confirm webhook', 500);
        }
    }
}

export default new PayOSApi();
