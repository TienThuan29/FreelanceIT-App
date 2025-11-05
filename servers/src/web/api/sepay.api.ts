import { Request, Response, NextFunction } from "express";
import { SeePayService } from "../../thirdparties/sepay.service";
import { ResponseUtil } from "@/libs/response";
import logger from "@/libs/logger";

class SeePayApi {
    private seePayService: SeePayService;

    constructor() {
        this.seePayService = new SeePayService();
    }

    async createPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.seePayService.createPayment(req.body);
            ResponseUtil.success(res, result, 'Tạo thanh toán SeePay thành công');
        } catch (error: any) {
            logger.error("Error in createPayment:", error);
            ResponseUtil.error(res, error.message || 'Lỗi tạo thanh toán', 500);
        }
    }

    async callback(req: Request, res: Response, next: NextFunction) {
        console.log("SeePay Callback request:", req.body);
        try {
            const result = await this.seePayService.handleCallback(req.body);
            if (result.success) {
                ResponseUtil.success(res, result, 'Callback xử lý thành công');
            } else {
                ResponseUtil.error(res, result.message || 'Lỗi xử lý callback', 400);
            }
        } catch (error: any) {
            logger.error("SeePay callback error:", error);
            ResponseUtil.error(res, 'Lỗi xử lý callback', 500);
        }
    }

    async getTransactionDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { transactionId } = req.params;
            if (!transactionId) {
                ResponseUtil.error(res, 'Transaction ID is required', 400);
                return;
            }
            const result = await this.seePayService.getTransactionDetails(transactionId);
            ResponseUtil.success(res, result, 'Lấy chi tiết giao dịch thành công');
        } catch (error: any) {
            logger.error("SeePay getTransactionDetails error:", error);
            ResponseUtil.error(res, error.message || 'Lỗi lấy chi tiết giao dịch', 500);
        }
    }

    async getTransactionList(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = {
                account_number: req.query.account_number as string,
                transaction_date_min: req.query.transaction_date_min as string,
                transaction_date_max: req.query.transaction_date_max as string,
                since_id: req.query.since_id as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                reference_number: req.query.reference_number as string,
                amount_in: req.query.amount_in ? parseFloat(req.query.amount_in as string) : undefined,
                amount_out: req.query.amount_out ? parseFloat(req.query.amount_out as string) : undefined,
            };

            // Remove undefined values
            Object.keys(filters).forEach(key => {
                if (filters[key as keyof typeof filters] === undefined) {
                    delete filters[key as keyof typeof filters];
                }
            });

            const result = await this.seePayService.getTransactionList(filters);
            ResponseUtil.success(res, result, 'Lấy danh sách giao dịch thành công');
        } catch (error: any) {
            logger.error("SeePay getTransactionList error:", error);
            ResponseUtil.error(res, error.message || 'Lỗi lấy danh sách giao dịch', 500);
        }
    }

    async countTransactions(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = {
                account_number: req.query.account_number as string,
                transaction_date_min: req.query.transaction_date_min as string,
                transaction_date_max: req.query.transaction_date_max as string,
                since_id: req.query.since_id as string,
            };

            // Remove undefined values
            Object.keys(filters).forEach(key => {
                if (filters[key as keyof typeof filters] === undefined) {
                    delete filters[key as keyof typeof filters];
                }
            });

            const result = await this.seePayService.countTransactions(filters);
            ResponseUtil.success(res, result, 'Đếm số lượng giao dịch thành công');
        } catch (error: any) {
            logger.error("SeePay countTransactions error:", error);
            ResponseUtil.error(res, error.message || 'Lỗi đếm số lượng giao dịch', 500);
        }
    }

    async verifyTransactionByReference(req: Request, res: Response, next: NextFunction) {
        try {
            const { referenceNumber } = req.params;
            if (!referenceNumber) {
                ResponseUtil.error(res, 'Reference number is required', 400);
                return;
            }
            const result = await this.seePayService.verifyTransactionByReference(referenceNumber);
            ResponseUtil.success(res, result, result ? 'Tìm thấy giao dịch' : 'Không tìm thấy giao dịch');
        } catch (error: any) {
            logger.error("SeePay verifyTransactionByReference error:", error);
            ResponseUtil.error(res, error.message || 'Lỗi xác minh giao dịch', 500);
        }
    }
}

export default new SeePayApi();

