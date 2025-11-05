import { Router } from 'express';
import cassoApi from '../api/casso.api';

const router = Router();

/**
 * Casso Webhook Routes
 * Nhận thông báo từ Casso khi có giao dịch mới
 */

// Webhook endpoint - Casso sẽ gọi endpoint này
router.post('/webhook', (req, res, next) => cassoApi.handleWebhook(req, res, next));

// Test endpoint - Để test webhook integration
router.get('/test', (req, res, next) => cassoApi.testWebhook(req, res, next));

export default router;
