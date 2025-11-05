import { SePayPgClient } from 'sepay-pg-node';
import axios from 'axios';
import { config } from "../configs/config";
import { PlanningService } from "../services/planning.service";
import { TransactionService } from "../services/transaction.service";
import { TransactionStatus } from "../models/transaction.model";
import { CreateSeePayPaymentRequest } from "../types/req/sepay.req";
import logger from "../libs/logger";

export class SeePayService {
  private client: SePayPgClient;
  private planningService: PlanningService;
  private transactionService: TransactionService;
  private successUrl: string;
  private errorUrl: string;
  private cancelUrl: string;

  constructor() {
    if (!config.SEPAY_MERCHANT_ID || !config.SEPAY_SECRET_KEY) {
      logger.warn('SeePay credentials not configured. SeePay service will not work properly.');
    }

    this.client = new SePayPgClient({
      env: (config.SEPAY_ENV as 'sandbox' | 'production') || 'sandbox',
      merchant_id: config.SEPAY_MERCHANT_ID || '',
      secret_key: config.SEPAY_SECRET_KEY || ''
    });

    this.planningService = new PlanningService();
    this.transactionService = new TransactionService();
    this.successUrl = config.SEPAY_SUCCESS_URL || 'http://localhost:3000/planning/pricing/success';
    this.errorUrl = config.SEPAY_ERROR_URL || 'http://localhost:3000/planning/pricing';
    this.cancelUrl = config.SEPAY_CANCEL_URL || 'http://localhost:3000/planning/pricing';

    logger.info('SeePay Service initialized');
    logger.info('Environment:', config.SEPAY_ENV);
    logger.info('Success URL:', this.successUrl);
    logger.info('Error URL:', this.errorUrl);
    logger.info('Cancel URL:', this.cancelUrl);
  }

  async createPayment({ userId, planningId, amount, description }: CreateSeePayPaymentRequest) {
    try {
      // Validate credentials
      if (!config.SEPAY_MERCHANT_ID || !config.SEPAY_SECRET_KEY) {
        throw new Error('SeePay credentials are not configured. Please set SEPAY_MERCHANT_ID and SEPAY_SECRET_KEY in environment variables.');
      }

      // Generate unique order invoice number
      const orderInvoiceNumber = `DH${Date.now()}`;

      logger.info('Creating SeePay payment:', { 
        orderInvoiceNumber, 
        amount, 
        userId, 
        planningId,
        merchantId: config.SEPAY_MERCHANT_ID,
        env: config.SEPAY_ENV
      });

      // Get checkout URL
      let checkoutURL: string;
      try {
        checkoutURL = this.client.checkout.initCheckoutUrl();
        logger.info('SeePay checkout URL generated:', checkoutURL);
      } catch (error: any) {
        logger.error('Error generating SeePay checkout URL:', error);
        throw new Error(`Failed to generate checkout URL: ${error.message}`);
      }

      // Create form fields for one-time payment
      let checkoutFormfields: Record<string, any>;
      try {
        const formFields = this.client.checkout.initOneTimePaymentFields({
          payment_method: 'BANK_TRANSFER',
          order_invoice_number: orderInvoiceNumber,
          order_amount: amount,
          currency: 'VND',
          order_description: description || `Thanh toan don hang ${orderInvoiceNumber}`,
          success_url: `${this.successUrl}?orderId=${orderInvoiceNumber}&planningId=${planningId}&userId=${userId}`,
          error_url: `${this.errorUrl}?orderId=${orderInvoiceNumber}&status=error`,
          cancel_url: `${this.cancelUrl}?orderId=${orderInvoiceNumber}&status=cancel`,
        });
        
        // Convert all values to strings for form submission
        checkoutFormfields = Object.fromEntries(
          Object.entries(formFields).map(([key, value]) => [key, String(value)])
        );
        
        logger.info('SeePay form fields generated:', Object.keys(checkoutFormfields));
      } catch (error: any) {
        logger.error('Error generating SeePay form fields:', error);
        throw new Error(`Failed to generate form fields: ${error.message}`);
      }

      // Create pending transaction
      await this.transactionService.createTransaction(
        userId,
        planningId,
        orderInvoiceNumber,
        amount,
        TransactionStatus.PENDING
      );

      logger.info('SeePay payment created successfully:', { orderInvoiceNumber, checkoutURL });

      return {
        success: true,
        checkoutUrl: checkoutURL,
        formFields: checkoutFormfields,
        orderId: orderInvoiceNumber,
      };
    } catch (error: any) {
      logger.error('Error creating SeePay payment:', error);
      throw error;
    }
  }

  async handleCallback(callbackData: any) {
    console.log("\n========== SeePay Callback Received ==========");
    console.log("Callback from SeePay:", JSON.stringify(callbackData, null, 2));
    console.log("Timestamp:", new Date().toISOString());

    try {
      // Extract order information from callback
      // SeePay will send callback data - structure may vary, adjust based on actual SeePay documentation
      const { order_invoice_number, order_amount, status } = callbackData;
      
      if (!order_invoice_number) {
        logger.error('Missing order_invoice_number in SeePay callback');
        return {
          success: false,
          message: 'Invalid callback data',
        };
      }

      logger.info(`Processing SeePay callback for orderId: ${order_invoice_number}, status: ${status}`);

      // Get transaction by orderId
      const transaction = await this.transactionService.getTransactionByOrderId(order_invoice_number);

      if (!transaction) {
        logger.warn(`Transaction not found for orderId: ${order_invoice_number}`);
        return {
          success: false,
          message: 'Transaction not found',
        };
      }

      // Check if transaction already processed
      if (transaction.status === TransactionStatus.SUCCESS) {
        logger.info(`Transaction already processed for orderId: ${order_invoice_number}`);
        return {
          success: true,
          message: 'Transaction already processed',
          transaction,
        };
      }

      const { userId, planningId } = transaction;

      // Check payment status - adjust based on SeePay status values
      if (status === 'SUCCESS' || status === 'COMPLETED') {
        // Payment successful
        logger.info(`Payment SUCCESS for orderId: ${order_invoice_number}`);

        // Get planning details
        const planning = await this.planningService.getPlanningById(planningId);
        if (!planning) {
          logger.warn(`Planning not found: ${planningId}`);
          
          // Still update transaction status
          await this.transactionService.updateTransactionStatus(
            order_invoice_number,
            TransactionStatus.SUCCESS
          );

          return {
            success: true,
            message: "Test payment processed (planning not found)",
            transaction,
            note: "Planning does not exist - transaction recorded for testing"
          };
        }

        // Create/Update UserPlanning
        const userPlanning = await this.planningService.purchasePlanning(userId, {
          planningId,
          orderId: order_invoice_number,
          price: order_amount || transaction.amount
        });

        // Update transaction status to SUCCESS
        await this.transactionService.updateTransactionStatus(
          order_invoice_number,
          TransactionStatus.SUCCESS
        );

        logger.info(`Thanh toán thành công: user ${userId}, planning ${planningId}, orderId ${order_invoice_number}`);

        return {
          success: true,
          message: "Payment processed successfully",
          transaction,
          userPlanning,
        };
      } else {
        // Payment failed
        logger.warn(`Payment FAILED for orderId: ${order_invoice_number}, status: ${status}`);

        // Update transaction status to FAILED
        await this.transactionService.updateTransactionStatus(
          order_invoice_number,
          TransactionStatus.FAILED
        );

        return {
          success: false,
          message: `Payment failed: ${status}`,
          transaction,
        };
      }
    } catch (error: any) {
      logger.error('Error handling SeePay callback:', error);
      throw error;
    }
  }

  /**
   * Get transaction details by transaction ID
   * See: https://docs.sepay.vn/api-giao-dich.html
   */
  async getTransactionDetails(transactionId: string) {
    try {
      if (!config.SEPAY_API_TOKEN) {
        throw new Error('SeePay API Token is not configured. Please set SEPAY_API_TOKEN in environment variables.');
      }

      const response = await axios.get(
        `${config.SEPAY_API_BASE_URL}/transactions/details/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.SEPAY_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`SeePay transaction details retrieved for ID: ${transactionId}`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting SeePay transaction details for ID ${transactionId}:`, error);
      if (error.response) {
        throw new Error(`SeePay API error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get list of transactions with optional filters
   * See: https://docs.sepay.vn/api-giao-dich.html
   */
  async getTransactionList(filters?: {
    account_number?: string;
    transaction_date_min?: string; // Format: yyyy-mm-dd or yyyy-mm-dd HH:mm:ss
    transaction_date_max?: string;
    since_id?: string;
    limit?: number; // Max 5000, default 5000
    reference_number?: string;
    amount_in?: number;
    amount_out?: number;
  }) {
    try {
      if (!config.SEPAY_API_TOKEN) {
        throw new Error('SeePay API Token is not configured. Please set SEPAY_API_TOKEN in environment variables.');
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const url = `${config.SEPAY_API_BASE_URL}/transactions/list${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${config.SEPAY_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`SeePay transaction list retrieved with ${response.data?.transactions?.length || 0} transactions`);
      return response.data;
    } catch (error: any) {
      logger.error('Error getting SeePay transaction list:', error);
      if (error.response) {
        throw new Error(`SeePay API error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Count transactions with optional filters
   * See: https://docs.sepay.vn/api-giao-dich.html
   */
  async countTransactions(filters?: {
    account_number?: string;
    transaction_date_min?: string;
    transaction_date_max?: string;
    since_id?: string;
  }) {
    try {
      if (!config.SEPAY_API_TOKEN) {
        throw new Error('SeePay API Token is not configured. Please set SEPAY_API_TOKEN in environment variables.');
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const url = `${config.SEPAY_API_BASE_URL}/transactions/count${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${config.SEPAY_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`SeePay transaction count: ${response.data?.count_transactions || 0}`);
      return response.data;
    } catch (error: any) {
      logger.error('Error counting SeePay transactions:', error);
      if (error.response) {
        throw new Error(`SeePay API error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Verify transaction by reference number (used to match payments with orders)
   */
  async verifyTransactionByReference(referenceNumber: string) {
    try {
      const result = await this.getTransactionList({ reference_number: referenceNumber });
      if (result?.transactions && result.transactions.length > 0) {
        return result.transactions[0];
      }
      return null;
    } catch (error: any) {
      logger.error(`Error verifying transaction by reference ${referenceNumber}:`, error);
      throw error;
    }
  }
}

