import { Request, Response, NextFunction } from 'express';
import { CassoService } from '@/thirdparties/casso.service';
import { ResponseUtil } from '@/libs/response';
import logger from '@/libs/logger';
import { CassoWebhookRequest } from '@/types/req/casso.req';

export class CassoApi {
    private readonly cassoService: CassoService;

    constructor() {
        this.cassoService = new CassoService();
    }

    /**
     * Webhook endpoint để nhận thông báo từ Casso
     * POST /api/casso/webhook
     */
    public async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('Received Casso webhook request');
            
            // Verify webhook signature (optional but recommended)
            const signature = req.headers['x-casso-signature'] as string;
            if (signature) {
                const payload = JSON.stringify(req.body);
                const isValid = this.cassoService.verifyWebhookSignature(signature, payload);
                
                if (!isValid) {
                    logger.error('Invalid Casso webhook signature');
                    ResponseUtil.error(res, 'Invalid signature', 401);
                    return;
                }
            }

            const webhookData: CassoWebhookRequest = req.body;

            // Process webhook
            const result = await this.cassoService.handleWebhook(webhookData);

            if (result.success) {
                ResponseUtil.success(res, result, 'Webhook processed successfully');
            } else {
                const errorMessage = result.errors.length > 0 
                    ? `${result.message}: ${result.errors.join(', ')}` 
                    : result.message;
                ResponseUtil.error(res, errorMessage, 400);
            }
        } catch (error: any) {
            logger.error('Error handling Casso webhook:', error);
            ResponseUtil.error(res, error.message || 'Internal server error', 500);
        }
    }

    /**
     * Test endpoint để kiểm tra Casso webhook integration
     * GET /api/casso/test
     */
    public async testWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            const testData: CassoWebhookRequest = {
                error: 0,
                messages: ['Test webhook'],
                data: [
                    {
                        id: 12595815,
                        tid: 'FT25309477712860',
                        description: 'FT25309477712860395515592231402849TBS41476 - Ma giao dich/ Trace 656400',
                        amount: -25000,
                        when: '2025-11-05 00:00:00',
                        bank_sub_acc_id: '0395515592'
                    }
                ]
            };

            const result = await this.cassoService.handleWebhook(testData);
            ResponseUtil.success(res, result, 'Test webhook executed');
        } catch (error: any) {
            logger.error('Error testing Casso webhook:', error);
            ResponseUtil.error(res, error.message || 'Test failed', 500);
        }
    }
}

export default new CassoApi();
