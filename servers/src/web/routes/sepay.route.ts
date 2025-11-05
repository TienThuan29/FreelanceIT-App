import { Router } from "express";
import sepayApi from "../api/sepay.api";

const router = Router();

router.post("/payment", (req, res, next) => sepayApi.createPayment(req, res, next));

router.post("/callback", (req, res, next) => sepayApi.callback(req, res, next));

// Transaction API endpoints (require API Token)
router.get("/transactions/:transactionId", (req, res, next) => sepayApi.getTransactionDetails(req, res, next));
router.get("/transactions", (req, res, next) => sepayApi.getTransactionList(req, res, next));
router.get("/transactions/count", (req, res, next) => sepayApi.countTransactions(req, res, next));
router.get("/transactions/verify/:referenceNumber", (req, res, next) => sepayApi.verifyTransactionByReference(req, res, next));

// Test endpoint to verify SeePay SDK is working
router.get("/test", (req, res, next) => {
    try {
        const { SePayPgClient } = require('sepay-pg-node');
        const { config } = require('../../configs/config');
        
        const client = new SePayPgClient({
            env: config.SEPAY_ENV || 'sandbox',
            merchant_id: config.SEPAY_MERCHANT_ID || '',
            secret_key: config.SEPAY_SECRET_KEY || ''
        });

        const checkoutURL = client.checkout.initCheckoutUrl();
        
        res.json({
            success: true,
            message: 'SeePay SDK initialized successfully',
            checkoutUrl: checkoutURL,
            merchantId: config.SEPAY_MERCHANT_ID,
            env: config.SEPAY_ENV
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error initializing SeePay SDK',
            error: error.message
        });
    }
});

export default router;

