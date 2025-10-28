import { CheckMomo, CreateMomoPaymentRequest } from "../types/req/momo.req.js";
import axios from "axios";
<<<<<<< HEAD
import crypto from "crypto";
import { config } from "../configs/config";
import { stat } from "fs";
import { PlanningService } from "../services/planning.service";
import { TransactionService } from "../services/transaction.service";
import { TransactionStatus } from "../models/transaction.model";
import logger from "../libs/logger";
=======
import crypto from "crypto";import { UserPlanningRepository } from "@/repositories/userplanning.repo";
import { TransactionHistoryRepository } from "@/repositories/transaction-history.repo";
import { v4 as uuidv4 } from 'uuid';

>>>>>>> ba90fa7b350201624e3fb21cb6722891e583139e

export class MomoService {
  private partnerCode = "MOMO";
  private accessKey = "F8BBA842ECF85";
  private secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  private redirectUrl = config.MOMO_REDIRECT_URL || "http://localhost:3000/planning/pricing/success";
  private ipnUrl = config.MOMO_IPN_URL || "http://localhost:5000/api/v1/momo/callback";
  private planningService: PlanningService;
  private transactionService: TransactionService;

  constructor() {
    this.planningService = new PlanningService();
    this.transactionService = new TransactionService();
    
    logger.info('MoMo Service initialized');
    logger.info('IPN URL:', this.ipnUrl);
    logger.info('Redirect URL:', this.redirectUrl);
  }

  async createPayment({ userId, planningId, amount, orderInfo }: CreateMomoPaymentRequest) {
    const partnerCode = this.partnerCode;
    const accessKey = this.accessKey;
    const secretKey = this.secretKey;
    const redirectUrl = this.redirectUrl;
    const ipnUrl = this.ipnUrl;
    const requestType = "payWithMethod";
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = JSON.stringify({ userId, planningId });
    const autoCapture = true;
    const lang = "vi";
    console.log("Access Key:", accessKey);

    var rawSignature = 
        "accessKey=" + accessKey + 
        "&amount=" + amount + 
        "&extraData=" + extraData + 
        "&ipnUrl=" + ipnUrl + 
        "&orderId=" + orderId + 
        "&orderInfo=" + orderInfo + 
        "&partnerCode=" + partnerCode + 
        "&redirectUrl=" + redirectUrl + 
        "&requestId=" + requestId + 
        "&requestType=" + requestType;
    // console.log("--------------------RAW SIGNATURE----------------");
    // console.log(rawSignature);

    const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
    // console.log("--------------------SIGNATURE----------------")
    // console.log(signature)


    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "FreeLanceIt",
      storeId: "MomoStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature,
    });


    console.log("Request body sending to MoMo:", requestBody);
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      data: requestBody
    }
    let result;
    try {
      result = await axios(options)
      return result.data;
    } catch (error) {
      return { message: "Error connecting to MoMo", error };
    }
  }

  async handleCallback(payload: any) {
    console.log("\n========== MoMo Callback Received ==========");
    console.log("Callback from MoMo:", payload);
    console.log("Timestamp:", new Date().toISOString());

    try {
      const { orderId, amount, extraData, resultCode, message } = payload;
      const { userId, planningId } = JSON.parse(extraData);

<<<<<<< HEAD
      if (resultCode === 0) {
        // Payment successful - save to database
        console.log(`Payment SUCCESS for orderId: ${orderId}`);
        
        // 0. Check if transaction already exists (prevent duplicates)
        console.log(`Checking for existing transaction with orderId: ${orderId}...`);
        const existingTransaction = await this.transactionService.getTransactionByOrderId(orderId);
        if (existingTransaction) {
          console.log(`DUPLICATE DETECTED! Transaction already processed for orderId: ${orderId}`);
          logger.info(`Duplicate callback ignored for orderId: ${orderId}`);
          return { 
            success: true, 
            message: "Transaction already processed", 
            result: payload,
            transaction: existingTransaction,
            note: "Duplicate callback ignored"
          };
        }
        console.log(`No existing transaction found. Proceeding with payment processing...`);
        
        // 1. Get planning details
        const planning = await this.planningService.getPlanningById(planningId);
        if (!planning) {
          logger.warn(`Planning not found: ${planningId} (test mode or invalid planning)`);
          
          // For testing: still create transaction record even if planning doesn't exist
          await this.transactionService.createTransaction(
            userId,
            planningId,
            orderId,
            amount,
            TransactionStatus.SUCCESS
          );
          
          logger.info(`Test payment recorded: user ${userId}, planning ${planningId}, orderId ${orderId}`);
          
          return { 
            success: true, 
            message: "Test payment processed (planning not found)", 
            result: payload,
            note: "Planning does not exist - transaction recorded for testing"
          };
        }
=======

       const now = new Date();
        const transactionHistoryRepo = new TransactionHistoryRepository();
          await transactionHistoryRepo.create({
      id: uuidv4(),
      orderId,
      userId,
      amount,
      status: 'SUCCESS',
      paymentTransId: payload.transId || null,
      payType: payload.payType || null,
      message: "Đã Thanh Toán",
      paidAt: now,
    });

      console.log(payload.body);
      const userPlanningRepo = new UserPlanningRepository();
      await userPlanningRepo.create({
        userId,
        planningId,
        orderId,
        transactionDate: new Date(),
        price: amount,
        isEnable: true
      });

      console.log(`✅ Thanh toán thành công: user ${userId}, planning ${planningId}`);
    } else {
      console.warn(` Thanh toán thất bại: ${payload.message}`);
    }
>>>>>>> ba90fa7b350201624e3fb21cb6722891e583139e

        // 2. Create/Update UserPlanning
        const userPlanning = await this.planningService.purchasePlanning(userId, {
          planningId,
          orderId,
          price: amount
        });

        // 3. Create transaction history with SUCCESS status
        await this.transactionService.createTransaction(
          userId,
          planningId,
          orderId,
          amount,
          TransactionStatus.SUCCESS
        );

        logger.info(`Thanh toán thành công: user ${userId}, planning ${planningId}, orderId ${orderId}`);
        
        return { 
          success: true, 
          message: "Payment processed successfully", 
          result: payload,
          userPlanning 
        };
      } else {
        // Payment failed - save transaction with FAILED status
        const { userId, planningId } = JSON.parse(extraData);
        
        // Check if transaction already exists
        const existingTransaction = await this.transactionService.getTransactionByOrderId(orderId);
        if (existingTransaction) {
          logger.info(`Failed transaction already recorded for orderId: ${orderId}`);
          return { 
            success: false, 
            message: "Transaction already processed", 
            result: payload 
          };
        }
        
        await this.transactionService.createTransaction(
          userId,
          planningId,
          orderId,
          amount,
          TransactionStatus.FAILED
        );

        logger.warn(`Thanh toán thất bại: ${message}`);
        
        return { 
          success: false, 
          message: `Payment failed: ${message}`, 
          result: payload 
        };
      }
    } catch (error: any) {
      logger.error('Error handling MoMo callback:', error);
      throw error;
    }
  }


  async getTransactionStatus(orderId: string) {


    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    const signature = crypto.createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi'
    });

    console.log("Request body for transaction status:", requestBody);

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      data: requestBody
    }
    let result;
    try {
      result = await axios(options)
      return result.data;
    } catch (error) {
      return { message: "Error connecting to MoMo", error };
    }
  };
}

