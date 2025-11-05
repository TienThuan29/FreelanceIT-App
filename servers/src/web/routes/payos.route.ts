import { Router } from 'express';
import payosApi from '../api/payos.api';

const router = Router();

/**
 * PayOS Payment Routes
 * Tạo payment link với QR code và xử lý webhook
 */

// Create payment link
router.post('/create-payment', (req, res, next) => payosApi.createPaymentLink(req, res, next));

// Webhook endpoint - PayOS sẽ gọi endpoint này
router.post('/webhook', (req, res, next) => payosApi.handleWebhook(req, res, next));

// Confirm webhook URL với PayOS
router.post('/confirm-webhook', (req, res, next) => payosApi.confirmWebhook(req, res, next));

// Get payment status
router.get('/payment-status/:orderCode', (req, res, next) => payosApi.getPaymentStatus(req, res, next));

// Cancel payment link
router.post('/cancel-payment/:orderCode', (req, res, next) => payosApi.cancelPaymentLink(req, res, next));

// Test endpoint
router.get('/test', (req, res, next) => payosApi.testPayment(req, res, next));

export default router;
